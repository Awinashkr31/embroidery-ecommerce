import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);

    // Default Images (Fallbacks)
    const defaults = {
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
        mehndi_packages: JSON.stringify([
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
        ])
    };

    const fetchSettings = async () => {
        try {
            // Check LocalStorage first for instant load
            const cached = localStorage.getItem('site_settings');
            if (cached) {
                setSettings({ ...defaults, ...JSON.parse(cached) });
                setLoading(false); 
            }

            // Fetch fresh from DB in background
            const { data, error } = await supabase
                .from('website_settings')
                .select('*');

            if (error) {
                console.error('Error fetching settings:', error);
                return;
            }

            // Convert array [{setting_key: 'foo', setting_value: 'bar'}] to Object {foo: 'bar'}
            const newSettings = data.reduce((acc, curr) => {
                acc[curr.setting_key] = curr.setting_value;
                return acc;
            }, {});

            const mergedSettings = { ...defaults, ...newSettings };
            
            // Only update if changed to avoid renders
            if (JSON.stringify(mergedSettings) !== cached) {
                setSettings(mergedSettings);
                localStorage.setItem('site_settings', JSON.stringify(mergedSettings));
            }
        } catch (err) {
            console.error('SettingsContext Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    // Function to force refresh (e.g. after Admin update)
    const refreshSettings = () => fetchSettings();

    return (
        <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};
