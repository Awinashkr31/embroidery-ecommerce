import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { User, Package, MapPin, LogOut, Trash2, ChevronRight, Clock, CheckCircle, AlertTriangle, Loader, Star, X, Camera, Scissors, ImageIcon } from 'lucide-react';
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
    const [designRequests, setDesignRequests] = useState([]);
    const [loadingDesigns, setLoadingDesigns] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);


    // State for Address Book
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [submittingAddress, setSubmittingAddress] = useState(false);
    const [addressForm, setAddressForm] = useState({
        firstName: '', lastName: '', phone: '', zipCode: '', address: '', city: '', state: ''
    });

    // State for cancel confirmation
    const [cancelPendingOrder, setCancelPendingOrder] = useState(null);

    // State for Reviews
    const [reviewModal, setReviewModal] = useState({ isOpen: false, productId: null, productName: '', productImage: '' });
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [userReviews, setUserReviews] = useState(new Set());
    const [reviewImage, setReviewImage] = useState(null);
    const [reviewImagePreview, setReviewImagePreview] = useState(null);
    const reviewImageRef = useRef(null);

    const handleReviewImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setReviewImage(file);
        const reader = new FileReader();
        reader.onload = (ev) => setReviewImagePreview(ev.target.result);
        reader.readAsDataURL(file);
        if (reviewImageRef.current) reviewImageRef.current.value = '';
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Single query fetching by user_id OR email
                const { data, error } = await supabase
                    .from('orders')
                    .select('id, created_at, status, total, items, payment_method')
                    .or(`user_id.eq.${currentUser.uid || currentUser.id},customer_email.eq.${currentUser.email}`)
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
                    .eq('user_id', (currentUser.uid || currentUser.id));
                
                if (error) throw error;
                const reviewedProductIds = new Set(data.map(r => r.product_id));
                setUserReviews(reviewedProductIds);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        const fetchDesignRequests = async () => {
            if (!currentUser?.email) return;
            setLoadingDesigns(true);
            try {
                const { data, error } = await supabase
                    .from('custom_requests')
                    .select('id, name, phone, description, reference_images, status, created_at')
                    .eq('email', currentUser.email)
                    .order('created_at', { ascending: false });
                if (error) throw error;
                setDesignRequests(data || []);
            } catch (err) {
                console.error('Error fetching design requests:', err);
            } finally {
                setLoadingDesigns(false);
            }
        };

        if (currentUser) {
            fetchOrders();
            fetchDesignRequests();
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
        // First call: show a toast asking for confirmation
        if (cancelPendingOrder?.id !== order.id) {
            setCancelPendingOrder(order);
            const isDirectCancel = ['pending', 'confirmed'].includes(order.status.toLowerCase());
            const confirmMsg = isDirectCancel
                ? 'Tap Cancel Order again to confirm cancellation.'
                : 'Tap Cancel Order again to request cancellation (admin approval needed).';
            addToast(confirmMsg, 'info');
            return;
        }
        // Second call: proceed
        setCancelPendingOrder(null);
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
            let imageUrl = null;
            if (reviewImage) {
                try {
                    imageUrl = await uploadImage(reviewImage, 'images', 'reviews');
                } catch (uploadErr) {
                    console.error('Review image upload failed:', uploadErr);
                }
            }

            const { error } = await supabase
                .from('reviews')
                .insert([{
                    user_id: (currentUser.uid || currentUser.id),
                    user_name: currentUser.displayName,
                    product_id: reviewModal.productId,
                    rating: newReview.rating,
                    comment: newReview.comment,
                    image_url: imageUrl,
                    created_at: new Date().toISOString()
                }]);

            if (error) throw error;

            addToast('Review submitted successfully!', 'success');
            setUserReviews(prev => new Set([...prev, reviewModal.productId]));
            setReviewImage(null);
            setReviewImagePreview(null);
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
        <div className="min-h-screen bg-[#fdfbf7] pt-6 md:pt-16 pb-28 lg:pb-20 font-body">
            <div className="container-custom">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 md:p-8 mb-6 md:mb-8 flex flex-col md:flex-row items-center gap-4 md:gap-8 relative overflow-hidden">
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
                    {/* Sidebar Tabs — horizontal pills on mobile, vertical list on desktop */}
                    <div className="lg:col-span-1">
                        {/* Mobile: horizontal pills */}
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-4 lg:hidden">
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                                    activeTab === 'orders'
                                    ? 'bg-rose-900 text-white shadow-md'
                                    : 'bg-white border border-stone-200 text-stone-600'
                                }`}
                            >
                                <Package className="w-4 h-4" /> My Orders
                            </button>
                            <button
                                onClick={() => setActiveTab('addresses')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                                    activeTab === 'addresses'
                                    ? 'bg-rose-900 text-white shadow-md'
                                    : 'bg-white border border-stone-200 text-stone-600'
                                }`}
                            >
                                <MapPin className="w-4 h-4" /> Addresses
                            </button>
                            <button
                                onClick={() => setActiveTab('designs')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                                    activeTab === 'designs'
                                    ? 'bg-rose-900 text-white shadow-md'
                                    : 'bg-white border border-stone-200 text-stone-600'
                                }`}
                            >
                                <Scissors className="w-4 h-4" /> Design Requests
                            </button>
                        </div>
                        {/* Desktop: vertical card */}
                        <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden sticky top-24">
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
                            <button
                                onClick={() => setActiveTab('designs')}
                                className={`w-full flex items-center justify-between px-6 py-4 transition-all border-l-4 ${activeTab === 'designs' ? 'bg-rose-50/50 text-rose-900 font-bold border-rose-900' : 'text-stone-600 hover:bg-stone-50 border-transparent'}`}
                            >
                                <div className="flex items-center">
                                    <Scissors className={`w-5 h-5 mr-3 ${activeTab === 'designs' ? 'text-rose-900' : 'text-stone-400'}`} />
                                    Design Requests
                                </div>
                                {activeTab === 'designs' && <ChevronRight className="w-4 h-4 text-rose-900" />}
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3">
                        {activeTab === 'orders' && (
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
                        )}

                        {activeTab === 'addresses' && (
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

                        {activeTab === 'designs' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-2xl font-heading font-bold text-stone-900">Design Requests</h2>
                                    <Link to="/custom-design" className="text-xs font-bold text-rose-900 hover:underline uppercase tracking-wider">
                                        + New Request
                                    </Link>
                                </div>

                                {loadingDesigns ? (
                                    <div className="bg-white p-12 rounded-2xl shadow-sm border border-stone-100 text-center">
                                        <Loader className="w-8 h-8 text-rose-900 animate-spin mx-auto" />
                                    </div>
                                ) : designRequests.length === 0 ? (
                                    <div className="bg-white p-12 rounded-2xl shadow-sm border border-stone-100 text-center">
                                        <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Scissors className="w-10 h-10 text-stone-300" />
                                        </div>
                                        <h3 className="text-lg font-heading font-bold text-stone-900 mb-2">No design requests yet</h3>
                                        <p className="text-stone-500 max-w-sm mx-auto mb-6">Submit a custom design request and track its progress here.</p>
                                        <Link to="/custom-design" className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-900 text-white rounded-xl font-bold text-sm hover:bg-rose-800 transition-colors">
                                            <Scissors className="w-4 h-4" /> Request a Design
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {designRequests.map(req => {
                                            const statusConfig = {
                                                new: { label: 'Submitted', color: 'bg-blue-100 text-blue-700', icon: Clock },
                                                in_progress: { label: 'In Progress', color: 'bg-amber-100 text-amber-700', icon: Loader },
                                                completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
                                                cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: X },
                                            };
                                            const status = statusConfig[req.status] || statusConfig.new;
                                            const StatusIcon = status.icon;

                                            return (
                                                <div key={req.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-all">
                                                    <div className="p-5 sm:p-6">
                                                        <div className="flex items-start justify-between gap-4 mb-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                                                                    <Scissors className="w-5 h-5 text-rose-900" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-stone-400 font-medium">#{req.id.slice(0, 6).toUpperCase()}</p>
                                                                    <p className="text-xs text-stone-500">{new Date(req.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                                                </div>
                                                            </div>
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>
                                                                <StatusIcon className="w-3 h-3" />
                                                                {status.label}
                                                            </span>
                                                        </div>

                                                        <p className="text-sm text-stone-700 leading-relaxed mb-3 line-clamp-3">{req.description}</p>

                                                        {/* Reference images */}
                                                        {req.reference_images && req.reference_images.length > 0 && (
                                                            <div className="flex gap-2 mt-3">
                                                                {req.reference_images.map((img, i) => (
                                                                    <a key={i} href={img} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-lg overflow-hidden border border-stone-200 hover:border-rose-300 transition-colors shrink-0">
                                                                        <img src={img} alt={`Ref ${i + 1}`} className="w-full h-full object-cover" />
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
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
                                <label className="block text-sm font-bold text-stone-700 mb-3">How was it?</label>
                                {(() => {
                                    const ratingEmojis = [
                                        null,
                                        { emoji: '😢', label: 'Terrible', color: 'bg-red-100 border-red-300' },
                                        { emoji: '😕', label: 'Poor',     color: 'bg-orange-100 border-orange-300' },
                                        { emoji: '😐', label: 'Okay',     color: 'bg-yellow-100 border-yellow-300' },
                                        { emoji: '😊', label: 'Great',    color: 'bg-lime-100 border-lime-300' },
                                        { emoji: '🤩', label: 'Amazing!', color: 'bg-emerald-100 border-emerald-300' },
                                    ];
                                    const current = ratingEmojis[newReview.rating];
                                    return (
                                        <div className="space-y-3">
                                            <div className="flex gap-2 justify-center">
                                                {[1, 2, 3, 4, 5].map((star) => {
                                                    const isSelected = star === newReview.rating;
                                                    const isPast = star <= newReview.rating;
                                                    return (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => setNewReview({ ...newReview, rating: star })}
                                                            className={`relative flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all duration-200 ${
                                                                isSelected
                                                                    ? `${ratingEmojis[star].color} scale-110 shadow-md`
                                                                    : isPast
                                                                        ? 'border-stone-200 bg-stone-50'
                                                                        : 'border-stone-100 bg-white hover:border-stone-200 hover:bg-stone-50'
                                                            }`}
                                                        >
                                                            <span className={`text-2xl transition-all duration-200 ${isSelected ? 'scale-125' : 'grayscale opacity-50'}`}>
                                                                {ratingEmojis[star].emoji}
                                                            </span>
                                                            <span className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? 'text-stone-700' : 'text-stone-400'}`}>
                                                                {star}★
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <p className="text-center text-sm font-bold text-stone-600">
                                                <span className="text-lg mr-1">{current.emoji}</span> {current.label}
                                            </p>
                                        </div>
                                    );
                                })()}
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

                            {/* Photo Upload — Optional */}
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-2">Add a photo <span className="text-stone-400 font-normal">(optional)</span></label>
                                {reviewImagePreview ? (
                                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-stone-200 group">
                                        <img src={reviewImagePreview} alt="Review" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => { setReviewImage(null); setReviewImagePreview(null); }}
                                            className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => reviewImageRef.current?.click()}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-stone-200 text-stone-500 text-sm font-medium hover:border-rose-300 hover:text-rose-700 hover:bg-rose-50/50 transition-all"
                                    >
                                        📷 Upload photo
                                    </button>
                                )}
                                <input ref={reviewImageRef} type="file" accept="image/*" onChange={handleReviewImageSelect} className="hidden" />
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
