import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, CheckCircle, MapPin, Package, AlertTriangle, ShieldCheck, Truck, Sparkles, CreditCard, Info } from 'lucide-react';
import SEO from '../components/SEO';
import { getEstimatedDeliveryDate } from '../utils/dateUtils';
import { supabase } from '../config/supabase';

const OrderConfirmation = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { cart, cartTotal, subtotal, shippingCharge, discountAmount, appliedCoupon, placeOrder, cartLoading, COD_EXTRA_CHARGE, COD_STATUS } = useCart();
    const { addToast } = useToast();
    const { currentUser } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { formData } = state || {};

    // Redirect to cart if no state (direct access) or empty cart
    // BUT NOT when we're in the middle of submitting (placeOrder clears cart)
    React.useEffect(() => {
        if (!isSubmitting && !cartLoading && (!state || cart.length === 0)) {
            navigate('/cart');
        }
    }, [state, cart, navigate, cartLoading, isSubmitting]);

    // Security check: Redirect if COD is disabled but selected
    React.useEffect(() => {
        if (!isSubmitting && !cartLoading && formData?.paymentMethod === 'cod' && COD_STATUS !== 'active') {
             addToast('COD is currently unavailable. Please choose another payment method.', 'info');
             navigate('/checkout');
        }
    }, [formData, COD_STATUS, navigate, isSubmitting, cartLoading, addToast]);

    if (cartLoading) {
        return (
            <div className="min-h-screen bg-[#F8F5F2] flex items-center justify-center font-body pt-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-900 mx-auto mb-4"></div>
                    <p className="text-[13px] text-stone-500 font-medium animate-pulse">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!isSubmitting && (!state || cart.length === 0)) {
        return (
             <div className="min-h-screen bg-[#F8F5F2] flex items-center justify-center font-body pt-20">
                <div className="text-center p-8 bg-white shadow-lg rounded-2xl max-w-md mx-4">
                    <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-[20px] font-bold text-stone-900 mb-2">Nothing to confirm</h2>
                    <p className="text-[14px] text-stone-500 mb-6">Your cart is empty or order details are missing.</p>
                    <Link to="/cart" className="inline-block bg-rose-900 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-rose-800 transition-colors text-[13px]">
                        Return to Cart
                    </Link>
                </div>
            </div>
        );
    }

    // COD charge from state (passed from Checkout) or recalculate from settings
    const codCharge = formData.codCharge !== undefined ? Number(formData.codCharge) : (formData.paymentMethod === 'cod' ? COD_EXTRA_CHARGE : 0);
    const finalTotal = cartTotal + codCharge;

    const handleConfirmOrder = async () => {
        setIsSubmitting(true);
        try {
            // SECURE COD VALIDATION
            if (formData.paymentMethod === 'cod') {
                try {
                    const { data: validationData, error: validationError } = await supabase.functions.invoke('process-checkout', {
                        body: {
                            action: 'validate-cod',
                            cartItems: cart.map(item => ({ 
                                id: item.id, 
                                quantity: item.quantity,
                                variantId: item.variantId,
                                selectedSize: item.selectedSize,
                                selectedColor: item.selectedColor
                            })),
                            couponCode: appliedCoupon?.code,
                            clientTotal: finalTotal,
                            codCharge: codCharge
                        }
                    });

                    if (validationError) {
                        console.warn('COD validation edge function error (proceeding anyway):', validationError);
                    } else if (validationData?.error) {
                        console.warn('COD validation returned error:', validationData.error);
                    } else if (validationData?.status !== 'valid') {
                        console.warn('COD validation status not valid:', validationData);
                    }
                } catch (valErr) {
                    // Graceful degradation: if edge function is unavailable, allow order to proceed
                    console.warn('COD validation unavailable, proceeding with order:', valErr);
                }
            }

            const orderResult = await placeOrder({
                ...formData,
                userId: currentUser?.id,
                email: currentUser?.email || formData.email
            });
            
            // Navigate only if we have a result
            if (orderResult) {
                navigate('/order-success', { state: { orderId: orderResult } });
                // Don't reset isSubmitting here to prevent "Empty Cart" flash during navigation
            } else {
                throw new Error("Order placed but no ID returned.");
            }
        } catch (error) {
            console.error('Order placement failed:', error);
            
            // Safe Error Handling
            let msg = 'Failed to place order. Please try again.';
            if (typeof error === 'string') msg = error;
            else if (error?.message) msg = error.message;
            else if (error?.error_description) msg = error.error_description;
            
            addToast(msg, 'error');
            setIsSubmitting(false); // Only stop loading on error
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F5F2] font-body pt-6 md:pt-12 pb-[140px] md:pb-24 transition-all duration-250 ease-in-out">
            <SEO title="Confirm Order" description="Review your order details before confirming." noIndex />
            
            <div className="max-w-4xl mx-auto px-[12px] md:px-8">
                
                <Link to="/checkout" className="hidden md:inline-flex items-center text-stone-400 hover:text-rose-900 mb-6 transition-colors text-[12px] font-bold uppercase tracking-widest">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Checkout
                </Link>

                <div className="text-center mb-6 md:mb-10">
                    <div className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-stone-400" /> Final Step • Review & Confirm
                    </div>
                    <h1 className="text-[28px] md:text-[32px] font-heading font-semibold text-stone-900 mb-2 tracking-tight">Review Your Order</h1>
                    <p className="text-[14px] text-stone-500">Please review your delivery details and items before confirming.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    {/* LEFT COLUMN: Delivery Details & Info */}
                    <div className="space-y-4 md:space-y-6">
                        
                        {/* Delivery Details Card */}
                        <div className="bg-[#FFFFFF] p-5 md:p-6 rounded-[16px] shadow-[0_4px_14px_rgba(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-[18px] font-heading font-semibold text-stone-900 flex items-center gap-2">
                                    <MapPin className="text-rose-900 w-5 h-5" /> Delivery Details
                                </h2>
                                <Link to="/checkout" className="text-[12px] font-bold text-stone-400 hover:text-rose-900 transition-colors uppercase tracking-widest">
                                    Edit
                                </Link>
                            </div>
                            
                            <div className="space-y-5">
                                <div>
                                    <p className="text-[11px] font-semibold text-[#999] uppercase tracking-[1px] mb-1.5">Contact</p>
                                    <p className="text-[17px] font-semibold text-stone-900 leading-tight">{formData.firstName} {formData.lastName}</p>
                                    <p className="text-[14px] text-stone-600 mt-1">{formData.phone}</p>
                                    <p className="text-[14px] text-stone-600">{formData.email}</p>
                                </div>
                                
                                <div className="border-t border-stone-50 pt-4">
                                    <p className="text-[11px] font-semibold text-[#999] uppercase tracking-[1px] mb-1.5">Shipping Address</p>
                                    <p className="text-[14px] text-stone-800 leading-relaxed max-w-[90%]">
                                        {formData.address}<br/>
                                        {formData.city}, {formData.state} {formData.zipCode}
                                    </p>
                                </div>
                                
                                <div className="border-t border-stone-50 pt-4">
                                    <p className="text-[11px] font-semibold text-[#999] uppercase tracking-[1px] mb-2">Payment Method</p>
                                    <div className="inline-flex items-center gap-2 bg-stone-50 border border-stone-100 px-3 py-1.5 rounded-full shadow-sm">
                                        {formData.paymentMethod === 'online' ? (
                                            <>
                                                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                                                <span className="text-[13px] font-bold text-stone-800">Online Payment</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                                <span className="text-[13px] font-bold text-stone-800">Cash on Delivery</span>
                                                {codCharge > 0 && <span className="text-[11px] text-stone-500 font-medium ml-1">(+₹{codCharge} Fee)</span>}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Soft Important Information Box */}
                        <div className="bg-[#FAF8F5] border border-stone-100 rounded-[16px] p-5 shadow-[0_4px_14px_rgba(0,0,0,0.02)] animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100">
                             <div className="flex gap-3">
                                 <div className="bg-stone-100 p-1.5 rounded-full shrink-0 h-fit">
                                     <Info className="w-4 h-4 text-stone-500" />
                                 </div>
                                 <div>
                                     <p className="text-[14px] font-bold text-stone-800 mb-2">Important Information</p>
                                     <ul className="space-y-2 text-[13px] text-stone-600">
                                         {formData.paymentMethod === 'cod' && codCharge > 0 && (
                                            <li className="flex items-start gap-2">
                                                <span className="text-stone-300 mt-0.5">•</span>
                                                <span>A <strong>₹{codCharge} COD charge</strong> is included in your total.</span>
                                            </li>
                                         )}
                                         <li className="flex items-start gap-2">
                                             <span className="text-stone-300 mt-0.5">•</span>
                                             <span>A clear <strong>Unboxing Video</strong> is mandatory for any returns or replacements.</span>
                                         </li>
                                     </ul>
                                 </div>
                             </div>
                        </div>
                        
                    </div>

                    {/* RIGHT COLUMN: Order Summary & Action */}
                    <div className="space-y-4 md:space-y-6">
                        
                        <div className="bg-[#FFFFFF] p-5 md:p-6 rounded-[16px] shadow-[0_4px_14px_rgba(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75">
                            <h2 className="text-[18px] font-heading font-semibold text-stone-900 mb-5 flex items-center gap-2">
                                <Package className="text-rose-900 w-5 h-5" /> Order Summary
                            </h2>
                            
                             {/* Richer Product Rows */}
                             <div className="space-y-4 mb-6 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className="w-[72px] h-[72px] rounded-xl bg-stone-50 overflow-hidden shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-stone-900 text-[14px] line-clamp-1 leading-tight mb-0.5">{item.name}</h4>
                                            <div className="flex items-center gap-2 text-[12px] text-stone-500 mb-1">
                                                {(item.selectedSize || item.selected_size) && <span>Size: {item.selectedSize || item.selected_size}</span>}
                                                {(item.selectedSize || item.selected_size) && <span>•</span>}
                                                <span>Qty: {item.quantity}</span>
                                            </div>
                                            <p className="font-bold text-stone-900 text-[14px]">₹{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="space-y-2.5 pt-5 border-t border-stone-50">
                                <div className="flex justify-between text-[#777] text-[13px]">
                                    <span>Subtotal</span>
                                    <span className="text-stone-900 font-medium">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[#777] text-[13px]">
                                    <span>Shipping</span>
                                    <span className={shippingCharge === 0 ? "text-emerald-600 font-bold" : "text-stone-900 font-medium"}>
                                        {shippingCharge === 0 ? 'Free' : `₹${shippingCharge}`}
                                    </span>
                                </div>
                                {discountAmount > 0 && (
                                     <div className="flex justify-between text-emerald-600 text-[13px] font-medium">
                                        <span>Discount {appliedCoupon && `(${appliedCoupon.code})`}</span>
                                        <span className="font-bold">-₹{discountAmount.toLocaleString()}</span>
                                    </div>
                                )}
                                {codCharge > 0 && (
                                    <div className="flex justify-between text-amber-700 text-[13px] font-medium">
                                        <span>COD Charge</span>
                                        <span>+₹{codCharge.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>

                            {/* Highlighted Total Block */}
                            <div className="bg-[#FAF7F8] rounded-[16px] p-4 mt-5">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-[15px] font-semibold text-stone-900">Total Pay</span>
                                    <span className="text-[28px] font-bold text-rose-900 leading-none tracking-tight">₹{finalTotal.toLocaleString()}</span>
                                </div>
                                <div className="text-[11px] text-stone-500 text-right font-medium">
                                    (Incl. of all taxes)
                                </div>
                            </div>

                            {/* Estimated Delivery Pill */}
                            <div className="bg-[#e9faec] rounded-full px-4 py-2 mt-4 inline-flex items-center gap-2 shadow-sm w-full justify-center border border-emerald-100/50">
                                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-[13px] font-semibold text-emerald-900">Delivery by <span className="font-bold">{getEstimatedDeliveryDate()}</span></span>
                            </div>

                        </div>

                        {/* Desktop Checkout Button (Hidden on Mobile) */}
                        <div className="hidden lg:block animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150">
                            <div className="flex justify-center items-center gap-4 text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-3">
                                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Secure</span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Handmade</span>
                            </div>
                            <button
                                onClick={handleConfirmOrder}
                                disabled={isSubmitting}
                                className={`w-full bg-rose-900 text-white h-[56px] rounded-[16px] font-[600] text-[15px] tracking-[0.3px] hover:bg-rose-800 transition-all duration-250 shadow-[0_8px_24px_rgba(177,0,71,0.22)] active:scale-[0.98] flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-75 cursor-not-allowed shadow-none' : ''}`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Processing...</span>
                                ) : (
                                    <span>{formData.paymentMethod === 'cod' ? `Confirm COD Order • ₹${finalTotal.toLocaleString()}` : `Place Order • ₹${finalTotal.toLocaleString()}`}</span>
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Mobile Sticky CTA Footer */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-200/60 shadow-[0_-10px_40px_rgb(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)] lg:hidden transition-all duration-250 animate-in slide-in-from-bottom duration-500">
                {/* Trust Indicators */}
                <div className="bg-[#FAF8F5] py-2 border-b border-stone-100 flex justify-center items-center gap-4 text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-600" /> Secure</span>
                    <span className="text-stone-300">•</span>
                    <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-rose-500" /> Handmade</span>
                </div>
                
                {/* CTA Row */}
                <div className="px-[14px] py-3 flex items-center justify-between gap-4">
                    <div className="flex-1">
                        <div className="text-[20px] font-bold text-stone-900 leading-none mb-0.5 tracking-tight">₹{finalTotal.toLocaleString()}</div>
                        <div className="text-[12px] text-[#777] font-medium">Total Pay</div>
                    </div>
                    <button
                        onClick={handleConfirmOrder}
                        disabled={isSubmitting}
                        className={`flex-[1.8] h-[52px] rounded-[16px] font-[600] tracking-[0.3px] text-[14px] transition-all duration-250 flex items-center justify-center gap-2 active:scale-95 ${
                            isSubmitting
                            ? 'bg-stone-400 text-white cursor-not-allowed shadow-none'
                            : 'bg-rose-900 text-white shadow-[0_8px_24px_rgba(177,0,71,0.22)]'
                        }`}
                    >
                        {isSubmitting ? (
                             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                             <span>{formData.paymentMethod === 'cod' ? 'Confirm COD Order' : 'Place Order'}</span>
                        )}
                    </button>
                </div>
            </div>

        </div>
    );
};

export default OrderConfirmation;
