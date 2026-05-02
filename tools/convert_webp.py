from PIL import Image
import sys

def convert_to_webp(input_path, output_path):
    try:
        with Image.open(input_path) as img:
            img.save(output_path, "WEBP", quality=85)
        print(f"Successfully converted {input_path} to {output_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python convert_webp.py <input> <output>")
    else:
        convert_to_webp(sys.argv[1], sys.argv[2])
