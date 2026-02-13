import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, Tag, X, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import { getEstimatedDeliveryDate } from '../utils/dateUtils';

const Cart = () => {
    const { 
        cart, 
        cartLoading, // Destructure loading state
        removeFromCart, 
        updateQuantity, 
        cartTotal, 
        subtotal, 
        shippingCharge, 
        applyCoupon, 
        removeCoupon, 
        appliedCoupon, 
        discountAmount,
        MIN_ORDER_VALUE,
        FREE_DELIVERY_THRESHOLD,
        isOrderDeployable
    } = useCart();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');

    const handleApplyCoupon = () => {
        try {
            setCouponError('');
            applyCoupon(couponCode.toUpperCase());
            setCouponCode('');
        } catch (err) {
            setCouponError(err.message);
        }
    };

    // Show loading state if initializing to prevent "Empty Cart" flash
    if (cartLoading && cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#fdfbf7] font-body p-4">
                <SEO title="Shopping Cart" description="Loading your cart..." />
                <div className="w-12 h-12 border-4 border-stone-200 border-t-rose-900 rounded-full animate-spin mb-4"></div>
                <p className="text-stone-500 font-medium animate-pulse">Loading your cart...</p>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#fdfbf7] font-body p-4">
                <SEO title="Shopping Cart" description="Your shopping cart is empty. Explore our collection of handcrafted embroidery." />
                <div className="bg-rose-50 p-8 rounded-full mb-6 animate-in zoom-in-50 duration-500">
                    <Trash2 className="w-12 h-12 text-rose-900" />
                </div>
                <h1 className="text-3xl font-heading font-bold text-stone-900 mb-4">Your cart is empty</h1>
                <p className="text-stone-600 mb-8 max-w-md text-center">Looks like you haven't added anything yet. Explore our collection to find something unique.</p>
                <Link to="/shop" className="btn-primary">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#fdfbf7] min-h-screen font-body pt-4 md:pt-12 pb-32 lg:pb-24">
            <SEO title="Shopping Cart" description="Review your selected items and proceed to checkout." />
            <div className="container-custom">
                <h1 className="text-3xl lg:text-4xl font-heading font-bold text-stone-900 mb-8">Shopping Cart</h1>

                {/* Minimum Order Warning */}
                {!isOrderDeployable && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                        <div className="p-2 bg-red-100 rounded-full text-red-600 shrink-0">
                            <Tag className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-red-900">Minimum Order Value is ₹{MIN_ORDER_VALUE}</h3>
                            <p className="text-xs text-red-700 mt-0.5">
                                Please add items worth ₹{MIN_ORDER_VALUE - subtotal} more to place your order.
                            </p>
                        </div>
                    </div>
                )}

                {/* Free Delivery Progress */}
                {isOrderDeployable && subtotal < FREE_DELIVERY_THRESHOLD && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                        <div className="p-2 bg-blue-100 rounded-full text-blue-600 shrink-0">
                            <Tag className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between text-xs font-bold text-blue-900 mb-1.5">
                                <span>Add ₹{FREE_DELIVERY_THRESHOLD - subtotal} for Free Delivery</span>
                                <span>{Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%</span>
                            </div>
                            <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                    style={{ width: `${(subtotal / FREE_DELIVERY_THRESHOLD) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Free Delivery Qualified */}
                {subtotal >= FREE_DELIVERY_THRESHOLD && (
                     <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <div className="p-1.5 bg-emerald-100 rounded-full text-emerald-600 shrink-0">
                            <Tag className="w-3 h-3" />
                        </div>
                        <p className="text-xs font-bold text-emerald-800">Yay! You've unlocked Free Delivery.</p>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Cart Items */}
                    <div className="lg:w-2/3 space-y-6">
                        {cart.map((item, idx) => (
                            <div key={`${item.id}-${item.selectedSize || 'nosize'}-${item.selectedColor || 'nocolor'}-${idx}`} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-stone-100 flex gap-4 md:gap-6 items-start md:items-center">
                                <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/logo.png';
                                            e.target.className = "w-full h-full object-contain p-2 bg-stone-50 opacity-50";
                                        }}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-heading font-medium text-stone-900 mb-1 truncate pr-4">{item.name}</h3>
                                        {/* Mobile Remove (Top Right) */}
                                        <button
                                            onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                                            className="text-stone-400 hover:text-rose-900 transition-colors p-1 -mt-1 -mr-1 lg:hidden"
                                            title="Remove Item"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm mt-1">
                                        <div className="flex flex-wrap items-center gap-3 text-sm text-stone-500">
                                             <div className="flex items-center gap-2">
                                                <span className="font-medium text-stone-900">₹{item.price.toLocaleString()}</span>
                                                {item.originalPrice && (
                                                    <span className="text-stone-400 line-through text-xs">₹{item.originalPrice.toLocaleString()}</span>
                                                )}
                                             </div>
                                            
                                            {item.selectedSize && (
                                                <span className="text-xs font-bold text-stone-500 bg-stone-50 border border-stone-200 px-2 py-1 rounded">
                                                    Size: {item.selectedSize}
                                                </span>
                                            )}
                                            
                                            {item.selectedColor && item.selectedColor !== 'NA' && (
                                                <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-2 py-1 rounded">
                                                    <span 
                                                        className="w-3 h-3 rounded-full border border-stone-300 shadow-sm" 
                                                        style={{ backgroundColor: item.selectedColor.toLowerCase() }}
                                                    ></span>
                                                    <span className="text-xs font-bold text-stone-600">
                                                        {item.selectedColor}
                                                    </span>
                                                </div>
                                            )}

                                             {item.discountPercentage > 0 && (
                                                <span className="text-[10px] font-bold text-rose-900 bg-rose-50 px-1.5 py-0.5 rounded">
                                                    -{item.discountPercentage}%
                                                </span>
                                             )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                         {/* Quantity Selector - Pill Style */}
                                        <div className="flex items-center bg-white border border-stone-200 rounded-full h-8 shadow-sm">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                                                className="w-8 h-full flex items-center justify-center hover:bg-stone-50 transition-colors text-stone-500 rounded-l-full"
                                            >
                                                <span className="text-lg leading-none mb-0.5">-</span>
                                            </button>
                                            <span className="w-8 text-center text-stone-900 font-bold text-sm leading-none">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                                                disabled={item.quantity >= (item.stock ?? item.stock_quantity ?? 100)}
                                                className={`w-8 h-full flex items-center justify-center transition-colors rounded-r-full ${
                                                    item.quantity >= (item.stock ?? item.stock_quantity ?? 100)
                                                    ? 'text-stone-300 cursor-not-allowed'
                                                    : 'text-stone-500 hover:bg-stone-50'
                                                }`}
                                            >
                                                <span className="text-lg leading-none mb-0.5">+</span>
                                            </button>
                                        </div>
                                         
                                        <p className="text-rose-900 font-bold sm:hidden">₹{(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Desktop Remove & Total */}
                                <div className="hidden lg:flex items-center gap-6">
                                     <div className="w-24 text-right font-bold text-stone-900">
                                        ₹{(item.price * item.quantity).toLocaleString()}
                                    </div>
                                     <button
                                        onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                                        className="p-2 text-stone-400 hover:text-rose-900 transition-colors rounded-lg hover:bg-rose-50"
                                        title="Remove Item"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        {/* Desktop Summary Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-8 sticky top-28 hidden lg:block">
                            <h2 className="text-xl font-heading font-bold text-stone-900 mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-stone-600">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="flex justify-between text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                        <span className="flex items-center text-sm font-bold"><Tag className="w-3 h-3 mr-1"/> {appliedCoupon.code}</span>
                                        <span className="text-sm font-bold">-₹{discountAmount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-stone-600">
                                    <span>Shipping</span>
                                    <span className={shippingCharge === 0 ? "text-emerald-700 font-bold" : "text-stone-900 font-medium"}>
                                        {shippingCharge === 0 ? 'Free' : `₹${shippingCharge}`}
                                    </span>
                                </div>

                                <div className="flex justify-between text-stone-600">
                                    <span>Estimated Delivery</span>
                                    <span className="text-stone-900 font-medium">{getEstimatedDeliveryDate()}</span>
                                </div>
                                <div className="border-t border-stone-100 pt-4 flex justify-between text-lg font-heading font-bold text-stone-900">
                                    <div className="flex flex-col">
                                        <span>Total</span>
                                        <span className="text-[10px] text-stone-400 font-normal mt-0.5">(Incl. of all taxes)</span>
                                    </div>
                                    <span className="text-rose-900">₹{cartTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Coupon Input */}
                            <div className="mb-8">
                                {appliedCoupon ? (
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center justify-between">
                                        <div className="flex items-center text-emerald-700">
                                            <Tag className="w-4 h-4 mr-2" />
                                            <span className="text-sm font-bold">Coupon Applied</span>
                                        </div>
                                        <button onClick={removeCoupon} className="text-emerald-600 hover:text-emerald-800 p-1 hover:bg-emerald-100 rounded-full transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Coupon Code"
                                                className="flex-1 px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900 outline-none uppercase font-medium text-sm transition-all"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                            />
                                            <button
                                                onClick={handleApplyCoupon}
                                                className="px-6 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors font-bold text-xs uppercase tracking-wider"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                        {couponError && <p className="text-rose-600 text-xs font-bold flex items-center gap-1"><X className="w-3 h-3"/> {couponError}</p>}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                disabled={!isOrderDeployable}
                                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg group transform ${
                                    isOrderDeployable 
                                    ? 'bg-rose-900 text-white hover:bg-rose-800 hover:-translate-y-0.5 shadow-rose-900/20' 
                                    : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                                }`}
                            >
                                <span>{isOrderDeployable ? 'Checkout Now' : `Add items worth ₹${MIN_ORDER_VALUE - subtotal} more`}</span>
                                {isOrderDeployable && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                            </button>
                            
                            {!currentUser && (
                                <p className="text-center text-xs text-stone-400 mt-4 font-medium">
                                    Checkout as Guest or <Link to="/login" className="text-rose-900 hover:underline">Log In</Link> to save orders.
                                </p>
                            )}
                        </div>

                        {/* Mobile Summary & Coupon (Non-Sticky) */}
                         <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 lg:hidden mb-6">
                            <h2 className="text-lg font-heading font-bold text-stone-900 mb-4">Order Details</h2>
                             <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-stone-600 text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                 {appliedCoupon && (
                                    <div className="flex justify-between text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs">
                                        <span className="flex items-center font-bold"><Tag className="w-3 h-3 mr-1"/> {appliedCoupon.code}</span>
                                        <span className="font-bold">-₹{discountAmount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-stone-600 text-sm">
                                    <span>Shipping</span>
                                    <span className={shippingCharge === 0 ? "text-emerald-700 font-bold" : "text-stone-900 font-medium"}>
                                        {shippingCharge === 0 ? 'Free' : `₹${shippingCharge}`}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Mobile Coupon Input */}
                             <div className="mb-2">
                                {appliedCoupon ? (
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex items-center justify-between">
                                        <div className="flex items-center text-emerald-700">
                                            <Tag className="w-3 h-3 mr-2" />
                                            <span className="text-xs font-bold">Coupon Applied</span>
                                        </div>
                                        <button onClick={removeCoupon} className="text-emerald-600 hover:text-emerald-800 p-1 hover:bg-emerald-100 rounded-full transition-colors">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Coupon Code"
                                                className="flex-1 px-3 py-2 border border-stone-200 rounded-lg focus:ring-1 focus:ring-rose-900/20 focus:border-rose-900 outline-none uppercase font-medium text-xs transition-all"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                            />
                                            <button
                                                onClick={handleApplyCoupon}
                                                className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors font-bold text-[10px] uppercase tracking-wider"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                        {couponError && <p className="text-rose-600 text-[10px] font-bold flex items-center gap-1"><X className="w-3 h-3"/> {couponError}</p>}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Mobile Sticky Checkout Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-4px_10px_rgba(0,0,0,0.1)] lg:hidden z-50">
                 <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs text-stone-500 font-medium">Total</p>
                        <p className="text-xl font-bold text-rose-900">₹{cartTotal.toLocaleString()}</p>
                    </div>
                    <button
                        onClick={() => navigate('/checkout')}
                        disabled={!isOrderDeployable}
                        className={`flex-1 py-3 rounded-xl font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg ${
                            isOrderDeployable
                            ? 'bg-rose-900 text-white hover:bg-rose-800 shadow-rose-900/20'
                            : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                        }`}
                    >
                        <span>Checkout</span>
                        {isOrderDeployable && <ArrowRight className="w-4 h-4" />}
                    </button>
                 </div>
            </div>
        </div>
    );
};

export default Cart;
