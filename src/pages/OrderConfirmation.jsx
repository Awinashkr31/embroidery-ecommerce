import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, CheckCircle, MapPin, Package, AlertTriangle } from 'lucide-react';
import SEO from '../components/SEO';

const OrderConfirmation = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { cart, cartTotal, subtotal, shippingCharge, discountAmount, appliedCoupon, placeOrder } = useCart();
    const { addToast } = useToast();
    const { currentUser } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect to cart if no state (direct access) or empty cart
    React.useEffect(() => {
        if (!state || cart.length === 0) {
            navigate('/cart');
        }
    }, [state, cart, navigate]);

    if (!state || cart.length === 0) return null;

    const { formData } = state;

    const handleConfirmOrder = async () => {
        setIsSubmitting(true);
        try {
            await placeOrder({
                ...formData,
                userId: currentUser?.uid,
                email: currentUser?.email || formData.email
            });
            navigate('/order-success');
        } catch (error) {
            console.error('Order placement failed:', error);
            addToast(error.message || 'Failed to place order. Please try again.', 'error');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fdfbf7] font-body pt-32 pb-24">
            <SEO title="Confirm Order" description="Review your order details before confirming." />
            <div className="container-custom max-w-4xl">
                <Link to="/checkout" className="inline-flex items-center text-stone-500 hover:text-rose-900 mb-8 transition-colors text-sm font-bold uppercase tracking-wide">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Checkout
                </Link>

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-heading font-bold text-stone-900 mb-2">Review Your Order</h1>
                    <p className="text-stone-600">Please review your delivery details and items before confirming.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Delivery Details Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
                        <h2 className="text-xl font-heading font-bold text-stone-900 mb-6 flex items-center gap-2">
                             <MapPin className="text-rose-900 w-5 h-5" /> Delivery Details
                        </h2>
                        <div className="space-y-4 text-stone-600">
                             <div>
                                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Contact</p>
                                <p className="font-bold text-stone-900">{formData.firstName} {formData.lastName}</p>
                                <p>{formData.email}</p>
                                <p>{formData.phone}</p>
                             </div>
                             <div className="border-t border-stone-100 pt-4">
                                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Shipping Address</p>
                                <p className="text-stone-900 leading-relaxed">
                                    {formData.address}<br/>
                                    {formData.city}, {formData.state} {formData.zipCode}
                                </p>
                             </div>
                             <div className="border-t border-stone-100 pt-4">
                                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Payment Method</p>
                                <p className="font-bold text-stone-900 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                    Cash on Delivery
                                </p>
                             </div>
                        </div>
                    </div>

                    {/* Order Summary & Action */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
                            <h2 className="text-xl font-heading font-bold text-stone-900 mb-6 flex items-center gap-2">
                                <Package className="text-rose-900 w-5 h-5" /> Order Summary
                            </h2>
                             <div className="space-y-3 mb-6 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-4 py-2 border-b border-stone-50 last:border-0">
                                        <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-stone-800 text-sm truncate">{item.name}</h4>
                                            {(item.selectedSize || item.selected_size) && (
                                                <p className="text-xs text-stone-500">Size: {item.selectedSize || item.selected_size}</p>
                                            )}
                                            <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-stone-900 text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="space-y-2 pt-4 border-t border-stone-100">
                                <div className="flex justify-between text-stone-600 text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-stone-600 text-sm">
                                    <span>Shipping</span>
                                    <span className={shippingCharge === 0 ? "text-emerald-700 font-bold" : ""}>
                                        {shippingCharge === 0 ? 'Free' : `₹${shippingCharge}`}
                                    </span>
                                </div>
                                {discountAmount > 0 && (
                                     <div className="flex justify-between text-emerald-600 text-sm font-bold">
                                        <span>Discount {appliedCoupon && `(${appliedCoupon.code})`}</span>
                                        <span>-₹{discountAmount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-xl font-heading font-bold text-stone-900 pt-4 border-t border-stone-100 mt-2">
                                    <span>Total Pay</span>
                                    <span className="text-rose-900">₹{cartTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 text-amber-800 text-sm">
                             <AlertTriangle className="w-5 h-5 shrink-0" />
                             <p>By placing this order, you agree to pay <strong>₹{cartTotal.toLocaleString()}</strong> in cash upon delivery.</p>
                        </div>

                        <button
                            onClick={handleConfirmOrder}
                            disabled={isSubmitting}
                            className={`w-full bg-rose-900 text-white py-4 rounded-xl font-bold text-lg uppercase tracking-widest hover:bg-rose-800 transition-all shadow-lg hover:shadow-rose-900/30 flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Processing...' : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Confirm & Place Order
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
