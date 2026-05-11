from PIL import Image
import os

def crop_image(image_path):
    try:
        img = Image.open(image_path)
        img = img.convert("RGBA")
        
        # Get the bounding box of the non-zero regions
        bbox = img.getbbox()
        
        if bbox:
            print(f"Original size: {img.size}")
            print(f"Bounding box: {bbox}")
            
            # Crop the image to the bounding box
            cropped_img = img.crop(bbox)
            
            # Save the result
            cropped_img.save(image_path)
            print(f"Successfully cropped {image_path}. New size: {cropped_img.size}")
        else:
            print("Image is completely transparent, nothing to crop.")
            
    except Exception as e:
        print(f"Error processing {image_path}: {e}")

if __name__ == "__main__":
    target_file = "/Users/Jodie/Desktop/PsychologyFinladn/img/logo-symbol.png"
    crop_image(target_file)
