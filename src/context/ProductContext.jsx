import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../../config/supabase';
import { deleteImage } from '../utils/uploadUtils';

const ProductContext = createContext();

const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const lastFetchTime = useRef(0);

    // Fetch Products (with cache check)
    const fetchProducts = useCallback(async (force = false) => {
        // Skip if we fetched recently and already have data
        const now = Date.now();
        if (!force && products.length > 0 && (now - lastFetchTime.current) < CACHE_DURATION_MS) {
            return;
        }

        try {
            const { data, error } = await supabase
                .from('products')
                .select('id, name, description, price, original_price, category, images, featured, stock_quantity, fabric, clothing_information, variants, created_at, active')
                .eq('active', true)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const mappedProducts = data.map(p => ({
                ...p,
                image: p.images?.[0] || 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500',
                inStock: (p.stock_quantity || 0) > 0,
                stock: p.stock_quantity,
                clothingInformation: p.clothing_information,
                originalPrice: p.original_price,
                discountPercentage: (p.original_price && p.original_price > p.price)
                    ? Math.round(((p.original_price - p.price) / p.original_price) * 100)
                    : 0,
                variants: p.variants || []
            }));

            setProducts(mappedProducts);
            lastFetchTime.current = now;
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, [products.length]); // Intentionally not including 'products' itself, only length if needed to avoid infinite loops, but realistically it's safe if structured well

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

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
                    : 0
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
                            : 0
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
        <ProductContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct, toggleStock, fetchProducts }}>
            {children}
        </ProductContext.Provider>
    );
};
