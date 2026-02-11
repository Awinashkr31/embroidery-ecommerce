import React from 'react';
import { Check, Truck, Package, ShoppingBag, Clock, MapPin } from 'lucide-react';
import { getTrackingStatus } from '../../utils/statusMapping';

const OrderStatusStepper = ({ currentStatus, logs = [], order }) => {
    // Normalize status to lowercase for comparison
    const s = (currentStatus || '').toLowerCase();
    
    // Determine active step index
    let activeStepIndex = 0;

    if (s.includes('delivered') || s.includes('completed')) {
        activeStepIndex = 3;
    } else if (s.includes('shipped') || s.includes('out for delivery') || s.includes('out_for_delivery')) {
        activeStepIndex = 2;
    } else if (s.includes('processing') || s.includes('confirmed') || s.includes('manifested') || s.includes('in transit') || s.includes('dispatched') || s.includes('picked up') || s.includes('order processed')) {
        activeStepIndex = 1;
    } else if (s.includes('rto') || s.includes('delivery failed') || s.includes('undelivered') || s.includes('returned')) {
        activeStepIndex = 2; // Show progress up to shipped
    } else if (s === 'cancelled') {
        return (
            <div className="w-full py-8 text-center bg-red-50 rounded-xl border border-red-100">
                 <div className="flex flex-col items-center justify-center text-red-600">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
                        <span className="text-xl font-bold">✕</span>
                    </div>
                    <p className="font-bold text-lg">Order Cancelled</p>
                    <p className="text-sm text-red-400">This order has been cancelled.</p>
                 </div>
            </div>
        );
    } else {
        activeStepIndex = 0; // Default to Placed
    }

    const steps = [
        { id: 'placed', label: 'Order Placed', icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-600' },
        { id: 'processing', label: 'Processing', icon: Package, color: 'text-stone-900', bg: 'bg-stone-100', border: 'border-stone-900' }, 
        { id: 'shipped', label: 'Shipped', icon: Truck, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-600' },
        { id: 'delivered', label: 'Delivered', icon: Check, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-600' }
    ];



    // helper to add days to a date
    const addDays = (dateString, days) => {
        if (!dateString) return null;
        const d = new Date(dateString);
        d.setDate(d.getDate() + days);
        return d;
    };

    // Helper to format dates like "February 10, 2026"
    const formatDate = (dateInput) => {
        if (!dateInput) return '';
        const d = new Date(dateInput);
        return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const formatDateTime = (dateInput) => {
        if (!dateInput) return '';
        const d = new Date(dateInput);
        return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + 
               ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    // Auto-calculate estimates if missing
    const createdDate = order.created_at ? new Date(order.created_at) : new Date();
    
    // Rule: Estimated Shipping = Created + 2 days
    const autoEstShipping = order.estimated_shipping_date 
        ? new Date(order.estimated_shipping_date) 
        : addDays(createdDate, 2);

    // Rule: Estimated Delivery = Shipping (Est or Actual) + 7 days
    // If shipped, use actual shipping time if available, or estimated.
    // We don't have exact "actual shipping date" column, but we can infer from logs or updated_at if status is shipped.
    // For now, use expected_delivery_date from DB, or calc relative to shipping.
    const shippingDateBase = order.estimated_shipping_date || autoEstShipping; 
    const autoEstDelivery = order.expected_delivery_date 
        ? new Date(order.expected_delivery_date) 
        : addDays(shippingDateBase, 7);


    // Helper to get logs for a specific step
    const getStepDetails = (stepId) => {
        // Standard Log finding
        const relevantLogs = logs.filter(log => {
             const { title } = getTrackingStatus(log.status);
             const t = (title || '').toLowerCase();
             if (stepId === 'placed') return t.includes('placed');
             if (stepId === 'processing') return t.includes('confirmed') || t.includes('processed') || t.includes('picked up') || t.includes('manifested');
             if (stepId === 'shipped') return t.includes('shipped') || t.includes('in transit') || t.includes('dispatched');
             if (stepId === 'delivered') return t.includes('delivered') || t.includes('completed');
             return false;
        }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        const latestLogDate = relevantLogs.length > 0 ? relevantLogs[0].timestamp : null;

        // --- PLACED ---
        if (stepId === 'placed') {
            return {
                customContent: (
                    <p className="text-sm text-black font-medium mt-1">
                        Confirmed on {formatDateTime(order.created_at)}
                    </p>
                )
            };
        }

        // --- PROCESSING ---
        if (stepId === 'processing') {
            // "add processing time date"
            // If active or completed, show date.
            if (activeStepIndex >= 1) {
                 const procDate = latestLogDate || order.updated_at; // Fallback
                 return {
                    customContent: (
                        <p className="text-sm text-black font-medium mt-1">
                            Processing started on {formatDate(procDate)}
                        </p>
                    )
                 };
            }
        }

        // --- SHIPPED ---
        if (stepId === 'shipped') {
             const isShipped = activeStepIndex >= 2;
             
             // If Pending (Not yet shipped) -> Show Estimated Shipping Date
             if (!isShipped) {
                 return {
                     customContent: (
                         <div className="mt-2">
                             <p className="text-sm text-stone-500 font-medium">Pending</p>
                             <p className="text-sm text-black font-bold mt-1">
                                 Estimated Shipping Date: {formatDate(autoEstShipping)}
                             </p>
                         </div>
                     )
                 };
             }

             // If Shipped (Active or Completed) -> Hide Estimated, Show Actual Shipping Date
             if (isShipped) {
                 const shipDate = latestLogDate || (order.status === 'shipped' ? order.updated_at : autoEstShipping);
                 return {
                     customContent: (
                         <div className="mt-2 space-y-1">
                             {/* Show Actual Shipping Date */}
                             <p className="text-sm text-black">
                                <span className="font-medium text-stone-500">Shipped Date:</span> <span className="font-bold">{formatDate(shipDate)}</span>
                             </p>

                             {order.courier_name && (
                                <p className="text-sm text-black">
                                    <span className="font-medium text-stone-500">Courier Partner:</span> <span className="font-bold">{order.courier_name}</span>
                                </p>
                             )}
                             {order.waybill_id && (
                                <p className="text-sm text-black">
                                    <span className="font-medium text-stone-500">Tracking ID:</span> <span className="font-mono font-bold">{order.waybill_id}</span>
                                </p>
                             )}

                             {order.tracking_url && (
                                 <div className="pt-2">
                                     <a 
                                         href={order.tracking_url} 
                                         target="_blank" 
                                         rel="noopener noreferrer"
                                         className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-lg hover:bg-stone-800 transition-colors shadow-sm"
                                     >
                                         <Truck className="w-3 h-3" /> Track Package
                                     </a>
                                 </div>
                             )}
                             
                             <p className="text-xs text-stone-400 mt-2 italic">
                                 Shipment is on the way. You can track it on the courier's website.
                             </p>
                         </div>
                     )
                 };
             }
        }

        // --- DELIVERED ---
        if (stepId === 'delivered') {
             const isDelivered = activeStepIndex === 3;
             
             if (isDelivered) {
                  return {
                     customContent: (
                        <div className="mt-2">
                             <p className="text-sm text-black font-bold">
                                Delivered on {formatDate(latestLogDate || order.updated_at)}
                             </p>
                        </div>
                     )
                 };
             }

             // If not delivered yet -> Show Estimated Delivery Date
             if (!isDelivered) {
                 return {
                     customContent: (
                        <div className="mt-2">
                             <p className="text-sm text-black">
                                <span className="font-medium text-stone-500">Estimated Delivery Date:</span> <span className="font-bold">{formatDate(autoEstDelivery)}</span>
                             </p>
                        </div>
                     )
                 };
             }
        }

        return { customContent: null };
    };

    return (
        <div className="w-full py-4 px-2">
            <div className="flex flex-col relative space-y-0">
                {steps.map((step, index) => {
                    const isCompleted = index < activeStepIndex;
                    const isCurrent = index === activeStepIndex;
                    const isPending = index > activeStepIndex;
                    const isLast = index === steps.length - 1;
                    const Icon = step.icon;
                    
                    const { customContent } = getStepDetails(step.id);
                    
                    // Color Logic
                    let circleClass = '';
                    let lineClass = '';
                    // Always Black Heading text
                    const labelColor = 'text-black';

                    if (isCompleted) {
                        // Past steps -> Green
                        circleClass = 'bg-emerald-500 border-emerald-500 text-white';
                        lineClass = 'bg-emerald-500';
                    } else if (isCurrent) {
                        // Current step -> Black
                        circleClass = 'bg-stone-900 border-stone-900 text-white shadow-lg shadow-stone-200';
                        lineClass = 'bg-stone-200'; 
                    } else {
                        // Upcoming -> Light Black (Stone-300)
                        circleClass = 'bg-white border-stone-300 text-stone-300';
                        lineClass = 'bg-stone-200';
                    }

                    return (
                        <div key={step.id} className="relative flex gap-6 pb-8 min-h-[120px]">
                            {/* Left Column: Icon & Line */}
                            <div className="flex flex-col items-center">
                                {/* Icon Circle */}
                                <div className={`relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${circleClass}`}>
                                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                
                                {/* Connecting Line */}
                                {!isLast && (
                                    <div className={`w-1 flex-1 my-2 rounded-full ${lineClass}`}></div>
                                )}
                            </div>

                            {/* Right Column: Content */}
                            <div className={`pt-1 md:pt-2 flex-1 ${isPending && step.id !== 'shipped' && step.id !== 'delivered' ? 'opacity-50 grayscale' : 'opacity-100'}`}> 
                                <div className="flex flex-col items-start">
                                    <h4 className={`text-lg font-bold uppercase tracking-wide ${labelColor} mb-1`}>
                                        {step.label}
                                    </h4>
                                    
                                    {customContent}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderStatusStepper;
