import React, { useState, useEffect } from 'react';
import { Truck, ArrowRight, Package, Info } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { DelhiveryService } from '../../services/delhivery';

const ShipmentCreator = ({ selectedOrder, onShipmentCreated }) => {
    const [activeTab, setActiveTab] = useState('delhivery');
    
    // --- Delhivery State ---
    const [shippingRates, setShippingRates] = useState(null);
    const [checkingRates, setCheckingRates] = useState(false);
    const [generatingLabel, setGeneratingLabel] = useState(false);
    const [paymentMode, setPaymentMode] = useState('prepaid'); // Default, will sync with order

    // --- Manual State ---
    const [manualCourier, setManualCourier] = useState('DTDC');
    const [manualAWB, setManualAWB] = useState('');
    const [manualLink, setManualLink] = useState('');
    const [manualLoading, setManualLoading] = useState(false);

    const courierOptions = ['DTDC', 'Bluedart', 'Speed Post', 'XpressBees', 'Shadowfax', 'Ecom Express', 'Other'];

    // --- Delhivery Logic ---
    useEffect(() => {
        // Reset rates and sync payment mode when order changes
        setShippingRates(null);
        if (selectedOrder) {
            setPaymentMode(selectedOrder.paymentMethod === 'cod' ? 'cod' : 'prepaid');
        }
    }, [selectedOrder.id]);

    const handleCheckRates = async () => {
        if (!selectedOrder) return;
        setCheckingRates(true);
        setShippingRates(null);

        try {
            const weight = 500; // Default 500g
            const params = {
                weight: weight,
                origin_pin: "110001", 
                dest_pin: selectedOrder.customer.zipCode,
                mode: "S",
                payment_type: paymentMode,
                amount: selectedOrder.total
            };

            const rates = await DelhiveryService.calculateShipping(params);
            setShippingRates({ ...rates, weight_used: weight });
        } catch (err) {
            console.error("Rate Check Error:", err);
            alert(`Failed to check rates: ${err.message}`);
        } finally {
            setCheckingRates(false);
        }
    };

    const handleGenerateWaybill = async () => {
        if (!selectedOrder) return;
        setGeneratingLabel(true);

        try {
            const orderDetails = {
                customerName: `${selectedOrder.customer.firstName} ${selectedOrder.customer.lastName}`,
                address: selectedOrder.customer.address,
                pincode: selectedOrder.customer.zipCode,
                city: selectedOrder.customer.city,
                state: selectedOrder.customer.state,
                phone: selectedOrder.customer.phone,
                orderId: selectedOrder.id,
                paymentMethod: paymentMode,
                amount: selectedOrder.total,
                items: selectedOrder.items,
                mode: 'S'
            };

            const response = await DelhiveryService.createOrder(orderDetails);
            
            if (response && response.packages && response.packages.length > 0) {
                const packageData = response.packages[0];
                const waybill = packageData.waybill;

                if (packageData.status === 'Fail') {
                    const remarks = packageData.remarks || "Unknown Error";
                    if (remarks.toLowerCase().includes('balance')) {
                        throw new Error(`Insufficient Delhivery Wallet Balance. Please recharge your account.\nDetails: ${remarks}`);
                    }
                    throw new Error(remarks);
                }

                if (!waybill) throw new Error(`Waybill not generated. Remarks: ${packageData.remarks || 'None'}`);

                // Update Supabase
                const updates = { 
                    waybill_id: waybill,
                    tracking_url: `https://www.delhivery.com/track/package/${waybill}`,
                    courier_name: 'Delhivery',
                    status: 'shipped',
                    estimated_shipping_cost: shippingRates?.total_amount || 0,
                    final_shipping_cost: 0,
                    charged_weight: shippingRates?.weight_used || 500,
                    pricing_checked_at: new Date().toISOString()
                };

                const { error } = await supabase
                    .from('orders')
                    .update(updates)
                    .eq('id', selectedOrder.id);

                if (error) throw error;

                // Notify User
                await supabase.from('notifications').insert([{
                    user_email: selectedOrder.customer.email,
                    title: 'Order Shipped!',
                    message: `Your order #${selectedOrder.id.slice(0,8)} has been shipped via Delhivery. Tracking Number: ${waybill}`,
                    type: 'success',
                    is_read: false
                }]);

                onShipmentCreated(updates);
                alert(`Shipment Created Successfully! Waybill: ${waybill}`);

            } else {
                 throw new Error(response?.error || "Unknown error from Delhivery");
            }

        } catch (err) {
            console.error("Generate Waybill Error:", err);
            alert(`Failed to generate Waybill: ${err.message}`);
        } finally {
            setGeneratingLabel(false);
        }
    };

    // --- Manual Logic ---
    const handleManualShipment = async () => {
        if (!manualAWB) {
            alert("Please enter a Tracking Number / AWB");
            return;
        }

        setManualLoading(true);
        try {
            const updates = { 
                waybill_id: manualAWB,
                tracking_url: manualLink || '', // Optional
                courier_name: manualCourier,
                status: 'shipped',
                estimated_shipping_cost: 0, // Unknown
            };

            const { error } = await supabase
                .from('orders')
                .update(updates)
                .eq('id', selectedOrder.id);

            if (error) throw error;

            // Log activity (Existing updateOrderStatus logs this, but we are doing direct update here. 
            // Ideally we should use the parent's update function, but direct is fine if we add log manually)
            await supabase.from('order_status_logs').insert([{
                order_id: selectedOrder.id,
                status: 'shipped', 
                timestamp: new Date().toISOString(),
                message: `Shipped via ${manualCourier}`,
                description: `Manual update. Tracking: ${manualAWB}` 
            }]);

            // Notify User
            if (selectedOrder.customer?.email) {
                await supabase.from('notifications').insert([{
                    user_email: selectedOrder.customer.email,
                    title: 'Order Shipped!',
                    message: `Your order #${selectedOrder.id.slice(0,8)} has been shipped via ${manualCourier}. Tracking Number: ${manualAWB}`,
                    type: 'success',
                    is_read: false
                }]);
            }

            onShipmentCreated(updates);
            alert("Order marked as Shipped!");

        } catch (err) {
            console.error("Manual Update Error:", err);
            alert(`Failed to update order: ${err.message}`);
        } finally {
            setManualLoading(false);
        }
    };

    return (
        <div className="bg-stone-50 rounded-xl border border-stone-200 shadow-sm overflow-hidden">
             {/* Header / Tabs */}
             <div className="flex border-b border-stone-200 bg-stone-100/50">
                 <button 
                    onClick={() => setActiveTab('delhivery')}
                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                        activeTab === 'delhivery' ? 'bg-white text-stone-900 border-r border-stone-200 shadow-sm' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-700'
                    }`}
                >
                     <Truck className="w-4 h-4" /> Integrated (Delhivery)
                 </button>
                 <button 
                    onClick={() => setActiveTab('manual')}
                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                        activeTab === 'manual' ? 'bg-white text-stone-900 border-l border-stone-200 shadow-sm' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-700'
                    }`}
                >
                     <Package className="w-4 h-4" /> Manual / Other
                 </button>
             </div>

             <div className="p-4">
                 {activeTab === 'delhivery' ? (
                     <div className="space-y-4">
                         {/* Payment Mode Selector */}
                         <div className="flex bg-white rounded-lg border border-stone-200 p-1">
                            <button
                                onClick={() => setPaymentMode('prepaid')}
                                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                                    paymentMode === 'prepaid' 
                                    ? 'bg-stone-900 text-white shadow-sm' 
                                    : 'text-stone-500 hover:bg-stone-50'
                                }`}
                            >
                                Prepaid
                            </button>
                            <button
                                onClick={() => setPaymentMode('cod')}
                                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                                    paymentMode === 'cod' 
                                    ? 'bg-stone-900 text-white shadow-sm' 
                                    : 'text-stone-500 hover:bg-stone-50'
                                }`}
                            >
                                Cash on Delivery (COD)
                            </button>
                         </div>

                         {/* Rate Check Section */}
                        <div className="bg-white rounded-lg border border-stone-200 p-3">
                            {!shippingRates ? (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-stone-600">Check rates before shipping</span>
                                    <button
                                        onClick={handleCheckRates}
                                        disabled={checkingRates}
                                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg transition-colors border border-stone-200"
                                    >
                                        {checkingRates ? 'Checking...' : 'Calculate Request'}
                                    </button>
                                </div>
                            ) : (
                                <div className="text-xs text-stone-600 space-y-1">
                                    <div className="flex justify-between">
                                        <span>Freight:</span>
                                        <span>₹{shippingRates.freight || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>GST:</span>
                                        <span>₹{shippingRates.tax || shippingRates.gst || 0}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-stone-900 border-t border-stone-100 pt-1 mt-1">
                                        <span>Total Est. Cost:</span>
                                        <span>₹{shippingRates.total_amount || 0}</span>
                                    </div>
                                     <div className="flex justify-end mt-2">
                                        <button
                                            onClick={handleCheckRates}
                                            disabled={checkingRates}
                                            className="text-[10px] text-blue-500 hover:underline"
                                        >
                                            Re-calculate
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleGenerateWaybill}
                            disabled={generatingLabel}
                            className={`w-full py-3 rounded-lg font-bold text-sm tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 ${
                                generatingLabel 
                                ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                                : 'bg-stone-900 text-white hover:bg-stone-700'
                            }`}
                        >
                            {generatingLabel ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-stone-400 border-t-transparent rounded-full animate-spin"></span>
                                    Generating Label...
                                </>
                            ) : (
                                <>
                                    Create Shipment
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                     </div>
                 ) : (
                     <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                         {/* Manual Form */}
                         <div>
                             <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Courier Provider</label>
                             <select 
                                value={manualCourier}
                                onChange={(e) => setManualCourier(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-stone-200 focus:border-stone-400 outline-none transition-all"
                             >
                                 {courierOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                             </select>
                         </div>
                         
                         <div>
                             <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Tracking Number / AWB</label>
                             <input 
                                type="text"
                                placeholder="e.g. 123456789"
                                value={manualAWB}
                                onChange={(e) => setManualAWB(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-stone-200 focus:border-stone-400 outline-none transition-all"
                             />
                         </div>

                         <div>
                             <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Tracking Link (Optional)</label>
                             <input 
                                type="url"
                                placeholder="https://..."
                                value={manualLink}
                                onChange={(e) => setManualLink(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-stone-200 focus:border-stone-400 outline-none transition-all"
                             />
                         </div>

                         <div className="pt-2">
                            <button
                                onClick={handleManualShipment}
                                disabled={manualLoading || !manualAWB}
                                className={`w-full py-3 rounded-lg font-bold text-sm tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 ${
                                    (manualLoading || !manualAWB)
                                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                                    : 'bg-stone-900 text-white hover:bg-stone-700'
                                }`}
                            >
                                {manualLoading ? 'Updating...' : 'Mark as Shipped'}
                            </button>
                         </div>
                     </div>
                 )}
             </div>
        </div>
    );
};

export default ShipmentCreator;
