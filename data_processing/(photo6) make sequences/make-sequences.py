import json
from collections import defaultdict

def transform_photos_to_sequences(input_json_path, output_json_path):
    """
    Transform photo documents grouped by sla_id_coll into sequences structure.
    """

    # Load input data
    with open(input_json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Get photos section safely
    photos = data.get('documents', {}).get('photos', {})

    # Group photos by sla_id_coll
    sequences = defaultdict(list)

    for photo_key, photo_data in photos.items():
        metadata = photo_data.get('metadata', {})
        sla_id_coll = metadata.get('sla_id_coll')

        if sla_id_coll:
            sequences[sla_id_coll].append(photo_key)

    # Build output structure
    output = {
        "sequences": {}
    }

    for sla_key, photo_list in sequences.items():
        output["sequences"][sla_key] = {
            "url_slug": None,
            "name": sla_key,
            "preamble": f'Fotografien aus "{sla_key}"',
            "docs": photo_list
        }

    # Write output to file
    with open(output_json_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"Successfully processed {len(photos)} photos into {len(sequences)} sequences")
    print(f"Output written to: {output_json_path}")


if __name__ == "__main__":
    # CONFIGURE THESE PATHS HERE:
    INPUT_FILE = "input.json"      # Your input file path
    OUTPUT_FILE = "output.json"    # Your desired output file path

    transform_photos_to_sequences(INPUT_FILE, OUTPUT_FILE)
