import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  MessageCircle, 
  MessageSquare, 
  Palette, 
  Scissors, 
  Star, 
  Camera, 
  Check, 
  Clock, 
  ChevronDown, 
  ArrowRight, 
  ShieldCheck, 
  Heart, 
  Send, 
  AlertCircle, 
  Gift, 
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { supabase } from '../config/supabase';
import { fetchSetting } from '../utils/settingsUtils';
import SEO from '../components/SEO';
import defaultHeroBanner from '../assets/custom_hero_banner.webp';
import customBouquet from '../assets/custom_bouquet.webp';
import customHoop from '../assets/custom_hoop.webp';
import customHairclips from '../assets/custom_hairclips.webp';
import customKeychains from '../assets/custom_keychains.webp';
import flowerHero from '../assets/flower.webp';

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
    answer: "2–4 days crafting plus 4–7 business days shipping across India"
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
    answer: "Yes! You can share screenshots, Pinterest pins, or reference sketches directly through WhatsApp. Head artisan Sana reviews the image to assess crochet feasibility and translates it into handmade yarn stitches."
  },
  {
    question: "How is the price of a custom crochet order calculated?",
    answer: "Because every custom piece is unique, pricing is provided by upfront quotation based on design complexity, dimensions, yarn requirements, and quantity before you confirm your order."
  },
  {
    question: "Can I request delivery before a specific birthday or anniversary?",
    answer: "Yes, please share your required delivery date during consultation. We will verify if your timeline fits within our 2–4 days crafting plus 4–7 business days transit schedule."
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

// ─── Supported Custom Categories ───
const CUSTOM_CATEGORIES = [
  {
    id: "bouquet",
    name: "Custom Crochet Flower Bouquets",
    tagline: "Everlasting Floral Arrangements",
    desc: "Single roses, tulips, sunflowers, daisies, or grand mixed bouquets hand-knitted to match your recipient's favorite aesthetic.",
    customization: "Stem count (1 to 12+), flower types, wrapping paper & satin ribbons",
    image: "https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1778557378262-05kqnn.webp",
    link: "/collections/crochet-bouquets"
  },
  {
    id: "plushie",
    name: "Custom Crochet Plushies & Dolls",
    tagline: "Cuddle Amigurumi Creations",
    desc: "Lovable plush animals, bespoke chibi characters, and miniature soft companions hand-stitched from premium milk cotton yarn.",
    customization: "Character reference, custom colors, mini accessories, and embroidered tags",
    image: "https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1788871942005-ny3r2h.webp",
    link: "/shop?category=toys"
  },
  {
    id: "keychain",
    name: "Personalized Crochet Keychains & Charms",
    tagline: "Miniature Bag & Key Companions",
    desc: "Whimsical crochet keychains, evil eyes, mini floral tags, and customized initial charms for totes, backpacks, and car keys.",
    customization: "Charm shape, metal keyring finish, color combinations, and initial tags",
    image: "https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1778557778392-c4xh3i.webp",
    link: "/collections/crochet-keychains"
  },
  {
    id: "hair-accessories",
    name: "Crochet Hair Accessories & Bridal Gajras",
    tagline: "Artisanal Ethnic & Everyday Styling",
    desc: "Reusable bridal floral gajras, floral claw clips, parandis, and cottagecore hair bows designed for weddings and festivities.",
    customization: "Bun vs braid length, jasmine/rose accents, and festive color matching",
    image: "https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1778599341364-8nm2du.webp",
    link: "/shop?category=hair-accessories"
  },
  {
    id: "bags",
    name: "Crochet Bags & Handcrafted Pouches",
    tagline: "Boho & Cottagecore Fashion",
    desc: "Vintage granny-square tote bags, cosmetic pouches, and coin purses hand-knitted with reinforced, durable cotton yarn.",
    customization: "Square patterns, strap lengths, color palettes, and inner lining",
    image: "https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1793065438576-zio7zh.webp",
    link: "/shop?category=bags--pouches"
  },
  {
    id: "embroidery",
    name: "Personalized Embroidery Keepsakes",
    tagline: "Heirloom Needlework & Portraits",
    desc: "Detailed hand-stitched wedding dates, couple portraits, baby milestones, and meaningful quotes embroidered on natural fabric frames.",
    customization: "Fabric base, thread palette, calligraphy font, and personalized date/name",
    image: "https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1778561579733-7z4q8i.webp",
    link: "/shop?search=embroidery"
  },
  {
    id: "bulk-hampers",
    name: "Custom Gift Hampers & Bulk Orders",
    tagline: "Weddings, Baby Showers & Celebrations",
    desc: "Curated gift boxes combining crochet flowers and keepsakes, plus 10+ piece bulk sets with volume quotations for special events.",
    customization: "Box contents, personalized gift note cards, ribbon styling, and bulk quotes",
    image: "https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1778599677726-6ocorwn.webp",
    link: "/shop?category=gift-box"
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
    desc: "Handmade in 2–4 days and delivered across India in 4–7 business days."
  }
];

// ─── Verified Client Stories (Preserves exact live wording) ───
const CLIENT_STORIES = [
  {
    name: "Sneha P.",
    location: "Delhi",
    text: "I requested a custom embroidered denim jacket for my sister's wedding. Sana's team took my rough sketch and turned it into an absolute masterpiece!"
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
    src: "https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1778557378262-05kqnn.webp",
    title: "Crochet Rose Bouquet",
    category: "Forever Bouquet",
    alt: "Handmade Crochet Rose Bouquet by Crochet Wali"
  },
  {
    src: "https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1778595840761-7awolk.webp",
    title: "Crochet Wrist Gajras",
    category: "Bridal & Festive",
    alt: "Handcrafted Crochet Wrist Gajra Bracelet Pair by Crochet Wali"
  },
  {
    src: "https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1788871942005-ny3r2h.webp",
    title: "Crochet Bunny Plushie",
    category: "Amigurumi Dolls",
    alt: "Handcrafted Crochet Bunny Amigurumi Plushie by Crochet Wali"
  },
  {
    src: "https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1788855782064-kq4e6h.webp",
    title: "Crochet Sunflower Keychain",
    category: "Bag & Key Charm",
    alt: "Handmade Crochet Sunflower Keychain Charm by Crochet Wali"
  },
  {
    src: "https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1793065438576-zio7zh.webp",
    title: "3D Rose Granny Square Bag",
    category: "Artisanal Bags",
    alt: "Handcrafted 3D Rose Granny Square Crochet Bag by Crochet Wali"
  },
  {
    src: "https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1793064727459-179tn.webp",
    title: "Crochet Tulip Flower Pot",
    category: "Keepsake Pots",
    alt: "Handmade Crochet Tulip Flower Pot Keepsake by Crochet Wali"
  },
  {
    src: "https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1788879077093-l7a3x.webp",
    title: "Crochet Floral Parandi",
    category: "Hair Accessories",
    alt: "Handmade Traditional Crochet Floral Parandi by Crochet Wali"
  },
  {
    src: "https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1778561579733-7z4q8i.webp",
    title: "Embroidery Hair Clips",
    category: "Personalized Embroidery",
    alt: "Handcrafted Floral Embroidery Hair Clips by Crochet Wali"
  }
];

const CustomDesign = () => {
  const [bannerImage, setBannerImage] = useState(defaultHeroBanner);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadSettings = async () => {
      try {
        const image = await fetchSetting('custom_design_banner_image');
        if (image) setBannerImage(image);
      } catch (e) {
        // Fallback to default banner
      }
    };
    loadSettings();
  }, []);

  const getWhatsAppUrl = (customText) => {
    const text = customText || "Hi Sana (Crochet Wali), I would like to discuss a custom handmade order with you!";
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const handleCategoryWhatsApp = (categoryName) => {
    const text = `Hi Sana (Crochet Wali), I would like to order a custom handmade creation for "${categoryName}". Here are my design ideas:`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
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
        title="Custom Crochet Gifts & Personalized Embroidery | Crochet Wali" 
        exactTitle={true}
        description="Order custom crochet gifts and personalised embroidery from Crochet Wali — handmade in India, 30+ yarn shades, MOQ just 1 piece. Share your idea today."
        url="https://www.crochetwali.in/custom-design"
        image="https://www.crochetwali.in/custom-images/custom_bouquet.webp"
        schema={[serviceSchema, faqSchema, breadcrumbsSchema]}
      />

      {/* ─── Hero Section ─── */}
      <section className="relative w-full min-h-[520px] md:min-h-[580px] overflow-hidden flex items-center justify-center bg-stone-900">
        <div className="absolute inset-0 z-0">
          <img 
            src={bannerImage || defaultHeroBanner} 
            alt="Handcrafted custom crochet & embroidery design workshop - Crochet Wali" 
            className="w-full h-full object-cover opacity-35" 
            fetchPriority="high"
            loading="eager"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = defaultHeroBanner;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917] via-[#1c1917]/70 to-transparent" />
        </div>

        <div className="relative z-10 pt-16 pb-12 px-5 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-semibold tracking-wide mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-rose-300" />
            <span>Handmade in India • Bespoke Creations</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4 sm:mb-6 leading-[1.15] drop-shadow-md">
            Custom Crochet &amp; Embroidery Gifts Made to Order
          </h1>

          <p className="font-sans text-base sm:text-lg md:text-xl text-stone-200/90 max-w-2xl mx-auto leading-relaxed font-normal mb-8 drop-shadow-sm">
            Want a gift no one else has? Share your reference photo or vision with head artisan Sana. We handcraft bespoke{' '}
            <Link to="/collections/crochet-bouquets" className="text-white font-medium underline decoration-rose-300 underline-offset-4 hover:text-rose-200 transition-colors">
              custom crochet bouquets
            </Link>
            , cute plushies, personalised embroidery keepsakes, hair accessories, and keychains stitch by stitch in India.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3.5">
            <button 
              onClick={() => enquirySectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto bg-rose-900 hover:bg-rose-800 text-white px-8 py-4 rounded-full font-sans font-bold text-sm tracking-wide shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
            >
              <Palette className="w-4 h-4" />
              <span>Create My Custom Design</span>
            </button>

            <a 
              href={getWhatsAppUrl("Hi Crochet Wali, I want to discuss a custom handmade order with you!")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white px-7 py-4 rounded-full font-sans font-bold text-sm tracking-wide shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Quick Pillars */}
          <div className="mt-10 pt-6 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs text-stone-300">
            <div>
              <strong className="text-white block font-semibold">MOQ 1 Piece</strong>
              <span>Retail &amp; Bulk Orders</span>
            </div>
            <div>
              <strong className="text-white block font-semibold">30+ Yarn Shades</strong>
              <span>Soft Milk Cotton</span>
            </div>
            <div>
              <strong className="text-white block font-semibold">Direct Consultation</strong>
              <span>Chat with Founder Sana</span>
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
      <section className="container-custom px-4 sm:px-6 mb-16">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="font-sans text-rose-900 text-xs font-bold tracking-widest uppercase mb-1.5 block">Our Portfolio</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-stone-900 tracking-tight">Custom Masterpieces</h2>
          <p className="font-sans text-stone-600 text-xs sm:text-sm mt-1.5">
            A glimpse into authentic handcrafted items created with love for clients across India.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {CUSTOM_MASTERPIECES.map((item, i) => (
            <div 
              key={i} 
              className="aspect-square bg-white rounded-2xl overflow-hidden group border border-stone-200/80 shadow-xs relative"
            >
              <img 
                src={item.src} 
                alt={item.alt} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 sm:p-4">
                <span className="text-[10px] sm:text-xs font-semibold text-rose-200 uppercase tracking-wider">{item.category}</span>
                <span className="text-white text-xs sm:text-sm font-bold drop-shadow-sm leading-tight">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

{/* ─── Request Your Custom Crochet Gift Card ─── */}
      <section 
        id="whatsapp-hub"
        className="container-custom px-4 sm:px-6 max-w-md mx-auto scroll-m-20 mb-16"
      >
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 text-center">
          {/* Circular WhatsApp Icon */}
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <MessageCircle className="w-7 h-7 text-[#25D366]" />
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
            href={getWhatsAppUrl("Hi Sana (Crochet Wali), I would like to request a custom crochet gift. Here are my ideas/reference photos:")}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#0d6e5d] hover:bg-[#0b5a4c] text-white py-3.5 px-6 rounded-2xl font-sans font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-md shadow-emerald-950/10 active:scale-[0.99] transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            <span>CHAT ON WHATSAPP</span>
          </a>

          {/* Subtext */}
          <p className="font-sans text-[11px] sm:text-xs text-stone-500 mt-4 leading-relaxed">
            Average response time: &lt; 1 hour &middot; Delivery available all over India
          </p>
        </div>
      </section>

            {/* ─── Personalization Options & Materials ─── */}
      <section className="py-12 bg-[#fafaf9] border-y border-stone-200/70 mb-14">
        <div className="container-custom px-4 sm:px-6 max-w-4xl">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="font-sans text-rose-900 text-xs font-bold tracking-widest uppercase mb-1.5 block">Tailored To You</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-stone-900">Personalization Options</h2>
            <p className="font-sans text-stone-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
              We combine traditional Indian handcraft with your personal aesthetic preferences.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                <Palette className="w-4 h-4" />
                <span>30+ Milk Cotton Yarn Shades</span>
              </div>
              <p className="font-sans text-xs text-stone-600 leading-relaxed">
                Choose pastels, bold jewel tones, or subtle earthy aesthetics. We match color swatches to your wedding attire, room palette, or favorite flowers.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                <Scissors className="w-4 h-4" />
                <span>Custom Dimensions &amp; Stem Count</span>
              </div>
              <p className="font-sans text-xs text-stone-600 leading-relaxed">
                From a single preserved tulip stem to grand 12+ flower mixed bouquets and custom-sized amigurumi plushies built to your scale.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                <Heart className="w-4 h-4" />
                <span>Personalized Embroidery Text</span>
              </div>
              <p className="font-sans text-xs text-stone-600 leading-relaxed">
                Add embroidered anniversary dates, wedding couple names, personal initials, or heartfelt short quotes on fabric frames.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                <Gift className="w-4 h-4" />
                <span>Gift-Ready Presentation</span>
              </div>
              <p className="font-sans text-xs text-stone-600 leading-relaxed">
                Packed in sturdy rigid protective boxes with satin ribbon wrapping and complimentary handwritten calligraphy note cards.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Artisanal Note:</strong> Every handcrafted creation is stitched by hand and carries unique charm. Minor natural variations in stitch tension and petal shape are the hallmarks of genuine craftsmanship. We share preview photos before dispatch to ensure you are delighted.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Transparent Quotation & Verified Timelines ─── */}
      <section className="container-custom px-4 sm:px-6 max-w-4xl mb-14">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="font-sans text-rose-900 text-xs font-bold tracking-widest uppercase mb-1.5 block">Clarity &amp; Confidence</span>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-stone-900">Pricing &amp; Delivery Expectations</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-6">
          {/* Pricing Model */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-900 uppercase tracking-wide">
              <span>Transparent Quotation Process</span>
            </div>
            <h3 className="font-heading font-bold text-lg text-stone-900">Custom Work Priced Upon Review</h3>
            <p className="font-sans text-xs sm:text-sm text-stone-600 leading-relaxed">
              Every custom crochet design is unique. Because complexity, dimensions, and yarn volume vary, each piece is individually quoted with no hidden surprises.
            </p>
            <ul className="text-xs text-stone-600 space-y-1.5 pt-1">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Quotation provided before you confirm your order</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>MOQ of 1 piece for personalized retail gifts</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Volume discounts available for 10+ piece wedding favors</span>
              </li>
            </ul>
          </div>

          {/* Verified Timelines */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-900 uppercase tracking-wide">
              <Clock className="w-3.5 h-3.5" />
              <span>Confirmed Timelines Across India</span>
            </div>
            <h3 className="font-heading font-bold text-lg text-stone-900">Crafting &amp; Shipping Schedule</h3>
            <div className="space-y-2.5 pt-1">
              <div className="p-3 bg-[#fdfbf7] rounded-xl border border-stone-100 flex items-center justify-between">
                <div>
                  <strong className="text-stone-900 text-xs block font-bold">2–4 Days Crafting</strong>
                  <span className="text-[11px] text-stone-500">Meticulously hand-knitted from scratch</span>
                </div>
                <span className="text-xs font-bold text-rose-900 bg-rose-50 px-2 py-1 rounded-md">Artisan</span>
              </div>
              <div className="p-3 bg-[#fdfbf7] rounded-xl border border-stone-100 flex items-center justify-between">
                <div>
                  <strong className="text-stone-900 text-xs block font-bold">4–7 Business Days Transit</strong>
                  <span className="text-[11px] text-stone-500">All India delivery with live tracking</span>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md">Couriers</span>
              </div>
            </div>
            <p className="text-[11px] text-stone-500 italic pt-1">
              * Planning a wedding or birthday gift? Please consult 10–14 days in advance to ensure comfortable arrival.
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
                    <p className="font-sans text-xs text-stone-500">{t.location}</p>
                  </div>
                  <span className="font-sans text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Supported Custom Categories ─── */}
      <section className="py-12 bg-white border-y border-stone-200/60 mb-14">
        <div className="container-custom px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="font-sans text-rose-900 text-xs font-bold tracking-widest uppercase mb-1.5 block">What We Make</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-stone-900 tracking-tight">
              Custom Crochet &amp; Handmade Categories
            </h2>
            <p className="font-sans text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed">
              Every category below is handcrafted from scratch. Choose a design style to get started or request your own unique creation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CUSTOM_CATEGORIES.map((cat) => (
              <article 
                key={cat.id}
                className="bg-[#fdfbf7] rounded-2xl border border-stone-200/80 overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-[4/3] bg-stone-100 overflow-hidden relative">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-rose-900 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                    {cat.tagline}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-heading font-bold text-lg text-stone-900 mb-1.5 leading-snug">
                    {cat.name}
                  </h3>
                  <p className="font-sans text-xs text-stone-600 leading-relaxed mb-3 flex-1">
                    {cat.desc}
                  </p>

                  <div className="bg-white p-3 rounded-xl border border-stone-100 mb-4 text-[11px] text-stone-600 leading-relaxed">
                    <strong className="text-stone-900 font-semibold block mb-0.5">Customization Scope:</strong>
                    <span>{cat.customization}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-stone-200/60">
                    <button 
                      type="button"
                      onClick={() => handleCategoryWhatsApp(cat.name)}
                      className="flex-1 bg-rose-900 hover:bg-rose-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl text-center transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Request on WhatsApp</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    {cat.link.startsWith('/') && (
                      <Link 
                        to={cat.link}
                        className="text-stone-600 hover:text-rose-900 text-xs font-semibold px-2 py-2.5 rounded-xl border border-stone-200 hover:border-rose-200 transition-colors"
                        title="Browse ready-made examples"
                      >
                        Explore
                      </Link>
                    )}
                  </div>
                </div>
              </article>
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
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 text-stone-500 ${isOpen ? 'rotate-180 text-rose-900' : ''}`} />
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

        <div className="mt-8 text-center p-5 bg-rose-50/50 rounded-2xl border border-rose-100/70">
          <p className="font-sans text-stone-700 text-xs sm:text-sm">
            Prefer ready-to-ship creations?{' '}
            <Link to="/shop" className="text-rose-900 font-bold underline underline-offset-4 hover:text-rose-700 transition-colors">
              Browse our full shop catalog
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ─── Floating WhatsApp Action ─── */}
      <aside aria-label="WhatsApp Contact" className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40">
        <a
          href={getWhatsAppUrl("Hi Crochet Wali, I want to discuss a custom design order!")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="flex items-center gap-2 group"
        >
          {/* Flashing "Chat on WhatsApp" Message Bubble */}
          <div className="bg-white text-stone-900 border border-stone-200/90 shadow-lg px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap animate-pulse group-hover:animate-none group-hover:bg-stone-50 transition-all flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#25D366]" />
            <span>Chat on WhatsApp</span>
          </div>

          {/* Clean WhatsApp Button (Green Dot Removed) */}
          <div className="flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] group-hover:bg-[#20bd5a] text-white shadow-[0_6px_24px_rgba(37,211,102,0.45)] group-hover:shadow-[0_8px_32px_rgba(37,211,102,0.65)] group-hover:scale-105 active:scale-95 transition-all duration-300 flex-shrink-0">
            <svg
              className="w-7 h-7 sm:w-7 sm:h-7 md:w-8 md:h-8 fill-white drop-shadow-xs"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.712 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </div>
        </a>
      </aside>
    </div>
  );
};

export default CustomDesign;
