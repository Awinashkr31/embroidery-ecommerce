import React, { useState, useEffect } from 'react';
import { supabase } from '../../../config/supabase';
import { Star, Check, X, Search, Filter } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending'); // pending, approved
    const { addToast } = useToast();

    useEffect(() => {
        fetchReviews();
    }, [filter]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*, products(name, image)')
                .eq('status', filter)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReviews(data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            addToast('Failed to load reviews', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            if (newStatus === 'rejected') {
                const { error } = await supabase.from('reviews').delete().eq('id', id);
                if (error) throw error;
                addToast('Review rejected and deleted', 'success');
            } else {
                const { error } = await supabase
                    .from('reviews')
                    .update({ status: newStatus })
                    .eq('id', id);
                if (error) throw error;
                addToast('Review approved', 'success');
            }
            fetchReviews();
        } catch (error) {
            console.error('Error updating review:', error);
            addToast('Failed to update review status', 'error');
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
        ));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900">Customer Reviews</h1>
                    <p className="text-stone-500">Manage and moderate product reviews</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            filter === 'pending' ? 'bg-rose-900 text-white' : 'bg-white text-stone-600 border border-stone-200'
                        }`}
                    >
                        Pending approval
                    </button>
                    <button
                        onClick={() => setFilter('approved')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            filter === 'approved' ? 'bg-rose-900 text-white' : 'bg-white text-stone-600 border border-stone-200'
                        }`}
                    >
                        Approved
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-900 mx-auto"></div>
                </div>
            ) : reviews.length === 0 ? (
                <div className="bg-white rounded-xl border border-stone-100 p-12 text-center">
                    <Star className="w-12 h-12 text-stone-200 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-stone-900 mb-2">No reviews found</h3>
                    <p className="text-stone-500">There are no reviews with {filter} status.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm flex flex-col md:flex-row gap-6">
                            {/* Product Info */}
                            <div className="flex items-center gap-4 md:w-1/4">
                                <div className="w-16 h-16 rounded-lg bg-stone-50 overflow-hidden flex-shrink-0">
                                    {review.products?.image && (
                                        <img src={JSON.parse(review.products.image)[0]} alt={review.products.name} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-stone-900 text-sm truncate">{review.products?.name}</h4>
                                    <p className="text-xs text-stone-500">ID: {review.product_id}</p>
                                </div>
                            </div>

                            {/* Review Content */}
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex">{renderStars(review.rating)}</div>
                                        <span className="font-bold text-stone-900 text-sm">{review.user_name}</span>
                                    </div>
                                    <span className="text-xs text-stone-400">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-stone-600 text-sm leading-relaxed">
                                    {review.comment}
                                </p>
                            </div>

                            {/* Actions */}
                            {filter === 'pending' && (
                                <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-stone-100 pt-4 md:pt-0 md:pl-6 md:w-32">
                                    <button
                                        onClick={() => handleUpdateStatus(review.id, 'approved')}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-bold transition-colors"
                                    >
                                        <Check className="w-4 h-4" /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(review.id, 'rejected')}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-bold transition-colors"
                                    >
                                        <X className="w-4 h-4" /> Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Reviews;
