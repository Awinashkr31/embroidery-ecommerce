import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, AlertTriangle, ChevronRight, Clock, Star, Trash2 } from 'lucide-react';

const OrderCard = ({ order, onCancel, onReview, userReviews }) => {
    
    const getStatusStyle = (status) => {
        switch(status.toLowerCase()) {
            case 'completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            case 'cancellation_requested': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-stone-100 text-stone-700 border-stone-200';
        }
    };

    const getStatusIcon = (status) => {
        switch(status.toLowerCase()) {
            case 'completed': 
            case 'delivered': return <CheckCircle className="w-3.5 h-3.5" />;
            case 'cancelled': return <AlertTriangle className="w-3.5 h-3.5" />;
            case 'shipped': return <Truck className="w-3.5 h-3.5" />;
            default: return <Clock className="w-3.5 h-3.5" />;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="p-5 bg-stone-50/50 border-b border-stone-100 flex flex-wrap justify-between items-center gap-4">
                <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Order ID</p>
                    <p className="font-mono font-bold text-stone-900">#{order.id.slice(0, 8)}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Date</p>
                    <p className="font-medium text-stone-800">{new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Total</p>
                    <p className="font-bold text-rose-900">₹{order.total.toLocaleString()}</p>
                </div>
                <div>
                     <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusStyle(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status === 'pending' ? 'Confirmed' : order.status}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <div className="flex flex-col gap-4">
                    {/* Preview of first 2 items */}
                    {order.items?.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg bg-stone-100 overflow-hidden border border-stone-200 shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-stone-900 truncate text-sm">{item.name}</h4>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    <span className="text-xs text-stone-500">Qty: {item.quantity}</span>
                                    {(item.selectedSize || item.selected_size) && (
                                        <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                                            {item.selectedSize || item.selected_size}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {/* Individual Item Action (Review) */}
                             {order.status !== 'cancelled' && onReview && (
                                <div className="text-right">
                                     {userReviews?.has(item.id) ? (
                                        <span className="inline-flex items-center text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                                            <CheckCircle className="w-3 h-3 mr-1" /> Reviewed
                                        </span>
                                    ) : (
                                        <button 
                                            onClick={() => onReview(item)}
                                            className="inline-flex items-center text-[10px] font-bold text-rose-900 hover:text-white border border-rose-200 hover:bg-rose-900 px-2 py-1 rounded-full transition-colors"
                                        >
                                            <Star className="w-3 h-3 mr-1" /> Review
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {order.items?.length > 2 && (
                        <p className="text-xs text-stone-500 italic pl-1">+ {order.items.length - 2} more items</p>
                    )}
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                    <Link to={`/order/${order.id}`} className="text-sm font-bold text-rose-900 hover:text-rose-700 flex items-center group-hover:underline">
                        View Details <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>

                    <div className="flex gap-2">
                        {/* Cancel Action */}
                        {onCancel && ['pending', 'confirmed', 'processing'].includes(order.status.toLowerCase()) && (
                             <button 
                                onClick={() => onCancel(order)}
                                className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-wide transition-colors flex items-center gap-1.5"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                {['pending', 'confirmed'].includes(order.status.toLowerCase()) ? 'Cancel' : 'Request Cancel'}
                            </button>
                        )}
                        
                        {/* Track Order - Placeholder for now, or link if tracking_url exists */}
                        {order.tracking_url && (
                             <a 
                                href={order.tracking_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-bold uppercase tracking-wide transition-colors flex items-center gap-1.5"
                            >
                                <Truck className="w-3.5 h-3.5" />
                                Track
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;
