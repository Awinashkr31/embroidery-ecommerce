import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, MessageSquare, Palette, Scissors, Star, Camera, Check, Clock, ArrowRight } from 'lucide-react';
import { fetchSetting } from '../utils/settingsUtils';
import SEO from '../components/SEO';

const WHATSAPP_NUMBER = "917428013214";

const QUICK_OPTIONS = [
  {
    icon: "🌸",
    title: "Custom Flower Bouquet",
    desc: "Pick your favorite flowers, colors & bouquet wrapping",
    message: "Hi Crochet Wali, I want to customize a crochet flower bouquet (flowers, colors, wrapping)!"
  },
  {
    icon: "👰",
    title: "Bridal Gajra & Parandi",
    desc: "Custom scented/reusable floral accessories for wedding & haldi",
    message: "Hi Crochet Wali, I am looking for custom reusable bridal gajra / parandi for wedding styling."
  },
  {
    icon: "🎨",
    title: "Portrait Embroidery Hoop",
    desc: "Turn your couple/family photo into handcrafted thread art",
    message: "Hi Crochet Wali, I want to order a custom portrait embroidery hoop with my photo."
  },
  {
    icon: "🎁",
    title: "Bulk Wedding & Event Favors",
    desc: "10+ pieces with custom color palettes & bulk pricing",
    message: "Hi Crochet Wali, I want to inquire about bulk wedding / haldi favors (10+ pieces)."
  },
  {
    icon: "✨",
    title: "Something Completely Unique",
    desc: "Share your Pinterest reference or sketch with us",
    message: "Hi Crochet Wali, I have a unique handmade design idea I would like to discuss with you!"
  }
];

const CustomDesign = () => {
  const [bannerImage, setBannerImage] = useState("/custom-images/custom_hero_banner.webp");
  const [pageTitle, setPageTitle] = useState("Custom Design Request");
  const [pageSubtitle, setPageSubtitle] = useState("Let's bring your unique vision to life.");

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

  // Process steps
  const steps = [
    { icon: MessageSquare, title: 'Share Your Idea', desc: 'Send reference photo or idea on WhatsApp' },
    { icon: Palette, title: 'Design & Colors', desc: 'Choose yarn shades and size with artisan' },
    { icon: Scissors, title: 'Handcrafted', desc: 'Expertly knitted by hand with love' },
    { icon: Star, title: 'Doorstep Delivery', desc: 'Safely boxed & delivered with live tracking' },
  ];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Bespoke Custom Embroidery & Crochet",
    "description": "Order custom handmade gifts, personalized embroidery portrait hoops, and bespoke crochet designs directly via WhatsApp from Crochet Wali.",
    "provider": {
        "@type": "Organization",
        "name": "Crochet Wali"
    },
    "serviceType": "Handmade Gifts & Embroidery"
  };

  const getWhatsAppUrl = (customText) => {
    const text = customText || "Hi Crochet Wali, I want to discuss a custom handmade order with you!";
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-[#fdfbf7] min-h-screen font-body pb-24 lg:pb-20">
      <SEO 
        title="Custom Design Request - Handmade Gifts" 
        description="Request custom handmade gifts, personalized embroidery portrait hoops, and bespoke crochet designs directly via WhatsApp from Crochet Wali."
        image={bannerImage || "https://www.crochetwali.in/custom-images/custom_hero_banner.webp"}
        schema={serviceSchema}
      />
      
      {/* ─── Hero Section ─── */}
      <div className="relative w-full h-[60vh] min-h-[500px] overflow-hidden flex items-center justify-center">
        {/* Background */}
        <div className="absolute inset-0">
          <img 
            src={bannerImage || "/custom-images/custom_hero_banner.webp"} 
            alt="Handcrafted custom crochet & embroidery design workshop" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent opacity-90" />
        </div>

        {/* Content */}
        <div className="relative z-10 pt-16 px-5 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-semibold tracking-wide mb-6 shadow-sm font-sans">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            Made Just For You
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4 sm:mb-6 leading-[1.15] drop-shadow-md">
            {pageTitle}
          </h1>
          <p className="font-sans text-base sm:text-lg md:text-xl text-stone-200/90 max-w-xl mx-auto leading-relaxed font-normal mb-8 drop-shadow-sm">
            {pageSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 animate-fade-in-up">
             <a 
                href={getWhatsAppUrl("Hi Crochet Wali, I want to discuss a custom design!")}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-4 rounded-full font-sans font-bold text-sm tracking-wide shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2.5 active:scale-95"
             >
                <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
             </a>
             <button 
                onClick={() => document.getElementById('whatsapp-order-hub').scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-4 rounded-full font-sans font-semibold text-xs sm:text-sm tracking-wide transition-all"
             >
                View Options ↓
             </button>
          </div>
        </div>
      </div>

      {/* ─── How it Works ─── */}
      <div className="container-custom px-4 sm:px-5 -mt-8 relative z-10 mb-8 md:mb-12">
        <h2 className="sr-only">How Custom Design Works</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-stone-100 flex flex-col items-center text-center group hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-rose-50 flex items-center justify-center mb-2.5 sm:mb-3 group-hover:bg-rose-100 transition-colors">
                <step.icon className="w-5 h-5 text-rose-900" />
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="font-sans text-xs font-bold text-rose-900 bg-rose-50 w-5 h-5 rounded-full flex items-center justify-center">{i + 1}</span>
                <h3 className="font-sans text-xs sm:text-sm font-bold text-stone-900">{step.title}</h3>
              </div>
              <p className="font-sans text-xs sm:text-sm text-stone-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Gallery Section ─── */}
      <div className="py-16 md:py-24 bg-white border-b border-t border-stone-100 mt-12 mb-12">
         <div className="container-custom px-5">
             <div className="text-center mb-12">
                 <span className="font-sans text-rose-900 text-xs font-bold tracking-widest uppercase mb-2 block">Our Portfolio</span>
                 <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-stone-900 tracking-tight">Custom Masterpieces</h2>
                 <p className="font-sans text-stone-600 text-sm md:text-base max-w-xl mx-auto mt-2 leading-relaxed">A glimpse into unique items we've hand-crafted for clients across India.</p>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {[
                    "/custom-images/custom_bouquet.webp",
                    "/custom-images/custom_hoop.webp",
                    "/custom-images/custom_hairclips.webp",
                    "/custom-images/custom_keychains.webp"
                 ].map((src, i) => (
                    <div key={i} className="aspect-square bg-stone-100 rounded-[2rem] overflow-hidden group border border-stone-100 shadow-sm hover:shadow-xl transition-all">
                        <img src={src} alt="Custom Work" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                 ))}
             </div>
         </div>
      </div>

      {/* ─── Transparent Order Specs, Timelines & MOQs ─── */}
      <div className="container-custom px-5 max-w-4xl mb-12">
        <h2 className="sr-only">Order Specifications and Timelines</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200/70 shadow-sm space-y-1.5">
            <div className="font-sans text-rose-900 font-bold text-xs">📦 Minimum Order (MOQ)</div>
            <h3 className="font-sans font-bold text-stone-900 text-base">MOQ = 1 Piece</h3>
            <p className="font-sans text-stone-600 text-xs leading-relaxed">No minimum required for retail gifts. 10+ pieces qualify for bulk wedding/event discounts.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-stone-200/70 shadow-sm space-y-1.5">
            <div className="font-sans text-rose-900 font-bold text-xs">⏱️ Production Time</div>
            <h3 className="font-sans font-bold text-stone-900 text-base">1–3 Days Crafting</h3>
            <p className="font-sans text-stone-600 text-xs leading-relaxed">Each piece is hand-knitted from scratch with botanical-dyed milk cotton yarn.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-stone-200/70 shadow-sm space-y-1.5">
            <div className="font-sans text-rose-900 font-bold text-xs">🎨 Customization</div>
            <h3 className="font-sans font-bold text-stone-900 text-base">30+ Yarn Shades</h3>
            <p className="font-sans text-stone-600 text-xs leading-relaxed">Custom names, dates, quotes, color palettes, and custom bouquet combinations.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-stone-200/70 shadow-sm space-y-1.5">
            <div className="font-sans text-rose-900 font-bold text-xs">🚚 Delivery in India</div>
            <h3 className="font-sans font-bold text-stone-900 text-base">4–7 Days Transit</h3>
            <p className="font-sans text-stone-600 text-xs leading-relaxed">Shipped safely in rigid gift-ready packaging via express couriers with live tracking.</p>
          </div>
        </div>
      </div>

      {/* ─── Direct WhatsApp Consultation Hub (Compact & Sleek) ─── */}
      <div id="whatsapp-order-hub" className="container-custom px-4 sm:px-5 max-w-2xl scroll-m-24">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-stone-200/80 overflow-hidden">
          {/* Header Banner — compact */}
          <div className="bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-white px-5 py-5 sm:px-8 sm:py-6 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#25D366]/20 border border-[#25D366]/40 rounded-full text-[#25D366] text-xs font-semibold tracking-wide mb-2 font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" /> Direct Artisan WhatsApp
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold mb-1.5">
              Order or Customize on WhatsApp
            </h2>
            <p className="font-sans text-stone-200 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Skip the forms! Share your idea, photos, color choices, or Pinterest references directly with head artist Sana.
            </p>
            <div className="mt-2.5 inline-flex items-center gap-1.5 text-stone-300 text-xs font-sans">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Average response time: <strong className="text-white font-semibold">Less than 1 hour</strong></span>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            {/* Quick Option Pills */}
            <div>
              <p className="font-sans text-xs sm:text-sm font-semibold text-stone-700 mb-2.5 text-center sm:text-left">
                Select an option to start chat:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUICK_OPTIONS.map((opt, i) => (
                  <a
                    key={i}
                    href={getWhatsAppUrl(opt.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2.5 sm:p-3 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-emerald-50/50 hover:border-[#25D366] transition-all flex items-center justify-between group text-left hover:shadow-xs ${
                      i === QUICK_OPTIONS.length - 1 ? 'sm:col-span-2' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg shrink-0 p-1 bg-white rounded-lg shadow-2xs group-hover:scale-110 transition-transform">
                        {opt.icon}
                      </span>
                      <div className="min-w-0">
                        <span className="font-sans font-semibold text-stone-900 text-xs sm:text-sm block truncate">
                          {opt.title}
                        </span>
                        {opt.desc && (
                          <span className="font-sans text-[11px] text-stone-500 block truncate">
                            {opt.desc}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#25D366] group-hover:translate-x-0.5 transition-all shrink-0 ml-1.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-1 text-center space-y-2">
              <a
                href={getWhatsAppUrl("Hi Crochet Wali, I want to discuss a custom handmade order with you!")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 px-6 rounded-xl font-sans font-bold text-sm sm:text-base tracking-wide shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2.5 hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat on WhatsApp</span>
              </a>
              <p className="font-sans text-xs text-stone-500">
                Direct chat with founder Sana · Instant photo sharing · No registration
              </p>
            </div>

            {/* Reassurances — compact single row */}
            <div className="border-t border-stone-100 pt-3.5">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-6 h-6 rounded-full bg-rose-50 text-rose-900 flex items-center justify-center shrink-0">
                    <Camera className="w-3 h-3" />
                  </div>
                  <h3 className="font-sans text-xs font-semibold text-stone-900 leading-tight">Send Photos</h3>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div className="w-6 h-6 rounded-full bg-rose-50 text-rose-900 flex items-center justify-center shrink-0">
                    <Palette className="w-3 h-3" />
                  </div>
                  <h3 className="font-sans text-xs font-semibold text-stone-900 leading-tight">30+ Colors</h3>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div className="w-6 h-6 rounded-full bg-rose-50 text-rose-900 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <h3 className="font-sans text-xs font-semibold text-stone-900 leading-tight">Instant Quote</h3>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ─── Testimonials ─── */}
      <div className="py-16 md:py-24 bg-[#fdfbf7] border-b border-stone-100 mt-12 mb-16">
         <div className="container-custom px-5">
             <div className="text-center mb-12">
                 <span className="font-sans text-rose-900 text-xs font-bold tracking-widest uppercase mb-2 block">Client Stories</span>
                 <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-stone-900 mb-3 tracking-tight">What Our Customers Say</h2>
                 <p className="font-sans text-stone-600 text-sm md:text-base max-w-lg mx-auto">Real experiences from customers who ordered custom handmade gifts.</p>
             </div>
             <div className="grid md:grid-cols-3 gap-6">
                 {[
                     {name: "Sneha P.", location: "Delhi", text: "I requested a custom embroidered denim jacket for my sister's wedding. Sana's team took my rough sketch and turned it into an absolute masterpiece!"},
                     {name: "Rahul M.", location: "Mumbai", text: "Unbelievable attention to detail. The custom hoop art with my parents' portrait was the perfect anniversary gift. They were in tears."},
                     {name: "Ananya T.", location: "Bengaluru", text: "The process was so smooth. They communicated at every step, sent me design mockups, and the final piece was stunning. Pure art."}
                 ].map((t, i) => (
                     <div key={i} className="bg-white p-7 sm:p-8 rounded-[2rem] shadow-sm border border-stone-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                         <div>
                           <div className="flex text-amber-400 mb-4">
                               <Star className="w-4 h-4 fill-current"/>
                               <Star className="w-4 h-4 fill-current"/>
                               <Star className="w-4 h-4 fill-current"/>
                               <Star className="w-4 h-4 fill-current"/>
                               <Star className="w-4 h-4 fill-current"/>
                           </div>
                           <p className="font-sans text-stone-700 text-sm sm:text-[15px] italic leading-relaxed mb-6">"{t.text}"</p>
                         </div>
                         <div className="border-t border-stone-100 pt-4 flex items-center justify-between">
                           <div>
                             <p className="font-sans font-bold text-stone-900 text-sm sm:text-base">{t.name}</p>
                             <p className="font-sans text-xs text-stone-500">{t.location}</p>
                           </div>
                           <span className="font-sans text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">Verified</span>
                         </div>
                     </div>
                 ))}
             </div>
         </div>
      </div>

      {/* ─── Floating WhatsApp Button ─── */}
      <aside aria-label="WhatsApp Contact" className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40 group">
        <a
          href={getWhatsAppUrl("Hi Crochet Wali, I want to discuss a custom design order!")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-[0_6px_24px_rgba(37,211,102,0.5)] hover:shadow-[0_8px_32px_rgba(37,211,102,0.7)] hover:scale-105 active:scale-95 transition-all duration-300"
        >
          {/* Subtle pulse animation ring */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-40 animate-ping pointer-events-none" />

          {/* Official WhatsApp SVG Icon */}
          <svg
            className="w-7 h-7 md:w-8 md:h-8 fill-white relative z-10 drop-shadow-sm"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.712 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>

          {/* Active online status badge */}
          <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-300 border-2 border-white rounded-full shadow-xs" />
        </a>

        {/* Floating Tooltip / Label */}
        <div className="hidden sm:flex items-center gap-2 absolute right-full mr-3.5 top-1/2 -translate-y-1/2 bg-stone-900/90 backdrop-blur-md text-white text-xs font-sans font-semibold px-3 py-2 rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <span>Custom Order on WhatsApp</span>
        </div>
      </aside>

    </div>
  );
};

export default CustomDesign;
