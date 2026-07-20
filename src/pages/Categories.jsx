import React, { useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../context/CategoryContext';
import { useProducts } from '../context/ProductContext';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { ChevronRight } from 'lucide-react';
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

const Categories = () => {
  const { categories } = useCategories();
  const { products, fetchProducts } = useProducts();

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
        return {
            id: cat.id,
            label: cat.label,
            image: `/category-images/${cleanName}.webp`
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
    <div className="bg-white min-h-screen pb-24 font-body selection:bg-stone-900 selection:text-white pt-20">
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
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 4xl:grid-cols-7 xl:gap-6 3xl:gap-8">
              {dynamicCategories.map((category) => (
                  <Link 
                      key={category.id}
                      to={category.id === 'all' ? '/shop' : `/shop?category=${encodeURIComponent(category.label)}`}
                      className={`group flex flex-col relative rounded-xl overflow-hidden bg-stone-50 border border-stone-100 shadow-sm aspect-square ${category.id === 'all' ? 'bg-gradient-to-br from-rose-900 to-rose-700 items-center justify-center p-4 text-center' : ''}`}
                  >
                      {category.id === 'all' ? (
                          <span className="font-bold text-lg md:text-2xl text-white uppercase tracking-widest leading-tight">ALL<br/>CREATIONS</span>
                      ) : (
                          <>
                              <div className="absolute inset-0 w-full h-full overflow-hidden">
                                  <img 
                                      src={getOptimizedImageUrl(category.image, { width: 400, height: 400, quality: 80 })} 
                                      alt={category.label} 
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                      loading="lazy"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between z-10">
                                  <span className="font-bold text-sm md:text-base text-white uppercase tracking-widest leading-tight">
                                      {category.label}
                                  </span>
                                  <ChevronRight className="w-5 h-5 text-white opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                              </div>
                          </>
                      )}
                  </Link>
              ))}
          </div>

          {/* SEO / AEO FAQ Section */}
          <div className="mt-24 max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-stone-900 mb-8 text-center">Frequently Asked Questions About Our Categories</h2>
              <div className="space-y-6">
                  <div className="bg-stone-50 p-6 rounded-xl border border-stone-100">
                      <h3 className="font-bold text-lg text-stone-900 mb-2">What types of handmade gifts do you offer?</h3>
                      <p className="text-stone-600">We offer a wide variety of handcrafted categories including Crochet Flower Bouquets, traditional Gajras, Hair Clips, Amigurumi Keychains, and personalized Hoop Art. Every item is crafted with premium yarn to ensure it lasts forever.</p>
                  </div>
                  <div className="bg-stone-50 p-6 rounded-xl border border-stone-100">
                      <h3 className="font-bold text-lg text-stone-900 mb-2">Can I order custom designs within these categories?</h3>
                      <p className="text-stone-600">Absolutely. While our categories showcase our most popular and trending designs, we specialize in custom orders. If you see a bouquet or keychain style you like but want it in a different color or size, simply contact us for a customized gift.</p>
                  </div>
                  <div className="bg-stone-50 p-6 rounded-xl border border-stone-100">
                      <h3 className="font-bold text-lg text-stone-900 mb-2">How do I choose the right category for my gift?</h3>
                      <p className="text-stone-600">If you're gifting for an anniversary or Valentine's Day, our 'Bouquets' category is ideal. For small, cute tokens of appreciation, explore our 'Keychains'. For traditional Indian aesthetics, our 'Hair Accessories & Gajra' category is the best choice.</p>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Categories;
