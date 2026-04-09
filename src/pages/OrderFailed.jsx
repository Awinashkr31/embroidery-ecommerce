import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCcw, HelpCircle } from 'lucide-react';

const OrderFailed = () => {
    const location = useLocation();
    const errorMessage = location.state?.error || "We couldn't process your payment. This is usually due to a bank decline, an expired card, or network issues.";

    return (
        <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center font-body pt-20 pb-12 px-4 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-red-400/15 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
            <div className="absolute top-1/4 right-1/4 w-[200px] h-[200px] bg-rose-300/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="glass-panel bg-white/80 p-8 md:p-12 rounded-3xl shadow-2xl shadow-red-900/10 border border-white/60 max-w-lg w-full text-center relative overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-500">
                {/* Top accent bar with gradient */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-400 via-red-500 to-rose-600"></div>
                
                {/* Pulsing icon */}
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-lg shadow-red-200/50 relative">
                    <XCircle className="w-12 h-12 text-red-500" strokeWidth={2.5} />
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-15"></div>
                    <div className="absolute -inset-1 bg-red-400/20 rounded-full animate-pulse"></div>
                </div>
                
                <h1 className="text-3xl font-heading font-bold text-stone-900 mb-3">Payment Failed</h1>
                
                {/* Error details card */}
                <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 rounded-xl p-4 mb-8 text-left flex gap-3 shadow-sm">
                    <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-red-800 leading-relaxed">
                        {errorMessage}
                    </p>
                </div>
                
                <p className="text-stone-500 mb-10 text-sm leading-relaxed">
                    Don't worry! Your cart has been saved safely and no money was deducted. You can try again using a different payment method.
                </p>

                <div className="space-y-3">
                    <Link 
                        to="/checkout" 
                        className="flex items-center justify-center w-full bg-gradient-to-r from-red-600 to-rose-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-red-900/30 group transform hover:-translate-y-0.5 hover:from-red-500 hover:to-rose-800"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                        Try Again
                    </Link>
                    
                    <Link 
                        to="/cart" 
                        className="flex items-center justify-center w-full bg-white/70 text-stone-700 py-4 rounded-xl font-bold uppercase hover:bg-white border border-stone-200 transition-all group shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Cart
                    </Link>
                </div>

                <div className="mt-8 pt-8 border-t border-stone-100/50">
                    <button className="flex items-center justify-center w-full text-xs font-bold text-stone-400 hover:text-stone-600 transition-colors uppercase tracking-widest group">
                        <HelpCircle className="w-4 h-4 mr-1.5 group-hover:text-rose-900 transition-colors" /> Need help paying? Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderFailed;
