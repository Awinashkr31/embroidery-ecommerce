import React, { useState } from 'react';
import { Send, Loader } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useToast } from '../context/ToastContext';

const CustomDesign = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'embroidery',
    description: '',
    budget: '',
    date: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        // Prepare data for insertion
        const requestData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            description: formData.description,
            budget: formData.budget,
            // If date is provided, use it, otherwise rely on created_at or store in description/notes if no column exists
            // The schema has 'timeline' or strict DATE column? Schema says: timeline VARCHAR(50).
            // But let's check schema: columns are occasion, budget, timeline, color_preferences, style_preferences, description, reference_images, status.
            // There is no specific 'date' column in the schema shown earlier (only created_at). 
            // However, the form has a 'date' field. Let's map it to 'timeline' or just include in description for now to be safe,
            // or better, map it to 'timeline' as a date string if that fits.
            timeline: formData.date ? new Date(formData.date).toLocaleDateString() : null,
            status: 'new'
        };

        requestData.reference_images = [];

        const { error } = await supabase
            .from('custom_requests')
            .insert([requestData]);

        if (error) throw error;

        addToast('Request submitted successfully!', 'success');
        setFormData({
            name: '',
            email: '',
            phone: '',
            type: 'embroidery',
            description: '',
            budget: '',
            date: '',
            file: null
        });

    } catch (error) {
        console.error('Submission error:', error);
        addToast('Failed to submit request. Please try again.', 'error');
    } finally {
        setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-warm-beige min-h-screen font-sofia py-12 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-light text-gray-800 mb-6">
            Custom <span className="text-deep-rose">Design Request</span>
          </h1>
          <p className="text-xl text-gray-600">
            Let's bring your unique vision to life. Fill out the form below to start the creative process.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-deep-rose focus:border-transparent outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-deep-rose focus:border-transparent outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-deep-rose focus:border-transparent outline-none transition-all"
                  placeholder="+91 74280 13214"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Preferred Date (Optional)</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-deep-rose focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Design Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Design Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-deep-rose focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Describe your idea, colors, size, and any specific requirements..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Estimated Budget</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-deep-rose focus:border-transparent outline-none transition-all"
                        placeholder="e.g. 5000"
                      />
                    </div>
                  </div>


              </div>
            </div>



            <button
              type="submit"
              disabled={loading}
              className="w-full bg-deep-rose text-white py-4 rounded-xl font-semibold text-lg hover:bg-deep-rose/90 transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
              ) : (
                  <Send size={20} />
              )}
              <span>{loading ? 'Submitting...' : 'Submit Request'}</span>
            </button>

            <div className="relative flex items-center justify-center my-6">
                 <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                 </div>
                 <div className="relative bg-white px-4 text-sm text-gray-500">OR</div>
            </div>

            <a
              href="https://wa.me/917428013214?text=Hello,%20I%20am%20visiting%20your%20website%20and%20I%20am%20interested%20in%20having%20a%20custom-designed%20product%20created%20specifically%20for%20me.%20Please%20let%20me%20know%20the%20process%20and%20further%20details."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#20bd5a] transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg 
                viewBox="0 0 24 24" 
                className="w-5 h-5 fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>Request on WhatsApp</span>
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomDesign;
