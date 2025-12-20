import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { Bell, Send, Filter, Users, Search, CheckCircle, AlertCircle } from 'lucide-react';

const AdminNotifications = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    
    // Form State
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');
    const [targetAudience, setTargetAudience] = useState('all'); // all, active, churned, whales, specific
    const [specificEmail, setSpecificEmail] = useState('');
    
    // Success/Error Feedback
    const [feedback, setFeedback] = useState({ type: '', msg: '' });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Fetch both orders (for logic) and users (for auth existence)
                // Simplified: Fetch orders to calculate segments like before
                const { data: ordersData } = await supabase.from('orders').select('*');
                const { data: usersData } = await supabase.from('users').select('*');
                
                // Process logic (Reusing similar logic to Users.jsx for consistency)
                const processed = processUserSegments(ordersData || [], usersData || []);
                setUsers(processed);
            } catch (error) {
                console.error('Error fetching users for notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const processUserSegments = (orders, authUsers) => {
        const map = new Map();
        
        // 1. Auth Users
        authUsers.forEach(u => {
            if(!u.email) return;
            map.set(u.email, { email: u.email, totalSpend: 0, lastOrder: null, status: 'Registered' });
        });

        // 2. Order Data integration
        orders.forEach(o => {
            if(!o.customer_email) return;
            if(!map.has(o.customer_email)) {
                map.set(o.customer_email, { email: o.customer_email, totalSpend: 0, lastOrder: o.created_at, status: 'Active' });
            }
            const u = map.get(o.customer_email);
            u.totalSpend += Number(o.total) || 0;
            if(new Date(o.created_at) > new Date(u.lastOrder || 0)) u.lastOrder = o.created_at;
        });

        // 3. Define Segments
        return Array.from(map.values()).map(u => {
            let status = 'Active';
            const daysSince = u.lastOrder ? (new Date() - new Date(u.lastOrder))/(1000*60*60*24) : 999;
            
            if(!u.lastOrder) status = 'Registered';
            else if(daysSince > 180) status = 'Churned';
            else if(daysSince > 90) status = 'At Risk';
            
            // Whales: Spend > 10000 (arbitrary threshold for demo)
            const isWhale = u.totalSpend > 10000;

            return { ...u, status, isWhale };
        });
    };

    const getTargetEmails = () => {
        switch(targetAudience) {
            case 'all': return users.map(u => u.email);
            case 'active': return users.filter(u => u.status === 'Active').map(u => u.email);
            case 'churned': return users.filter(u => u.status === 'Churned').map(u => u.email);
            case 'whales': return users.filter(u => u.isWhale).map(u => u.email);
            case 'specific': return [specificEmail];
            default: return [];
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        setSending(true);
        setFeedback({ type: '', msg: '' });

        const targets = getTargetEmails().filter(e => e && e.includes('@')); // Basic validation
        
        if(targets.length === 0) {
            setFeedback({ type: 'error', msg: 'No valid users found for this criteria.' });
            setSending(false);
            return;
        }

        try {
            // Bulk Insert
            const notifications = targets.map(email => ({
                user_email: email,
                title,
                message,
                type,
                is_read: false
            }));

            const { error } = await supabase.from('notifications').insert(notifications);

            if(error) throw error;

            setFeedback({ type: 'success', msg: `Successfully sent to ${targets.length} users!` });
            // Reset form
            setTitle('');
            setMessage('');
            if(targetAudience === 'specific') setSpecificEmail('');

        } catch (error) {
            console.error('Send Error:', error);
            setFeedback({ type: 'error', msg: 'Failed to send notifications.' });
        } finally {
            setSending(false);
        }
    };

    const audienceCount = getTargetEmails().length;

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto font-body space-y-8">
            <div>
                <h1 className="text-3xl font-heading font-bold text-stone-900">Push Notifications</h1>
                <p className="text-stone-500 mt-1">Engage with your customers through alerts and offers.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Composer */}
                <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
                    <form onSubmit={handleSend} className="space-y-6">
                        {/* Target Selection */}
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">Target Audience</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {[
                                    { id: 'all', label: 'All Users', icon: Users },
                                    { id: 'active', label: 'Active', icon: CheckCircle },
                                    { id: 'whales', label: 'High Spenders', icon: AlertCircle }, // Using alert as placeholder icon
                                    { id: 'churned', label: 'Churned', icon: AlertCircle },
                                    { id: 'specific', label: 'Specific User', icon: Search }
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => setTargetAudience(opt.id)}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                                            targetAudience === opt.id 
                                            ? 'bg-rose-50 border-rose-900 text-rose-900 ring-1 ring-rose-900' 
                                            : 'bg-white border-stone-200 text-stone-500 hover:border-rose-200'
                                        }`}
                                    >
                                        <opt.icon className={`w-5 h-5 mb-1 ${targetAudience === opt.id ? 'text-rose-900' : 'text-stone-400'}`} />
                                        <span className="text-xs font-bold">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                            
                            {targetAudience === 'specific' && (
                                <div className="mt-4 animate-in slide-in-from-top-2">
                                    <input 
                                        type="email" 
                                        placeholder="Enter user email address" 
                                        value={specificEmail}
                                        onChange={e => setSpecificEmail(e.target.value)}
                                        className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-rose-900/20 outline-none"
                                        required
                                    />
                                </div>
                            )}

                            <div className="mt-2 text-xs font-medium text-stone-500">
                                Est. Reach: <span className="text-rose-900 font-bold">{audienceCount} Users</span>
                            </div>
                        </div>

                        {/* Message Content */}
                        <div className="space-y-4 pt-4 border-t border-stone-100">
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-2">Notification Type</label>
                                <div className="flex gap-4">
                                    {['info', 'promo', 'warning', 'success'].map(t => (
                                        <label key={t} className="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="type" 
                                                value={t} 
                                                checked={type === t} 
                                                onChange={e => setType(e.target.value)}
                                                className="text-rose-900 focus:ring-rose-900" 
                                            />
                                            <span className="capitalize text-sm text-stone-600">{t}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-2">Title</label>
                                <input 
                                    type="text" 
                                    value={title} 
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="e.g., Flash Sale: 50% Off Approved!" 
                                    className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-rose-900/20 outline-none font-bold text-stone-800"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-2">Message</label>
                                <textarea 
                                    value={message} 
                                    onChange={e => setMessage(e.target.value)}
                                    placeholder="Write your notification message here..." 
                                    rows="4"
                                    className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-rose-900/20 outline-none resize-none"
                                    required
                                ></textarea>
                            </div>
                        </div>

                        {feedback.msg && (
                            <div className={`p-4 rounded-lg flex items-center gap-2 ${feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {feedback.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                <span className="font-bold text-sm">{feedback.msg}</span>
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={sending || audienceCount === 0}
                            className="w-full py-3 bg-rose-900 text-white rounded-xl font-bold hover:bg-rose-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {sending ? (
                                <>Sending...</>
                            ) : (
                                <> <Send className="w-4 h-4" /> Send Notification </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Preview Card */}
                <div className="space-y-6">
                    <div className="bg-stone-900 text-white p-6 rounded-2xl shadow-lg">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-4">Preview</h3>
                        <div className="bg-white text-stone-900 rounded-xl p-4 shadow-md border-l-4 border-rose-900">
                             <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-sm">{title || 'Notification Title'}</h4>
                                <span className="text-[10px] text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded capitalize">{type}</span>
                            </div>
                            <p className="text-xs text-stone-500 leading-relaxed">
                                {message || 'Your message content will appear here exactly as the user sees it.'}
                            </p>
                            <div className="mt-2 text-[10px] text-stone-400">Just now</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminNotifications;
