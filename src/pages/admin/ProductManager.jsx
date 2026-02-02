import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../context/CategoryContext';

import { Plus, Edit2, Trash2, X, Image as ImageIcon, Search, Filter, SortAsc, Loader, Upload, Shirt } from 'lucide-react';
import { uploadImage } from '../../utils/uploadUtils';
import ImageCropper from '../../components/ImageCropper';

const ProductManager = () => {
    const { products, addProduct, updateProduct, deleteProduct, toggleStock } = useProducts();
    const { categories: categoryObjects, addCategory, deleteCategory } = useCategories();
    // const { addToast } = useToast(); // Unused
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    
    // Map objects to simple array if needed, but objects {id, label} are better. 
    // Existing code uses strings. Let's adapt.
    const categories = categoryObjects.map(c => c.label);

    const [editingProduct, setEditingProduct] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Cropping State
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [cropImageSrc, setCropImageSrc] = useState(null);
    const [cropIndex, setCropIndex] = useState(0);
    
    // Search & Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    
    // Form State
    const initialProductState = {
        name: '',
        price: '',
        originalPrice: '',
        category: 'Home Decor',
        description: '',
        specifications: '',
        images: ['', '', ''], // [Front, Back, Close-up]
        stockQuantity: 10,
        featured: false,
        // Enhanced Fields
        sku: '',
        tags: '',
        color: '',
        // Clothing specific
        fabric: '', 
    };

    const initialClothingState = {
        gender: 'Women',
        fitType: 'Regular',
        neckType: 'Round',
        sleeveType: 'Full Sleeve',
        occasion: 'Festive',
        careInstructions: 'Machine wash cold. Do not bleach.',

        sizes: {}, // e.g., { 'S': 5, 'M': 5 }
        colors: [] // e.g. ["Red", "Blue"]
    };

    const [formData, setFormData] = useState(initialProductState);
    const [clothingData, setClothingData] = useState(initialClothingState);
    const [isClothing, setIsClothing] = useState(false);

    // const categories = ["Home Decor", "Accessories", "Art", "Gifts", "Jewelry", "Clothing", "Mens Ethnic", "Womens Ethnic"]; 
    // Now provided by context above ^
    const sizesList = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "Free"];
    const fabricTypes = ["Cotton", "Silk", "Linen", "Velvet", "Organza", "Georgette", "Chiffon", "Rayon", "Wool", "Denim", "Mixed/Blend", "Crepe", "Satin"];

    // Filtered Products Calculation
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const handleOpenModal = (product = null, type = 'standard') => {
        if (product) {
            setEditingProduct(product);
            
            // Hydrate standard fields
            setFormData({
                ...product,
                images: product.images && product.images.length >= 3 ? product.images : [
                    product.image || '', 
                    product.images?.[1] || '', 
                    product.images?.[2] || ''
                ]
            });

            // Hydrate clothing fields
            if (product.clothingInformation) {
                setClothingData({
                    ...product.clothingInformation,
                    colors: product.clothingInformation.colors || []
                });
                setIsClothing(true);
                // Hydrate enhanced fields from clothingInformation JSON if they exist there
                setFormData(prev => ({
                    ...prev,
                    sku: product.clothingInformation.sku || '',
                    tags: product.clothingInformation.tags || '',
                    color: product.clothingInformation.color || ''
                }));
            } else {
                setClothingData(initialClothingState);
                setIsClothing(!!product.fabric); // Legacy check
            }
        } else {
            setEditingProduct(null);
            setFormData({ 
                ...initialProductState, 
                category: type === 'clothing' ? 'Clothing' : 'Home Decor' 
            });
            setClothingData(initialClothingState);
            setIsClothing(type === 'clothing');
        }
        setIsModalOpen(true);
    };

    const handleImageUpload = (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.addEventListener('load', () => {
             setCropImageSrc(reader.result);
             setCropIndex(index);
             setCropModalOpen(true);
             // Reset file input value so same file can be selected again if needed
             e.target.value = null; 
        });
        reader.readAsDataURL(file);
    };

    const handleCropComplete = async (croppedBlob) => {
        if (!croppedBlob) {
            setCropModalOpen(false);
            return;
        }

        try {
            setUploading(true);
            setCropModalOpen(false); // Close modal while uploading

            // Convert Blob to File
            const file = new File([croppedBlob], `cropped-image-${Date.now()}.jpg`, { type: 'image/jpeg' });

            const publicUrl = await uploadImage(file, 'images', 'products');
            const newImages = [...formData.images];
            newImages[cropIndex] = publicUrl;
            setFormData({ ...formData, images: newImages });
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
            setCropImageSrc(null);
        }
    };

    const handleSizeStockChange = (size, qty) => {
        const newSizes = { ...clothingData.sizes, [size]: parseInt(qty) || 0 };
        // Remove size if qty is 0/empty to keep clean? Or keep explicitly 0.
        setClothingData({ ...clothingData, sizes: newSizes });
        
        // Auto-update total stock
        const totalStock = Object.values(newSizes).reduce((a, b) => a + b, 0);
        setFormData(prev => ({ ...prev, stockQuantity: totalStock }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSubmit = { 
            ...formData, 
            price: Number(formData.price),
            originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
            stockQuantity: Number(formData.stockQuantity),
            image: formData.images[0], // Main image for legacy support
            // pack enhanced fields into clothingInformation (as a flexible metadata json)
            clothingInformation: {
                ...(isClothing ? clothingData : {}),
                sku: formData.sku,
                tags: formData.tags,
                color: formData.color
            }
        };
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, dataToSubmit);
            } else {
                await addProduct(dataToSubmit);
            }
            setIsModalOpen(false);
            alert('Product saved successfully!');
        } catch (error) {
            console.error("Failed to save product", error);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id);
        }
    };

    return (
        <div className="font-body space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-stone-900">Inventory</h1>
                    <p className="text-stone-500 mt-1">Manage your products {isClothing ? '& Clothing' : ''} details</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => handleOpenModal()}
                        className="flex items-center justify-center px-6 py-3 bg-white text-stone-900 border border-stone-200 rounded-xl hover:bg-stone-50 hover:border-stone-300 transition-all font-bold tracking-wide text-sm shadow-sm"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Standard
                    </button>
                    <button 
                         onClick={() => setIsCategoryModalOpen(true)}
                         className="flex items-center justify-center px-6 py-3 bg-white text-stone-900 border border-stone-200 rounded-xl hover:bg-stone-50 hover:border-stone-300 transition-all font-bold tracking-wide text-sm shadow-sm"
                    >
                        <Filter className="w-5 h-5 mr-2" />
                        Categories
                    </button>
                    <button 
                        onClick={() => handleOpenModal(null, 'clothing')}
                        className="flex items-center justify-center px-6 py-3 bg-rose-900 text-white rounded-xl hover:bg-rose-800 transition-colors shadow-lg shadow-rose-900/20 font-bold tracking-wide text-sm"
                    >
                        <Shirt className="w-5 h-5 mr-2" />
                        Add Clothing
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-stone-50 border-transparent focus:bg-white focus:border-rose-900 focus:ring-0 transition-all outline-none font-medium"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-48">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full pl-4 pr-10 py-3 rounded-xl bg-white border border-stone-200 text-stone-700 font-medium focus:border-rose-900 focus:ring-0 outline-none appearance-none cursor-pointer"
                        >
                            <option value="All">All Categories</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Products Grid/Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-stone-50 border-b border-stone-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Stock Qty</th>
                                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Stock Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-stone-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden border border-stone-200 shrink-0">
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="ml-4">
                                                    <p className="font-bold text-stone-900">{product.name}</p>
                                                    {product.clothingInformation && <span className="inline-block px-1.5 py-0.5 bg-rose-100 text-rose-700 text-[10px] uppercase font-bold rounded mt-1">Clothing</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-bold uppercase tracking-wide">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-stone-900">₹{product.price.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-stone-600">{product.stock}</td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => toggleStock(product.id)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${
                                                    product.inStock 
                                                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                }`}
                                            >
                                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button 
                                                    onClick={() => handleOpenModal(product)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-stone-500">
                                        <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        No products found matching "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-stone-900/40 backdrop-blur-md animate-in fade-in duration-300"
                        onClick={() => setIsModalOpen(false)}
                    />
                    
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-stone-100 flex justify-between items-center bg-white z-10 shrink-0">
                            <div>
                                <h2 className="text-2xl font-heading font-bold text-stone-800 flex items-center gap-2">
                                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                                    {isClothing && <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-xs rounded-full">Clothing</span>}
                                </h2>
                                <p className="text-stone-500 text-sm mt-1">Fill in the details to update your inventory</p>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="p-2 bg-stone-50 hover:bg-stone-100 rounded-full transition-colors text-stone-400 hover:text-stone-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto p-8">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Left Col: Images */}
                                <div className="lg:col-span-5 space-y-6">
                                    {/* Main Image (Front) */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-stone-500 uppercase tracking-widest flex justify-between">
                                            {isClothing ? 'Front View (Main)' : 'Main Image'}
                                            <span className="text-stone-400 font-normal normal-case tracking-normal ml-2">(Cover)</span>
                                            {isClothing && <span className="text-rose-600">*</span>}
                                        </label>
                                        <div className="group relative aspect-[3/4] bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200 overflow-hidden flex items-center justify-center hover:border-rose-200 transition-all">
                                            {formData.images[0] ? (
                                                <img src={formData.images[0]} alt="Front" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="w-8 h-8 text-stone-300" />
                                            )}
                                            <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 0)} disabled={uploading} />
                                                <div className="opacity-0 group-hover:opacity-100 bg-white/90 p-2 rounded-full shadow-sm text-stone-700 font-bold text-xs flex items-center gap-1">
                                                    <Upload className="w-3 h-3" /> Upload
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Additional Images Grid (Only for Clothing) */}
                                    {/* Additional Images Grid (Now for ALL products) */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                                                {isClothing ? 'Back View' : 'Image 2'}
                                            </label>
                                            <div className="group relative aspect-square bg-stone-50 rounded-xl border-2 border-dashed border-stone-200 overflow-hidden flex items-center justify-center hover:border-rose-200 transition-all">
                                                {formData.images[1] ? (
                                                    <img src={formData.images[1]} alt="View 2" className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="w-6 h-6 text-stone-300" />
                                                )}
                                                <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 1)} disabled={uploading} />
                                                    <div className="opacity-0 group-hover:opacity-100 bg-white/90 p-1.5 rounded-full shadow-sm">
                                                        <Upload className="w-3 h-3 text-stone-700" />
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                                                {isClothing ? 'Close-up' : 'Image 3'}
                                            </label>
                                            <div className="group relative aspect-square bg-stone-50 rounded-xl border-2 border-dashed border-stone-200 overflow-hidden flex items-center justify-center hover:border-rose-200 transition-all">
                                                {formData.images[2] ? (
                                                    <img src={formData.images[2]} alt="View 3" className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="w-6 h-6 text-stone-300" />
                                                )}
                                                <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 2)} disabled={uploading} />
                                                    <div className="opacity-0 group-hover:opacity-100 bg-white/90 p-1.5 rounded-full shadow-sm">
                                                        <Upload className="w-3 h-3 text-stone-700" />
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Featured Toggle */}
                                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={formData.featured}
                                                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                                                className="w-5 h-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                                            />
                                            <div>
                                                <span className="block text-sm font-bold text-amber-800">Featured Product</span>
                                                <span className="block text-xs text-amber-700/70">Pin this product to the top of the shop</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Right Col: Form Fields */}
                                <div className="lg:col-span-7 space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Product Name</label>
                                        <input 
                                            type="text" required
                                            className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-rose-900 focus:bg-white focus:ring-0 outline-none transition-all font-medium text-lg placeholder:text-stone-300"
                                            placeholder="e.g. Men's Hand-Embroidered Cotton Kurta"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>

                                    {/* Clothing Specific: Gender & Fabric */}
                                    {isClothing && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Gender</label>
                                                <select 
                                                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-rose-900 focus:bg-white focus:ring-0 outline-none transition-all font-medium appearance-none"
                                                    value={clothingData.gender}
                                                    onChange={(e) => setClothingData({...clothingData, gender: e.target.value})}
                                                >
                                                    <option value="Men">Men</option>
                                                    <option value="Women">Women</option>
                                                    <option value="Unisex">Unisex</option>
                                                    <option value="Kids">Kids</option>
                                                </select>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Fabric / Material</label>
                                                <select 
                                                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-rose-900 focus:bg-white focus:ring-0 outline-none transition-all font-medium appearance-none"
                                                    value={formData.fabric}
                                                    onChange={(e) => setFormData({...formData, fabric: e.target.value})}
                                                >
                                                    <option value="">Select Fabric</option>
                                                    {fabricTypes.map(f => (
                                                        <option key={f} value={f}>{f}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    {isClothing && (
                                        <div className="space-y-3 mt-4">
                                            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Available Colors</label>
                                            <input 
                                                type="text"
                                                className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-rose-900 focus:bg-white focus:ring-0 outline-none transition-all font-medium placeholder:text-stone-300"
                                                placeholder="e.g. Red, Blue, NA (Comma Separated)"
                                                value={clothingData.colors ? clothingData.colors.join(', ') : ''}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setClothingData({
                                                        ...clothingData, 
                                                        colors: val.split(',').map(c => c.trim()).filter(c => c !== '')
                                                    });
                                                }}
                                            />
                                            <p className="text-[10px] text-stone-400">Use "NA" if not applicable.</p>
                                        </div>
                                    )}

                                    {/* Price & Category */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Selling Price (₹)</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold">₹</span>
                                                <input 
                                                    type="number" required
                                                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-rose-900 focus:bg-white focus:ring-0 outline-none transition-all font-medium"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">MRP / Original (₹)</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold">₹</span>
                                                <input 
                                                    type="number"
                                                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-rose-900 focus:bg-white focus:ring-0 outline-none transition-all font-medium"
                                                    value={formData.originalPrice || ''}
                                                    onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                                                    placeholder="Optional"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Category</label>
                                        <select 
                                            className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-rose-900 focus:bg-white focus:ring-0 outline-none transition-all font-medium appearance-none"
                                            value={formData.category}
                                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        >
                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>

                                    {/* Clothing Specific: Stock Management */}
                                    {isClothing ? (
                                        <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-100">
                                            <div className="flex justify-between items-center">
                                                 <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Size-wise Stock</label>
                                                 <span className="text-xs font-bold text-rose-800">Total Stock: {formData.stockQuantity}</span>
                                            </div>
                                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                                {sizesList.map(size => (
                                                    <div key={size} className="text-center">
                                                        <label className="block text-[10px] font-bold text-stone-400 mb-1">{size}</label>
                                                        <input 
                                                            type="number" min="0" placeholder="0"
                                                            className="w-full px-2 py-2 rounded-lg border border-stone-200 text-center text-sm font-bold focus:border-rose-900 focus:ring-0 outline-none"
                                                            value={clothingData.sizes?.[size] || ''}
                                                            onChange={(e) => handleSizeStockChange(size, e.target.value)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Stock Qty</label>
                                            <input 
                                                type="number" required min="0"
                                                className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-rose-900 focus:bg-white focus:ring-0 outline-none transition-all font-medium"
                                                value={formData.stockQuantity}
                                                onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})}
                                            />
                                        </div>
                                    )}

                                    {/* Clothing Details */}
                                    {isClothing && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Fit Type</label>
                                                <select 
                                                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-rose-900 focus:bg-white focus:ring-0 outline-none transition-all font-medium appearance-none"
                                                    value={clothingData.fitType}
                                                    onChange={(e) => setClothingData({...clothingData, fitType: e.target.value})}
                                                >
                                                    <option value="Regular">Regular Fit</option>
                                                    <option value="Slim">Slim Fit</option>
                                                    <option value="Relaxed">Relaxed Fit</option>
                                                </select>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Sleeve Type</label>
                                                <select 
                                                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-rose-900 focus:bg-white focus:ring-0 outline-none transition-all font-medium appearance-none"
                                                    value={clothingData.sleeveType}
                                                    onChange={(e) => setClothingData({...clothingData, sleeveType: e.target.value})}
                                                >
                                                    <option value="Full Sleeve">Full Sleeve</option>
                                                    <option value="Half Sleeve">Half Sleeve</option>
                                                    <option value="Sleeveless">Sleeveless</option>
                                                    <option value="3/4 Sleeve">3/4 Sleeve</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-rose-900 focus:bg-white focus:ring-0 outline-none transition-all font-medium min-h-[100px]"
                                            placeholder="Write a compelling description..."
                                            required
                                        />
                                    </div>
                                    
                                    {isClothing && (
                                         <div className="space-y-3">
                                            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Wash Care</label>
                                            <textarea
                                                value={clothingData.careInstructions}
                                                onChange={(e) => setClothingData({ ...clothingData, careInstructions: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-rose-900 focus:bg-white focus:ring-0 outline-none transition-all font-medium text-sm min-h-[60px]"
                                                placeholder="e.g. Machine wash cold, Do not bleach..."
                                            />
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-6 border-t border-stone-100 bg-stone-50 flex justify-end gap-4 shrink-0">
                             <button 
                                type="button" 
                                onClick={() => setIsModalOpen(false)} 
                                className="px-6 py-3 rounded-xl border-2 border-stone-200 text-stone-600 font-bold hover:bg-stone-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSubmit} 
                                className="px-8 py-3 rounded-xl bg-rose-900 text-white font-bold hover:bg-rose-800 transition-colors shadow-lg shadow-rose-900/20 flex items-center"
                            >
                                {editingProduct ? 'Update Product' : 'Create Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Category Manager Modal */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-md" onClick={() => setIsCategoryModalOpen(false)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden p-6 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-stone-900">Manage Categories</h2>
                            <button onClick={() => setIsCategoryModalOpen(false)}><X className="w-6 h-6 text-stone-400" /></button>
                        </div>
                        
                        <div className="flex gap-2 mb-6">
                            <input 
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="New Category Name"
                                className="flex-1 px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-rose-900"
                            />
                            <button 
                                onClick={async () => {
                                    if (!newCategory.trim()) return;
                                    await addCategory(newCategory);
                                    setNewCategory('');
                                }}
                                className="bg-rose-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-rose-800"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto space-y-2">
                            {categoryObjects.map(cat => (
                                <div key={cat.id} className="flex justify-between items-center p-3 bg-stone-50 rounded-lg group">
                                    <span className="font-medium text-stone-700">{cat.label}</span>
                                    <button 
                                        onClick={() => {
                                            if (window.confirm(`Delete category "${cat.label}"?`)) {
                                                deleteCategory(cat.id);
                                            }
                                        }}
                                        className="text-stone-400 hover:text-red-500 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Crop Modal */}
            {cropModalOpen && (
                <ImageCropper
                    imageSrc={cropImageSrc}
                    aspect={isClothing && cropIndex === 0 ? 3/4 : 1} 
                    onCancel={() => {
                        setCropModalOpen(false);
                        setCropImageSrc(null);
                    }}
                    onCropComplete={handleCropComplete}
                />
            )}
        </div>
    );
};

export default ProductManager;
