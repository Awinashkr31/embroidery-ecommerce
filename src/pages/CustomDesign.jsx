import React, { useState, useEffect } from 'react';
import { Send, Loader } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useToast } from '../context/ToastContext';
import { fetchSetting } from '../utils/settingsUtils';

const CustomDesign = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [bannerImage, setBannerImage] = useState(null);
  const [bodyImage, setBodyImage] = useState(null); // New State
  const [pageTitle, setPageTitle] = useState("Custom Design Request");
  const [pageSubtitle, setPageSubtitle] = useState("Let's bring your unique vision to life.");
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'embroidery',
    description: '',
    budget: '',
    date: ''
  });

  useEffect(() => {
    const loadSettings = async () => {
        const image = await fetchSetting('custom_design_banner_image');
        if (image) setBannerImage(image);

        const bodyImg = await fetchSetting('custom_design_body_image'); 
        if (bodyImg) setBodyImage(bodyImg);

        const title = await fetchSetting('custom_design_title');
        if (title) setPageTitle(title);

        const subtitle = await fetchSetting('custom_design_subtitle');
        if (subtitle) setPageSubtitle(subtitle);
    };
    loadSettings();
  }, []);

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
    <div className="bg-[#fdfbf7] min-h-screen font-body pb-12 lg:pb-20">
      {/* Banner */}
      <div className="relative w-full h-[40vh] md:h-[50vh] min-h-[300px] overflow-hidden">
         {bannerImage ? (
            <>
                <img src={bannerImage} alt="Custom Design" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-stone-900/40" />
            </>
         ) : (
             <div className="w-full h-full bg-stone-900 flex items-center justify-center">
                 <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
             </div>
         )}
         <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4 animate-in slide-in-from-bottom-5 duration-700">
                <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 text-shadow-lg tracking-wide">
                    {pageTitle}
                </h1>
                 <p className="text-lg md:text-xl max-w-2xl mx-auto font-light text-stone-100/90 leading-relaxed">
                    {pageSubtitle}
                </p>
            </div>
        </div>
      </div>

      <div className="container-custom -mt-20 relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
          
          {/* Image Section (Left side on desktop) */}
          <div className="lg:w-5/12 relative min-h-[300px] lg:min-h-full">
            {bodyImage ? (
                 <img src={bodyImage} alt="Inspiration" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
                <div className="absolute inset-0 bg-rose-100 flex items-center justify-center">
                     <span className="text-rose-900/20 font-heading text-4xl font-bold">Enbroidery</span>
                </div>
            )}
             <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-stone-900/10" />
             <div className="absolute bottom-0 left-0 p-8 text-white lg:hidden">
                 <h3 className="text-2xl font-heading font-bold mb-2">Create Something Unique</h3>
                 <p className="text-sm opacity-90">Your imagination, our craftsmanship.</p>
             </div>
          </div>

          {/* Form Section */}
          <div className="lg:w-7/12 p-8 lg:p-12">
            <div className="mb-8">
                 <h2 className="text-3xl font-heading font-bold text-stone-900 mb-2">Start Your Creation</h2>
                 <p className="text-stone-600">Fill in the details below to begin the consultation process.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900 outline-none transition-all bg-stone-50 focus:bg-white"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900 outline-none transition-all bg-stone-50 focus:bg-white"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900 outline-none transition-all bg-stone-50 focus:bg-white"
                    placeholder="+91..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Preferred Date (Optional)</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900 outline-none transition-all bg-stone-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Design Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900 outline-none transition-all resize-none bg-stone-50 focus:bg-white"
                  placeholder="Describe your idea here. Include details about colors, style, fabric preference, etc."
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Estimated Budget</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 font-bold">₹</span>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900 outline-none transition-all bg-stone-50 focus:bg-white"
                    placeholder="e.g. 3000"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-900 text-white py-4 rounded-xl font-bold text-lg uppercase tracking-widest hover:bg-rose-800 transition-all shadow-lg hover:shadow-rose-900/30 flex items-center justify-center gap-3 transform hover:-translate-y-0.5 mt-4"
              >
                {loading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                ) : (
                    <Send className="w-5 h-5" />
                )}
                <span>{loading ? 'Submitting...' : 'Submit Request'}</span>
              </button>

              <div className="relative flex items-center justify-center my-8">
                   <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-stone-200"></div>
                   </div>
                   <div className="relative bg-white px-4 text-xs font-bold text-stone-400 uppercase tracking-widest">OR</div>
              </div>

              <a
                href="https://wa.me/917428013214?text=Hello,%20I%20am%20interested%20in%20a%20custom%20design."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold text-lg uppercase tracking-widest hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-[#25D366]/30 transform hover:-translate-y-0.5"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>Request on WhatsApp</span>
              </a>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomDesign;
