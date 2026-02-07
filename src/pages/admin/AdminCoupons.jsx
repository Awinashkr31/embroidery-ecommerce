import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useCategories } from '../../context/CategoryContext';
import { Plus, Trash2, Tag, Calendar, AlertCircle } from 'lucide-react';

const AdminCoupons = () => {
  const { coupons, addCoupon, deleteCoupon } = useCart();
  const { categories } = useCategories();
  
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    discount: '',
    minOrder: '',
    maxDiscount: '',
    startDate: '',
    expiry: '',
    usageLimit: '',
    perUserLimit: '',
    includedCategories: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.code && formData.discount && formData.expiry) {
        addCoupon({
            code: formData.code.toUpperCase(),
            type: formData.type,
            discount: Number(formData.discount),
            minOrder: Number(formData.minOrder) || 0,
            maxDiscount: Number(formData.maxDiscount) || 0,
            startDate: formData.startDate || new Date().toISOString().split('T')[0],
            expiry: formData.expiry,
            usageLimit: Number(formData.usageLimit) || 0,
            perUserLimit: Number(formData.perUserLimit) || 0,
            includedCategories: formData.includedCategories
        });
        setFormData({ 
            code: '', type: 'percentage', discount: '', 
            minOrder: '', maxDiscount: '', startDate: '', expiry: '', 
            usageLimit: '', perUserLimit: '', includedCategories: [] 
        });
    }
  };

  const toggleCategory = (catId) => {
      setFormData(prev => {
          const exists = prev.includedCategories.includes(catId);
          if (exists) {
              return { ...prev, includedCategories: prev.includedCategories.filter(id => id !== catId) };
          }
          return { ...prev, includedCategories: [...prev.includedCategories, catId] };
      });
  };

  return (
    <div>
       <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Discount Coupons</h1>
        <p className="text-gray-600">Manage promotional codes, invalidity rules, and targeting.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Add Coupon Form */}
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Plus className="w-5 h-5 mr-2 text-rose-900" />
                    Create New Coupon
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Code & Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Coupon Code</label>
                            <input
                                type="text"
                                required
                                placeholder="SUMMER20"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-900 focus:border-rose-900 outline-none uppercase text-sm"
                                value={formData.code}
                                onChange={(e) => setFormData({...formData, code: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-900 focus:border-rose-900 outline-none text-sm"
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="flat">Flat Amount (₹)</option>
                            </select>
                        </div>
                    </div>

                    {/* Value & Max Discount */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                {formData.type === 'percentage' ? 'Discount (%)' : 'Amount (₹)'}
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                placeholder={formData.type === 'percentage' ? "20" : "500"}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-900 focus:border-rose-900 outline-none text-sm"
                                value={formData.discount}
                                onChange={(e) => setFormData({...formData, discount: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Max Cap (₹)</label>
                            <input
                                type="number"
                                min="0"
                                disabled={formData.type === 'flat'}
                                placeholder={formData.type === 'flat' ? "N/A" : "Optional"}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-900 focus:border-rose-900 outline-none text-sm disabled:bg-gray-100"
                                value={formData.maxDiscount}
                                onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Min Order */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Min Order Amount (₹)</label>
                        <input
                            type="number"
                            min="0"
                            placeholder="Cart must be at least..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-900 focus:border-rose-900 outline-none text-sm"
                            value={formData.minOrder}
                            onChange={(e) => setFormData({...formData, minOrder: e.target.value})}
                        />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-900 focus:border-rose-900 outline-none text-sm"
                                value={formData.startDate}
                                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Expiry Date</label>
                            <input
                                type="date"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-900 focus:border-rose-900 outline-none text-sm"
                                value={formData.expiry}
                                onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Limits */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Total Usage Limit</label>
                            <input
                                type="number"
                                min="0"
                                placeholder="Total global uses"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-900 focus:border-rose-900 outline-none text-sm"
                                value={formData.usageLimit}
                                onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Limit Per User</label>
                            <input
                                type="number"
                                min="0"
                                placeholder="Uses per customer"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-900 focus:border-rose-900 outline-none text-sm"
                                value={formData.perUserLimit}
                                onChange={(e) => setFormData({...formData, perUserLimit: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                         <label className="block text-xs font-medium text-gray-700 mb-2">Applicable Categories (Empty = All)</label>
                         <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
                            {categories.map(cat => (
                                <label key={cat.id} className="flex items-center text-sm gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                                    <input 
                                        type="checkbox"
                                        checked={formData.includedCategories.includes(cat.id)}
                                        onChange={() => toggleCategory(cat.id)}
                                        className="rounded text-rose-900 focus:ring-rose-900"
                                    />
                                    <span className="text-gray-700">{cat.label}</span>
                                </label>
                            ))}
                         </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-rose-900 text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
                    >
                        Create Coupon
                    </button>
                </form>
            </div>
        </div>

        {/* Coupons List */}
        <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <Tag className="w-5 h-5 mr-2 text-rose-900" />
                        Active Coupons
                    </h2>
                </div>
                {coupons.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No coupons created yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-3">Code</th>
                                    <th className="px-6 py-3">Discount</th>
                                    <th className="px-6 py-3">Rules</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {coupons.map((coupon) => {
                                    const isExpired = new Date(coupon.expiry) < new Date();
                                    return (
                                        <tr key={coupon.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{coupon.code}</div>
                                                <div className="text-xs text-gray-500">{coupon.type === 'flat' ? 'Flat Amount' : 'Percentage'}</div>
                                            </td>
                                            <td className="px-6 py-4 text-rose-900 font-bold">
                                                {coupon.type === 'flat' ? `₹${coupon.discount}` : `${coupon.discount}%`}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 text-xs text-gray-600">
                                                    {coupon.minOrder > 0 && <span>Min Order: ₹{coupon.minOrder}</span>}
                                                    {coupon.maxDiscount > 0 && <span>Max Disc: ₹{coupon.maxDiscount}</span>}
                                                    {coupon.includedCategories?.length > 0 && (
                                                        <span className="text-emerald-700 bg-emerald-50 px-1 rounded w-fit">
                                                            {coupon.includedCategories.length} Categories
                                                        </span>
                                                    )}
                                                    {coupon.usageLimit > 0 && <span>Limit: {coupon.usageLimit} total</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-600">
                                                <div>Start: {coupon.startDate ? new Date(coupon.startDate).toLocaleDateString() : 'Immediate'}</div>
                                                <div>Exp: {new Date(coupon.expiry).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${isExpired ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                    {isExpired ? 'Expired' : 'Active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => deleteCoupon(coupon.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Delete Coupon"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCoupons;
