import pandas as pd
import json
import os
import shutil

# Configuration
CSV_FILE = 'manifests_and_ids.csv'
JSON_FILE = 'documents.json'
BACKUP_FILE = 'documents.json.bak'

def clean_id(id_val):
    """Clean ID: strip whitespace, newlines, ensure string"""
    if pd.isna(id_val):
        return None
    return str(id_val).strip()

def main():
    print("🔄 Starting ID-based JSON Merge...")
    print("=" * 60)
    print("Expected format:")
    print("   CSV photo_id column: image_0265, image_0279, ...")
    print("   JSON photos keys:    photo_0265, photo_0279, ...")
    print("   Conversion:          photo_ -> image_ for CSV lookup")
    print("=" * 60)

    # 1. Load CSV
    if not os.path.exists(CSV_FILE):
        print(f"❌ Error: {CSV_FILE} not found.")
        return

    try:
        df = pd.read_csv(CSV_FILE)

        if "photo_id" not in df.columns or "iiif_image_emanuscripta" not in df.columns:
            print(f"❌ Error: Required columns 'photo_id' and 'iiif_image_emanuscripta' not found in CSV.")
            print(f"   Available columns: {list(df.columns)}")
            return

        csv_count = len(df)
        print(f"\n✅ Loaded {csv_count} rows from CSV.")

        # Show sample CSV data
        print("\n📊 Sample CSV rows:")
        print(df[['photo_id', 'iiif_image_emanuscripta']].head(3).to_string(index=False))

        # Check first few CSV IDs to confirm format
        csv_sample_ids = df['photo_id'].dropna().head(5).tolist()
        print(f"\n   CSV photo_id samples: {csv_sample_ids}")

    except Exception as e:
        print(f"❌ Error reading CSV: {e}")
        return

    # 2. Build CSV mapping: image_XXXX -> iiif_image value
    csv_mapping = {}
    for idx, row in df.iterrows():
        raw_id = clean_id(row['photo_id'])
        image_value = row['iiif_image_emanuscripta']

        if raw_id:
            csv_mapping[raw_id] = str(image_value).strip() if not pd.isna(image_value) else None

    print(f"   Built mapping with {len(csv_mapping)} entries from CSV")

    # 3. Load JSON
    if not os.path.exists(JSON_FILE):
        print(f"❌ Error: {JSON_FILE} not found.")
        return

    try:
        with open(JSON_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"❌ Error parsing JSON: {e}")
        return

    # Ensure structure exists
    if "documents" not in data:
        data["documents"] = {}
    if "photos" not in data["documents"]:
        data["documents"]["photos"] = {}

    photos_section = data["documents"]["photos"]
    photo_keys = list(photos_section.keys())
    total_photos = len(photo_keys)

    if total_photos == 0:
        print("⚠️  No photos found in JSON to process.")
        return

    print(f"\n✅ Loaded {total_photos} photos from JSON.")

    # Show sample JSON keys
    print(f"\n📂 JSON photos keys (first 5):")
    print(f"   {photo_keys[:5]}")
    print("-" * 60)

    updated_count = 0
    null_inserted_count = 0
    overwritten_count = 0
    matched_examples = []
    unmatched_examples = []

    for json_key in photo_keys:
        photo_data = photos_section[json_key]

        # Ensure dict structure
        if not isinstance(photo_data, dict):
            photos_section[json_key] = {}
            photo_data = photos_section[json_key]

        if "faksimile" not in photo_data or not isinstance(photo_data["faksimile"], dict):
            photo_data["faksimile"] = {}

        faksimile = photo_data["faksimile"]
        existing_value = faksimile.get("iiif_image_emanuscripta", None)
        had_existing_value = existing_value is not None

        # --- PREFIX CONVERSION ---
        # JSON key is photo_XXXX, need to look up image_XXXX in CSV
        if json_key.startswith('photo_'):
            csv_lookup_key = json_key.replace('photo_', 'image_')
        else:
            csv_lookup_key = json_key  # Fallback

        # Look up in CSV mapping
        final_value = csv_mapping.get(csv_lookup_key, None)

        # ALWAYS UPDATE (overwrite existing values)
        faksimile["iiif_image_emanuscripta"] = final_value

        # Track stats
        if final_value is None:
            null_inserted_count += 1
            if len(unmatched_examples) < 5:
                unmatched_examples.append((json_key, csv_lookup_key))
        else:
            updated_count += 1
            if len(matched_examples) < 5:
                matched_examples.append((json_key, final_value[:50]))
            if had_existing_value:
                overwritten_count += 1

        # Progress indicator
        if (photo_keys.index(json_key) + 1) % 100 == 0:
            print(f"   ...Processed {photo_keys.index(json_key)+1}/{total_photos}")

    # Report specific mismatches
    print("\n" + "=" * 60)
    print("MATCH RESULTS")
    print("=" * 60)
    print(f"   ✅ Updated with URLs:     {updated_count}")
    print(f"   ⚠️  Set to NULL:          {null_inserted_count}")
    print(f"   🔄 Overwritten existing:  {overwritten_count}")
    print(f"   Total processed:          {total_photos}")

    if matched_examples:
        print(f"\n   ✅ Match examples:")
        for jk, val in matched_examples:
            print(f"      {jk} -> {val}")

    if unmatched_examples:
        print(f"\n   ❌ Unmatch examples (JSON key | CSV looked-for):")
        for jk, ck in unmatched_examples:
            found_in_csv = ck in csv_mapping
            print(f"      {jk} | {ck} | Found in CSV: {found_in_csv}")
            # Show what's actually in CSV around that range
            if not found_in_csv:
                similar = [k for k in csv_mapping.keys() if k.endswith(jk.replace('photo_', '_'))]
                if similar:
                    print(f"         Similar matches in CSV: {similar[:5]}")

    # Save changes
    print("\n💾 Saving changes...")
    shutil.copy2(JSON_FILE, BACKUP_FILE)

    with open(JSON_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    print(f"   Backup saved: {BACKUP_FILE}")
    print("=" * 60)
    print("✅ MERGE COMPLETE!")

if __name__ == '__main__':
    main()
