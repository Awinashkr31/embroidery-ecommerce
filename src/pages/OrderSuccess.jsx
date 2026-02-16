import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, MapPin, ArrowRight, Loader, AlertTriangle } from 'lucide-react';
import { supabase } from '../config/supabase';
import { getEstimatedDeliveryDate } from '../utils/dateUtils';
import SEO from '../components/SEO';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const stateOrderId = location.state?.orderId;
    // Handle both object (if passed fully) and string ID
    const orderId = typeof stateOrderId === 'object' ? stateOrderId?.id : stateOrderId;

    useEffect(() => {
        if (!orderId) {
            // content not found, redirect
            const timer = setTimeout(() => navigate('/shop'), 3000);
            return () => clearTimeout(timer);
        }

        const fetchOrder = async () => {
            try {
                // Fetch full details if we just have ID
                const { data, error } = await supabase
                    .from('orders')
                    .select('*, items, shipping_address') // Select JSON columns directly
                    .eq('id', orderId)
                    .single();

                if (error) throw error;
                setOrder(data);
            } catch (err) {
                console.error("Error fetching order details:", err);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId, navigate]);

    if (!orderId) {
        console.error("OrderSuccess: Missing Order ID in state", { locationState: location.state });
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7] p-4 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                    <Loader className="w-8 h-8 text-amber-600" />
                </div>
                <h1 className="text-xl font-bold text-stone-900 mb-2">Order Processing</h1>
                <p className="text-stone-600 mb-6 max-w-md">
                    We've received your request, but are waiting for the order details to sync.
                    <br/>If this persists, please check your profile for the latest status.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link to="/profile" className="px-6 py-2 bg-stone-900 text-white rounded-lg font-bold text-sm">View My Orders</Link>
                    <button onClick={() => navigate('/shop')} className="px-6 py-2 border border-stone-200 text-stone-700 rounded-lg font-bold text-sm">Continue Shopping</button>
                </div>
            </div>
        );
    }

    if (loading) {
         return (
            <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center font-body pt-20">
                <div className="text-center">
                    <Loader className="animate-spin h-10 w-10 text-rose-900 mx-auto mb-4" />
                    <p className="text-stone-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
         return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7] p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-stone-900 mb-2">Order Confirmed!</h1>
                    <p className="text-stone-600 mb-6">Your order ID is <span className="font-mono font-bold">{orderId}</span>.</p>
                    <p className="text-sm text-stone-500 mb-8">We couldn't load the details right now, but your order has been placed successfully.</p>
                    <Link to="/profile" className="px-6 py-3 bg-stone-900 text-white rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-stone-800 transition">View My Orders</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fdfbf7] font-body pt-6 md:pt-12 pb-12 md:pb-24">
            <SEO title="Order Confirmed" description="Your order has been placed successfully." />
            
            <div className="container-custom max-w-4xl">
                {/* Success Header */}
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in-50 duration-500">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-stone-900 mb-4">Order Placed Successfully!</h1>
                    <p className="text-stone-600 max-w-lg mx-auto text-lg">
                        Thank you for your purchase. We've received your order and will begin processing it right away.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                    {/* Left Column: Order Details */}
                    <div className="space-y-6">
                        {/* Order Info Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                            <h2 className="text-lg font-heading font-bold text-stone-900 mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5 text-rose-900" />
                                Order Details
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between py-2 border-b border-stone-50">
                                    <span className="text-stone-500">Order ID</span>
                                    <span className="font-mono font-bold text-stone-900">{order.id}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-stone-50">
                                    <span className="text-stone-500">Date</span>
                                    <span className="text-stone-900 font-medium">
                                        {new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-stone-50">
                                    <span className="text-stone-500">Estimated Delivery</span>
                                    <span className="text-stone-900 font-bold">{getEstimatedDeliveryDate()}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-stone-500">Payment Method</span>
                                    <span className="text-stone-900 font-medium capitalize">{order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                             <h2 className="text-lg font-heading font-bold text-stone-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-rose-900" />
                                Delivery Address
                            </h2>
                            <div className="text-stone-600 text-sm leading-relaxed">
                                <p className="font-bold text-stone-900 mb-1">{order.customer_name}</p>
                                <p>{order.shipping_address?.address}</p>
                                <p>{order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.zipCode}</p>
                                <p className="mt-2 text-stone-500">{order.customer_phone}</p>
                            </div>
                        </div>

                        {/* Unboxing Video Reminder */}
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4">
                            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                            <div>
                                <h3 className="font-bold text-amber-900 text-sm mb-1">Important: Unboxing Video Required</h3>
                                <p className="text-sm text-amber-800 leading-relaxed">
                                    Please record a clear video while unboxing your package. This is <strong>mandatory</strong> if you need to request a return or replacement later.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Items Summary */}
                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                        <h2 className="text-lg font-heading font-bold text-stone-900 mb-6">Items Ordered</h2>
                        
                        <div className="space-y-4 mb-6 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                            {Array.isArray(order.items) && order.items.length > 0 ? (
                                order.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 py-2 border-b border-stone-50 last:border-0">
                                        <div className="w-16 h-16 rounded-lg bg-stone-100 overflow-hidden shrink-0">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name || 'Product'} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-stone-200">
                                                    <Package className="w-6 h-6 text-stone-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-stone-800 text-sm truncate">{item.name || 'Unknown Item'}</h4>
                                            <div className="text-xs text-stone-500 mt-1">
                                                {item.selectedSize && <span className="mr-2">Size: {item.selectedSize}</span>}
                                                <span>Qty: {item.quantity || 1}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-stone-900 text-sm">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-stone-500 italic">No items details available.</p>
                            )}
                        </div>

                        <div className="space-y-2 pt-4 border-t border-stone-100">
                            <div className="flex justify-between text-stone-600 text-sm">
                                <span>Subtotal</span>
                                <span>₹{order.subtotal?.toLocaleString()}</span>
                            </div>
                             <div className="flex justify-between text-stone-600 text-sm">
                                <span>Shipping</span>
                                <span className={order.shipping_cost === 0 ? "text-emerald-700 font-bold" : ""}>
                                    {order.shipping_cost === 0 ? 'Free' : `₹${order.shipping_cost}`}
                                </span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-emerald-600 text-sm font-bold">
                                    <span>Discount</span>
                                    <span>-₹{order.discount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-heading font-bold text-stone-900 pt-3 border-t border-stone-100 mt-2">
                                <div className="flex flex-col">
                                    <span>Total</span>
                                    <span className="text-[10px] text-stone-400 font-normal mt-0.5">(Incl. of all taxes)</span>
                                </div>
                                <span className="text-rose-900">₹{order.total?.toLocaleString()}</span>
                            </div>
                        </div>
                        
                        <div className="mt-8 space-y-3">
                             <Link to="/profile" className="block w-full bg-stone-900 text-white py-3 rounded-xl hover:bg-stone-800 transition font-bold text-center uppercase tracking-wide text-sm">
                                View Order Details
                            </Link>
                            <Link to="/shop" className="block w-full bg-white border border-stone-200 text-stone-700 py-3 rounded-xl hover:bg-stone-50 transition font-bold text-center uppercase tracking-wide text-sm">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
