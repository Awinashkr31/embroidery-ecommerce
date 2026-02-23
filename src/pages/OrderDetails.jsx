import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Package, MapPin, CreditCard, Clock, Calendar, AlertTriangle, Printer, Download, Star, Loader, HelpCircle, RotateCcw, MessageSquare } from 'lucide-react';
import { supabase } from '../config/supabase';
import OrderStatusStepper from '../components/orders/OrderStatusStepper';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';


const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);

    // Rate Purchase modal state
    const [reviewModal, setReviewModal] = useState({ isOpen: false, item: null });
    const [reviewState, setReviewState] = useState({ rating: 5, comment: '', submitting: false });

    useEffect(() => {
        if (!id) return;

        // Subscribe to Realtime Updates
        const channel = supabase
            .channel(`order-tracking-${id}`)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${id}` },
                (payload) => {
                    setOrder(prev => ({ ...prev, ...payload.new }));
                }
            )
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'order_status_logs', filter: `order_id=eq.${id}` },
                async () => {
                    // Refresh logs
                    const { data: logs } = await supabase
                        .from('order_status_logs')
                        .select('*')
                        .eq('order_id', id)
                        .order('timestamp', { ascending: false });
                    
                    if (logs) {
                        setOrder(prev => ({ ...prev, order_status_logs: logs }));
                    }
                }
            )
            .subscribe();

        return () => {
             supabase.removeChannel(channel);
        };
    }, [id]);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                // 1. Fetch Order Basic Details
                const { data: orderData, error: orderError } = await supabase
                    .from('orders')
                    .select('*, shipping_address, items')
                    .eq('id', id)
                    .single();

                if (orderError) throw orderError;

                // 2. Fetch Logs Separately (to avoid join issues)
                const { data: logsData, error: logsError } = await supabase
                    .from('order_status_logs')
                    .select('*')
                    .eq('order_id', id)
                    .order('timestamp', { ascending: false });

                if (logsError) console.warn('Error fetching logs:', logsError);

                // Combine
                const fullOrder = {
                    ...orderData,
                    order_status_logs: logsData || []
                };

                // Ownership check — prevent cross-user order snooping
                if (
                    currentUser &&
                    orderData.customer_email &&
                    orderData.customer_email !== currentUser.email
                ) {
                    addToast('You do not have access to this order.', 'error');
                    navigate('/profile');
                    return;
                }

                setOrder(fullOrder);
            } catch (error) {
                console.error('Error fetching order:', error);
                addToast(`Error: ${error.message || 'Order not found'}`, 'error');
                navigate('/profile');
            } finally {
                setLoading(false);
            }
        };

        if (currentUser && id) {
            fetchOrderDetails();
        }
    }, [currentUser, id, addToast, navigate]);

    // --- Rate Purchase Handler ---
    const handleSubmitReview = async () => {
        if (!reviewModal.item || reviewState.submitting) return;
        setReviewState(s => ({ ...s, submitting: true }));
        try {
            const { error } = await supabase.from('reviews').insert([{
                user_id: currentUser.id,
                user_name: currentUser.displayName || currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0],
                product_id: reviewModal.item.id || reviewModal.item.product_id,
                rating: reviewState.rating,
                comment: reviewState.comment,
                order_id: order.id,
            }]);
            if (error) throw error;
            addToast('Review submitted! Thank you.', 'success');
            setReviewModal({ isOpen: false, item: null });
            setReviewState({ rating: 5, comment: '', submitting: false });
        } catch (err) {
            console.error('Review submit failed:', err);
            addToast('Could not submit review. Please try again.', 'error');
            setReviewState(s => ({ ...s, submitting: false }));
        }
    };

    // --- Return / Replace Logic ---
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [returnType, setReturnType] = useState('replace'); // 'replace' | 'return'
    const [returnReason, setReturnReason] = useState('');
    const [hasUnboxingVideo, setHasUnboxingVideo] = useState(false);
    const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);

    const handleReturnSubmit = async () => {
        if (!hasUnboxingVideo) {
            addToast('You must confirm you have an unboxing video.', 'error');
            return;
        }
        if (!returnReason.trim()) {
            addToast('Please provide a reason.', 'error');
            return;
        }

        setIsSubmittingReturn(true);
        try {
            const status = returnType === 'replace' ? 'replacement_requested' : 'return_requested';
            const processDate = new Date();
            processDate.setDate(processDate.getDate() + 2); // +2 days logic

            // 1. Update Order Status
            const { error: updateError } = await supabase
                .from('orders')
                .update({ 
                    status: status,
                    expected_delivery_date: returnType === 'replace' ? processDate.toISOString() : order.expected_delivery_date // Update delivery date if replacement
                })
                .eq('id', order.id);

            if (updateError) throw updateError;

            // 2. Add Log Entry
            const { error: logError } = await supabase
                .from('order_status_logs')
                .insert([{
                    order_id: order.id,
                    status: status,
                    timestamp: new Date().toISOString(),
                    location: 'Customer Portal',
                    description: `User requested ${returnType}. Reason: ${returnReason}. Video Confirmed: Yes.`
                }]);

            if (logError) console.warn('Log insert failed', logError); // Non-blocking

            addToast(`${returnType === 'replace' ? 'Replacement' : 'Return'} requested successfully.`, 'success');
            setIsReturnModalOpen(false);
            
            // Optimistic Update
            setOrder(prev => ({ ...prev, status: status }));

        } catch (error) {
            console.error('Return request failed:', error);
            addToast('Failed to submit request. Please try again.', 'error');
        } finally {
            setIsSubmittingReturn(false);
        }
    };

    const getProjectedDateV2 = () => {
        const d = new Date();
        d.setDate(d.getDate() + 2);
        return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
                <Loader className="w-8 h-8 text-rose-900 animate-spin" />
            </div>
        );
    }

    if (!order) return null;

    const isDelivered = order.status?.toLowerCase() === 'delivered' || order.status?.toLowerCase() === 'completed';

    return (
        <div className="min-h-screen bg-[#fdfbf7] pt-20 md:pt-28 pb-12 font-body">
            <div className="container-custom max-w-5xl">
                {/* Back Link */}
                <Link to="/profile" className="hidden md:inline-flex items-center text-stone-500 hover:text-rose-900 mb-6 font-medium transition-colors">
                    <ChevronLeft className="w-5 h-5 mr-1" /> Back to My Orders
                </Link>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1 space-y-6">
                        
                        {/* Header Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                            <div className="p-6 border-b border-stone-100 flex flex-wrap justify-between items-start gap-4">
                                <div>
                                    <h1 className="text-2xl font-heading font-bold text-stone-900 mb-1">Order #{order.id.slice(0, 8)}</h1>
                                    <p className="text-stone-500 text-sm">Placed on {new Date(order.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    
                                    {/* Dynamic Status Text */}
                                    <div className="mt-2 text-sm font-medium">
                                        {isDelivered ? (
                                            <span className="text-emerald-700 flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                Delivered on {new Date(order.order_status_logs?.[0]?.timestamp || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        ) : (
                                            <span className="text-blue-700 flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                                {order.expected_delivery 
                                                    ? `Arriving by ${new Date(order.expected_delivery).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}`
                                                    : 'Arriving Soon'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-stone-600 font-bold text-sm hover:bg-stone-50 transition-colors">
                                        <Printer className="w-4 h-4" /> Invoice
                                    </button>
                                </div>
                            </div>
                            
                            {/* Detailed Stepper */}
                            <div className="px-4 md:px-8 py-8 bg-white border-b border-stone-100">
                                <OrderStatusStepper currentStatus={order.status} logs={order.order_status_logs} order={order} />
                            </div>

                            {/* Action Buttons (Support / Return / Rate) */}
                            <div className="p-6 bg-stone-50/50 flex flex-wrap gap-4 justify-between items-center">
                                <div className="flex gap-3 flex-wrap">
                                    {isDelivered && (
                                        <>
                                            <button
                                                onClick={() => setReviewModal({ isOpen: true, item: order.items[0] })}
                                                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-700 font-bold text-sm hover:bg-stone-50 hover:border-stone-300 transition-all shadow-sm"
                                            >
                                                <Star className="w-4 h-4 text-amber-400 fill-current" /> Rate Purchase
                                            </button>
                                            <button 
                                                onClick={() => setIsReturnModalOpen(true)}
                                                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-700 font-bold text-sm hover:bg-stone-50 hover:border-stone-300 transition-all shadow-sm"
                                            >
                                                <RotateCcw className="w-4 h-4 text-stone-500" /> Return / Replace
                                            </button>
                                        </>
                                    )}
                                </div>
                                
                                <button className="flex items-center gap-2 px-4 py-2.5 text-rose-900 font-bold text-sm hover:bg-rose-50 rounded-xl transition-colors">
                                    <HelpCircle className="w-4 h-4" /> Need Help?
                                </button>
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                            <div className="p-4 bg-stone-50 border-b border-stone-100">
                                <h3 className="font-bold text-stone-800 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-stone-400" />
                                    Items ({order.items.length})
                                </h3>
                            </div>
                            <div className="divide-y divide-stone-100">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="p-6 flex flex-col sm:flex-row gap-6">
                                        <div className="w-24 h-24 rounded-xl bg-stone-100 overflow-hidden border border-stone-200 shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-bold text-lg text-stone-900">{item.name}</h4>
                                                    <p className="text-stone-500 text-sm">{item.category}</p>
                                                </div>
                                                <p className="font-bold text-lg text-stone-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-4 text-sm text-stone-600 mb-4">
                                                <div className="bg-stone-50 px-3 py-1 rounded-lg border border-stone-200">
                                                    Qty: <span className="font-bold text-stone-900">{item.quantity}</span>
                                                </div>
                                                {(item.selectedSize || item.selected_size) && (
                                                    <div className="bg-stone-50 px-3 py-1 rounded-lg border border-stone-200">
                                                        Size: <span className="font-bold text-stone-900">{item.selectedSize || item.selected_size}</span>
                                                    </div>
                                                )}
                                                {(item.selectedColor || item.selected_color) && (item.selectedColor !== 'NA' && item.selected_color !== 'NA') && (
                                                    <div className="bg-stone-50 px-3 py-1 rounded-lg border border-stone-200 flex items-center gap-2">
                                                        Color: 
                                                        <span className="w-4 h-4 rounded-full border border-stone-300" style={{ backgroundColor: (item.selectedColor || item.selected_color || '').toLowerCase() }}></span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-80 space-y-6">
                        
                                {/* Order Summary */}
                        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                             <div className="p-4 bg-stone-50 border-b border-stone-100">
                                <h3 className="font-bold text-stone-800">Order Summary</h3>
                            </div>
                            <div className="p-6 space-y-2"> {/* space-y-2 for tighter spacing like image */}
                                {/* Item(s) Subtotal */}
                                <div className="flex justify-between text-stone-800 text-sm">
                                    <span>Item(s) Subtotal:</span>
                                    <span>₹{order.subtotal?.toLocaleString() || order.total?.toLocaleString()}</span>
                                </div>
                                
                                {/* Shipping */}
                                <div className="flex justify-between text-stone-800 text-sm">
                                    <span>Shipping:</span>
                                    <span>
                                        {(order.shipping_cost === 0 || !order.shipping_cost) ? '₹0.00' : `₹${order.shipping_cost}`}
                                    </span>
                                </div>

                                {/* Cash/Pay on Delivery fee - Placeholder for now as it's not in DB yet, or use 0 */}
                                <div className="flex justify-between text-stone-800 text-sm">
                                    <span>Cash/Pay on Delivery fee:</span>
                                    <span>₹0.00</span>
                                </div>

                                {/* Total (Before Discount) */}
                                <div className="flex justify-between text-stone-800 text-sm pt-2">
                                    <span>Total:</span>
                                    <span>₹{((order.subtotal || order.total) + (order.shipping_cost || 0)).toLocaleString()}</span>
                                </div>

                                {/* Promotion Applied */}
                                {order.discount > 0 && (
                                    <div className="flex justify-between text-stone-800 text-sm">
                                        <span>Promotion Applied:</span>
                                        <span>-₹{order.discount.toLocaleString()}</span>
                                    </div>
                                )}

                                {/* Grand Total */}
                                <div className="flex justify-between items-center text-lg font-bold text-stone-900 pt-2 border-t border-stone-200 mt-2">
                                    <span>Grand Total:</span>
                                    <span>₹{order.total?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                             <div className="p-4 bg-stone-50 border-b border-stone-100">
                                <h3 className="font-bold text-stone-800 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Shipping Details
                                </h3>
                            </div>
                            <div className="p-6 text-sm text-stone-600 leading-relaxed">
                                <p className="font-bold text-stone-900 mb-1">{order.shipping_address?.firstName} {order.shipping_address?.lastName}</p>
                                <p>{order.shipping_address?.address}</p>
                                <p>{order.shipping_address?.city}, {order.shipping_address?.state}</p>
                                <p className="font-mono mt-1">{order.shipping_address?.zipCode}</p>
                                <p className="mt-2 text-stone-500">{order.shipping_address?.phone}</p>
                            </div>
                        </div>

                        {/* Payment Info */}
                         <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                             <div className="p-4 bg-stone-50 border-b border-stone-100">
                                <h3 className="font-bold text-stone-800 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" /> Payment Info
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-stone-600">Method</span>
                                    <span className="font-bold text-stone-900 uppercase">{order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-stone-600">Status</span>
                                    <span className={`text-xs font-bold px-2 py-1 rounded bg-emerald-100 text-emerald-700 uppercase`}>
                                        {order.payment_status || 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Return / Replace Modal */}
            {isReturnModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-stone-900">Return or Replace Item</h2>
                            <button 
                                onClick={() => setIsReturnModalOpen(false)}
                                className="p-2 hover:bg-stone-50 rounded-full transition-colors text-stone-500"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            
                            {/* 1. Unboxing Video Warning - IMPORTANT */}
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-amber-800 text-sm">Unboxing Video Required</h4>
                                    <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                                        To process any return or replacement, you <strong>must</strong> have a clear unboxing video of the package. Without this video, we cannot accept your request.
                                    </p>
                                </div>
                            </div>

                            {/* 2. Type Selection */}
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-2">I want to:</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => setReturnType('replace')}
                                        className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${returnType === 'replace' ? 'bg-rose-50 border-rose-500 text-rose-700' : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'}`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <RotateCcw className="w-4 h-4" /> Replace Item
                                        </div>
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setReturnType('return')}
                                        className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${returnType === 'return' ? 'bg-rose-50 border-rose-500 text-rose-700' : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'}`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <RotateCcw className="w-4 h-4" /> Return for Refund
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* 3. Reason */}
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-2">Reason for {returnType}:</label>
                                <textarea 
                                    value={returnReason}
                                    onChange={(e) => setReturnReason(e.target.value)}
                                    placeholder="Please describe the issue..."
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-rose-900/10 min-h-[100px]"
                                />
                            </div>

                            {/* 4. Mandatory Checkbox */}
                            <label className="flex items-start gap-3 p-3 rounded-xl hover:bg-stone-50 cursor-pointer transition-colors border border-transparent hover:border-stone-200">
                                <div className="relative flex items-center">
                                    <input 
                                        type="checkbox" 
                                        checked={hasUnboxingVideo}
                                        onChange={(e) => setHasUnboxingVideo(e.target.checked)}
                                        className="w-5 h-5 rounded border-stone-300 text-rose-600 focus:ring-rose-500 mt-0.5"
                                    />
                                </div>
                                <span className="text-sm text-stone-700">
                                    I confirm that I have recorded a clear unboxing video of the package and can provide it if requested.
                                </span>
                            </label>

                            {/* 5. Date Info */}
                            <div className="bg-stone-50 p-4 rounded-xl flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-stone-400" />
                                <div>
                                    <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Estimated {returnType === 'replace' ? 'Replacement Delivery' : 'Pickup'} Date</p>
                                    <p className="text-sm font-bold text-stone-900 mt-1">{getProjectedDateV2()}</p>
                                </div>
                            </div>

                        </div>

                        <div className="p-6 bg-stone-50 border-t border-stone-100 flex justify-end gap-3">
                            <button 
                                onClick={() => setIsReturnModalOpen(false)}
                                className="px-5 py-2.5 rounded-xl font-bold text-stone-500 hover:bg-stone-100 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleReturnSubmit}
                                disabled={isSubmittingReturn || !hasUnboxingVideo || !returnReason.trim()}
                                className="px-6 py-2.5 bg-rose-900 text-white rounded-xl font-bold text-sm hover:bg-rose-800 transition-all shadow-lg shadow-rose-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmittingReturn ? <Loader className="w-4 h-4 animate-spin" /> : 'Confirm Request'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Rate Purchase Modal ── */}
            {reviewModal.isOpen && reviewModal.item && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full sm:max-w-md shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {/* Header */}
                        <div className="p-6 border-b border-stone-100 flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-stone-100 overflow-hidden shrink-0">
                                <img src={reviewModal.item.image} alt={reviewModal.item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="text-xs text-stone-400 font-medium uppercase tracking-wider mb-1">Rate your purchase</p>
                                <h3 className="font-bold text-stone-900 text-sm leading-tight">{reviewModal.item.name}</h3>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-5">
                            {/* Star selector */}
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-3">Your Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewState(s => ({ ...s, rating: star }))}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${
                                                    star <= reviewState.rating
                                                        ? 'text-amber-400 fill-amber-400'
                                                        : 'text-stone-300 fill-stone-100'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                    <span className="ml-2 text-sm font-semibold text-stone-600 self-center">
                                        {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][reviewState.rating]}
                                    </span>
                                </div>
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-2">Your Review <span className="text-stone-400 font-normal">(optional)</span></label>
                                <textarea
                                    value={reviewState.comment}
                                    onChange={(e) => setReviewState(s => ({ ...s, comment: e.target.value }))}
                                    placeholder="Share your experience with this product…"
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-rose-900/10 focus:border-rose-900/30 outline-none resize-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-stone-50 border-t border-stone-100 flex justify-end gap-3">
                            <button
                                onClick={() => { setReviewModal({ isOpen: false, item: null }); setReviewState({ rating: 5, comment: '', submitting: false }); }}
                                className="px-5 py-2.5 rounded-xl font-bold text-stone-500 hover:bg-stone-100 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitReview}
                                disabled={reviewState.submitting}
                                className="px-6 py-2.5 bg-rose-900 text-white rounded-xl font-bold text-sm hover:bg-rose-800 transition-all shadow-lg shadow-rose-900/20 disabled:opacity-50 flex items-center gap-2"
                            >
                                {reviewState.submitting ? <Loader className="w-4 h-4 animate-spin" /> : null}
                                Submit Review
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetails;
