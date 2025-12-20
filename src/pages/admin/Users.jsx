import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../config/supabase';
import { 
  Search, Filter, Download, User, TrendingUp, DollarSign, 
  Calendar, ShoppingBag, Star, Activity, X, MapPin, Bell, Send
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';

const Users = () => {
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'totalSpend', direction: 'desc' });
    
    // Notification Modal State
    const [showNotifModal, setShowNotifModal] = useState(false);
    const [notifTarget, setNotifTarget] = useState(null);
    const [notifMessage, setNotifMessage] = useState('');
    const [notifTitle, setNotifTitle] = useState('');
    const [sendingNotif, setSendingNotif] = useState(false);

    // --- Data Fetching & Aggregation ---

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch orders
                const { data: ordersData, error: ordersError } = await supabase
                    .from('orders')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (ordersError) throw ordersError;

                // Fetch synced users
                const { data: usersData, error: usersError } = await supabase
                    .from('users')
                    .select('*');

                if (usersError && usersError.code !== 'PGRST116') {
                    console.error("Error fetching users:", usersError);
                }

                setOrders(ordersData);
                processData(ordersData, usersData || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };



        const processData = (orderData, userData) => {
            const userMap = new Map();

            // 1. Initialize with synced users (Auth users who might not have ordered yet)
            userData.forEach(u => {
                if (!u.email) return;
                userMap.set(u.email, {
                    email: u.email,
                    name: u.display_name || 'Registered User',
                    photo: u.photo_url,
                    phone: null, // Phone might not be in auth profile
                    orders: [],
                    totalSpend: 0,
                    firstOrderDate: u.created_at,
                    lastOrderDate: u.last_login || u.created_at,
                    locations: new Set(),
                    categories: {},
                    status: 'Registered' // Default status for auth-only users
                });
            });

            // 2. Process orders (Guest users + updates to Auth users)
            orderData.forEach(order => {
                const email = order.customer_email;
                if (!email) return;

                if (!userMap.has(email)) {
                    userMap.set(email, {
                        email: email,
                        name: order.customer_name || 'Guest User',
                        photo: null,
                        phone: order.customer_phone,
                        orders: [],
                        totalSpend: 0,
                        firstOrderDate: order.created_at,
                        lastOrderDate: order.created_at,
                        locations: new Set(),
                        categories: {},
                        status: 'Active'
                    });
                }

                const user = userMap.get(email);
                user.orders.push(order);
                user.totalSpend += Number(order.total) || 0;
                if (!user.phone && order.customer_phone) user.phone = order.customer_phone;
                if (user.status === 'Registered') user.status = 'Active'; // Upgrade status if they ordered
                
                // Date updates
                if (new Date(order.created_at) > new Date(user.lastOrderDate)) user.lastOrderDate = order.created_at;
                if (new Date(order.created_at) < new Date(user.firstOrderDate)) user.firstOrderDate = order.created_at;

                // Location
                if (order.shipping_address?.city) user.locations.add(order.shipping_address.city);

                // Categories
                if (order.items && Array.isArray(order.items)) {
                    order.items.forEach(item => {
                        const cat = item.category || 'General'; 
                        user.categories[cat] = (user.categories[cat] || 0) + 1;
                    });
                }
            });

            // Finalize User Objects
            const processedUsers = Array.from(userMap.values()).map(user => {
                const orderCount = user.orders.length;
                const avgOrderValue = orderCount ? user.totalSpend / orderCount : 0;
                
                // Days since last activity
                const daysSinceLast = Math.floor((new Date() - new Date(user.lastOrderDate)) / (1000 * 60 * 60 * 24));
                
                // Calculate User Status logic override
                if (orderCount > 0) {
                    let status = 'Active';
                    if (daysSinceLast > 90) status = 'At Risk';
                    if (daysSinceLast > 180) status = 'Churned';
                    if (daysSinceLast < 30 && orderCount === 1) status = 'New';
                    user.status = status;
                }

                // Favorite Category
                let favCategory = 'Mix';
                let maxCount = 0;
                Object.entries(user.categories).forEach(([cat, count]) => {
                    if (count > maxCount) {
                        maxCount = count;
                        favCategory = cat;
                    }
                });

                return {
                    ...user,
                    id: btoa(user.email), 
                    orderCount,
                    avgOrderValue,
                    daysSinceLast,
                    favCategory,
                    primaryLocation: Array.from(user.locations)[0] || 'Unknown',
                    // Engagement Score (0-100)
                    engagementScore: Math.min(100, Math.round(
                        (orderCount * 10) + 
                        (user.totalSpend / 1000) + 
                        (Math.max(0, 30 - daysSinceLast)) +
                        (user.photo ? 10 : 0) // Bonus for having a profile
                    ))
                };
            });

            setUsers(processedUsers);
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSendNotification = async (e) => {
        e.preventDefault();
        if(!notifTarget || !notifMessage || !notifTitle) return;

        setSendingNotif(true);
        try {
            const { error } = await supabase.from('notifications').insert({
                user_email: notifTarget.email,
                title: notifTitle,
                message: notifMessage,
                type: 'info',
                is_read: false
            });

            if (error) throw error;
            
            alert('Notification Sent!');
            setShowNotifModal(false);
            setNotifMessage('');
            setNotifTitle('');
            setNotifTarget(null);
        } catch (err) {
            console.error('Error sending notification:', err);
            alert('Failed to send');
        } finally {
            setSendingNotif(false);
        }
    };

    // --- Analytics Derivation ---

    const analytics = useMemo(() => {
        const totalRevenue = users.reduce((sum, u) => sum + u.totalSpend, 0);
        const avgLTV = users.length ? totalRevenue / users.length : 0;
        
        // Revenue Trend
        const monthlyRevenue = {};
        orders.forEach(o => {
            const month = new Date(o.created_at).toLocaleString('default', { month: 'short' });
            monthlyRevenue[month] = (monthlyRevenue[month] || 0) + o.total;
        });
        const revenueChartData = Object.entries(monthlyRevenue).map(([name, value]) => ({ name, value }));

        // Category Distribution
        const categoryStats = {};
        users.forEach(u => {
           categoryStats[u.favCategory] = (categoryStats[u.favCategory] || 0) + 1;
        });
        const categoryChartData = Object.entries(categoryStats).map(([name, value]) => ({ name, value }));

        return {
            totalRevenue,
            totalUsers: users.length,
            avgLTV,
            revenueChartData,
            categoryChartData
        };
    }, [users, orders]);

    // --- UI Helpers ---

    const handleSort = (key) => {
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'desc' ? 'asc' : 'desc'
        });
    };

    const sortedUsers = useMemo(() => {
        let sorted = [...users];
        
        // Filtering
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            sorted = sorted.filter(u => 
                u.name.toLowerCase().includes(term) || 
                u.email.toLowerCase().includes(term)
            );
        }

        if (filterStatus !== 'all') {
            if (filterStatus === 'whales') {
                 // Top 10% by spend
                 const threshold = [...users].sort((a,b) => b.totalSpend - a.totalSpend)[Math.ceil(users.length * 0.1)]?.totalSpend || 10000;
                 sorted = sorted.filter(u => u.totalSpend >= threshold);
            } else {
                sorted = sorted.filter(u => u.status.toLowerCase() === filterStatus.toLowerCase());
            }
        }

        // Sorting
        return sorted.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [users, searchTerm, filterStatus, sortConfig]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-rose-900 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Analyzing User Data...</p>
                </div>
            </div>
        );
    }

    const exportCSV = () => {
        const headers = ["Name", "Email", "Phone", "Total Spend", "Orders", "Last Order", "Status", "Location"];
        const csvContent = [
            headers.join(","),
            ...sortedUsers.map(u => [
                u.name, u.email, u.phone, u.totalSpend, u.orderCount, 
                new Date(u.lastOrderDate).toLocaleDateString(), u.status, u.primaryLocation
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users_export.csv';
        a.click();
    };

    const COLORS = ['#881337', '#BE123C', '#E11D48', '#FB7185', '#F43F5E'];

    return (
        <div className="space-y-8 font-body">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-800">User Analytics</h1>
                    <p className="text-gray-500">Insights from {users.length} unique customers</p>
                </div>
                <button 
                  onClick={exportCSV}
                  className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors text-sm font-bold"
                >
                    <Download className="w-4 h-4" /> Export CSV
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-800">₹{analytics.totalRevenue.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Avg Lifetime Value</p>
                        <p className="text-2xl font-bold text-gray-800">₹{Math.round(analytics.avgLTV).toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Engagement Rate</p>
                        <p className="text-2xl font-bold text-gray-800">
                            {Math.round((users.filter(u => u.status === 'Active').length / (users.length||1)) * 100)}%
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-rose-900" /> Revenue Trend
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analytics.revenueChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Line type="monotone" dataKey="value" stroke="#be123c" strokeWidth={3} dot={{fill: '#be123c', strokeWidth: 2}} activeDot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                 </div>

                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-rose-900" /> User Preferences
                    </h3>
                    <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                             <PieChart>
                                <Pie
                                    data={analytics.categoryChartData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {analytics.categoryChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center flex-wrap gap-4 text-xs font-medium text-gray-500">
                        {analytics.categoryChartData.map((entry, index) => (
                            <div key={entry.name} className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></span>
                                {entry.name}
                            </div>
                        ))}
                    </div>
                 </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between bg-gray-50/50">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by name or email..." 
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-900/10 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto">
                        {['all', 'active', 'new', 'churned', 'whales'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                                    filterStatus === status 
                                    ? 'bg-rose-900 text-white' 
                                    : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                {status === 'whales' ? 'High Spenders' : status}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th onClick={() => handleSort('name')} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-rose-900">User Profile</th>
                                <th onClick={() => handleSort('totalSpend')} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-rose-900">Lifetime Spend</th>
                                <th onClick={() => handleSort('orderCount')} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-rose-900">Orders</th>
                                <th onClick={() => handleSort('engagementScore')} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-rose-900">Score</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {sortedUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-900 font-bold border border-rose-100 overflow-hidden">
                                                {user.photo ? (
                                                    <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    user.name.charAt(0)
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900 text-sm">₹{user.totalSpend.toLocaleString()}</p>
                                        <p className="text-xs text-gray-400">Avg: ₹{Math.round(user.avgOrderValue).toLocaleString()}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {user.orderCount} <span className="text-xs text-gray-400 ">orders</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                  className="h-full bg-emerald-500 rounded-full" 
                                                  style={{width: `${user.engagementScore}%`}}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-medium text-gray-600">{user.engagementScore}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                            user.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' :
                                            user.status === 'Churned' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                                            user.status === 'At Risk' ? 'bg-red-100 text-red-700 border-red-200' :
                                            'bg-blue-100 text-blue-700 border-blue-200' // New
                                        }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => setSelectedUser(user)}
                                            className="text-gray-400 hover:text-rose-900 hover:bg-rose-50 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            title="View Details"
                                        >
                                            <Search className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => { setNotifTarget(user); setShowNotifModal(true); }}
                                            className="text-gray-400 hover:text-rose-900 hover:bg-rose-50 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            title="Send Notification"
                                        >
                                            <Bell className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                             {sortedUsers.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        No users found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedUser(null)}></div>
                    <div className="relative w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
                        <div className="p-6 bg-rose-900 text-white sticky top-0 z-10">
                            <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-4 mt-4">
                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl font-heading font-bold overflow-hidden">
                                    {selectedUser.photo ? (
                                        <img src={selectedUser.photo} alt={selectedUser.name} className="w-full h-full object-cover" />
                                    ) : (
                                        selectedUser.name.charAt(0)
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-heading font-bold">{selectedUser.name}</h2>
                                    <p className="text-rose-100 flex items-center gap-2 text-sm opacity-90"><MapPin className="w-3 h-3" /> {selectedUser.primaryLocation}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-8">
                                <div className="bg-white/10 p-3 rounded-lg text-center">
                                    <p className="text-xs font-bold uppercase tracking-wider opacity-70">Spend</p>
                                     <p className="text-xl font-bold">₹{selectedUser.totalSpend.toLocaleString()}</p>
                                </div>
                                <div className="bg-white/10 p-3 rounded-lg text-center">
                                    <p className="text-xs font-bold uppercase tracking-wider opacity-70">Orders</p>
                                     <p className="text-xl font-bold">{selectedUser.orderCount}</p>
                                </div>
                                <div className="bg-white/10 p-3 rounded-lg text-center">
                                    <p className="text-xs font-bold uppercase tracking-wider opacity-70">Score</p>
                                     <p className="text-xl font-bold">{selectedUser.engagementScore}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-8">
                            {/* Detailed Info */}
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <User className="w-4 h-4" /> {selectedUser.email}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4" /> Member since {new Date(selectedUser.firstOrderDate).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Activity className="w-4 h-4" /> Last seen {selectedUser.daysSinceLast} days ago
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Star className="w-4 h-4" /> Fav Category: <span className="font-bold text-gray-800">{selectedUser.favCategory}</span>
                                </div>
                            </div>

                            {/* Order History Timeline */}
                            <div>
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"> <ShoppingBag className="w-4 h-4 text-rose-900" /> Order History</h3>
                                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                                    {selectedUser.orders.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).map((order) => (
                                        <div key={order.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-rose-900 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                                            
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-bold text-gray-900 text-sm">Order #{order.id.slice(0,6)}</span>
                                                    <time className="font-caveat font-medium text-rose-900 text-xs">{new Date(order.created_at).toLocaleDateString()}</time>
                                                </div>
                                                <div className="text-xs text-gray-500 mb-2">
                                                    {order.items?.length} items • {order.status}
                                                </div>
                                                <div className="font-bold text-gray-900">
                                                    ₹{order.total.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Notification Modal */}
            {showNotifModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowNotifModal(false)}></div>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 p-6 animate-in zoom-in-95 duration-200">
                            <button onClick={() => setShowNotifModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                        
                        <div className="mb-6">
                            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-900 mb-4">
                                <Bell className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Send Notification</h3>
                            <p className="text-sm text-gray-500">To: <span className="font-bold text-gray-700">{notifTarget?.name}</span> ({notifTarget?.email})</p>
                        </div>

                        <form onSubmit={handleSendNotification} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-900/20 outline-none"
                                    placeholder="e.g. Special Offer"
                                    value={notifTitle}
                                    onChange={e => setNotifTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                                <textarea 
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-900/20 outline-none resize-none"
                                    rows="4"
                                    placeholder="Write your message..."
                                    value={notifMessage}
                                    onChange={e => setNotifMessage(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                disabled={sendingNotif}
                                className="w-full py-3 bg-rose-900 text-white rounded-xl font-bold hover:bg-rose-800 transition-colors flex items-center justify-center gap-2"
                            >
                                {sendingNotif ? 'Sending...' : <><Send className="w-4 h-4" /> Send Now</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
