import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../config/supabase';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2, Search, Image as ImageIcon, Loader, X, Upload, FileImage, Layers } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { deleteImage } from '../../utils/uploadUtils';

const AdminGallery = () => {
    const { addToast } = useToast();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState(null); // 'embroidery' or 'mehndi'
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');
    const [deletePendingId, setDeletePendingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(''); 
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

    // Categories
    const MEHNDI_CATEGORIES = ['Arabic Mehndi', 'Indian (Traditional) Mehndi', 'Bridal Mehndi', 'Minimal / Modern Mehndi'];
    const SINGLE_IMAGE_CATEGORIES = ['Hand Embroidery', 'Art', 'Custom Design', 'Gifts', 'Home Decor', 'Other'];

    const fetchGallery = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('gallery')
                .select('id, title, description, image_url, images, category, created_at')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setImages(data || []);
        } catch (error) {
            console.error('Error fetching gallery:', error);
            addToast('Failed to load gallery images', 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchGallery();
    }, [fetchGallery]);

    const handleOpenModal = (mode) => {
        setModalMode(mode);
        setTitle('');
        setDescription('');
        setSelectedFiles([]);
        setPreviews([]);
        setUploadProgress('');
        
        if (mode === 'single') {
            setSelectedCategory(SINGLE_IMAGE_CATEGORIES[0]);
        } else {
            setSelectedCategory(MEHNDI_CATEGORIES[0]);
        }
        setIsModalOpen(true);
    };

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Validations
        if (modalMode === 'single' && files.length > 1) {
            addToast('Please select only 1 image for this category.', 'error');
            return;
        }
        if (modalMode === 'mehndi' && files.length > 4) {
            addToast('Maximum 4 images allowed for Mehndi.', 'error');
            return;
        }

        const newPreviews = [];
        const validFiles = [];

        // Preview generation
        files.forEach(file => {
             validFiles.push(file);
             newPreviews.push(URL.createObjectURL(file));
        });

        setSelectedFiles(validFiles);
        setPreviews(newPreviews);
    };

    const compressImage = async (file) => {
        const options = {
            maxSizeMB: 0.19, // ~195KB, ensuring < 200KB
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: 'image/webp' // Convert to webp for better compression
        };
        try {
            const compressedFile = await imageCompression(file, options);
            return compressedFile;
        } catch (error) {
            console.error("Compression error:", error);
            return file; // Fallback to original
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedFiles.length === 0) {
            addToast('Please select at least one image', 'error');
            return;
        }
        if (!title) {
            addToast('Please enter a title', 'error');
            return;
        }

        setUploading(true);
        setUploadProgress('Compressing images...');

        try {
            const imageUrls = [];

            // 1. Process each file
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                
                // Compress
                setUploadProgress(`Compressing image ${i + 1}/${selectedFiles.length}...`);
                const compressedFile = await compressImage(file);
                
                // Upload
                setUploadProgress(`Uploading image ${i + 1}/${selectedFiles.length}...`);
                const fileExt = 'webp'; // Since we convert to webp
                const fileName = `gallery_${Date.now()}_${i}.${fileExt}`;
                const filePath = `gallery/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('images')
                    .upload(filePath, compressedFile, {
                        cacheControl: '3600',
                        contentType: 'image/webp'
                    });

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('images')
                    .getPublicUrl(filePath);
                
                imageUrls.push(publicUrl);
            }

            // 2. Insert into Database
            setUploadProgress('Saving to gallery...');
            
            const { error: dbError } = await supabase
                .from('gallery')
                .insert([{
                    title: title,
                    category: selectedCategory,
                    description: description,
                    image_url: imageUrls[0], // Primary image
                    images: imageUrls,       // All images
                    created_at: new Date().toISOString()
                }]);

            if (dbError) throw dbError;

            addToast('Gallery item added successfully', 'success');
            setIsModalOpen(false);
            fetchGallery();

        } catch (error) {
            console.error('Error adding gallery item:', error);
            addToast(error.message || 'Failed to add item.', 'error');
        } finally {
            setUploading(false);
            setUploadProgress('');
        }
    };

    const handleDelete = async (item) => {
        if (deletePendingId !== item.id) {
            setDeletePendingId(item.id);
            addToast('Tap delete again to remove this item and its images.', 'error');
            return;
        }
        setDeletePendingId(null);

        try {
            // 1. Delete actual files from storage
            const filesToDelete = [];
            if (item.image_url) filesToDelete.push(item.image_url);
            if (item.images && Array.isArray(item.images)) {
                item.images.forEach(img => {
                    if (img !== item.image_url) filesToDelete.push(img);
                });
            }

            // Execute storage deletions in parallel
            await Promise.all(filesToDelete.map(url => deleteImage(url)));

            // 2. Delete database record
            const { error } = await supabase
                .from('gallery')
                .delete()
                .eq('id', item.id);

            if (error) throw error;

            setImages(prev => prev.filter(img => img.id !== item.id));
            addToast('Image and storage files deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting image:', error);
            addToast('Failed to delete image fully', 'error');
        }
    };

    const filteredImages = images.filter(img => 
        img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-heading font-bold text-stone-900">Gallery Manager</h1>
                  <p className="text-stone-500 text-sm mt-0.5">Manage your single images and mehndi designs</p>
                </div>
                
                <div className="flex flex-wrap w-full md:w-auto items-center gap-2">
                    <button
                        onClick={() => handleOpenModal('single')}
                        className="flex-1 md:flex-none justify-center flex items-center gap-2 bg-rose-900 text-white px-4 py-2.5 rounded-xl hover:bg-rose-800 transition-colors shadow-sm text-sm font-bold tracking-wide"
                    >
                        <FileImage className="w-4 h-4" />
                        Single Image
                    </button>
                    <button
                        onClick={() => handleOpenModal('mehndi')}
                        className="flex-1 md:flex-none justify-center flex items-center gap-2 bg-stone-900 text-white px-4 py-2.5 rounded-xl hover:bg-stone-800 transition-colors shadow-sm text-sm font-bold tracking-wide"
                    >
                        <Layers className="w-4 h-4" />
                        Mehndi Design
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search gallery..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-0 focus:ring-2 focus:ring-rose-900/20 transition-all font-medium text-stone-800"
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex justify-center py-12">
                        <Loader className="animate-spin text-pink-500" />
                    </div>
                ) : filteredImages.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No images found. Add some to get started!
                    </div>
                ) : (
                    filteredImages.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-0 overflow-hidden group">
                            <div className="relative aspect-video">
                                <img
                                    src={item.image_url}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => handleDelete(item)}
                                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="absolute top-2 right-2 flex gap-1">
                                    {item.images && item.images.length > 1 && (
                                        <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm flex items-center gap-1">
                                            <Layers size={12} /> +{item.images.length - 1}
                                        </span>
                                    )}
                                    <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                                        {item.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                                {item.description && (
                                    <p className="text-gray-500 text-sm line-clamp-1">{item.description}</p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-stone-900/40 flex items-end sm:items-center justify-center sm:p-4 z-50 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95">
                        <div className="p-5 border-b border-stone-100 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur z-10">
                            <h2 className="text-xl font-heading font-bold text-stone-900">
                                {modalMode === 'single' ? 'Add Single Image' : 'Add Mehndi Design'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600 p-2 bg-stone-50 rounded-full hover:bg-stone-100 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 space-y-5">
                            {/* Image Upload */}
                            <div className="space-y-4">
                                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                                    previews.length > 0 ? 'border-rose-900 bg-rose-50/50' : 'border-stone-200 hover:border-rose-300'
                                }`}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple={modalMode === 'mehndi'}
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label htmlFor="image-upload" className="cursor-pointer block">
                                        <div className="w-14 h-14 bg-rose-50 text-rose-900 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <p className="text-stone-900 font-bold text-sm mb-1">
                                            Click to upload {modalMode === 'mehndi' ? '(Max 4)' : '(1 image)'}
                                        </p>
                                        <p className="text-stone-400 text-xs">
                                            Images will be compressed to &lt; 200KB
                                        </p>
                                    </label>
                                </div>

                                {/* Previews */}
                                {previews.length > 0 && (
                                    <div className="grid grid-cols-4 gap-2">
                                        {previews.map((src, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-stone-200">
                                                <img src={src} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-lg border-none bg-stone-50 focus:bg-white focus:ring-2 focus:ring-rose-900/20 outline-none transition-all font-medium text-stone-900"
                                    placeholder="e.g., Red Velvet Bridal"
                                />
                            </div>

                            {/* Category Selection */}
                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">Category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-lg border-none bg-stone-50 focus:bg-white focus:ring-2 focus:ring-rose-900/20 outline-none transition-all font-medium text-stone-900"
                                >
                                    {(modalMode === 'single' ? SINGLE_IMAGE_CATEGORIES : MEHNDI_CATEGORIES).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">Description (Optional)</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows="3"
                                    className="w-full px-4 py-2.5 rounded-lg border-none bg-stone-50 focus:bg-white focus:ring-2 focus:ring-rose-900/20 outline-none transition-all font-medium text-stone-900 resize-none"
                                    placeholder="Add details about the design..."
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full bg-rose-900 text-white py-3.5 rounded-xl font-bold tracking-wide hover:bg-rose-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                            >
                                {uploading ? (
                                    <>
                                        <Loader className="animate-spin w-5 h-5" />
                                        {uploadProgress}
                                    </>
                                ) : (
                                    'Save to Gallery'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminGallery;
