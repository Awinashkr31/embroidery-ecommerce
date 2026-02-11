import React from 'react';
import { Check, Truck, Package, ShoppingBag, Clock, MapPin } from 'lucide-react';
import { getTrackingStatus } from '../../utils/statusMapping';

const OrderStatusStepper = ({ currentStatus, logs = [], order }) => {
    // Normalize status to lowercase for comparison
    const s = (currentStatus || '').toLowerCase();
    
    // Determine active step index
    let activeStepIndex = 0;
    let isError = false;

    if (s.includes('delivered') || s.includes('completed')) {
        activeStepIndex = 3;
    } else if (s.includes('shipped') || s.includes('out for delivery') || s.includes('out_for_delivery')) {
        activeStepIndex = 2;
    } else if (s.includes('processing') || s.includes('confirmed') || s.includes('manifested') || s.includes('in transit') || s.includes('dispatched') || s.includes('picked up') || s.includes('order processed')) {
        activeStepIndex = 1;
    } else if (s.includes('rto') || s.includes('delivery failed') || s.includes('undelivered') || s.includes('returned')) {
        activeStepIndex = 2; // Show progress up to shipped, but mark error
        isError = true;
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
        { id: 'placed', label: 'Order Placed', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-600' },
        { id: 'processing', label: 'Processing', icon: Package, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-600' }, 
        { id: 'shipped', label: 'Shipped', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-600' },
        { id: 'delivered', label: 'Delivered', icon: Check, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-600' }
    ];

    // Helper to get logs for a specific step
    const getStepDetails = (stepId) => {
        // Special case: "Shipped" step should show Courier Info if available
        if (stepId === 'shipped' && (activeStepIndex >= 2)) {
             // If we are at shipped or delivered, show courier info
             // But only if we actually have it
             if (order?.waybill_id) {
                 return {
                     showCourier: true,
                     courier: order.courier_name || 'Delhivery',
                     trackingId: order.waybill_id,
                     trackingUrl: order.tracking_url
                 };
             }
        }

        // Standard Log mapping
        const relevantLogs = logs.filter(log => {
             const { title } = getTrackingStatus(log.status);
             const t = (title || '').toLowerCase();
             
             if (stepId === 'placed') return t.includes('placed');
             if (stepId === 'processing') return t.includes('confirmed') || t.includes('processed') || t.includes('picked up') || t.includes('manifested');
             if (stepId === 'shipped') return t.includes('shipped') || t.includes('in transit') || t.includes('arrived') || t.includes('dispatched');
             if (stepId === 'delivered') return t.includes('out for delivery') || t.includes('delivered') || t.includes('completed');
             return false;
        }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        return { relevantLogs };
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
                    
                    const { relevantLogs, showCourier, courier, trackingId, trackingUrl } = getStepDetails(step.id, isCurrent);
                    
                    // Determine Status Color Logic
                    let statusColorClass = isPending ? 'text-stone-300' : 'text-stone-800'; // Default text
                    let circleClass = '';
                    let lineClass = '';
                    
                    if (isCompleted) {
                        circleClass = 'bg-emerald-500 border-emerald-500 text-white';
                        lineClass = 'bg-emerald-500';
                    } else if (isCurrent) {
                        circleClass = 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200';
                        statusColorClass = 'text-blue-700';
                        lineClass = 'bg-stone-200'; // Upcoming line is grey
                    } else {
                        circleClass = 'bg-white border-stone-200 text-stone-300';
                        lineClass = 'bg-stone-200';
                    }

                    // Override for error state
                    if (isError && index === activeStepIndex) {
                         circleClass = 'bg-red-500 border-red-500 text-white';
                         statusColorClass = 'text-red-700';
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
                            <div className={`pt-1 md:pt-2 flex-1 ${isPending ? 'opacity-50 grayscale' : 'opacity-100'}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className={`text-lg font-bold uppercase tracking-wide ${statusColorClass} mb-1`}>
                                            {step.label}
                                        </h4>
                                        <p className="text-sm font-medium text-stone-500">
                                            {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                                        </p>
                                    </div>
                                    
                                    {/* Timestamp for the LATEST log in this step (if any) */}
                                    {relevantLogs && relevantLogs.length > 0 && (
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-bold text-stone-800">
                                                {new Date(relevantLogs[0].timestamp).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                            <p className="text-xs text-stone-500">
                                                {new Date(relevantLogs[0].timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Custom Content for Shipped Step (Courier Info) */}
                                {showCourier && (
                                    <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-100 max-w-md animate-in slide-in-from-left-2">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <p className="text-xs font-bold text-purple-900 uppercase tracking-wider mb-1">Courier Partner</p>
                                                <p className="text-sm font-bold text-stone-800 flex items-center gap-2">
                                                    <Truck className="w-4 h-4 text-purple-600" /> {courier}
                                                </p>
                                                
                                                <div className="mt-3">
                                                    <p className="text-xs font-bold text-purple-900 uppercase tracking-wider mb-1">Tracking ID</p>
                                                    <p className="text-sm font-mono bg-white px-2 py-1 rounded border border-purple-200 inline-block text-purple-700">
                                                        {trackingId}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {trackingUrl && (
                                                <a 
                                                    href={trackingUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition-colors shadow-sm whitespace-nowrap"
                                                >
                                                    Track Package
                                                </a>
                                            )}
                                        </div>
                                        {order?.expected_delivery && (
                                            <div className="mt-3 pt-3 border-t border-purple-100 flex items-center gap-2 text-xs text-purple-800 font-medium">
                                                <Clock className="w-3.5 h-3.5" />
                                                Expected Delivery: {new Date(order.expected_delivery).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Logs List */}
                                {relevantLogs && relevantLogs.length > 0 && (
                                    <div className="mt-4 space-y-4">
                                        {relevantLogs.map((log, i) => {
                                            const { message } = getTrackingStatus(log.status);
                                            return (
                                                <div key={i} className="flex gap-3 items-start p-3 bg-stone-50 rounded-lg border border-stone-100">
                                                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${i === 0 && isCurrent ? 'bg-blue-500 animate-pulse' : 'bg-stone-300'}`}></div>
                                                    <div>
                                                        <p className="text-sm font-medium text-stone-800">{message}</p>
                                                        {/* Mobile Timestamp */}
                                                        <p className="text-xs text-stone-400 mt-1 sm:hidden">
                                                            {new Date(log.timestamp).toLocaleString(undefined, {
                                                                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                            })}
                                                        </p>
                                                        {log.location && (
                                                            <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                                                                <MapPin className="w-3 h-3" /> {log.location}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderStatusStepper;
