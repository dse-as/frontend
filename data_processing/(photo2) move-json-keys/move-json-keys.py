import json
import sys

def restructure_json(data):
    """
    Restructures photos by creating a 'metadata' object and moving keys into it.

    Rules:
    1. 'name' stays at the root level of each photo object.
    2. 'iiif_manifest_emanuscripta' and 'iiif_manifest' move to a new 'faksimile' object.
    3. ALL other keys (that were originally in the photo root) move into a NEW 'metadata' object.
    """

    if "photos" not in data or not isinstance(data["photos"], dict):
        print("Warning: No 'photos' dictionary found.")
        return data

    # Define the keys that need special handling
    iiif_keys = {"iiif_manifest_emanuscripta", "iiif_manifest"}
    root_keep_keys = {"name"}

    for photo_key, photo_data in data["photos"].items():
        if not isinstance(photo_data, dict):
            continue

        # We will collect keys to move here
        metadata_items = {}
        iiif_items = {}

        # Iterate over a copy of keys to safely modify the original dict
        keys_to_process = list(photo_data.keys())

        for key in keys_to_process:
            value = photo_data[key]

            if key == "name":
                # Rule 1: Keep 'name' where it is (root level)
                # Do nothing, just leave it in photo_data
                continue

            elif key in iiif_keys:
                # Rule 2: Move specific keys to the new 'iiif' object
                iiif_items[key] = value
            else:
                # Rule 3: Everything else goes into the new 'metadata' object
                metadata_items[key] = value

        # Now apply the changes to the photo object

        # 1. Remove moved keys from the root
        for key in iiif_keys:
            if key in photo_data:
                del photo_data[key]

        # For non-name, non-iiif keys, they are effectively "moved" by
        # creating the new metadata dict and clearing them from root?
        # Actually, we need to remove the ones we put in metadata from the root too.
        for key in metadata_items:
            if key in photo_data:
                del photo_data[key]

        # 2. Create the 'metadata' object if there are items to store
        if metadata_items:
            photo_data["metadata"] = metadata_items

        # 3. Create the 'faksimile' object if there are items to store
        if iiif_items:
            photo_data["faksimile"] = iiif_items

    return data

def main():
    input_file = "input.json"
    output_file = "output.json"

    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        print(f"Processing {input_file}...")

        updated_data = restructure_json(data)

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(updated_data, f, indent=4, ensure_ascii=False)

        print(f"Done! Restructured data saved to {output_file}")

    except FileNotFoundError:
        print(f"Error: File '{input_file}' not found.")
        sys.exit(1)
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON format in '{input_file}'.")
        sys.exit(1)
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
