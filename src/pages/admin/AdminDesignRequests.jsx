import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Trash2, X, Check, FileText, ImageIcon, Loader, Download } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { useToast } from '../../context/ToastContext';
import { exportToCSV } from '../../utils/exportUtils';

const AdminDesignRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedRequest, setSelectedRequest] = useState(null); // For modal/details
    const [deletePendingId, setDeletePendingId] = useState(null);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setLoading(true);
                let query = supabase
                    .from('custom_requests')
                    .select('id, name, email, phone, occasion, budget, timeline, color_preferences, style_preferences, description, reference_images, status, admin_notes, created_at')
                    .order('created_at', { ascending: false });

                const { data, error } = await query;

                if (error) throw error;
                setRequests(data);
            } catch (error) {
                console.error('Error fetching requests:', error);
                addToast('Failed to load design requests', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [addToast]);

    const updateStatus = async (id, newStatus) => {
        try {
            const { error } = await supabase
                .from('custom_requests')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            setRequests(requests.map(req => 
                req.id === id ? { ...req, status: newStatus } : req
            ));
            addToast('Request status updated', 'success');
            if (selectedRequest && selectedRequest.id === id) {
                setSelectedRequest(prev => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            console.error('Error updating status:', error);
            addToast('Failed to update status', 'error');
        }
    };

    const deleteRequest = async (id) => {
        if (deletePendingId !== id) {
            setDeletePendingId(id);
            addToast('Tap delete again to remove this request.', 'error');
            return;
        }
        setDeletePendingId(null);
        try {
            const { error } = await supabase
                .from('custom_requests')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setRequests(requests.filter(req => req.id !== id));
            addToast('Request deleted', 'success');
            if (selectedRequest?.id === id) setSelectedRequest(null);
        } catch (error) {
           console.error('Error deleting request:', error);
           addToast('Failed to delete request', 'error');
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesSearch = 
            req.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-700';
            case 'in_progress': return 'bg-yellow-100 text-yellow-700';
            case 'completed': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const handleExport = () => {
        if (!requests.length) return;
        
        // Format data for export
        const dataToExport = requests.map(r => ({
            Date: new Date(r.created_at).toLocaleDateString(),
            Name: r.name,
            Email: r.email,
            Phone: r.phone || '',
            Status: r.status,
            Project_Type: 'Custom Design',
            Budget: r.budget,
            Description: r.description ? r.description.replace(/\n/g, ' ') : ''
        }));
        
        exportToCSV(dataToExport, `design_requests_${new Date().toISOString().split('T')[0]}`);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-stone-900">Design Requests</h1>
                    <p className="text-stone-500 text-sm mt-0.5">Manage custom embroidery and artwork requests</p>
                </div>
                <button 
                  onClick={handleExport}
                  className="w-full md:w-auto bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-0 text-stone-600 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors text-sm font-bold tracking-wide shrink-0"
                >
                    <Download className="w-4 h-4" /> Export CSV
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col xl:flex-row gap-4 justify-between bg-white p-4 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-0">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-stone-50 border-none focus:outline-none focus:bg-white focus:ring-2 focus:ring-rose-900/20 text-sm font-medium transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    {['all', 'new', 'in_progress', 'completed', 'cancelled'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                                statusFilter === status 
                                ? 'bg-rose-900 text-white shadow-sm' 
                                : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                            }`}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
             <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-0 overflow-hidden">
                {/* Mobile View */}
                <div className="md:hidden divide-y divide-stone-100">
                    {loading ? (
                        <div className="p-8 text-center text-stone-400">Loading requests...</div>
                    ) : filteredRequests.length === 0 ? (
                        <div className="p-8 text-center text-stone-400">No requests found.</div>
                    ) : (
                        filteredRequests.map(req => (
                            <div key={req.id} className="p-4 flex flex-col gap-3 hover:bg-stone-50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-bold text-stone-800 text-lg">{req.name}</div>
                                        <div className="text-xs text-stone-500">{req.email}</div>
                                        <div className="text-xs text-stone-500">{req.phone}</div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusColor(req.status)}`}>
                                        {req.status?.replace('_', ' ')}
                                    </span>
                                </div>
                                <p className="text-sm text-stone-600 line-clamp-2" title={req.description}>
                                    {req.description}
                                </p>
                                <div className="grid grid-cols-2 gap-2 bg-stone-50 p-2 rounded-lg text-xs">
                                    <div>
                                        <span className="font-bold text-stone-500 uppercase block mb-0.5">Budget</span>
                                        <span className="font-medium text-stone-800">{req.budget ? `₹${req.budget}` : '-'}</span>
                                    </div>
                                    <div>
                                        <span className="font-bold text-stone-500 uppercase block mb-0.5">Date</span>
                                        <span className="text-stone-600">{new Date(req.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-stone-100">
                                    <button 
                                        onClick={() => setSelectedRequest(req)}
                                        className="flex-1 flex justify-center items-center gap-1 p-2 text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors font-medium text-sm"
                                    >
                                        <FileText className="w-4 h-4" /> View
                                    </button>
                                    <div className="relative group flex-1">
                                        <select
                                            value={req.status}
                                            onChange={(e) => updateStatus(req.id, e.target.value)}
                                            className="absolute inset-0 w-full opacity-0 cursor-pointer"
                                        >
                                            <option value="new">New</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                        <button className="w-full flex justify-center items-center gap-1 p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors font-medium text-sm">
                                            <Check className="w-4 h-4" /> Status
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => deleteRequest(req.id)}
                                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-stone-50 border-b border-stone-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-widest">Client</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-widest">Description</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-widest">Budget</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-stone-500 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-stone-400">Loading requests...</td></tr>
                            ) : filteredRequests.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-stone-400">No requests found.</td></tr>
                            ) : (
                                filteredRequests.map(req => (
                                    <tr key={req.id} className="hover:bg-stone-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-stone-800">{req.name}</div>
                                            <div className="text-xs text-stone-500">{req.email}</div>
                                            <div className="text-xs text-stone-500">{req.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-stone-600 line-clamp-2 max-w-xs" title={req.description}>
                                                {req.description}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-stone-800">
                                                {req.budget ? `₹${req.budget}` : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                           <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(req.status)}`}>
                                                {req.status?.replace('_', ' ')}
                                           </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-stone-500">
                                            {new Date(req.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                 <button 
                                                    onClick={() => setSelectedRequest(req)}
                                                    className="p-2 text-rose-900 hover:bg-rose-50 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                </button>
                                                <div className="relative group">
                                                    <select
                                                        value={req.status}
                                                        onChange={(e) => updateStatus(req.id, e.target.value)}
                                                        className="absolute inset-0 w-full opacity-0 cursor-pointer"
                                                    >
                                                        <option value="new">New</option>
                                                        <option value="in_progress">In Progress</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                   <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Update Status">
                                                        <Check className="w-4 h-4" />
                                                   </button>
                                                </div>
                                                <button 
                                                    onClick={() => deleteRequest(req.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
             </div>

             {/* Details Modal */}
             {selectedRequest && (
                 <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                     <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-md" onClick={() => setSelectedRequest(null)} />
                     <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 p-8">
                         <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-stone-800">Request Details</h2>
                                <p className="text-stone-500 mt-1">ID: #{selectedRequest.id.slice(0,6).toUpperCase()}</p>
                            </div>
                            <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-stone-100 rounded-full">
                                <X className="w-6 h-6" />
                            </button>
                         </div>

                         <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-stone-50 rounded-xl">
                                    <label className="text-xs font-bold text-stone-500 uppercase">Client Name</label>
                                    <p className="font-medium text-stone-900">{selectedRequest.name}</p>
                                </div>
                                <div className="p-4 bg-stone-50 rounded-xl">
                                    <label className="text-xs font-bold text-stone-500 uppercase">Contact</label>
                                    <p className="font-medium text-stone-900">{selectedRequest.email}</p>
                                    <p className="text-sm text-stone-600">{selectedRequest.phone}</p>
                                </div>
                            </div>

                            <div className="p-4 border border-stone-100 rounded-xl">
                                <label className="text-xs font-bold text-stone-500 uppercase block mb-2">Description</label>
                                <p className="text-stone-700 whitespace-pre-wrap leading-relaxed">{selectedRequest.description}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                 <div className="p-4 border border-stone-100 rounded-xl">
                                    <label className="text-xs font-bold text-stone-500 uppercase block mb-1">Budget</label>
                                    <p className="font-medium">₹{selectedRequest.budget || 'N/A'}</p>
                                </div>
                                <div className="p-4 border border-stone-100 rounded-xl">
                                    <label className="text-xs font-bold text-stone-500 uppercase block mb-1">Timeline</label>
                                    <p className="font-medium">{selectedRequest.timeline || 'N/A'}</p>
                                </div>
                                <div className="p-4 border border-stone-100 rounded-xl">
                                    <label className="text-xs font-bold text-stone-500 uppercase block mb-1">Date</label>
                                    <p className="font-medium">{selectedRequest.date || new Date(selectedRequest.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>

                             {selectedRequest.reference_images && selectedRequest.reference_images.length > 0 && (
                                 <div>
                                     <label className="text-xs font-bold text-stone-500 uppercase block mb-3">Reference Images</label>
                                     <div className="grid grid-cols-2 gap-4">
                                         {selectedRequest.reference_images.map((img, idx) => {
                                             const isImage = img.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null;
                                             return (
                                                 <a key={idx} href={img} target="_blank" rel="noopener noreferrer" className={`block relative group rounded-xl overflow-hidden border border-stone-200 hover:border-rose-300 transition-colors ${isImage ? 'aspect-video bg-stone-100' : 'p-4 bg-stone-50 flex items-center justify-center'}`}>
                                                     {isImage ? (
                                                         <>
                                                            <img src={img} alt={`Ref ${idx}`} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                                         </>
                                                     ) : (
                                                         <div className="text-center">
                                                             <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-2 text-rose-700">
                                                                 <ImageIcon className="w-5 h-5" />
                                                             </div>
                                                             <span className="text-sm font-bold text-stone-600 block">View Link</span>
                                                             <span className="text-xs text-stone-400 truncate max-w-[150px] block">{img}</span>
                                                         </div>
                                                     )}
                                                 </a>
                                             );
                                         })}
                                     </div>
                                 </div>
                             )}
                         </div>

                         <div className="mt-8 pt-6 border-t border-stone-100 flex justify-end gap-3">
                            <button onClick={() => setSelectedRequest(null)} className="px-6 py-2 rounded-lg border border-stone-200 font-bold text-stone-600 hover:bg-stone-50">
                                Close
                            </button>
                         </div>
                     </div>
                 </div>
             )}
        </div>
    );
};

export default AdminDesignRequests;
