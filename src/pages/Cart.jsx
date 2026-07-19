import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ArrowLeft, Tag, X, Truck, Heart, ShieldCheck, Sparkles, Plus, Minus, ChevronRight, Gift, CheckCircle, Info, MapPin, Edit3, Shield, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';
import { getEstimatedDeliveryDate } from '../utils/dateUtils';
import { getProductUrl } from '../utils/urlUtils';

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
        cartCount
    } = useCart();
    const { products } = useProducts();
    const { currentUser } = useAuth();
    const { addToWishlist } = useWishlist();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [isCouponOpen, setIsCouponOpen] = useState(false);
    const [isNoteInputOpen, setIsNoteInputOpen] = useState(false);

    // Address State
    const userAddresses = savedAddresses?.filter(addr => addr.userId === (currentUser?.uid || currentUser?.id)) || [];
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isAddressDrawerOpen, setIsAddressDrawerOpen] = useState(false);
    const [isZipLoading, setIsZipLoading] = useState(false);
    const [addressForm, setAddressForm] = useState({
        fullName: '', phone: '', zipCode: '', houseNo: '', area: '', landmark: '', city: '', state: '', addressType: 'Home'
    });

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
            navigate('/login');
            return;
        }
        
        setIsSubmitting(true);
        const submissionData = {
            firstName: addressForm.fullName.split(' ')[0] || '',
            lastName: addressForm.fullName.split(' ').slice(1).join(' ') || '',
            phone: addressForm.phone,
            alternatePhone: '',
            address: `${addressForm.houseNo}, ${addressForm.area}`,
            houseNo: addressForm.houseNo,
            area: addressForm.area,
            landmark: addressForm.landmark,
            city: addressForm.city,
            state: addressForm.state,
            zipCode: addressForm.zipCode,
            addressType: addressForm.addressType
        };

        try {
            const newAddr = await saveAddress(submissionData, (currentUser.uid || currentUser.id));
            if (newAddr && newAddr.id) {
                setSelectedAddressId(newAddr.id);
                setIsAddressDrawerOpen(false);
                setAddressForm({ fullName: '', phone: '', zipCode: '', houseNo: '', area: '', landmark: '', city: '', state: '', addressType: 'Home' });
                addToast('Address saved successfully!', 'success');
            }
        } catch (err) {
            console.error('Save address error:', err);
            addToast('Failed to save address. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const cartCategories = [...new Set(cart.map(item => item.category))];
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
                <h1 className="text-[24px] font-bold text-stone-900 mb-2">Your cart is empty</h1>
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
                                        <>
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-semibold text-stone-900 text-[15px]">
                                                    Deliver to: {userAddresses.find(a => a.id === selectedAddressId)?.firstName} {userAddresses.find(a => a.id === selectedAddressId)?.lastName}, {userAddresses.find(a => a.id === selectedAddressId)?.zipCode}
                                                </h3>
                                                <button 
                                                    onClick={() => setIsAddressDrawerOpen(true)}
                                                    className="text-[#1350a8] text-[13px] font-bold uppercase tracking-wide px-2 py-1 hover:bg-blue-50 rounded transition-colors"
                                                >
                                                    Change
                                                </button>
                                            </div>
                                            <div className="text-[13px] text-stone-500 leading-relaxed max-w-sm">
                                                {userAddresses.find(a => a.id === selectedAddressId)?.houseNo}, {userAddresses.find(a => a.id === selectedAddressId)?.area}<br/>
                                                {userAddresses.find(a => a.id === selectedAddressId)?.city}, {userAddresses.find(a => a.id === selectedAddressId)?.state}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-row items-center justify-between">
                                            <h3 className="font-bold text-stone-900 text-[18px]">Delivery Address</h3>
                                            <button 
                                                onClick={() => setIsAddressDrawerOpen(true)}
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
                        <div className="bg-[#FFFFFF] rounded-[24px] p-6 lg:sticky lg:top-28 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-stone-50 transition-all duration-250">
                            <h2 className="text-[16px] font-bold text-stone-500 uppercase tracking-wider mb-5 border-b border-stone-100 pb-3">Price Details</h2>
                            
                            <div className="space-y-4 mb-5 text-[15px]">
                                <div className="flex justify-between text-stone-600">
                                    <span>Price ({cartCount} items)</span>
                                    <span className="font-medium text-stone-900">₹{(subtotal + discountAmount).toLocaleString()}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-emerald-600">
                                        <span>Discount</span>
                                        <span className="font-medium">-₹{discountAmount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-stone-600">
                                    <span>Platform Fee</span>
                                    <span className="font-medium flex items-center gap-2">
                                        <span className="text-stone-400 line-through text-[13px]">₹29</span>
                                        <span className="text-emerald-600">FREE</span>
                                    </span>
                                </div>
                                <div className="flex justify-between text-stone-600">
                                    <span>Delivery Charges</span>
                                    <span className="font-medium flex items-center gap-2">
                                        {shippingCharge === 0 ? (
                                            <>
                                                <span className="text-stone-400 line-through text-[13px]">₹80</span>
                                                <span className="text-emerald-600">FREE</span>
                                            </>
                                        ) : (
                                            <span className="text-stone-900">₹{shippingCharge}</span>
                                        )}
                                    </span>
                                </div>
                                {giftWrapTotal > 0 && (
                                    <div className="flex justify-between text-stone-600">
                                        <span>Gift Packaging</span>
                                        <span className="font-medium text-stone-900">₹{giftWrapTotal}</span>
                                    </div>
                                )}
                            </div>

                            {/* Delivery Progress embedded in Order Summary */}
                            {shippingCharge > 0 || subtotal < FREE_DELIVERY_THRESHOLD ? (
                                <div className="bg-stone-50 border border-stone-100 p-3 rounded-xl mb-4 transition-all duration-250">
                                    <div className="flex items-center gap-2 text-[13px] font-semibold text-stone-800 mb-2.5">
                                        <Truck className="w-4 h-4 text-emerald-500" />
                                        <span>Add <strong className="text-emerald-700">₹{FREE_DELIVERY_THRESHOLD - subtotal}</strong> more for <strong>FREE Delivery</strong></span>
                                    </div>
                                    <div className="h-[6px] bg-stone-200/60 rounded-full overflow-hidden shadow-inner">
                                        <div 
                                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-700 ease-out relative"
                                            style={{ width: `${Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100)}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-center gap-3 mb-4 shadow-sm">
                                    <div className="bg-white p-1.5 rounded-full shadow-sm text-emerald-600"><Truck className="w-3.5 h-3.5" /></div>
                                    <span className="text-[13px] font-bold text-emerald-800">Yay! Free Delivery unlocked</span>
                                </div>
                            )}

                            <div className="border-t border-b border-dashed border-stone-200 py-4 mb-4">
                                <div className="flex justify-between items-center">
                                    <div className="text-[18px] font-bold text-stone-900">Total Amount</div>
                                    <div className="text-[20px] font-bold text-stone-900 tracking-tight">
                                        ₹{cartTotal.toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            {discountAmount > 0 && (
                                <div className="bg-emerald-50 text-emerald-700 font-semibold px-4 py-3 rounded-[8px] text-[14px] flex items-center justify-center gap-2 mb-6">
                                    You will save ₹{discountAmount.toLocaleString()} on this order
                                </div>
                            )}

                            <button
                                onClick={() => navigate('/checkout', { state: { selectedAddressId } })}
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
                    {discountAmount > 0 && (
                        <div className="text-[12px] text-stone-500 line-through leading-none mb-0.5">
                            ₹{(subtotal + giftWrapTotal + shippingCharge).toLocaleString()}
                        </div>
                    )}
                    <div className="flex items-center gap-1.5">
                        <span className="text-[20px] font-bold text-stone-900 leading-none">₹{cartTotal.toLocaleString()}</span>
                        <Info className="w-4 h-4 text-stone-400 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
                    </div>
                </div>
                <button
                    onClick={() => navigate('/checkout', { state: { selectedAddressId } })}
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
                                                onClick={() => {
                                                    setSelectedAddressId(addr.id);
                                                    setIsAddressDrawerOpen(false);
                                                }}
                                                className={`p-4 bg-white border rounded-[12px] cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/30' : 'border-stone-200 hover:border-stone-300'}`}
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-stone-900 text-[14px]">{addr.firstName} {addr.lastName}</span>
                                                        <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded border border-stone-200 font-bold uppercase">{addr.addressType}</span>
                                                    </div>
                                                    {selectedAddressId === addr.id && <CheckCircle2 className="w-5 h-5 text-rose-500" />}
                                                </div>
                                                <p className="text-[13px] text-stone-500 mt-1 leading-relaxed">
                                                    {addr.houseNo}, {addr.area}<br/>
                                                    {addr.city}, {addr.state} - {addr.zipCode}<br/>
                                                    Mobile: {addr.phone}
                                                </p>
                                            </div>
                                        ))}
                                        <div className="flex items-center gap-4 py-3">
                                            <div className="h-[1px] bg-stone-200 flex-1"></div>
                                            <span className="text-[12px] text-stone-400 font-medium uppercase tracking-wider">Or Add New</span>
                                            <div className="h-[1px] bg-stone-200 flex-1"></div>
                                        </div>
                                    </div>
                                )}

                                {/* New Address Form */}
                                <form onSubmit={handleSaveAddress} className="space-y-4 bg-white p-4 rounded-[16px] shadow-sm border border-stone-100">
                                    <h3 className="text-[14px] font-bold text-stone-800 mb-2">Add New Address</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <input type="text" required placeholder="Full Name *" className="w-full px-4 py-3 bg-[#F8F5F2] border border-stone-100 rounded-[12px] focus:border-rose-900 outline-none text-[14px] transition-all" value={addressForm.fullName} onChange={e => setAddressForm({...addressForm, fullName: e.target.value})} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input type="tel" required placeholder="Mobile Number *" pattern="[0-9]{10}" maxLength="10" className="w-full px-4 py-3 bg-[#F8F5F2] border border-stone-100 rounded-[12px] focus:border-rose-900 outline-none text-[14px] transition-all" value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value.replace(/\D/g, '')})} />
                                            <div className="relative">
                                                <input type="tel" required placeholder="Pincode *" pattern="[0-9]{6}" maxLength="6" className="w-full px-4 py-3 bg-[#F8F5F2] border border-stone-100 rounded-[12px] focus:border-rose-900 outline-none text-[14px] transition-all" value={addressForm.zipCode} onChange={handleZipChange} />
                                                {isZipLoading && <div className="absolute right-3 top-3.5 w-4 h-4 border-2 border-stone-300 border-t-rose-600 rounded-full animate-spin"></div>}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input type="text" required placeholder="City *" className="w-full px-4 py-3 bg-[#F8F5F2] border border-stone-100 rounded-[12px] focus:border-rose-900 outline-none text-[14px] transition-all" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} />
                                            <input type="text" required placeholder="State *" className="w-full px-4 py-3 bg-[#F8F5F2] border border-stone-100 rounded-[12px] focus:border-rose-900 outline-none text-[14px] transition-all" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} />
                                        </div>
                                        <div>
                                            <input type="text" required placeholder="House / Flat / Apartment *" className="w-full px-4 py-3 bg-[#F8F5F2] border border-stone-100 rounded-[12px] focus:border-rose-900 outline-none text-[14px] transition-all" value={addressForm.houseNo} onChange={e => setAddressForm({...addressForm, houseNo: e.target.value})} />
                                        </div>
                                        <div>
                                            <input type="text" required placeholder="Road Name, Area, Colony *" className="w-full px-4 py-3 bg-[#F8F5F2] border border-stone-100 rounded-[12px] focus:border-rose-900 outline-none text-[14px] transition-all" value={addressForm.area} onChange={e => setAddressForm({...addressForm, area: e.target.value})} />
                                        </div>
                                        <div>
                                            <input type="text" placeholder="Landmark (Optional)" className="w-full px-4 py-3 bg-[#F8F5F2] border border-stone-100 rounded-[12px] focus:border-rose-900 outline-none text-[14px] transition-all" value={addressForm.landmark} onChange={e => setAddressForm({...addressForm, landmark: e.target.value})} />
                                        </div>
                                        
                                        <div>
                                            <label className="text-[12px] text-stone-500 font-medium mb-2 block">Address Type</label>
                                            <div className="flex gap-3">
                                                {['Home', 'Office'].map(type => (
                                                    <label key={type} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-all ${addressForm.addressType === type ? 'border-rose-600 bg-rose-50 text-rose-700 font-semibold' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}>
                                                        <input type="radio" name="addressType" value={type} className="hidden" checked={addressForm.addressType === type} onChange={e => setAddressForm({...addressForm, addressType: e.target.value})} />
                                                        {type}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <button type="submit" disabled={isSubmitting} className="w-full bg-stone-900 text-white font-bold text-[15px] py-4 rounded-[12px] shadow-sm hover:bg-stone-800 active:scale-[0.98] transition-all mt-4 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center">
                                            {isSubmitting ? 'Saving...' : 'Save Address'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Cart;
