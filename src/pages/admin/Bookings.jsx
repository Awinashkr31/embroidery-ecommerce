import React, { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';
import { Calendar, Clock, User, Phone, Mail, FileText, CheckCircle, XCircle, Loader, Filter } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { addToast } = useToast();

  const fetchBookings = React.useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mehndi_bookings')
        .select('id, name, email, phone, service_type, date, time, duration, location, guest_count, special_requests, status, total_cost, admin_notes, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      addToast('Error fetching bookings', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('mehndi_bookings')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
      addToast(`Booking status updated to ${newStatus}`, 'success');
    } catch (error) {
      console.error('Error updating status:', error);
      addToast('Failed to update status: ' + error.message, 'error');
    }
  };

  const filteredBookings = filter === 'all' 

    ? bookings 
    : bookings.filter(b => b.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader className="animate-spin text-rose-900" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-stone-900">Mehndi Bookings</h1>
          <p className="text-stone-500 text-sm mt-0.5">Manage customer appointments</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white px-3 py-2.5 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-0 w-full md:w-auto">
          <Filter className="w-4 h-4 text-stone-400 shrink-0" />
          <select 
            className="bg-transparent text-sm font-bold border-none focus:ring-0 text-stone-700 outline-none w-full cursor-pointer"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white p-8 text-center text-gray-500 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-0">
            No bookings found.
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white p-4 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-0 flex flex-col space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-900 font-bold text-sm flex-shrink-0">
                    {booking.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{booking.name}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 mt-1 rounded text-[10px] font-bold border ${getStatusColor(booking.status)} uppercase tracking-wide`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex flex-col text-gray-500 space-y-1 text-xs">
                  <span className="flex items-center"><Mail className="w-3.5 h-3.5 mr-1" /> {booking.email}</span>
                  <span className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1" /> {booking.phone}</span>
                </div>
                <div className="flex flex-col text-gray-800 space-y-1 text-xs">
                  <div className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    {new Date(booking.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    {booking.time}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-50">
                <p className="text-sm font-medium text-gray-800 bg-gray-100 inline-block px-2 py-1 rounded text-xs">{booking.service_type}</p>
                {booking.special_requests && (
                  <div className="mt-2 text-xs text-gray-500 flex items-start bg-yellow-50 p-2 rounded border border-yellow-100">
                    <FileText className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0 text-yellow-600" />
                    <span className="italic">"{booking.special_requests}"</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end items-center pt-3 gap-2 border-t border-stone-50 mt-2">
                {booking.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => updateStatus(booking.id, 'confirmed')}
                      className="flex-1 flex justify-center items-center gap-1 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" /> Confirm
                    </button>
                    <button 
                      onClick={() => updateStatus(booking.id, 'cancelled')}
                      className="flex-1 flex justify-center items-center gap-1 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Cancel
                    </button>
                  </>
                )}
                {booking.status === 'confirmed' && (
                  <button 
                    onClick={() => updateStatus(booking.id, 'completed')}
                    className="w-full flex justify-center items-center gap-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" /> Mark Completed
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Package</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-900 font-bold text-xs flex-shrink-0">
                          {booking.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{booking.name}</p>
                          <div className="flex flex-col text-xs text-gray-500 mt-1 space-y-0.5">
                            <span className="flex items-center"><Mail className="w-3 h-3 mr-1" /> {booking.email}</span>
                            <span className="flex items-center"><Phone className="w-3 h-3 mr-1" /> {booking.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-800 bg-gray-100 inline-block px-2 py-1 rounded text-xs">{booking.service_type}</p>
                      {booking.special_requests && (
                        <div className="mt-2 text-xs text-gray-500 max-w-xs flex items-start bg-yellow-50 p-2 rounded border border-yellow-100">
                          <FileText className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0 text-yellow-600" />
                          <span className="italic">"{booking.special_requests}"</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-800">
                        <div className="flex items-center font-medium mb-1">
                          <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                          {new Date(booking.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                          {booking.time}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)} uppercase tracking-wide`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {booking.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => updateStatus(booking.id, 'confirmed')}
                              title="Confirm Booking"
                              className="p-1.5 hover:bg-green-100 text-gray-400 hover:text-green-600 rounded transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => updateStatus(booking.id, 'cancelled')}
                              title="Cancel Booking"
                              className="p-1.5 hover:bg-red-100 text-gray-400 hover:text-red-600 rounded transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                         {booking.status === 'confirmed' && (
                          <button 
                            onClick={() => updateStatus(booking.id, 'completed')}
                            title="Mark Completed"
                            className="text-xs border border-gray-200 hover:bg-gray-50 px-2 py-1 rounded transition-colors"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
