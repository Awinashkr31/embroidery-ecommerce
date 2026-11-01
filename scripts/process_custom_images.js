import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicCustomImagesDir = path.resolve(__dirname, '../public/custom-images');
fs.mkdirSync(publicCustomImagesDir, { recursive: true });

const uploads = [
  {
    src: 'C:/Users/awina/.gemini/antigravity/brain/ed4f97b1-4429-4fec-8148-1050849eb9f0/.user_uploaded/media_1793509232222_6ab6713b.jpg',
    dest: path.resolve(publicCustomImagesDir, 'custom_chick_flower.webp'),
    title: 'Crochet Chick with Flower',
    category: 'Handmade Plushies'
  },
  {
    src: 'C:/Users/awina/.gemini/antigravity/brain/ed4f97b1-4429-4fec-8148-1050849eb9f0/.user_uploaded/media_1793509232253_097793a3.jpg',
    dest: path.resolve(publicCustomImagesDir, 'custom_evil_eye.webp'),
    title: 'Crochet Evil Eye Hanging',
    category: 'Charms & Hangings'
  },
  {
    src: 'C:/Users/awina/.gemini/antigravity/brain/ed4f97b1-4429-4fec-8148-1050849eb9f0/.user_uploaded/media_1793509232263_a30a502d.jpg',
    dest: path.resolve(publicCustomImagesDir, 'custom_rose_band.webp'),
    title: 'Crochet Floral Rose Band',
    category: 'Hair & Wrist Accessories'
  },
  {
    src: 'C:/Users/awina/.gemini/antigravity/brain/ed4f97b1-4429-4fec-8148-1050849eb9f0/.user_uploaded/media_1793509232295_6f8630ff.jpg',
    dest: path.resolve(publicCustomImagesDir, 'custom_granny_bag.webp'),
    title: 'Granny Square Crochet Bag',
    category: 'Artisanal Bags'
  },
  {
    src: 'C:/Users/awina/.gemini/antigravity/brain/ed4f97b1-4429-4fec-8148-1050849eb9f0/.user_uploaded/media_1793509264141_814f5e90.jpg',
    dest: path.resolve(publicCustomImagesDir, 'custom_hair_barrette.webp'),
    title: 'Floral Crochet Hair Barrette',
    category: 'Hair Accessories'
  },
  {
    src: 'C:/Users/awina/.gemini/antigravity/brain/ed4f97b1-4429-4fec-8148-1050849eb9f0/.user_uploaded/media_1793509345700_d19452e3.jpg',
    dest: path.resolve(publicCustomImagesDir, 'custom_strawberry_pot.webp'),
    title: 'Hanging Strawberry Plant Pot',
    category: 'Flower Pots & Decor'
  }
];

async function main() {
  for (const item of uploads) {
    if (!fs.existsSync(item.src)) {
      console.error(`Not found: ${item.src}`);
      continue;
    }
    console.log(`Optimizing: ${item.title}`);
    await sharp(item.src)
      .resize({ width: 800, height: 800, fit: 'cover', position: 'center' })
      .webp({ quality: 82 })
      .toFile(item.dest);
    console.log(`Saved: ${item.dest}`);
  }
  console.log('Done optimizing all 6 custom masterpiece images!');
}

main().catch(console.error);

