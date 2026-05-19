/**
 * Static Image Optimizer
 * Converts PNG/JPG images in /public to WebP with size targets:
 *   - Hero/banner images: <150KB
 *   - Product images: <80KB
 *   - Logos/icons: best effort with transparency preserved
 * 
 * Uses Sharp (same engine as Squoosh) for compression.
 * Run: node scripts/optimize-images.mjs
 */

import sharp from 'sharp';
import { readdir, stat, mkdir, copyFile } from 'fs/promises';
import { join, extname, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');
const BACKUP_DIR = join(__dirname, '..', 'public', '_originals');

// Size targets in bytes
const SIZE_TARGETS = {
  hero: 150 * 1024,     // 150KB for hero/banner images
  product: 80 * 1024,   // 80KB for product images
  logo: 30 * 1024,      // 30KB for logos
  icon: 20 * 1024,      // 20KB for icons
};

// Classify images by their name
function classifyImage(filename) {
  const name = filename.toLowerCase();
  if (name.includes('hero') || name.includes('banner') || name.includes('all-creations')) return 'hero';
  if (name.includes('product')) return 'product';
  if (name.includes('logo')) return 'logo';
  if (name.includes('icon')) return 'icon';
  return 'hero'; // default to hero (most permissive)
}

// Get quality that achieves target size
async function findOptimalQuality(inputPath, targetBytes, format = 'webp') {
  let low = 10, high = 90, bestQuality = 70, bestSize = Infinity;

  for (let i = 0; i < 8; i++) { // binary search, max 8 iterations
    const mid = Math.round((low + high) / 2);
    let buffer;

    if (format === 'webp') {
      buffer = await sharp(inputPath)
        .webp({ quality: mid, effort: 6 })
        .toBuffer();
    } else if (format === 'avif') {
      buffer = await sharp(inputPath)
        .avif({ quality: mid, effort: 6 })
        .toBuffer();
    }

    if (buffer.length <= targetBytes) {
      bestQuality = mid;
      bestSize = buffer.length;
      low = mid + 1; // try higher quality
    } else {
      high = mid - 1; // need lower quality
    }
  }

  return { quality: bestQuality, estimatedSize: bestSize };
}

async function optimizeImage(filePath, filename) {
  const ext = extname(filename).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return null;

  const originalStats = await stat(filePath);
  const originalSize = originalStats.size;
  const category = classifyImage(filename);
  const target = SIZE_TARGETS[category];
  const nameWithoutExt = basename(filename, ext);

  console.log(`\n📷 ${filename}`);
  console.log(`   Category: ${category} | Original: ${(originalSize / 1024).toFixed(1)}KB | Target: <${(target / 1024).toFixed(0)}KB`);

  // Get image metadata
  const metadata = await sharp(filePath).metadata();
  const hasAlpha = metadata.hasAlpha;
  console.log(`   Dimensions: ${metadata.width}x${metadata.height} | Alpha: ${hasAlpha}`);

  // Backup original
  await mkdir(BACKUP_DIR, { recursive: true });
  await copyFile(filePath, join(BACKUP_DIR, filename));

  const results = [];

  // === WebP conversion ===
  const { quality: webpQuality } = await findOptimalQuality(filePath, target, 'webp');
  
  // For logos/icons with transparency, use lossless or near-lossless WebP
  let webpBuffer;
  if (hasAlpha && (category === 'logo' || category === 'icon')) {
    // Try near-lossless first
    webpBuffer = await sharp(filePath)
      .webp({ quality: Math.max(webpQuality, 75), effort: 6, nearLossless: true })
      .toBuffer();
    
    // If still too big, use lossy with alpha
    if (webpBuffer.length > target) {
      webpBuffer = await sharp(filePath)
        .webp({ quality: webpQuality, effort: 6, alphaQuality: 90 })
        .toBuffer();
    }
  } else {
    webpBuffer = await sharp(filePath)
      .webp({ quality: webpQuality, effort: 6 })
      .toBuffer();
  }

  const webpPath = join(PUBLIC_DIR, `${nameWithoutExt}.webp`);
  await sharp(webpBuffer).toFile(webpPath);
  const webpSize = webpBuffer.length;
  const webpSaving = ((1 - webpSize / originalSize) * 100).toFixed(1);
  console.log(`   ✅ WebP: ${(webpSize / 1024).toFixed(1)}KB (q${webpQuality}) → ${webpSaving}% smaller`);
  results.push({ format: 'webp', path: webpPath, size: webpSize, quality: webpQuality });

  // === AVIF conversion (best compression, slower) ===
  try {
    const { quality: avifQuality } = await findOptimalQuality(filePath, target, 'avif');
    const avifBuffer = await sharp(filePath)
      .avif({ quality: avifQuality, effort: 6 })
      .toBuffer();
    
    const avifPath = join(PUBLIC_DIR, `${nameWithoutExt}.avif`);
    await sharp(avifBuffer).toFile(avifPath);
    const avifSize = avifBuffer.length;
    const avifSaving = ((1 - avifSize / originalSize) * 100).toFixed(1);
    console.log(`   ✅ AVIF: ${(avifSize / 1024).toFixed(1)}KB (q${avifQuality}) → ${avifSaving}% smaller`);
    results.push({ format: 'avif', path: avifPath, size: avifSize, quality: avifQuality });
  } catch (e) {
    console.log(`   ⚠️  AVIF failed: ${e.message}`);
  }

  // === Also optimize the original PNG (keep for fallback) ===
  if (ext === '.png') {
    const optimizedPng = await sharp(filePath)
      .png({ quality: 80, compressionLevel: 9, effort: 10 })
      .toBuffer();
    
    if (optimizedPng.length < originalSize) {
      await sharp(optimizedPng).toFile(filePath);
      console.log(`   ✅ PNG optimized: ${(optimizedPng.length / 1024).toFixed(1)}KB (was ${(originalSize / 1024).toFixed(1)}KB)`);
    }
  }

  return { filename, originalSize, results };
}

async function main() {
  console.log('🖼️  Image Optimization — Static Assets');
  console.log('═'.repeat(50));
  console.log(`📂 Source: ${PUBLIC_DIR}`);
  console.log(`📦 Backups: ${BACKUP_DIR}\n`);

  const files = await readdir(PUBLIC_DIR);
  const imageFiles = files.filter(f => {
    const ext = extname(f).toLowerCase();
    return ['.png', '.jpg', '.jpeg'].includes(ext);
  });

  if (imageFiles.length === 0) {
    console.log('No images found to optimize.');
    return;
  }

  console.log(`Found ${imageFiles.length} images to optimize:`);
  imageFiles.forEach(f => console.log(`  • ${f}`));

  const allResults = [];
  for (const file of imageFiles) {
    const result = await optimizeImage(join(PUBLIC_DIR, file), file);
    if (result) allResults.push(result);
  }

  // Summary
  console.log('\n' + '═'.repeat(50));
  console.log('📊 OPTIMIZATION SUMMARY');
  console.log('═'.repeat(50));

  let totalOriginal = 0, totalWebp = 0, totalAvif = 0;

  for (const r of allResults) {
    totalOriginal += r.originalSize;
    const webp = r.results.find(x => x.format === 'webp');
    const avif = r.results.find(x => x.format === 'avif');
    if (webp) totalWebp += webp.size;
    if (avif) totalAvif += avif.size;

    console.log(`\n  ${r.filename}:`);
    console.log(`    Original: ${(r.originalSize / 1024).toFixed(1)}KB`);
    for (const fmt of r.results) {
      const meetsTarget = fmt.size <= SIZE_TARGETS[classifyImage(r.filename)];
      console.log(`    ${fmt.format.toUpperCase()}: ${(fmt.size / 1024).toFixed(1)}KB ${meetsTarget ? '✅' : '⚠️  OVER TARGET'}`);
    }
  }

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`  Total Original: ${(totalOriginal / 1024).toFixed(1)}KB`);
  if (totalWebp) console.log(`  Total WebP:     ${(totalWebp / 1024).toFixed(1)}KB (${((1 - totalWebp / totalOriginal) * 100).toFixed(1)}% saved)`);
  if (totalAvif) console.log(`  Total AVIF:     ${(totalAvif / 1024).toFixed(1)}KB (${((1 - totalAvif / totalOriginal) * 100).toFixed(1)}% saved)`);
  console.log(`\n✨ Done! Originals backed up to ${BACKUP_DIR}`);
  console.log('\n📝 Next steps:');
  console.log('  1. Update <img> tags to use <picture> with WebP/AVIF sources');
  console.log('  2. Update manifest.json icon references');
  console.log('  3. Test in browser DevTools → Network tab to verify sizes');
}

main().catch(console.error);
