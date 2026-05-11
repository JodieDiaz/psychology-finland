from PIL import Image
import os
import colorsys

def process_logo():
    input_file = "/Users/Jodie/Desktop/PsychologyFinladn/img/logo-text-final-source-v2.png"
    output_file = "/Users/Jodie/Desktop/PsychologyFinladn/img/logo-text-transparent.png"
    
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found")
        return

    try:
        img = Image.open(input_file).convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            r, g, b, a = item
            
            # Convert to HSV to check saturation
            # normalize to [0, 1]
            h, s, v = colorsys.rgb_to_hsv(r/255.0, g/255.0, b/255.0)
            
            # Grayscale/Checkerboard Squares have very low saturation (close to 0)
            # Letters (Purple/Blue) have higher saturation.
            # Depth/Shadow might have lower saturation, so we need a balance.
            
            # Typical background saturation is < 0.05
            # We also check for the brightness (Val)
            
            if s < 0.1: # Very low saturation = likely background
                # Also allow for pure white (which has s=0, v=1)
                # and typical grey square (s=0, v=0.8)
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        
        # Crop tight
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)
            print(f"Cropped to {bbox}")
            
        img.save(output_file, "PNG")
        print(f"Final professional logo saved to {output_file}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    process_logo()
