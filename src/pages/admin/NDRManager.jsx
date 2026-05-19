import React, { useState, useEffect } from 'react';
import { Package, Search, RotateCcw, CheckCircle, XCircle, AlertTriangle, Truck } from 'lucide-react';
import { supabase } from '../../../config/supabase';
import { useToast } from '../../context/ToastContext';
import { useAdmin } from '../../context/AdminContext';
import { DelhiveryService } from '../../services/delhivery';

const NDRManager = () => {
    const { orders: contextOrders, loading: contextLoading } = useAdmin();
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Requests'); // Requests, Approved, Rejected
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const { addToast } = useToast();

    useEffect(() => {
        if (contextLoading) {
            setLoading(true);
            return;
        }

        // Map and filter for NDR/Return relevant statuses
        const ndrStatuses = ['return_requested', 'replacement_requested', 'return_approved', 'return_rejected', 'rto', 'ndr'];
        
        const mappedOrders = contextOrders
            .filter(o => ndrStatuses.includes((o.status || '').toLowerCase()))
            .map(o => {
                const nameParts = (o.customer_name || 'Unknown User').split(' ');
                const firstName = nameParts[0];
                const lastName = nameParts.slice(1).join(' ');

                return {
                    id: o.id,
                    date: o.created_at,
                    status: o.status || 'return_requested',
                    total: o.total || o.total_amount || 0,
                    items: o.items || [],
                    customer: {
                        firstName,
                        lastName,
                        email: o.customer_email,
                        phone: o.customer_phone,
                        address: o.shipping_address?.address,
                        city: o.shipping_address?.city,
                        state: o.shipping_address?.state,
                        zipCode: o.shipping_address?.zipCode,
                    },
                    paymentStatus: o.payment_status || 'pending',
                    paymentMethod: o.payment_method || 'cod',
                    waybillId: o.waybill_id,
                    returnWaybillId: o.return_waybill_id // hypothetical field for return AWB
                };
            });

        setOrders(mappedOrders);
        setLoading(false);
    }, [contextOrders, contextLoading]);

    const filteredOrders = orders.filter(order => {
        const term = searchTerm.toLowerCase();
        const matchesSearch = order.id.toLowerCase().includes(term) || 
                              order.customer.firstName.toLowerCase().includes(term) ||
                              order.customer.lastName.toLowerCase().includes(term);

        let matchesTab = false;
        const status = order.status.toLowerCase();
        if (activeTab === 'Requests') {
            matchesTab = status === 'return_requested' || status === 'replacement_requested';
        } else if (activeTab === 'Approved') {
            matchesTab = status === 'return_approved';
        } else if (activeTab === 'Rejected') {
            matchesTab = status === 'return_rejected';
        } else if (activeTab === 'NDR/RTO') {
            matchesTab = status === 'ndr' || status === 'rto';
        }

        return matchesSearch && matchesTab;
    });

    const handleApproveReturn = async (order) => {
        if (!window.confirm('Approve return and generate reverse pickup?')) return;
        setProcessingId(order.id);

        try {
            // 1. Generate Reverse Pickup with Delhivery
            let returnWaybill = '';
            try {
                const returnDetails = {
                    customerName: `${order.customer.firstName} ${order.customer.lastName}`,
                    address: order.customer.address,
                    pincode: order.customer.zipCode,
                    city: order.customer.city,
                    state: order.customer.state,
                    phone: order.customer.phone,
                    orderId: order.id,
                    amount: order.total,
                    items: order.items
                };

                const res = await DelhiveryService.createReturn(returnDetails);
                if (res?.packages?.[0]?.waybill) {
                    returnWaybill = res.packages[0].waybill;
                    addToast(`Reverse Pickup Generated: ${returnWaybill}`, 'success');
                }
            } catch (apiErr) {
                console.error("Reverse pickup generation failed (continuing approval locally):", apiErr);
                addToast("Could not generate reverse pickup automatically. Please do it manually in Delhivery.", 'warning');
            }

            // 2. Update Supabase
            const { error } = await supabase
                .from('orders')
                .update({ 
                    status: 'return_approved',
                    return_waybill_id: returnWaybill 
                })
                .eq('id', order.id);

            if (error) throw error;

            // 3. Log it
            await supabase.from('order_status_logs').insert([{
                order_id: order.id,
                status: 'return_approved',
                timestamp: new Date().toISOString(),
                remarks: `Return approved by Admin. ${returnWaybill ? `Reverse AWB: ${returnWaybill}` : 'No auto AWB generated.'}`
            }]);

            // Optimistic update
            setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'return_approved', returnWaybillId: returnWaybill } : o));
            addToast('Return Approved successfully.', 'success');

        } catch (err) {
            console.error('Error approving return:', err);
            addToast('Failed to approve return.', 'error');
        } finally {
            setProcessingId(null);
        }
    };

    const handleRejectReturn = async (orderId) => {
        if (!window.confirm('Are you sure you want to reject this return request?')) return;
        setProcessingId(orderId);

        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: 'return_rejected' })
                .eq('id', orderId);

            if (error) throw error;

            await supabase.from('order_status_logs').insert([{
                order_id: orderId,
                status: 'return_rejected',
                timestamp: new Date().toISOString(),
                remarks: 'Return rejected by Admin.'
            }]);

            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'return_rejected' } : o));
            addToast('Return request rejected.', 'info');
        } catch (err) {
            console.error('Error rejecting return:', err);
            addToast('Failed to reject return.', 'error');
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusColor = (status) => {
        const s = (status || '').toLowerCase();
        if (s.includes('requested')) return 'bg-amber-100 text-amber-700 border-amber-200';
        if (s.includes('approved')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        if (s.includes('rejected')) return 'bg-red-100 text-red-700 border-red-200';
        return 'bg-stone-100 text-stone-700 border-stone-200';
    };

    return (
        <div className="font-body space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-stone-900">Returns & NDR</h1>
                    <p className="text-stone-500 text-sm mt-0.5">Manage reverse pickups and non-delivery reports</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="grid md:grid-cols-[2fr_3fr] gap-4">
                <div className="bg-white p-2 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-0 flex gap-2 overflow-x-auto">
                    {['Requests', 'Approved', 'Rejected', 'NDR/RTO'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                                activeTab === tab 
                                ? 'bg-rose-900 text-white shadow-md' 
                                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="bg-white p-2 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-0">
                     <div className="relative h-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by Order ID or Customer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 h-full rounded-lg bg-stone-50 border-none focus:ring-2 focus:ring-rose-900/20 font-medium transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-stone-50 border-b border-stone-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Order</th>
                                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-stone-500">Loading...</td></tr>
                            ) : filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-mono font-bold text-stone-900">#{order.id.slice(0,8)}</span>
                                            <div className="text-xs text-stone-400 mt-0.5">{new Date(order.date).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-stone-900">{order.customer.firstName} {order.customer.lastName}</p>
                                            <p className="text-xs text-stone-400">{order.customer.phone}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-stone-600 capitalize">
                                                {order.status.includes('replacement') ? 'Replacement' : 'Return'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(order.status)}`}>
                                                {order.status.replace(/_/g, ' ')}
                                            </span>
                                            {order.returnWaybillId && (
                                                <div className="text-xs font-mono text-emerald-600 mt-1 flex items-center gap-1">
                                                    <Truck className="w-3 h-3" /> {order.returnWaybillId}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {order.status.includes('requested') && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleRejectReturn(order.id)}
                                                        disabled={processingId === order.id}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all disabled:opacity-50"
                                                    >
                                                        Reject
                                                    </button>
                                                    <button
                                                        onClick={() => handleApproveReturn(order)}
                                                        disabled={processingId === order.id}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all disabled:opacity-50"
                                                    >
                                                        {processingId === order.id ? 'Processing...' : 'Approve & Pickup'}
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-stone-500">
                                        <RotateCcw className="w-12 h-12 mx-auto mb-3 text-stone-200" />
                                        <p className="text-lg font-medium">No records found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default NDRManager;
