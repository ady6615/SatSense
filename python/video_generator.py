import os
from moviepy.editor import ImageSequenceClip

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

BEFORE_DIR = os.path.join(BASE_DIR, "../backend/uploads/before")
AFTER_DIR = os.path.join(BASE_DIR, "../backend/uploads/after")
OUTPUT_DIR = os.path.join(BASE_DIR, "../backend/uploads/video")

os.makedirs(OUTPUT_DIR, exist_ok=True)

def generate_video():
    images = []

    # Load BEFORE images
    before_images = sorted(os.listdir(BEFORE_DIR))
    for img in before_images:
        images.append(os.path.join(BEFORE_DIR, img))

    # Load AFTER images
    after_images = sorted(os.listdir(AFTER_DIR))
    for img in after_images:
        images.append(os.path.join(AFTER_DIR, img))

    if len(images) == 0:
        raise Exception("No images found to generate video")

    output_path = os.path.join(OUTPUT_DIR, "incident.mp4")

    clip = ImageSequenceClip(images, fps=1)
    clip.write_videofile(
        output_path,
        codec="libx264",
        audio=False
    )

    print("Video generated successfully")
    return output_path

if __name__ == "__main__":
    generate_video()
