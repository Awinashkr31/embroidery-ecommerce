import React from 'react';
import { Check, Truck, Package, ShoppingBag } from 'lucide-react';
import { getTrackingStatus } from '../../utils/statusMapping';

const OrderStatusStepper = ({ currentStatus, logs = [] }) => {
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
    } else {
        activeStepIndex = 0; // Default to Placed
    }

    // Handle Cancelled State Special Case
    if (s === 'cancelled') {
        return (
            <div className="w-full py-8">
                 <div className="flex flex-col items-center justify-center text-red-600">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
                        <span className="text-xl font-bold">✕</span>
                    </div>
                    <p className="font-bold">Order Cancelled</p>
                    <p className="text-sm text-red-400">This order has been cancelled.</p>
                 </div>
            </div>
        );
    }
    
    // Helper to get logs for a specific step
    // We map logs based on their "title" derived from statusMapping
    const getStepLogs = (stepId) => {
        if (!logs || logs.length === 0) return [];
        
        return logs.filter(log => {
             const { title } = getTrackingStatus(log.status);
             const t = (title || '').toLowerCase();
             
             if (stepId === 'placed') return t.includes('placed'); // Rarely used as logs usually start after
             if (stepId === 'processing') return t.includes('confirmed') || t.includes('processed') || t.includes('picked up');
             if (stepId === 'shipped') return t.includes('shipped') || t.includes('in transit') || t.includes('arrived') || t.includes('dispatched');
             if (stepId === 'delivered') return t.includes('out for delivery') || t.includes('delivered');
             
             return false;
        }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Newest first
    };

    const steps = [
        { id: 'placed', label: 'Order Placed', icon: ShoppingBag },
        { id: 'processing', label: 'Processing', icon: Package }, 
        { id: 'shipped', label: 'Shipped', icon: Truck },
        { id: 'delivered', label: 'Delivered', icon: Check }
    ];

    return (
        <div className="w-full py-4">
            <div className="flex flex-col space-y-0">
                {steps.map((step, index) => {
                    const isCompleted = index <= activeStepIndex;
                    const isCurrent = index === activeStepIndex;
                    const isLast = index === steps.length - 1;
                    const Icon = step.icon;
                    
                    const stepLogs = getStepLogs(step.id);

                    return (
                        <div key={step.id} className="relative flex gap-6 pb-6 min-h-[100px]">
                            {/* Left Column: Icon & Line */}
                            <div className="flex flex-col items-center">
                                {/* Icon Circle */}
                                <div 
                                    className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                        isCompleted 
                                            ? 'bg-rose-900 border-rose-900 text-white shadow-md' 
                                            : 'bg-white border-stone-200 text-stone-300'
                                    }`}
                                >
                                    <Icon className="w-6 h-6" />
                                </div>
                                
                                {/* Connecting Line */}
                                {!isLast && (
                                    <div className={`w-0.5 flex-1 my-2 rounded-full ${
                                        index < activeStepIndex ? 'bg-rose-900' : 'bg-stone-200'
                                    }`}></div>
                                )}
                            </div>

                            {/* Right Column: Label & Logs */}
                            <div className="pt-2.5 flex-1">
                                <p className={`text-base font-bold uppercase tracking-wide transition-colors ${
                                    isCurrent ? 'text-rose-900' : isCompleted ? 'text-stone-800' : 'text-stone-400'
                                }`}>
                                    {step.label}
                                </p>
                                <p className="text-xs text-stone-400 mt-0.5 font-medium mb-3">
                                    {isCompleted && !isCurrent ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                                </p>

                                {/* Detailed Logs for this Step */}
                                {stepLogs.length > 0 && (
                                    <div className="space-y-4 mt-3 border-l-2 border-stone-100 pl-4 py-1">
                                        {stepLogs.map((log, i) => {
                                            const { message } = getTrackingStatus(log.status); // Clean message
                                            const dateObj = new Date(log.timestamp || log.created_at);
                                            const date = dateObj.toLocaleDateString(undefined, {
                                                month: 'short', day: 'numeric'
                                            });
                                            const time = dateObj.toLocaleTimeString(undefined, {
                                                hour: '2-digit', minute: '2-digit'
                                            });

                                            return (
                                                <div key={i} className="text-sm animate-in fade-in slide-in-from-left-2 duration-300">
                                                    <p className="text-stone-700 font-medium leading-snug">{message}</p>
                                                    <p className="text-xs text-stone-400 mt-0.5">{date}, {time}</p>
                                                    {log.awb && <p className="text-xs text-stone-500 font-mono mt-0.5">AWB: {log.awb}</p>}
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
