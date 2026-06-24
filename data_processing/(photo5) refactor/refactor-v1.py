import json
import re

def transform_photos(document):
    """
    Process the photos section of a document.
    1. Delete 'photo_id' inside metadata
    2. Remove '[SLA-...]' pattern from the 'label' field
    3. Rename 'id_sla' to 'sla_id_full' (effectively deleting 'id_sla')
    4. Split 'id_sla' at '/' into 'sla_id_coll' and 'sla_id_img'
    """

    if "documents" not in document or "photos" not in document["documents"]:
        print("Warning: No 'documents' or 'photos' key found")
        return document

    photos = document["documents"]["photos"]

    for photo_key, photo_data in photos.items():
        # Skip if no metadata
        if "metadata" not in photo_data:
            continue

        metadata = photo_data["metadata"]

        # (1) Delete 'photo_id' inside metadata
        if "photo_id" in metadata:
            del metadata["photo_id"]

        # (2) Remove '[SLA-...]' from label using regex
        if "label" in photo_data:
            # Removes [SLA-anything] including brackets, then strips extra whitespace
            photo_data["label"] = re.sub(r'\[SLA-[^\]]*\]', '', photo_data["label"]).strip()

        # (3) & (4) Handle id_sla transformations
        if "id_sla" in metadata:
            # .pop() removes 'id_sla' and returns its value
            # This satisfies requirement (3): rename (by replacing) and delete old key
            sla_value = metadata.pop("id_sla")

            # Assign to new keys
            metadata["sla_id_full"] = sla_value

            # Split at '/' for parts 4
            parts = sla_value.split("/", 1) # split only on first slash just in case
            metadata["sla_id_coll"] = parts[0]

            # Handle case where there is no slash (though unlikely based on your data)
            metadata["sla_id_img"] = parts[1] if len(parts) > 1 else ""

    return document


# Example usage
if __name__ == "__main__":
    # Load from file
    try:
        with open("input.json", "r", encoding="utf-8") as f:
            document = json.load(f)

        # Transform the document
        transformed = transform_photos(document)

        # Save output
        with open("output.json", "w", encoding="utf-8") as f:
            json.dump(transformed, f, indent=4, ensure_ascii=False)

        print("Transformation complete. Output saved to output.json")

    except FileNotFoundError:
        print("Error: input.json not found.")
    except json.JSONDecodeError:
        print("Error: Invalid JSON format in input.json.")
