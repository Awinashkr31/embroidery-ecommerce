import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Package, Loader } from 'lucide-react';
import OrderCard from './OrderCard';

const OrderList = ({ orders, loading, onCancelOrder, onReviewOrder, userReviews }) => {
    
    // Sort logic (default to newest first)
    const sortedOrders = useMemo(() => {
        if (!orders) return [];
        return [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }, [orders]);


    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 bg-white rounded-2xl shadow-sm border border-stone-100">
                <Loader className="w-8 h-8 text-rose-900 animate-spin" />
            </div>
        );
    }

    if (orders.length === 0) {
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
        <div className="space-y-6">


            {sortedOrders.length > 0 ? (
                <div className="space-y-4">
                    {sortedOrders.map(order => (
                        <OrderCard 
                            key={order.id} 
                            order={order} 
                            onCancel={onCancelOrder}
                            onReviewOrder={onReviewOrder}
                            userReviews={userReviews}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-stone-100 border-dashed">
                    <p className="text-stone-500">No orders found.</p>
                </div>
            )}
        </div>
    );
};

export default OrderList;
