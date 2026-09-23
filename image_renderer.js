const fs = require("node:fs");
const path = require("node:path");

const wallpapersDirectory = path.join(__dirname, "wallpapers");
const wallpaperNames = fs
  .readdirSync(wallpapersDirectory)
  .filter((fileName) => /\.(png|jpe?g)$/i.test(fileName))
  .sort();
let cachedImage = "";
let cachedKey = "";

const loadWallpaper = async (wallpaperIndex = 0) => {
  if (wallpaperNames.length === 0) {
    throw new Error("No PNG or JPEG wallpaper was found.");
  }

  const selectedIndex =
    ((wallpaperIndex % wallpaperNames.length) + wallpaperNames.length) %
    wallpaperNames.length;
  const imageName = wallpaperNames[selectedIndex];
  const imagePath = path.join(wallpapersDirectory, imageName);
  const { default: terminalImage } = await import("terminal-image");
  const size = `${process.stdout.columns}x${Math.max(1, process.stdout.rows - 1)}`;
  const cacheKey = `${selectedIndex}:${size}`;

  if (cachedImage && cachedKey === cacheKey) {
    return { image: cachedImage, name: imageName, index: selectedIndex };
  }

  cachedImage = await terminalImage.file(imagePath, {
    width: process.stdout.columns,
    height: Math.max(1, process.stdout.rows - 1),
    preserveAspectRatio: false,
    preferNativeRender: false,
  });
  cachedKey = cacheKey;

  return { image: cachedImage, name: imageName, index: selectedIndex };
};

const renderWallpaper = (image) => {
  process.stdout.write("\x1b[H");
  process.stdout.write(image);
};

module.exports = {
  getWallpaperCount: () => wallpaperNames.length,
  loadWallpaper,
  renderWallpaper,
};
