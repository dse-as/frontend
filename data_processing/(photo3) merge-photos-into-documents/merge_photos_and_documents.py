import json
from pathlib import Path

def copy_photos_to_documents():
    """Copy photos data from photos.json to documents.json"""

    # Define file paths
    photos_file = Path("photos.json")
    documents_file = Path("documents.json")

    try:
        # Check if photos.json exists
        if not photos_file.exists():
            print(f"Error: {photos_file} not found")
            return False

        # Read photos.json
        with open(photos_file, 'r', encoding='utf-8') as f:
            photos_data = json.load(f)

        # Extract the photos object
        if 'photos' not in photos_data:
            print("Error: 'photos' key not found in photos.json")
            return False

        photos_content = photos_data['photos']

        # Read existing documents.json if it exists
        if documents_file.exists():
            with open(documents_file, 'r', encoding='utf-8') as f:
                documents_data = json.load(f)
        else:
            documents_data = {}

        # Create the nested structure: documents -> photos
        documents_data.setdefault('documents', {})
        documents_data['documents']['photos'] = photos_content

        # Write to documents.json
        with open(documents_file, 'w', encoding='utf-8') as f:
            json.dump(documents_data, f, indent=2)

        print(f"Successfully copied photos to {documents_file}")
        return True

    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        return False
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False

if __name__ == "__main__":
    copy_photos_to_documents()
