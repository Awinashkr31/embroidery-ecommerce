import React, { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../context/CategoryContext';
import { ArrowRight, ChevronDown } from 'lucide-react';
import SEO from '../components/SEO';

const CATEGORY_CARDS = [
  {
    id: 'flower-pot',
    title: 'Flower Pots',
    link: '/shop?category=Flower%20Pot',
    image: '/custom-images/custom_strawberry_pot.webp',
    fallback: '/category-images/flower-pot.webp',
  },
  {
    id: 'bouquet',
    title: 'Bouquets',
    link: '/shop?category=Bouquet',
    image: '/custom-images/custom_bouquet.webp',
    fallback: '/category-images/bouquet.webp',
  },
  {
    id: 'handmade-keychain',
    title: 'Keychains',
    link: '/shop?category=Handmade%20Keychain',
    image: '/custom-images/custom_keychains.webp',
    fallback: '/category-images/handmade-keychain.webp',
  },
  {
    id: 'hair-accessories',
    title: 'Hair Clips',
    link: '/shop?category=Hair%20Accessories',
    image: '/custom-images/custom_hairclips.webp',
    fallback: '/category-images/hair-accessories.webp',
  },
  {
    id: 'toys',
    title: 'Plushies',
    link: '/shop?category=Toys',
    image: '/custom-images/custom_bunny_overalls.webp',
    fallback: '/category-images/toys.webp',
  },
  {
    id: 'bags--pouches',
    title: 'Bags & Pouches',
    link: '/shop?category=Bags%20%26%20Pouches',
    image: '/custom-images/custom_granny_bag.webp',
    fallback: '/category-images/bags--pouches.webp',
  },
  {
    id: 'gift-box',
    title: 'Gift Hampers',
    link: '/shop?category=Gift%20Box',
    image: '/category-images/gift-box.webp',
    fallback: '/category-images/gift-hampers.webp',
  },
  {
    id: 'flowers',
    title: 'Forever Flowers',
    link: '/shop?category=Flowers',
    image: '/category-images/flowers.webp',
    fallback: '/assets/flower.webp',
  },
];

const FAQS = [
  {
    question: "What types of handmade gifts do you offer?",
    answer: "We offer a wide variety of handcrafted categories including Crochet Flower Bouquets, traditional Gajras, Hair Clips, Amigurumi Keychains, and personalized Hoop Art. Every item is crafted with premium yarn to ensure it lasts forever."
  },
  {
    question: "Can I order custom designs within these categories?",
    answer: "Absolutely. While our categories showcase our most popular and trending designs, we specialize in custom orders. If you see a bouquet or keychain style you like but want it in a different color or size, simply contact us for a customized gift."
  },
  {
    question: "How do I choose the right category for my gift?",
    answer: "If you're gifting for an anniversary or Valentine's Day, our 'Bouquets' category is ideal. For small, cute tokens of appreciation, explore our 'Keychains'. For traditional Indian aesthetics, our 'Hair Accessories & Gajra' category is the best choice."
  }
];

const Categories = () => {
  const { categories } = useCategories();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const allCategoryCards = useMemo(() => {
    if (!categories || categories.length === 0) {
      return CATEGORY_CARDS;
    }

    const metaMap = {
      'flower-pot': {
        title: 'Flower Pots',
        image: '/custom-images/custom_strawberry_pot.webp',
        fallback: '/category-images/flower-pot.webp',
      },
      'bouquet': {
        title: 'Bouquets',
        image: '/custom-images/custom_bouquet.webp',
        fallback: '/category-images/bouquet.webp',
      },
      'handmade-keychain': {
        title: 'Keychains',
        image: '/custom-images/custom_keychains.webp',
        fallback: '/category-images/handmade-keychain.webp',
      },
      'handmade keychain': {
        title: 'Keychains',
        image: '/custom-images/custom_keychains.webp',
        fallback: '/category-images/handmade-keychain.webp',
      },
      'hair-accessories': {
        title: 'Hair Clips',
        image: '/custom-images/custom_hairclips.webp',
        fallback: '/category-images/hair-accessories.webp',
      },
      'toys': {
        title: 'Plushies',
        image: '/custom-images/custom_bunny_overalls.webp',
        fallback: '/category-images/toys.webp',
      },
      'bags--pouches': {
        title: 'Bags & Pouches',
        image: '/custom-images/custom_granny_bag.webp',
        fallback: '/category-images/bags--pouches.webp',
      },
      'gift-box': {
        title: 'Gift Hampers',
        image: '/category-images/gift-box.webp',
        fallback: '/category-images/gift-hampers.webp',
      },
      'flowers': {
        title: 'Forever Flowers',
        image: '/category-images/flowers.webp',
        fallback: '/assets/flower.webp',
      },
    };

    return categories.map((cat) => {
      const cleanSlug = String(cat.id || '').toLowerCase().trim().replace(/\s+/g, '-');
      const meta = metaMap[cat.id] || metaMap[cleanSlug] || {};
      const cleanName = String(cat.label || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
      return {
        id: cat.id,
        title: meta.title || cat.label,
        link: `/shop?category=${encodeURIComponent(cat.label)}`,
        image: meta.image || `/category-images/${cleanName}.webp`,
        fallback: meta.fallback || `/category-images/${cat.id}.webp`,
      };
    });
  }, [categories]);

  const pageSchema = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Shop By Category | Crochet Wali",
      "description": "Browse all categories of Handmade Crochet Gifts, Gajra, Hair Clips, and Custom Bouquets by Crochet Wali.",
      "url": "https://www.crochetwali.in/categories"
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": allCategoryCards.map((cat, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://www.crochetwali.in${cat.link}`
      }))
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-24 font-body selection:bg-stone-900 selection:text-white pt-4 sm:pt-6">
      <SEO 
        title="Categories | Crochet Wali" 
        description="Explore all categories of Crochet Wali's Handmade Crochet and Artisanal gifts." 
        schema={pageSchema}
      />

      <div className="container-custom px-4">
        {/* Header */}
        <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-100 pb-4">
          <div>
            <h1 
              className="text-2xl sm:text-3xl font-bold text-stone-900 leading-tight tracking-tight" 
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Shop By Category
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Curated stitches and bespoke handcrafted treasures for every celebration
            </p>
          </div>
          <Link 
            to="/shop" 
            className="text-rose-900 text-xs sm:text-sm font-bold flex items-center hover:underline self-start sm:self-end"
          >
            Explore All Products <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>

        {/* All Categories Grid (2 Columns on Mobile, 4 Columns on Desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mb-2.5 sm:mb-4">
          {allCategoryCards.map((cat) => (
            <Link
              key={cat.id}
              to={cat.link}
              className="group relative aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 block bg-stone-100"
            >
              {/* Full-bleed Category Image */}
              <img
                src={cat.image}
                alt={cat.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                onError={(e) => {
                  if (cat.fallback && e.currentTarget.src !== cat.fallback) {
                    e.currentTarget.src = cat.fallback;
                  }
                }}
              />

              {/* Scrim Gradient Overlay for Contrast */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 via-45% to-transparent pointer-events-none" 
                aria-hidden="true"
              />

              {/* Bottom Label + Arrow */}
              <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 flex items-center justify-between pointer-events-none">
                <h2
                  className="font-bold text-white text-sm sm:text-base md:text-lg leading-tight drop-shadow-sm tracking-tight"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {cat.title}
                </h2>
                <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white/90 group-hover:translate-x-1 transition-transform duration-300 drop-shadow-sm shrink-0 ml-1.5" />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Full-Width Card: Custom Orders */}
        <Link
          to="/custom-design"
          className="group relative w-full aspect-[16/8] sm:aspect-[21/9] md:h-[220px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 block bg-stone-100 mb-10 sm:mb-14"
        >
          {/* Panoramic Image */}
          <img
            src="/custom-images/custom_hero_banner.webp"
            alt="Custom Handmade Crochet Orders by Crochet Wali"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/assets/hero_crochet_1.webp';
            }}
          />

          {/* Scrim Gradient Overlay */}
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 via-50% to-black/10 pointer-events-none" 
            aria-hidden="true"
          />

          {/* Bottom Title & Action */}
          <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-5 flex items-center justify-between pointer-events-none">
            <div>
              <h2
                className="font-bold text-white text-base sm:text-xl md:text-2xl leading-tight drop-shadow-sm tracking-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Custom Orders
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-200/90 mt-0.5 line-clamp-1">
                Reference photo se banwaye apni pasand ka handmade crochet
              </p>
            </div>
            
            <div className="p-2 sm:p-2.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white group-hover:bg-rose-900 group-hover:border-rose-900 transition-all duration-300 shadow-sm shrink-0 ml-3">
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </Link>

        {/* SEO / AEO FAQ Section */}
        <div className="max-w-3xl mx-auto pb-8">
          <h2 className="text-xl md:text-2xl font-bold text-stone-900 mb-6 text-center" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Frequently Asked Questions About Our Categories
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className={`bg-stone-50 rounded-xl border border-stone-100 overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-md' : 'hover:shadow-sm'}`}
                >
                  <button 
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <h3 className={`font-bold font-body text-base md:text-lg transition-colors duration-300 ${isOpen ? 'text-rose-700' : 'text-stone-900'}`}>
                      {faq.question}
                    </h3>
                    <div className={`p-1 rounded-full flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-rose-100 text-rose-700' : 'bg-stone-200 text-stone-500'}`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>
                  <div 
                    className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="p-5 pt-0 text-stone-600 text-sm md:text-base leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
