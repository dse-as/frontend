import json

# Specify the input and output files
entities_json = "entities_mapping.json"
register_json = "register_orig.json"
updated_register_json = "register.json"

def fill_documents(register_data, entities_data):
    """Fill in documents for each category in the register based on entities mapping."""
    # Loop through each category in the register
    for category, items in register_data["register"].items():
        if category in entities_data:
            # Assign the corresponding documents for each item in the category
            for item_key in items.keys():
                if item_key in entities_data[category]:
                    documents = entities_data[category][item_key]
                    # Add documents as a new key under the item
                    items[item_key]["docs"] = documents

def main():
    # Load entities_mapping.json with UTF-8 encoding
    with open(entities_json, 'r', encoding='utf-8') as f:
        entities_mapping = json.load(f)

    # Load register.json with UTF-8 encoding
    with open(register_json, 'r', encoding='utf-8') as f:
        register_data = json.load(f)

    # Fill in documents in the register data
    fill_documents(register_data, entities_mapping)

    # Save the updated register data to a new JSON file with UTF-8 encoding
    with open(updated_register_json, 'w', encoding='utf-8') as f:
        json.dump(register_data, f, indent=2, ensure_ascii=False)

    print(f"Updated register saved to {updated_register_json}.")

if __name__ == "__main__":
    main()
