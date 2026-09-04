"""
backend/documents/services/pdf_extractor.py

Pipeline:
    PDF
     |
     v
  pypdf tries native text extraction
     |
     v
  Is that text TRUSTWORTHY? (not just "long enough", but not garbled)
     |                |
    YES              NO
     |                |
  use it        pypdfium2 renders page -> image
                       |
                       v
                 ocr.py (preprocess + Tesseract)
                       |
                       v
                    OCR text
"""
import re
import pypdf
import pypdfium2 as pdfium

from .ocr import extract_text_from_image

# Real Devanagari Unicode block. If Hindi content exists on a page,
# genuine extracted text MUST contain characters in this range.
DEVANAGARI_RANGE = re.compile(r"[\u0900-\u097F]")

# A rough signal that a "PDF" might contain Hindi content at all —
# many Indian government forms mix English labels with Hindi content,
# so we check loosely rather than requiring purely Hindi.
# This is intentionally permissive: false positives just mean we OCR
# a page that maybe didn't need it (safe), false negatives mean we
# trust garbled text (unsafe) -- so we lean toward OCR-ing more.


def _looks_garbled(text: str) -> bool:
    """
    Detect the specific failure mode found in testing:
    legacy non-Unicode Hindi fonts (Kruti Dev, DevLys, Chanakya, etc.)
    store scrambled ASCII/Latin codepoints instead of real Unicode
    Devanagari. pypdf extracts these faithfully -- producing text
    that LOOKS long enough to "count" but is actually meaningless,
    e.g. "Th749. 1 TRITE Ri-qM WI a c 1".

    Heuristic: if the text contains a high density of unusual
    character sequences (lots of isolated short "words" full of mixed
    case, digits, and symbols jammed together) but essentially zero
    real Devanagari characters, treat it as garbled and untrustworthy.
    """
    if not text.strip():
        return True

    has_devanagari = bool(DEVANAGARI_RANGE.search(text))

    # Count "suspicious" tokens: short fragments with a weird mix of
    # letters/numbers/punctuation, typical of scrambled font output.
    tokens = text.split()
    if not tokens:
        return True

    suspicious = 0
    for tok in tokens:
        # A token that's short, has mixed case AND digits/punctuation
        # jammed together is a red flag (e.g. "Ri-qM", "c 1", "319.")
        has_letter = any(c.isalpha() for c in tok)
        has_digit_or_punct = any((not c.isalnum()) for c in tok)
        if has_letter and has_digit_or_punct and len(tok) <= 8:
            suspicious += 1

    suspicious_ratio = suspicious / len(tokens)

    # If there's a meaningful amount of text, no real Devanagari at
    # all, AND a high ratio of suspicious short fragments -> garbled.
    if not has_devanagari and suspicious_ratio > 0.15 and len(tokens) > 15:
        return True

    return False


def extract_native_text(file_path: str) -> str:
    """Extract whatever embedded text pypdf can find, per page."""
    reader = pypdf.PdfReader(file_path)
    pages_text = [page.extract_text() or "" for page in reader.pages]
    return "\n".join(pages_text)


def ocr_pdf(file_path: str, lang: str = "eng+hin") -> str:
    """Render every page as an image and run it through OCR."""
    pdf = pdfium.PdfDocument(file_path)
    all_text = []
    for page in pdf:
        bitmap = page.render(scale=2)
        pil_image = bitmap.to_pil()
        text = extract_text_from_image(pil_image, lang=lang)
        all_text.append(text)
    return "\n".join(all_text)


def extract_text_from_pdf(
    file_path: str,
    min_chars_threshold: int = 20,
) -> dict:
    """
    Main entry point. Returns a dict with the extracted text AND
    which method was used, so you can see what happened per document
    during testing instead of guessing.
    """
    native_text = extract_native_text(file_path)

    long_enough = len(native_text.strip()) >= min_chars_threshold
    trustworthy = long_enough and not _looks_garbled(native_text)

    if trustworthy:
        return {
            "text": native_text,
            "method": "native (pypdf)",
            "native_text_len": len(native_text.strip()),
        }

    ocr_text = ocr_pdf(file_path)
    return {
        "text": ocr_text,
        "method": "ocr (pypdfium2 + tesseract)",
        "native_text_len": len(native_text.strip()),
        "native_text_was_garbled": long_enough and not trustworthy,
    }