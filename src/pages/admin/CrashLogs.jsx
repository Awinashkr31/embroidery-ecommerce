import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../config/supabase';
import { logCrash } from '../../utils/crashLogger';
import {
  Bug, AlertTriangle, Clock,
  Monitor, Server, TrendingUp
} from 'lucide-react';

// ─── Helpers ─────────────────────────────────────────────────
const timeAgo = (dateStr) => {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const sourceConfig = {
  frontend:        { label: 'Frontend',      bg: 'bg-blue-50',    text: 'text-blue-700',    icon: Monitor },
  'edge-function': { label: 'Edge Function', bg: 'bg-amber-50',   text: 'text-amber-700',   icon: Server },
  api:             { label: 'ML API',        bg: 'bg-purple-50',  text: 'text-purple-700',  icon: Server },
  system:          { label: 'System',        bg: 'bg-stone-100',  text: 'text-stone-600',   icon: AlertTriangle },
};

const getSourceStyle = (source) => sourceConfig[source] ?? sourceConfig.system;

// ─── Skeleton ─────────────────────────────────────────────
const SkeletonRow = () => (
  <tr className="animate-pulse">
    {[...Array(6)].map((_, i) => (
      <td key={i} className="px-4 py-4"><div className="h-4 bg-stone-100 rounded w-3/4" /></td>
    ))}
  </tr>
);

// ─── Stat Card ────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, iconBg, subtitle }) => (
  <div className="bg-white p-5 rounded-2xl border-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 group relative overflow-hidden">
    <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full ${iconBg} opacity-30 group-hover:opacity-50 transition-opacity`} />
    <div className="flex justify-between items-start mb-3 relative">
      <div className={`p-2.5 rounded-xl ${iconBg} group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
    </div>
    <p className="text-stone-500 text-[10px] font-bold uppercase tracking-widest">{title}</p>
    <h3 className="text-2xl font-heading font-bold text-stone-900 mt-0.5">{value}</h3>
    {subtitle && <p className="text-xs text-stone-400 mt-1">{subtitle}</p>}
  </div>
);

// ─── Error Detail Modal ──────────────────────────────────
const ErrorDetailModal = ({ crash, onClose, onResolve }) => {
  const [notes, setNotes] = useState(crash.notes || '');
  const [saving, setSaving] = useState(false);

  const handleResolve = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('crash_logs').update({
        resolved: true,
        resolved_at: new Date().toISOString(),
        notes: notes
      }).eq('id', crash.id);
      
      if (error) throw error;
      
      onResolve(crash.id);
    } catch (err) {
      console.error('Failed to resolve:', err);
      alert('Failed to resolve: ' + err.message);
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${crash.resolved ? 'bg-emerald-50' : 'bg-red-50'}`}>
              {crash.resolved ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Bug className="w-4 h-4 text-red-600" />}
            </div>
            <div>
              <h3 className="font-heading font-bold text-stone-900 text-sm">Crash Report #{crash.id}</h3>
              <p className="text-xs text-stone-400">{new Date(crash.created_at).toLocaleString('en-IN')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-stone-100 transition-colors">
            <X className="w-4 h-4 text-stone-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto max-h-[55vh] space-y-4">
          {/* Meta pills */}
          <div className="flex flex-wrap gap-2">
            {(() => { const s = getSourceStyle(crash.source); return (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${s.bg} ${s.text}`}>
                <s.icon className="w-3 h-3" /> {s.label}
              </span>
            );})()}
            {crash.function_name && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-600">
                {crash.function_name}
              </span>
            )}
            {crash.request_method && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600">
                {crash.request_method}
              </span>
            )}
          </div>

          {/* Error message */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1 block">Error Message</label>
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-900 font-mono break-all">
              {crash.error_message || 'No error message'}
            </div>
          </div>

          {/* Stack trace */}
          {crash.error_stack && (
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1 block">Stack Trace</label>
              <pre className="bg-stone-900 text-stone-300 rounded-xl p-3 text-xs font-mono overflow-x-auto max-h-40 whitespace-pre-wrap">
                {crash.error_stack}
              </pre>
            </div>
          )}

          {/* Component stack */}
          {crash.component_stack && (
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1 block">Component Stack</label>
              <pre className="bg-blue-950 text-blue-200 rounded-xl p-3 text-xs font-mono overflow-x-auto max-h-32 whitespace-pre-wrap">
                {crash.component_stack}
              </pre>
            </div>
          )}

          {/* URL */}
          {crash.url && (
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1 block">URL</label>
              <a href={crash.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1 break-all">
                {crash.url} <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          )}

          {/* User agent */}
          {crash.user_agent && (
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1 block">User Agent</label>
              <p className="text-xs text-stone-500 break-all">{crash.user_agent}</p>
            </div>
          )}

          {/* Extra context */}
          {crash.extra_context && Object.keys(crash.extra_context).length > 0 && (
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1 block">Extra Context</label>
              <pre className="bg-stone-50 rounded-xl p-3 text-xs font-mono text-stone-600 overflow-x-auto">
                {JSON.stringify(crash.extra_context, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer — resolve */}
        {!crash.resolved && (
          <div className="p-5 border-t border-stone-100 space-y-3">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add resolution notes (optional)..."
              className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 resize-none"
              rows={2}
            />
            <button
              onClick={handleResolve}
              disabled={saving}
              className="w-full bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {saving ? 'Resolving...' : 'Mark as Resolved'}
            </button>
          </div>
        )}

        {crash.resolved && crash.notes && (
          <div className="p-5 border-t border-stone-100">
            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1 block">Resolution Notes</label>
            <p className="text-sm text-stone-600 bg-emerald-50 p-3 rounded-xl">{crash.notes}</p>
            <p className="text-xs text-stone-400 mt-1">Resolved {timeAgo(crash.resolved_at)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
const CrashLogs = () => {
  const [crashes, setCrashes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrash, setSelectedCrash] = useState(null);

  // Filters
  const [sourceFilter, setSourceFilter] = useState('all');
  const [resolvedFilter, setResolvedFilter] = useState('unresolved');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('7d');

  // Stats
  const [stats, setStats] = useState({ total: 0, unresolved: 0, today: 0, topSource: '' });

  const getDateRange = useCallback(() => {
    const now = new Date();
    switch (dateFilter) {
      case '24h': return new Date(now - 24 * 60 * 60 * 1000).toISOString();
      case '7d':  return new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
      case '30d': return new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();
      case 'all': return null;
      default:    return new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
    }
  }, [dateFilter]);

  const fetchCrashes = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('crash_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (sourceFilter !== 'all') query = query.eq('source', sourceFilter);
      if (resolvedFilter === 'unresolved') query = query.eq('resolved', false);
      if (resolvedFilter === 'resolved') query = query.eq('resolved', true);

      const dateRange = getDateRange();
      if (dateRange) query = query.gte('created_at', dateRange);

      if (searchQuery.trim()) {
        query = query.ilike('error_message', `%${searchQuery.trim()}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setCrashes(data || []);

      // Calculate stats
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      
      const { count: totalCount } = await supabase.from('crash_logs').select('*', { count: 'exact', head: true });
      const { count: unresolvedCount } = await supabase.from('crash_logs').select('*', { count: 'exact', head: true }).eq('resolved', false);
      const { count: todayCount } = await supabase.from('crash_logs').select('*', { count: 'exact', head: true }).gte('created_at', todayStart);

      // Top source
      const sourceCounts = {};
      (data || []).forEach(c => { sourceCounts[c.source] = (sourceCounts[c.source] || 0) + 1; });
      const topSource = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

      setStats({
        total: totalCount || 0,
        unresolved: unresolvedCount || 0,
        today: todayCount || 0,
        topSource: getSourceStyle(topSource).label
      });
    } catch (err) {
      console.error('Failed to fetch crash logs:', err);
    }
    setLoading(false);
  }, [sourceFilter, resolvedFilter, dateFilter, searchQuery, getDateRange]);

  useEffect(() => {
    fetchCrashes();
  }, [fetchCrashes]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchCrashes, 30000);
    return () => clearInterval(interval);
  }, [fetchCrashes]);

  const handleResolve = (id) => {
    setCrashes(prev => prev.map(c => c.id === id ? { ...c, resolved: true, resolved_at: new Date().toISOString() } : c));
    setSelectedCrash(null);
    setStats(prev => ({ ...prev, unresolved: Math.max(0, prev.unresolved - 1) }));
  };

  const handleBulkResolve = async () => {
    const unresolvedIds = crashes.filter(c => !c.resolved).map(c => c.id);
    if (unresolvedIds.length === 0) return;
    if (!window.confirm(`Mark ${unresolvedIds.length} crashes as resolved?`)) return;

    await supabase.from('crash_logs').update({
      resolved: true,
      resolved_at: new Date().toISOString(),
      notes: 'Bulk resolved'
    }).in('id', unresolvedIds);

    fetchCrashes();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-bold text-stone-900 flex items-center gap-2">
            <Bug className="w-5 h-5 text-red-500" />
            Crash Logs
          </h2>
          <p className="text-sm text-stone-500 mt-0.5">Monitor and resolve application errors</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleBulkResolve}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg transition-colors border border-emerald-200"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Resolve All Visible
          </button>
          <button
            onClick={() => {
              logCrash({
                errorMessage: 'Manual Test Crash from Admin Panel',
                errorStack: new Error().stack,
                source: 'frontend',
                extraContext: { test: true }
              });
              alert('Test crash logged! Refreshing list in 2 seconds...');
              setTimeout(fetchCrashes, 2000);
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors border border-red-200"
          >
            <Bug className="w-3.5 h-3.5" /> Test Crash
          </button>
          <button
            onClick={fetchCrashes}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-600 bg-white hover:bg-stone-50 px-3 py-2 rounded-lg transition-colors border border-stone-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Crashes" value={stats.total} icon={Bug} iconBg="bg-red-50 text-red-600" />
        <StatCard title="Unresolved" value={stats.unresolved} icon={AlertTriangle} iconBg="bg-amber-50 text-amber-600" />
        <StatCard title="Today" value={stats.today} icon={Clock} iconBg="bg-blue-50 text-blue-600" />
        <StatCard title="Top Source" value={stats.topSource} icon={TrendingUp} iconBg="bg-purple-50 text-purple-600" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search error messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
            />
          </div>

          {/* Source filter */}
          <div className="relative">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-200 cursor-pointer"
            >
              <option value="all">All Sources</option>
              <option value="frontend">Frontend</option>
              <option value="edge-function">Edge Functions</option>
              <option value="api">ML API</option>
              <option value="system">System</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={resolvedFilter}
              onChange={(e) => setResolvedFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-200 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="unresolved">Unresolved</option>
              <option value="resolved">Resolved</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
          </div>

          {/* Date filter */}
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-200 cursor-pointer"
            >
              <option value="24h">Last 24h</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="all">All time</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100">
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-400">Status</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-400">Source</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-400 min-w-[250px]">Error</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-400">Function</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-400">When</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && crashes.length === 0 ? (
                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              ) : crashes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <CheckCircle2 className="w-12 h-12 text-emerald-200 mx-auto mb-3" />
                    <p className="text-stone-500 font-bold">No crashes found</p>
                    <p className="text-stone-400 text-sm mt-1">Your app is running smoothly! 🎉</p>
                  </td>
                </tr>
              ) : (
                crashes.map((crash) => {
                  const src = getSourceStyle(crash.source);
                  const SrcIcon = src.icon;
                  return (
                    <tr
                      key={crash.id}
                      onClick={() => setSelectedCrash(crash)}
                      className="border-b border-stone-50 hover:bg-stone-50/50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        {crash.resolved ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">
                            <CheckCircle2 className="w-3 h-3" /> Resolved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 animate-pulse">
                            <Bug className="w-3 h-3" /> Open
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${src.bg} ${src.text}`}>
                          <SrcIcon className="w-3 h-3" /> {src.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-stone-900 font-medium truncate max-w-xs"
                           title={crash.error_message}>
                          {crash.error_message || 'No message'}
                        </p>
                        {crash.url && (
                          <p className="text-xs text-stone-400 truncate max-w-xs mt-0.5" title={crash.url}>
                            {crash.url}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-stone-500 font-mono">
                          {crash.function_name || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-stone-500 whitespace-nowrap">{timeAgo(crash.created_at)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedCrash(crash); }}
                          className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors text-stone-400 hover:text-stone-600"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {crashes.length > 0 && (
          <div className="px-4 py-3 border-t border-stone-100 flex items-center justify-between">
            <p className="text-xs text-stone-400">
              Showing {crashes.length} crash{crashes.length !== 1 ? 'es' : ''} · Auto-refreshes every 30s
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedCrash && (
        <ErrorDetailModal
          crash={selectedCrash}
          onClose={() => setSelectedCrash(null)}
          onResolve={handleResolve}
        />
      )}
    </div>
  );
};

export default CrashLogs;
