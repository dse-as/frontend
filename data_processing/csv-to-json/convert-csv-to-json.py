import csv
import json
import argparse
import sys

# Configuration for array columns and their specific separators
ARRAY_CONFIG = {
    # Columns separated by Broken Bar (¦, U+00A6)
    "people_on_photo": "\u00a6",
    "signatures": "\u00a6",
    "captions_1": "\u00a6",
    "captions_2": "\u00a6",
    # Columns separated by Semicolon (;)
    "mentioned_in": ";",
    "published_in": ";"
}

DATE_COLUMN_NAME = "date_normalised"
ID_COLUMN_NAME = "photo_id"  # The column to use as the dictionary key
OLD_PREFIX = "image_"
NEW_PREFIX = "photo_"

def parse_date_range(date_str):
    """
    Parses a date string that can be:
    - A single ISO date -> {"from": date, "to": date}
    - Two dates separated by '/' -> {"from": start, "to": end}
    Returns a dict {'from': ..., 'to': ...} or None if empty.
    """
    if not date_str or date_str.strip() == '':
        return None

    date_str = date_str.strip()

    if '/' in date_str:
        parts = date_str.split('/')
        if len(parts) != 2:
            pass

        from_date = parts[0].strip()
        to_date = parts[1].strip()

        if not from_date or not to_date:
            return None

        return {"from": from_date, "to": to_date}
    else:
        return {"from": date_str, "to": date_str}

def convert_csv_to_json(csv_file, json_file):
    """
    Converts CSV to JSON.
    - Restructures output to {"photos": {id: record}}
    - Only transforms 'photo_id' values (and key) from 'image_' to 'photo_'.
    - Handles custom array separators and date parsing.
    """
    photos_dict = {}
    missing_ids = []

    try:
        with open(csv_file, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)

            for row_num, row in enumerate(reader, start=2):
                record = {}

                for key, value in row.items():
                    # Handle empty cells -> null
                    if value == '' or value is None:
                        record[key] = None
                        continue

                    value_stripped = value.strip()

                    # Special handling for the date column
                    if key == DATE_COLUMN_NAME:
                        parsed_date = parse_date_range(value_stripped)
                        record[key] = parsed_date

                    # Array conversion for specified columns
                    elif key in ARRAY_CONFIG:
                        separator = ARRAY_CONFIG[key]
                        items = [item.strip() for item in value_stripped.split(separator)]
                        # Filter out empty strings if trailing separator exists
                        record[key] = [item for item in items if item]

                    else:
                        # No prefix replacement here! Keep value exactly as is.
                        record[key] = value_stripped

                # --- Handle photo_id transformation specifically ---
                original_id = record.get(ID_COLUMN_NAME)

                if original_id is None:
                    missing_ids.append(row_num)
                    # Fallback key if ID is missing
                    photo_key = f"id_unknown_{row_num}"
                    record[ID_COLUMN_NAME] = photo_key
                else:
                    # ONLY replace prefix in the ID field itself
                    if isinstance(original_id, str) and original_id.startswith(OLD_PREFIX):
                        photo_key = original_id.replace(OLD_PREFIX, NEW_PREFIX, 1)
                    else:
                        photo_key = original_id

                    # Update the value inside the record to match the key
                    record[ID_COLUMN_NAME] = photo_key

                # Add record to dictionary using the transformed key
                photos_dict[photo_key] = record

        # Wrap in "photos" object
        final_output = {"photos": photos_dict}

        with open(json_file, mode='w', encoding='utf-8') as f_out:
            json.dump(final_output, f_out, indent=4, ensure_ascii=False)

        print(f"Successfully converted '{csv_file}' to '{json_file}'.")
        print(f"Total photos processed: {len(photos_dict)}")

        if missing_ids:
            print(f"Warning: {len(missing_ids)} row(s) were missing a 'photo_id':")
            for rnum in missing_ids[:5]:
                print(f"  Row {rnum}")

    except FileNotFoundError:
        print(f"Error: The file '{csv_file}' was not found.")
        sys.exit(1)
    except Exception as e:
        print(f"An error occurred: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convert CSV to JSON with specific photo_id transformation.")
    parser.add_argument("input", help="Path to the input CSV file")
    parser.add_argument("output", help="Path to the output JSON file")

    args = parser.parse_args()

    convert_csv_to_json(args.input, args.output)
