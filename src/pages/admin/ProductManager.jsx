import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../context/CategoryContext';
import { 
    Plus, Edit2, Trash2, X, Image as ImageIcon, Search, Filter, 
    Upload, Shirt, Save, ChevronRight, Package, Tag, 
    Layers, Truck, Globe, Calculator, AlertCircle
} from 'lucide-react';
import { uploadImage } from '../../utils/uploadUtils';
import ImageCropper from '../../components/ImageCropper';

const ProductManager = () => {
    const { products, addProduct, updateProduct, deleteProduct, toggleStock } = useProducts();
    const { categories: categoryObjects, addCategory, deleteCategory } = useCategories();
    
    // UI State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    
    // Cropping State
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [cropImageSrc, setCropImageSrc] = useState(null);
    const [cropTarget, setCropTarget] = useState({ field: 'images', index: 0 }); // { field, index }


    // Editing State
    const [editingId, setEditingId] = useState(null);

    const categories = categoryObjects.map(c => c.label);

    // Initial State Structure
    const initialFormState = {
        // 1. Basic Info
        name: '',
        brand: '',
        category: 'Home Decor',
        subCategory: '',
        sku: '',
        
        // 2. Pricing
        mrp: '',
        sellingPrice: '',
        discount: 0, // Calculated or manual
        tax: '',
        
        // 3. Media
        images: ['', '', '', ''], // Main, Back, Side, Zoom
        sizeChart: '',
        videoUrl: '', // Optional for now
        
        // 4. Specs: Size & Fit
        availableSizes: [], // ['S', 'M']
        fitType: 'Regular', // Slim, Regular, Relaxed
        lengthType: 'Regular', // Short, Regular, Long
        
        // 5. Specs: Material & Care
        fabric: '',
        fabricBlend: '',
        careInstructions: '',
        countryOfOrigin: 'India',
        
        // 6. Description
        shortDescription: '',
        detailedDescription: '', // mapped to 'description' in DB
        keyFeatures: [], // Array of strings
        
        // 7. Variants
        colors: [], // ['Red', 'Blue']
        colorsInput: '', // Temp string for input
        // Simplification: We store total stock in DB `stock_quantity`.
        // Variant stock logic would be complex here, so keeping it tied to simple size map for now
        // or just plain colors list.
        variantStock: {}, // Future proofing: { 'Red-S': 5 }
        
        // 8. Inventory & Shipping
        stockQuantity: 10,
        lowStockAlert: 5,
        weight: '',
        dimensions: '',
        shippingCharges: 0, // 0 = Free
        
        // 9. SEO
        metaTitle: '',
        metaDescription: '',
        keywords: '',
        
        // 10. Policy
        returnAvailable: true,
        returnPeriod: 7,
        
        // Flags
        isClothing: false,
        featured: false
    };

    const [formData, setFormData] = useState(initialFormState);
    const [tempFeature, setTempFeature] = useState('');
    const [newCategory, setNewCategory] = useState('');

    // Derived Lists
    const sizesList = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "Free"];
    const fitTypes = ["Slim", "Regular", "Relaxed", "Oversized"];
    const lengthTypes = ["Short", "Regular", "Long", "Cropped", "Maxi"];
    const fabricTypes = ["Cotton", "Silk", "Linen", "Velvet", "Georgette", "Chiffon", "Rayon", "Wool", "Denim", "Crepe", "Satin", "Polyester Blend"];

    // Handler: Open Modal
    const handleOpenModal = (product = null, type = 'standard') => {
        if (product) {
            setEditingId(product.id);
            // Hydrate Form
            const clothing = product.clothingInformation || {};
            
            setFormData({
                ...initialFormState,
                // Basic
                name: product.name,
                category: product.category,
                // Map description to detailedDescription for editing
                detailedDescription: product.description || '', 
                shortDescription: clothing.shortDescription || '',
                brand: clothing.brand || '',
                subCategory: clothing.subCategory || '',
                sku: clothing.sku || '',
                
                // Pricing
                sellingPrice: product.price,
                mrp: product.originalPrice || '',
                
                // Media
                images: product.images && product.images.length >= 4 ? product.images : [
                    product.images?.[0] || '',
                    product.images?.[1] || '',
                    product.images?.[2] || '',
                    product.images?.[3] || ''
                ],
                sizeChart: clothing.sizeChart || '',
                
                // Specs
                availableSizes: clothing.sizes ? Object.keys(clothing.sizes) : [],
                fitType: clothing.fitType || 'Regular',
                lengthType: clothing.lengthType || 'Regular',
                fabric: clothing.fabric || product.fabric || '',
                fabricBlend: clothing.fabricBlend || '',
                careInstructions: clothing.careInstructions || '',
                countryOfOrigin: clothing.countryOfOrigin || 'India',
                
                // Features
                keyFeatures: clothing.keyFeatures || [],
                
                // Variants
                colors: clothing.colors || [],
                colorsInput: (clothing.colors || []).join(', '),
                variantStock: clothing.variantStock || {},
                
                // Inventory
                stockQuantity: product.stock,
                lowStockAlert: clothing.lowStockAlert || 5,
                weight: clothing.weight || '',
                dimensions: clothing.dimensions || '',
                shippingCharges: clothing.shippingCharges || 0,
                
                // SEO
                metaTitle: clothing.metaTitle || '',
                metaDescription: clothing.metaDescription || '',
                keywords: clothing.keywords || '',
                
                // Policy
                returnAvailable: clothing.returnAvailable !== undefined ? clothing.returnAvailable : true,
                returnPeriod: clothing.returnPeriod || 7,
                
                // Flags
                featured: product.featured || false,
                isClothing: !!(product.clothingInformation && (Object.keys(clothing.sizes || {}).length > 0 || clothing.fitType || clothing.lengthType)) // Only true if sizing/fit specs exist
            });
        } else {
            setEditingId(null);
            setFormData({
                ...initialFormState,
                isClothing: type === 'clothing',
                category: type === 'clothing' ? 'Clothing' : 'Home Decor'
            });
        }
        setActiveTab('general');
        setIsModalOpen(true);
    };

    // Handler: Submit
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        
        // Basic Validation
        if (!formData.name || !formData.category || !formData.sellingPrice) {
            alert("Please fill in all required fields (Name, Price, Category).");
            return;
        }

        // Check if there is any actual clothing data to save
        const colors = formData.colorsInput ? formData.colorsInput.split(',').map(c => c.trim()).filter(Boolean) : [];
        
        const clothingInfo = {
            brand: formData.brand,
            subCategory: formData.subCategory,
            sku: formData.sku,
            shortDescription: formData.shortDescription,
            fitType: formData.fitType,
            lengthType: formData.lengthType,
            fabric: formData.fabric,
            fabricBlend: formData.fabricBlend,
            careInstructions: formData.careInstructions,
            countryOfOrigin: formData.countryOfOrigin,
            keyFeatures: formData.keyFeatures,
            variantStock: formData.variantStock,
            colors: colors,
            sizes: formData.availableSizes.reduce((acc, size) => ({ ...acc, [size]: 10 }), {}), // Legacy simple map
            lowStockAlert: formData.lowStockAlert,
            weight: formData.weight,
            dimensions: formData.dimensions,
            shippingCharges: formData.shippingCharges,
            metaTitle: formData.metaTitle,
            metaDescription: formData.metaDescription,
            keywords: formData.keywords,
            returnAvailable: formData.returnAvailable,
            returnPeriod: formData.returnPeriod,
            sizeChart: formData.sizeChart
        };

        // If "Size & Fit Chart" is not enabled, force clear the size/fit specific fields
        // so that having colors doesn't trick the system into thinking this is a full clothing item on edit.
        if (!formData.isClothing) {
            clothingInfo.fitType = null;
            clothingInfo.lengthType = null;
            clothingInfo.sizes = {};
            clothingInfo.sizeChart = null;
        }

        // Determine if we should save clothing info
        const hasClothingData = 
            formData.isClothing || 
            colors.length > 0 || 
            formData.keyFeatures.length > 0 || 
            !!formData.sizeChart || 
            !!formData.fabric || 
            formData.availableSizes.length > 0;

        // Auto-calculate Global Stock if Variants exist
        let finalStock = formData.stockQuantity;
        if (hasClothingData && formData.variantStock && Object.keys(formData.variantStock).length > 0) {
             const vStockSum = Object.values(formData.variantStock).reduce((sum, v) => sum + (parseInt(v.stock) || 0), 0);
             // Only override if the sum is meaningful (>0), otherwise trust manual input or 0
             if (vStockSum > 0) {
                 finalStock = vStockSum;
             }
        }

        const finalData = {
            name: formData.name,
            description: formData.detailedDescription,
            price: formData.sellingPrice,
            originalPrice: formData.mrp,
            category: formData.category,
            images: formData.images.filter(img => img !== ''), // Filter empty
            stockQuantity: finalStock,
            featured: formData.featured,
            fabric: formData.fabric, // Legacy top level
            clothingInformation: hasClothingData ? clothingInfo : null
        };

        try {
            if (editingId) {
                await updateProduct(editingId, finalData);
            } else {
                await addProduct(finalData);
            }
            setIsModalOpen(false);
            // alert('Product saved successfully');
        } catch (error) {
            console.error(error);
            alert(`Failed to save product: ${error.message || error.details || 'Unknown DB Error'}`);
        }
    };

    // Utilities
    const handleImageSelect = (e, field, index = 0) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                setCropImageSrc(reader.result);
                setCropTarget({ field, index });
                setCropModalOpen(true);
            };
            reader.readAsDataURL(e.target.files[0]);
            e.target.value = '';
        }
    };

    const handleCropComplete = async (croppedBlob) => {

        setCropModalOpen(false);
        try {
            const file = new File([croppedBlob], `upload-${Date.now()}.jpg`, { type: 'image/jpeg' });
            const url = await uploadImage(file, 'products');
            
            if (cropTarget.field === 'images') {
                const newImages = [...formData.images];
                newImages[cropTarget.index] = url;
                setFormData(prev => ({ ...prev, images: newImages }));
            } else if (cropTarget.field === 'sizeChart') {
                setFormData(prev => ({ ...prev, sizeChart: url }));
            }
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        } finally {

            setCropImageSrc(null);
        }
    };

    // Render Logic
    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        (categoryFilter === 'All' || p.category === categoryFilter)
    );

    return (
        <div className="font-body space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-stone-900">Inventory</h1>
                    <p className="text-stone-500">Manage products, stock, and detailed attributes</p>
                </div>
                <div className="flex gap-3">
                     <button onClick={() => setIsCategoryModalOpen(true)} className="px-5 py-2.5 bg-white border border-stone-200 rounded-xl font-bold flex items-center gap-2 hover:bg-stone-50 transition-colors">
                        <Filter className="w-4 h-4" /> Categories
                    </button>
                    <button onClick={() => handleOpenModal(null, 'standard')} className="px-5 py-2.5 bg-rose-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-rose-800 transition-colors shadow-lg shadow-rose-900/20">
                        <Plus className="w-4 h-4" /> Add Product
                    </button>

                </div>
            </div>

            {/* List View */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-stone-100 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Search by name..." 
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-stone-50 border-transparent focus:bg-white focus:border-rose-900 focus:ring-0 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        value={categoryFilter} 
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2.5 rounded-xl bg-stone-50 border-transparent font-medium"
                    >
                        <option value="All">All Categories</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                         <thead className="bg-stone-50 border-b border-stone-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase">Product</th>
                                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase">Price</th>
                                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase">Stock</th>
                                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {filteredProducts.map(p => (
                                <tr key={p.id} className="hover:bg-stone-50/50">
                                    <td className="px-6 py-4 flex items-center gap-4">
                                        <img src={p.image} className="w-12 h-12 rounded-lg bg-stone-100 object-cover border border-stone-200" alt="" />
                                        <div>
                                            <div className="font-bold text-stone-900">{p.name}</div>
                                        </div>

                                    </td>
                                    <td className="px-6 py-4 text-stone-600 font-medium text-sm">{p.category}</td>
                                    <td className="px-6 py-4 font-bold text-stone-900">₹{p.price.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => toggleStock(p.id)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${p.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                                        >
                                            {p.inStock ? 'In Stock' : 'Out Stock'}
                                        </button>
                                        <span className="text-xs text-stone-400 ml-2">({p.stock})</span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => handleOpenModal(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => { if(window.confirm('Delete?')) deleteProduct(p.id) }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ================= MODAL ================= */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-8 py-5 border-b border-stone-100 flex justify-between items-center bg-white z-10 shrink-0">
                            <div>
                                <h2 className="text-xl font-heading font-bold text-stone-800 flex items-center gap-2">
                                    {editingId ? 'Edit Product' : 'New Product'}
                                </h2>


                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-stone-100 transition-colors text-stone-400"><X className="w-5 h-5" /></button>
                            </div>
                        </div>

                        {/* Tabs Header */}
                        <div className="flex px-8 border-b border-stone-100 bg-stone-50/50 gap-6 overflow-x-auto no-scrollbar shrink-0">
                            {[
                                { id: 'general', label: 'General Info', icon: Layers, show: true },
                                { id: 'pricing', label: 'Pricing & Inventory', icon: Calculator, show: true },
                                { id: 'specs', label: 'Specifications', icon: Tag, show: true },
                                { id: 'variants', label: 'Variants & Media', icon: ImageIcon, show: true },
                                { id: 'seo', label: 'SEO & Policy', icon: Globe, show: true },
                            ].filter(t => t.show).map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                                        activeTab === tab.id 
                                        ? 'border-rose-900 text-rose-900' 
                                        : 'border-transparent text-stone-500 hover:text-stone-700'
                                    }`}
                                >
                                    <tab.icon className="w-4 h-4" /> {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-8 bg-[#fbfbfb]">
                            
                            {/* TAB: GENERAL */}
                            {activeTab === 'general' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">Product Name *</label>
                                            <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="e.g. Royal Embroidered Kurta" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">Brand</label>
                                                <input type="text" className="input-field" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} placeholder="e.g. FabIndia" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">SKU</label>
                                                <input type="text" className="input-field" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} placeholder="Unique ID" />
                                            </div>
                                        </div>
                                        <div>
                                             <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">Category *</label>
                                             <select className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                             </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">Detailed Description</label>
                                            <textarea className="input-field min-h-[150px]" value={formData.detailedDescription} onChange={e => setFormData({...formData, detailedDescription: e.target.value})} placeholder="Full product story..." />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">Short Description (Summary)</label>
                                            <textarea className="input-field min-h-[80px]" value={formData.shortDescription} onChange={e => setFormData({...formData, shortDescription: e.target.value})} placeholder="Brief 1-2 liner..." />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">Key Features (Bullet Points)</label>
                                            <div className="flex gap-2 mb-2">
                                                <input 
                                                    type="text" 
                                                    className="input-field flex-1" 
                                                    value={tempFeature} 
                                                    onChange={e => setTempFeature(e.target.value)} 
                                                    placeholder="e.g. Breathable cotton fabric"
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            if (tempFeature.trim()) {
                                                                setFormData(prev => ({...prev, keyFeatures: [...prev.keyFeatures, tempFeature.trim()]}));
                                                                setTempFeature('');
                                                            }
                                                        }
                                                    }}
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => {
                                                        if (tempFeature.trim()) {
                                                            setFormData(prev => ({...prev, keyFeatures: [...prev.keyFeatures, tempFeature.trim()]}));
                                                            setTempFeature('');
                                                        }
                                                    }}
                                                    className="p-3 bg-stone-100 rounded-xl hover:bg-stone-200 font-bold"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                {formData.keyFeatures.map((feat, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-sm bg-white p-2 rounded border border-stone-100">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                                        <span className="flex-1 text-stone-700">{feat}</span>
                                                        <button onClick={() => setFormData(prev => ({...prev, keyFeatures: prev.keyFeatures.filter((_, i) => i !== idx)}))} className="text-stone-400 hover:text-red-500">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                         <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-center gap-3">
                                            <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500" />
                                            <div>
                                                <span className="block font-bold text-amber-900 text-sm">Mark as Featured</span>
                                                <span className="block text-xs text-amber-700">Display on home page hero or top sections</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: PRICING & INVENTORY */}
                            {activeTab === 'pricing' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <h3 className="section-title">Pricing</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="label">Selling Price (₹) *</label>
                                                <input type="number" className="input-field font-bold text-lg" value={formData.sellingPrice} onChange={e => setFormData({...formData, sellingPrice: e.target.value})} required />
                                            </div>
                                            <div>
                                                <label className="label">MRP (₹)</label>
                                                <input type="number" className="input-field" value={formData.mrp} onChange={e => setFormData({...formData, mrp: e.target.value})} placeholder="Optional" />
                                            </div>
                                        </div>
                                        
                                        {/* Auto-calc Discount Display */}
                                        {formData.mrp && formData.sellingPrice && Number(formData.mrp) > Number(formData.sellingPrice) && (
                                            <div className="bg-green-50 p-3 rounded-xl border border-green-100 text-green-800 text-sm font-bold flex items-center gap-2">
                                                <Tag className="w-4 h-4" />
                                                {Math.round(((Number(formData.mrp) - Number(formData.sellingPrice)) / Number(formData.mrp)) * 100)}% Flat Discount Applied
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="label">Tax (GST %)</label>
                                                <input type="number" className="input-field" value={formData.tax} onChange={e => setFormData({...formData, tax: e.target.value})} placeholder="e.g. 5, 12, 18" />
                                            </div>
                                            <div>
                                                <label className="label">Shipping Charges</label>
                                                <input type="number" className="input-field" value={formData.shippingCharges} onChange={e => setFormData({...formData, shippingCharges: e.target.value})} placeholder="0 for Free" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="section-title">Inventory & Dimensions</h3>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="label">Stock Quantity (Total)</label>
                                                <input type="number" className="input-field" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} />
                                            </div>
                                            <div>
                                                <label className="label">Low Stock Alert At</label>
                                                <input type="number" className="input-field" value={formData.lowStockAlert} onChange={e => setFormData({...formData, lowStockAlert: e.target.value})} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="label">Weight (kg/g)</label>
                                                <input type="text" className="input-field" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} placeholder="e.g. 0.5 kg" />
                                            </div>
                                            <div>
                                                <label className="label">Dimensions (LxWxH)</label>
                                                <input type="text" className="input-field" value={formData.dimensions} onChange={e => setFormData({...formData, dimensions: e.target.value})} placeholder="e.g. 10x8x2 cm" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: SPECS */}
                            {activeTab === 'specs' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <h3 className="section-title">Material & Care</h3>
                                        <div>
                                            <label className="label">Fabric / Material</label>
                                            <select className="input-field" value={formData.fabric} onChange={e => setFormData({...formData, fabric: e.target.value})}>
                                                <option value="">Select Material</option>
                                                {fabricTypes.map(f => <option key={f} value={f}>{f}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="label">Blend Details</label>
                                            <input type="text" className="input-field" value={formData.fabricBlend} onChange={e => setFormData({...formData, fabricBlend: e.target.value})} placeholder="e.g. 80% Cotton, 20% Polyester" />
                                        </div>
                                        <div>
                                            <label className="label">Country of Origin</label>
                                            <input type="text" className="input-field" value={formData.countryOfOrigin} onChange={e => setFormData({...formData, countryOfOrigin: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="label">Care Instructions</label>
                                            <textarea className="input-field min-h-[100px]" value={formData.careInstructions} onChange={e => setFormData({...formData, careInstructions: e.target.value})} placeholder="e.g. Machine wash cold, do not bleach..." />
                                        </div>
                                    </div>



                                    {/* Toggle for Size & Fit */}
                                    <div className="md:col-span-2 border-t border-stone-100 pt-6">
                                        <button 
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, isClothing: !prev.isClothing }))}
                                            className={`
                                                w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all group
                                                ${formData.isClothing 
                                                    ? 'border-rose-900 bg-rose-50' 
                                                    : 'border-stone-200 bg-white hover:border-stone-300'}
                                            `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${formData.isClothing ? 'bg-rose-900 text-white' : 'bg-stone-100 text-stone-500'}`}>
                                                    <Shirt className="w-5 h-5" />
                                                </div>
                                                <div className="text-left">
                                                    <span className={`block font-bold ${formData.isClothing ? 'text-rose-900' : 'text-stone-700'}`}>
                                                        Size & Fit Information
                                                    </span>
                                                    <span className="text-xs text-stone-500">
                                                        {formData.isClothing ? 'Enabled - Product will have size selection and fit details' : 'Disabled - Click to add size chart, fit type, and available sizes'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={`
                                                w-12 h-6 rounded-full relative transition-colors duration-200
                                                ${formData.isClothing ? 'bg-rose-900' : 'bg-stone-200'}
                                            `}>
                                                <div className={`
                                                    absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200
                                                    ${formData.isClothing ? 'left-7' : 'left-1'}
                                                `} />
                                            </div>
                                        </button>
                                    </div>

                                    {formData.isClothing && (

                                    <div className="space-y-6">
                                        <h3 className="section-title">Fit & Sizing</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="label">Fit Type</label>
                                                <select className="input-field" value={formData.fitType} onChange={e => setFormData({...formData, fitType: e.target.value})}>
                                                    {fitTypes.map(f => <option key={f} value={f}>{f}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="label">Length Type</label>
                                                <select className="input-field" value={formData.lengthType} onChange={e => setFormData({...formData, lengthType: e.target.value})}>
                                                    {lengthTypes.map(f => <option key={f} value={f}>{f}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div>
                                             <label className="label mb-3 block">Available Sizes</label>
                                             <div className="flex flex-wrap gap-3">
                                                {sizesList.map(size => (
                                                    <label key={size} className={`
                                                        w-12 h-12 rounded-lg flex items-center justify-center font-bold border-2 cursor-pointer transition-all
                                                        ${formData.availableSizes.includes(size) 
                                                            ? 'border-rose-900 bg-rose-900 text-white' 
                                                            : 'border-stone-200 bg-white text-stone-500 hover:border-stone-300'}
                                                    `}>
                                                        <input 
                                                            type="checkbox" 
                                                            className="hidden" 
                                                            checked={formData.availableSizes.includes(size)} 
                                                            onChange={e => {
                                                                if (e.target.checked) setFormData(prev => ({...prev, availableSizes: [...prev.availableSizes, size]}));
                                                                else setFormData(prev => ({...prev, availableSizes: prev.availableSizes.filter(s => s !== size)}));
                                                            }}
                                                        />
                                                        {size}
                                                    </label>
                                                ))}
                                             </div>
                                        </div>
                                    </div>
                                    )}
                                </div>
                            )}

                            {/* TAB: VARIANTS & MEDIA */}
                            {activeTab === 'variants' && (
                                <div className="space-y-8">
                                    {/* Images Grid */}
                                    <div className="space-y-4">
                                        <h3 className="section-title">Product Imagery (4 Views)</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {formData.images.map((img, idx) => (
                                                <div key={idx} className="space-y-2">
                                                    <div className="aspect-[3/4] bg-stone-100 rounded-xl border-2 border-dashed border-stone-200 flex items-center justify-center relative group overflow-hidden">
                                                        {img ? (
                                                            <>
                                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                                                <button onClick={() => {
                                                                    const newImages = [...formData.images];
                                                                    newImages[idx] = '';
                                                                    setFormData({...formData, images: newImages});
                                                                }} className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <div className="text-center text-stone-400">
                                                                <ImageIcon className="w-6 h-6 mx-auto mb-2 opacity-50" />
                                                                <span className="text-xs font-bold uppercase">View {idx + 1}</span>
                                                            </div>
                                                        )}
                                                        <label className="absolute inset-0 cursor-pointer">
                                                            <input type="file" className="hidden" onChange={e => handleImageSelect(e, 'images', idx)} />
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Colors - Available for all product types */}
                                    <div className="space-y-4 border-t border-stone-100 pt-8">
                                        <label className="label">Available Colors (Comma Separated)</label>
                                        <input 
                                            type="text" 
                                            className="input-field" 
                                            value={formData.colorsInput} 
                                            onChange={e => setFormData({...formData, colorsInput: e.target.value})}
                                            placeholder="Red, Blue, Green, NA"
                                        />
                                        <div className="flex gap-2 flex-wrap">
                                            {formData.colorsInput ? formData.colorsInput.split(',').map(c => c.trim()).filter(Boolean).map((c, i) => (
                                                <span key={i} className="px-3 py-1 bg-stone-100 text-stone-700 rounded-lg text-sm font-bold">{c}</span>
                                            )) : <span className="text-xs text-stone-400">No colors added</span>}
                                        </div>
                                    </div>

                                    {/* Variant Inventory Table */}
                                    {(formData.availableSizes.length > 0 || formData.colorsInput.split(',').filter(c=>c.trim()).length > 0) && (
                                        <div className="space-y-4 border-t border-stone-100 pt-8">
                                            <h3 className="section-title">Variant Pricing & Inventory</h3>
                                            <div className="overflow-x-auto border border-stone-200 rounded-xl">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="bg-stone-50 text-stone-500 font-bold uppercase text-xs">
                                                        <tr>
                                                            <th className="px-4 py-3">Variant</th>
                                                            <th className="px-4 py-3">Price (₹)</th>
                                                            <th className="px-4 py-3">Stock</th>
                                                            <th className="px-4 py-3">SKU Suffix</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-stone-100">
                                                        {(() => {
                                                            const colors = formData.colorsInput ? formData.colorsInput.split(',').map(c => c.trim()).filter(Boolean) : ['Standard'];
                                                            const sizes = formData.availableSizes.length > 0 ? formData.availableSizes : ['Standard'];
                                                            
                                                            // If both are empty/standard, don't show table or just show 1 row? 
                                                            // If checks above passed, we have at least some variants.
                                                            const variants = [];
                                                            colors.forEach(color => {
                                                                sizes.forEach(size => {
                                                                    if(color === 'Standard' && size === 'Standard') return; // Skip if no variants actually
                                                                    variants.push({ color, size, key: `${color}-${size}` });
                                                                });
                                                            });

                                                            if(variants.length === 0) return <tr><td colSpan="4" className="px-4 py-3 text-center text-stone-400">Add Colors or Sizes to generate variants</td></tr>;

                                                            return variants.map((v) => {
                                                                const currentData = formData.variantStock[v.key] || {};
                                                                return (
                                                                    <tr key={v.key} className="bg-white hover:bg-stone-50">
                                                                        <td className="px-4 py-3 font-bold text-stone-800">
                                                                            {v.color !== 'Standard' && <span className="mr-2 text-rose-600">{v.color}</span>}
                                                                            {v.size !== 'Standard' && <span className="px-2 py-0.5 bg-stone-100 rounded text-stone-600">{v.size}</span>}
                                                                        </td>
                                                                        <td className="px-4 py-2">
                                                                            <input 
                                                                                type="number" 
                                                                                className="w-24 px-2 py-1 border rounded text-right font-medium" 
                                                                                placeholder={formData.sellingPrice}
                                                                                value={currentData.price || ''}
                                                                                onChange={(e) => {
                                                                                    const val = e.target.value;
                                                                                    setFormData(prev => ({
                                                                                        ...prev,
                                                                                        variantStock: {
                                                                                            ...prev.variantStock,
                                                                                            [v.key]: { ...(prev.variantStock[v.key] || {}), price: val }
                                                                                        }
                                                                                    }));
                                                                                }}
                                                                            />
                                                                        </td>
                                                                        <td className="px-4 py-2">
                                                                            <input 
                                                                                type="number" 
                                                                                className="w-20 px-2 py-1 border rounded text-right" 
                                                                                placeholder="10"
                                                                                value={currentData.stock !== undefined ? currentData.stock : ''}
                                                                                onChange={(e) => {
                                                                                    const val = e.target.value;
                                                                                    setFormData(prev => ({
                                                                                        ...prev,
                                                                                        variantStock: {
                                                                                            ...prev.variantStock,
                                                                                            [v.key]: { ...(prev.variantStock[v.key] || {}), stock: val }
                                                                                        }
                                                                                    }));
                                                                                }}
                                                                            />
                                                                        </td>
                                                                        <td className="px-4 py-2">
                                                                            <input 
                                                                                type="text" 
                                                                                className="w-full px-2 py-1 border rounded text-xs" 
                                                                                placeholder={`-${v.color.substring(0,2).toUpperCase()}-${v.size}`}
                                                                                value={currentData.sku || ''}
                                                                                onChange={(e) => {
                                                                                    const val = e.target.value;
                                                                                    setFormData(prev => ({
                                                                                        ...prev,
                                                                                        variantStock: {
                                                                                            ...prev.variantStock,
                                                                                            [v.key]: { ...(prev.variantStock[v.key] || {}), sku: val }
                                                                                        }
                                                                                    }));
                                                                                }}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            });
                                                        })()}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <p className="text-xs text-stone-400 text-center">Leave Price blank to use Base Price. Leave Stock blank to use Global Stock (or default 0).</p>
                                        </div>
                                    )}

                                    {/* Size Chart Image (Clothing Only) */}
                                    <div className="space-y-4 border-t border-stone-100 pt-8">
                                        <label className="label">Size Chart Image</label>
                                        <div className="flex gap-4 items-center">
                                            <div className="w-32 h-32 bg-stone-100 rounded-xl border-2 border-dashed border-stone-200 flex items-center justify-center relative overflow-hidden">
                                                {formData.sizeChart ? (
                                                    <img src={formData.sizeChart} alt="" className="w-full h-full object-cover" />
                                                ) : <Upload className="w-6 h-6 text-stone-400" />}
                                                <label className="absolute inset-0 cursor-pointer">
                                                    <input type="file" className="hidden" onChange={e => handleImageSelect(e, 'sizeChart')} />
                                                </label>
                                            </div>
                                            <div className="space-y-2">
                                                 <p className="text-sm text-stone-500 max-w-xs">Upload a size guide image to help customers choose better fit.</p>
                                                 {formData.sizeChart && (
                                                     <button type="button" onClick={() => setFormData(prev => ({...prev, sizeChart: ''}))} className="text-xs text-red-500 font-bold hover:underline">Remove Image</button>
                                                 )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: SEO & POLICY */}
                            {activeTab === 'seo' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <h3 className="section-title">Search Engine Optimization</h3>
                                        <div>
                                            <label className="label">Meta Title</label>
                                            <input type="text" className="input-field" value={formData.metaTitle} onChange={e => setFormData({...formData, metaTitle: e.target.value})} placeholder="SEO Title" />
                                        </div>
                                        <div>
                                            <label className="label">Meta Description</label>
                                            <textarea className="input-field min-h-[100px]" value={formData.metaDescription} onChange={e => setFormData({...formData, metaDescription: e.target.value})} placeholder="150-160 characters summary..." />
                                        </div>
                                        <div>
                                            <label className="label">Keywords</label>
                                            <input type="text" className="input-field" value={formData.keywords} onChange={e => setFormData({...formData, keywords: e.target.value})} placeholder="comma, separated, keywords" />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="section-title">Store Policies</h3>
                                        <div className="bg-stone-50 p-6 rounded-xl border border-stone-100 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="font-bold text-stone-700">Return & Exchange</label>
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => setFormData({...formData, returnAvailable: true})}
                                                        className={`px-4 py-2 rounded-lg text-sm font-bold ${formData.returnAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-white border border-stone-200 text-stone-400'}`}
                                                    >
                                                        Available
                                                    </button>
                                                    <button 
                                                        onClick={() => setFormData({...formData, returnAvailable: false})}
                                                        className={`px-4 py-2 rounded-lg text-sm font-bold ${!formData.returnAvailable ? 'bg-red-100 text-red-800' : 'bg-white border border-stone-200 text-stone-400'}`}
                                                    >
                                                        Not Available
                                                    </button>
                                                </div>
                                            </div>
                                            {formData.returnAvailable && (
                                                <div className="animate-in fade-in slide-in-from-top-2">
                                                    <label className="label">Return Period (Days)</label>
                                                    <input type="number" className="input-field bg-white" value={formData.returnPeriod} onChange={e => setFormData({...formData, returnPeriod: e.target.value})} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Modal Footer */}
                        <div className="px-8 py-5 border-t border-stone-100 bg-stone-50 flex justify-end gap-3 shrink-0">
                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-stone-500 hover:bg-stone-100 transition-colors">Cancel</button>
                            <button onClick={handleSubmit} className="px-8 py-3 rounded-xl bg-stone-900 text-white font-bold hover:bg-stone-800 transition-colors shadow-lg shadow-stone-900/20 flex items-center gap-2">
                                <Save className="w-4 h-4" /> Save Product
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setIsCategoryModalOpen(false)} />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-heading font-bold text-xl">Categories</h3>
                            <button onClick={() => setIsCategoryModalOpen(false)}><X className="w-5 h-5 text-stone-400" /></button>
                        </div>
                        <div className="flex gap-2 mb-6">
                            <input type="text" className="input-field" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="New Category..." />
                            <button onClick={() => { if(newCategory) { addCategory(newCategory); setNewCategory(''); }}} className="px-4 bg-rose-900 text-white rounded-xl"><Plus className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {categoryObjects.map(cat => (
                                <div key={cat.id} className="flex justify-between items-center p-3 bg-stone-50 rounded-lg">
                                    <span className="font-medium">{cat.label}</span>
                                    <button onClick={() => deleteCategory(cat.id)} className="text-stone-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Image Cropper Modal */}
            {cropModalOpen && (
                <ImageCropper 
                    imageSrc={cropImageSrc}
                    aspect={cropTarget.field === 'sizeChart' ? NaN : 3/4} // Free aspect for size chart
                    onCancel={() => { setCropModalOpen(false); setCropImageSrc(null); }}
                    onCropComplete={handleCropComplete}
                />
            )}

            <style>{`
                .label { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #78716c; margin-bottom: 0.5rem; }
                .section-title { font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 600; color: #1c1917; margin-bottom: 0.5rem; }
                .input-field { width: 100%; padding: 0.75rem 1rem; border-radius: 0.75rem; background-color: #f7f5f4; border: 2px solid #e7e5e4; outline: none; transition: 0.2s; font-weight: 500; font-size: 0.95rem; }
                .input-field:focus { background-color: #ffffff; border-color: #881337; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default ProductManager;
