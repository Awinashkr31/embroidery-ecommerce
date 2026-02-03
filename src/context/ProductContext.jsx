import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch Products
    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('active', true) // Default strict, can be adjustable
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Map DB structure to App structure if needed
            // App uses: image (string), inStock (boolean)
            // DB uses: images (array), stock_quantity (int)
            const mappedProducts = data.map(p => ({
                ...p,
                image: p.images?.[0] || 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500',
                inStock: (p.stock_quantity || 0) > 0,
                stock: p.stock_quantity, // Keep raw value too
                clothingInformation: p.clothing_information,
                originalPrice: p.original_price,
                discountPercentage: (p.original_price && p.original_price > p.price)
                    ? Math.round(((p.original_price - p.price) / p.original_price) * 100)
                    : 0
            }));

            setProducts(mappedProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
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
                stock_quantity: parseInt(product.stockQuantity) || 10, // Use input or default
                fabric: product.fabric, // Legacy field support (optional)
                clothing_information: product.clothingInformation || null, // New JSONB field
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
            if (updatedData.name) updates.name = updatedData.name;
            if (updatedData.price) updates.price = parseFloat(updatedData.price);
            if (updatedData.originalPrice !== undefined) updates.original_price = updatedData.originalPrice ? parseFloat(updatedData.originalPrice) : null;
            if (updatedData.category) updates.category = updatedData.category;
            if (updatedData.description) updates.description = updatedData.description;
            if (updatedData.images) updates.images = updatedData.images;
            else if (updatedData.image) updates.images = [updatedData.image];
            
            if (updatedData.featured !== undefined) updates.featured = updatedData.featured;
            if (updatedData.stockQuantity !== undefined) updates.stock_quantity = parseInt(updatedData.stockQuantity);
            if (updatedData.fabric) updates.fabric = updatedData.fabric;
            if (updatedData.clothingInformation !== undefined) updates.clothing_information = updatedData.clothingInformation;

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
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setProducts(prev => prev.filter(prod => prod.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
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
        <ProductContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct, toggleStock }}>
            {children}
        </ProductContext.Provider>
    );
};
