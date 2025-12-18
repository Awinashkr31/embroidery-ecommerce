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
            setFormData({ name: '', price: '', originalPrice: '', category: 'Home Decor', description: '', image: '', featured: false });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSubmit = { 
            ...formData, 
            price: Number(formData.price),
            originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                            <h2 className="text-xl font-heading font-bold text-stone-800">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-8 space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Product Name</label>
                                <input 
                                    type="text" required
                                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-rose-900 focus:bg-white focus:ring-0 outline-none transition-all font-medium"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-rose-900 focus:bg-white focus:ring-0 outline-none transition-all font-medium"
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Product Details / Specifications</label>
                                <textarea
                                    value={formData.specifications}
                                    onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-rose-900 focus:bg-white focus:ring-0 outline-none transition-all font-medium"
                                    rows="4"
                                    placeholder="Enter detailed specifications (one per line)..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Price (₹)</label>
                                    <input 
                                        type="number" required
                                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-rose-900 focus:bg-white focus:ring-0 outline-none transition-all font-medium"
                                        value={formData.price}
                                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Original Price (MRP)</label>
                                    <input 
                                        type="number" required
                                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-rose-900 focus:bg-white focus:ring-0 outline-none transition-all font-medium"
                                        value={formData.originalPrice || ''}
                                        onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Category</label>
                                    <select 
                                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-rose-900 focus:bg-white focus:ring-0 outline-none transition-all font-medium"
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            
                             <div className="flex items-center gap-3">
                                <input 
                                    type="checkbox" 
                                    id="featured"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                                    className="w-5 h-5 rounded border-stone-300 text-rose-900 focus:ring-rose-900"
                                />
                                <label htmlFor="featured" className="text-sm font-bold text-stone-700 cursor-pointer select-none">Mark as Featured Product</label>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Image URL</label>
                                <input 
                                    type="url"
                                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-rose-900 focus:bg-white focus:ring-0 outline-none transition-all font-medium text-sm"
                                    value={formData.image}
                                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3.5 rounded-xl border-2 border-stone-200 text-stone-600 font-bold hover:bg-stone-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 px-6 py-3.5 rounded-xl bg-rose-900 text-white font-bold hover:bg-rose-800 transition-colors shadow-lg shadow-rose-900/20">
                                    {editingProduct ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManager;
