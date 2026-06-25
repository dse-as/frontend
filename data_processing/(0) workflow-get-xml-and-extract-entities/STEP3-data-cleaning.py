import json

# Specify the JSON files to read and write
documents_json = "documents_data.json"
entities_json = "entities_mapping.json"

def replace_travel_id(data):
    """Replace incorrect travel ID with the correct ID."""
    incorrect_id = "travel_00015"
    correct_id = "travel_0015"

    # Perform the replacement
    for filename, entities in data.items():
        for ana, items in entities.items():
            if incorrect_id in items:
                items.append(correct_id)
                items.remove(incorrect_id)

def replace_travels_with_events(data):
    """Change 'travels' key to 'events'."""
    for filename, entities in data.items():
        if "travels" in entities:
            entities["events"] = entities.pop("travels")

def update_entities_mapping(data):
    """Update entities mapping by changing 'travels' to 'events'."""
    for ana in list(data.keys()):
        if ana == "travels":
            data["events"] = data.pop(ana)

def main():
    # Load documents_data.json
    with open(documents_json, 'r') as f:
        documents_data = json.load(f)

    # Apply corrections for documents_data
    replace_travels_with_events(documents_data)
    replace_travel_id(documents_data)

    # Save the updated documents_data to the same file
    with open(documents_json, 'w') as f:
        json.dump(documents_data, f, indent=2)

    # Load entities_mapping.json
    with open(entities_json, 'r') as f:
        entities_mapping = json.load(f)

    # Apply corrections for entities_mapping
    update_entities_mapping(entities_mapping)
    replace_travel_id(entities_mapping)

    # Save the updated entities_mapping to the same file
    with open(entities_json, 'w') as f:
        json.dump(entities_mapping, f, indent=2)

    print(f"Updated {documents_json} and {entities_json} successfully.")

if __name__ == "__main__":
    main()
