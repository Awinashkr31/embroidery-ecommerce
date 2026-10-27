import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { useToast } from './ToastContext';

const CategoryContext = createContext();

export const useCategories = () => useContext(CategoryContext);

// Generates a stable slug-like ID from a label.
// This ensures renaming a category only updates the label, not the ID.
const slugify = (text) =>
    text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const DEFAULT_CATEGORIES = [
    { id: 'flower-pot', label: 'Flower Pot' },
    { id: 'gift-box', label: 'Gift Hampers' },
    { id: 'bouquet', label: 'Bouquet' },
    { id: 'handmade-keychain', label: 'Keychain & Bag Charm' },
    { id: 'hair-accessories', label: 'Hair Accessories' },
    { id: 'flowers', label: "Flower's" },
    { id: 'toys', label: 'Toys' },
    { id: 'bags--pouches', label: 'Bags & Pouches' }
];

const CATEGORY_CACHE_MS = 10 * 60 * 1000; // 10 minutes

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState(() => {
        try {
            const cached = localStorage.getItem('site_categories');
            return cached ? JSON.parse(cached) : DEFAULT_CATEGORIES;
        } catch {
            return DEFAULT_CATEGORIES;
        }
    });
    const [loading, setLoading] = useState(() => {
        try {
            return !localStorage.getItem('site_categories');
        } catch {
            return true;
        }
    });
    const { addToast } = useToast();

    const fetchCategories = useCallback(async (force = false) => {
        try {
            const cached = localStorage.getItem('site_categories');
            const cacheTime = localStorage.getItem('site_categories_ts');

            // Skip DB fetch if cache is fresh (< 10 min old) unless forced
            if (!force && cached && cacheTime && (Date.now() - Number(cacheTime)) < CATEGORY_CACHE_MS) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('website_settings')
                .select('setting_value')
                .eq('setting_key', 'product_categories')
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "Row not found"

            if (data && data.setting_value) {
                // Ensure it's an array
                const parsed = Array.isArray(data.setting_value) ? data.setting_value : JSON.parse(data.setting_value);

                // Migrate legacy categories: if id === label (old format), assign a stable slug id
                // Ensure "Home Decor" is never present (owner confirmed on 2026-10-27 that Home Decor is NOT a category)
                const migrated = parsed
                    .filter(cat => slugify(cat.id) !== 'home-decor' && slugify(cat.label) !== 'home-decor')
                    .map(cat => ({
                        ...cat,
                        id: cat.id === cat.label ? slugify(cat.label) : cat.id,
                        label: cat.label.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
                    }));

                setCategories(migrated);
                try {
                    localStorage.setItem('site_categories', JSON.stringify(migrated));
                    localStorage.setItem('site_categories_ts', String(Date.now()));
                } catch {}
            } else {
                setCategories(DEFAULT_CATEGORIES);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
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
            try {
                localStorage.setItem('site_categories', JSON.stringify(newCategories));
                localStorage.setItem('site_categories_ts', String(Date.now()));
            } catch {}
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

        // Use a stable slug as the ID — NOT the label string.
        // This means renaming the category won't break existing product references.
        const id = slugify(label);
        const newCat = { id, label };

        // Check duplicate by ID
        if (categories.some(c => c.id === id)) {
            addToast('Category already exists', 'error');
            return false;
        }
        const newCategories = [...categories, newCat];
        return await saveCategories(newCategories);
    };

    const updateCategory = async (oldId, newLabel) => {
        // Key fix: ONLY update the label, never the id.
        // This prevents existing products assigned to oldId from becoming orphaned.
        const capitalizedLabel = newLabel
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

        const newCategories = categories.map(c =>
            c.id === oldId ? { ...c, label: capitalizedLabel } : c
        );
        return await saveCategories(newCategories);
    };

    const deleteCategory = async (id) => {
        const newCategories = categories.filter(c => c.id !== id);
        return await saveCategories(newCategories);
    };

    const moveCategory = async (id, direction) => {
        const index = categories.findIndex(c => c.id === id);
        if (index === -1) return;

        const newCategories = [...categories];
        const newIndex = direction === 'up' ? index - 1 : index + 1;

        if (newIndex >= 0 && newIndex < newCategories.length) {
            [newCategories[index], newCategories[newIndex]] = [newCategories[newIndex], newCategories[index]];
            return await saveCategories(newCategories);
        }
    };

    const value = {
        categories,
        loading,
        addCategory,
        updateCategory,
        deleteCategory,
        moveCategory,
        refreshCategories: fetchCategories
    };

    return (
        <CategoryContext.Provider value={value}>
            {children}
        </CategoryContext.Provider>
    );
};
