r"""
backend/documents/services/pdf_extractor.py

PDF extraction pipeline:

                    PDF
                     |
            ┌────────┴────────┐
            │                 │
         pypdf           pypdfium2
       text layer         rendering
            │                 │
            ▼                 ▼
      native text          image
            │                 │
       enough text?       OpenCV
        /       \             │
      YES        NO       Tesseract
       │          \           │
       │           └───────────┘
       │                 │
       └────────┬────────┘
                ▼
             text
"""

from __future__ import annotations

from typing import Any

import pypdf
import pypdfium2 as pdfium

from .ocr import extract_text_with_confidence


DEFAULT_LANGUAGE = "eng+hin"


def native_text_is_usable(
    text: str,
    min_characters: int = 20,
) -> bool:
    """
    Decide whether the native pypdf extraction contains enough
    meaningful text to use without OCR.

    We intentionally do NOT use the previous _looks_garbled()
    heuristic here. Real government PDFs can have unusual font
    encodings while still containing a large amount of useful text.
    """

    if not text:
        return False

    stripped = text.strip()

    if len(stripped) < min_characters:
        return False

    meaningful_characters = sum(
        1
        for character in stripped
        if character.isalnum()
    )

    return meaningful_characters >= min_characters


def extract_native_text_from_page(
    page: Any,
) -> str:
    """
    Extract embedded text from a pypdf page.
    """

    return page.extract_text() or ""


def render_pdfium_page(
    page: Any,
    scale: float = 2.0,
):
    """
    Render a pypdfium2 page into a PIL image.
    """

    bitmap = page.render(scale=scale)

    return bitmap.to_pil()


def extract_page(
    pypdf_page: Any,
    pdfium_page: Any,
    page_number: int,
    min_native_characters: int = 20,
    language: str = DEFAULT_LANGUAGE,
) -> dict[str, Any]:
    """
    Process one PDF page.

    IMPORTANT:
    pypdf_page is used for native text extraction.
    pdfium_page is used ONLY for rendering when OCR is needed.
    """

    # ---------------------------------------------------------
    # STEP 1: Try native extraction with pypdf
    # ---------------------------------------------------------

    native_text = extract_native_text_from_page(
        pypdf_page
    )

    if native_text_is_usable(
        native_text,
        min_characters=min_native_characters,
    ):
        return {
            "page_number": page_number,
            "method": "native",
            "text": native_text,
            "native_text_length": len(
                native_text.strip()
            ),
            "ocr_confidence": None,
            "ocr_words_detected": None,
        }

    # ---------------------------------------------------------
    # STEP 2: Native text unavailable/insufficient
    # Render the page using pypdfium2
    # ---------------------------------------------------------

    image = render_pdfium_page(
        pdfium_page,
        scale=2.0,
    )

    # ---------------------------------------------------------
    # STEP 3: OCR with preprocessing + Tesseract
    # ---------------------------------------------------------

    ocr_result = extract_text_with_confidence(
        image,
        lang=language,
        preprocess=True,
        psm=3,
    )

    return {
        "page_number": page_number,
        "method": "ocr",
        "text": ocr_result["text"],
        "native_text_length": len(
            native_text.strip()
        ),
        "ocr_confidence": ocr_result[
            "average_confidence"
        ],
        "ocr_words_detected": ocr_result[
            "words_detected"
        ],
    }


def extract_text_from_pdf(
    file_path: str,
    min_native_characters: int = 20,
    language: str = DEFAULT_LANGUAGE,
) -> dict[str, Any]:
    """
    Main PDF extraction function.

    Each page is evaluated independently.

    This allows mixed PDFs such as:

        Page 1 -> native
        Page 2 -> native
        Page 3 -> OCR
        Page 4 -> OCR
        Page 5 -> native

    Returns:
        {
            "text": "...",
            "method": "native" | "ocr" | "mixed",
            "page_count": int,
            "pages": [...],
            "native_text_len": int,
            "average_ocr_confidence": float | None
        }
    """

    # ---------------------------------------------------------
    # Open PDF with pypdf
    # ---------------------------------------------------------

    reader = pypdf.PdfReader(
        file_path
    )

    # ---------------------------------------------------------
    # Open same PDF with pypdfium2
    # Used only for page rendering.
    # ---------------------------------------------------------

    pdf = pdfium.PdfDocument(
        file_path
    )
    try:

        page_results: list[dict[str, Any]] = []
        text_parts: list[str] = []

        # ---------------------------------------------------------
        # Process every page using BOTH corresponding page objects
        # ---------------------------------------------------------

        for index, pypdf_page in enumerate(
            reader.pages
        ):
            pdfium_page = pdf[index]

            result = extract_page(
                pypdf_page=pypdf_page,
                pdfium_page=pdfium_page,
                page_number=index + 1,
                min_native_characters=min_native_characters,
                language=language,
            )

            page_results.append(result)
            text_parts.append(
                result["text"]
            )

        # ---------------------------------------------------------
        # Determine overall extraction method
        # ---------------------------------------------------------

        methods = {
            page["method"]
            for page in page_results
        }

        if methods == {"native"}:
            overall_method = "native"

        elif methods == {"ocr"}:
            overall_method = "ocr"

        else:
            overall_method = "mixed"

        # ---------------------------------------------------------
        # Calculate average OCR confidence
        # ---------------------------------------------------------

        confidences = [
            page["ocr_confidence"]
            for page in page_results
            if page.get("ocr_confidence") is not None
        ]

        if confidences:
            average_ocr_confidence = round(
                sum(confidences) / len(confidences),
                2,
            )
        else:
            average_ocr_confidence = None

        # ---------------------------------------------------------
        # Combine all page text
        # ---------------------------------------------------------

        combined_text = "\n\n".join(
            text_parts
        )

        return {
            "text": combined_text,
            "method": overall_method,
            "page_count": len(page_results),
            "pages": page_results,
            "native_text_len": sum(
                page["native_text_length"]
                for page in page_results
            ),
            "average_ocr_confidence": (
                average_ocr_confidence
            ),
        }
    finally:
        pdf.close()