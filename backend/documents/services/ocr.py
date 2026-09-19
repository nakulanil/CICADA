"""
backend/documents/services/ocr.py

Image OCR pipeline:

Image
  ↓
PIL Image
  ↓
OpenCV preprocessing
  ↓
Tesseract OCR
  ↓
Text + confidence information
"""

from __future__ import annotations

from statistics import mean
from typing import Any

import cv2
import numpy as np
import pytesseract
from PIL import Image
from pytesseract import Output


DEFAULT_LANGUAGE = "eng+hin"


def preprocess_image(
    pil_image: Image.Image,
    use_threshold: bool = True,
    use_denoising: bool = True,
) -> Image.Image:
    """
    Preprocess an image before OCR.

    Steps:
    1. Convert to RGB.
    2. Convert RGB -> grayscale.
    3. Optional adaptive thresholding.
    4. Optional denoising.

    This is intentionally configurable because not every scan benefits
    from aggressive preprocessing.
    """

    # PIL -> NumPy
    image = np.array(pil_image.convert("RGB"))

    # RGB -> BGR for OpenCV
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    # BGR -> grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    processed = gray

    if use_threshold:
        processed = cv2.adaptiveThreshold(
            processed,
            255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY,
            blockSize=31,
            C=15,
        )

    if use_denoising:
        processed = cv2.fastNlMeansDenoising(
            processed,
            None,
            h=10,
            templateWindowSize=7,
            searchWindowSize=21,
        )

    return Image.fromarray(processed)


def get_tesseract_info():
    """Return the installed Tesseract version and available languages."""

    version = str(pytesseract.get_tesseract_version())
    languages = pytesseract.get_languages(config="")

    return {"version": version, "languages": languages}


def validate_tesseract_languages(
    required_languages: tuple[str, ...] = ("eng", "hin"),
) -> None:
    """
    Raise an error if required Tesseract language packs are missing.
    """

    available = set(pytesseract.get_languages(config=""))

    missing = [
        language
        for language in required_languages
        if language not in available
    ]

    if missing:
        raise RuntimeError(
            "Missing Tesseract language data: "
            + ", ".join(missing)
        )


def extract_text_from_image(
    image: Image.Image,
    lang: str = DEFAULT_LANGUAGE,
    preprocess: bool = True,
    psm: int = 3,
) -> str:
    """
    Extract plain text from an image.

    psm=3:
        Tesseract automatic page segmentation.
    """

    if preprocess:
        image = preprocess_image(image)

    config = f"--psm {psm}"

    return pytesseract.image_to_string(
        image,
        lang=lang,
        config=config,
    )


def extract_text_with_confidence(
    image: Image.Image,
    lang: str = DEFAULT_LANGUAGE,
    preprocess: bool = True,
    psm: int = 3,
) -> dict[str, Any]:
    """
    OCR with word-level confidence information.

    Returns:
        {
            "text": "...",
            "average_confidence": 87.5,
            "words_detected": 123
        }
    """

    if preprocess:
        image = preprocess_image(image)

    config = f"--psm {psm}"

    data = pytesseract.image_to_data(
        image,
        lang=lang,
        config=config,
        output_type=Output.DICT,
    )

    words: list[str] = []
    confidences: list[float] = []

    for text, confidence in zip(
        data["text"],
        data["conf"],
    ):
        text = text.strip()

        try:
            confidence_value = float(confidence)
        except (TypeError, ValueError):
            continue

        if not text:
            continue

        words.append(text)

        # Tesseract can use -1 for non-word regions.
        if confidence_value >= 0:
            confidences.append(confidence_value)

    average_confidence = (
        round(mean(confidences), 2)
        if confidences
        else 0.0
    )

    return {
        "text": " ".join(words),
        "average_confidence": average_confidence,
        "words_detected": len(words),
    }