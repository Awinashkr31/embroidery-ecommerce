import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, Tag, X, Truck, Heart, ShieldCheck, Sparkles, Plus, Minus, ChevronRight, Gift, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductContext';
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
        setGiftNote
    } = useCart();
    const { products } = useProducts();
    const { currentUser } = useAuth();
    const { addToWishlist } = useWishlist();
    const navigate = useNavigate();
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [isCouponOpen, setIsCouponOpen] = useState(false);
    const [isNoteInputOpen, setIsNoteInputOpen] = useState(false);

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
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#F8F5F2] font-body p-4">
                <SEO title="Shopping Cart" description="Your shopping cart is empty." />
                <div className="bg-rose-50 p-8 rounded-full mb-6 animate-in zoom-in-50 duration-500">
                    <Trash2 className="w-12 h-12 text-rose-900" />
                </div>
                <h1 className="text-[28px] font-heading font-semibold text-stone-900 mb-4">Your cart is empty</h1>
                <p className="text-[14px] text-stone-500 mb-8 max-w-md text-center">Looks like you haven't added anything yet. Explore our collection to find something unique.</p>
                <Link to="/shop" className="btn-primary px-8 py-3 rounded-2xl text-[14px] font-semibold">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#F8F5F2] min-h-screen font-body pt-6 md:pt-12 pb-[140px] md:pb-24 transition-all duration-250 ease-in-out">
            <SEO title="Shopping Cart" description="Review your selected items and proceed to checkout." />
            <div className="max-w-6xl mx-auto px-[14px] md:px-8">
                
                {/* Header Cleanup */}
                <h1 className="text-[28px] font-heading font-semibold text-stone-900 mb-5 tracking-tight">Shopping Cart</h1>

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
                            <h2 className="text-[22px] font-heading font-semibold text-stone-900 mb-5">Order Summary</h2>
                            
                            <div className="space-y-3 mb-5 text-[14px]">
                                <div className="flex justify-between text-[#777]">
                                    <span>Subtotal</span>
                                    <span className="text-stone-900 font-medium">₹{subtotal.toLocaleString()}</span>
                                </div>
                                {giftWrapTotal > 0 && (
                                    <div className="flex justify-between items-start text-[#777]">
                                        <div>
                                            <span className="block text-stone-900 font-medium">Gift Packaging</span>
                                            <span className="text-[12px] text-rose-700/80">Premium Wrap</span>
                                        </div>
                                        <span className="text-stone-900 font-medium mt-0.5">₹{giftWrapTotal.toLocaleString()}</span>
                                    </div>
                                )}
                                {appliedCoupon && (
                                    <div className="flex justify-between text-emerald-600 font-medium">
                                        <span>Discount ({appliedCoupon.code})</span>
                                        <span>-₹{discountAmount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-[#777]">
                                    <span>Shipping</span>
                                    <span className={shippingCharge === 0 ? "text-emerald-600 font-bold" : "text-stone-900 font-medium"}>
                                        {shippingCharge === 0 ? 'Free' : `₹${shippingCharge}`}
                                    </span>
                                </div>
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

                            <div className="border-t border-stone-100 pt-5 pb-5">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-[16px] font-semibold text-stone-900">Total</div>
                                        <div className="text-[13px] text-[#777] mt-0.5">Incl. of all taxes</div>
                                    </div>
                                    <div className="text-[32px] font-bold text-rose-900 leading-none tracking-tight">
                                        ₹{cartTotal.toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#e9faec] rounded-[12px] p-4 mb-6 flex items-center justify-between text-[14px] shadow-sm">
                                <span className="font-semibold text-emerald-900 flex items-center gap-2">
                                    <span className="bg-white p-1.5 rounded-full"><Truck className="w-3.5 h-3.5 text-emerald-600"/></span> Delivery by
                                </span>
                                <span className="font-bold text-emerald-800">{getEstimatedDeliveryDate()}</span>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                disabled={!isOrderDeployable}
                                className={`flex w-full h-[54px] rounded-[16px] font-[600] text-[15px] tracking-[0.3px] transition-all duration-250 items-center justify-center gap-2 active:scale-[0.98] ${
                                    isOrderDeployable 
                                    ? 'bg-rose-900 text-white hover:bg-rose-800 shadow-[0_8px_24px_rgba(177,0,71,0.22)]' 
                                    : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                                }`}
                            >
                                <span>{isOrderDeployable ? 'Proceed to Checkout →' : `Add items worth ₹${MIN_ORDER_VALUE - subtotal} more`}</span>
                            </button>
                            
                            {!currentUser && (
                                <p className="text-center text-[13px] text-[#777] mt-4">
                                    Checkout as Guest or <Link to="/login" className="text-rose-900 font-medium hover:underline">Log In</Link>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
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
            
        </div>
    );
};

export default Cart;
