import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Package, MapPin, CreditCard, Clock, Calendar, AlertTriangle, Printer, Download, Star, Loader, HelpCircle, RotateCcw, MessageSquare, X, Ban } from 'lucide-react';
import { supabase } from '../config/supabase';
import OrderStatusStepper from '../components/orders/OrderStatusStepper';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { uploadImage } from '../utils/uploadUtils';


const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelPromptState, setCancelPromptState] = useState(false);

    // Rate Purchase modal state
    const [reviewModal, setReviewModal] = useState({ isOpen: false, item: null });
    const [reviewState, setReviewState] = useState({ rating: 5, comment: '', submitting: false });
    const [reviewImage, setReviewImage] = useState(null);
    const [reviewImagePreview, setReviewImagePreview] = useState(null);
    const reviewImageRef = useRef(null);

    const handleReviewImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setReviewImage(file);
        const reader = new FileReader();
        reader.onload = (ev) => setReviewImagePreview(ev.target.result);
        reader.readAsDataURL(file);
        if (reviewImageRef.current) reviewImageRef.current.value = '';
    };

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
                        .select('id, status, remarks, created_at')
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
                    .select('id, created_at, status, total, subtotal, discount, shipping_cost, payment_method, payment_status, customer_email, shipping_address, items')
                    .eq('id', id)
                    .single();

                if (orderError) throw orderError;

                // 2. Fetch Logs Separately (to avoid join issues)
                const { data: logsData, error: logsError } = await supabase
                    .from('order_status_logs')
                    .select('id, status, remarks, created_at')
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
            let imageUrl = null;
            if (reviewImage) {
                try {
                    imageUrl = await uploadImage(reviewImage, 'images', 'reviews');
                } catch (uploadErr) {
                    console.error('Review image upload failed:', uploadErr);
                }
            }

            const { error } = await supabase.from('reviews').insert([{
                user_id: (currentUser.uid || currentUser.id),
                user_name: currentUser.displayName || currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0],
                product_id: reviewModal.item.id || reviewModal.item.product_id,
                rating: reviewState.rating,
                comment: reviewState.comment,
                order_id: order.id,
                image_url: imageUrl,
            }]);
            if (error) throw error;
            addToast('Review submitted! Thank you.', 'success');
            setReviewModal({ isOpen: false, item: null });
            setReviewState({ rating: 5, comment: '', submitting: false });
            setReviewImage(null);
            setReviewImagePreview(null);
        } catch (err) {
            console.error('Review submit failed:', err);
            addToast('Could not submit review. Please try again.', 'error');
            setReviewState(s => ({ ...s, submitting: false }));
        }
    };

    // --- Cancel Logic ---
    const handleCancelOrder = async () => {
        if (!cancelPromptState) {
            setCancelPromptState(true);
            const isDirectCancel = ['pending', 'confirmed'].includes(order.status.toLowerCase());
            const confirmMsg = isDirectCancel
                ? 'Tap Cancel Order again to confirm cancellation.'
                : 'Tap Cancel Order again to request cancellation (admin approval needed).';
            addToast(confirmMsg, 'info');
            return;
        }

        setCancelPromptState(false);
        setIsCancelling(true);
        try {
            // Use RPC function safely
            const { data, error } = await supabase.rpc('cancel_order', { 
                p_order_id: order.id, 
                p_email: currentUser.email 
            });

            if (error) throw error;
            if (!data.success) throw new Error(data.message);
            
            // Optimistic update local state
            const newStatus = data.new_status;
            setOrder(prev => ({ ...prev, status: newStatus }));
            addToast(data.message, 'success');
        } catch (error) {
            console.error('Cancellation error:', error);
            addToast(error.message || 'Failed to cancel order', 'error');
        } finally {
            setIsCancelling(false);
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
                    remarks: `Customer Portal: User requested ${returnType}. Reason: ${returnReason}. Video Confirmed: Yes.`
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
    const isCancellable = ['pending', 'confirmed', 'processing'].includes(order.status?.toLowerCase());

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
                        <div className="card-premium overflow-hidden">
                            <div className="p-6 border-b border-stone-100 flex flex-wrap justify-between items-start gap-4">
                                <div>
                                    <h1 className="text-2xl font-heading font-bold text-stone-900 mb-1">Order #{order.id.slice(0, 6).toUpperCase()}</h1>
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
                                    {isCancellable && (
                                        <button 
                                            onClick={handleCancelOrder}
                                            disabled={isCancelling}
                                            className={`flex items-center gap-2 px-4 py-2.5 bg-white border rounded-xl font-bold text-sm transition-all shadow-sm ${
                                                cancelPromptState 
                                                ? 'border-red-500 bg-red-50 text-red-700 hover:bg-red-100' 
                                                : 'border-stone-200 text-red-600 hover:border-red-200 hover:bg-red-50/50'
                                            }`}
                                        >
                                            {isCancelling ? (
                                                <Loader className="w-4 h-4 animate-spin text-red-600" />
                                            ) : (
                                                <Ban className="w-4 h-4" />
                                            )}
                                            {cancelPromptState ? 'Confirm' : (
                                                 ['pending', 'confirmed'].includes(order.status?.toLowerCase()) ? 'Cancel Order' : 'Cancel Request'
                                            )}
                                        </button>
                                    )}
                                </div>
                                
                                <button className="flex items-center gap-2 px-4 py-2.5 text-rose-900 font-bold text-sm hover:bg-rose-50 rounded-xl transition-colors">
                                    <HelpCircle className="w-4 h-4" /> Need Help?
                                </button>
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="card-premium overflow-hidden">
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

                                            {/* Per-item Rate Button for delivered orders */}
                                            {isDelivered && (
                                                <button
                                                    onClick={() => setReviewModal({ isOpen: true, item })}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 font-bold text-xs hover:bg-amber-100 hover:border-amber-300 transition-all"
                                                >
                                                    <Star className="w-3.5 h-3.5 text-amber-500 fill-current" /> Rate this product
                                                </button>
                                            )}
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
                    <div className="glass-panel bg-white/95 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-white/60">
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
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 flex gap-3 shadow-sm shadow-amber-100/50">
                                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                                </div>
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
                                        className={`px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all duration-300 ${returnType === 'replace' ? 'bg-rose-50 border-rose-500 text-rose-700 ring-4 ring-rose-500/10 shadow-sm' : 'bg-white border-stone-100 text-stone-600 hover:border-stone-300 hover:bg-stone-50'}`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <RotateCcw className="w-4 h-4" /> Replace Item
                                        </div>
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setReturnType('return')}
                                        className={`px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all duration-300 ${returnType === 'return' ? 'bg-rose-50 border-rose-500 text-rose-700 ring-4 ring-rose-500/10 shadow-sm' : 'bg-white border-stone-100 text-stone-600 hover:border-stone-300 hover:bg-stone-50'}`}
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
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:ring-4 focus:ring-rose-900/10 focus:border-rose-900 outline-none min-h-[100px] bg-white/50 focus:bg-white transition-all shadow-sm"
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
                <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-4">
                    <div className="glass-panel bg-white/95 rounded-2xl w-full sm:max-w-md shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 border border-white/60">
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
                            {/* Emoji Rating Selector */}
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-3">How was it?</label>
                                {(() => {
                                    const ratingEmojis = [
                                        null,
                                        { emoji: '😢', label: 'Terrible', color: 'bg-red-100 border-red-300' },
                                        { emoji: '😕', label: 'Poor',     color: 'bg-orange-100 border-orange-300' },
                                        { emoji: '😐', label: 'Okay',     color: 'bg-yellow-100 border-yellow-300' },
                                        { emoji: '😊', label: 'Great',    color: 'bg-lime-100 border-lime-300' },
                                        { emoji: '🤩', label: 'Amazing!', color: 'bg-emerald-100 border-emerald-300' },
                                    ];
                                    const current = ratingEmojis[reviewState.rating];
                                    return (
                                        <div className="space-y-3">
                                            <div className="flex gap-2 justify-center">
                                                {[1, 2, 3, 4, 5].map((star) => {
                                                    const isSelected = star === reviewState.rating;
                                                    const isPast = star <= reviewState.rating;
                                                    return (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => setReviewState(s => ({ ...s, rating: star }))}
                                                            className={`relative flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all duration-200 ${
                                                                isSelected
                                                                    ? `${ratingEmojis[star].color} scale-110 shadow-md`
                                                                    : isPast
                                                                        ? 'border-stone-200 bg-stone-50'
                                                                        : 'border-stone-100 bg-white hover:border-stone-200 hover:bg-stone-50'
                                                            }`}
                                                        >
                                                            <span className={`text-2xl transition-all duration-200 ${isSelected ? 'scale-125' : 'grayscale opacity-50'}`}>
                                                                {ratingEmojis[star].emoji}
                                                            </span>
                                                            <span className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? 'text-stone-700' : 'text-stone-400'}`}>
                                                                {star}★
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <p className="text-center text-sm font-bold text-stone-600">
                                                <span className="text-lg mr-1">{current.emoji}</span> {current.label}
                                            </p>
                                        </div>
                                    );
                                })()}
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

                            {/* Photo Upload — Optional */}
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-2">Add a photo <span className="text-stone-400 font-normal">(optional)</span></label>
                                {reviewImagePreview ? (
                                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-stone-200 group">
                                        <img src={reviewImagePreview} alt="Review" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => { setReviewImage(null); setReviewImagePreview(null); }}
                                            className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => reviewImageRef.current?.click()}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-stone-200 text-stone-500 text-sm font-medium hover:border-rose-300 hover:text-rose-700 hover:bg-rose-50/50 transition-all"
                                    >
                                        📷 Upload photo
                                    </button>
                                )}
                                <input ref={reviewImageRef} type="file" accept="image/*" onChange={handleReviewImageSelect} className="hidden" />
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
