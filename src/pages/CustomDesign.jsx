import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader, Sparkles, CheckCircle, Phone, MessageSquare, Palette, Scissors, Star, ImagePlus, X, PenTool } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useToast } from '../context/ToastContext';
import { fetchSetting } from '../utils/settingsUtils';
import { useAuth } from '../context/AuthContext';
import { uploadImage } from '../utils/uploadUtils';

const CustomDesign = () => {
  const { addToast } = useToast();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bannerImage, setBannerImage] = useState(null);
  const [pageTitle, setPageTitle] = useState("Custom Design Request");
  const [pageSubtitle, setPageSubtitle] = useState("Let's bring your unique vision to life.");
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    description: '',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadSettings = async () => {
      const image = await fetchSetting('custom_design_banner_image');
      if (image) setBannerImage(image);
      const title = await fetchSetting('custom_design_title');
      if (title) setPageTitle(title);
      const subtitle = await fetchSetting('custom_design_subtitle');
      if (subtitle) setPageSubtitle(subtitle);
    };
    loadSettings();
  }, []);

  // Pre-fill name if logged in
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.displayName || currentUser.user_metadata?.full_name || prev.name,
      }));
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.description.trim()) {
      addToast('Please fill in all required fields.', 'error');
      return;
    }
    setLoading(true);
    try {
      // Upload selected images to Supabase Storage
      let imageUrls = [];
      if (selectedImages.length > 0) {
        for (const file of selectedImages) {
          try {
            const url = await uploadImage(file, 'images', 'custom-requests');
            imageUrls.push(url);
          } catch (uploadErr) {
            console.error('Image upload failed:', uploadErr);
          }
        }
      }

      const { error } = await supabase
        .from('custom_requests')
        .insert([{
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: currentUser?.email || null,
          description: formData.description.trim(),
          status: 'new',
          reference_images: imageUrls,
        }]);

      if (error) throw error;

      setSubmitted(true);
      addToast('Your design request has been submitted!', 'success');
    } catch (error) {
      console.error('Submission error:', error);
      addToast('Failed to submit. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({ name: '', phone: '', description: '' });
    setSelectedImages([]);
    setImagePreviews([]);
  };

  // Image handlers
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remaining = 3 - selectedImages.length;
    if (remaining <= 0) {
      addToast('Maximum 3 images allowed', 'error');
      return;
    }
    const newFiles = files.slice(0, remaining);

    // Generate previews
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews(prev => [...prev, ev.target.result]);
      };
      reader.readAsDataURL(file);
    });

    setSelectedImages(prev => [...prev, ...newFiles]);
    // Reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Process steps
  const steps = [
    { icon: MessageSquare, title: 'Share Your Idea', desc: 'Tell us what you envision' },
    { icon: Palette, title: 'We Design', desc: 'Our artists create your concept' },
    { icon: Scissors, title: 'Handcrafted', desc: 'Expert artisans bring it to life' },
    { icon: Star, title: 'Delivered', desc: 'Your unique piece, delivered' },
  ];

  return (
    <div className="bg-[#fdfbf7] min-h-screen font-body pb-24 lg:pb-20">
      {/* Hero — improved */}
      <div className="relative w-full h-[60vh] min-h-[500px] overflow-hidden flex items-center justify-center">
        {/* Background */}
        <div className="absolute inset-0">
          {bannerImage ? (
            <img src={bannerImage} alt="Custom Design" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-stone-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent opacity-90" />
        </div>

        {/* Content */}
        <div className="relative z-10 pt-16 px-5 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-rose-300" />
            Made Just For You
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 leading-tight drop-shadow-md">
            {pageTitle}
          </h1>
          <p className="text-lg md:text-xl text-stone-200 max-w-xl mx-auto leading-relaxed font-light mb-8 drop-shadow-sm">
            {pageSubtitle}
          </p>
          <div className="flex justify-center gap-4 animate-fade-in-up">
             <button 
                onClick={() => document.getElementById('request-form').scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-stone-900 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm shadow-xl hover:-translate-y-1 transition-all hover:bg-rose-50 flex items-center gap-2"
             >
                Start Designing <PenTool className="w-4 h-4 ml-1" />
             </button>
          </div>
        </div>
      </div>

      {/* How it Works — horizontal scroll on mobile */}
      <div className="container-custom px-5 -mt-8 relative z-10 mb-8 md:mb-12">
        <div className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory md:grid md:grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={i}
              className="snap-center flex-shrink-0 w-[65%] sm:w-auto bg-white rounded-2xl p-5 shadow-sm border border-stone-100 flex flex-col items-center text-center group hover:shadow-md transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center mb-3 group-hover:bg-rose-100 transition-colors">
                <step.icon className="w-5 h-5 text-rose-900" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-rose-900/60 bg-rose-50 w-5 h-5 rounded-full flex items-center justify-center">{i + 1}</span>
                <h3 className="text-sm font-bold text-stone-900">{step.title}</h3>
              </div>
              <p className="text-xs text-stone-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Gallery Section ─── */}
      <div className="py-16 md:py-24 bg-white border-b border-t border-stone-100 mt-12 mb-12">
         <div className="container-custom px-5">
             <div className="text-center mb-12">
                 <span className="text-rose-900 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-2 block">Our Portfolio</span>
                 <h2 className="text-3xl md:text-4xl font-heading font-bold text-stone-900">Custom Masterpieces</h2>
                 <p className="text-stone-500 mt-3">A glimpse into unique items we've hand-crafted for clients.</p>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {[
                    "https://images.unsplash.com/photo-1584346045657-36e78eb265db?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    "https://images.unsplash.com/photo-1627918501256-42d4a5dbfdf4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    "https://images.unsplash.com/photo-1605380536761-0cb1df7902d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    "https://images.unsplash.com/photo-1594498653385-d5172c532c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                 ].map((src, i) => (
                    <div key={i} className="aspect-square bg-stone-100 rounded-[2rem] overflow-hidden group border border-stone-100 shadow-sm hover:shadow-xl transition-all">
                        <img src={src} alt="Custom Work" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                 ))}
             </div>
         </div>
      </div>

      {/* ─── Testimonials ─── */}
      <div className="py-16 md:py-24 bg-[#fdfbf7] border-b border-stone-100 mb-16">
         <div className="container-custom px-5">
             <div className="text-center mb-12">
                 <h2 className="text-3xl md:text-4xl font-heading font-bold text-stone-900 mb-4">Client Stories</h2>
             </div>
             <div className="grid md:grid-cols-3 gap-6">
                 {[
                     {name: "Sneha P.", text: "I requested a custom embroidered denim jacket for my sister's wedding. Sana's team took my rough sketch and turned it into an absolute masterpiece!"},
                     {name: "Rahul M.", text: "Unbelievable attention to detail. The custom hoop art with my parents' portrait was the perfect anniversary gift. They were in tears."},
                     {name: "Ananya T.", text: "The process was so smooth. They communicated at every step, sent me design mockups, and the final piece was stunning. Pure art."}
                 ].map((t, i) => (
                     <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                         <div className="flex text-amber-400 mb-4">
                             <Star className="w-4 h-4 fill-current"/>
                             <Star className="w-4 h-4 fill-current"/>
                             <Star className="w-4 h-4 fill-current"/>
                             <Star className="w-4 h-4 fill-current"/>
                             <Star className="w-4 h-4 fill-current"/>
                         </div>
                         <p className="text-stone-600 mb-6 italic leading-relaxed">"{t.text}"</p>
                         <p className="font-bold text-stone-900 font-heading">{t.name}</p>
                     </div>
                 ))}
             </div>
         </div>
      </div>

      {/* Main Content */}
      <div id="request-form" className="container-custom px-5 max-w-2xl scroll-m-24">

        {submitted ? (
          /* ─── Success State ─── */
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 md:p-12 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-stone-900 mb-2">Request Received!</h2>
            <p className="text-stone-500 mb-6 max-w-sm mx-auto leading-relaxed">
              We'll review your design idea and get back to you on WhatsApp within 24 hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-stone-100 text-stone-700 rounded-xl font-bold text-sm hover:bg-stone-200 transition-colors"
              >
                Submit Another Request
              </button>
              <a
                href="https://wa.me/917428013214?text=Hi,%20I%20just%20submitted%20a%20custom%20design%20request.%20My%20name%20is%20" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#25D366] text-white rounded-xl font-bold text-sm hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        ) : (
          /* ─── Form ─── */
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
            {/* Form Header */}
            <div className="px-6 py-5 md:px-8 md:py-6 border-b border-stone-100 bg-stone-50/50">
              <h2 className="text-xl md:text-2xl font-heading font-bold text-stone-900">Tell Us Your Idea</h2>
              <p className="text-sm text-stone-500 mt-1">Just 3 simple details — we'll handle the rest.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                  Your Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-900/15 focus:border-rose-900/40 outline-none transition-all bg-stone-50/50 focus:bg-white text-stone-900 placeholder:text-stone-400"
                  placeholder="Your full name"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                  WhatsApp Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-medium">+91</span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    maxLength={10}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-900/15 focus:border-rose-900/40 outline-none transition-all bg-stone-50/50 focus:bg-white text-stone-900 placeholder:text-stone-400"
                    placeholder="98765 43210"
                  />
                </div>
                <p className="text-[11px] text-stone-400">We'll reach you on WhatsApp for design discussion</p>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                  What do you want? <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-900/15 focus:border-rose-900/40 outline-none transition-all resize-none bg-stone-50/50 focus:bg-white text-stone-900 placeholder:text-stone-400"
                  placeholder="Describe your design idea — type, colors, occasion, fabric, or share any reference..."
                />
              </div>

              {/* Reference Images — Optional */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                  Reference Images <span className="text-stone-400 font-normal normal-case">(optional, max 3)</span>
                </label>

                {/* Previews */}
                {imagePreviews.length > 0 && (
                  <div className="flex gap-3 flex-wrap">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-stone-200 group">
                        <img src={src} alt={`Ref ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload button */}
                {selectedImages.length < 3 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-stone-200 text-stone-500 text-sm font-medium hover:border-rose-300 hover:text-rose-700 hover:bg-rose-50/50 transition-all w-full justify-center"
                  >
                    <ImagePlus className="w-4 h-4" />
                    {selectedImages.length === 0 ? 'Add reference images' : `Add more (${3 - selectedImages.length} left)`}
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-900 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-rose-800 transition-all shadow-lg shadow-rose-900/15 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center pt-1">
                <div className="absolute inset-0 flex items-center top-1/2">
                  <div className="w-full border-t border-stone-200"></div>
                </div>
                <span className="relative bg-white px-4 text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                  or reach us directly
                </span>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/917428013214?text=Hello,%20I%20am%20interested%20in%20a%20custom%20design."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] text-white py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2.5 shadow-sm"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </form>
          </div>
        )}

      </div>

      {/* ─── Mobile Sticky CTA ─── */}
      <div className="fixed bottom-6 left-4 right-4 p-2 bg-white/90 backdrop-blur-2xl border border-white/50 flex items-center justify-center gap-3 lg:hidden z-50 shadow-2xl rounded-full">
          <button 
             onClick={() => document.getElementById('request-form').scrollIntoView({ behavior: 'smooth' })}
             className="w-full bg-stone-900 text-white border border-stone-900 px-4 py-3.5 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95"
          >
             Request Design <PenTool className="w-4 h-4" />
          </button>
      </div>
    </div>
  );
};

export default CustomDesign;
