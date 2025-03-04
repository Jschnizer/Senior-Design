import csv
import json

def csv_to_json(csv_file, json_file, key_field, feature_fields):
    """
    Reads a CSV file and converts it to a JSON file.
    
    Parameters:
      csv_file: Path to the CSV file.
      json_file: Output JSON file.
      key_field: The CSV field to use as the key in the JSON mapping.
      feature_fields: List of fields to include in the output.
    """
    data = {}
    with open(csv_file, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            key = row[key_field]
            # Create a sub-dictionary that includes only the specified fields.
            data[key] = {field: row[field] for field in feature_fields if field in row}
    with open(json_file, 'w', encoding='utf-8') as jf:
        json.dump(data, jf, indent=2)
    print(f"Saved {json_file}")

if __name__ == '__main__':
    # Example usage: Suppose your public dataset CSV contains columns such as:
    # track_id, danceability, energy, tempo, valence, duration_ms
    csv_to_json(
        csv_file='msd_audio_features.csv',
        json_file='audio_features.json',
        key_field='track_id',
        feature_fields=['danceability', 'energy', 'tempo', 'valence', 'duration_ms']
    )

    # For metadata, assume the CSV contains track_id, name, artist, albumCover.
    csv_to_json(
        csv_file='msd_track_metadata.csv',
        json_file='track_details.json',
        key_field='track_id',
        feature_fields=['name', 'artist', 'albumCover']
    )
