const fs = require("node:fs");
const path = require("node:path");

const imageName = fs
  .readdirSync(__dirname)
  .find((fileName) => /\.(png|jpe?g)$/i.test(fileName));
const imagePath = imageName ? path.join(__dirname, imageName) : null;
let cachedImage = "";
let cachedSize = "";

const loadWallpaper = async () => {
  if (!imagePath) {
    throw new Error("No PNG or JPEG wallpaper was found.");
  }

  const { default: terminalImage } = await import("terminal-image");
  const size = `${process.stdout.columns}x${Math.max(1, process.stdout.rows - 1)}`;

  if (cachedImage && cachedSize === size) {
    return cachedImage;
  }

  cachedImage = await terminalImage.file(imagePath, {
    width: process.stdout.columns,
    height: Math.max(1, process.stdout.rows - 1),
    preserveAspectRatio: false,
    preferNativeRender: false,
  });
  cachedSize = size;

  return cachedImage;
};

const renderWallpaper = (image) => {
  process.stdout.write("\x1b[H");
  process.stdout.write(image);
};

module.exports = { loadWallpaper, renderWallpaper };
