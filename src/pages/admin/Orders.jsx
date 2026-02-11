import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, Search, Eye, Trash2, Filter, AlertTriangle, ArrowRight, Truck, Download } from 'lucide-react';
import { supabase } from '../../../config/supabase';
import ShipmentCreator from '../../components/admin/ShipmentCreator';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState([]); // Array of selected order IDs
  
  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'cancellation_requested'];

  const fetchOrders = async () => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;

        // Map DB structure to UI structure
        const mappedOrders = data.map(o => {
            const nameParts = (o.customer_name || 'Unknown User').split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ');

            return {
                id: o.id,
                date: o.created_at,
                status: o.status,
                total: o.total,
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
                paymentId: o.payment_id,
                waybillId: o.waybill_id, // New Field
                trackingUrl: o.tracking_url // New Field
            };
        });
        setOrders(mappedOrders);
    } catch (err) {
        console.error('Error fetching orders:', err);
    } finally {
        setLoading(false);
    }
  };

  // ... (existing useEffect and filteredOrders) ...
  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const term = searchTerm.toLowerCase();
    const customerName = order.customer ? `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase() : '';
    const matchesSearch = order.id.toString().toLowerCase().includes(term) || customerName.includes(term);
    
    if (activeTab === 'All') return matchesSearch;
    return matchesSearch && order.status.toLowerCase() === activeTab.toLowerCase();
  });


  const updateOrderStatus = async (orderId, newStatus, extraData = {}) => {
    try {
        const dbStatus = newStatus.toLowerCase();
        
        const { error } = await supabase
            .from('orders')
            .update({ status: dbStatus, ...extraData })
            .eq('id', orderId);

        if (error) throw error;

        // --- MANUALLY ADDED LOG FOR TIMELINE ---
        let logMessage = 'Status updated by store admin';
        if (dbStatus === 'shipped') logMessage = 'Order marked as Shipped';
        else if (dbStatus === 'delivered') logMessage = 'Order marked as Delivered';
        else if (dbStatus === 'processing') logMessage = 'Order is being processed';
        else if (dbStatus === 'cancelled') logMessage = 'Order was cancelled';

        // Insert into order_status_logs so it appears in the timeline on OrderDetails
        await supabase
            .from('order_status_logs')
            .insert([{
                order_id: orderId,
                status: newStatus, 
                timestamp: new Date().toISOString(),
                message: logMessage,
                description: `Manual update to ${newStatus}` 
            }]);
        // ---------------------------------------

        // Send Notification to User
        if (selectedOrder?.customer?.email) {
            await supabase.from('notifications').insert([{
                user_email: selectedOrder.customer.email,
                title: 'Order Status Updated',
                message: `Your order #${selectedOrder.id.slice(0,8)} is now ${newStatus}.`,
                type: 'info',
                is_read: false
            }]);
        }

        // Optimistic update
        const updatedOrders = orders.map(order => 
          order.id === orderId ? { ...order, status: dbStatus, ...extraData } : order
        );
        setOrders(updatedOrders);
        
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => ({ ...prev, status: dbStatus, ...extraData }));
        }
    } catch (err) {
        console.error('Error updating status:', err);
        alert('Failed to update status');
    }
  };

  // --- Bulk Selection & CSV Export ---

  const toggleSelectOrder = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  };

  const toggleSelectAll = () => {
    // If all currently filtered orders are selected, deselect all. Otherwise select all filtered orders.
    // We compare against filteredOrders to respect search/tabs.
    const allFilteredIds = filteredOrders.map(o => o.id);
    const allSelected = allFilteredIds.every(id => selectedOrders.includes(id));

    if (allSelected) {
       // Deselect these specific ones keeping others? Or just clear all? 
       // Simplest: Deselect all (common behavior) or remove current view's IDs
       setSelectedOrders(prev => prev.filter(id => !allFilteredIds.includes(id)));
    } else {
       // Add all filtered IDs
       const newSelection = [...new Set([...selectedOrders, ...allFilteredIds])];
       setSelectedOrders(newSelection);
    }
  };

  const downloadCSV = () => {
    // Get orders that are both in the full list AND selected
    const ordersToExport = orders.filter(o => selectedOrders.includes(o.id));
    
    if (ordersToExport.length === 0) return;

    // Defined Headers based on Delhivery Bulk Upload Error Report
    const headers = [
      "*Sale Order Number", "*Pickup Location Name", "*Customer Name", "*Customer Phone", 
      "*Item Sku Code", "*Item Sku Name", "*Unit Item Price", "Discount Type", "Discount Value", "Tax Class Code",
      "*Transport Mode", "*Payment Mode", "Packaging Type", "COD Amount", "*Quantity Ordered", 
      "Length (cm)", "Breadth (cm)", "Height (cm)", "Weight (gm)", "Protect Category Id", 
      "Fragile Shipment", "Customer Email", "*Shipping Address Line1", "Shipping Address Line2", 
      "*Shipping City", "*Shipping State", "*Shipping Pincode", 
      "Billing Address same as Shipping Address", "Billing Address Line1", "Billing Address Line2", 
      "Billing City", "Billing State", "Billing Pincode", 
      "e-Way Bill Number", "Seller Name", "Seller GST Number", "Seller Address Line1", 
      "Seller Address Line2", "Seller City", "Seller State", "Seller Pincode"
    ];

    const csvRows = [headers.join(',')];

    ordersToExport.forEach(order => {
      // Iterate through items to create one row per item (required for bulk upload)
      order.items.forEach(item => {
          // Helper to escape commas/quotes
          const escape = (text) => `"${(text || '').toString().replace(/"/g, '""')}"`;

          // Defaults
          const warehouseName = import.meta.env.VITE_DELHIVERY_WAREHOUSE_NAME || "Main Warehouse";
          const paymentMode = order.paymentMethod === 'cod' ? "COD" : "Pre-paid";
          const transportMode = "Surface"; // Default
          
          // COD Amount is total for the order, but CSV often expects it per shipment. 
          // For multi-item orders in bulk upload, usually the first row carries the COD amount or it's calculated.
          // Delhivery Guide: "COD Amount" should be 0 for Prepaid. For COD, put full amount on one line or split?
          // Simplest: Put 0 for all items except maybe specific logic, BUT mostly safest to put 0 and let Delhivery calculate from value OR put 0 here and just treat it as Pre-paid if unsure.
          // BETTER: Put 0 passed, actually for COD orders, the "COD Amount" is meaningful. 
          // However, allocating valid COD per item is complex. 
          // Strategy: We will put the specific item total as COD Amount if COD, else 0. 
          // NOTE: This might be wrong if they expect Total Order Value.
          // Let's use 0 for "COD Amount" on standard lines unless we are sure.
          // Actually, standard practice: Map "Payment Mode" correctly. "COD Amount" matches "Unit Item Price * Qty" or Total?
          // Let's set COD Amount to 0 for now to avoid validation errors, relying on "Payment Mode: COD". 
          // Correction: If Payment Mode is COD, COD Amount MUST be > 0.
          // Let's set COD Amount = (Item Price * Qty) for this row.
          
          const itemTotal = item.price * item.quantity;
          const codAmount = order.paymentMethod === 'cod' ? itemTotal : 0;

          const row = [
            escape(order.id),                       // Sale Order Number
            escape(warehouseName),                  // Pickup Location Name
            escape(`${order.customer.firstName} ${order.customer.lastName}`), // Customer Name
            escape(order.customer.phone),           // Customer Phone
            escape(item.id || item.sku || item.name.substring(0, 10)), // Item Sku Code
            escape(item.name),                      // Item Sku Name
            item.price,                             // Unit Item Price
            "",                                     // Discount Type
            0,                                      // Discount Value
            "",                                     // Tax Class Code
            transportMode,                          // Transport Mode
            paymentMode,                            // Payment Mode
            "",                                     // Packaging Type
            codAmount,                              // COD Amount
            item.quantity,                          // Quantity Ordered
            10,                                     // Length
            10,                                     // Breadth
            10,                                     // Height
            500,                                    // Weight (gm)
            "",                                     // Protect Category Id
            "No",                                   // Fragile Shipment
            escape(order.customer.email),           // Customer Email
            escape(order.customer.address),         // Shipping Address Line1
            "",                                     // Shipping Address Line2
            escape(order.customer.city),            // Shipping City
            escape(order.customer.state),           // Shipping State
            escape(order.customer.zipCode),         // Shipping Pincode
            "Yes",                                  // Billing Address same as Shipping Address
            escape(order.customer.address),         // Billing Address Line1
            "",                                     // Billing Address Line2
            escape(order.customer.city),            // Billing City
            escape(order.customer.state),           // Billing State
            escape(order.customer.zipCode),         // Billing Pincode
            "", "", "", "", "", "", "", ""          // e-way, Seller info (empty)
          ];
          csvRows.push(row.join(','));
      });
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    // Format filename: delhivery_bulk_upload_YYYY-MM-DD.csv
    link.setAttribute("download", `delhivery_bulk_upload_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
          const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', orderId);
          
          if (error) throw error;

          const updatedOrders = orders.filter(order => order.id !== orderId);
          setOrders(updatedOrders);
          setSelectedOrder(null);
      } catch (err) {
          console.error("Error deleting order:", err);
          alert("Failed to delete order");
      }
    }
  };

  const getStatusColor = (status) => {
    // Normalize status for switch
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'cancellation_requested': return 'bg-amber-100 text-amber-700 border-amber-200 animate-pulse'; // Highlight requests
      default: return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  // --- Delhivery Integration ---






  return (
    <div className="font-body space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-heading font-bold text-stone-900">Orders</h1>
           <p className="text-stone-500 mt-1">Track and manage customer orders</p>
        </div>
        <div className="flex items-center gap-2">
            {selectedOrders.length > 0 && (
                <button 
                  onClick={downloadCSV}
                  className="bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-bold tracking-wide hover:bg-stone-800 transition-colors shadow-sm flex items-center gap-2 animate-in fade-in zoom-in duration-200"
                >
                  <Download className="w-4 h-4" />
                  Download CSV ({selectedOrders.length})
                </button>
            )}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-stone-200 shadow-sm text-sm font-medium text-stone-600">
                 <span className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`}></span>
                 {loading ? 'Syncing...' : 'Live Updates'}
            </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="grid md:grid-cols-[2fr_3fr] gap-4">
        <div className="bg-white p-2 rounded-xl shadow-sm border border-stone-100 flex gap-2 overflow-x-auto">
            {['All', ...statusOptions].map(status => (
                <button
                    key={status}
                    onClick={() => setActiveTab(status.charAt(0).toUpperCase() + status.slice(1))} // UI Tab Display
                    className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap capitalize ${
                        activeTab.toLowerCase() === status.toLowerCase() 
                        ? 'bg-rose-900 text-white shadow-md' 
                        : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                >
                    {status}
                </button>
            ))}
        </div>

        <div className="bg-white p-2 rounded-xl shadow-sm border border-stone-100">
             <div className="relative h-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search by Order ID or Customer Name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 h-full rounded-lg bg-stone-50 border-none focus:ring-2 focus:ring-rose-900/20 font-medium transition-all"
                />
            </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                <th className="px-6 py-4 w-12">
                     <input 
                        type="checkbox"
                        // Check if all displayed orders are selected
                        checked={filteredOrders.length > 0 && filteredOrders.every(o => selectedOrders.includes(o.id))}
                        onChange={toggleSelectAll}
                        className="rounded border-stone-300 text-rose-900 focus:ring-rose-900"
                     />
                </th>
                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className={`hover:bg-stone-50/50 transition-colors group ${selectedOrders.includes(order.id) ? 'bg-rose-50/30' : ''}`}>
                    <td className="px-6 py-4">
                        <input 
                            type="checkbox"
                            checked={selectedOrders.includes(order.id)}
                            onChange={() => toggleSelectOrder(order.id)}
                            className="rounded border-stone-300 text-rose-900 focus:ring-rose-900"
                        />
                    </td>
                    <td className="px-6 py-4">
                        <span className="font-mono font-bold text-stone-900">#{order.id.slice(0,8)}</span>
                        <div className="text-xs text-stone-400 mt-0.5">{order.items.length} items</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-stone-600">
                      {new Date(order.date).toLocaleDateString()}
                      <div className="text-xs text-stone-400">{new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-500">
                                {order.customer?.firstName?.[0]}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-stone-900">{order.customer?.firstName} {order.customer?.lastName}</p>
                                <p className="text-xs text-stone-400">{order.customer?.email}</p>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-stone-900">
                      ₹{order.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex flex-col">
                             <span className={`text-xs font-bold uppercase ${order.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {order.paymentStatus}
                             </span>
                             <span className="text-[10px] text-stone-400 capitalize">{order.paymentMethod}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-rose-900 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                         <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-stone-500">
                    <div className="flex flex-col items-center justify-center">
                        <Package className="w-12 h-12 mb-3 text-stone-200" />
                        <p className="text-lg font-medium">No orders found</p>
                        <p className="text-sm">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Drawer/Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[70] flex justify-end">
          <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
          <div className="relative w-full max-w-md bg-white shadow-2xl h-full overflow-y-auto animate-in slide-in-from-right duration-300">
             <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50 sticky top-0 z-10">
                <div>
                    <h2 className="text-xl font-heading font-bold text-stone-900">Order #{selectedOrder.id.slice(0,8)}...</h2>
                    <p className="text-xs text-stone-500 font-bold uppercase tracking-wider">{new Date(selectedOrder.date).toLocaleString()}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
                  <XCircle className="w-6 h-6 text-stone-400" />
                </button>
            </div>
            
            <div className="p-6 space-y-8">
                {/* Status Control */}
                <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-2">Order Status</label>
                    <select 
                        value={selectedOrder.status}
                        onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg font-bold border-2 focus:ring-0 cursor-pointer capitalize ${getStatusColor(selectedOrder.status)}`}
                    >
                        {statusOptions.map(status => (
                            <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                        ))}
                    </select>
                </div>

                 {/* Shipping/Tracking Info */}
                 {selectedOrder.waybillId ? (
                     <div className="bg-purple-50 rounded-xl border border-purple-100 p-4 shadow-sm">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-purple-900 uppercase tracking-wide mb-2">
                             <Truck className="w-4 h-4" />
                             Shipping Details
                        </h4>
                        <div className="text-sm text-purple-800 space-y-1">
                            <p><strong>Courier:</strong> {selectedOrder.courier_name || 'Delhivery'}</p>
                            <p><strong>Tracking:</strong> <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-purple-100 select-all">{selectedOrder.waybillId}</span></p>
                            {selectedOrder.trackingUrl && <a href={selectedOrder.trackingUrl} target="_blank" className="underline text-blue-600">Track Shipment</a>}
                        </div>
                     </div>
                 ) : (
                    /* Create Shipment Section */
                    <ShipmentCreator selectedOrder={selectedOrder} onShipmentCreated={(details) => {
                        // Optimistic Update
                        const updatedOrders = orders.map(o => 
                            o.id === selectedOrder.id ? { ...o, ...details, status: 'shipped' } : o
                        );
                        setOrders(updatedOrders);
                        setSelectedOrder(prev => ({ ...prev, ...details, status: 'shipped' }));
                    }} />
                 )}


                {/* Items List */}
                <div>
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4 border-b border-stone-100 pb-2">Items Ordered</h3>
                    <div className="space-y-4">
                        {selectedOrder.items.map((item, index) => (
                            <div key={index} className="flex gap-4 items-start">
                                <div className="w-16 h-16 rounded-lg bg-stone-100 overflow-hidden border border-stone-200 shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-stone-900 text-sm">{item.name}</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {(item.selectedSize || item.selected_size) && (
                                            <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                                                Size: {item.selectedSize || item.selected_size}
                                            </span>
                                        )}
                                        {(item.selectedColor || item.selected_color) && (item.selectedColor !== 'NA' && item.selected_color !== 'NA') && (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                                                <span className="w-2 h-2 rounded-full border border-stone-300" style={{ backgroundColor: (item.selectedColor || item.selected_color || '').toLowerCase() }}></span>
                                                {item.selectedColor || item.selected_color}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-stone-500 mt-1">₹{item.price.toLocaleString()} × {item.quantity}</p>
                                </div>
                                <p className="font-bold text-stone-900 text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
                
                 {/* Totals */}
                <div className="bg-stone-50 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between text-sm text-stone-600">
                        <span>Payment Method</span>
                        <span className="font-medium capitalize">{selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : selectedOrder.paymentMethod}</span>
                    </div>
                    {selectedOrder.paymentId && (
                        <div className="flex justify-between text-sm text-stone-600">
                            <span>Payment ID</span>
                            <span className="font-mono text-xs bg-white px-2 py-0.5 rounded border border-stone-200">{selectedOrder.paymentId}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-sm text-stone-600">
                         <span>Payment Status</span>
                         <span className={`font-bold uppercase text-xs px-2 py-0.5 rounded ${selectedOrder.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                             {selectedOrder.paymentStatus}
                         </span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                        <span>Grand Total</span>
                        <span className="text-rose-900">₹{selectedOrder.total.toLocaleString()}</span>
                    </div>
                </div>

                {/* Customer Info */}
                <div>
                     <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4 border-b border-stone-100 pb-2">Delivery Details</h3>
                     <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-4">
                         <div className="flex items-start gap-3">
                             <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                                 <Clock className="w-4 h-4 text-rose-900" />
                             </div>
                             <div>
                                 <p className="text-xs font-bold text-stone-500 uppercase">Customer</p>
                                 <p className="font-medium text-stone-900">{selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}</p>
                                 <p className="text-sm text-stone-500">{selectedOrder.customer?.email}</p>
                                 <p className="text-sm text-stone-500">{selectedOrder.customer?.phone}</p>
                             </div>
                         </div>
                          <div className="flex items-start gap-3">
                             <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                                 <Package className="w-4 h-4 text-stone-600" />
                             </div>
                             <div>
                                 <p className="text-xs font-bold text-stone-500 uppercase">Shipping Address</p>
                                 <p className="text-sm text-stone-600 leading-relaxed mt-1">
                                     {selectedOrder.customer?.address}<br/>
                                     {selectedOrder.customer?.city}, {selectedOrder.customer?.state} {selectedOrder.customer?.zipCode}
                                 </p>
                             </div>
                         </div>
                     </div>
                </div>

                <div className="pt-4">
                    <button
                        onClick={() => handleDeleteOrder(selectedOrder.id)}
                        className="w-full py-3 rounded-xl border-2 border-red-100 text-red-600 font-bold text-sm uppercase tracking-wide hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Order Record
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
