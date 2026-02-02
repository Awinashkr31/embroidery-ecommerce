import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { useToast } from './ToastContext';

const CategoryContext = createContext();

export const useCategories = () => useContext(CategoryContext);

const DEFAULT_CATEGORIES = [
    { id: 'Home Decor', label: 'Home Decor' },
    { id: 'Accessories', label: 'Accessories' },
    { id: 'Art', label: 'Art' },
    { id: 'Gifts', label: 'Gifts' },
    { id: 'Hoop Art', label: 'Hoop Art' },
    { id: 'Bridal', label: 'Bridal' },
    { id: 'Clothing', label: 'Clothing' },
    { id: 'Mens Ethnic', label: 'Mens Ethnic' },
    { id: 'Womens Ethnic', label: 'Womens Ethnic' }
];

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    const fetchCategories = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('website_settings')
                .select('setting_value')
                .eq('setting_key', 'product_categories')
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "Row not found"

            if (data && data.setting_value) {
                // Ensure it's an array
                const parsed = Array.isArray(data.setting_value) ? data.setting_value : JSON.parse(data.setting_value);
                
                // Auto-capitalize existing categories on load
                const formatted = parsed.map(cat => ({
                    ...cat,
                    label: cat.label.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
                }));
                
                setCategories(formatted);
            } else {
                // If not found, use defaults and save them (optional, but good for first run)
                setCategories(DEFAULT_CATEGORIES);
                // We don't auto-save to DB here to avoid unintentional writes on every load if RLS blocks it
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Fallback to defaults
            setCategories(DEFAULT_CATEGORIES);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const saveCategories = async (newCategories) => {
        try {
            const { error } = await supabase
                .from('website_settings')
                .upsert({ 
                    setting_key: 'product_categories', 
                    setting_value: newCategories,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'setting_key' });

            if (error) throw error;
            
            setCategories(newCategories);
            addToast('Categories updated successfully', 'success');
            return true;
        } catch (error) {
            console.error('Error saving categories:', error);
            addToast('Failed to save categories', 'error');
            return false;
        }
    };

    const addCategory = async (rawLabel) => {
        // Auto-capitalize: First letter of each word
        const label = rawLabel
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

        const id = label; // Simple ID generation, or use label as ID
        const newCat = { id, label };
        // Check duplicate
        if (categories.some(c => c.id === id)) {
            addToast('Category already exists', 'error');
            return false;
        }
        const newCategories = [...categories, newCat];
        return await saveCategories(newCategories);
    };

    const updateCategory = async (oldId, newLabel) => {
        const newCategories = categories.map(c => 
            c.id === oldId ? { id: newLabel, label: newLabel } : c // updating ID too for simplicity since ID is used as value
        );
        return await saveCategories(newCategories);
    };

    const deleteCategory = async (id) => {
        const newCategories = categories.filter(c => c.id !== id);
        return await saveCategories(newCategories);
    };

    const value = {
        categories,
        loading,
        addCategory,
        updateCategory,
        deleteCategory,
        refreshCategories: fetchCategories
    };

    return (
        <CategoryContext.Provider value={value}>
            {children}
        </CategoryContext.Provider>
    );
};
