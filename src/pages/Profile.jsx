import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { User, Package, MapPin, LogOut, Trash2, ChevronRight, Clock, CheckCircle, AlertTriangle, Loader, Star, X, Camera } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { useToast } from '../context/ToastContext';
import { uploadImage, deleteImage } from '../utils/uploadUtils';
import OrderList from '../components/orders/OrderList';


const Profile = () => {
    const { currentUser, logout, updateUser } = useAuth(); // Added updateUser to destructuring
    const { savedAddresses, deleteAddress, saveAddress } = useCart(); 
    const { addToast } = useToast();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('orders');

    useEffect(() => {
        if (location.hash === '#addresses') {
            setActiveTab('addresses');
        } else {
            setActiveTab('orders');
        }
    }, [location.hash]);
    
    // ... existing state ...
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploadingImage, setUploadingImage] = useState(false);


    // State for Address Book
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [submittingAddress, setSubmittingAddress] = useState(false);
    const [addressForm, setAddressForm] = useState({
        firstName: '', lastName: '', phone: '', zipCode: '', address: '', city: '', state: ''
    });

    // State for Reviews
    const [reviewModal, setReviewModal] = useState({ isOpen: false, productId: null, productName: '', productImage: '' });
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [userReviews, setUserReviews] = useState(new Set());

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('customer_email', currentUser.email)
                    .order('created_at', { ascending: false });
                
                if (error) throw error;
                setOrders(data || []);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };
    
        const fetchUserReviews = async () => {
            try {
                const { data, error } = await supabase
                    .from('reviews')
                    .select('product_id')
                    .eq('user_id', currentUser.uid);
                
                if (error) throw error;
                const reviewedProductIds = new Set(data.map(r => r.product_id));
                setUserReviews(reviewedProductIds);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        if (currentUser) {
            fetchOrders();
            fetchUserReviews();
        } else {
            setLoading(false);
        }
    }, [currentUser]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploadingImage(true);
            const publicUrl = await uploadImage(file, 'images', 'profiles');
            
            // If upload successful, delete old image if it exists and is from our Supabase
            if (currentUser.photoURL && currentUser.photoURL.includes('supabase')) {
                await deleteImage(currentUser.photoURL);
            }

            await updateUser(currentUser.displayName, publicUrl);
            addToast('Profile picture updated!', 'success');
        } catch (error) {
            console.error(error);
            addToast('Failed to update image: ' + error.message, 'error');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        setSubmittingAddress(true);
        try {
            await saveAddress(addressForm);
            setIsAddingAddress(false);
            setAddressForm({ firstName: '', lastName: '', phone: '', zipCode: '', address: '', city: '', state: '' });
            addToast('Address saved successfully!', 'success');
        } catch (error) {
            console.error(error);
            addToast('Failed to save address', 'error');
        } finally {
            setSubmittingAddress(false);
        }
    };

    const handleCancelOrder = async (order) => {
        const isDirectCancel = ['pending', 'confirmed'].includes(order.status.toLowerCase());
        const confirmMsg = isDirectCancel 
            ? 'Are you sure you want to cancel this order?' 
            : 'Do you want to request cancellation for this order? Admin approval required.';
            
        if (!window.confirm(confirmMsg)) return;

        try {
            // Use RPC function to bypass RLS safely
            const { data, error } = await supabase.rpc('cancel_order', { 
                p_order_id: order.id, 
                p_email: currentUser.email 
            });

            if (error) throw error;
            if (!data.success) throw new Error(data.message);
            
            // Update local state based on returned new status
            const newStatus = data.new_status;
            setOrders(orders.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
            addToast(data.message, 'success');
        } catch (error) {
            console.error('Cancellation error:', error);
            addToast(error.message || 'Failed to update order', 'error');
        }
    };

    const openReviewModal = (item) => {
        setReviewModal({
            isOpen: true,
            productId: item.id,
            productName: item.name,
            productImage: item.image
        });
    };

    const closeReviewModal = () => {
        setReviewModal({ isOpen: false, productId: null, productName: '', productImage: '' });
        setNewReview({ rating: 5, comment: '' });
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setSubmittingReview(true);
        try {
            const { error } = await supabase
                .from('reviews')
                .insert([{
                    user_id: currentUser.uid,
                    user_name: currentUser.displayName,
                    product_id: reviewModal.productId,
                    rating: newReview.rating,
                    comment: newReview.comment,
                    created_at: new Date().toISOString()
                }]);

            if (error) throw error;

            addToast('Review submitted successfully!', 'success');
            setUserReviews(prev => new Set([...prev, reviewModal.productId]));
            closeReviewModal();
        } catch (error) {
            console.error(error);
            addToast('Failed to submit review', 'error');
        } finally {
            setSubmittingReview(false);
        }
    };



    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
                <Loader className="w-8 h-8 text-rose-900 animate-spin" />
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7] px-4 font-body">
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                    <User className="w-10 h-10 text-rose-900" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-stone-900 mb-2">My Profile</h2>
                <p className="text-stone-600 mb-8 text-center max-w-sm">Please log in to view your orders, manage addresses, and access your profile settings.</p>
                <Link to="/login" className="btn-primary px-8">
                    Log In / Sign Up
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fdfbf7] pt-32 pb-24 lg:py-20 font-body">
            <div className="container-custom">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none"></div>
                    
                    <div className="relative z-10 shrink-0">
                        <div className="w-28 h-28 rounded-full bg-rose-50 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden relative">
                            {uploadingImage && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                                    <Loader className="w-8 h-8 text-white animate-spin" />
                                </div>
                            )}
                            
                            {currentUser.photoURL ? (
                                <img src={currentUser.photoURL} alt={currentUser.displayName} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl font-heading font-bold text-rose-900">
                                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                                </span>
                            )}
                        </div>

                        {/* Edit Button */}
                        <label className="absolute bottom-0 right-0 bg-white border border-stone-200 p-2 rounded-full cursor-pointer shadow-md text-stone-600 hover:text-rose-900 hover:bg-rose-50 transition-colors z-30" title="Change Profile Photo">
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            <Camera className="w-4 h-4" />
                        </label>
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
                                
                                {/* Unboxing Video Reminder */}
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800 text-sm mb-4">
                                     <AlertTriangle className="w-5 h-5 shrink-0" />
                                     <div>
                                         <p className="font-bold">Important Policy:</p>
                                         <p className="text-xs leading-relaxed mt-1">
                                             For any return or replacement requests, an <strong>unboxing video is mandatory</strong>. Please ensure you record a video while opening your package.
                                         </p>
                                     </div>
                                </div>

                                <OrderList 
                                    orders={orders} 
                                    loading={loading} 
                                    onCancelOrder={handleCancelOrder} 
                                    onReviewOrder={openReviewModal}
                                    userReviews={userReviews}
                                />
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


            {/* Review Modal */}
            {reviewModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 bg-stone-50 border-b border-stone-100 flex justify-between items-center">
                            <h3 className="text-xl font-heading font-bold text-stone-900">Write a Review</h3>
                            <button onClick={closeReviewModal} className="text-stone-400 hover:text-stone-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmitReview} className="p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                                    <img src={reviewModal.productImage} alt={reviewModal.productName} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Product</p>
                                    <h4 className="font-bold text-stone-900">{reviewModal.productName}</h4>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setNewReview({ ...newReview, rating: star })}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star 
                                                className={`w-8 h-8 ${star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-stone-300'}`} 
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-2">Review</label>
                                <textarea
                                    value={newReview.comment}
                                    onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                                    placeholder="Share your experience with this product..."
                                    rows="4"
                                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-900/20 outline-none resize-none"
                                    required
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button 
                                    type="button" 
                                    onClick={closeReviewModal}
                                    className="px-6 py-2.5 font-bold text-stone-600 hover:bg-stone-50 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={submittingReview}
                                    className="px-6 py-2.5 bg-rose-900 text-white font-bold rounded-xl hover:bg-rose-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                                >
                                    {submittingReview && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                                    Submit Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
