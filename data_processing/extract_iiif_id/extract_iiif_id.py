import pandas as pd
import requests
import time
import json
import os

# Configuration
INPUT_FILE = 'input.csv'
OUTPUT_FILE = 'output.csv'
COL_MANIFEST = 'iiif_manifest_emanuscripta'
COL_RESULT = 'iiif_image_emanuscripta'

def get_iiif_image_url(manifest_url):
    """
    Fetches IIIF manifest and extracts the image URL.
    Updated to prioritize data['thumbnail']['@id'] as found in e-manuscripta.
    """
    # 1. FAST FAIL: Check if URL is empty immediately
    if not manifest_url or pd.isna(manifest_url) or str(manifest_url).strip() == "":
        return None

    try:
        # 2. Fast Network Call (10s timeout)
        headers = {"User-Agent": "Lumo-IIIF-LiveExtractor/1.0"}
        resp = requests.get(str(manifest_url), headers=headers, timeout=10)
        resp.raise_for_status()

        data = resp.json()
        result_id = None

        # --- STRATEGY PRIORITY ---

        # STRATEGY 1: Check thumbnail.@id (e-manuscripta specific fix)
        # This matches your requirement: thumbnail:{...} -> @id
        if 'thumbnail' in data:
            thumb = data['thumbnail']
            if isinstance(thumb, dict) and '@id' in thumb:
                result_id = thumb['@id']
                # print(f"DEBUG: Found via thumbnail: {result_id}") # Optional debug

        # STRATEGY 2: Check images[0].resource.@id (Standard IIIF)
        if result_id is None and 'images' in data:
            images = data['images']
            if len(images) > 0:
                img_obj = images[0]
                if 'resource' in img_obj and '@id' in img_obj['resource']:
                    result_id = img_obj['resource']['@id']

                # Check service inside image just in case
                if result_id is None and 'service' in img_obj:
                    svc = img_obj['service']
                    if isinstance(svc, list):
                        for s in svc:
                            if '@id' in s:
                                result_id = s['@id']; break
                    elif isinstance(svc, dict) and '@id' in svc:
                        result_id = svc['@id']

        # STRATEGY 3: Root level service
        if result_id is None and 'service' in data:
            svc = data['service']
            if isinstance(svc, list):
                for s in svc:
                    if '@id' in s:
                        result_id = s['@id']; break
            elif isinstance(svc, dict) and '@id' in svc:
                result_id = svc['@id']

        # STRATEGY 4: Deep recursive search (Fallback for any structure)
        if result_id is None:
            def find_first_id(obj):
                if isinstance(obj, dict):
                    if '@id' in obj: return obj['@id']
                    for v in obj.values():
                        r = find_first_id(v)
                        if r: return r
                elif isinstance(obj, list):
                    for item in obj:
                        r = find_first_id(item)
                        if r: return r
                return None
            result_id = find_first_id(data)

        return result_id

    except requests.exceptions.RequestException:
        return None
    except json.JSONDecodeError:
        return None
    except Exception:
        return None

def main():
    print(f"🚀 Starting Live Extraction from {INPUT_FILE}")
    print(f"📁 Output: {OUTPUT_FILE} (Updates live)")
    print("-" * 60)

    if not os.path.exists(INPUT_FILE):
        print(f"❌ Error: {INPUT_FILE} not found.")
        return

    try:
        df = pd.read_csv(INPUT_FILE)
        print(f"✅ Loaded {len(df)} rows")
    except Exception as e:
        print(f"❌ Error reading CSV: {e}")
        return

    if COL_MANIFEST not in df.columns:
        print(f"❌ Column '{COL_MANIFEST}' not found. Available: {list(df.columns)}")
        return

    # Initialize output file
    if os.path.exists(OUTPUT_FILE):
        print("⚠️  Output file exists! Overwriting...")

    # Write header
    pd.DataFrame(columns=[COL_MANIFEST, COL_RESULT]).to_csv(OUTPUT_FILE, index=False)

    total = len(df)

    try:
        for i, row in df.iterrows():
            url = row[COL_MANIFEST]

            # INSTANT SKIP
            if not url or pd.isna(url) or str(url).strip() == "":
                extracted = None
                status = "[SKIP]"
            else:
                short_url = str(url)[:50] + "..." if len(str(url)) > 50 else str(url)
                print(f"[{i+1}/{total}] Fetching: {short_url}", end=" ", flush=True)

                extracted = get_iiif_image_url(url)
                status = "✅ FOUND" if extracted else "❌ MISS"

            # Update memory & LIVE WRITE to CSV
            df.loc[i, COL_RESULT] = extracted
            single_row = pd.DataFrame([{COL_MANIFEST: url, COL_RESULT: extracted}])
            single_row.to_csv(OUTPUT_FILE, mode='a', header=False, index=False)

            res_preview = str(extracted)[:40] if extracted else "None"
            print(f"{status} -> {res_preview}")

            time.sleep(0.3) # Polite delay

    except KeyboardInterrupt:
        print("\n\n⚠️  Interrupted by user! Saving progress...")
    finally:
        success_count = df[COL_RESULT].notna().sum()
        print("-" * 60)
        print(f"✅ Stopped/Saved.")
        print(f"Total: {i+1}/{total}, Success: {success_count}")
        print(f"File: {OUTPUT_FILE}")
        print("=" * 60)

if __name__ == '__main__':
    main()
