import React, { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../context/CategoryContext';
import { useProducts } from '../context/ProductContext';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { ChevronRight, ChevronDown } from 'lucide-react';
import SEO from '../components/SEO';

const CATEGORY_IMAGES = {
    'home decor': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600',
    'accessories': 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600',
    'art': 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=600',
    'gifts': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600',
    'hoop art': 'https://images.unsplash.com/photo-1584285406059-e9eb7b17d740?w=600',
    'bridal': 'https://images.unsplash.com/photo-1583939000240-410c5cb2ed29?w=600',
    'custom': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
    'jewelry': 'https://images.unsplash.com/photo-1599643478524-fb66f70d00f8?w=600',
    'clothing': 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600'
};

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
  const { products, fetchProducts } = useProducts();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    fetchProducts();
    window.scrollTo(0, 0);
  }, [fetchProducts]);

  const dynamicCategories = useMemo(() => {
    // Add "All Creations" to the top of the list
    const allCreations = {
      id: 'all',
      label: 'All Creations',
      image: '/logo.png', // Fallback or distinct icon
    };

    const fetchedCategories = categories.map(cat => {
        const cleanName = cat.label.toLowerCase().trim().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
        // Use the first product image from this category as the card image
        const categoryProduct = products.find(p => (p.category === cat.id || p.category === cat.label) && p.image && !p.image.includes('unsplash'));
        return {
            id: cat.id,
            label: cat.label,
            image: categoryProduct?.image || `/category-images/${cleanName}.webp`
        };
    });

    return [allCreations, ...fetchedCategories];
  }, [categories, products]);

  const pageSchema = [
      {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "All Categories | Crochet Wali",
          "description": "Browse all categories of Handmade Crochet Gifts, Gajra, Hair Clips, and Custom Bouquets by Crochet Wali.",
          "url": "https://www.embroiderybysana.live/categories"
      },
      {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": dynamicCategories.map((cat, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "url": cat.id === 'all' ? 'https://www.embroiderybysana.live/shop' : `https://www.embroiderybysana.live/shop?category=${encodeURIComponent(cat.label)}`
          }))
      }
  ];

  return (
    <div className="bg-white min-h-screen pb-24 font-body selection:bg-stone-900 selection:text-white pt-6">
      <SEO 
        title="Categories | Crochet Wali" 
        description="Explore all categories of Crochet Wali's Handmade Crochet and Embroidery gifts." 
        schema={pageSchema}
      />

      <div className="container-custom">
          <div className="mb-6 pb-4 border-b border-stone-100 flex flex-col items-start justify-between">
              <h1 className="text-2xl font-heading font-bold text-stone-900 uppercase tracking-widest mb-2">Categories</h1>
              <p className="text-stone-600 text-sm max-w-3xl leading-relaxed">Browse through our beautifully curated collections of Handmade Crochet Gifts and crochet gifts. From elegant personalized hoops for weddings to cute custom accessories and forever flower bouquets, find the perfect category for your gifting needs.</p>
          </div>

          <h2 className="sr-only">Handmade Gift Collections by Crochet Wali</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 justify-items-center gap-x-2 gap-y-6 sm:gap-x-4 sm:gap-y-8 md:gap-x-8 md:gap-y-10 pb-8 px-1 md:px-0">
              {dynamicCategories.map((category) => (
                  <Link 
                      key={category.id}
                      to={category.id === 'all' ? '/shop' : `/shop?category=${encodeURIComponent(category.label)}`}
                      className="group flex flex-col items-center w-full"
                  >
                      <div className={`w-[105px] h-[105px] sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full p-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.08)] group-hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] group-hover:-translate-y-1 transition-all duration-300 ${category.id === 'all' ? 'bg-gradient-to-br from-rose-700 to-rose-500' : 'bg-white'}`}>
                          <div className={`w-full h-full rounded-full overflow-hidden flex flex-col items-center justify-center ${category.id === 'all' ? 'bg-transparent' : 'bg-stone-50'}`}>
                              {category.id === 'all' ? (
                                  <>
                                      <span className="font-bold text-xs sm:text-base text-rose-100 uppercase tracking-widest leading-none mb-1">ALL</span>
                                      <span className="font-bold text-xs sm:text-base text-white uppercase tracking-widest leading-none">SHOP</span>
                                  </>
                              ) : (
                                  <img 
                                      src={getOptimizedImageUrl(category.image, { width: 400, height: 400, quality: 80 })} 
                                      alt={category.label} 
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                      loading="lazy"
                                  />
                              )}
                          </div>
                      </div>
                      <span className="font-semibold text-[10px] sm:text-sm md:text-base text-center uppercase tracking-wider text-stone-800 group-hover:text-[#6e132b] transition-colors break-words w-full max-w-[110px] sm:max-w-[140px] px-1 mt-3 md:mt-4 line-clamp-2">
                          {category.id === 'all' ? 'ALL CREATIONS' : category.label}
                      </span>
                  </Link>
              ))}
          </div>

          {/* SEO / AEO FAQ Section */}
          <div className="mt-12 max-w-3xl mx-auto px-4 md:px-0">
              <h2 className="text-xl md:text-2xl font-heading font-bold text-stone-900 mb-8 text-center">Frequently Asked Questions About Our Categories</h2>
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
