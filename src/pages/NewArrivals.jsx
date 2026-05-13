import React, { useMemo, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const NewArrivals = () => {
  const { products, fetchProducts } = useProducts();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetchProducts();
    window.scrollTo(0, 0);
  }, [fetchProducts]);

  const newArrivals = useMemo(() => {
    // Flatten and sort products to get the newest (similar to Home.jsx)
    let flattened = [];
    products.forEach(prod => {
      const validVariants = prod.variants?.filter(v => v.color && v.images && v.images.length > 0) || [];
      if (validVariants.length > 0) {
        flattened.push({
          ...prod,
          uniqueId: `${prod.id}-${validVariants[0].color}`,
          preselectedVariant: validVariants[0],
          price: validVariants[0].price ? Number(validVariants[0].price) : prod.price,
        });
      } else {
        flattened.push({
          ...prod,
          uniqueId: prod.id,
          preselectedVariant: null,
        });
      }
    });
    // Sort by ID descending to simulate "newest"
    return flattened.sort((a, b) => String(b.id).localeCompare(String(a.id))).slice(0, 20); // Top 20 new arrivals
  }, [products]);

  return (
    <div className="bg-white min-h-screen pb-24 font-body selection:bg-stone-900 selection:text-white pt-20">
      <SEO title="New Arrivals" description="Discover the newest creations at Sana's Hand Embroidery." />

      <div className="container-custom">
        <div className="mb-6 pb-4 border-b border-stone-100 flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold text-stone-900 uppercase tracking-widest">New Arrivals</h1>
        </div>

        {newArrivals.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-stone-500 font-bold uppercase tracking-widest">No new arrivals at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {newArrivals.map((product) => (
              <div key={product.uniqueId}>
                <Link to={`/product/${product.id}${product.preselectedVariant ? `?color=${encodeURIComponent(product.preselectedVariant.color)}` : ''}`}>
                  <ProductCard product={product} toggleWishlist={toggleWishlist} isInWishlist={isInWishlist} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewArrivals;
