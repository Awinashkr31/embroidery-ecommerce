import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ArrowLeft, Tag, X, Truck, Heart, ShieldCheck, Sparkles, Plus, Minus, ChevronRight, ChevronUp, ChevronDown, Gift, CheckCircle, Info, MapPin, Edit3, Shield, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';
import { getEstimatedDeliveryDate } from '../utils/dateUtils';
import { getProductUrl } from '../utils/urlUtils';
import FloatingInput from '../components/FloatingInput';

const Cart = () => {
    const { 
        cart, 
        cartLoading, 
        removeFromCart, 
        updateQuantity,
        addToCart,
        cartTotal, 
        subtotal, 
        giftWrapTotal,
        shippingCharge, 
        applyCoupon, 
        removeCoupon, 
        appliedCoupon, 
        discountAmount,
        MIN_ORDER_VALUE,
        FREE_DELIVERY_THRESHOLD,
        isOrderDeployable,
        isGiftWrapped,
        setIsGiftWrapped,
        giftNote,
        setGiftNote,
        savedAddresses,
        saveAddress,
        updateAddress,
        cartCount
    } = useCart();
    const { products } = useProducts();
    const { currentUser, openLoginSheet } = useAuth();
    const { addToWishlist } = useWishlist();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [isCouponOpen, setIsCouponOpen] = useState(false);
    const [isNoteInputOpen, setIsNoteInputOpen] = useState(false);
    const [isDiscountsOpen, setIsDiscountsOpen] = useState(false);

    // Address State
    const userAddresses = savedAddresses?.filter(addr => addr.userId === (currentUser?.uid || currentUser?.id)) || [];
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
    const [isAddressDrawerOpen, setIsAddressDrawerOpen] = useState(false);
    const [isZipLoading, setIsZipLoading] = useState(false);
    const [addressForm, setAddressForm] = useState({
        fullName: '', phone: '', zipCode: '', address: '', landmark: '', city: '', state: ''
    });
    const [pendingCheckout, setPendingCheckout] = useState(false);

    React.useEffect(() => {
        // If pendingCheckout is true, user is logged in, and has an address, redirect to checkout
        if (pendingCheckout && currentUser && selectedAddressId) {
            setPendingCheckout(false);
            navigate('/checkout', { state: { selectedAddressId } });
        }
    }, [currentUser, selectedAddressId, pendingCheckout, navigate]);

    React.useEffect(() => {
        if (!selectedAddressId && userAddresses.length > 0) {
            setSelectedAddressId(userAddresses[0].id);
        }
    }, [userAddresses, selectedAddressId]);

    const handleZipChange = async (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
        setAddressForm(prev => ({ ...prev, zipCode: val }));
        if (val.length === 6) {
            setIsZipLoading(true);
            try {
                const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
                const data = await res.json();
                if (data[0].Status === 'Success') {
                    const postOffice = data[0].PostOffice[0];
                    setAddressForm(prev => ({ ...prev, city: postOffice.District, state: postOffice.State }));
                }
            } catch (err) {
                console.error('Pincode fetch error:', err);
            }
            setIsZipLoading(false);
        }
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            openLoginSheet();
            return;
        }
        
        setIsSubmitting(true);
        const submissionData = {
            firstName: addressForm.fullName.split(' ')[0] || '',
            lastName: addressForm.fullName.split(' ').slice(1).join(' ') || '',
            phone: addressForm.phone,
            alternatePhone: '',
            houseNo: addressForm.address,
            area: '-',
            landmark: addressForm.landmark,
            city: addressForm.city,
            state: addressForm.state,
            zipCode: addressForm.zipCode,
            addressType: 'Home'
        };

        try {
            if (editingAddressId) {
                const updatedAddr = await updateAddress(editingAddressId, submissionData);
                if (updatedAddr) {
                    setSelectedAddressId(updatedAddr.id);
                    addToast('Address updated successfully!', 'success');
                }
            } else {
                const newAddr = await saveAddress(submissionData, (currentUser.uid || currentUser.id));
                if (newAddr && newAddr.id) {
                    setSelectedAddressId(newAddr.id);
                    addToast('Address saved successfully!', 'success');
                }
            }
            setIsAddressDrawerOpen(false);
            setEditingAddressId(null);
            setAddressForm({ fullName: '', phone: '', zipCode: '', address: '', landmark: '', city: '', state: '' });
        } catch (err) {
            console.error('Save address error:', err);
            addToast(`Failed to save: ${err.message || err.error_description || JSON.stringify(err)}`, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePlaceOrderClick = () => {
        if (!currentUser) {
            setPendingCheckout(true);
            openLoginSheet();
        } else if (!selectedAddressId) {
            setPendingCheckout(true);
            setIsAddressDrawerOpen(true);
        } else {
            navigate('/checkout', { state: { selectedAddressId } });
        }
    };

    const cartCategories = [...new Set(cart.map(item => item.category))];
    
    // Calculations for Price Details
    const totalMrp = cart.reduce((acc, item) => acc + ((item.originalPrice || item.price) * item.quantity), 0);
    const productDiscount = totalMrp - subtotal;
    const totalSaved = productDiscount + discountAmount; // Includes both product discounts and coupon discounts

    const relatedProducts = products?.filter(p => 
        (p.stock > 0 || p.stock_quantity > 0) && 
        cartCategories.includes(p.category) && 
        !cart.find(c => c.id === p.id)
    ).slice(0, 4) || [];

    const [itemToRemove, setItemToRemove] = useState(null);
    const [isRemoveSheetOpen, setIsRemoveSheetOpen] = useState(false);

    const initiateRemove = (item) => {
        setItemToRemove(item);
        setIsRemoveSheetOpen(true);
    };

    const confirmRemove = () => {
        if (itemToRemove) {
            removeFromCart(itemToRemove.id, itemToRemove.selectedSize, itemToRemove.selectedColor, itemToRemove.variantId);
        }
        setIsRemoveSheetOpen(false);
        setItemToRemove(null);
    };

    const confirmMoveToWishlist = () => {
        if (itemToRemove) {
            removeFromCart(itemToRemove.id, itemToRemove.selectedSize, itemToRemove.selectedColor, itemToRemove.variantId);
            addToWishlist(itemToRemove);
        }
        setIsRemoveSheetOpen(false);
        setItemToRemove(null);
    };

    const handleApplyCoupon = () => {
        try {
            setCouponError('');
            applyCoupon(couponCode.toUpperCase());
            setCouponCode('');
            setIsCouponOpen(false);
        } catch (err) {
            setCouponError(err.message);
        }
    };

    const handleQuickAdd = (e, prod) => {
        e.preventDefault();
        addToCart(prod, 1, prod.sizes?.[0] || 'NA', prod.colors?.[0] || 'NA', prod.variants?.[0]?.id || null);
    };

    if (cartLoading && cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#F8F5F2] font-body p-4">
                <SEO title="Shopping Cart" description="Loading your cart..." />
                <div className="w-12 h-12 border-4 border-stone-200 border-t-rose-900 rounded-full animate-spin mb-4"></div>
                <p className="text-[13px] text-stone-500 font-medium animate-pulse">Loading your cart...</p>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F8F5F2] font-body p-4">
                <SEO title="Shopping Cart" description="Your shopping cart is empty." />
                <div className="bg-white p-6 rounded-full mb-6 shadow-sm border border-stone-100 animate-in zoom-in-50 duration-500">
                    <img src="/empty-cart.svg" alt="Empty Cart" className="w-24 h-24 opacity-80" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
                    <Trash2 className="w-12 h-12 text-stone-300 hidden" />
                </div>
                <h2 className="text-[24px] font-bold text-stone-900 mb-2">Your cart is empty</h2>
                <p className="text-[14px] text-stone-500 mb-8 max-w-sm text-center">Looks like you haven't added anything yet. Explore our collection to find something unique.</p>
                <Link to="/shop" className="bg-stone-900 text-white hover:bg-stone-800 transition-colors px-10 py-3.5 rounded-[12px] text-[15px] font-bold shadow-sm">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#F8F5F2] min-h-screen font-body pb-[140px] md:pb-24 transition-all duration-250 ease-in-out">
            <SEO title="Shopping Cart" description="Review your selected items and proceed to checkout." />
            
            {/* Mobile Nav Header */}
            <div className="lg:hidden flex items-center gap-3 bg-white px-4 py-3.5 shadow-sm mb-4 sticky top-0 z-50 border-b border-stone-100">
                <button onClick={() => navigate(-1)} className="text-stone-800 active:scale-95 transition-transform p-1 -ml-1">
                    <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
                </button>
                <span className="text-[#1350a8] text-[16px] font-medium tracking-tight">My Cart</span>
            </div>

            <div className="max-w-6xl mx-auto px-[14px] md:px-8 pt-2 md:pt-12">
                
                {/* Desktop Header */}
                <h1 className="hidden lg:block text-[28px] font-heading font-semibold text-stone-900 mb-5 tracking-tight">Shopping Cart</h1>

                {!isOrderDeployable && (
                    <div className="bg-red-50 border border-red-100 rounded-[16px] p-4 mb-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                        <div className="p-2 bg-red-100 rounded-full text-red-600 shrink-0">
                            <Tag className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-[14px] font-bold text-red-900">Minimum Order Value is ₹{MIN_ORDER_VALUE}</h3>
                            <p className="text-[13px] text-red-700 mt-0.5">
                                Please add items worth ₹{MIN_ORDER_VALUE - subtotal} more to place your order.
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
                    
                    {/* LEFT COLUMN: Cart Items & Flow */}
                    <div className="lg:w-2/3 space-y-4">
                        
                        {/* 0. Delivery Address */}
                        <div className="bg-white rounded-[16px] p-4 lg:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-stone-100 mb-4 transition-all duration-250 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                            <div className="flex items-start gap-3">
                                <div className="bg-stone-50 p-2 rounded-full text-stone-600">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    {selectedAddressId ? (
                                        (() => {
                                            const addr = userAddresses.find(a => a.id === selectedAddressId);
                                            if (!addr) return null;
                                            return (
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex-1 min-w-0 pr-4 pt-1">
                                                        <div className="text-[14.5px] text-stone-900 mb-0.5">
                                                            <span className="text-stone-800">Deliver to: </span>
                                                            <span className="font-medium">{addr.firstName} {addr.lastName}</span>
                                                            <span className="font-medium">, {addr.zipCode}</span>
                                                        </div>
                                                        <div className="text-[13px] text-stone-500 leading-relaxed">
                                                            {addr.address || [addr.houseNo, addr.area !== '-' ? addr.area : null].filter(Boolean).join(', ')}
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => {
                                                            setEditingAddressId(null);
                                                            setIsAddingNewAddress(false);
                                                            setAddressForm({ fullName: '', phone: '', zipCode: '', address: '', landmark: '', city: '', state: '' });
                                                            setIsAddressDrawerOpen(true);
                                                        }}
                                                        className="shrink-0 text-[#1a56db] text-[13px] font-medium px-4 py-1.5 border border-stone-200 rounded-[4px] hover:bg-stone-50 transition-colors bg-white shadow-sm"
                                                    >
                                                        Change
                                                    </button>
                                                </div>
                                            );
                                        })()
                                    ) : (
                                        <div className="flex flex-row items-center justify-between">
                                            <h3 className="font-bold text-stone-900 text-[18px]">Delivery Address</h3>
                                            <button 
                                                onClick={() => {
                                                    setEditingAddressId(null);
                                                    setAddressForm({ fullName: '', phone: '', zipCode: '', address: '', landmark: '', city: '', state: '' });
                                                    setIsAddingNewAddress(true);
                                                    setIsAddressDrawerOpen(true);
                                                }}
                                                className="bg-white border border-stone-200 text-rose-600 font-semibold px-4 py-1.5 rounded-lg text-[13px] shadow-sm hover:border-rose-300 transition-colors"
                                            >
                                                + Add Address
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 1. Cart Items */}
                        <div className="space-y-4">
                            {cart.map((item, idx) => (
                                <div key={`${item.id}-${item.selectedSize || 'nosize'}-${item.selectedColor || 'nocolor'}-${idx}`} className="bg-[#FFFFFF] p-4 rounded-[16px] flex gap-4 items-start relative animate-stagger-fade shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-250 ease-in-out hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]" style={{ animationDelay: `${idx * 0.08}s` }}>
                                    
                                    {/* Image */}
                                    <Link to={getProductUrl(item)} className="w-[90px] h-[90px] md:w-[100px] md:h-[100px] rounded-xl overflow-hidden bg-stone-50 shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.04)] block hover:opacity-90 transition-opacity">
                                        <img
                                            src={item.variants?.find(v => v.id === item.variantId)?.images?.[0] || item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                            onError={(e) => { e.target.onerror = null; e.target.src = '/logo.png'; }}
                                        />
                                    </Link>
                                    
                                    {/* Details */}
                                    <div className="flex-1 min-w-0 pb-1">
                                        <div className="flex justify-between items-start">
                                            <Link to={getProductUrl(item)} className="hover:underline">
                                                <h3 className="text-[15px] md:text-base font-semibold text-stone-900 leading-tight pr-6 mb-1">{item.name}</h3>
                                            </Link>
                                            
                                            {/* Mobile Remove */}
                                            <button 
                                                onClick={() => initiateRemove(item)}
                                                className="text-stone-400 opacity-70 hover:opacity-100 hover:text-rose-900 transition-all duration-250 absolute top-4 right-4"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <p className="text-[13px] text-amber-700 font-medium mb-2 flex items-center gap-1">
                                            ✨ Handmade on order
                                        </p>

                                        {/* Price Hierarchy & Quantity */}
                                        <div className="flex items-end justify-between mt-3">
                                            <div>
                                                {/* Meta text (size, color) */}
                                                <div className="flex flex-wrap gap-1 text-[13px] text-stone-500 mb-1.5">
                                                    {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                                                    {item.selectedSize && item.selectedColor && item.selectedColor !== 'NA' && <span>•</span>}
                                                    {item.selectedColor && item.selectedColor !== 'NA' && <span>Color: {item.selectedColor}</span>}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-stone-900 text-[16px]">₹{(item.price * item.quantity).toLocaleString()}</span>
                                                    {item.originalPrice && (
                                                        <>
                                                            <span className="text-[13px] text-stone-400 line-through">₹{(item.originalPrice * item.quantity).toLocaleString()}</span>
                                                            {item.discountPercentage > 0 && (
                                                                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-full">
                                                                    {item.discountPercentage}% OFF
                                                                </span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Quantity Pill - Upgraded */}
                                            <div className="flex items-center bg-[#F7F3F1] rounded-full h-[40px] px-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
                                                <button
                                                    onClick={() => { if (item.quantity === 1) initiateRemove(item); else updateQuantity(item.id, item.quantity - 1, item.selectedSize, item.selectedColor, item.variantId); }}
                                                    className="w-8 h-full flex items-center justify-center text-stone-500 hover:text-stone-900 transition-all duration-250 rounded-l-full active:scale-90"
                                                >
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="w-8 text-center text-stone-900 font-bold text-[14px] select-none transition-all duration-250">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize, item.selectedColor, item.variantId)}
                                                    disabled={item.quantity >= (item.stock ?? item.stock_quantity ?? 100)}
                                                    className={`w-8 h-full flex items-center justify-center transition-all duration-250 rounded-r-full active:scale-90 ${item.quantity >= (item.stock ?? item.stock_quantity ?? 100) ? 'text-stone-300' : 'text-stone-500 hover:text-stone-900'}`}
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>


                                        {item.giftNote && (
                                            <div className="mt-2 text-[13px] text-stone-500 italic bg-[#F7F3F1] p-2.5 rounded-lg">
                                                📝 "{item.giftNote}"
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Global Gift Packaging Upsell */}
                        <div className={`relative overflow-hidden block rounded-xl p-4 transition-all duration-500 shadow-sm ${isGiftWrapped ? 'bg-[#FFF6F8] border border-[#F7D6DF]' : 'bg-[#FFF6F8] border border-[#F7D6DF] hover:bg-rose-50/50 before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent'}`}>
                            <div className="flex gap-3 items-start justify-between relative z-10">
                                <div className="flex-1">
                                    <h3 className="text-[14px] font-sans font-bold text-[#1f2937]">
                                        🎁 Gift Packaging <span className="text-[#4b5563]">(+₹29)</span>
                                    </h3>
                                        <p className="text-[12px] text-[#6b7280] mt-0.5">
                                            Wrapped beautifully with a handwritten note.
                                        </p>
                                        
                                        {/* Optional Note Input */}
                                        <AnimatePresence>
                                            {isGiftWrapped && !isNoteInputOpen && (
                                                <motion.button
                                                    initial={{ opacity: 0, marginTop: 0 }}
                                                    animate={{ opacity: 1, marginTop: 12 }}
                                                    exit={{ opacity: 0, marginTop: 0 }}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setIsNoteInputOpen(true);
                                                    }}
                                                    className="text-xs font-medium text-rose-600 hover:text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 mt-3"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                    Add note (optional)
                                                </motion.button>
                                            )}
                                            
                                            {isGiftWrapped && isNoteInputOpen && (
                                                <motion.div 
                                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                    animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                    className="overflow-hidden relative"
                                                >
                                                    <textarea 
                                                        value={giftNote}
                                                        onChange={(e) => setGiftNote(e.target.value)}
                                                        placeholder="Add your gift note here..."
                                                        className="w-full text-sm p-3 pr-8 rounded-lg border border-[#F7D6DF] bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-shadow outline-none resize-none placeholder:text-stone-400"
                                                        rows="2"
                                                        onClick={(e) => e.preventDefault()} // prevent label toggle when clicking textarea
                                                    ></textarea>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setIsNoteInputOpen(false);
                                                            setGiftNote('');
                                                        }}
                                                        className="absolute top-2 right-2 p-1 text-stone-400 hover:text-stone-600 bg-white rounded-full hover:bg-stone-100 transition-colors"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setIsGiftWrapped(!isGiftWrapped);
                                        if (isGiftWrapped) setGiftNote('');
                                    }}
                                    className={`shrink-0 px-4 py-1.5 mt-0.5 rounded-lg text-[12px] font-extrabold transition-all border-[1.5px] border-rose-600 ${
                                        isGiftWrapped 
                                        ? 'text-rose-600 bg-rose-50 hover:bg-rose-100' 
                                        : 'bg-rose-600 text-white shadow-sm hover:bg-rose-700 active:scale-95'
                                    }`}
                                >
                                    {isGiftWrapped ? 'REMOVE' : 'ADD +'}
                                </button>
                            </div>
                        </div>

                        {/* 2. Delivery Progress moved to Order Summary */}

                        {/* 3. Horizontal Recommendations */}
                        {relatedProducts.length > 0 && (
                            <div className="pt-2 pb-1">
                                <h3 className="text-[15px] font-semibold text-stone-900 mb-3 flex items-center gap-2">
                                    Complete Your Gift 🎁
                                </h3>
                                <div className="flex gap-4 overflow-x-auto snap-x scrollbar-hide pb-2 -mx-[14px] px-[14px] md:mx-0 md:px-0">
                                    {relatedProducts.map(prod => (
                                        <div key={prod.id} className="snap-start flex-none w-[140px] md:w-[160px] bg-[#FFFFFF] rounded-[16px] p-2 shadow-[0_2px_12px_rgba(0,0,0,0.04)] group relative transition-all duration-250">
                                            <Link to={getProductUrl(prod)}>
                                                <div className="aspect-square rounded-xl overflow-hidden bg-stone-50 mb-2.5 relative">
                                                    <img src={prod.images?.[0] || prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                </div>
                                            </Link>
                                            <Link to={getProductUrl(prod)} className="block">
                                                <h4 className="text-[13px] font-medium text-stone-800 line-clamp-1 group-hover:text-rose-900 transition-colors leading-tight mb-1">{prod.name}</h4>
                                                <p className="text-[14px] font-bold text-stone-900">₹{prod.price}</p>
                                            </Link>
                                            <button onClick={(e) => handleQuickAdd(e, prod)} className="absolute bottom-2 right-2 bg-[#F8F5F2] text-stone-800 hover:bg-rose-900 hover:text-white transition-all duration-250 w-7 h-7 rounded-full flex items-center justify-center shadow-sm active:scale-90">
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 4. Modern Coupon Section */}
                        <div className="bg-[#FFFFFF] p-4 rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-250">
                            {appliedCoupon ? (
                                <div className="bg-emerald-50 border border-emerald-100 rounded-[12px] p-3 flex items-center justify-between">
                                    <div className="flex items-center text-emerald-800 gap-2">
                                        <Tag className="w-4 h-4" />
                                        <div>
                                            <div className="text-[14px] font-bold">{appliedCoupon.code} applied automatically</div>
                                            <div className="text-[13px] text-emerald-600 font-medium">You saved ₹{discountAmount.toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <button onClick={removeCoupon} className="text-stone-400 hover:text-red-500 p-1 transition-colors">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => setIsCouponOpen(!isCouponOpen)}
                                        className="w-full flex items-center justify-between text-[14px] font-semibold text-stone-800 hover:text-rose-900 transition-colors"
                                    >
                                        <span className="flex items-center gap-2"><Tag className="w-4 h-4"/> Apply Coupon</span>
                                        <ChevronRight className={`w-4 h-4 transition-transform duration-250 ${isCouponOpen ? 'rotate-90' : ''}`} />
                                    </button>
                                    
                                    {isCouponOpen && (
                                        <div className="mt-3 flex gap-2 animate-in fade-in slide-in-from-top-2 duration-250">
                                            <input
                                                type="text"
                                                placeholder="Enter code"
                                                className="flex-1 px-4 py-3 bg-[#F8F5F2] border border-stone-100 rounded-[12px] focus:border-rose-900 outline-none uppercase font-semibold text-[14px] transition-all placeholder:normal-case placeholder:font-normal placeholder:text-stone-400"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                            />
                                            <button
                                                onClick={handleApplyCoupon}
                                                className="px-6 py-3 bg-stone-900 text-white rounded-[12px] hover:bg-stone-800 transition-colors font-bold text-[14px] active:scale-95 shadow-sm"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    )}
                                    {couponError && <p className="text-red-500 text-[13px] font-medium mt-2 flex items-center gap-1"><X className="w-3 h-3"/> {couponError}</p>}
                                </>
                            )}
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Order Summary (Desktop Sticky) */}
                    <div className="lg:w-1/3">
                        <div className="bg-[#FFFFFF] p-4 lg:p-6 lg:sticky lg:top-28">
                            <h2 className="text-[17px] font-bold text-stone-700 mb-4 tracking-tight">Price Details</h2>
                            
                            <div className="bg-[#F8F8F8] rounded-[16px] p-4 lg:p-5">
                                {/* MRP */}
                                <div className="flex justify-between text-[14px] text-stone-700 mb-5">
                                    <span className="border-b border-dotted border-stone-400">MRP (incl. of all taxes)</span>
                                    <span className="text-stone-700">₹{totalMrp.toLocaleString()}</span>
                                </div>
                                
                                {/* Delivery Charges */}
                                <div className="flex flex-col mb-5">
                                    <div className="flex justify-between text-[14px] text-stone-700">
                                        <span className="border-b border-dotted border-stone-400">Delivery Charges</span>
                                        <span className="text-stone-700">
                                            {shippingCharge === 0 ? (
                                                <span className="flex items-center gap-1.5">
                                                    <span className="text-stone-400 line-through text-[13px]">₹80</span>
                                                    <span className="text-emerald-600">FREE</span>
                                                </span>
                                            ) : (
                                                `₹${shippingCharge}`
                                            )}
                                        </span>
                                    </div>
                                    {shippingCharge > 0 ? (
                                        <span className="text-[12px] text-emerald-600 mt-1">
                                            Add ₹{FREE_DELIVERY_THRESHOLD - subtotal} to FREE delivery
                                        </span>
                                    ) : (
                                        <span className="text-[12px] text-emerald-600 font-medium mt-1">
                                            Free delivery unlocked!
                                        </span>
                                    )}
                                </div>

                                <div className="border-b border-dashed border-stone-200 my-4"></div>

                                {/* Discounts */}
                                <div className="mb-5">
                                    <div 
                                        className="flex justify-between text-[14.5px] text-stone-800 mb-2 cursor-pointer select-none"
                                        onClick={() => setIsDiscountsOpen(!isDiscountsOpen)}
                                    >
                                        <span className="flex items-center gap-1">
                                            Discounts 
                                            {isDiscountsOpen ? <ChevronUp className="w-4 h-4 text-stone-500"/> : <ChevronDown className="w-4 h-4 text-stone-500"/>}
                                        </span>
                                        {!isDiscountsOpen && totalSaved > 0 && (
                                            <span className="text-[#198754] font-medium">- ₹{totalSaved.toLocaleString()}</span>
                                        )}
                                    </div>
                                    
                                    {isDiscountsOpen && (
                                        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                                            {productDiscount > 0 && (
                                                <div className="flex justify-between text-[13.5px] text-stone-500 mb-2">
                                                    <span>Discount on MRP</span>
                                                    <span className="text-[#198754] font-medium">- ₹{productDiscount.toLocaleString()}</span>
                                                </div>
                                            )}
                                            {discountAmount > 0 && (
                                                <div className="flex justify-between text-[13.5px] text-stone-500">
                                                    <span>Coupon Discount</span>
                                                    <span className="text-[#198754] font-medium">- ₹{discountAmount.toLocaleString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="border-b border-solid border-stone-200 my-4"></div>

                                {/* Total Amount */}
                                <div className="flex justify-between text-[15px] font-medium text-stone-900 mb-4">
                                    <span>Total Amount</span>
                                    <span>₹{cartTotal.toLocaleString()}</span>
                                </div>

                                {/* Savings Pill */}
                                {totalSaved > 0 && (
                                    <div className="bg-[#e4fcf1] text-[#1e8557] font-medium px-4 py-2.5 rounded-lg text-[13px] flex items-center justify-center gap-2">
                                        <Tag className="w-4 h-4"/> You'll save ₹{totalSaved.toLocaleString()} on this order!
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handlePlaceOrderClick}
                                disabled={!isOrderDeployable}
                                className={`hidden lg:flex w-full h-[54px] rounded-[12px] font-bold text-[16px] tracking-wide transition-all duration-250 items-center justify-center gap-2 active:scale-[0.98] ${
                                    isOrderDeployable 
                                    ? 'bg-[#FFC200] text-black hover:bg-[#F3B600] shadow-sm' 
                                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                                }`}
                            >
                                {isOrderDeployable ? 'PLACE ORDER' : `Add items worth ₹${MIN_ORDER_VALUE - subtotal} more`}
                            </button>
                            
                            {!currentUser && (
                                <p className="text-center text-[13px] text-[#777] mt-4 hidden lg:block">
                                    Checkout as Guest or <Link to="/login" className="text-rose-900 font-medium hover:underline">Log In</Link>
                                </p>
                            )}

                            {/* Trust Indicators */}
                            <div className="mt-8 flex justify-between items-start border-t border-stone-100 pt-6">
                                <div className="flex flex-col items-center justify-center gap-2 flex-1 px-2 text-center">
                                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 mb-1">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <span className="text-[12px] font-medium text-stone-500 leading-tight">Secure Payments</span>
                                </div>
                                <div className="w-px h-12 bg-stone-100 mt-2"></div>
                                <div className="flex flex-col items-center justify-center gap-2 flex-1 px-2 text-center">
                                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 mb-1">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <span className="text-[12px] font-medium text-stone-500 leading-tight">Fast Delivery</span>
                                </div>
                                <div className="w-px h-12 bg-stone-100 mt-2"></div>
                                <div className="flex flex-col items-center justify-center gap-2 flex-1 px-2 text-center">
                                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 mb-1">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <span className="text-[12px] font-medium text-stone-500 leading-tight">100% Authentic</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Checkout Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-4 py-3 lg:hidden z-40 flex items-center justify-between shadow-[0_-4px_12px_rgba(0,0,0,0.04)] pb-[calc(env(safe-area-inset-bottom)+12px)]">
                <div className="flex flex-col justify-center">
                    {totalSaved > 0 && (
                        <div className="text-[12.5px] text-stone-400 line-through leading-none mb-0.5 font-medium">
                            ₹{(totalMrp + giftWrapTotal + (shippingCharge === 0 ? 0 : shippingCharge)).toLocaleString()}
                        </div>
                    )}
                    <div className="flex items-center gap-1.5">
                        <span className="text-[20px] font-bold text-stone-900 leading-none tracking-tight">₹{cartTotal.toLocaleString()}</span>
                        <Info className="w-4 h-4 text-stone-400 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
                    </div>
                </div>
                <button
                    onClick={handlePlaceOrderClick}
                    disabled={!isOrderDeployable}
                    className={`h-[44px] px-10 rounded-[4px] font-bold text-[15px] tracking-wide transition-all duration-250 shadow-sm ${
                        isOrderDeployable 
                        ? 'bg-[#FFC200] text-black hover:bg-[#F3B600] active:scale-95' 
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                >
                    {isOrderDeployable ? 'PLACE ORDER' : 'ADD ITEMS'}
                </button>
            </div>



            {/* Remove / Move to Wishlist Bottom Sheet */}
            {isRemoveSheetOpen && itemToRemove && (
                <>
                    <div className="fixed inset-0 bg-stone-900/40 z-[60] backdrop-blur-[2px] transition-opacity animate-in fade-in duration-300" onClick={() => setIsRemoveSheetOpen(false)} />
                    <div className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-[24px] p-5 pb-[calc(env(safe-area-inset-bottom)+20px)] mb-0 shadow-2xl transform transition-transform animate-in slide-in-from-bottom duration-300 md:max-w-md md:left-1/2 md:-translate-x-1/2 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:rounded-[24px]">
                        <button onClick={() => setIsRemoveSheetOpen(false)} className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-900 bg-[#F8F5F2] rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex gap-4 items-center mb-5 mt-2 border-b border-stone-100 pb-5">
                            <div className="w-[72px] h-[72px] rounded-xl overflow-hidden bg-stone-100 shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                                <img src={itemToRemove.variants?.find(v => v.id === itemToRemove.variantId)?.images?.[0] || itemToRemove.image} alt={itemToRemove.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="text-[15px] font-semibold text-stone-900 line-clamp-2 leading-tight">{itemToRemove.name}</p>
                                <p className="text-[13px] text-stone-500 mt-1">Size: {itemToRemove.selectedSize} | Color: {itemToRemove.selectedColor}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button onClick={confirmMoveToWishlist} className="w-full flex items-center justify-center gap-2 bg-stone-900 text-white px-6 py-3.5 rounded-[16px] font-[600] text-[14px] hover:bg-stone-800 transition-colors shadow-sm active:scale-95">
                                <Heart className="w-4 h-4" /> Move to Wishlist
                            </button>
                            <button onClick={confirmRemove} className="w-full flex items-center justify-center gap-2 bg-[#F8F5F2] text-rose-600 px-6 py-3.5 rounded-[16px] font-[600] text-[14px] hover:bg-rose-50 transition-colors active:scale-95">
                                <Trash2 className="w-4 h-4" /> Remove from Cart
                            </button>
                        </div>
                    </div>
                </>
            )}
            
            {/* Address Form Drawer / Modal */}
            <AnimatePresence>
                {isAddressDrawerOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddressDrawerOpen(false)}
                            className="fixed inset-0 bg-stone-900/60 z-[60] backdrop-blur-[2px]" 
                        />
                        <motion.div 
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                            className="fixed bottom-0 left-0 right-0 z-[70] bg-[#f5f5f6] rounded-t-[24px] shadow-2xl flex flex-col max-h-[90vh] md:max-w-md md:left-1/2 md:-translate-x-1/2 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:rounded-[24px]"
                        >
                            <div className="bg-white p-4 rounded-t-[24px] border-b border-stone-100 flex items-center justify-between shrink-0">
                                <h2 className="text-[18px] font-bold text-stone-900">Delivery Address</h2>
                                <button onClick={() => setIsAddressDrawerOpen(false)} className="p-2 text-stone-400 hover:text-stone-900 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="overflow-y-auto p-4 space-y-6">
                                {/* Saved Addresses List */}
                                {userAddresses.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-[13px] font-bold text-stone-500 uppercase tracking-wider mb-2">Saved Addresses</h3>
                                        {userAddresses.map(addr => (
                                            <div 
                                                key={addr.id}
                                                className={`p-4 bg-white border rounded-[12px] transition-all ${selectedAddressId === addr.id ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/30' : 'border-stone-200'}`}
                                            >
                                                <div className="flex justify-between items-start mb-1 cursor-pointer" onClick={() => {
                                                    setSelectedAddressId(addr.id);
                                                    setIsAddressDrawerOpen(false);
                                                }}>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-stone-900 text-[14px]">{addr.firstName} {addr.lastName}</span>
                                                    </div>
                                                    {selectedAddressId === addr.id && <CheckCircle2 className="w-5 h-5 text-rose-500" />}
                                                </div>
                                                <div className="flex justify-between items-end mt-1">
                                                    <p className="text-[13px] text-stone-500 leading-relaxed cursor-pointer" onClick={() => {
                                                        setSelectedAddressId(addr.id);
                                                        setIsAddressDrawerOpen(false);
                                                    }}>
                                                        {addr.address || `${addr.houseNo}, ${addr.area}`}<br/>
                                                        {addr.city}, {addr.state} - {addr.zipCode}<br/>
                                                        Mobile: {addr.phone}
                                                    </p>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingAddressId(addr.id);
                                                            setAddressForm({
                                                                fullName: `${addr.firstName} ${addr.lastName}`,
                                                                phone: addr.phone || '',
                                                                zipCode: addr.zipCode || '',
                                                                address: addr.address || `${addr.houseNo}, ${addr.area}`,
                                                                landmark: addr.landmark || '',
                                                                city: addr.city || '',
                                                                state: addr.state || ''
                                                            });
                                                        }}
                                                        className="p-2 -mr-2 text-stone-400 hover:text-stone-900 transition-colors"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {!isAddingNewAddress && !editingAddressId && (
                                            <div className="flex items-center gap-4 py-3">
                                                <div className="h-[1px] bg-stone-200 flex-1"></div>
                                                <button 
                                                    type="button"
                                                    onClick={() => {
                                                        setIsAddingNewAddress(true);
                                                        setEditingAddressId(null);
                                                        setAddressForm({ fullName: '', phone: '', zipCode: '', address: '', landmark: '', city: '', state: '' });
                                                    }}
                                                    className="text-[12px] text-stone-500 font-bold uppercase tracking-wider hover:text-rose-900 hover:bg-rose-50 px-4 py-2 rounded-full transition-colors border border-stone-200 hover:border-rose-200"
                                                >
                                                    + Add New
                                                </button>
                                                <div className="h-[1px] bg-stone-200 flex-1"></div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* New / Edit Address Form */}
                                {(userAddresses.length === 0 || isAddingNewAddress || editingAddressId) && (
                                <form onSubmit={handleSaveAddress} className="space-y-4 bg-white p-4 rounded-[16px] shadow-sm border border-stone-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-[14px] font-bold text-stone-800">
                                            {editingAddressId ? 'Edit Address' : 'Add New Address'}
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            {(isAddingNewAddress || editingAddressId) && userAddresses.length > 0 && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => {
                                                        setEditingAddressId(null);
                                                        setIsAddingNewAddress(false);
                                                        setAddressForm({ fullName: '', phone: '', zipCode: '', address: '', landmark: '', city: '', state: '' });
                                                    }}
                                                    className="text-xs text-stone-500 font-medium hover:text-stone-900"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <FloatingInput label="Full Name" required value={addressForm.fullName} onChange={e => setAddressForm({...addressForm, fullName: e.target.value})} />
                                        
                                        <div className="grid grid-cols-2 gap-3">
                                            <FloatingInput label="Mobile Number" type="tel" required pattern="[0-9]{10}" maxLength="10" value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value.replace(/\D/g, '')})} />
                                            
                                            <div className="relative">
                                                <FloatingInput label="Pincode" type="tel" required pattern="[0-9]{6}" maxLength="6" value={addressForm.zipCode} onChange={handleZipChange} />
                                                {isZipLoading && <div className="absolute right-3 top-4 w-4 h-4 border-2 border-stone-300 border-t-rose-600 rounded-full animate-spin"></div>}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <FloatingInput label="City" required value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} />
                                            <FloatingInput label="State" required value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} />
                                        </div>
                                        
                                        <FloatingInput label="Address (House / Flat / Block, Area, Colony)" required value={addressForm.address} onChange={e => setAddressForm({...addressForm, address: e.target.value})} />
                                        
                                        <FloatingInput label="Landmark (Optional)" value={addressForm.landmark} onChange={e => setAddressForm({...addressForm, landmark: e.target.value})} />
                                        
                                        <button type="submit" disabled={isSubmitting} className="w-full bg-stone-900 text-white font-bold text-[15px] py-4 rounded-[12px] shadow-sm hover:bg-stone-800 active:scale-[0.98] transition-all mt-4 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center">
                                            {isSubmitting ? 'Saving...' : 'Save Address'}
                                        </button>
                                    </div>
                                </form>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Cart;
