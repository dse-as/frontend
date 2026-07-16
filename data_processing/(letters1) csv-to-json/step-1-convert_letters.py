#!/usr/bin/env python3
"""
Convert letters CSV + register.json into a JSON object with the structure:
{
  "letter": {
    "letter_0001": { ... },
    "letter_0002": { ... },
    ...
  }
}
Output keys are sorted alphabetically.
"""

import csv
import json
import re
import sys
from pathlib import Path


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def split_date_range(raw: str | None) -> dict:
    """
    Split date strings into {from, to}.
    Handles:
      - '1938'                  -> {from: '1938',       to: '1938'}
      - '1931-05-09'           -> {from: '1931-05-09',  to: '1931-05-09'}
      - '1938-12-03-1938-12-04'-> {from: '1938-12-03',  to: '1938-12-04'}
      - '1930-07 1930-09'      -> {from: '1930-07',     to: '1930-09'}
      - None / ''              -> {from: null,          to: null}
    """
    if not raw or not raw.strip():
        return {"from": None, "to": None}

    s = raw.strip()

    # Pattern: YYYY-MM-DD-YYYY-MM-DD  (two full dates concatenated by extra hyphen)
    m = re.match(
        r'^(\d{4}-\d{2}-\d{2})-(\d{4}-\d{2}-\d{2})$', s
    )
    if m:
        return {"from": m.group(1), "to": m.group(2)}

    # Pattern: YYYY-MM  YYYY-MM  (two year-month separated by space)
    m = re.match(r'^(\d{4}-\d{2})\s+(\d{4}-\d{2})$', s)
    if m:
        return {"from": m.group(1), "to": m.group(2)}

    # Pattern: YYYY-MM-DD  YYYY-MM-DD  (two full dates separated by space)
    m = re.match(r'^(\d{4}-\d{2}-\d{2})\s+(\d{4}-\d{2}-\d{2})$', s)
    if m:
        return {"from": m.group(1), "to": m.group(2)}

    # Single date (YYYY, YYYY-MM, or YYYY-MM-DD)
    return {"from": s, "to": s}


def clean_person_string(raw: str) -> str:
    """Remove trailing birth/death dates like '(1891-1974)' from a person string."""
    cleaned = re.sub(r'\s*\([^)]*\)\s*$', '', raw.strip())
    return cleaned.strip()


def find_person_key(person_str: str, register_people: dict, cache: dict) -> str | None:
    """
    Match a 'Lastname, Firstname' string to a person key in register.json.
    Uses exact name match first, then nameVariants, then fuzzy substring match.
    Returns the person key or None.
    """
    if not person_str:
        return None

    cleaned = clean_person_string(person_str)

    # Check cache
    if cleaned in cache:
        return cache[cleaned]

    # Try exact 'name' match
    for key, info in register_people.items():
        if info.get("name") and info["name"].strip().lower() == cleaned.lower():
            cache[cleaned] = key
            return key

    # Try nameVariants match
    for key, info in register_people.items():
        for variant in info.get("nameVariants", []):
            if variant.strip().lower() == cleaned.lower():
                cache[cleaned] = key
                return key

    # Try "Lastname, Firstname" -> "Lastname Firstname" flexible match
    def normalize(name: str) -> str:
        return re.sub(r'[\s,]+', ' ', name).strip().lower()

    target = normalize(cleaned)
    for key, info in register_people.items():
        if info.get("name") and normalize(info["name"]) == target:
            cache[cleaned] = key
            return key
        for variant in info.get("nameVariants", []):
            if normalize(variant) == target:
                cache[cleaned] = key
                return key

    # Last resort: substring match (lastname contains check)
    lastname_part = cleaned.split(",")[0].strip() if "," in cleaned else cleaned
    for key, info in register_people.items():
        if info.get("lastname") and lastname_part.lower() in info["lastname"].lower():
            cache[cleaned] = key
            return key

    cache[cleaned] = None
    return None


def parse_people_field(raw: str | None, register_people: dict, cache: dict) -> list[str] | None:
    """
    Parse a semicolon-separated list of 'Lastname, Firstname' strings
    into a list of TPeopleKeys.
    Returns None if input is empty or no matches found.
    """
    if not raw or not raw.strip():
        return None

    parts = [p.strip() for p in raw.split(";")]
    parts = [p for p in parts if p]

    if not parts:
        return None

    keys = []
    for part in parts:
        key = find_person_key(part, register_people, cache)
        if key:
            keys.append(key)
        else:
            print(f"  WARNING: Could not match person '{part}'", file=sys.stderr)

    return keys if keys else None


def cell_or_null(row: dict, col: str) -> str | None:
    """Return stripped cell value or None if empty/missing."""
    val = row.get(col)
    if val is None:
        return None
    val = val.strip()
    return val if val else None


def split_semicolon_list(raw: str | None) -> list[str] | None:
    """Split a semicolon-separated string into a list, or None if empty."""
    if not raw:
        return None
    parts = [p.strip() for p in raw.split(";")]
    parts = [p for p in parts if p]
    return parts if parts else None


# ---------------------------------------------------------------------------
# Build the JSON object
# ---------------------------------------------------------------------------

def convert_csv_to_json(
    csv_path: str,
    register_path: str,
    output_path: str = "letters_output.json",
):
    # Load register
    try:
        with open(register_path, "r", encoding="utf-8") as f:
            register_data = json.load(f)
    except FileNotFoundError:
        print(f"ERROR: Register file '{register_path}' not found.", file=sys.stderr)
        sys.exit(1)

    register_people = register_data.get("register", {}).get("people", {})

    # Person matching cache
    person_cache: dict = {}

    # Read CSV
    try:
        with open(csv_path, "r", encoding="utf-8", newline="") as f:
            reader = csv.DictReader(f)
            rows = list(reader)
    except FileNotFoundError:
        print(f"ERROR: CSV file '{csv_path}' not found.", file=sys.stderr)
        sys.exit(1)

    # We will store tuples (key, letter_dict) to sort later
    letters_data = []

    for row in rows:
        letter_key = cell_or_null(row, "letter_key")
        if not letter_key:
            print("  WARNING: Row without letter_key, skipping", file=sys.stderr)
            continue

        # --- Date ---
        date_raw = cell_or_null(row, "date")
        date_obj = split_date_range(date_raw)

        # --- People ---
        people_sending = parse_people_field(
            cell_or_null(row, "people_sending"), register_people, person_cache
        )
        people_addressed = parse_people_field(
            cell_or_null(row, "people_addressed"), register_people, person_cache
        )

        # --- IIIF URLs ---
        iiif_url = cell_or_null(row, "iiif_manifest_url")
        iiif_urls = [iiif_url] if iiif_url else []

        # --- Archive sub-object ---
        archive = {
            "folder_name": cell_or_null(row, "folder_name"),
            "ref_code_fonds": cell_or_null(row, "ref_code_fonds"),
            "shelfmark": cell_or_null(row, "shelfmark"),
            "repository": cell_or_null(row, "repository"),
            "repo_url": cell_or_null(row, "repo_url"),
            "rights": cell_or_null(row, "rights"),
            "archival_history": cell_or_null(row, "archival_history"),
            "published_in": split_semicolon_list(cell_or_null(row, "published_in")) or [],
            "cited_in": split_semicolon_list(cell_or_null(row, "cited_in")) or [],
        }

        # --- Metadata ---
        metadata = {
            "title": cell_or_null(row, "title"),
            "title_short": None,
            "type": None,
            "summary": None,
            "people_sending": people_sending,
            "people_addressed": people_addressed,
            "people_addressfield": None,
            "date_stamp": None,
            "place_of_sender": cell_or_null(row, "place_of_sender"),
            "place_of_recepient": None,
            "content_and_medium": cell_or_null(row, "content_and_medium"),
            "language": cell_or_null(row, "language"),
            "attachments": cell_or_null(row, "attachments"),
            "archive": archive,
        }

        # --- Editorial notes ---
        editorial_notes = {
            "contentNotes": [],
            "editorial_comments_1": cell_or_null(row, "editorial_comments_1"),
            "editorial_comments_2": cell_or_null(row, "editorial_comments_2"),
        }

        # --- Manuscript ---
        manuscript = {
            "rendition": None,
            "iiif_urls": iiif_urls,
        }

        # --- Assemble the letter object ---
        letter_obj = {
            "slug": letter_key,
            "name": None,
            "date": date_obj,
            "type": None,
            "metadata": metadata,
            "citedDocuments": {
                "smallforms": [],
                "longforms": [],
                "photos": [],
            },
            "entities_temp": {
                "travel": None,
            },
            "editorialNotes": editorial_notes,
            "manuscript": manuscript,
        }

        # Store as tuple for sorting
        letters_data.append((letter_key, letter_obj))

    # Sort by letter_key
    letters_data.sort(key=lambda x: x[0])

    # Build the final dictionary: { "letter_0001": {...}, ... }
    sorted_letters_dict = {k: v for k, v in letters_data}

    # Wrap in the final structure: { "letter": { ... } }
    final_output = {
        "letters": sorted_letters_dict
    }

    # Write output
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(final_output, f, ensure_ascii=False, indent=2)

    print(f"Written {len(sorted_letters_dict)} letters to {output_path}.")
    print("Structure: { 'letter': { 'letter_0001': ..., 'letter_0002': ... } }")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    csv_file = "letters.csv"
    register_file = "register.json"
    output_file = "letters_output.json"

    convert_csv_to_json(csv_file, register_file, output_file)
