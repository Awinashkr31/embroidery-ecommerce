import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../config/supabase';
import { Star, Check, X, Search, Filter, Loader2, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending'); // pending, approved
    const [aiAnalysis, setAiAnalysis] = useState({});
    const [aiFilter, setAiFilter] = useState('all');
    const [analyzing, setAnalyzing] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const { addToast } = useToast();

    // New AI Function
    const analyzeReviews = useCallback(async (reviewsData) => {
        if (!reviewsData || reviewsData.length === 0) return;
        setAnalyzing(true);
        try {
            const payload = {
                reviews: reviewsData.map(r => ({ id: r.id.toString(), text: r.comment || '' }))
            };
            const apiUrl = import.meta.env.VITE_ML_API_URL || 'http://localhost:8000';
            const res = await fetch(`${apiUrl}/api/admin/analyze_reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const analysis = await res.json();
                setAiAnalysis(prev => ({...prev, ...analysis}));
            }
        } catch (error) {
            console.error("AI Analysis failed:", error);
        } finally {
            setAnalyzing(false);
        }
    }, []);

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*, products(name, images)')
                .eq('status', filter) // filter is a dependency
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReviews(data || []);
            
            // Fire off AI analysis silently matching the visible list
            if (data && data.length > 0) {
                analyzeReviews(data);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            addToast('Failed to load reviews', 'error');
        } finally {
            setLoading(false);
        }
    }, [filter, addToast, analyzeReviews]);

    useEffect(() => {
        setSelectedIds([]);
        fetchReviews();
    }, [fetchReviews, filter]);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            if (newStatus === 'delete') {
                const { error } = await supabase.from('reviews').delete().eq('id', id);
                if (error) throw error;
                addToast('Review permanently deleted', 'success');
            } else {
                const { error } = await supabase
                    .from('reviews')
                    .update({ status: newStatus })
                    .eq('id', id);
                if (error) throw error;
                addToast(`Review marked as ${newStatus}`, 'success');
            }
            fetchReviews();
        } catch (error) {
            console.error('Error updating review:', error);
            addToast('Failed to update review status', 'error');
        }
    };

    const toggleSelectAll = (e, visibleIds) => {
        if (e.target.checked) setSelectedIds(visibleIds);
        else setSelectedIds([]);
    };
    
    const toggleSelectOne = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleBulkApprove = async () => {
        if (!selectedIds.length) return;
        if (!window.confirm(`Are you sure you want to approve ${selectedIds.length} selected review(s)?`)) return;
        setLoading(true);
        try {
            const { error } = await supabase
                .from('reviews')
                .update({ status: 'approved' })
                .in('id', selectedIds);
            if (error) throw error;
            addToast(`${selectedIds.length} reviews approved`, 'success');
            setSelectedIds([]);
            fetchReviews();
        } catch (error) {
            console.error('Error approving selected:', error);
            addToast('Failed to approve reviews', 'error');
            setLoading(false);
        }
    };

    const handleBulkDelete = async () => {
        if (!selectedIds.length) return;
        
        if (filter === 'rejected') {
            if (!window.confirm(`Are you sure you want to permanently delete ${selectedIds.length} selected review(s)? This cannot be undone.`)) return;
            setLoading(true);
            try {
                const { error } = await supabase.from('reviews').delete().in('id', selectedIds);
                if (error) throw error;
                addToast(`${selectedIds.length} reviews permanently deleted`, 'success');
                setSelectedIds([]);
                fetchReviews();
            } catch (error) {
                console.error('Error deleting selected:', error);
                addToast('Failed to delete reviews', 'error');
                setLoading(false);
            }
        } else {
            if (!window.confirm(`Are you sure you want to reject ${selectedIds.length} selected review(s)?`)) return;
            setLoading(true);
            try {
                const { error } = await supabase.from('reviews').update({ status: 'rejected' }).in('id', selectedIds);
                if (error) throw error;
                addToast(`${selectedIds.length} reviews rejected`, 'success');
                setSelectedIds([]);
                fetchReviews();
            } catch (error) {
                console.error('Error rejecting selected:', error);
                addToast('Failed to reject reviews', 'error');
                setLoading(false);
            }
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
        ));
    };

    const visibleReviews = reviews.filter(review => {
        if (aiFilter === 'all') return true;
        const analysis = aiAnalysis[review.id];
        
        if (aiFilter === 'positive' && analysis?.sentiment === 'POSITIVE') return true;
        if (aiFilter === 'negative' && analysis?.sentiment === 'NEGATIVE') return true;
        if (aiFilter === 'abusive' && analysis?.is_abusive === true) return true;
        
        return false;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900">Customer Reviews</h1>
                    <p className="text-stone-500">Manage and moderate product reviews</p>
                </div>
                <div className="flex flex-col gap-3 items-end">
                    <div className="flex gap-2">
                        <select 
                            value={aiFilter} 
                            onChange={(e) => setAiFilter(e.target.value)}
                            className="px-3 py-2 border border-stone-200 rounded-lg text-sm bg-stone-50 font-medium mr-2"
                        >
                            <option value="all">AI Filter: All</option>
                            <option value="positive">Positive</option>
                            <option value="negative">Negative</option>
                            <option value="abusive">Abusive ⚠️</option>
                        </select>
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
                        <button
                            onClick={() => setFilter('rejected')}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                filter === 'rejected' ? 'bg-rose-900 text-white' : 'bg-white text-stone-600 border border-stone-200'
                            }`}
                        >
                            Rejected
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Bulk Toolbar */}
            {visibleReviews.length > 0 && !loading && (
                <div className="flex items-center justify-between bg-stone-50 border border-stone-200 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                        <input 
                            type="checkbox" 
                            checked={selectedIds.length === visibleReviews.length && visibleReviews.length > 0}
                            onChange={(e) => toggleSelectAll(e, visibleReviews.map(r => r.id))}
                            className="w-4 h-4 text-rose-600 rounded border-stone-300 focus:ring-rose-500"
                        />
                        <span className="text-sm font-bold text-stone-700">Select All ({selectedIds.length} selected)</span>
                    </div>
                    {selectedIds.length > 0 && (
                        <div className="flex gap-2 animate-in fade-in">
                            {filter === 'pending' && (
                                <button
                                    onClick={handleBulkApprove}
                                    className="px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                                >
                                    <Check className="w-4 h-4" /> Approve Selected
                                </button>
                            )}
                            <button
                                onClick={handleBulkDelete}
                                className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                            >
                                <X className="w-4 h-4" /> {filter === 'rejected' ? 'Permanently Delete' : 'Reject Selected'}
                            </button>
                        </div>
                    )}
                </div>
            )}

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
                    {visibleReviews.map((review) => (
                        <div key={review.id} className={`bg-white p-6 rounded-xl border shadow-sm flex flex-col md:flex-row gap-6 transition-colors ${selectedIds.includes(review.id) ? 'border-rose-300 bg-rose-50' : 'border-stone-100'}`}>
                            {/* Checkbox */}
                            <div className="flex items-center justify-center md:pt-4 h-full">
                                <input 
                                    type="checkbox"
                                    checked={selectedIds.includes(review.id)}
                                    onChange={() => toggleSelectOne(review.id)}
                                    className="w-5 h-5 text-rose-600 rounded border-stone-300 focus:ring-rose-500 cursor-pointer"
                                />
                            </div>

                            {/* Product Info */}
                            <div className="flex items-center gap-4 md:w-1/4">
                                <div className="w-16 h-16 rounded-lg bg-stone-50 overflow-hidden flex-shrink-0">
                                    {review.products?.images?.[0] && (
                                        <img src={review.products.images[0]} alt={review.products.name} className="w-full h-full object-cover" />
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
                                        {/* AI BADGES */}
                                        {aiAnalysis[review.id] && (
                                            <div className="flex items-center gap-1.5 ml-2">
                                                {aiAnalysis[review.id].sentiment === 'POSITIVE' && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> POSITIVE</span>}
                                                {aiAnalysis[review.id].sentiment === 'NEGATIVE' && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 flex items-center gap-1"><XCircle className="w-3 h-3"/> NEGATIVE</span>}
                                                {aiAnalysis[review.id].is_abusive && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-900 text-white flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> ABUSIVE</span>}
                                            </div>
                                        )}
                                        {analyzing && !aiAnalysis[review.id] && (
                                            <span className="flex items-center text-[10px] text-stone-400 gap-1 ml-2"><Loader2 className="w-3 h-3 animate-spin" /> analyzing...</span>
                                        )}
                                    </div>
                                    <span className="text-xs text-stone-400">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-stone-600 text-sm leading-relaxed">
                                    {review.comment}
                                </p>
                                {review.image_url && (
                                    <a href={review.image_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block w-16 h-16 rounded-lg overflow-hidden border border-stone-200 hover:border-rose-300 transition-colors">
                                        <img src={review.image_url} alt="Review photo" className="w-full h-full object-cover" />
                                    </a>
                                )}
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
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-lg text-sm font-bold transition-colors"
                                    >
                                        <X className="w-4 h-4" /> Reject
                                    </button>
                                </div>
                            )}
                            {filter === 'approved' && (
                                <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-stone-100 pt-4 md:pt-0 md:pl-6 md:w-32">
                                    <button
                                        onClick={() => handleUpdateStatus(review.id, 'rejected')}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-lg text-sm font-bold transition-colors"
                                    >
                                        <X className="w-4 h-4" /> Reject
                                    </button>
                                </div>
                            )}
                            {filter === 'rejected' && (
                                <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-stone-100 pt-4 md:pt-0 md:pl-6 md:w-32">
                                    <button
                                        onClick={() => handleUpdateStatus(review.id, 'pending')}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 hover:bg-stone-200 rounded-lg text-sm font-bold transition-colors"
                                    >
                                        <Check className="w-4 h-4" /> Restore
                                    </button>
                                    <button
                                        onClick={() => {
                                            if(window.confirm('Are you sure you want to permanently delete this rejected review?')) {
                                                handleUpdateStatus(review.id, 'delete');
                                            }
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-bold transition-colors"
                                    >
                                        <X className="w-4 h-4" /> Delete
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
