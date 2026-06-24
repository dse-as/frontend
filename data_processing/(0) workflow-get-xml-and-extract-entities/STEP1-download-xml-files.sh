#!/bin/bash

# Check if the correct number of arguments is provided
if [ $# -ne 2 ]; then
    echo "Usage: $0 USERNAME PASSWORD (!!escape special characters in password!!)"
    exit 1
fi

# Set your WebDAV URL here
WEBDAV_URL="https://dav.annemarie-schwarzenbach.ch/data/sources/tei"
USERNAME="$1"
PASSWORD="$2"
DOCTYPE="letter"
OUTPUT_DIR="downloaded_files_test"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Loop through the specified ranges
for i in $(seq -w 00 01); do
    for j in $(seq -w 00 10); do
        FILE_NAME="${DOCTYPE}_${i}${j}.xml"
        FILE_URL="${WEBDAV_URL}/${DOCTYPE}s/${i}/${FILE_NAME}"

        # Download the file using curl
        curl -u "$USERNAME:$PASSWORD" -O "$FILE_URL"

        # Check if the file was downloaded successfully
        if [ -f "$FILE_NAME" ]; then
            # Move the file to the output directory
            mv "$FILE_NAME" "$OUTPUT_DIR/"
        fi
    done
done
