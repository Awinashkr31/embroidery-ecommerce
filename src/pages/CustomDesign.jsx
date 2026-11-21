import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageCircle, 
  MessageSquare, 
  Palette, 
  Scissors, 
  Star, 
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
    desc: "We customize your design and share the price & timeline."
  },
  {
    number: "03",
    icon: Scissors,
    title: "Confirm Your Order",
    desc: "Approve the details and pay securely via UPI or Card."
  },
  {
    number: "04",
    icon: Star,
    title: "Crafted & Delivered",
    desc: "Handmade in 7–14 days based on product, then delivered across India in 4–7 business days."
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

// ─── Custom Masterpieces (Owner's Authentic Products) ───
const CUSTOM_MASTERPIECES = [
  {
    src: "/custom-images/custom_rose_band.webp",
    title: "Crochet Floral Rose Band",
    category: "Hair & Wrist Accessories",
    alt: "Handcrafted Multi-color Crochet Rose Floral Band with Pearls by Crochet Wali"
  },
  {
    src: "/custom-images/custom_granny_bag.webp",
    title: "Granny Square Crochet Bag",
    category: "Artisanal Bags",
    alt: "Handcrafted Floral Granny Square Crochet Shoulder Bag by Crochet Wali"
  },
  {
    src: "/custom-images/custom_hair_barrette.webp",
    title: "Floral Crochet Hair Barrette",
    category: "Hair Accessories",
    alt: "Handcrafted Multi-Floral Crochet Hair Clip Barrette by Crochet Wali"
  },
  {
    src: "/custom-images/custom_strawberry_pot.webp",
    title: "Hanging Strawberry Plant Pot",
    category: "Flower Pots & Decor",
    alt: "Handcrafted Hanging Strawberry Crochet Plant Pot with Vines by Crochet Wali"
  },
  {
    src: "/custom-images/custom_bunny_overalls.webp",
    title: "Crochet Bunny in Red Overalls",
    category: "Amigurumi Plushies",
    alt: "Handcrafted White and Red Plush Crochet Bunny Doll in Overalls by Crochet Wali"
  },
  {
    src: "/custom-images/custom_floral_parandi.webp",
    title: "Crochet Floral Parandi",
    category: "Bridal & Ethnic Styling",
    alt: "Handcrafted Traditional Red Crochet Floral Parandi for Braids by Crochet Wali"
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
    <div className="bg-[#fdfbf7] min-h-screen font-body text-stone-900 pb-24 lg:pb-20 antialiased">
      {/* ─── SEO Meta & Schema ─── */}
      <SEO 
        title="Custom Crochet Gifts India | Made to Order | Crochet Wali" 
        exactTitle={true}
        description="Order custom crochet gifts India loves. From a custom crochet bouquet to personalized crochet gifts, we handcraft made to order designs by quotation in India."
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
            className="w-full h-full object-cover opacity-80" 
            fetchPriority="high"
            loading="eager"
            decoding="async"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = defaultHeroBanner;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917]/90 via-[#1c1917]/55 to-[#1c1917]/35" />
        </div>

        <div className="relative z-10 pt-16 pb-12 px-5 text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-3 sm:mb-4 leading-[1.15] drop-shadow-md">
            Custom Crochet Gifts Made to Order in India
          </h1>

          <p className="font-sans text-sm sm:text-base text-stone-200 max-w-2xl mx-auto leading-relaxed mb-6 drop-shadow-sm font-normal">
            Handcrafted bespoke crochet gifts made to order in India. Share your design idea or reference photo on WhatsApp for an upfront quotation (Handmade in 7–14 days based on product • pan-India delivery).
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
              className="inline-flex items-center gap-1.5 text-xs text-stone-200 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full transition-colors backdrop-blur-md border border-white/20 font-medium cursor-pointer"
              aria-expanded={showGuide}
            >
              <span>{showGuide ? "Hide custom order guide" : "View custom ordering guide & gift ideas"}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showGuide ? 'rotate-180' : ''}`} />
            </button>

            <div 
              className={`font-sans text-xs sm:text-sm text-stone-200 max-w-2xl mx-auto leading-relaxed space-y-3 text-left sm:text-center mt-3.5 p-4 sm:p-5 rounded-2xl bg-stone-900/85 backdrop-blur-md border border-stone-700/80 shadow-lg ${showGuide ? 'block' : 'hidden'}`}
            >
              <p>
                <strong>How do I order a custom crochet gift?</strong> Simply share your reference image, idea, or preferred colors with Crochet Wali via WhatsApp at <a href="https://wa.me/917428013214" className="text-white font-semibold underline hover:text-rose-200">+91 74280 13214</a>. We provide an upfront quotation based on design complexity, then handcraft your made to order crochet gifts (Handmade in 7–14 days based on product) with 4–7 business days pan-India shipping.
              </p>
              <p className="text-xs sm:text-sm text-stone-300">
                Whether you need <strong>customised crochet gifts</strong>, <strong>customized crochet gifts</strong>, or <strong>personalised crochet gifts</strong>, we create unique keepsakes for every milestone. From an everlasting <Link to="/collections/crochet-bouquets" className="text-white font-semibold underline hover:text-rose-200">custom crochet bouquet</Link>, a romantic <strong>custom crochet gift for girlfriend</strong>, or a lasting <strong>custom crochet gift for anniversary</strong> celebrations to a fun <strong>custom crochet gift for birthday</strong> surprises and matching <strong>custom crochet gift set</strong> boxes—each piece is crafted by quote. Planning an event? We also handcraft <strong>custom wedding favours</strong> by quotation, alongside <strong>personalized embroidery gifts</strong> as our secondary artisan offering.
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

            {/* ─── Gallery / Custom Masterpieces ─── */}
      {CUSTOM_MASTERPIECES.length > 0 && (
        <section className="container-custom px-4 sm:px-6 mb-16">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="font-sans text-rose-900 text-xs font-bold tracking-widest uppercase mb-1 block">Portfolio</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-stone-900 tracking-tight">Custom Masterpieces</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 sm:gap-4">
            {CUSTOM_MASTERPIECES.map((item, i) => (
              <div 
                key={i} 
                className="aspect-square bg-white rounded-2xl overflow-hidden group border border-stone-200/80 shadow-xs relative"
              >
                <img 
                  src={getOptimizedImageUrl(item.src, { width: 360, quality: 75 })} 
                  alt={item.alt} 
                  loading="lazy"
                  width="360"
                  height="360"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-900/80 via-stone-900/40 to-transparent p-2.5 sm:p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="font-heading font-bold text-xs sm:text-sm leading-tight">{item.title}</p>
                  <p className="font-sans text-[10px] text-stone-300">{item.category}</p>
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
          <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wide mb-1.5">
              <Check className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Transparent Quotation</span>
            </div>
            <p className="font-sans text-xs text-stone-600 leading-relaxed">
              Every design is custom quoted based on complexity and yarn shades before you confirm. MOQ: 1 piece (bulk discounts on 10+ pcs).
            </p>
          </div>

          {/* Delivery */}
          <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wide mb-1.5">
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
      <section className="py-14 bg-white border-y border-stone-200/60 mb-14">
        <div className="container-custom px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="font-sans text-rose-900 text-xs font-bold tracking-widest uppercase mb-1.5 block">Client Stories</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-stone-900 mb-2 tracking-tight">
              What Our Customers Say
            </h2>
            <p className="font-sans text-stone-600 text-xs sm:text-sm">
              Real experiences from customers who ordered custom handmade gifts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {CLIENT_STORIES.map((t, i) => (
              <div 
                key={i} 
                className="bg-[#fdfbf7] p-6 sm:p-7 rounded-2xl shadow-xs border border-stone-200/70 flex flex-col justify-between"
              >
                <div>
                  <div className="flex text-amber-400 mb-3.5">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="font-sans text-stone-700 text-sm italic leading-relaxed mb-6">
                    "{t.text}"
                  </p>
                </div>
                <div className="border-t border-stone-200/60 pt-3.5 flex items-center justify-between">
                  <div>
                    <p className="font-sans font-bold text-stone-900 text-sm">{t.name}</p>
                    <p className="font-sans text-xs text-stone-600">{t.location}</p>
                  </div>
                  <span className="font-sans text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
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
