import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Package, MapPin, CreditCard, Clock, Calendar, AlertTriangle, Printer, Download, Star, Loader } from 'lucide-react';
import { supabase } from '../config/supabase';
import OrderStatusStepper from '../components/orders/OrderStatusStepper';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getEstimatedDeliveryDate } from '../utils/dateUtils';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);

    useEffect(() => {
        if (!id) return;

        // Subscribe to Realtime Updates
        const channel = supabase
            .channel(`order-tracking-${id}`)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${id}` },
                (payload) => {
                    console.log('Order updated:', payload);
                    setOrder(prev => ({ ...prev, ...payload.new }));
                }
            )
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'order_status_logs', filter: `order_id=eq.${id}` },
                async () => {
                    console.log('New tracking log received');
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

                setOrder(fullOrder);
            } catch (error) {
                console.error('Error fetching order:', error);
                console.error('Failed ID:', id);
                addToast(`Error: ${error.message || 'Order not found'}`, 'error');
                // navigate('/profile'); // Comment out navigate to parse error
            } finally {
                setLoading(false);
            }
        };

        if (currentUser && id) {
            fetchOrderDetails();
        }
    }, [currentUser, id, addToast, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
                <Loader className="w-8 h-8 text-rose-900 animate-spin" />
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="min-h-screen bg-[#fdfbf7] pt-28 pb-12 font-body">
            <div className="container-custom max-w-5xl">
                {/* Back Link */}
                <Link to="/profile" className="inline-flex items-center text-stone-500 hover:text-rose-900 mb-6 font-medium transition-colors">
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
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-stone-600 font-bold text-sm hover:bg-stone-50 transition-colors">
                                        <Printer className="w-4 h-4" /> Invoice
                                    </button>
                                </div>
                            </div>
                            
                            {/* Stepper with integrated logs */}
                            <div className="px-6 py-8 bg-stone-50/30 border-b border-stone-100">
                                <OrderStatusStepper currentStatus={order.status} logs={order.order_status_logs} />
                            </div>

                            {/* Tracking Info Block */}
                            {order.waybill_id && (
                                <div className="px-6 py-4 bg-purple-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                            <Package className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-purple-900 uppercase tracking-wide">Shipped via {order.courier_name || 'Delhivery'}</p>
                                            <p className="text-sm font-medium text-purple-700">Tracking ID: {order.waybill_id}</p>
                                        </div>
                                    </div>
                                    {order.tracking_url && (
                                        <a 
                                            href={order.tracking_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-white border border-purple-200 text-purple-700 font-bold text-sm rounded-lg hover:bg-purple-50 transition-colors shadow-sm"
                                        >
                                            Track Shipment
                                        </a>
                                    )}
                                </div>
                            )}
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
                                
                                {/* Estimated Delivery (Keep this as extra helpful info?) user didn't explicitly forbid it, but image doesn't have it. I'll keep it subtle or remove? Image is strict "like this". I'll keep it separate or remove to be safe. Let's keep it but maybe below/separate. */}
                                <div className="flex justify-between text-stone-500 text-xs border-t border-stone-100 pt-3 mt-2">
                                    <span>Estimated Delivery:</span>
                                    <span className="font-bold">{getEstimatedDeliveryDate()}</span>
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
        </div>
    );
};

export default OrderDetails;
