import pandas as pd
import json
import os
import shutil

# Configuration
CSV_FILE = 'output.csv'
JSON_FILE = 'documents.json'
BACKUP_FILE = 'documents.json.bak'

def main():
    print("🔄 Starting STRICT JSON Merge...")
    print("   This will fill MISSING entries with null.")

    # 1. Load CSV
    if not os.path.exists(CSV_FILE):
        print(f"❌ Error: {CSV_FILE} not found.")
        return

    try:
        df = pd.read_csv(CSV_FILE)
        col_manifest = 'iiif_manifest_emanuscripta'
        col_image = 'iiif_image_emanuscripta'

        if col_manifest not in df.columns or col_image not in df.columns:
            print(f"❌ Error: Columns not found.")
            return

        csv_count = len(df)
        print(f"✅ Loaded {csv_count} rows from CSV.")

    except Exception as e:
        print(f"❌ Error reading CSV: {e}")
        return

    # 2. Load JSON
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

    updated_count = 0
    null_inserted_count = 0

    print(f"📂 Processing {total_photos} photos (Order must match CSV)...")
    print("-" * 60)

    for index, photo_key in enumerate(photo_keys):
        photo_data = photos_section[photo_key]

        # Ensure we have a dict for the photo
        if not isinstance(photo_data, dict):
            photos_section[photo_key] = {}
            photo_data = photos_section[photo_key]

        # Ensure 'facsimile' exists inside the photo
        if "facsimile" not in photo_data or not isinstance(photo_data["facsimile"], dict):
            photo_data["facsimile"] = {}

        facsimile = photo_data["facsimile"]

        # DETERMINE VALUE
        final_value = None

        if index < csv_count:
            row = df.iloc[index]
            val = row[col_image]
            if not pd.isna(val):
                final_value = str(val)

        # If index >= csv_count, final_value remains None (which becomes null)

        # FORCE INSERT/UPDATE
        facsimile["iiif_image_emanuscripta"] = final_value

        if final_value is None:
            null_inserted_count += 1
        else:
            updated_count += 1

        # Progress indicator
        if (index + 1) % 50 == 0:
            print(f"   ...Processed {index+1}/{total_photos}")

    # 3. Save
    print("\n💾 Saving changes...")
    shutil.copy2(JSON_FILE, BACKUP_FILE)

    with open(JSON_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    print("-" * 60)
    print("✅ STRICT MERGE COMPLETE")
    print(f"   Rows with URL: {updated_count}")
    print(f"   Rows with NULL: {null_inserted_count}")
    print(f"   Total checked: {total_photos}")
    print(f"   Backup saved: {BACKUP_FILE}")
    print("=" * 60)

if __name__ == '__main__':
    main()
