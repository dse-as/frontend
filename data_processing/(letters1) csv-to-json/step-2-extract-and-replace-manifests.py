#!/usr/bin/env python3
"""
Post-process letters_output.json:
Replace each manifest URL in metadata.manuscript.iiif_urls with an array
of individual page-level image URLs extracted from the manifest.

Fixes applied:
- Corrected root key lookup to 'letters'.
- Fixed IIIF 3.0 traversal (Canvas -> AnnotationPage -> Annotation -> body.id).
- Added auto-save every 10 letters.
"""

import json
import requests
import time
import sys
import os


def get_all_pages_from_manifest(manifest_url):
    """
    Fetch a IIIF manifest and extract ALL page-level image URLs.
    Optimized for IIIF Presentation API 3.0 (as seen in the provided sample).
    """
    if not manifest_url or str(manifest_url).strip() == "":
        return []

    try:
        headers = {"User-Agent": "Lumo-IIIF-PostProcessor/1.0"}
        resp = requests.get(str(manifest_url), headers=headers, timeout=15)
        resp.raise_for_status()

        data = resp.json()
        page_urls = []

        # --- IIIF PRESENTATION API 3.0 LOGIC ---
        # Structure: items[] (Canvases) -> items[] (AnnotationPages) -> items[] (Annotations) -> body.id
        if 'items' in data:
            canvases = data['items']
            if isinstance(canvases, list):
                for canvas in canvases:
                    if not isinstance(canvas, dict):
                        continue

                    # Get annotation pages inside the canvas
                    ann_pages = canvas.get('items', [])
                    if not isinstance(ann_pages, list):
                        continue

                    for ann_page in ann_pages:
                        if not isinstance(ann_page, dict):
                            continue

                        # Get annotations inside the annotation page
                        annotations = ann_page.get('items', [])
                        if not isinstance(annotations, list):
                            continue

                        for annotation in annotations:
                            if not isinstance(annotation, dict):
                                continue

                            body = annotation.get('body')

                            # Case 1: body is a single object with 'id'
                            if isinstance(body, dict):
                                if 'id' in body:
                                    page_urls.append(body['id'])
                                # Sometimes body is a list of resources
                                elif isinstance(body.get('id'), list):
                                    for b in body['id']:
                                        if isinstance(b, dict) and 'id' in b:
                                            page_urls.append(b['id'])

                            # Case 2: body is a list of objects
                            elif isinstance(body, list):
                                for b_item in body:
                                    if isinstance(b_item, dict) and 'id' in b_item:
                                        page_urls.append(b_item['id'])

        # --- FALLBACK: IIIF Presentation API 2.x ---
        # Path: sequences[].canvases[].images[].resource["@id"]
        if not page_urls and 'sequences' in data:
            for seq in data['sequences']:
                if not isinstance(seq, dict):
                    continue
                canvases = seq.get('canvases', [])
                for canvas in canvases:
                    if not isinstance(canvas, dict):
                        continue
                    images = canvas.get('images', [])
                    for img in images:
                        if not isinstance(img, dict):
                            continue
                        resource = img.get('resource', {})
                        if isinstance(resource, dict) and '@id' in resource:
                            page_urls.append(resource['@id'])

        # --- FINAL FALLBACK: Recursive search for any @id or id ---
        if not page_urls:
            def find_ids(obj, results):
                if isinstance(obj, dict):
                    if 'id' in obj:
                        results.append(obj['id'])
                    if '@id' in obj:
                        results.append(obj['@id'])
                    for v in obj.values():
                        find_ids(v, results)
                elif isinstance(obj, list):
                    for item in obj:
                        find_ids(item, results)

            find_ids(data, page_urls)

        # Filter out non-image IDs if possible (basic check for .jpg/.jpeg or /image/)
        # But we keep all 'id's found to be safe, as per your requirement.

        return page_urls

    except requests.exceptions.RequestException as e:
        print(f"Network error fetching {manifest_url[:50]}...: {e}", file=sys.stderr)
        return []
    except json.JSONDecodeError as e:
        print(f"JSON decode error for {manifest_url[:50]}...: {e}", file=sys.stderr)
        return []
    except Exception as e:
        print(f"Unexpected error processing {manifest_url[:50]}...: {e}", file=sys.stderr)
        return []


def process_letters(input_path: str, output_path: str = "letters_output_with_pages.json"):
    """
    Read the letters JSON, replace manifest URLs with page-level URLs.
    Saves progress every 10 letters.
    """
    print(f"📖 Loading {input_path} ...")

    if not os.path.exists(input_path):
        print(f"❌ Error: Input file '{input_path}' not found.")
        sys.exit(1)

    with open(input_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # FIX 1: Changed 'letter' to 'letters'
    letters = data.get("letters", {})

    if not letters:
        print("⚠️ Warning: No 'letters' key found in input JSON. Check file structure.")
        # Fallback to 'letter' just in case, but warn
        letters = data.get("letter", {})
        if letters:
            print("   Attempting fallback to 'letter' key.")
        else:
            print("❌ Fatal: Could not find 'letters' or 'letter' keys.")
            sys.exit(1)

    total = len(letters)
    print(f"✅ Loaded {total} letters")
    print("-" * 60)

    success_count = 0
    fail_count = 0
    skip_count = 0
    total_pages_extracted = 0

    # Use a list to maintain order if needed, or dict.
    # Since we need to save progressively, we'll rebuild the dict as we go.
    processed_results = {}

    idx = 0
    last_save_idx = 0

    try:
        for letter_key, letter_obj in letters.items():
            idx += 1

            iiif_urls = (
                letter_obj.get("manuscript", {})
                .get("iiif_urls", [])
            )

            if not iiif_urls:
                skip_count += 1
                processed_results[letter_key] = letter_obj
                continue

            new_page_urls = []

            for manifest_url in iiif_urls:
                short_url = str(manifest_url)[:60] + "..." if len(str(manifest_url)) > 60 else str(manifest_url)
                print(f"[{idx}/{total}] {letter_key}: Fetching: {short_url}", end=" ", flush=True)

                pages = get_all_pages_from_manifest(manifest_url)

                if pages:
                    new_page_urls.extend(pages)
                    success_count += 1
                    total_pages_extracted += len(pages)
                    print(f"✅ {len(pages)} pages found")
                else:
                    fail_count += 1
                    print(f"❌ No pages extracted")

                time.sleep(0.3)  # Polite delay

            # Replace the manifest URLs with page-level URLs
            letter_obj["manuscript"]["iiif_urls"] = new_page_urls if new_page_urls else []
            processed_results[letter_key] = letter_obj

            # FIX 2: Save every 10 letters
            if idx % 10 == 0 or idx == total:
                # Reconstruct the full output structure
                current_output = {"letters": processed_results}

                # Write to temp file first to avoid corruption on crash
                temp_path = output_path + ".tmp"
                with open(temp_path, "w", encoding="utf-8") as f:
                    json.dump(current_output, f, ensure_ascii=False, indent=2)

                # Atomic rename
                os.replace(temp_path, output_path)

                print(f"\n💾 Progress saved ({idx}/{total}).")
                last_save_idx = idx

    except KeyboardInterrupt:
        print("\n\n⚠️  Interrupted by user! Saving final progress...")
        # Final save attempt
        current_output = {"letters": processed_results}
        temp_path = output_path + ".tmp"
        with open(temp_path, "w", encoding="utf-8") as f:
            json.dump(current_output, f, ensure_ascii=False, indent=2)
        os.replace(temp_path, output_path)
        print(f"💾 Saved partial results to {output_path}")

    # Final confirmation
    print("-" * 60)
    print(f"✅ Post-processing complete.")
    print(f"   Total letters:   {total}")
    print(f"   Manifests fetched OK: {success_count}")
    print(f"   Manifests failed:     {fail_count}")
    print(f"   Letters skipped:      {skip_count}")
    print(f"   Total pages extracted: {total_pages_extracted}")
    print(f"   Output file: {output_path}")
    print("=" * 60)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    input_file = "letters_output.json"
    output_file = "letters_output_with_pages.json"

    process_letters(input_file, output_file)
