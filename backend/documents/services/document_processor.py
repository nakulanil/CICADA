"""
Main M5 document-processing pipeline.

PDF
 ↓
Extraction
 ↓
Native/OCR
 ↓
Text cleaning
 ↓
Metadata extraction
 ↓
Structured processing result
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

from .pdf_extractor import extract_text_from_pdf
from .text_cleaner import clean_extracted_text
from .metadata_extractor import extract_fir_metadata


SUPPORTED_EXTENSIONS = {
    ".pdf", ".jpg", ".jpeg", ".png"
}


def process_document(
    file_path: str,
    language: str = "eng+hin",
) -> dict[str, Any]:
    """
    Process one document completely.
    """

    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(
            f"Document not found: {file_path}"
        )

    extension = path.suffix.lower()

    if extension not in SUPPORTED_EXTENSIONS:
        raise ValueError(
            f"Unsupported file type: {extension}. "
            "Currently supported: PDF, JPG, JPEG, PNG"
        )

    if extension == ".pdf":
        extraction = extract_text_from_pdf(
            str(path),
            language=language,
        )
    else:
        # Image file — go straight to OCR, no native-text step possible
        from PIL import Image
        from .ocr import extract_text_with_confidence

        with Image.open(path) as image:
            ocr_result = extract_text_with_confidence(
                image,
                lang=language,
                preprocess=True,
                psm=3,
            )
        extraction = {
            "text": ocr_result["text"],
            "page_count": 1,
            "method": "ocr",
            "native_text_len": 0,
            "average_ocr_confidence": ocr_result["average_confidence"],
            "pages": [
            {
                "page_number": 1,
                "text": ocr_result["text"],
                "method": "ocr",
                "ocr_confidence": ocr_result["average_confidence"],
            }
            ],
        }

    raw_text = extraction["text"]

    cleaned_text = clean_extracted_text(
        raw_text
    )

    metadata = extract_fir_metadata(
        cleaned_text
    )

    return {
        "filename": path.name,
        "file_type": extension,
        "page_count": extraction["page_count"],
        "extraction_method": extraction["method"],
        "native_text_length": extraction["native_text_len"],
        "average_ocr_confidence": extraction[
            "average_ocr_confidence"
        ],
        "raw_text": raw_text,
        "cleaned_text": cleaned_text,
        "metadata": metadata,
        "pages": extraction["pages"],
        "status": "completed",
    }