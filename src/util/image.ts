import sharp from "sharp";

export async function withResizedPngImage(
  file: Blob,
  handler: (resized: Blob) => Promise<Response>
): Promise<Response> {
  try {
    const arrBuffer = await file.arrayBuffer();
    const resizedBuffer = await sharp(arrBuffer)
      .resize(500, 500, { fit: "contain" })
      .withMetadata()
      .png({ quality: 100 })
      .toBuffer({ resolveWithObject: true });

    const resizedFile = new Blob([resizedBuffer.data], {
      type: `image/${resizedBuffer.info.format}`,
    });

    return handler(resizedFile);
  } catch (error) {
    return new Response("Image Resize Error", { status: 500 });
  }
}
