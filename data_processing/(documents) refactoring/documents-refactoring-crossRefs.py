#!/usr/bin/env python3
"""
Transform script for documents JSON.

  - In smallforms & longforms:
      - Create crossReferences next to metadata with citedDocuments, linkedDocuments,
        citedEntities, linkedEntities (always present, possibly {}).
      - Move metadata.globalEntities.{smallforms,longforms,letters,photos} → crossReferences.linkedDocuments
      - Move metadata.globalEntities.{people,places,events,orgs,bibls,keywords} → crossReferences.linkedEntities
      - Move entities.{smallforms,longforms,letters,photos} → crossReferences.citedDocuments
      - Move entities.{people,places,events,orgs,bibls,keywords} → crossReferences.citedEntities
      - Drop any inner key whose array is empty or missing.
      - Remove entities & metadata.globalEntities afterwards.

  - In photos:
      - Create crossReferences next to metadata with linkedDocuments, linkedEntities (always present).
      - Move linkedDocs → crossReferences.linkedDocuments
      - Move linkedReg → crossReferences.linkedEntities
      - Drop any inner key whose array is empty or missing.
      - Remove linkedDocs & linkedReg afterwards.
"""

import json
import sys
import copy
from pathlib import Path


DOCUMENT_KEYS = ("smallforms", "longforms", "letters", "photos")
ENTITY_KEYS = ("people", "places", "events", "orgs", "bibls", "keywords")
ALL_KEYS = DOCUMENT_KEYS + ENTITY_KEYS


def filter_non_empty(src: dict | None, keys: tuple[str, ...]) -> dict:
    """Return a dict with only the specified keys whose value is a non-empty list."""
    result = {}
    if not src:
        return result
    for k in keys:
        val = src.get(k)
        if isinstance(val, list) and len(val) > 0:
            result[k] = val
    return result


def transform_smallform_or_longform(item: dict) -> dict:
    metadata = item.get("metadata", {})
    global_entities = metadata.get("globalEntities") or {}
    entities = item.get("entities") or {}

    cross_references = {
        "citedDocuments": filter_non_empty(entities, DOCUMENT_KEYS),
        "linkedDocuments": filter_non_empty(global_entities, DOCUMENT_KEYS),
        "citedEntities": filter_non_empty(entities, ENTITY_KEYS),
        "linkedEntities": filter_non_empty(global_entities, ENTITY_KEYS),
    }

    new_item = {}
    for key, value in item.items():
        if key == "metadata":
            if "globalEntities" in metadata:
                cleaned_meta = copy.deepcopy(metadata)
                del cleaned_meta["globalEntities"]
                new_item["metadata"] = cleaned_meta
            else:
                new_item["metadata"] = metadata
            new_item["crossReferences"] = cross_references
        elif key == "entities":
            continue
        else:
            new_item[key] = value

    return new_item


def transform_photo(item: dict) -> dict:
    linked_docs = item.get("linkedDocs") or {}
    linked_reg = item.get("linkedReg") or {}

    cross_references = {
        "linkedDocuments": filter_non_empty(linked_docs, ALL_KEYS),
        "linkedEntities": filter_non_empty(linked_reg, ENTITY_KEYS),
    }

    new_item = {}
    for key, value in item.items():
        if key == "metadata":
            new_item["metadata"] = value
            new_item["crossReferences"] = cross_references
        elif key in ("linkedDocs", "linkedReg"):
            continue
        else:
            new_item[key] = value

    return new_item


def transform_documents(data: dict) -> dict:
    documents = data.get("documents", {})

    for section in ("smallforms", "longforms"):
        section_dict = documents.get(section)
        if not section_dict or not isinstance(section_dict, dict):
            continue
        for key, item in section_dict.items():
            section_dict[key] = transform_smallform_or_longform(item)

    section_dict = documents.get("photos")
    if section_dict and isinstance(section_dict, dict):
        for key, item in section_dict.items():
            section_dict[key] = transform_photo(item)

    return data


def main():
    if len(sys.argv) < 2:
        print("Usage: python transform.py <input.json> [output.json]")
        sys.exit(1)

    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2]) if len(sys.argv) > 2 else input_path.with_suffix(".out.json")

    with open(input_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    data = transform_documents(data)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"✓ Transformed file written to {output_path}")


if __name__ == "__main__":
    main()
