import json
import re

def transform_photos(document):
    """
    Process the photos section of a document with the following transformations:
    1. Initialize 'linkedReg' and 'linkedDocs' as empty objects inside EACH photo entry.
    2. Delete 'photo_id' inside metadata.
    3. Remove '[SLA-...]' pattern from the 'label' field.
    4. Rename 'id_sla' to 'sla_id_full' and split into 'sla_id_coll' / 'sla_id_img'.
    5. Transform 'stamp' key: rename to 'stamped' (bool/null).
    6. Transform 'signatures' key: rename to 'signed' (bool/null), ignoring array values.
    """

    if "documents" not in document or "photos" not in document["documents"]:
        print("Warning: No 'documents' or 'photos' key found")
        return document

    photos = document["documents"]["photos"]

    for photo_key, photo_data in photos.items():
        # Ensure we are working with a dictionary for this photo
        if not isinstance(photo_data, dict):
            continue

        # --- NEW STEP: Add empty objects inside THIS specific photo entry ---
        photo_data["linkedReg"] = {}
        photo_data["linkedDocs"] = {}
        # ---------------------------------------------------------------

        # Skip if no metadata
        if "metadata" not in photo_data:
            continue

        metadata = photo_data["metadata"]

        # (2) Delete 'photo_id' inside metadata
        if "photo_id" in metadata:
            del metadata["photo_id"]

        # (3) Remove '[SLA-...]' from label using regex
        if "label" in photo_data:
            # Removes [SLA-anything] including brackets, then strips extra whitespace
            cleaned_label = re.sub(r'\[SLA-[^\]]*\]', '', photo_data["label"]).strip()
            # Clean up double spaces resulting from removal
            photo_data["label"] = re.sub(r'\s{2,}', ' ', cleaned_label)

        # (4) Handle id_sla transformations
        if "id_sla" in metadata:
            sla_value = metadata.pop("id_sla") # Removes 'id_sla', keeps value
            metadata["sla_id_full"] = sla_value

            parts = sla_value.split("/", 1)
            metadata["sla_id_coll"] = parts[0]
            metadata["sla_id_img"] = parts[1] if len(parts) > 1 else ""

        # (5) Transform 'stamp' key
        if "stamp" in metadata:
            stamp_val = metadata.pop("stamp")

            if stamp_val is None:
                metadata["stamped"] = None
            elif stamp_val == "gestempelt":
                metadata["stamped"] = True
            elif stamp_val == "nicht gestempelt":
                metadata["stamped"] = False
            else:
                # Fallback for unexpected values
                metadata["stamped"] = None

        # (6) Transform 'signatures' key
        if "signatures" in metadata:
            sig_val = metadata.pop("signatures")

            if sig_val is None:
                metadata["signed"] = None
            elif isinstance(sig_val, list):
                # Check the first item in the array
                first_item = sig_val[0] if len(sig_val) > 0 else ""

                if first_item == "signiert":
                    metadata["signed"] = True
                elif first_item == "nicht signiert":
                    metadata["signed"] = False
                else:
                    metadata["signed"] = None
            else:
                # If it's not a list or null
                metadata["signed"] = None

    return document


# Example usage
if __name__ == "__main__":
    input_file = "input.json"
    output_file = "output.json"

    try:
        with open(input_file, "r", encoding="utf-8") as f:
            document = json.load(f)

        transformed = transform_photos(document)

        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(transformed, f, indent=4, ensure_ascii=False)

        print("Transformation complete. Output saved to output.json")

    except FileNotFoundError:
        print(f"Error: '{input_file}' not found.")
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON format in '{input_file}'.")
