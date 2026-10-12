import { createContext, useContext, useState, useRef, useCallback } from 'react';
import { supabase } from '../../config/supabase';
import { deleteImage } from '../utils/uploadUtils';

const ProductContext = createContext();

const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes cache
const CACHE_KEY = 'cw_products_cache';
const CACHE_TIME_KEY = 'cw_products_cache_time';

export const useProducts = () => useContext(ProductContext);

// Helper to normalize and map raw DB products
const mapProductRecord = (p) => {
    let parsedImages = p.images;
    if (typeof parsedImages === 'string') {
        try { parsedImages = JSON.parse(parsedImages); } catch (e) { parsedImages = []; }
    }
    let parsedVariants = p.variants;
    if (typeof parsedVariants === 'string') {
        try { parsedVariants = JSON.parse(parsedVariants); } catch (e) { parsedVariants = []; }
    }
    
    return {
        ...p,
        images: Array.isArray(parsedImages) ? parsedImages : [],
        image: (Array.isArray(parsedImages) && parsedImages.length > 0) ? parsedImages[0] : 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500',
        inStock: (p.stock_quantity || 0) > 0,
        stock: p.stock_quantity,
        clothingInformation: p.clothing_information,
        originalPrice: p.original_price,
        discountPercentage: (p.original_price && p.original_price > p.price)
            ? Math.round(((p.original_price - p.price) / p.original_price) * 100)
            : 0,
        variants: Array.isArray(parsedVariants) ? parsedVariants : [],
        homepage_tags: Array.isArray(p.homepage_tags) ? p.homepage_tags : []
    };
};

export const ProductProvider = ({ children }) => {
    // Instant hydration from sessionStorage if available
    const [products, setProducts] = useState(() => {
        try {
            const cached = sessionStorage.getItem(CACHE_KEY);
            return cached ? JSON.parse(cached) : [];
        } catch {
            return [];
        }
    });
    const [loading, setLoading] = useState(() => {
        try {
            return !sessionStorage.getItem(CACHE_KEY);
        } catch {
            return true;
        }
    });

    const productsRef = useRef(products);
    productsRef.current = products;

    const lastFetchTime = useRef(() => {
        try {
            return Number(sessionStorage.getItem(CACHE_TIME_KEY)) || 0;
        } catch {
            return 0;
        }
    });
    const isFetching = useRef(false);

    // Fetch Products (with SWR cache check)
    const fetchProducts = useCallback(async (force = false) => {
        const now = Date.now();
        const hasData = productsRef.current.length > 0;
        const isFresh = (now - lastFetchTime.current) < CACHE_DURATION_MS;

        // Skip network hit if fresh and not forced
        if (!force && hasData && isFresh) {
            setLoading(false);
            return productsRef.current;
        }

        if (isFetching.current) return productsRef.current;
        isFetching.current = true;

        // If we have stale data, don't show full-page loading spinner (Stale-While-Revalidate)
        if (!hasData) setLoading(true);

        try {
            const { data, error } = await supabase
                .from('products')
                .select('id, name, description, price, original_price, category, images, featured, stock_quantity, fabric, clothing_information, variants, created_at, active, homepage_tags')
                .eq('active', true)
                .order('created_at', { ascending: false })
                .limit(500);

            if (error) throw error;

            const mappedProducts = (data || []).map(mapProductRecord);

            setProducts(mappedProducts);
            lastFetchTime.current = now;

            try {
                sessionStorage.setItem(CACHE_KEY, JSON.stringify(mappedProducts));
                sessionStorage.setItem(CACHE_TIME_KEY, String(now));
            } catch {
                // SessionStorage may fail on quota exceeded, gracefully ignore
            }

            return mappedProducts;
        } catch (error) {
            console.error('Error fetching products:', error);
            return productsRef.current;
        } finally {
            isFetching.current = false;
            setLoading(false);
        }
    }, []); // Stable dependency array!

    // Fetch single product by id or slug (prevents downloading 500 products on direct product page hit)
    const fetchSingleProduct = useCallback(async (idOrSlug) => {
        if (!idOrSlug) return null;
        
        // 1. Check memory / existing products
        const existing = productsRef.current.find(p => 
            p.id === idOrSlug || 
            p.clothing_information?.slug === idOrSlug ||
            p.name?.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === idOrSlug.toLowerCase()
        );
        if (existing) return existing;

        // 2. Fetch specific product from DB (Single-row query!)
        try {
            let query = supabase
                .from('products')
                .select('id, name, description, price, original_price, category, images, featured, stock_quantity, fabric, clothing_information, variants, created_at, active, homepage_tags')
                .eq('active', true);

            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
            if (isUUID) {
                query = query.eq('id', idOrSlug);
            } else {
                // Match by slug or name
                query = query.or(`id.eq.${idOrSlug},name.ilike.%${idOrSlug.replace(/-/g, ' ')}%`);
            }

            const { data, error } = await query.limit(1);
            if (error || !data || data.length === 0) return null;

            const mapped = mapProductRecord(data[0]);
            
            // Add to products array in background
            setProducts(prev => {
                if (prev.some(p => p.id === mapped.id)) return prev;
                return [...prev, mapped];
            });
            return mapped;
        } catch (err) {
            console.error('Error fetching single product:', err);
            return null;
        }
    }, []);

    const addProduct = async (product) => {
        try {
            // Map frontend product to DB schema
            const dbProduct = {
                name: product.name,
                description: product.description,
                price: parseFloat(product.price),
                original_price: product.originalPrice ? parseFloat(product.originalPrice) : null,
                category: product.category,
                images: Array.isArray(product.images) ? product.images : [product.image], // Handle multiple images
                featured: product.featured,
                stock_quantity: Number(product.stockQuantity) || 10, // Use input or default
                fabric: product.fabric, // Legacy field support (optional)
                clothing_information: product.clothingInformation || null, // New JSONB field
                variants: product.variants || [], // New Variants JSONB field
                homepage_tags: product.homepage_tags || [], // Homepage section tags
                active: true
            };

            const { data, error } = await supabase
                .from('products')
                .insert([dbProduct])
                .select()
                .single();

            if (error) throw error;

            // Optimistic update or refetch
            // For simplicity, we just refetch or append mapped product
            const newProduct = {
                ...data,
                image: data.images?.[0], // Main image
                images: data.images, // All images
                inStock: data.stock_quantity > 0,
                stock: data.stock_quantity,
                fabric: data.fabric,
                clothingInformation: data.clothing_information,
                originalPrice: data.original_price,
                discountPercentage: (data.original_price && data.original_price > data.price)
                    ? Math.round(((data.original_price - data.price) / data.original_price) * 100)
                    : 0,
                homepage_tags: data.homepage_tags || []
            };
            setProducts(prev => [newProduct, ...prev]);
            return data;
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    };

    const updateProduct = async (id, updatedData) => {
        try {
            // Prepare update object
            const updates = {};
            if (updatedData.name !== undefined) updates.name = updatedData.name;
            if (updatedData.price !== undefined) updates.price = parseFloat(updatedData.price);
            if (updatedData.originalPrice !== undefined) updates.original_price = updatedData.originalPrice ? parseFloat(updatedData.originalPrice) : null;
            if (updatedData.category !== undefined) updates.category = updatedData.category;
            if (updatedData.description !== undefined) updates.description = updatedData.description;
            if (updatedData.images) updates.images = updatedData.images;
            else if (updatedData.image) updates.images = [updatedData.image];
            
            if (updatedData.featured !== undefined) updates.featured = updatedData.featured;
            if (updatedData.stockQuantity !== undefined) updates.stock_quantity = Number(updatedData.stockQuantity);
            if (updatedData.fabric !== undefined) updates.fabric = updatedData.fabric;
            if (updatedData.clothingInformation !== undefined) updates.clothing_information = updatedData.clothingInformation;
            if (updatedData.variants !== undefined) updates.variants = updatedData.variants;
            if (updatedData.homepage_tags !== undefined) updates.homepage_tags = updatedData.homepage_tags;

            const { data, error } = await supabase
                .from('products')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            setProducts(prev => prev.map(prod => {
                if (prod.id === id) {
                    return {
                        ...prod,
                        ...data,
                        // Ensure all frontend-specific mappings are updated
                        image: data.images?.[0] || prod.image,
                        images: data.images,
                        clothingInformation: data.clothing_information,
                        originalPrice: data.original_price,
                        stock: data.stock_quantity,
                        inStock: (data.stock_quantity || 0) > 0,
                        discountPercentage: (data.original_price && data.original_price > data.price)
                            ? Math.round(((data.original_price - data.price) / data.original_price) * 100)
                            : 0,
                        homepage_tags: data.homepage_tags || []
                    };
                }
                return prod;
            }));
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    };
    const deleteProduct = async (id) => {
        try {
            // 1. Get image list for cleanup
            const product = products.find(p => p.id === id);
            const imagesToDelete = [];
            
            if (product) {
                if (product.image) imagesToDelete.push(product.image);
                if (product.images && Array.isArray(product.images)) {
                    product.images.forEach(img => {
                        if (img !== product.image) imagesToDelete.push(img);
                    });
                }
                // Cleanup variant images too
                if (product.variants && Array.isArray(product.variants)) {
                    product.variants.forEach(v => {
                        if (v.images && Array.isArray(v.images)) {
                            v.images.forEach(img => imagesToDelete.push(img));
                        }
                    });
                }
            }

            // Execute storage cleanups in parallel
            if (imagesToDelete.length > 0) {
                await Promise.all(imagesToDelete.map(url => deleteImage(url)));
            }

            // 2. Delete from DB
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setProducts(prev => prev.filter(prod => prod.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    };

    const toggleStock = async (id) => {
        try {
            // Find current product to toggle
            const product = products.find(p => p.id === id);
            if (!product) return;

            // Logic: If in stock (qty > 0), set to 0. If 0, set to 10.
            const newQuantity = product.stock > 0 ? 0 : 10;

            const { error } = await supabase
                .from('products')
                .update({ stock_quantity: newQuantity })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            setProducts(prev => prev.map(prod => 
                prod.id === id ? { 
                    ...prod, 
                    stock: newQuantity, 
                    inStock: newQuantity > 0 
                } : prod
            ));
        } catch (error) {
            console.error('Error toggling stock:', error);
        }
    };

    return (
        <ProductContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct, toggleStock, fetchProducts, fetchSingleProduct }}>
            {children}
        </ProductContext.Provider>
    );
};
