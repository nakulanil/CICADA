"""
backend/documents/services/ocr.py

Handles: image -> preprocessing -> Tesseract -> text
"""
import cv2
import numpy as np
import pytesseract
from PIL import Image


def preprocess_image(pil_image: Image.Image) -> Image.Image:
    """
    Clean up an image before sending it to Tesseract.
    Real-world documents (phone photos, low-quality scans) benefit
    heavily from this. Clean digital renders are barely affected.

    Steps:
    1. Convert to grayscale (Tesseract works best on grayscale, not color)
    2. Apply adaptive thresholding (turns image into clean black/white,
       correcting for uneven lighting/shadows across the page)
    3. Denoise (removes small speckle noise from scans/photos)
    """
    # Convert PIL Image -> OpenCV format (numpy array, BGR)
    img = np.array(pil_image.convert("RGB"))
    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

    # Step 1: grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Step 2: adaptive threshold (handles uneven lighting better than
    # a single global threshold value would)
    thresh = cv2.adaptiveThreshold(
        gray,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        blockSize=31,
        C=15,
    )

    # Step 3: light denoising
    denoised = cv2.fastNlMeansDenoising(thresh, h=10)

    # Convert back to PIL Image for pytesseract
    return Image.fromarray(denoised)


def extract_text_from_image(
    image: Image.Image,
    lang: str = "eng+hin",
    preprocess: bool = True,
) -> str:
    """
    Run Tesseract OCR on a single image.

    lang="eng+hin" tells Tesseract to look for BOTH languages on the
    same page, which matters for mixed-language Indian documents.
    """
    if preprocess:
        image = preprocess_image(image)

    return pytesseract.image_to_string(image, lang=lang)


def get_tesseract_info() -> dict:
    """
    Quick diagnostic: confirms what Tesseract version and languages
    are actually available on this machine. Useful to run once per
    machine setup, or when something seems off.
    """
    return {
        "version": str(pytesseract.get_tesseract_version()),
        "languages": pytesseract.get_languages(config=""),
    }