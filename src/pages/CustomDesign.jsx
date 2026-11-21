import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageCircle, 
  MessageSquare, 
  Palette, 
  Scissors, 
  Star,
  Truck, 
  Check, 
  Clock, 
  ChevronDown, 
  Send
} from 'lucide-react';
import { fetchSetting } from '../utils/settingsUtils';
import SEO from '../components/SEO';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import defaultHeroBanner from '../assets/custom_hero_banner.webp';

const WHATSAPP_NUMBER = "917428013214";

// ─── Verified FAQs (Preserves the 5 live FAQs word-for-word + supplementary additions) ───
const FAQS = [
  {
    question: "How do I order a custom design?",
    answer: "Share your reference photo or idea on WhatsApp, choose yarn shades and size with the artisan, and the piece is handcrafted for you."
  },
  {
    question: "What is the minimum order?",
    answer: "MOQ is 1 piece for retail gifts; orders of 10+ pieces qualify for bulk wedding/event discounts."
  },
  {
    question: "How long does a custom order take?",
    answer: "Handmade in 7–14 days based on product, plus 4–7 business days shipping across India."
  },
  {
    question: "What can I customise?",
    answer: "Custom names, dates, quotes, colour palettes, and bouquet combinations, with 30+ yarn shades to choose from."
  },
  {
    question: "Do you deliver across India?",
    answer: "Yes, custom orders are shipped across India in rigid gift-ready packaging."
  },
  {
    question: "Can I share a reference image from Pinterest or Instagram?",
    answer: "Yes! You can share screenshots, Pinterest pins, or reference sketches directly through WhatsApp. Our team at Crochet Wali reviews the image to assess crochet feasibility and translates it into handmade yarn stitches."
  },
  {
    question: "How is the price of a custom crochet order calculated?",
    answer: "Because every custom piece is unique, pricing is provided by upfront quotation based on design complexity, dimensions, yarn requirements, and quantity before you confirm your order."
  },
  {
    question: "Can I request delivery before a specific birthday or anniversary?",
    answer: "Yes, please share your required delivery date during consultation. We will verify if your timeline fits within our crafting schedule (handmade in 7–14 days based on product) plus 4–7 business days transit."
  },
  {
    question: "What payment methods are available?",
    answer: "We accept UPI (Google Pay, PhonePe, Paytm), Net Banking, and Debit/Credit Cards via secure payment links once your quotation and design details are confirmed."
  },
  {
    question: "Will the finished handmade product look exactly like my reference image?",
    answer: "Handmade crochet and embroidery have authentic artisanal individuality. We replicate the reference style, colors, and proportions as closely as possible, and we share progress photos of your finished creation before dispatch."
  }
];

// ─── 4-Step Process ───
const PROCESS_STEPS = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Share Your Idea",
    desc: "Send your photo, colors, or design idea on WhatsApp."
  },
  {
    number: "02",
    icon: Palette,
    title: "We Design",
    desc: "We customize your design and share the upfront quote."
  },
  {
    number: "03",
    icon: Scissors,
    title: "Crafted",
    desc: "Handmade in 7–14 days based on product with love and care."
  },
  {
    number: "04",
    icon: Truck,
    title: "Delivered",
    desc: "Delivered across India in 4–7 business days with live tracking."
  }
];

// ─── Verified Client Stories (Preserves exact live wording) ───
const CLIENT_STORIES = [
  {
    name: "Sneha P.",
    location: "Delhi",
    text: "I requested a custom embroidered denim jacket for my sister's wedding. The Crochet Wali team took my rough sketch and turned it into an absolute masterpiece!"
  },
  {
    name: "Rahul M.",
    location: "Mumbai",
    text: "Unbelievable attention to detail. The custom hoop art with my parents' portrait was the perfect anniversary gift. They were in tears."
  },
  {
    name: "Ananya T.",
    location: "Bengaluru",
    text: "The process was so smooth. They communicated at every step, sent me design mockups, and the final piece was stunning. Pure art."
  }
];

// ─── Custom Masterpieces (6 Authentic Studio Products) ───
const CUSTOM_MASTERPIECES = [
  {
    src: "https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1778557378262-05kqnn.webp",
    title: "Crochet Rose Bouquet",
    category: "Everlasting Floral Bouquets",
    alt: "Handcrafted Crochet Rose Bouquet with Red and Pink Roses by Crochet Wali",
    link: "/product/crochet-rose-bouquet-5a1292b6-9305-4cd1-8aa0-ebe5ca4f7352"
  },
  {
    src: "https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1793066981494-ruyhd3.webp",
    title: "Granny Square Bag",
    category: "Artisanal Crochet Bags",
    alt: "Handcrafted Floral Granny Square Crochet Shoulder Bag by Crochet Wali",
    link: "/product/granny-square-bag-70f2e066-81dc-4f8d-bebf-93d066d4e999"
  },
  {
    src: "https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1778595840761-7awolk.webp",
    title: "Crochet Wrist Gajra Bracelet",
    category: "Bridal & Festive Keepsakes",
    alt: "Handcrafted White and Rose Crochet Wrist Gajra Bracelet Pair by Crochet Wali",
    link: "/product/crochet-wrist-gajra-bracelet-pair-f6439b6e-b495-4d17-95f2-7bcd7d7fdd26"
  },
  {
    src: "https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1788871942005-ny3r2h.webp",
    title: "Crochet Bunny",
    category: "Amigurumi Soft Plushies",
    alt: "Handcrafted Soft Crochet Bunny Plushie in Dress by Crochet Wali",
    link: "/product/crochet-bunny-ea89c2ba-2dc9-4a8f-aab8-fbb3e4ea7bc7"
  },
  {
    src: "https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1790941555578-bubzxo.webp",
    title: "Strawberry Pot",
    category: "Floral Pots & Room Decor",
    alt: "Handcrafted Crochet Strawberry Plant Pot with Hanging Berries by Crochet Wali",
    link: "/product/strawberry-pot-e3404716-4ad2-4d81-9a6f-b4d0efe18451"
  },
  {
    src: "https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1788879077093-l7a3x.webp",
    title: "Crochet Floral Parandi",
    category: "Traditional Hair & Braid Styling",
    alt: "Handcrafted Red Floral Crochet Parandi for Hair Braids by Crochet Wali",
    link: "/product/crochet-floral-parandi-8b20c804-ba2a-4293-af71-1cb4b88292b0"
  }
];

const CustomDesign = () => {
  const enquirySectionRef = useRef(null);
  const [bannerImage, setBannerImage] = useState(defaultHeroBanner);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const [isPillVisible, setIsPillVisible] = useState(false);

  // Cycle: Appear -> Stay 3.8s -> Disappear with animation -> Wait 4.5s -> Re-appear with animation
  useEffect(() => {
    let timeoutId;
    let isMounted = true;

    const showDuration = 3800; // Stay visible for 3.8s
    const hideDuration = 4500; // Stay hidden for 4.5s

    const runCycle = () => {
      if (!isMounted) return;
      setIsPillVisible(true);

      timeoutId = setTimeout(() => {
        if (!isMounted) return;
        setIsPillVisible(false);

        timeoutId = setTimeout(() => {
          if (!isMounted) return;
          runCycle();
        }, hideDuration);
      }, showDuration);
    };

    timeoutId = setTimeout(runCycle, 1500);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadSettings = async () => {
      try {
        const image = await fetchSetting('custom_design_banner_image');
        if (image && typeof image === 'string' && image.trim().length > 0) {
          setBannerImage(image.trim());
        }
      } catch {
        // Fallback to default banner
      }
    };
    loadSettings();
  }, []);

  const getWhatsAppUrl = (customText) => {
    const text = customText || "Hi Crochet Wali, I would like to discuss a custom handmade order with you!";
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };


  // Structured Data
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Custom Crochet & Embroidery Gifts Made to Order",
    "serviceType": "Custom crochet and embroidery gifts",
    "provider": {
      "@type": "Organization",
      "@id": "https://www.crochetwali.in/#organization",
      "name": "Crochet Wali",
      "url": "https://www.crochetwali.in/"
    },
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "description": "Order custom crochet gifts and personalised embroidery from Crochet Wali — handmade in India, 30+ yarn shades, MOQ just 1 piece. Share your idea today."
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.crochetwali.in/" },
      { "@type": "ListItem", "position": 2, "name": "Custom Design", "item": "https://www.crochetwali.in/custom-design" }
    ]
  };

  return (
    <div className="bg-[#fdfbf7] min-h-screen font-body text-stone-900 pb-32 lg:pb-28 antialiased">
      {/* ─── SEO Meta & Schema ─── */}
      <SEO 
        title="Custom Crochet Gifts India | Made to Order | Crochet Wali" 
        exactTitle={true}
        description="Order custom crochet gifts India loves. From custom crochet bouquets to personalized and personalised crochet gifts, get made to order keepsakes by quotation."
        url="https://www.crochetwali.in/custom-design"
        image="https://www.crochetwali.in/custom-images/custom_bouquet.webp"
        schema={[serviceSchema, faqSchema, breadcrumbsSchema]}
      />

      {/* ─── Hero Section ─── */}
      <section className="relative w-full min-h-[520px] md:min-h-[580px] overflow-hidden flex items-center justify-center bg-stone-900">
        <div className="absolute inset-0 z-0">
          <img 
            src={bannerImage && bannerImage.trim() ? bannerImage : defaultHeroBanner} 
            alt="Handcrafted custom crochet & embroidery design workshop - Crochet Wali" 
            className="w-full h-full object-cover opacity-95" 
            fetchPriority="high"
            loading="eager"
            decoding="async"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = defaultHeroBanner;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917]/75 via-[#1c1917]/40 to-[#1c1917]/20" />
        </div>

        <div className="relative z-10 pt-16 pb-12 px-5 text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-3 sm:mb-4 leading-[1.15] drop-shadow-md">
            Custom Crochet Gifts Made to Order in India
          </h1>

          <p className="font-sans text-sm sm:text-base text-stone-200 max-w-2xl mx-auto leading-relaxed mb-6 drop-shadow-sm font-normal">
            To order a custom crochet gift, simply share your reference photo or idea with Crochet Wali on WhatsApp for an upfront quotation. Each piece is made to order in India (handmade in 7–14 days based on product, plus 4–7 business days transit).
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3.5 mb-5">
            <a 
              href={getWhatsAppUrl("Hi Crochet Wali, I want to discuss a custom handmade order with you!")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp to discuss custom handmade order"
              className="w-full sm:w-auto bg-[#075e54] hover:bg-[#05463e] text-white px-7 py-3.5 rounded-full font-sans font-bold text-sm tracking-wide shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Collapsible Custom Ordering & SEO Guide */}
          <div className="max-w-2xl mx-auto mb-2">
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="inline-flex items-center gap-1 text-[10.5px] sm:text-[11px] text-rose-100 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 px-2.5 py-0.5 rounded-full transition-colors backdrop-blur-md border border-rose-400/30 font-medium cursor-pointer shadow-2xs"
              aria-expanded={showGuide}
            >
              <span>{showGuide ? "Hide custom order guide" : "View custom ordering guide & gift ideas"}</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showGuide ? 'rotate-180' : ''}`} />
            </button>

            <div 
              className={`font-sans text-xs sm:text-sm text-stone-200 max-w-2xl mx-auto leading-relaxed space-y-3 text-left sm:text-center mt-3.5 p-4 sm:p-5 rounded-2xl bg-stone-900/85 backdrop-blur-md border border-stone-700/80 shadow-lg ${showGuide ? 'block' : 'hidden'}`}
            >
              <p>
                <strong>How do I order a custom crochet gift?</strong> Simply share your reference image, idea, or preferred colors with Crochet Wali via WhatsApp at <a href="https://wa.me/917428013214" className="text-white font-semibold underline hover:text-rose-200">+91 74280 13214</a>. We provide an upfront quotation based on design complexity, then handcraft your made to order crochet gifts (Handmade in 7–14 days based on product) with 4–7 business days <span className="whitespace-nowrap">pan-India</span> shipping.
              </p>
              <p className="text-xs sm:text-sm text-stone-300">
                Whether you need <strong>customised crochet gifts</strong>, <strong>customized crochet gifts</strong>, <strong>personalized crochet gifts</strong>, or <strong>personalised crochet gifts</strong>, we create unique keepsakes for every milestone. From an everlasting <Link to="/collections/crochet-bouquets" className="text-white font-semibold underline hover:text-rose-200">custom crochet bouquet</Link>, a romantic <strong>custom crochet gift for girlfriend</strong>, or a lasting <strong>custom crochet gift for anniversary</strong> celebrations to a fun <strong>custom crochet gift for birthday</strong> surprises and matching <strong>custom crochet gift set</strong> boxes—each piece is crafted by quote. Planning an event? We also handcraft <strong>custom wedding favours</strong> by quotation, alongside <strong>personalized embroidery gifts</strong> as our secondary artisan offering.
              </p>
            </div>
          </div>

          {/* Quick Pillars */}
          <div className="mt-10 pt-6 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs text-stone-200">
            <div>
              <strong className="text-white block font-semibold">MOQ 1 Piece</strong>
              <span className="text-stone-200">Retail &amp; Bulk Orders</span>
            </div>
            <div>
              <strong className="text-white block font-semibold">30+ Yarn Shades</strong>
              <span className="text-stone-200">Soft Milk Cotton</span>
            </div>
            <div>
              <strong className="text-white block font-semibold">Direct Consultation</strong>
              <span className="text-stone-200">Chat with Crochet Wali</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4-Step Process ─── */}
      <section className="container-custom px-4 sm:px-5 -mt-8 relative z-20 mb-14">
        <h2 className="sr-only">How Custom Crochet &amp; Embroidery Orders Work</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {PROCESS_STEPS.map((step, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-stone-200/80 flex flex-col items-center text-center group hover:shadow-md transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center mb-3 group-hover:bg-rose-100 transition-colors">
                <step.icon className="w-5 h-5 text-rose-900" />
              </div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="font-sans text-xs font-bold text-rose-900 bg-rose-50 w-5 h-5 rounded-full flex items-center justify-center">
                  {i + 1}
                </span>
                <h3 className="font-sans text-xs sm:text-sm font-bold text-stone-900">{step.title}</h3>
              </div>
              <p className="font-sans text-xs text-stone-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Gallery / Custom Masterpieces (8 Clean Studio Tiles with Captions) ─── */}
      {CUSTOM_MASTERPIECES.length > 0 && (
        <section className="container-custom px-4 sm:px-6 mb-16">
          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
            <span className="font-sans text-rose-900 text-xs font-bold tracking-widest uppercase mb-1 block">Portfolio</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-stone-900 tracking-tight">Custom Masterpieces</h2>
            <p className="font-sans text-stone-600 text-xs sm:text-sm mt-1">
              Sample bespoke creations handcrafted for our clients. Available by quotation in custom shades and sizes.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {CUSTOM_MASTERPIECES.map((item, i) => (
              <div 
                key={i} 
                className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs flex flex-col group hover:shadow-md hover:border-rose-200 transition-all duration-300"
              >
                <Link 
                  to={item.link} 
                  className="aspect-square bg-stone-50 overflow-hidden block relative"
                  title={`View ${item.title}`}
                >
                  <img 
                    src={getOptimizedImageUrl(item.src, { width: 400, quality: 80 })} 
                    alt={item.alt} 
                    loading="lazy"
                    width="400"
                    height="400"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                </Link>
                
                {/* Visible Caption under each tile */}
                <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-center bg-white">
                  <Link 
                    to={item.link} 
                    className="font-heading font-bold text-xs sm:text-sm text-stone-900 hover:text-rose-900 transition-colors line-clamp-1 block leading-tight"
                  >
                    {item.title}
                  </Link>
                  <p className="font-sans text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                    {item.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

{/* ─── Request Your Custom Crochet Gift Card ─── */}
      <section 
        ref={enquirySectionRef}
        id="whatsapp-hub"
        className="container-custom px-4 sm:px-6 max-w-md mx-auto scroll-m-20 mb-16"
      >
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 text-center">
          {/* Circular WhatsApp Icon */}
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <MessageCircle className="w-7 h-7 text-emerald-700" />
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-stone-900 leading-snug mb-3">
            Request Your<br />Custom Crochet Gift
          </h2>

          {/* Description */}
          <p className="font-sans text-stone-600 text-xs sm:text-sm leading-relaxed mb-6 max-w-xs mx-auto">
            Simply message us on WhatsApp with your personalized gift idea, color preferences, or reference images for your custom crochet flowers or plushie, and we'll handcraft it for you in India.
          </p>

          {/* CHAT ON WHATSAPP Button */}
          <a
            href={getWhatsAppUrl("Hi Crochet Wali, I would like to request a custom crochet gift. Here are my ideas/reference photos:")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp with custom gift reference photos"
            className="w-full bg-[#0d6e5d] hover:bg-[#0b5a4c] text-white py-3.5 px-6 rounded-2xl font-sans font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-md shadow-emerald-950/10 active:scale-[0.99] transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            <span>CHAT ON WHATSAPP</span>
          </a>

          {/* Subtext */}
          <p className="font-sans text-[11px] sm:text-xs text-stone-600 mt-4 leading-relaxed">
            Average response time: &lt; 1 hour &middot; Delivery available all over India
          </p>
        </div>
      </section>

      {/* ─── Transparent Quotation & Verified Timelines (Compact) ─── */}
      <section className="container-custom px-4 sm:px-6 max-w-3xl mb-12">
        <div className="text-center mb-4">
          <span className="font-sans text-rose-900 text-xs font-bold tracking-widest uppercase mb-1 block">Quick Overview</span>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-stone-900">Pricing &amp; Delivery</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Pricing */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-start h-full">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wide mb-2">
              <Check className="w-4 h-4 text-rose-900 shrink-0" />
              <span>Transparent Quotation</span>
            </div>
            <p className="font-sans text-xs text-stone-600 leading-relaxed">
              Every design is custom quoted based on complexity and yarn shades before you confirm. MOQ: 1 piece (bulk discounts on 10+ pcs).
            </p>
          </div>

          {/* Delivery */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-start h-full">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wide mb-2">
              <Clock className="w-4 h-4 text-rose-900 shrink-0" />
              <span>Timelines Across India</span>
            </div>
            <p className="font-sans text-xs text-stone-600 leading-relaxed">
              <strong>7–14 days crafting</strong> by artisan + <strong>4–7 business days shipping</strong> with live tracking. Please order 2–3 weeks ahead for special dates.
            </p>
          </div>
        </div>
      </section>

            {/* ─── Client Stories (Preserves exact live wording) ─── */}
      <section className="py-10 sm:py-12 bg-white border-y border-stone-200/60 mb-12">
        <div className="container-custom px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
            <span className="font-sans text-rose-900 text-xs font-bold tracking-widest uppercase mb-1 block">Client Stories</span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-stone-900 mb-1.5 tracking-tight">
              What Our Customers Say
            </h2>
            <p className="font-sans text-stone-600 text-xs sm:text-sm">
              Real experiences from customers who ordered custom handmade gifts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-3.5 sm:gap-4 md:gap-5">
            {CLIENT_STORIES.map((t, i) => (
              <div 
                key={i} 
                className="bg-[#fdfbf7] p-4 sm:p-5 rounded-xl shadow-2xs border border-stone-200/70 flex flex-col h-full"
              >
                <div className="flex-1">
                  <div className="flex text-amber-400 mb-2">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="font-sans text-stone-700 text-xs sm:text-[13px] italic leading-relaxed">
                    "{t.text}"
                  </p>
                </div>
                <div className="border-t border-stone-200/60 pt-2.5 mt-3.5 flex items-center justify-between">
                  <div>
                    <p className="font-sans font-bold text-stone-900 text-xs sm:text-[13px]">{t.name}</p>
                    <p className="font-sans text-[11px] text-stone-500">{t.location}</p>
                  </div>
                  <span className="font-sans text-[10px] font-semibold text-rose-900 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/70">
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ─── Frequently Asked Questions (Accordion) ─── */}
      <section className="container-custom px-4 sm:px-6 max-w-3xl mb-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="font-sans text-rose-900 text-xs font-bold tracking-widest uppercase mb-1.5 block">Got Questions?</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-stone-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="font-sans text-stone-600 text-xs sm:text-sm mt-1.5">
            Everything you need to know about placing a custom handmade order.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openFaqIndex === i;
            return (
              <div 
                key={i}
                className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : i)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-sans font-bold text-stone-900 text-sm sm:text-base hover:text-rose-900 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 text-stone-600 ${isOpen ? 'rotate-180 text-rose-900' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-stone-600 leading-relaxed font-sans border-t border-stone-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center p-6 bg-rose-50/50 rounded-2xl border border-rose-100/70 space-y-4">
          <p className="font-sans text-stone-700 text-xs sm:text-sm">
            Prefer ready-to-ship creations?{' '}
            <Link to="/shop" className="text-rose-900 font-bold underline underline-offset-4 hover:text-rose-800 transition-colors">
              Browse our full shop catalog
            </Link>
            .
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-1 text-xs">
            <Link to="/collections/crochet-bouquets" className="px-3 py-1.5 bg-white border border-rose-200/60 rounded-full text-stone-700 hover:text-rose-900 hover:border-rose-300 font-medium transition-colors">
              Crochet Bouquets →
            </Link>
            <Link to="/collections/reusable-bridal-gajra" className="px-3 py-1.5 bg-white border border-rose-200/60 rounded-full text-stone-700 hover:text-rose-900 hover:border-rose-300 font-medium transition-colors">
              Bridal Gajra →
            </Link>
            <Link to="/collections/crochet-flower-pots" className="px-3 py-1.5 bg-white border border-rose-200/60 rounded-full text-stone-700 hover:text-rose-900 hover:border-rose-300 font-medium transition-colors">
              Flower Pots →
            </Link>
            <Link to="/collections/gifts-under-500" className="px-3 py-1.5 bg-white border border-rose-200/60 rounded-full text-stone-700 hover:text-rose-900 hover:border-rose-300 font-medium transition-colors">
              Gifts Under ₹500 →
            </Link>
            <Link to="/collections/crochet-bags" className="px-3 py-1.5 bg-white border border-rose-200/60 rounded-full text-stone-700 hover:text-rose-900 hover:border-rose-300 font-medium transition-colors">
              Handmade Bags →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Floating WhatsApp Action ─── */}
      <aside aria-label="WhatsApp Contact" className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40 flex flex-col items-end pointer-events-none">
        {/* Animated Flash Message Pill: Chat on WhatsApp */}
        <div 
          className={`mb-2 relative transition-all duration-500 ease-out transform ${
            isPillVisible 
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
              : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
          }`}
        >
          <a
            href={getWhatsAppUrl("Hi Crochet Wali, I want to discuss a custom design order!")}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-2 bg-white/95 backdrop-blur-sm pl-2.5 pr-3.5 py-1.5 rounded-full border border-stone-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:shadow-md hover:border-emerald-500/70 transition-all active:scale-95 cursor-pointer select-none"
            aria-label="Chat on WhatsApp with Crochet Wali"
          >
            {/* Green Live Indicator Ping Dot */}
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>

            {/* Flash Message Text */}
            <span className="text-xs font-bold text-stone-800 tracking-tight">
              Chat on WhatsApp
            </span>

            {/* Pointer Triangle pointing directly down to WhatsApp button */}
            <div 
              className="absolute -bottom-1 right-3.5 md:right-4 w-2 h-2 bg-white border-r border-b border-stone-200/90 rotate-45" 
              aria-hidden="true"
            />
          </a>
        </div>

        {/* Clean Smaller WhatsApp Button */}
        <a
          href={getWhatsAppUrl("Hi Crochet Wali, I want to discuss a custom design order!")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp with Crochet Wali support"
          className="pointer-events-auto flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#075e54] hover:bg-[#05463e] text-white shadow-[0_4px_16px_rgba(7,94,84,0.4)] hover:shadow-[0_6px_24px_rgba(7,94,84,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 flex-shrink-0 cursor-pointer"
        >
          <svg
            className="w-5.5 h-5.5 md:w-6 md:h-6 fill-white drop-shadow-xs"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.712 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </a>
      </aside>
    </div>
  );
};

export default CustomDesign;
