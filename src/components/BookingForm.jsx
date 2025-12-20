import React, { useState } from 'react';
import { supabase } from '../config/supabase';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, X, Loader } from 'lucide-react';

const BookingForm = ({ selectedPackage, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    date: '',
    time_slot: '',
    notes: ''
  });

  const timeSlots = [
    "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", 
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('mehndi_bookings')
        .insert([
          {
            name: formData.customer_name,
            email: formData.email,
            phone: formData.phone,
            date: formData.date,
            time: formData.time_slot,
            service_type: selectedPackage?.name,
            special_requests: formData.notes,
            total_cost: selectedPackage?.price,
            duration: selectedPackage?.duration,
            guest_count: 1 // Default to 1 or could be added to form if needed
          }
        ]);

      if (error) throw error;

      if (onSuccess) onSuccess();
      if (onClose) onClose();
      
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-rose-50/50">
          <div>
            <h2 className="text-xl font-heading font-bold text-gray-800">Book '{selectedPackage?.name}'</h2>
            <p className="text-sm text-gray-500">Complete your reservation</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-rose-100 rounded-full transition-colors text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="customer_name"
                required
                placeholder="Full Name"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all"
                value={formData.customer_name}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="Phone Number"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
              <div className="relative">
                <Clock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <select
                  name="time_slot"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all appearance-none bg-white"
                  value={formData.time_slot}
                  onChange={handleChange}
                >
                  <option value="">Select Time</option>
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative">
              <MessageSquare className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <textarea
                name="notes"
                placeholder="Any special requests or details needed?"
                rows="3"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all resize-none"
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-rose-800 transition-all shadow-lg hover:shadow-rose-900/30 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
