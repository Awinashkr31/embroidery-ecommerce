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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-semibold tracking-wide mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            Made Just For You
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6 leading-tight drop-shadow-md">
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
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-4 rounded-full font-bold text-sm tracking-wide shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2.5 active:scale-95"
             >
                <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
             </a>
             <button 
                onClick={() => document.getElementById('whatsapp-order-hub').scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-4 rounded-full font-semibold text-xs tracking-wide transition-all"
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
                <span className="text-xs font-bold text-rose-900 bg-rose-50 w-5 h-5 rounded-full flex items-center justify-center">{i + 1}</span>
                <h3 className="text-xs sm:text-sm font-bold text-stone-900">{step.title}</h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Gallery Section ─── */}
      <div className="py-16 md:py-24 bg-white border-b border-t border-stone-100 mt-12 mb-12">
         <div className="container-custom px-5">
             <div className="text-center mb-12">
                 <span className="text-rose-900 text-xs font-bold tracking-wider uppercase mb-2 block">Our Portfolio</span>
                 <h2 className="text-3xl md:text-4xl font-heading font-bold text-stone-900">Custom Masterpieces</h2>
                 <p className="text-stone-600 text-sm md:text-base mt-3">A glimpse into unique items we've hand-crafted for clients.</p>
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
            <div className="text-rose-900 font-bold text-xs">📦 Minimum Order (MOQ)</div>
            <h3 className="font-heading font-bold text-stone-900 text-base">MOQ = 1 Piece</h3>
            <p className="text-stone-600 text-xs">No minimum required for retail gifts. 10+ pieces qualify for bulk wedding/event discounts.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-stone-200/70 shadow-sm space-y-1.5">
            <div className="text-rose-900 font-bold text-xs">⏱️ Production Time</div>
            <h3 className="font-heading font-bold text-stone-900 text-base">1–3 Days Crafting</h3>
            <p className="text-stone-600 text-xs">Each piece is hand-knitted from scratch with botanical-dyed milk cotton yarn.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-stone-200/70 shadow-sm space-y-1.5">
            <div className="text-rose-900 font-bold text-xs">🎨 Customization</div>
            <h3 className="font-heading font-bold text-stone-900 text-base">30+ Yarn Shades</h3>
            <p className="text-stone-600 text-xs">Custom names, dates, quotes, color palettes, and custom bouquet combinations.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-stone-200/70 shadow-sm space-y-1.5">
            <div className="text-rose-900 font-bold text-xs">🚚 Delivery in India</div>
            <h3 className="font-heading font-bold text-stone-900 text-base">4–7 Days Transit</h3>
            <p className="text-stone-600 text-xs">Shipped safely in rigid gift-ready packaging via express couriers with live tracking.</p>
          </div>
        </div>
      </div>

      {/* ─── Direct WhatsApp Consultation Hub (Replaces Web Form) ─── */}
      <div id="whatsapp-order-hub" className="container-custom px-5 max-w-3xl scroll-m-24">
        <div className="bg-white rounded-3xl shadow-xl border border-stone-200/80 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-white px-6 py-8 md:px-10 md:py-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-rose-500/10 rounded-full blur-2xl" />
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#25D366]/20 border border-[#25D366]/40 rounded-full text-[#25D366] text-xs font-semibold tracking-wide mb-3">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" /> Direct Artisan WhatsApp
            </div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3">
              Order or Customize on WhatsApp
            </h2>
            <p className="text-stone-200 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
              Skip the forms! Share your idea, photos, color choices, or Pinterest references directly with head artist Sana.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-stone-200 text-xs">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Replies usually within <strong>15–30 minutes</strong></span>
            </div>
          </div>

          <div className="p-6 md:p-10 space-y-8">
            {/* Quick Option Cards */}
            <div>
              <p className="text-sm font-semibold text-stone-600 mb-3 text-center md:text-left">
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
                        <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-[#25D366] group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
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
                <MessageCircle className="w-5 h-5" />
                <span>Chat on WhatsApp</span>
              </a>
              <p className="text-xs text-stone-500">
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
                    <h3 className="text-sm font-bold text-stone-900">Send Any Reference</h3>
                    <p className="text-xs text-stone-600 mt-0.5">Share photos, sketches, or screenshot ideas</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-rose-50 text-rose-900 flex items-center justify-center shrink-0">
                    <Palette className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">Choose Any Colors</h3>
                    <p className="text-xs text-stone-600 mt-0.5">Pick from 30+ botanical yarn shades</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-rose-50 text-rose-900 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">Price &amp; Mockup</h3>
                    <p className="text-xs text-stone-600 mt-0.5">Clear upfront quote with dispatch timeline</p>
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

    </div>
  );
};

export default CustomDesign;
