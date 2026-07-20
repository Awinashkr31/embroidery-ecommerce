import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = path.join(process.cwd(), 'public', 'category-images');

async function compressImages() {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.webp') && !f.startsWith('temp_'));
    
    for (const file of files) {
        const filepath = path.join(dir, file);
        const tempPath = path.join(dir, `temp_${file}`);
        
        try {
            await sharp(filepath)
                .resize(250, 250, { fit: 'cover' })
                .webp({ quality: 50, effort: 6 })
                .toFile(tempPath);
                
            const stats = fs.statSync(tempPath);
            const originalStats = fs.statSync(filepath);
            
            console.log(`Compressed ${file}: ${(originalStats.size / 1024).toFixed(1)} KB -> ${(stats.size / 1024).toFixed(1)} KB`);
        } catch (e) {
            console.error(`Error compressing ${file}:`, e);
        }
    }
}

compressImages().then(() => {
    const files = fs.readdirSync(dir).filter(f => f.startsWith('temp_'));
    for (const file of files) {
        const originalName = file.replace('temp_', '');
        fs.copyFileSync(path.join(dir, file), path.join(dir, originalName));
        fs.unlinkSync(path.join(dir, file));
    }
});
