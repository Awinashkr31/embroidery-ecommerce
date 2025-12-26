import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../config/supabase';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2, Search, Image as ImageIcon, Loader, X, Upload, FileImage, Layers } from 'lucide-react';
import imageCompression from 'browser-image-compression';

const AdminGallery = () => {
    const { addToast } = useToast();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState(null); // 'embroidery' or 'mehndi'
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');
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
                .select('*')
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
                    .upload(filePath, compressedFile);

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

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            const { error } = await supabase
                .from('gallery')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setImages(prev => prev.filter(img => img.id !== id));
            addToast('Image deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting image:', error);
            addToast('Failed to delete image', 'error');
        }
    };

    const filteredImages = images.filter(img => 
        img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    Gallery Manager
                </h1>
                
                <div className="flex gap-3">
                    <button
                        onClick={() => handleOpenModal('single')}
                        className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-rose-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                    >
                        <FileImage size={18} />
                        Add Single Image
                    </button>
                    <button
                        onClick={() => handleOpenModal('mehndi')}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                    >
                        <Layers size={18} />
                        Add Mehndi
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search gallery..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
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
                        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                            <div className="relative aspect-video">
                                <img
                                    src={item.image_url}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => handleDelete(item.id, item.image_url)}
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-800">
                                {modalMode === 'single' ? 'Add Single Image' : 'Add Mehndi Design'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Image Upload */}
                            <div className="space-y-4">
                                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                                    previews.length > 0 ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-400'
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
                                        <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Upload size={32} />
                                        </div>
                                        <p className="text-gray-900 font-medium mb-1">
                                            Click to upload {modalMode === 'mehndi' ? '(Max 4)' : '(1 image)'}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            Images will be compressed to &lt; 200KB
                                        </p>
                                    </label>
                                </div>

                                {/* Previews */}
                                {previews.length > 0 && (
                                    <div className="grid grid-cols-4 gap-2">
                                        {previews.map((src, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                                                <img src={src} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                                    placeholder="e.g., Red Velvet Bridal"
                                />
                            </div>

                            {/* Category Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                                >
                                    {(modalMode === 'single' ? SINGLE_IMAGE_CATEGORIES : MEHNDI_CATEGORIES).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows="3"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none resize-none"
                                    placeholder="Add details about the design..."
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full bg-gradient-to-r from-pink-600 to-rose-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {uploading ? (
                                    <>
                                        <Loader className="animate-spin" size={20} />
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
