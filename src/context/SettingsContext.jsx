import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';

const SettingsContext = createContext();

const SETTINGS_CACHE_MS = 10 * 60 * 1000; // 10 minutes

export const useSettings = () => useContext(SettingsContext);

// Default structure matching exactly your JSON
const DEFAULT_SETTINGS = {
    announcement_bar: [
      "Get 10% off your first order with code SANA10.",
      "Free shipping on orders over ₹499.",
      "New festive collection just dropped!"
    ],
    hero: {
        title: "Elevate Your Style",
        subtitle: "Discover our latest collection of premium clothing",
        buttonText: "Shop Now",
        buttonLink: "/shop",
        backgroundImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80"
    },
    site_name: "Enbroidery",
    contact_email: "support@enbroidery.com",
    contact_phone: "8002621430",
    address: "Ashok Nagar, Ranchi, Jharkhand",
    social_links: {
        instagram: "https://instagram.com/enbroidery",
        facebook: "https://facebook.com/enbroidery",
        whatsapp: "1234567890"
    },
    about: {
        title: "Our Story",
        description: "We are passionate about bringing traditional embroidery to modern fashion."
    },
    categories: [
        { id: '1', name: "Traditional", link: "/category/traditional" },
        { id: '2', name: "Modern", link: "/category/modern" },
        { id: '3', name: "Bridal", link: "/category/bridal" }
    ],
    policies: {
        return_policy: "We accept returns within 7 days of delivery. Custom items are non-returnable.",
        shipping_policy: "Free shipping on orders over ₹1000. Standard delivery takes 3-5 business days.",
        privacy_policy: "Your privacy is important to us. We do not share your data.",
        terms_of_service: "By using our site, you agree to these terms..."
    },
    payment_methods: {
        cod: true,
        online: true
    },
    razorpay_key_id: "",
    razorpay_key_secret: "",
    admin_approval_required: false,
    shipping_delivery_charge: 50,
    mehndi_packages: [
        {
            id: 1,
            name: "Bridal Package",
            price: 5000,
            features: [
                "Full hands (front & back) up to elbows",
                "Feet up to ankles",
                "Intricate bridal figures",
                "Premium organic henna",
                "Dark stain guarantee"
            ],
            duration: "4-6 Hours"
        },
        {
            id: 2,
            name: "Party Guest Package",
            price: 500,
            features: [
                "Per hand (one side)",
                "Simple arabic/indian designs",
                "Premium organic henna",
                "Quick application (15-20 mins)"
            ],
            duration: "15-20 Mins"
        },
        {
            id: 3,
            name: "Engagement Special",
            price: 2500,
            features: [
                "Both hands up to wrists",
                "Intricate geometric patterns",
                "Couple initials inclusion",
                "Premium organic henna"
            ],
            duration: "2-3 Hours"
        }
    ],
    home_hero_image: "https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=1920",
    home_slider_image_1: "https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=1600&auto=format&fit=crop",
    home_slider_image_2: "https://images.unsplash.com/photo-1616627561839-074385245eb6?q=80&w=1600&auto=format&fit=crop",
    home_slider_image_3: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1600&auto=format&fit=crop",
    home_hero_title: "Weaving Stories in Thread",
    home_hero_subtitle: "Timeless hand embroidery blending tradition with modern aesthetics.",
    home_category_hoop_image: "https://images.unsplash.com/photo-1615561021463-569d643806a6?q=80&w=1200",
    home_category_bridal_image: "https://images.unsplash.com/photo-1546167889-0b4b5ff0afd0?q=80&w=800",
    home_brand_story_image_1: "https://images.unsplash.com/photo-1605218427368-35b8dd98ec65?q=80&w=600",
    home_brand_story_image_2: "https://images.unsplash.com/photo-1594913785162-e6785fdd27f2?q=80&w=600",
    custom_design_banner_image: "",
    custom_design_body_image: "",
    shipping_min_order_value: 200,
    shipping_free_delivery_threshold: 499,
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchSettings = useCallback(async (force = false) => {
        try {
            // Check LocalStorage first for instant load
            const cached = localStorage.getItem('site_settings');
            const cacheTime = localStorage.getItem('site_settings_ts');

            if (cached) {
                setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(cached) });
                setLoading(false);

                // Skip DB fetch if cache is fresh (< 10 min old)
                if (!force && cacheTime && (Date.now() - Number(cacheTime)) < SETTINGS_CACHE_MS) {
                    return;
                }
            }

            // Fetch fresh from DB in background
            const { data, error } = await supabase
                .from('website_settings')
                .select('setting_key, setting_value')

            if (error) {
                console.error('Error fetching settings:', error);
                return;
            }

            const newSettings = data.reduce((acc, curr) => {
                // Attempt to parse JSON strings for specific keys if they are objects/arrays
                if (['announcement_bar', 'mehndi_packages', 'hero', 'social_links', 'about', 'categories', 'policies', 'payment_methods'].includes(curr.setting_key)) {
                    try {
                        acc[curr.setting_key] = JSON.parse(curr.setting_value);
                    } catch {
                        console.warn(`Could not parse JSON for setting_key: ${curr.setting_key}`, curr.setting_value);
                        acc[curr.setting_key] = curr.setting_value; // Fallback to raw value
                    }
                } else {
                    acc[curr.setting_key] = curr.setting_value;
                }
                return acc;
            }, {});

            const mergedSettings = { ...DEFAULT_SETTINGS, ...newSettings };

            const currentCached = localStorage.getItem('site_settings');
            const mergedStr = JSON.stringify(mergedSettings);
            if (mergedStr !== currentCached) {
                setSettings(mergedSettings);
                localStorage.setItem('site_settings', mergedStr);
            }
            localStorage.setItem('site_settings_ts', String(Date.now()));
        } catch (err) {
            console.error('SettingsContext Error:', err);
        } finally {
            setLoading(false);
        }
    }, []); // Removed 'defaults' from dependency array as it's no longer a variable

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    // Function to force refresh (e.g. after Admin update)
    const refreshSettings = (force = false) => fetchSettings(force);

    return (
        <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};
