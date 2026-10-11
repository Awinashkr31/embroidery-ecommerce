import React, { useState, useEffect } from 'react';
import { Sparkles, Phone, MessageSquare, Palette, Scissors, Star, Gift, Camera, Check, Clock, ArrowRight, Heart } from 'lucide-react';
import { fetchSetting } from '../utils/settingsUtils';
import SEO from '../components/SEO';

const WHATSAPP_NUMBER = "917428013214";
const WHATSAPP_DISPLAY = "+91 74280 13214";

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
  const [bannerImage, setBannerImage] = useState(null);
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
        schema={serviceSchema}
      />
      
      {/* ─── Hero Section ─── */}
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
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 animate-fade-in-up">
             <a 
                href={getWhatsAppUrl("Hi Crochet Wali, I want to discuss a custom design!")}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2.5 active:scale-95"
             >
                <Phone className="w-4 h-4" /> Chat on WhatsApp
             </a>
             <button 
                onClick={() => document.getElementById('whatsapp-order-hub').scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all"
             >
                View Options ↓
             </button>
          </div>
        </div>
      </div>

      {/* ─── How it Works ─── */}
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200/70 shadow-sm space-y-1.5">
            <div className="text-rose-900 font-bold text-xs uppercase tracking-wider">📦 Minimum Order (MOQ)</div>
            <div className="font-heading font-bold text-stone-900 text-base">MOQ = 1 Piece</div>
            <p className="text-stone-500 text-xs">No minimum required for retail gifts. 10+ pieces qualify for bulk wedding/event discounts.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-stone-200/70 shadow-sm space-y-1.5">
            <div className="text-rose-900 font-bold text-xs uppercase tracking-wider">⏱️ Production Time</div>
            <div className="font-heading font-bold text-stone-900 text-base">1–3 Days Crafting</div>
            <p className="text-stone-500 text-xs">Each piece is hand-knitted from scratch with botanical-dyed milk cotton yarn.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-stone-200/70 shadow-sm space-y-1.5">
            <div className="text-rose-900 font-bold text-xs uppercase tracking-wider">🎨 Customization</div>
            <div className="font-heading font-bold text-stone-900 text-base">30+ Yarn Shades</div>
            <p className="text-stone-500 text-xs">Custom names, dates, quotes, color palettes, and custom bouquet combinations.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-stone-200/70 shadow-sm space-y-1.5">
            <div className="text-rose-900 font-bold text-xs uppercase tracking-wider">🚚 Delivery in India</div>
            <div className="font-heading font-bold text-stone-900 text-base">4–7 Days Transit</div>
            <p className="text-stone-500 text-xs">Shipped safely in rigid gift-ready packaging via express couriers with live tracking.</p>
          </div>
        </div>
      </div>

      {/* ─── Bulk & Wedding Favors Callout ─── */}
      <div className="container-custom px-5 max-w-4xl mb-10 -mt-6 relative z-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950 via-stone-900 to-amber-950 text-white p-6 md:p-8 shadow-xl border border-rose-900/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/20 border border-rose-400/30 rounded-full text-rose-300 text-[11px] font-bold uppercase tracking-widest">
                <Gift className="w-3.5 h-3.5" /> Bulk &amp; Event Orders (10+ Pieces)
              </div>
              <h3 className="text-xl md:text-2xl font-heading font-bold text-white">
                Planning Wedding Favors or Haldi Giveaways?
              </h3>
              <p className="text-stone-300 text-xs md:text-sm max-w-xl leading-relaxed">
                Need matching crochet gajras, bridesmaid floral gift boxes, or bulk amigurumi charms? We provide dedicated artisan design, custom color themes, and special tiered bulk pricing.
              </p>
            </div>
            <a
              href={getWhatsAppUrl("Hi Crochet Wali, I am inquiring about a bulk order (wedding favors/haldi/events, 10+ pieces).")}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-6 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-105 active:scale-95 w-full sm:w-auto"
            >
              <Phone className="w-4 h-4" /> Bulk WhatsApp Inquiry
            </a>
          </div>
        </div>
      </div>

      {/* ─── Direct WhatsApp Consultation Hub (Replaces Web Form) ─── */}
      <div id="whatsapp-order-hub" className="container-custom px-5 max-w-3xl scroll-m-24">
        <div className="bg-white rounded-3xl shadow-xl border border-stone-200/80 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-white px-6 py-8 md:px-10 md:py-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-rose-500/10 rounded-full blur-2xl" />
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#25D366]/20 border border-[#25D366]/40 rounded-full text-[#25D366] text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" /> Direct Artisan WhatsApp
            </div>
            <h2 className="text-2xl md:text-4xl font-heading font-bold mb-3">
              Order or Customize on WhatsApp
            </h2>
            <p className="text-stone-300 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
              Skip the forms! Share your idea, photos, color choices, or Pinterest references directly with head artist Sana.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-stone-400 text-xs">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Replies usually within <strong>15–30 minutes</strong></span>
            </div>
          </div>

          <div className="p-6 md:p-10 space-y-8">
            {/* Quick Option Cards */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 text-center md:text-left">
                Select an option to prefill WhatsApp message:
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {QUICK_OPTIONS.map((opt, i) => (
                  <a
                    key={i}
                    href={getWhatsAppUrl(opt.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl border border-stone-200/80 hover:border-[#25D366] hover:bg-emerald-50/30 transition-all flex items-start gap-3 group text-left hover:shadow-md"
                  >
                    <span className="text-2xl p-2 bg-stone-50 rounded-xl group-hover:scale-110 transition-transform">
                      {opt.icon}
                    </span>
                    <div className="flex-1">
                      <div className="font-bold text-stone-900 text-sm flex items-center justify-between">
                        {opt.title}
                        <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#25D366] group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2 text-center space-y-4">
              <a
                href={getWhatsAppUrl("Hi Crochet Wali, I want to discuss a custom handmade order with you!")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 px-8 rounded-2xl font-bold text-base tracking-wide shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-3 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Phone className="w-5 h-5 fill-current" />
                <span>Chat on WhatsApp ({WHATSAPP_DISPLAY})</span>
              </a>
              <p className="text-xs text-stone-400">
                Direct chat with founder Sana · No registration required · Instant photo sharing
              </p>
            </div>

            {/* Why Chat on WhatsApp Reassurances */}
            <div className="border-t border-stone-100 pt-6">
              <div className="grid sm:grid-cols-3 gap-4 text-center sm:text-left">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-rose-50 text-rose-900 flex items-center justify-center shrink-0">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Send Any Reference</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">Share photos, sketches, or screenshot ideas</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-900 flex items-center justify-center shrink-0">
                    <Palette className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Choose Any Colors</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">Pick from 30+ botanical yarn shades</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-900 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Price &amp; Mockup</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">Clear upfront quote with dispatch timeline</p>
                  </div>
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

      {/* ─── Mobile Sticky CTA ─── */}
      <div className="fixed bottom-6 left-4 right-4 p-2 bg-white/95 backdrop-blur-2xl border border-white/50 flex items-center justify-center gap-3 lg:hidden z-50 shadow-2xl rounded-full">
          <a 
             href={getWhatsAppUrl("Hi Crochet Wali, I want to discuss a custom design!")}
             target="_blank"
             rel="noopener noreferrer"
             className="w-full bg-[#25D366] text-white px-4 py-3.5 rounded-full font-bold text-sm tracking-wide uppercase hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95"
          >
             <Phone className="w-4 h-4" /> Chat on WhatsApp
          </a>
      </div>
    </div>
  );
};

export default CustomDesign;
