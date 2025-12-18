import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

const OrderSuccess = () => {
    // Basic CSS-only animation approach to avoid adding deps like react-confetti without user permission
    
    return (
        <div className="min-h-screen bg-warm-beige/30 flex items-center justify-center font-sofia p-4">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center relative overflow-hidden">
                {/* Decorative background circle */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-100 rounded-full animate-ping opacity-20"></div>
                
                {/* Success Icon */}
                <div className="relative z-10 mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce-short">
                    <Check className="w-10 h-10 text-green-600" />
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
                <p className="text-gray-600 mb-8">
                    Thank you for your purchase. Your order has been placed successfully and is now being processed.
                </p>

                <div className="space-y-4">
                    <Link 
                        to="/profile" 
                        className="block w-full py-3 px-6 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        View Order Details
                    </Link>
                    <Link 
                        to="/shop" 
                        className="block w-full py-3 px-6 bg-deep-rose text-white font-bold rounded-xl hover:bg-deep-rose/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                        Continue Shopping
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <style>{`
                    @keyframes bounce-short {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-10px); }
                    }
                    .animate-bounce-short {
                        animation: bounce-short 1s ease-in-out infinite;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default OrderSuccess;
