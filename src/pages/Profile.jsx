import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { User, Package, MapPin, LogOut, Trash2, ChevronRight, Clock, CheckCircle, AlertTriangle, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';

const Profile = () => {
    const { currentUser, logout } = useAuth();
    const { savedAddresses, deleteAddress, saveAddress } = useCart(); 
    const [activeTab, setActiveTab] = useState('orders');
    
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [submittingAddress, setSubmittingAddress] = useState(false);
    const [addressForm, setAddressForm] = useState({
        firstName: '', lastName: '', phone: '', address: '', city: '', state: '', zipCode: ''
    });

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        setSubmittingAddress(true);
        try {
            await saveAddress(addressForm, currentUser.uid);
            setIsAddingAddress(false);
            setAddressForm({ firstName: '', lastName: '', phone: '', address: '', city: '', state: '', zipCode: '' });
        } catch (error) {
            alert('Failed to save address.');
        } finally {
            setSubmittingAddress(false);
        }
    };

    useEffect(() => {
        if (currentUser?.email) {
            fetchUserOrders();
        }
    }, [currentUser]);

    const fetchUserOrders = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('customer_email', currentUser.email)
                .order('created_at', { ascending: false });

            if (error) throw error;
            
            // Transform data if necessary (ensure consistent shape with UI)
            // The DB 'items' column is distinct from how local storage might have stored it, 
            // but normally it's JSONB and should map directly if structure preserved.
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching user orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;

        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: 'cancelled' }) // Ensure lowercase 'cancelled' matches DB constraint if any
                .eq('id', orderId);

            if (error) throw error;

            // Optimistic update
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
            
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert('Failed to cancel order. Please try again.');
        }
    };

    // Helper to normalize status display
    const getStatusStyle = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'completed' || s === 'delivered') return 'bg-green-50 text-green-700 border-green-200';
        if (s === 'cancelled') return 'bg-red-50 text-red-700 border-red-200';
        return 'bg-amber-50 text-amber-700 border-amber-200';
    };

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7] font-body">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-stone-100 max-w-md w-full mx-4">
                    <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="w-8 h-8 text-rose-900" />
                    </div>
                    <h2 className="text-2xl font-heading font-bold text-stone-900 mb-2">Welcome Back</h2>
                    <p className="text-stone-500 mb-8">Please log in to access your dashboard and order history.</p>
                    <Link to="/login" className="btn-primary w-full block text-center py-3">Sign In to Continue</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fdfbf7] py-12 lg:py-20 font-body">
            <div className="container-custom">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none"></div>
                    
                    <div className="relative z-10 w-28 h-28 rounded-full bg-rose-50 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden shrink-0">
                        {currentUser.photoURL ? (
                            <img src={currentUser.photoURL} alt={currentUser.displayName} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl font-heading font-bold text-rose-900">
                                {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                            </span>
                        )}
                    </div>
                    
                    <div className="relative z-10 text-center md:text-left flex-1">
                        <h1 className="text-3xl font-heading font-bold text-stone-900 mb-1">{currentUser.displayName || 'Valued Customer'}</h1>
                        <p className="text-stone-500 font-medium">{currentUser.email}</p>
                    </div>

                    <button 
                        onClick={() => logout()}
                        className="relative z-10 flex items-center px-6 py-2.5 border border-stone-200 text-stone-600 rounded-full hover:bg-rose-50 hover:text-rose-900 hover:border-rose-200 transition-all text-sm font-bold uppercase tracking-wide group"
                    >
                        <LogOut className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Sign Out
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Tabs */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden sticky top-24">
                            <div className="p-4 bg-stone-50 border-b border-stone-100">
                                <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Menu</span>
                            </div>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`w-full flex items-center justify-between px-6 py-4 transition-all border-l-4 ${activeTab === 'orders' ? 'bg-rose-50/50 text-rose-900 font-bold border-rose-900' : 'text-stone-600 hover:bg-stone-50 border-transparent'}`}
                            >
                                <div className="flex items-center">
                                    <Package className={`w-5 h-5 mr-3 ${activeTab === 'orders' ? 'text-rose-900' : 'text-stone-400'}`} />
                                    My Orders
                                </div>
                                {activeTab === 'orders' && <ChevronRight className="w-4 h-4 text-rose-900" />}
                            </button>
                            <button
                                onClick={() => setActiveTab('addresses')}
                                className={`w-full flex items-center justify-between px-6 py-4 transition-all border-l-4 ${activeTab === 'addresses' ? 'bg-rose-50/50 text-rose-900 font-bold border-rose-900' : 'text-stone-600 hover:bg-stone-50 border-transparent'}`}
                            >
                                <div className="flex items-center">
                                    <MapPin className={`w-5 h-5 mr-3 ${activeTab === 'addresses' ? 'text-rose-900' : 'text-stone-400'}`} />
                                    Addresses
                                </div>
                                {activeTab === 'addresses' && <ChevronRight className="w-4 h-4 text-rose-900" />}
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3">
                        {activeTab === 'orders' ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-2xl font-heading font-bold text-stone-900">Order History</h2>
                                    <span className="text-sm text-stone-500 font-medium">{orders.length} Orders</span>
                                </div>
                                
                                {loading ? (
                                    <div className="flex justify-center items-center py-20 bg-white rounded-2xl shadow-sm border border-stone-100">
                                        <Loader className="w-8 h-8 text-rose-900 animate-spin" />
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="bg-white p-12 rounded-2xl shadow-sm border border-stone-100 text-center">
                                        <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Package className="w-10 h-10 text-stone-300" />
                                        </div>
                                        <h3 className="text-lg font-heading font-bold text-stone-900 mb-2">No orders yet</h3>
                                        <p className="text-stone-500 mb-8 max-w-sm mx-auto">Looks like you haven't made any purchases. Explore our collection to find something you love.</p>
                                        <Link to="/shop" className="btn-primary">Start Shopping</Link>
                                    </div>
                                ) : (
                                    orders.map(order => (
                                        <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow">
                                            <div className="p-6 bg-stone-50/50 border-b border-stone-100 flex flex-wrap justify-between items-center gap-4">
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Order ID</p>
                                                    <p className="font-mono font-bold text-stone-900">#{order.id.slice(0, 8)}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Date Placed</p>
                                                    <p className="font-medium text-stone-800">{new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Total Amount</p>
                                                    <p className="font-bold text-rose-900">₹{order.total.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusStyle(order.status)}`}>
                                                        {order.status.toLowerCase() === 'completed' && <CheckCircle className="w-3.5 h-3.5" />}
                                                        {order.status.toLowerCase() === 'cancelled' && <AlertTriangle className="w-3.5 h-3.5" />}
                                                        {order.status.toLowerCase() === 'pending' && <Clock className="w-3.5 h-3.5" />}
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="p-6">
                                                <div className="space-y-4">
                                                    {order.items?.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-4 group">
                                                            <div className="w-16 h-16 rounded-lg bg-stone-100 overflow-hidden border border-stone-200 shrink-0">
                                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-bold text-stone-900 group-hover:text-rose-900 transition-colors truncate">{item.name}</h4>
                                                                    <div className="flex flex-col text-sm text-stone-500">
                                                                        <span>Qty: {item.quantity} × ₹{item.price.toLocaleString()}</span>
                                                                        {item.originalPrice && (
                                                                            <span className="text-xs text-stone-400 line-through">MRP: ₹{item.originalPrice.toLocaleString()}</span>
                                                                        )}
                                                                    </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-bold text-stone-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {order.status.toLowerCase() === 'pending' && (
                                                    <div className="mt-6 pt-6 border-t border-stone-100 flex justify-end">
                                                        <button 
                                                            onClick={() => handleCancelOrder(order.id)}
                                                            className="text-red-600 hover:text-white px-4 py-2 rounded-lg border border-red-200 hover:bg-red-600 transition-all text-sm font-bold uppercase tracking-wide flex items-center gap-2"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Cancel Order
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-2xl font-heading font-bold text-stone-900">Address Book</h2>
                                    <button 
                                        onClick={() => setIsAddingAddress(!isAddingAddress)}
                                        className="text-xs font-bold text-rose-900 hover:underline uppercase tracking-wider"
                                    >
                                        {isAddingAddress ? 'Cancel' : '+ Add New Address'}
                                    </button>
                                </div>

                                {isAddingAddress && (
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 mb-6 animate-fadeIn">
                                        <h3 className="font-bold text-stone-900 mb-4">Add New Address</h3>
                                        <form onSubmit={handleSaveAddress} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">First Name</label>
                                                    <input required type="text" value={addressForm.firstName} onChange={e => setAddressForm({...addressForm, firstName: e.target.value})} className="w-full px-4 py-2 border border-stone-200 rounded-lg outline-none focus:border-rose-900" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">Last Name</label>
                                                    <input required type="text" value={addressForm.lastName} onChange={e => setAddressForm({...addressForm, lastName: e.target.value})} className="w-full px-4 py-2 border border-stone-200 rounded-lg outline-none focus:border-rose-900" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">Phone</label>
                                                    <input required type="tel" value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} className="w-full px-4 py-2 border border-stone-200 rounded-lg outline-none focus:border-rose-900" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">ZIP Code</label>
                                                    <input required type="text" value={addressForm.zipCode} onChange={e => setAddressForm({...addressForm, zipCode: e.target.value})} className="w-full px-4 py-2 border border-stone-200 rounded-lg outline-none focus:border-rose-900" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">Address</label>
                                                <textarea required rows="2" value={addressForm.address} onChange={e => setAddressForm({...addressForm, address: e.target.value})} className="w-full px-4 py-2 border border-stone-200 rounded-lg outline-none focus:border-rose-900 resize-none"></textarea>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">City</label>
                                                    <input required type="text" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="w-full px-4 py-2 border border-stone-200 rounded-lg outline-none focus:border-rose-900" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">State</label>
                                                    <input required type="text" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} className="w-full px-4 py-2 border border-stone-200 rounded-lg outline-none focus:border-rose-900" />
                                                </div>
                                            </div>
                                            <div className="pt-2">
                                                <button disabled={submittingAddress} type="submit" className="bg-rose-900 text-white px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-rose-800 transition-colors">
                                                    {submittingAddress ? 'Saving...' : 'Save Address'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {savedAddresses.length === 0 && !isAddingAddress ? (
                                    <div className="bg-white p-12 rounded-2xl shadow-sm border border-stone-100 text-center">
                                        <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <MapPin className="w-10 h-10 text-stone-300" />
                                        </div>
                                        <h3 className="text-lg font-heading font-bold text-stone-900 mb-2">No saved addresses</h3>
                                        <p className="text-stone-500 max-w-sm mx-auto">Your address book is empty. Add a new address or save one during checkout.</p>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {savedAddresses.map(addr => (
                                            <div key={addr.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 relative group hover:border-rose-200 hover:shadow-md transition-all">
                                                <button 
                                                    onClick={() => deleteAddress(addr.id)}
                                                    className="absolute top-4 right-4 text-stone-300 hover:text-red-500 transition-colors p-2"
                                                    title="Delete Address"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                
                                                <div className="flex items-start gap-4 mb-4">
                                                    <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                                                        <MapPin className="w-5 h-5 text-rose-900" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-stone-900">{addr.firstName} {addr.lastName}</h3>
                                                        <p className="text-sm text-stone-500 font-medium">{addr.phone}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="text-sm text-stone-600 leading-relaxed pl-14">
                                                    <p>{addr.address}</p>
                                                    <p>{addr.city}, {addr.state} - <span className="font-mono">{addr.zipCode}</span></p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
