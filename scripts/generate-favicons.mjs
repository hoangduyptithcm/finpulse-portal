import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

async function main() {
  const rootDir = process.cwd();
  const svgPath = path.join(rootDir, "src", "app", "icon.svg");
  const svgBuffer = await fs.readFile(svgPath);

  // Generate PNG sizes
  const sizes = [16, 32, 48, 64, 180, 192, 512];
  const pngBuffers = {};

  for (const size of sizes) {
    pngBuffers[size] = await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toBuffer();
  }

  // Save Apple Touch Icon
  await fs.writeFile(path.join(rootDir, "src", "app", "apple-icon.png"), pngBuffers[180]);
  await fs.writeFile(path.join(rootDir, "public", "apple-touch-icon.png"), pngBuffers[180]);

  // Save standard PNGs in public
  await fs.writeFile(path.join(rootDir, "public", "favicon-16x16.png"), pngBuffers[16]);
  await fs.writeFile(path.join(rootDir, "public", "favicon-32x32.png"), pngBuffers[32]);
  await fs.writeFile(path.join(rootDir, "public", "icon-192.png"), pngBuffers[192]);
  await fs.writeFile(path.join(rootDir, "public", "icon-512.png"), pngBuffers[512]);

  // Create standard multi-size .ico (16, 32, 48)
  const icoSizes = [16, 32, 48];
  const icoItems = icoSizes.map((size) => ({
    width: size,
    height: size,
    buffer: pngBuffers[size],
  }));

  const count = icoItems.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO format
  header.writeUInt16LE(count, 4); // count of images

  let offset = 6 + count * 16;
  const dirEntries = [];
  for (const item of icoItems) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.width >= 256 ? 0 : item.width, 0);
    entry.writeUInt8(item.height >= 256 ? 0 : item.height, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(item.buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    dirEntries.push(entry);
    offset += item.buffer.length;
  }

  const icoBuffer = Buffer.concat([
    header,
    ...dirEntries,
    ...icoItems.map((item) => item.buffer),
  ]);

  // Overwrite both src/app/favicon.ico and public/favicon.ico
  await fs.writeFile(path.join(rootDir, "src", "app", "favicon.ico"), icoBuffer);
  await fs.writeFile(path.join(rootDir, "public", "favicon.ico"), icoBuffer);

  console.log("Successfully generated all FinPulse favicons and icons!");
}

main().catch((err) => {
  console.error("Error generating favicons:", err);
  process.exit(1);
});
