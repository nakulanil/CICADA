"""
backend/documents/services/metadata_extractor.py

Rule-based metadata extraction for FIR documents.

Phase 1:
- No LLM
- No embeddings
- No AI
- Deterministic extraction
- Conservative rules
"""

from __future__ import annotations

import re
from typing import Optional


DATE_PATTERN = re.compile(
    r"\b\d{2}\.\d{2}\.\d{4}\b"
)

FIR_NUMBER_PATTERN = re.compile(
    r"\bRC[A-Z0-9]{6,}\b",
    re.IGNORECASE,
)


# ============================================================
# GENERAL HELPERS
# ============================================================

def clean_value(value: str) -> str:
    """
    Clean whitespace and obvious extraction noise.
    """

    value = value.replace("\r", "\n")

    value = re.sub(
        r"[ \t]+",
        " ",
        value,
    )

    value = re.sub(
        r"\n+",
        "\n",
        value,
    )

    return value.strip(
        " :;,.|-_\\"
    )


def normalize_spaces(value: str) -> str:
    """
    Convert newlines and repeated spaces into normal spaces.
    """

    return re.sub(
        r"\s+",
        " ",
        value,
    ).strip()


# ============================================================
# FIR NUMBER
# ============================================================

def extract_fir_number(
    text: str,
) -> Optional[str]:
    """
    Examples:

        RC2182026A0014
        RC0482026S0005
    """

    match = FIR_NUMBER_PATTERN.search(text)

    if not match:
        return None

    return match.group(0).upper()


# ============================================================
# YEAR
# ============================================================

def extract_year(
    text: str,
) -> Optional[int]:
    """
    Extract the FIR year.

    Priority:
        1. FIR header
        2. Combined District/PS/Year header
        3. FIR number
    """

    # --------------------------------------------------------
    # Layout:
    #
    # Year: FIR No. Date
    # 2026 RC2182026A0014 27.08.2026
    # --------------------------------------------------------

    match = re.search(
        r"Year\s*:\s*FIR\s*No\.?\s*Date"
        r".{0,100}?"
        r"\b(20\d{2})\b",
        text,
        flags=re.IGNORECASE | re.DOTALL,
    )

    if match:
        return int(match.group(1))

    # --------------------------------------------------------
    # Layout:
    #
    # District PS Year
    # CBI, SC-1, New Delhi 2026
    # --------------------------------------------------------

    match = re.search(
        r"District\s+PS\s+Year"
        r".{0,150}?"
        r"\b(20\d{2})\b",
        text,
        flags=re.IGNORECASE | re.DOTALL,
    )

    if match:
        return int(match.group(1))

    # --------------------------------------------------------
    # Fallback: year from FIR number
    # --------------------------------------------------------

    fir_number = extract_fir_number(text)

    if fir_number:

        match = re.search(
            r"RC\d+(20\d{2})[A-Z]",
            fir_number,
            flags=re.IGNORECASE,
        )

        if match:
            return int(match.group(1))

    return None


# ============================================================
# FIR DATE
# ============================================================

def extract_fir_date(
    text: str,
) -> Optional[str]:
    """
    Extract the FIR registration date.

    Prefer the date immediately following the FIR number.
    """

    fir_match = FIR_NUMBER_PATTERN.search(
        text
    )

    if fir_match:

        nearby = text[
            fir_match.end():
            fir_match.end() + 150
        ]

        match = DATE_PATTERN.search(
            nearby
        )

        if match:
            return match.group(0)

    # Fallback around the FIR header.
    header_match = re.search(
        r"Year\s*:\s*FIR\s*No\.?\s*Date"
        r".{0,200}?",
        text,
        flags=re.IGNORECASE | re.DOTALL,
    )

    if header_match:

        dates = DATE_PATTERN.findall(
            header_match.group(0)
        )

        if dates:
            return dates[-1]

    return None


# ============================================================
# DISTRICT
# ============================================================

def extract_district(
    text: str,
) -> Optional[str]:
    """
    Extract district from FIR header.
    """

    # --------------------------------------------------------
    # Layout 1:
    #
    # District:
    # New Delhi
    # --------------------------------------------------------

    match = re.search(
        r"\bDistrict\s*:\s*\n\s*([^\n]+)",
        text,
        flags=re.IGNORECASE,
    )

    if match:

        value = clean_value(
            match.group(1)
        )

        if value:
            return value

    # --------------------------------------------------------
    # Layout 2:
    #
    # District PS Year
    # CBI, SC-1, New Delhi 2026
    # --------------------------------------------------------

    match = re.search(
        r"District\s+PS\s+Year"
        r"\s+"
        r"CBI,\s*[^,\n]+,\s*"
        r"(.+?)\s+20\d{2}",
        text,
        flags=re.IGNORECASE,
    )

    if match:

        value = clean_value(
            match.group(1)
        )

        if value:
            return value

    return None


# ============================================================
# POLICE STATION
# ============================================================

def extract_police_station(
    text: str,
) -> Optional[str]:
    """
    Extract CBI police station / branch code.

    Examples found in our FIR samples:

        CBI, AC-III
        CBI, SC-1

    pypdf does not always preserve the visual position of
    the PS field, so we search for the CBI branch identifier
    directly instead of relying only on text immediately after
    'PS:'.
    """

    # --------------------------------------------------------
    # Look for CBI branch identifiers.
    #
    # Examples:
    #   CBI, AC-III
    #   CBI, SC-1
    #   CBI, _AC-Ill   <- font/extraction noise
    # --------------------------------------------------------

    matches = re.findall(
        r"\bCBI\s*,?\s*_?\s*"
        r"(AC|SC)"
        r"\s*[-]?\s*"
        r"([A-Za-z0-9IVL]+)",
        text,
        flags=re.IGNORECASE,
    )

    for branch_type, branch_number in matches:

        branch_type = branch_type.upper()

        branch_number = branch_number.upper()

        # Common pypdf font extraction issue:
        # "Ill" may represent "III".
        replacements = {
            "ILL": "III",
            "IL": "II",
            "I": "I",
        }

        branch_number = replacements.get(
            branch_number,
            branch_number,
        )

        return f"CBI, {branch_type}-{branch_number}"

    return None


# ============================================================
# SUSPECTED OFFENCE
# ============================================================

def extract_suspected_offence(
    text: str,
) -> Optional[str]:
    """
    Extract the suspected-offence description.

    Supports both observed layouts:

    Layout A:
        Suspected Offence
        Criminal Conspiracy...
        (b) Day

    Layout B:
        Suspected Offence
        (b) Day
        Personating a Public Servant...
        (c) Information received at PS
    """

    label_match = re.search(
        r"Suspected\s+Offence",
        text,
        flags=re.IGNORECASE,
    )

    if not label_match:
        return None

    nearby = text[
        label_match.end():
        label_match.end() + 1000
    ]

    # --------------------------------------------------------
    # Find the two important boundaries.
    # --------------------------------------------------------

    day_match = re.search(
        r"\(?b\)?\s*Day\b",
        nearby,
        flags=re.IGNORECASE,
    )

    info_match = re.search(
        r"\(?c\)?\s*Information\s+received\s+at\s+PS",
        nearby,
        flags=re.IGNORECASE,
    )

    # --------------------------------------------------------
    # Layout A:
    #
    # Suspected Offence
    # <actual offence>
    # (b) Day
    # --------------------------------------------------------

    if day_match:

        before_day = nearby[
            :day_match.start()
        ]

        lines = [
            clean_value(line)
            for line in before_day.splitlines()
        ]

        candidates = []

        for line in lines:

            if not line:
                continue

            # Must contain English letters.
            if not re.search(
                r"[A-Za-z]",
                line,
            ):
                continue

            # Ignore label fragments.
            if re.fullmatch(
                r"\(?[a-z]\)?",
                line,
                flags=re.IGNORECASE,
            ):
                continue

            candidates.append(line)

        if candidates:

            value = normalize_spaces(
                " ".join(candidates)
            )

            if len(value) >= 20:
                return value

    # --------------------------------------------------------
    # Layout B:
    #
    # (b) Day
    # <actual offence>
    # <noise>
    # (c) Information received at PS
    # --------------------------------------------------------

    if day_match and info_match:

        if info_match.start() > day_match.end():

            offence_region = nearby[
                day_match.end():
                info_match.start()
            ]

            lines = [
                clean_value(line)
                for line
                in offence_region.splitlines()
            ]

            candidates = []

            for line in lines:

                if not line:
                    continue

                if not re.search(
                    r"[A-Za-z]",
                    line,
                ):
                    continue

                # ------------------------------------------------
                # Ignore OCR/layout noise such as:
                #
                # (7) 24-r4-cR...
                # ( ) f
                # (a)
                # ------------------------------------------------

                if re.match(
                    r"^\(?\d+\)?",
                    line,
                ):
                    continue

                if re.match(
                    r"^\(?[a-z]\)?\s*$",
                    line,
                    flags=re.IGNORECASE,
                ):
                    continue

                candidates.append(line)

            if candidates:

                value = normalize_spaces(
                    " ".join(candidates)
                )

                if len(value) >= 20:
                    return value

    return None


# ============================================================
# LEGAL SECTIONS
# ============================================================

def extract_sections(
    text: str,
) -> list[str]:
    """
    Extract legal sections from the FIR header.

    Supports:
        61 (2) r/w 318(4)
        204
        319
        66-D

    The parser is intentionally conservative because FIR
    documents contain many unrelated numbers.
    """

    # --------------------------------------------------------
    # Limit ourselves to the FIR header.
    #
    # Everything after "Suspected Offence" belongs to the
    # rest of the FIR and contains many unrelated numbers.
    # --------------------------------------------------------

    offence_marker = re.search(
        r"\bSuspected\s+Offence\b",
        text,
        flags=re.IGNORECASE,
    )

    if offence_marker:
        header = text[:offence_marker.start()]
    else:
        header = text[:2000]

    results: list[str] = []

    # --------------------------------------------------------
    # 1. Compound legal section
    #
    # Example:
    #
    # 61 (2) r/w 318(4)
    #
    # We look for this FIRST.
    # --------------------------------------------------------

    compound_match = re.search(
        r"\b"
        r"(\d{1,3})"
        r"\s*\(\s*([A-Za-z0-9]+)\s*\)"
        r"\s*r/w\s*"
        r"(\d{1,3})"
        r"\s*\(\s*([A-Za-z0-9]+)\s*\)",
        header,
        flags=re.IGNORECASE,
    )

    if compound_match:

        section = (
            f"{compound_match.group(1)}"
            f"({compound_match.group(2)}) "
            f"r/w "
            f"{compound_match.group(3)}"
            f"({compound_match.group(4)})"
        )

        results.append(section)

        # Important:
        # Do NOT extract its components separately.
        return results

    # --------------------------------------------------------
    # 2. Standalone sections
    #
    # Example:
    #
    # 204
    # 319
    # 66-D
    # --------------------------------------------------------

    # Look only after "Sections" labels.
    section_labels = list(
        re.finditer(
            r"\bSections\b",
            header,
            flags=re.IGNORECASE,
        )
    )

    for label in section_labels:

        # Small area after each section label.
        nearby = header[
            label.end():
            label.end() + 100
        ]

        candidates = re.findall(
            r"\b\d{2,3}(?:\s*-\s*[A-Za-z])?\b",
            nearby,
            flags=re.IGNORECASE,
        )

        for candidate in candidates:

            normalized = re.sub(
                r"\s+",
                "",
                candidate,
            )

            # Ignore years.
            if (
                len(normalized) == 4
                and normalized.startswith("20")
            ):
                continue

            if normalized not in results:
                results.append(normalized)

    return results
# ============================================================
# MAIN ENTRY POINT
# ============================================================

def extract_fir_metadata(
    text: str,
) -> dict:
    """
    Main metadata extraction entry point.
    """

    return {
        "fir_number": extract_fir_number(text),
        "fir_date": extract_fir_date(text),
        "year": extract_year(text),
        "district": extract_district(text),
        "police_station": extract_police_station(text),
        "suspected_offence": extract_suspected_offence(text),
        "sections": extract_sections(text),
    }