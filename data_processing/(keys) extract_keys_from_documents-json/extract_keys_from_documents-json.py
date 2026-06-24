import json
from pathlib import Path

def get_unique_keys(data_list):
    """
    Recursively collects all dictionary keys from a list of objects,
    returning a unique list of strings.
    """
    keys = set()

    def extract(obj):
        if isinstance(obj, dict):
            for k, v in obj.items():
                keys.add(k)
                extract(v)  # Recurse into nested values
        elif isinstance(obj, list):
            for item in obj:
                extract(item)

    if isinstance(data_list, list):
        for item in data_list:
            extract(item)
    elif isinstance(data_list, dict):
        extract(data_list)

    return sorted(list(keys))

def main():
    input_file = "documents.json"
    output_dir = Path(".")

    # Mapping of source section to output filename
    sections = {
        "smallforms": "smallform_keys.json",
        "longforms": "longform_keys.json",
        "letters": "letter_keys.json",
        "photos": "photo_keys.json"
    }

    try:
        with open(input_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        documents = data.get("documents", {})

        for section_key, output_filename in sections.items():
            if section_key not in documents:
                print(f"Warning: Section '{section_key}' not found in documents.json. Skipping.")
                continue

            section_data = documents[section_key]
            unique_keys = get_unique_keys(section_data)

            output_path = output_dir / output_filename
            with open(output_path, "w", encoding="utf-8") as out_f:
                json.dump(unique_keys, out_f, indent=2, ensure_ascii=False)

            print(f"Extracted {len(unique_keys)} keys to {output_filename}")

    except FileNotFoundError:
        print(f"Error: Could not find {input_file}. Make sure it's in the current directory.")
    except json.JSONDecodeError:
        print(f"Error: {input_file} is not valid JSON.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    main()
