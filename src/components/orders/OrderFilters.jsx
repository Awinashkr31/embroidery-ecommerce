import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

const OrderFilters = ({ 
    activeStatus, 
    setActiveStatus, 
    searchQuery, 
    setSearchQuery, 
    sortOrder, 
    setSortOrder 
}) => {
    
    const statuses = [
        { id: 'all', label: 'All Orders' },
        { id: 'pending', label: 'Active' },
        { id: 'delivered', label: 'Delivered' },
        { id: 'cancelled', label: 'Cancelled' }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-4 mb-6 sticky top-24 z-20">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input 
                        type="text" 
                        placeholder="Search by Order ID or Product Name..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-rose-900 focus:ring-1 focus:ring-rose-900 transition-all"
                    />
                </div>

                {/* Filters & Sort */}
                <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                    <div className="flex bg-stone-50 p-1 rounded-lg border border-stone-200 shrink-0">
                        {statuses.map(status => (
                            <button
                                key={status.id}
                                onClick={() => setActiveStatus(status.id)}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                                    activeStatus === status.id 
                                    ? 'bg-white text-stone-900 shadow-sm' 
                                    : 'text-stone-500 hover:text-stone-700 hover:bg-stone-100'
                                }`}
                            >
                                {status.label}
                            </button>
                        ))}
                    </div>

                    <button 
                        onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                        className="flex items-center px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-100 text-xs font-bold transition-colors shrink-0"
                        title="Sort by Date"
                    >
                        <ArrowUpDown className="w-3.5 h-3.5 mr-1" />
                        {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderFilters;
