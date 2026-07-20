#!/usr/bin/env python3
"""
Transform letters_output_with_pages.json:
- Copy title to "name" (stripping trailing dates)
- Delete title, title_short, slug
- Rename metadata "type" to "types"
- Move date inside metadata
- Clean IIIF URLs (remove '/full/max/0/default.jpg' postfix)
- Group citedDocuments, linkedDocuments, citedEntities, linkedEntities
  under "crossReferences" (all emptied)
- Reorder all fields to match the specified schema
"""

import json
import re
import sys
import os


def strip_trailing_date(title: str | None) -> str | None:
    """
    Remove trailing date patterns from a title string.
    Handles: ", YYYY", ", YYYY-MM", ", YYYY-MM-DD"
    Also handles date ranges like ", YYYY-YYYY" or ", YYYY-MM-DD-YYYY-MM-DD"
    """
    if not title:
        return None

    result = title.strip()

    date_pattern = r',\s*(\d{4}(?:-\d{2}(?:-\d{2})?)?(?:[-\s]+\d{4}(?:-\d{2}(?:-\d{2})?)?)?)\s*$'

    result = re.sub(date_pattern, '', result).strip()

    return result if result else None


def clean_iiif_url(url: str | None) -> str | None:
    """
    Remove the '/full/max/0/default.jpg' postfix from IIIF image URLs.
    """
    if not url:
        return None

    url_str = str(url).strip()

    postfix = "/full/max/0/default.jpg"
    if url_str.endswith(postfix):
        return url_str[:-len(postfix)]

    return url_str


def reorder_letter(letter_obj: dict) -> dict:
    """
    Transform a single letter object to match the target schema.
    """
    old_meta = letter_obj.get("metadata", {})

    # --- Extract name from title ---
    title = old_meta.get("title")
    name = strip_trailing_date(title)

    # --- Build archive sub-object (reordered) ---
    old_archive = old_meta.get("archive", {})
    archive = {
        "repository": old_archive.get("repository"),
        "repo_url": old_archive.get("repo_url"),
        "shelfmark": old_archive.get("shelfmark"),
        "folder_name": old_archive.get("folder_name"),
        "ref_code_fonds": old_archive.get("ref_code_fonds"),
        "rights": old_archive.get("rights"),
        "archival_history": old_archive.get("archival_history"),
        "published_in": old_archive.get("published_in", []),
        "cited_in": old_archive.get("cited_in", []),
    }

    # --- Build metadata (reordered, date moved inside, type -> types) ---
    metadata = {
        "types": old_meta.get("type"),
        "date": letter_obj.get("date", {"from": None, "to": None}),
        "date_stamp": old_meta.get("date_stamp"),
        "people_sending": old_meta.get("people_sending"),
        "people_addressed": old_meta.get("people_addressed"),
        "people_addressfield": old_meta.get("people_addressfield"),
        "place_of_sender": old_meta.get("place_of_sender"),
        "place_of_recepient": old_meta.get("place_of_recepient"),
        "summary": old_meta.get("summary"),
        "content_and_medium": old_meta.get("content_and_medium"),
        "language": old_meta.get("language"),
        "attachments": old_meta.get("attachments"),
        "archive": archive,
    }

    # --- Process IIIF URLs ---
    raw_urls = letter_obj.get("manuscript", {}).get("iiif_urls", [])
    cleaned_urls = [clean_iiif_url(u) for u in raw_urls]
    cleaned_urls = [u for u in cleaned_urls if u is not None]

    # --- Build the reordered letter object ---
    transformed = {
        "name": name,
        "metadata": metadata,
        "crossReferences": {
            "citedDocuments": {},
            "linkedDocuments": {},
            "citedEntities": {},
            "linkedEntities": {},
        },
        "editorialNotes": {
            "contentNotes": letter_obj.get("editorialNotes", {}).get("contentNotes", []),
            "editorial_comments_1": letter_obj.get("editorialNotes", {}).get("editorial_comments_1"),
            "editorial_comments_2": letter_obj.get("editorialNotes", {}).get("editorial_comments_2"),
        },
        "manuscript": {
            "rendition": letter_obj.get("manuscript", {}).get("rendition"),
            "iiif_urls": cleaned_urls,
        },
    }

    return transformed


def transform_file(input_path: str, output_path: str):
    """
    Read the JSON, transform all letters, write reordered output.
    """
    print(f"📖 Loading {input_path} ...")

    if not os.path.exists(input_path):
        print(f"❌ Error: Input file '{input_path}' not found.")
        sys.exit(1)

    with open(input_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    letters = data.get("letters", {})
    if not letters:
        letters = data.get("letter", {})

    if not letters:
        print("❌ Error: Could not find 'letters' or 'letter' key in JSON.")
        sys.exit(1)

    total = len(letters)
    print(f"✅ Loaded {total} letters")
    print("-" * 60)

    transformed_letters = {}
    urls_cleaned_count = 0

    for letter_key, letter_obj in letters.items():
        raw_urls = letter_obj.get("manuscript", {}).get("iiif_urls", [])
        count = sum(1 for u in raw_urls if u and str(u).endswith("/full/max/0/default.jpg"))
        urls_cleaned_count += count

        transformed = reorder_letter(letter_obj)
        transformed_letters[letter_key] = transformed

    output_data = {"letters": transformed_letters}

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"✅ Transformed {total} letters.")
    print(f"   Cleaned {urls_cleaned_count} IIIF URLs.")
    print(f"   Grouped cross-references under 'crossReferences'.")
    print(f"   Output file: {output_path}")
    print("=" * 60)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    input_file = "letters_output_with_pages.json"
    output_file = "letters_output_with_pages_cleaned(step3)-v2.json"

    transform_file(input_file, output_file)
