import React, { useState } from 'react';
import { Truck, Search, MapPin, CheckCircle, Package, ArrowRight, AlertTriangle, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { supabase } from '../config/supabase';
import { DelhiveryService } from '../services/delhivery';
import { XpressbeesService } from '../services/xpressbees';

const TrackOrder = () => {
    const [trackingInput, setTrackingInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [trackingData, setTrackingData] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!trackingInput.trim()) return;

        setLoading(true);
        setError('');
        setTrackingData(null);

        try {
            let waybill = trackingInput.trim();
            let courierName = 'Delhivery'; // Default assumption unless we find it in DB

            // 1. Check if input is an Order ID in Supabase
            // Our Order IDs are usually UUIDs or start with something specific. Let's just query to see if it matches.
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .select('waybill_id, courier_name')
                .eq('id', trackingInput.trim())
                .maybeSingle();

            if (!orderError && orderData && orderData.waybill_id) {
                waybill = orderData.waybill_id;
                courierName = orderData.courier_name || 'Delhivery';
            }

            // 2. Fetch tracking details
            let result;
            if (courierName === 'Delhivery') {
                result = await DelhiveryService.trackShipment(waybill);
                if (result && result.ShipmentData && result.ShipmentData.length > 0) {
                    const shipment = result.ShipmentData[0].Shipment;
                    const scans = shipment.Scans || [];
                    
                    setTrackingData({
                        waybill: shipment.AWB,
                        status: shipment.Status?.Status || 'Unknown',
                        statusDateTime: shipment.Status?.StatusDateTime || '',
                        expectedDate: shipment.ExpectedDeliveryDate || null,
                        destination: shipment.Destination || '',
                        origin: shipment.Origin || '',
                        courier: 'Delhivery',
                        scans: scans.map(scan => ({
                            date: scan.ScanData.ScanDateTime,
                            location: scan.ScanData.ScannedLocation,
                            status: scan.ScanData.ScanType,
                            instructions: scan.ScanData.Instructions
                        })).sort((a, b) => new Date(b.date) - new Date(a.date))
                    });
                } else {
                    throw new Error("No tracking details found for this ID.");
                }
            } else {
                // Future fallback for Xpressbees or others
                throw new Error("Tracking directly via web is currently supported for Delhivery only.");
            }

        } catch (err) {
            console.error(err);
            setError(err.message || 'Could not find tracking information.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusStep = (statusStr) => {
        const s = statusStr.toLowerCase();
        if (s.includes('delivered')) return 4;
        if (s.includes('out for delivery')) return 3;
        if (s.includes('transit') || s.includes('dispatched')) return 2;
        if (s.includes('manifest') || s.includes('picked') || s.includes('booked')) return 1;
        return 0; // Pending
    };

    return (
        <div className="min-h-[70vh] bg-[#fdfbf7] font-body pt-8 md:pt-16 pb-20">
            <SEO title="Track Your Order" description="Track the real-time status of your Crochet Wali order." />
            
            <div className="container-custom max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-rose-100">
                        <MapPin className="w-8 h-8 text-rose-900" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-stone-900 mb-4">Track Your Order</h1>
                    <p className="text-stone-600 max-w-md mx-auto">Enter your Order ID or AWB Tracking Number to get real-time updates on your shipment.</p>
                </div>

                <div className="card-premium p-6 md:p-10 mb-8 max-w-2xl mx-auto">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                        <input 
                            type="text" 
                            placeholder="e.g., e0a7c4... or 123456789" 
                            className="flex-1 px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:border-rose-900 focus:ring-4 focus:ring-rose-900/10 outline-none transition-all font-medium"
                            value={trackingInput}
                            onChange={(e) => setTrackingInput(e.target.value)}
                        />
                        <button 
                            type="submit"
                            disabled={loading}
                            className="px-8 py-4 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 uppercase tracking-widest text-sm"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <>Track <Search className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm font-medium border border-red-100">
                            <AlertTriangle className="w-4 h-4" /> {error}
                        </div>
                    )}
                </div>

                {trackingData && (
                    <div className="card-premium p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-stone-100">
                            <div>
                                <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Waybill Number</p>
                                <p className="text-xl md:text-2xl font-heading font-bold text-stone-900">{trackingData.waybill}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-2.5 py-1 bg-stone-100 text-stone-700 text-[10px] font-bold rounded uppercase tracking-wider">
                                        Courier: {trackingData.courier}
                                    </span>
                                </div>
                            </div>
                            <div className="md:text-right">
                                <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Current Status</p>
                                <p className="text-lg font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg inline-block border border-emerald-100">{trackingData.status}</p>
                                {trackingData.expectedDate && (
                                    <p className="text-sm font-medium text-stone-600 mt-2">Expected Delivery: {new Date(trackingData.expectedDate).toLocaleDateString('en-IN', { dateStyle: 'medium'})}</p>
                                )}
                            </div>
                        </div>

                        {/* Progress Bar (Visualizer) */}
                        <div className="mb-12 overflow-hidden px-4">
                            <div className="relative">
                                <div className="absolute top-1/2 left-0 right-0 h-1 bg-stone-100 -translate-y-1/2 rounded-full z-0"></div>
                                <div 
                                    className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 rounded-full z-0 transition-all duration-1000 ease-out" 
                                    style={{ width: `${(getStatusStep(trackingData.status) / 4) * 100}%` }}
                                ></div>
                                
                                <div className="relative z-10 flex justify-between">
                                    {[
                                        { label: 'Booked', icon: Package, step: 1 },
                                        { label: 'Shipped', icon: Truck, step: 2 },
                                        { label: 'Out for Delivery', icon: MapPin, step: 3 },
                                        { label: 'Delivered', icon: CheckCircle, step: 4 }
                                    ].map((milestone) => {
                                        const isCompleted = getStatusStep(trackingData.status) >= milestone.step;
                                        const isCurrent = getStatusStep(trackingData.status) === milestone.step;
                                        const Icon = milestone.icon;

                                        return (
                                            <div key={milestone.label} className="flex flex-col items-center">
                                                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-500 border-4 ${
                                                    isCompleted 
                                                    ? 'bg-emerald-500 border-emerald-100 text-white' 
                                                    : 'bg-white border-stone-100 text-stone-300'
                                                } ${isCurrent ? 'ring-4 ring-emerald-500/20 scale-110' : ''}`}>
                                                    <Icon className="w-4 h-4 md:w-6 md:h-6" />
                                                </div>
                                                <p className={`mt-3 text-[10px] md:text-xs font-bold uppercase tracking-widest text-center ${isCompleted ? 'text-stone-900' : 'text-stone-400'}`}>
                                                    {milestone.label}
                                                </p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-stone-50 rounded-2xl p-6 md:p-8 border border-stone-200/60">
                            <h3 className="font-heading font-bold text-stone-900 mb-6 text-lg">Tracking History</h3>
                            <div className="space-y-6">
                                {trackingData.scans.length === 0 && (
                                    <p className="text-stone-500 text-sm">No detailed scans available yet. Please check back later.</p>
                                )}
                                {trackingData.scans.map((scan, idx) => (
                                    <div key={idx} className="relative pl-6 pb-6 last:pb-0 group">
                                        {idx !== trackingData.scans.length - 1 && (
                                            <div className="absolute left-2 top-3 bottom-0 w-0.5 bg-stone-200 group-hover:bg-rose-200 transition-colors"></div>
                                        )}
                                        <div className="absolute left-0.5 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-stone-300 group-hover:border-rose-900 transition-colors z-10"></div>
                                        
                                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                                            <p className="text-xs font-bold text-stone-400 w-32 shrink-0">
                                                {new Date(scan.date).toLocaleString('en-IN', { 
                                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                                                })}
                                            </p>
                                            <div>
                                                <p className="font-bold text-stone-900 text-sm mb-0.5">{scan.status}</p>
                                                <p className="text-xs text-stone-600">{scan.location}</p>
                                                {scan.instructions && (
                                                    <p className="text-xs text-stone-500 mt-1 italic">{scan.instructions}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;
