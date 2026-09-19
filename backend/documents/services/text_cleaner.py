"""
Text normalization for PDF/native/OCR extracted text.
"""

from __future__ import annotations

import re
import unicodedata


def normalize_unicode(text: str) -> str:
    """
    Normalize Unicode using NFC.

    This is intentionally conservative.
    """

    return unicodedata.normalize("NFC", text)


def normalize_line_endings(text: str) -> str:
    """
    Convert Windows/Mac line endings to '\\n'.
    """

    return text.replace("\r\n", "\n").replace("\r", "\n")


def normalize_horizontal_whitespace(text: str) -> str:
    """
    Clean repeated spaces/tabs without destroying line structure.
    """

    text = re.sub(r"[ \t]+", " ", text)

    text = re.sub(
        r"[ \t]+$",
        "",
        text,
        flags=re.MULTILINE,
    )

    return text


def normalize_blank_lines(text: str) -> str:
    """
    Avoid huge blank regions produced by PDF extraction/OCR.
    """

    return re.sub(r"\n{3,}", "\n\n", text)


def clean_extracted_text(text: str) -> str:
    """
    Main cleaning pipeline.
    """

    text = normalize_unicode(text)
    text = normalize_line_endings(text)
    text = normalize_horizontal_whitespace(text)
    text = normalize_blank_lines(text)

    return text.strip()