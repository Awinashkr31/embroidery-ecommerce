import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Search, Filter, SortAsc } from 'lucide-react';

const ProductManager = () => {
    const { products, addProduct, updateProduct, deleteProduct, toggleStock } = useProducts();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    
    // Search & Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    
    // Form State
    const initialProductState = {
        name: '',
        price: '',
        originalPrice: '',
        category: 'Home Decor', // Default category
        description: '',
        specifications: '', // New field
        image: '',
        stockQuantity: 10, // Default stock
        featured: false
    };
    const [formData, setFormData] = useState(initialProductState);

    const categories = ["Home Decor", "Accessories", "Art", "Gifts", "Jewelry"];
    
    // Filtered Products Calculation
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData(product);
        } else {
            setEditingProduct(null);
            setFormData({ name: '', price: '', originalPrice: '', category: 'Home Decor', description: '', image: '', stockQuantity: 10, featured: false });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSubmit = { 
            ...formData, 
            price: Number(formData.price),
            originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
            stockQuantity: Number(formData.stockQuantity)
        };
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, dataToSubmit);
            } else {
                await addProduct(dataToSubmit);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save product", error);
            // Optionally add toast here
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
                    <p className="text-stone-500 mt-1">Manage your products and stock levels</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center px-6 py-3 bg-rose-900 text-white rounded-xl hover:bg-rose-800 transition-colors shadow-lg shadow-rose-900/20 font-bold tracking-wide text-sm"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Product
                </button>
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
                                                    {product.featured && <span className="inline-block px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] uppercase font-bold rounded">Featured</span>}
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
                                            <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
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

            {/* Professional Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-stone-900/40 backdrop-blur-md animate-in fade-in duration-300"
                        onClick={() => setIsModalOpen(false)}
                    />
                    
                    {/* Modal Content */}
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-stone-100 flex justify-between items-center bg-white z-10">
                            <div>
                                <h2 className="text-2xl font-heading font-bold text-stone-800">
                                    {editingProduct ? 'Edit Product' : 'Add New Product'}
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
                                {/* Left Col: Image Preview */}
                                <div className="lg:col-span-5 space-y-6">
                                    <div className="group relative aspect-[4/5] bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200 overflow-hidden flex items-center justify-center transition-all hover:border-rose-200">
                                        {formData.image ? (
                                            <>
                                                <img 
                                                    src={formData.image} 
                                                    alt="Preview" 
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null; 
                                                        e.target.src = 'https://placehold.co/400x500?text=Invalid+Image+URL';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                            </>
                                        ) : (
                                            <div className="text-center p-6">
                                                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
                                                    <ImageIcon className="w-8 h-8" />
                                                </div>
                                                <p className="text-stone-500 font-medium">No image URL provided</p>
                                                <p className="text-stone-400 text-xs mt-1">Enter a secure URL below to preview</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4" />
                                            Image URL
                                        </label>
                                        <input 
                                            type="url"
                                            className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-rose-900 focus:bg-white focus:ring-0 outline-none transition-all font-medium text-sm"
                                            value={formData.image}
                                            onChange={(e) => setFormData({...formData, image: e.target.value})}
                                            placeholder="https://example.com/image.jpg"
                                        />
                                        <p className="text-[10px] text-stone-400">
                                            Supported: JPG, PNG, WEBP. Make sure the link is publicly accessible.
                                        </p>
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
                                            placeholder="e.g. Vintage Floral Embroidery Hoop"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-5">
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Price (₹)</label>
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
                                            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">MRP</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold">₹</span>
                                                <input 
                                                    type="number" 
                                                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-rose-900 focus:bg-white focus:ring-0 outline-none transition-all font-medium"
                                                    value={formData.originalPrice || ''}
                                                    onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Stock Qty</label>
                                            <input 
                                                type="number" required min="0"
                                                className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-rose-900 focus:bg-white focus:ring-0 outline-none transition-all font-medium"
                                                value={formData.stockQuantity}
                                                onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})}
                                                placeholder="10"
                                            />
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

                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-rose-900 focus:bg-white focus:ring-0 outline-none transition-all font-medium min-h-[100px]"
                                            placeholder="Write a compelling description for your product..."
                                            required
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                                            Specifications <span className="text-stone-300 font-normal normal-case">(Optional)</span>
                                        </label>
                                        <textarea
                                            value={formData.specifications}
                                            onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-rose-900 focus:bg-white focus:ring-0 outline-none transition-all font-medium text-sm min-h-[80px]"
                                            placeholder="• Size: 10 inches&#10;• Material: Cotton thread, Wooden hoop&#10;• Care: Dry clean only"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-6 border-t border-stone-100 bg-stone-50 flex justify-end gap-4">
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
        </div>
    );
};

export default ProductManager;
