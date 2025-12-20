import React, { useMemo, useEffect, useState } from 'react';
import { Package, ShoppingCart, DollarSign, Calendar, TrendingUp, AlertTriangle, ArrowUpRight, Clock, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../config/supabase';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Products
            const { data: productsData, error: productsError } = await supabase
                .from('products')
                .select('*');
            
            if (productsError) console.error('Error fetching products:', productsError);

            // Fetch Orders
            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (ordersError) console.error('Error fetching orders:', ordersError);

            if (productsData) setProducts(productsData);
            if (ordersData) setOrders(ordersData);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Calculate Real Stats
    const stats = useMemo(() => {
        const safeOrders = orders || [];
        const safeProducts = products || [];
        
        const totalRevenue = safeOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
        const totalOrders = safeOrders.length;
        const pendingOrders = safeOrders.filter(o => o.status === 'pending').length;
        // Logic for low stock: assuming 'stock_quantity' field from schema
        const lowStockCount = safeProducts.filter(p => (p.stock_quantity || 0) < 5).length;
        
        // Calculate average order value
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        return {
            revenue: totalRevenue,
            orders: totalOrders,
            pending: pendingOrders,
            lowStock: lowStockCount,
            avgOrder: avgOrderValue,
            recentOrders: safeOrders.slice(0, 5)
        };
    }, [orders, products]);

    // Calculate Weekly Revenue for Chart
    const activityData = useMemo(() => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });

        const revenueByDay = last7Days.map(date => {
            const daysOrders = orders.filter(o => 
                o.created_at.startsWith(date) && 
                o.status !== 'cancelled'
            );
            return daysOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
        });

        // Normalize for chart height (percentage) if needed, 
        // but for now we'll just return raw values and let the UI handle scaling 
        // or just scale here against the max value.
        const maxRev = Math.max(...revenueByDay, 1); // Avoid div by 0
        return revenueByDay.map(rev => ({
            raw: rev,
            percentage: (rev / maxRev) * 100
        }));
    }, [orders]);

    // Helper to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-900"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 font-body">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-stone-900">Dashboard</h1>
                    <p className="text-stone-500 mt-1">Overview of your store's performance</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={fetchData} 
                        className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-600 flex items-center gap-2 hover:bg-stone-50 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                     <span className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                     </span>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { 
                        title: 'Total Revenue', 
                        value: formatCurrency(stats.revenue), 
                        trend: '+12.5%', 
                        icon: DollarSign, 
                        color: 'bg-emerald-50 text-emerald-600',
                        trendColor: 'text-emerald-600'
                    },
                    { 
                        title: 'Total Orders', 
                        value: stats.orders, 
                        trend: '+5.2%', 
                        icon: ShoppingCart, 
                        color: 'bg-blue-50 text-blue-600',
                         trendColor: 'text-blue-600'
                    },
                    { 
                        title: 'Pending Orders', 
                        value: stats.pending, 
                        trend: 'Action needed', 
                        icon: Clock, 
                        color: 'bg-amber-50 text-amber-600',
                         trendColor: 'text-amber-600'
                    },
                    { 
                        title: 'Avg. Order Value', 
                        value: formatCurrency(stats.avgOrder), 
                        trend: 'Stable', 
                        icon: TrendingUp, 
                        color: 'bg-violet-50 text-violet-600',
                         trendColor: 'text-stone-500'
                    },
                ].map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}>
                                {stat.icon && <stat.icon className="w-6 h-6" />}
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full bg-stone-50 ${stat.trendColor}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <div>
                            <p className="text-stone-500 text-sm font-medium">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-stone-900 mt-1">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                 {/* Main Chart Area (Visual Only) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-stone-900">Weekly Revenue</h2>
                        <button className="text-rose-900 text-sm font-bold hover:underline">View Report</button>
                    </div>
                    
                    {/* CSS Bar Chart */}
                    <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2">
                        {activityData.map((data, i) => (
                            <div key={i} className="w-full bg-stone-50 rounded-t-lg relative group overflow-hidden">
                                <div 
                                    className="absolute bottom-0 w-full bg-rose-900/80 hover:bg-rose-900 transition-all duration-500 rounded-t-lg"
                                    style={{ height: `${data.percentage}%` }}
                                >
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-xs py-1 px-2 rounded shadow-lg transition-opacity whitespace-nowrap z-10">
                                        {formatCurrency(data.raw)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-stone-400 font-bold uppercase tracking-wider">
                         {[...Array(7)].map((_, i) => {
                            const d = new Date();
                            d.setDate(d.getDate() - (6 - i));
                            return <span key={i}>{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        })}
                    </div>
                </div>

                {/* Alerts / Low Stock */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col">
                    <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        Attention Needed
                    </h2>
                    
                    <div className="space-y-4 flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                        {stats.lowStock > 0 ? (
                            products.filter(p => (p.stock_quantity || 0) < 5).map(p => (
                                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-red-50/50 border border-red-100">
                                    {/* Handle potentially missing image array */}
                                    <img 
                                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=100'} 
                                        alt={p.name} 
                                        className="w-10 h-10 rounded-lg object-cover" 
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-stone-900 truncate">{p.name}</p>
                                        <p className="text-xs text-red-600 font-medium">Low Stock: {p.stock_quantity}</p>
                                    </div>
                                    <Link to="/admin/products" className="p-1.5 bg-white rounded-lg text-stone-400 hover:text-rose-900 shadow-sm border border-stone-100">
                                        <ArrowUpRight className="w-4 h-4" />
                                        View
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-stone-400 bg-stone-50 rounded-xl border-dashed border-2 border-stone-200">
                                <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No low stock alerts</p>
                            </div>
                        )}
                        
                        {stats.pending > 0 && (
                             <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                                        <Clock className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-stone-900">{stats.pending} Orders Pending</p>
                                        <p className="text-xs text-amber-700">Needs processing</p>
                                    </div>
                                    <Link to="/admin/orders" className="text-xs font-bold text-amber-700 hover:underline">View</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-stone-900">Recent Orders</h2>
                    <Link to="/admin/orders" className="text-sm font-bold text-rose-900 hover:text-rose-700 hover:underline">View All Orders</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-stone-50 border-b border-stone-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {stats.recentOrders.length > 0 ? (
                                stats.recentOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs font-medium text-stone-500">
                                            {order.id.slice(0, 8)}...
                                        </td>
                                        <td className="px-6 py-4 text-sm text-stone-600">
                                            {order.customer_name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-stone-600">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-stone-900">
                                            {formatCurrency(order.total)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                                order.status === 'completed' || order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-stone-500">No orders yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
