import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const OrderSuccess = () => {
    const location = useLocation();
    const orderId = location.state?.orderId; // Safe access

    // Debugging
    React.useEffect(() => {
        console.log("OrderSuccess Mounted. OrderID:", orderId, "Type:", typeof orderId);
        if (typeof orderId === 'object') {
            console.warn("OrderSuccess: orderId is an object! This might cause a crash if rendered directly.");
        }
    }, [orderId]);

    const displayOrderId = (typeof orderId === 'object' && orderId !== null) 
        ? (orderId.id || JSON.stringify(orderId)) 
        : orderId;

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4 pt-24">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-green-100">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">✓</span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
                <p className="text-gray-600 mb-6">
                    Thank you so much for your purchase. We are processing it now.
                </p>

                {displayOrderId && (
                    <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-6">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Order ID</p>
                        <p className="font-mono font-bold text-gray-800 break-all">{displayOrderId}</p>
                    </div>
                )}

                <div className="space-y-3">
                     <Link to="/profile" className="block w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-medium">
                        View My Order
                    </Link>
                    <Link to="/shop" className="block w-full bg-rose-900 text-white py-3 rounded-lg hover:bg-rose-800 transition font-bold shadow-md">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
