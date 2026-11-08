"""Upscale one image 2x with Swin2SR (classical, ONNX). Called by scripts/portrait.mjs.

Usage: python -I scripts/upscale.py <model.onnx> <input.png> <output.png>

Classical super-resolution is trained to be faithful to the input (it sharpens edges and reduces JPEG blocking),
unlike generative models that invent detail, so it is safe for a real portrait. Needs: pip install onnxruntime numpy pillow
"""

import sys

import numpy as np
import onnxruntime as ort
from PIL import Image

model, source, target = sys.argv[1:4]
session = ort.InferenceSession(model, providers=["CPUExecutionProvider"])

pixels = np.asarray(Image.open(source).convert("RGB"), dtype=np.float32) / 255.0
height, width, _ = pixels.shape
# The model works in windows of 8 pixels, so pad (by reflection) to a multiple of 8, then crop the result back.
padded = np.pad(pixels, ((0, (-height) % 8), (0, (-width) % 8), (0, 0)), mode="reflect")
result = session.run(None, {"pixel_values": padded.transpose(2, 0, 1)[None]})[0][0]
result = np.clip(result.transpose(1, 2, 0), 0, 1)[: height * 2, : width * 2]
Image.fromarray((result * 255.0 + 0.5).astype(np.uint8)).save(target)
