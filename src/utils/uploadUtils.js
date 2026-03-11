import { supabase } from '../config/supabase';
import imageCompression from 'browser-image-compression';

/**
 * Compresses an image file to ensure it's optimized for web (max 200KB)
 * @param {File} file 
 * @param {number} maxWidth - Max width of the image (default 1920px)
 */
export const compressImage = async (file, maxWidth = 1920) => {
  try {
    const options = {
      maxSizeMB: 0.2,          // 200KB max size
      maxWidthOrHeight: maxWidth,
      useWebWorker: true,
      fileType: 'image/jpeg'
    };
    
    // browser-image-compression helps match the 0.2MB limit iteratively
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Compression failed:", error);
    // Fallback: return original if compression fails
    return file;
  }
};

/**
 * Uploads a file to Supabase Storage
 * @param {File} file 
 * @param {string} bucketName - storage bucket (default 'images')
 * @param {string} folder - optional subfolder
 * @returns {Promise<string>} Public URL of the uploaded image
 */
export const uploadImage = async (file, bucketName = 'images', folder = '') => {
  try {
    if (!file) throw new Error("No file provided");

    // 1. Compress
    const compressedFile = await compressImage(file);
    
    // 2. Create unique file name to avoid collisions
    const fileExt = 'jpg'; // We convert to jpg in compression
    const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`;
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
 * Deletes an image from Supabase storage.
 * Automatically infers the bucket name from the public URL.
 * The URL format is: .../storage/v1/object/public/{bucketName}/{path}
 *
 * @param {string} publicUrl - The full public URL of the image
 * @param {string} [bucketName] - Optional explicit bucket override (defaults to auto-detect from URL)
 * @returns {Promise<boolean>} - Success status
 */
export const deleteImage = async (publicUrl, bucketName) => {
    if (!publicUrl) return false;

    try {
        // Auto-detect bucket from URL if not provided.
        // URL format: https://{project}.supabase.co/storage/v1/object/public/{bucket}/{path}
        let bucket = bucketName;
        let filePath;

        if (!bucket) {
            const storagePrefix = '/storage/v1/object/public/';
            const storageIndex = publicUrl.indexOf(storagePrefix);
            if (storageIndex === -1) return false;

            const afterPrefix = publicUrl.slice(storageIndex + storagePrefix.length);
            const slashIndex = afterPrefix.indexOf('/');
            if (slashIndex === -1) return false;

            bucket = afterPrefix.slice(0, slashIndex);
            filePath = afterPrefix.slice(slashIndex + 1);
        } else {
            // Use provided bucket, extract path after bucket segment
            const bucketSegment = `/public/${bucket}/`;
            const pathIndex = publicUrl.indexOf(bucketSegment);
            if (pathIndex === -1) return false;
            filePath = publicUrl.slice(pathIndex + bucketSegment.length);
        }

        if (!filePath) return false;

        const { error } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

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
