import json
import sys

def normalize_photo_structure(json_data):
    """
    Corrects the structure by:
    1. Moving 'facsimile' FROM metadata TO the photo root level.
    2. Moving 'repository', 'published_in', 'mentioned_in', 'comments_2'
       FROM the photo root level INTO 'metadata'.
    """
    photos = json_data.get('photos', {})

    # Fields that should definitely be inside metadata
    fields_to_move_down = ['repository', 'published_in', 'mentioned_in', 'comments_2']

    for photo_key, photo_value in photos.items():
        metadata = photo_value.get('metadata', {})

        # --- STEP 1: Move facsimile OUT of metadata to photo level ---
        facsimile_from_meta = metadata.pop('facsimile', None)

        if facsimile_from_meta:
            # If there was already a facsimile at the root, merge or replace?
            # Let's prefer the one from metadata if it exists, otherwise keep root.
            if 'facsimile' in photo_value:
                print(f"⚠️  Merging duplicate 'facsimile' in {photo_key}")
                photo_value['facsimile'].update(facsimile_from_meta)
            else:
                photo_value['facsimile'] = facsimile_from_meta

        # --- STEP 2: Move specific fields INTO metadata ---
        for field_name in fields_to_move_down:
            # Check if this field exists at the photo level (not inside metadata yet)
            if field_name in photo_value:
                value = photo_value.pop(field_name)
                metadata[field_name] = value

    return json_data

if __name__ == '__main__':
    input_file = 'input.json'
    output_file = 'output.json'

    # Handle command line arguments
    if len(sys.argv) >= 3:
        input_file = sys.argv[1]
        output_file = sys.argv[2]
    elif len(sys.argv) == 2:
        input_file = sys.argv[1]
        output_file = input_file.replace('.json', '_fixed.json')

    print(f"Processing: {input_file} -> {output_file}")

    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        transformed = normalize_photo_structure(data)

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(transformed, f, indent=2, ensure_ascii=False)

        print("✅ Structure normalized successfully!")

    except FileNotFoundError:
        print(f"❌ Error: File '{input_file}' not found.")
    except json.JSONDecodeError as e:
        print(f"❌ JSON Error: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
