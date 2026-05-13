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
        const normalize = (str) => (str || '').toLowerCase().trim();
        const catName = normalize(cat.label);
        const productForCat = products.find(p => normalize(p.category) === catName && p.image);
        return {
            id: cat.id,
            label: cat.label,
            image: productForCat ? productForCat.image : (CATEGORY_IMAGES[catName] || "https://images.unsplash.com/photo-1616627561839-074385245eb6?q=80&w=600&auto=format&fit=crop")
        };
    });

    return [allCreations, ...fetchedCategories];
  }, [categories, products]);

  return (
    <div className="bg-white min-h-screen pb-24 font-body selection:bg-stone-900 selection:text-white pt-20">
      <SEO title="Categories" description="Explore all categories of Sana's Hand Embroidery." />

      <div className="container-custom">
          <div className="mb-6 pb-4 border-b border-stone-100 flex items-center justify-between">
              <h1 className="text-2xl font-heading font-bold text-stone-900 uppercase tracking-widest">Categories</h1>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
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
      </div>
    </div>
  );
};

export default Categories;
