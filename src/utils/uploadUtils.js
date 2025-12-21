import { supabase } from '../config/supabase';

/**
 * Compresses an image file to ensure it's optimized for web
 * @param {File} file 
 * @param {number} maxWidth - Max width of the image (default 1200px)
 * @param {number} quality - JPEG quality (0 to 1, default 0.8)
 */
export const compressImage = async (file, maxWidth = 1200, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    // If it's not an image, return original
    if (!file.type.match(/image.*/)) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize if larger than maxWidth
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          // Note: converting to jpeg for better compression
          const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        }, 'image/jpeg', quality);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Uploads a file to Supabase Storage
 * @param {File} file 
 * @param {string} bucketName - storage bucket (default 'images')
 * @param {string} folder - optional subfolder
 */
export const uploadImage = async (file, bucketName = 'images', folder = '') => {
  try {
    if (!file) throw new Error("No file provided");

    // 1. Compress
    const compressedFile = await compressImage(file);
    
    // 2. Create unique file name to avoid collisions
    const fileExt = 'jpg'; // We convert to jpg in compression
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // 3. Upload
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, compressedFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // 4. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

/**
 * Deletes an image from Supabase storage
 * @param {string} publicUrl - The full public URL of the image
 * @returns {Promise<boolean>} - Success status
 */
export const deleteImage = async (publicUrl) => {
    if (!publicUrl) return false;
    
    try {
        // Extract path from URL
        // Format: .../storage/v1/object/public/images/folder/file.jpg
        const path = publicUrl.split('/images/')[1];
        if (!path) return false;

        const { error } = await supabase.storage
            .from('images')
            .remove([path]);

        if (error) {
            console.error('Error deleting image:', error);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Delete exception:', error);
        return false;
    }
};
