import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, ArrowRight, ShoppingBag, FileText } from 'lucide-react';

const OrderSuccess = () => {
    const { state } = useLocation();
    const orderId = state?.orderId;
    
    console.log("OrderSuccess Rendered. Order ID:", orderId);

    return (
        <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center font-body p-6 pt-24 pb-12">
            
            <div className="max-w-xl w-full text-center">
                {/* Success Animation Circle */}
                <div className="mb-8 relative inline-flex items-center justify-center">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center relative z-10 animate-scale-in">
                        <Check className="w-12 h-12 text-emerald-600 drop-shadow-sm" strokeWidth={3} />
                    </div>
                    <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-20"></div>
                </div>

                <h1 className="text-4xl font-heading font-bold text-stone-900 mb-4 tracking-tight">
                    Thank you!
                </h1>
                <p className="text-lg text-stone-600 mb-2">
                    Your order has been placed successfully.
                </p>
                {orderId && (
                    <div className="inline-block bg-white px-4 py-2 rounded-lg border border-stone-200 mt-2 shadow-sm">
                        <p className="text-stone-500 text-sm font-bold uppercase tracking-wider">
                            Order ID: <span className="text-rose-900 select-all">{orderId}</span>
                        </p>
                    </div>
                )}
                
                <p className="text-stone-500 mt-6 max-w-sm mx-auto mb-10 text-sm leading-relaxed">
                    We've sent a confirmation email to you. We'll verify your order and ship it as soon as possible.
                </p>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 mb-10 max-w-sm mx-auto">
                    <h3 className="font-heading font-bold text-stone-900 mb-4 flex items-center justify-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-rose-900" />
                        What happens next?
                    </h3>
                    <ul className="text-left space-y-4 text-sm text-stone-600">
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center font-bold text-xs text-stone-500">1</span>
                            <span>We verify your order details and payment.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center font-bold text-xs text-stone-500">2</span>
                            <span>Your items are carefully packed with love.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center font-bold text-xs text-stone-500">3</span>
                            <span>You'll receive a tracking number once shipped.</span>
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                    <Link 
                        to="/profile?tab=orders" 
                        className="flex-1 py-3.5 px-6 bg-white border-2 border-stone-200 text-stone-700 font-bold rounded-xl hover:border-stone-300 hover:bg-stone-50 transition-all uppercase tracking-wide text-sm flex items-center justify-center gap-2 group"
                    >
                        <FileText className="w-4 h-4 group-hover:text-stone-900" />
                        View Order
                    </Link>
                    <Link 
                        to="/shop" 
                        className="flex-1 py-3.5 px-6 bg-rose-900 text-white font-bold rounded-xl hover:bg-rose-800 transition-all shadow-lg hover:shadow-rose-900/20 transform hover:-translate-y-0.5 uppercase tracking-wide text-sm flex items-center justify-center gap-2"
                    >
                        Continue Shopping
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            <style>{`
                @keyframes scale-in {
                    0% { transform: scale(0); opacity: 0; }
                    60% { transform: scale(1.1); }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scale-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default OrderSuccess;
