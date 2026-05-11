from PIL import Image
import os

def remove_white_background(image_path, output_path=None, tolerance=30):
    try:
        img = Image.open(image_path).convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Check if pixel is close to white (255, 255, 255)
            # Using a tolerance for "near white"
            if item[0] > 255 - tolerance and item[1] > 255 - tolerance and item[2] > 255 - tolerance:
                newData.append((255, 255, 255, 0))  # Transparent
            else:
                newData.append(item)

        img.putdata(newData)
        
        # Also crop it if we are processing the favicon (v2)
        if "v2" in output_path:
             bbox = img.getbbox()
             if bbox:
                 img = img.crop(bbox)

        if output_path:
            img.save(output_path, "PNG")
            print(f"Saved transparent image to {output_path}")
        else:
            img.save(image_path, "PNG")
            print(f"Overwrote {image_path} with transparent version")

    except Exception as e:
        print(f"Error processing {image_path}: {e}")

if __name__ == "__main__":
    # Fix the generated favicon (v2) which likely has the white background
    remove_white_background("/Users/Jodie/Desktop/PsychologyFinladn/img/logo-symbol.png", "/Users/Jodie/Desktop/PsychologyFinladn/img/logo-symbol-v2.png", tolerance=50)
    print("Processed logo-symbol-v2.png")
