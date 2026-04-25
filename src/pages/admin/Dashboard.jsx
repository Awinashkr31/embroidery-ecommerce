import React, { useMemo, useEffect, useState, useCallback } from 'react';
import {
  Package, ShoppingCart, DollarSign, Calendar, TrendingUp,
  AlertTriangle, ArrowUpRight, Clock, RefreshCw, TrendingDown,
  Users, IndianRupee, CheckCircle2, Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { useAdmin } from '../../context/AdminContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ─── Helpers ────────────────────────────────────────────────
const fmt = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

const statusConfig = {
  delivered:  { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  completed:  { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  shipped:    { bg: 'bg-blue-100',    text: 'text-blue-700' },
  confirmed:  { bg: 'bg-cyan-100',    text: 'text-cyan-700' },
  pending:    { bg: 'bg-amber-100',   text: 'text-amber-700' },
  cancelled:  { bg: 'bg-red-100',     text: 'text-red-700' },
  refunded:   { bg: 'bg-violet-100',  text: 'text-violet-700' },
};

const getStatusStyle = (status) => statusConfig[(status || '').toLowerCase()] ?? { bg: 'bg-stone-100', text: 'text-stone-700' };

// ─── Skeleton card ──────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white p-6 rounded-2xl border border-stone-100 animate-pulse">
    <div className="h-4 bg-stone-100 rounded w-1/2 mb-4" />
    <div className="h-7 bg-stone-100 rounded w-2/3 mb-2" />
    <div className="h-3 bg-stone-50 rounded w-1/3" />
  </div>
);

// ─── Stat card ──────────────────────────────────────────────
const StatCard = ({ title, value, icon, iconBg, delta, deltaLabel }) => {
  const positive = delta >= 0;
  const IconComponent = icon;
  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
      {/* Subtle corner accent */}
      <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full ${iconBg} opacity-30 group-hover:opacity-50 transition-opacity`} />
      
      <div className="flex justify-between items-start mb-5 relative">
        <div className={`p-3 rounded-xl ${iconBg} group-hover:scale-110 transition-transform duration-300`}>
          {IconComponent && <IconComponent className="w-5 h-5" />}
        </div>
        {delta !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${positive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
            {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {deltaLabel ?? `${Math.abs(delta)}%`}
          </span>
        )}
      </div>
      <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">{title}</p>
      <h3 className="text-2xl font-heading font-bold text-stone-900 mt-1">{value}</h3>
    </div>
  );
};

// ─── Mini bar chart ─────────────────────────────────────────
const BarChart = ({ data, loading }) => {
  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  });
  const max = Math.max(...data.map(d => d.raw), 1);

  return (
    <div className="flex items-end gap-2 h-52 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
          <div className="w-full flex-1 flex items-end bg-stone-50 rounded-lg overflow-hidden relative">
            {loading ? (
              <div className="w-full animate-pulse bg-stone-100 rounded-lg" style={{ height: '40%' }} />
            ) : (
              <div
                className="w-full bg-rose-900/80 hover:bg-rose-900 transition-all duration-700 rounded-lg relative"
                style={{ height: `${(d.raw / max) * 100}%`, minHeight: d.raw > 0 ? '4px' : '0' }}
              >
                {d.raw > 0 && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-stone-900 text-white text-[10px] py-1 px-2 rounded-lg shadow-lg whitespace-nowrap z-10">
                    {fmt(d.raw)}
                  </div>
                )}
              </div>
            )}
          </div>
          <span className="text-[10px] font-bold text-stone-400 uppercase">{days[i]}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Main ───────────────────────────────────────────────────
const Dashboard = () => {
  const { orders, loading: adminLoading, refreshData: refreshAdminData } = useAdmin();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [refreshing, setRefreshing] = useState(false);




  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
      await refreshAdminData(); // Tell the provider to re-fetch global data
    } else {
      setLoadingProducts(true);
    }
    
    try {
      const { data: productsData } = await supabase.from('products').select('id, name, images, stock_quantity');
      if (productsData) setProducts(productsData);
    } catch (error) {
      console.error('Dashboard products fetch error:', error);
    } finally {
      setLoadingProducts(false);
      setRefreshing(false);
    }
  }, [refreshAdminData]);

  useEffect(() => { fetchData(); }, [fetchData]);
  
  const loading = adminLoading || loadingProducts;

  const getAmount = (o) => Number(o.total) || Number(o.total_amount) || Number(o.amount) || 0;

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((s, o) => s + getAmount(o), 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const deliveredOrders = orders.filter(o => ['delivered', 'completed'].includes(o.status?.toLowerCase())).length;
    const lowStock = products.filter(p => (p.stock_quantity ?? 0) < 5);
    const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Instead of hardcoded deltas, we either calculate real ones or omit them completely to prevent data hallucination.
    // For now, we omit the delta prop so it falls back to neutral or doesn't show fake growth.
    
    return { totalRevenue, totalOrders, pendingOrders, deliveredOrders, avgOrder, lowStock, recentOrders: orders.slice(0, 8) };
  }, [orders, products]);

  const chartData = useMemo(() => {
    const last7 = [...Array(7)].map((_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });
    return last7.map(date => {
      const dayOrders = orders.filter(o => o.created_at?.startsWith(date) && o.status !== 'cancelled');
      return { raw: dayOrders.reduce((s, o) => s + getAmount(o), 0) };
    });
  }, [orders]);

  return (
    <div className="space-y-8">

      {/* ── Header ──── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-stone-900">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'} 👋</h1>
          <p className="text-stone-500 text-sm mt-0.5">Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-xl text-sm font-medium text-stone-600 shadow-sm">
            <Calendar className="w-4 h-4 text-stone-400" />
            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors shadow-sm disabled:opacity-60"
          >
            {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Refresh
          </button>
        </div>
      </div>

      {/* ── KPI cards ─ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {loading ? (
          [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard title="Total Revenue"   value={fmt(stats.totalRevenue)}   icon={IndianRupee}   iconBg="bg-emerald-100 text-emerald-700"  />
            <StatCard title="Total Orders"    value={stats.totalOrders}         icon={ShoppingCart}  iconBg="bg-blue-100 text-blue-700"        />
            <StatCard title="Delivered"       value={stats.deliveredOrders}     icon={CheckCircle2}  iconBg="bg-violet-100 text-violet-700"  />
            <StatCard title="Avg. Order"      value={fmt(stats.avgOrder)}       icon={TrendingUp}    iconBg="bg-rose-100 text-rose-700"      deltaLabel={stats.pendingOrders + ' pending'} delta={0} />
          </>
        )}
      </div>

      {/* ── Chart + Alerts ─ */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Bar chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-base font-bold text-stone-900">Revenue — Last 7 Days</h2>
              <p className="text-xs text-stone-400 mt-0.5">Excluding cancelled orders</p>
            </div>
            <span className="text-2xl font-heading font-bold text-stone-900">
              {fmt(chartData.reduce((s, d) => s + d.raw, 0))}
            </span>
          </div>
          <BarChart data={chartData} loading={loading} />
        </div>

        {/* Alerts */}
        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex flex-col gap-4">
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Attention Needed
          </h2>

          {/* Pending orders alert */}
          {stats.pendingOrders > 0 && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-stone-900">{stats.pendingOrders} Pending</p>
                <p className="text-xs text-amber-700">Needs processing</p>
              </div>
              <Link to="/sadmin/orders" className="text-xs font-bold text-amber-600 hover:underline shrink-0">View →</Link>
            </div>
          )}

          {/* Low stock */}
          {loading ? (
            <div className="space-y-3">
              {[1,2].map(i => <div key={i} className="h-14 rounded-xl bg-stone-50 animate-pulse" />)}
            </div>
          ) : stats.lowStock.length > 0 ? (
            <div className="space-y-2 overflow-y-auto max-h-64 pr-1">
              {stats.lowStock.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-red-50/60 border border-red-100">
                  <img
                    src={p.images?.[0] || '/logo.png'}
                    alt={p.name}
                    className="w-9 h-9 rounded-lg object-cover shrink-0 border border-red-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-900 truncate">{p.name}</p>
                    <p className="text-[10px] text-red-600 font-semibold">Stock: {p.stock_quantity ?? 0}</p>
                  </div>
                  <Link to="/sadmin/products" className="p-1.5 bg-white rounded-lg border border-stone-100 text-stone-400 hover:text-rose-900 transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-stone-400 bg-stone-50 rounded-xl border-2 border-dashed border-stone-200">
              <Package className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-xs font-medium">All stock levels OK</p>
            </div>
          )}
        </div>
      </div>


      {/* ── Recent Orders table ─ */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-stone-900">Recent Orders</h2>
            <p className="text-xs text-stone-400 mt-0.5">Last {stats.recentOrders.length} orders</p>
          </div>
          <Link
            to="/sadmin/orders"
            className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-stone-700 transition-colors flex items-center gap-1.5"
          >
            View All <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div>
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-stone-50 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <>
              {/* Mobile: compact order cards */}
              <div className="md:hidden divide-y divide-stone-50">
                {stats.recentOrders.length > 0 ? stats.recentOrders.map(order => {
                  const { bg, text } = getStatusStyle(order.status);
                  return (
                    <Link
                      key={order.id}
                      to="/sadmin/orders"
                      state={{ orderId: order.id }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-[11px] text-stone-400">{order.id.slice(0,8)}…</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${bg} ${text}`}>{order.status}</span>
                        </div>
                        <p className="text-xs font-semibold text-stone-800 truncate">
                          {order.customer_name || order.customer_email?.split('@')[0] || '—'}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-stone-900">{fmt(getAmount(order))}</p>
                        <p className="text-[10px] text-stone-400">
                          {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </Link>
                  );
                }) : (
                  <p className="px-4 py-8 text-center text-sm text-stone-400">No orders yet</p>
                )}
              </div>

              {/* Desktop: full table */}
              <table className="hidden md:table w-full text-left">
                <thead className="bg-stone-50/70 border-b border-stone-100">
                  <tr>
                    {['Order ID', 'Customer', 'Date', 'Amount', 'Status', ''].map(h => (
                      <th key={h} className="px-6 py-3 text-[10px] font-bold text-stone-400 uppercase tracking-widest whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {stats.recentOrders.length > 0 ? stats.recentOrders.map(order => {
                    const { bg, text } = getStatusStyle(order.status);
                    return (
                      <tr key={order.id} className="hover:bg-stone-50/60 transition-colors group">
                        <td className="px-6 py-3.5 font-mono text-[11px] text-stone-400">{order.id.slice(0, 6).toUpperCase()}…</td>
                        <td className="px-6 py-3.5 text-sm font-medium text-stone-700">
                          {order.customer_name || order.customer_email?.split('@')[0] || '—'}
                        </td>
                        <td className="px-6 py-3.5 text-xs text-stone-500 whitespace-nowrap">
                          {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="px-6 py-3.5 text-sm font-bold text-stone-900">{fmt(getAmount(order))}</td>
                        <td className="px-6 py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${bg} ${text}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <Link
                            to="/sadmin/orders"
                            state={{ orderId: order.id }}
                            className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-stone-400 hover:text-rose-900 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-stone-400 text-sm">
                        No orders yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
