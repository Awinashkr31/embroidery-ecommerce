import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// By default, scan the public/promo-images folder, or pass a folder path as an argument
const targetDir = process.argv[2] 
  ? path.resolve(process.cwd(), process.argv[2]) 
  : path.resolve(__dirname, '../public/promo-images');

async function convertToWebP(directory) {
  try {
    const files = await fs.readdir(directory);

    let convertedCount = 0;

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
        const inputPath = path.join(directory, file);
        const outputFilename = `${path.basename(file, ext)}.webp`;
        const outputPath = path.join(directory, outputFilename);

        console.log(`Converting: ${file} -> ${outputFilename}`);
        
        await sharp(inputPath)
          .webp({ quality: 80 }) // 80 is a good balance between quality and file size
          .toFile(outputPath);

        convertedCount++;
      }
    }

    if (convertedCount === 0) {
      console.log(`No JPG/PNG images found in ${directory}. They might already be WebP!`);
    } else {
      console.log(`✅ Successfully converted ${convertedCount} images to WebP.`);
      console.log('You can now delete the original .jpg/.png files if you no longer need them.');
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Error: Directory not found -> ${directory}`);
    } else {
      console.error('Error converting images:', error);
    }
  }
}

console.log(`Scanning directory for images to convert: ${targetDir}`);
convertToWebP(targetDir);
