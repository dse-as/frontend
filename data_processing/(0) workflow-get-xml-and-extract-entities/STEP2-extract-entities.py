import os
import xml.etree.ElementTree as ET
import json

# Specify the directory containing your XML files
directory = "downloaded_files"
json_output_1 = "documents_data.json"
json_output_2 = "entities_mapping.json"

# Prepare dictionaries to hold the extracted data
documents_data = {}
entities_mapping = {}

# Define the namespace if one exists; adjust as necessary
namespaces = {
    'tei': 'http://www.tei-c.org/ns/1.0'
}

# Loop through files in the directory from 0001 to 0800 for specified document types
for doctype in ["smallform", "letter"]:
    for i in range(1, 801):  # From 0001 to 0800
        filename = f"{doctype}_{str(i).zfill(4)}.xml"  # Format as {doctype}_XXXX
        file_path = os.path.join(directory, filename)

        if os.path.isfile(file_path):
            try:
                # Parse the XML file
                tree = ET.parse(file_path)
                root = tree.getroot()

                # Initialize a temporary dictionary to gather entities
                entities = {}

                # Extract entities using the namespace
                for entities_elem in root.findall('.//tei:textClass//tei:entities', namespaces):
                    ana = entities_elem.get('ana')
                    if ana:
                        if ana not in entities:
                            entities[ana] = []
                        for item in entities_elem.findall('.//tei:item', namespaces):
                            same_as = item.get('sameAs')
                            if same_as:
                                entities[ana].append(same_as)

                # Add data to the documents_data dictionary
                documents_data[filename] = entities

                # Update entities_mapping, organizing by ana type
                for ana, items in entities.items():
                    if ana not in entities_mapping:
                        entities_mapping[ana] = {}
                    for item in items:
                        if item not in entities_mapping[ana]:
                            entities_mapping[ana][item] = []
                        entities_mapping[ana][item].append(filename)

            except ET.ParseError as e:
                print(f"Error parsing {filename}: {e}")
            except Exception as e:
                print(f"An unexpected error occurred with {filename}: {e}")

# Save documents_data to JSON
with open(json_output_1, 'w') as f:
    json.dump(documents_data, f, indent=2)

# Save entities_mapping to JSON
with open(json_output_2, 'w') as f:
    json.dump(entities_mapping, f, indent=2)

print(f"Data saved to {json_output_1} and {json_output_2}.")
