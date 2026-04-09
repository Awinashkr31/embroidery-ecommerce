import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Package, Loader, Star, ChevronRight, CheckCircle } from 'lucide-react';

const OrderList = ({ orders, loading, onCancelOrder, onReviewOrder, userReviews }) => {
    
    // Flatten all orders into individual items with order context
    const flatItems = useMemo(() => {
        if (!orders) return [];
        const items = [];
        [...orders]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .forEach(order => {
                (order.items || []).forEach(item => {
                    items.push({
                        ...item,
                        orderId: order.id,
                        orderStatus: order.status,
                        orderDate: order.created_at,
                        trackingUrl: order.tracking_url,
                    });
                });
            });
        return items;
    }, [orders]);

    const getStatusInfo = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
            case 'completed':
                return { label: 'Delivered', color: 'text-emerald-700 bg-emerald-50 border border-emerald-100', icon: '✅' };
            case 'shipped':
                return { label: 'Shipped', color: 'text-purple-700 bg-purple-50 border border-purple-100', icon: '🚚' };
            case 'processing':
                return { label: 'Processing', color: 'text-blue-700 bg-blue-50 border border-blue-100', icon: '⏳' };
            case 'cancelled':
                return { label: 'Cancelled', color: 'text-red-700 bg-red-50 border border-red-100', icon: '❌' };
            case 'cancellation_requested':
                return { label: 'Cancel Requested', color: 'text-amber-700 bg-amber-50 border border-amber-100', icon: '⚠️' };
            default:
                return { label: 'Confirmed', color: 'text-emerald-700 bg-emerald-50 border border-emerald-100', icon: '✅' };
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 bg-white rounded-2xl shadow-sm border border-stone-100">
                <Loader className="w-8 h-8 text-rose-900 animate-spin" />
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-stone-100 text-center">
                <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="w-10 h-10 text-stone-300" />
                </div>
                <h3 className="text-lg font-heading font-bold text-stone-900 mb-2">No orders yet</h3>
                <p className="text-stone-500 mb-8 max-w-sm mx-auto">Looks like you haven't made any purchases. Explore our collection to find something you love.</p>
                <Link to="/shop" className="btn-primary">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-stone-100">
            {flatItems.map((item, idx) => {
                const status = getStatusInfo(item.orderStatus);
                const isDelivered = ['delivered', 'completed'].includes(item.orderStatus?.toLowerCase());
                const isReviewed = userReviews?.has(item.id || item.product_id);
                const deliveryDate = new Date(item.orderDate).toLocaleDateString('en-IN', { 
                    day: 'numeric', month: 'short', year: new Date(item.orderDate).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined 
                });

                return (
                    <Link 
                        key={`${item.orderId}-${idx}`} 
                        to={`/order/${item.orderId}`}
                        className="flex items-center gap-4 p-4 hover:bg-white/80 transition-all duration-300 group relative"
                    >
                        {/* Product Image */}
                        <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-xl bg-stone-100 overflow-hidden border border-stone-200 shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status.color} flex items-center gap-1 shadow-sm`}>
                                    {status.icon} {status.label}
                                </span>
                                <span className="text-[10px] text-stone-400 font-medium tracking-wide">{deliveryDate}</span>
                            </div>
                            <h4 className="text-sm font-medium text-stone-900 truncate pr-2">
                                {item.name}
                            </h4>

                            {/* Stars + Review link */}
                            {isDelivered && (
                                <div className="mt-1.5 flex items-center gap-3">
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star 
                                                key={star} 
                                                className={`w-4 h-4 ${
                                                    isReviewed 
                                                        ? 'fill-emerald-500 text-emerald-500' 
                                                        : 'fill-stone-200 text-stone-200'
                                                }`} 
                                            />
                                        ))}
                                    </div>
                                    {isReviewed ? (
                                        <span className="text-[11px] font-bold text-emerald-600">Reviewed ✓</span>
                                    ) : (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                onReviewOrder?.(item);
                                            }}
                                            className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                            Write a Review
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Direct Action Buttons for Pending/Processing */}
                            {(['pending', 'confirmed', 'processing'].includes(item.orderStatus?.toLowerCase())) && (
                                <div className="mt-2 flex items-center gap-3">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onCancelOrder?.({ id: item.orderId, status: item.orderStatus });
                                        }}
                                        className="text-[11px] font-bold text-red-600 hover:text-red-800 hover:underline px-2 py-1 rounded border border-red-500/30 bg-red-50/50 transition-colors"
                                    >
                                        {['pending', 'confirmed'].includes(item.orderStatus?.toLowerCase()) ? 'Cancel Order' : 'Cancel Request'}
                                    </button>
                                </div>
                            )}

                            {/* Size / Qty */}
                            {(item.selectedSize || item.selected_size || item.quantity > 1) && (
                                <div className="flex gap-2 mt-1">
                                    {(item.selectedSize || item.selected_size) && (
                                        <span className="text-[10px] font-bold text-stone-400 bg-stone-50 px-1.5 py-0.5 rounded border border-stone-100">
                                            {item.selectedSize || item.selected_size}
                                        </span>
                                    )}
                                    {item.quantity > 1 && (
                                        <span className="text-[10px] text-stone-400">Qty: {item.quantity}</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Chevron */}
                        <ChevronRight className="w-5 h-5 text-stone-300 shrink-0 group-hover:text-stone-500 transition-colors" />
                    </Link>
                );
            })}
        </div>
    );
};

export default OrderList;
