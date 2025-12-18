import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Plus, Trash2, Tag } from 'lucide-react';

const AdminCoupons = () => {
  const { coupons, addCoupon, deleteCoupon } = useCart();
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    expiry: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.code && formData.discount && formData.expiry) {
        addCoupon({
            code: formData.code.toUpperCase(),
            discount: Number(formData.discount),
            expiry: formData.expiry
        });
        setFormData({ code: '', discount: '', expiry: '' });
    }
  };

  return (
    <div>
       <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Discount Coupons</h1>
        <p className="text-gray-600">Manage promotional codes and discounts</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Add Coupon Form */}
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Plus className="w-5 h-5 mr-2 text-deep-rose" />
                    Create New Coupon
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                        <input
                            type="text"
                            required
                            placeholder="SUMMER20"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-rose focus:border-deep-rose outline-none uppercase"
                            value={formData.code}
                            onChange={(e) => setFormData({...formData, code: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage (%)</label>
                        <input
                            type="number"
                            required
                            min="1"
                            max="100"
                            placeholder="10"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-rose focus:border-deep-rose outline-none"
                            value={formData.discount}
                            onChange={(e) => setFormData({...formData, discount: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <input
                            type="date"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-rose focus:border-deep-rose outline-none"
                            value={formData.expiry}
                            onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-deep-rose text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
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
                        <Tag className="w-5 h-5 mr-2 text-deep-rose" />
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
                                    <th className="px-6 py-3">Expiry</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {coupons.map((coupon) => {
                                    const isExpired = new Date(coupon.expiry) < new Date();
                                    return (
                                        <tr key={coupon.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{coupon.code}</td>
                                            <td className="px-6 py-4 text-deep-rose font-medium">{coupon.discount}% Off</td>
                                            <td className="px-6 py-4 text-gray-600">{new Date(coupon.expiry).toLocaleDateString()}</td>
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
