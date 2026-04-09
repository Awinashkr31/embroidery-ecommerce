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
                    {/* Animated Checkmark with Confetti */}
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        {/* Confetti Particles */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="confetti-particle confetti-1"></div>
                            <div className="confetti-particle confetti-2"></div>
                            <div className="confetti-particle confetti-3"></div>
                            <div className="confetti-particle confetti-4"></div>
                            <div className="confetti-particle confetti-5"></div>
                            <div className="confetti-particle confetti-6"></div>
                        </div>
                        {/* Growing Circle */}
                        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center animate-circle-grow shadow-lg shadow-emerald-200/50">
                            {/* Animated SVG Checkmark */}
                            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
                                <path 
                                    d="M5 13l4 4L19 7" 
                                    stroke="#059669" 
                                    strokeWidth="3" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    className="animate-draw-check"
                                />
                            </svg>
                        </div>
                        {/* Glow ring */}
                        <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping"></div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-stone-900 mb-4 animate-scale-in">Order Placed Successfully!</h1>
                    <p className="text-stone-600 max-w-lg mx-auto text-lg animate-stagger-fade" style={{ animationDelay: '0.3s' }}>
                        Thank you for your purchase. We've received your order and will begin processing it right away.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                    {/* Left Column: Order Details */}
                    <div className="space-y-6">
                        {/* Order Info Card */}
                        <div className="card-premium p-6 animate-stagger-fade" style={{ animationDelay: '0.2s' }}>
                            <h2 className="text-lg font-heading font-bold text-stone-900 mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5 text-rose-900" />
                                Order Details
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between py-2 border-b border-stone-50 gap-2">
                                    <span className="text-stone-500 shrink-0">Order ID</span>
                                    <span className="font-mono font-bold text-stone-900 text-xs md:text-sm truncate ml-2 text-right">{order.id}</span>
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


                        {/* Unboxing Video Reminder */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 flex gap-4 animate-stagger-fade shadow-sm shadow-amber-100/30" style={{ animationDelay: '0.5s' }}>
                            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                            <div>
                                <h3 className="font-bold text-amber-900 text-sm mb-1">Important: Unboxing Video Required</h3>
                                <p className="text-sm text-amber-800 leading-relaxed">
                                    Please record a clear video while unboxing your package. This is <strong>mandatory</strong> if you need to request a return or replacement later.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-8 max-w-lg mx-auto w-full animate-stagger-fade" style={{ animationDelay: '0.6s' }}>
                         <Link to="/profile" className="flex-1 bg-stone-900 text-white py-3.5 rounded-xl hover:bg-stone-800 transition font-bold text-center uppercase tracking-wide text-sm shadow-lg">
                            View Order Details
                        </Link>
                        <Link to="/shop" className="flex-1 bg-white border border-stone-200 text-stone-700 py-3.5 rounded-xl hover:bg-stone-50 transition font-bold text-center uppercase tracking-wide text-sm">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
