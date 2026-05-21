import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../config/supabase';
import { Save, Globe, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Loader, Image as ImageIcon, Upload, FileText, LayoutTemplate, Type, Pencil, X, Plus, Trash2, IndianRupee, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import { useSettings } from '../../context/SettingsContext';
import imageCompression from 'browser-image-compression';
import ImageCropper from '../../components/ImageCropper';
import { deleteImage } from '../../utils/uploadUtils';

const Settings = () => {
    const { addToast } = useToast();
    const { refreshSettings } = useSettings();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const [deleteImagePendingKey, setDeleteImagePendingKey] = useState(null);

    // Cropping State
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [cropImageSrc, setCropImageSrc] = useState(null);
    const [cropKey, setCropKey] = useState(null);

    const [settings, setSettings] = useState({
        // General
        contactEmail: '',
        contactPhone: '',
        address: '',
        facebookUrl: '',
        instagramUrl: '',
        twitterUrl: '',

        // Store / Shipping Settings
        shipping_min_order_value: 200,
        shipping_free_delivery_threshold: 499,
        shipping_delivery_charge: 50,
        cod_extra_charge: 0,
        cod_status: 'active',
        chatbot_enabled: 'false',

        // Home
        home_hero_title: 'Weaving Stories in Thread',
        home_hero_subtitle: 'Timeless hand embroidery blending tradition with modern aesthetics.',
        home_hero_image: '',
        home_slider_image_1: '',
        home_slider_image_2: '',
        home_slider_image_3: '',
        home_category_hoop_image: '',
        home_category_bridal_image: '',
        home_brand_story_image_1: '',
        home_brand_story_image_2: '',
        
        home_promo_banner_image: '',
        home_promo_banner_link: '/shop',
        home_masonry_1_image: '',
        home_masonry_1_text: 'Gold Collection',
        home_masonry_1_link: '/shop',
        home_masonry_2_image: '',
        home_masonry_2_text: 'Festive Edit',
        home_masonry_2_link: '/shop',
        home_masonry_3_image: '',
        home_masonry_3_text: 'Exclusive Masterpieces',
        home_masonry_3_link: '/shop',
        home_craftsmanship_image: '',
        home_craftsmanship_link: '/shop',
        home_premium_banner_image: '',
        home_premium_banner_link: '/shop',
        // About
        about_hero_title: 'About Sana',
        about_hero_subtitle: 'A passionate artist dedicated to preserving and celebrating the timeless beauty of hand embroidery and mehndi art.',
        about_story_title: 'My Journey with Thread & Henna',
        about_story_text: "What started as a childhood fascination with my grandmother's intricate needlework has blossomed into a lifelong passion...",
        about_story_image: '',
        about_signature_image: '',

        // Custom Design
        custom_design_title: 'Custom Design Request',
        custom_design_subtitle: "Let's bring your unique vision to life.",
        custom_design_banner_image: '',
        custom_design_body_image: '',

        // Mehndi
        mehndi_title: 'Mehndi Booking',
        mehndi_subtitle: 'Professional mehndi artistry for your special occasions.',
        mehndi_feature_image: '',
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
        ]),

        // Gallery
        gallery_title: 'Our Gallery',
        gallery_subtitle: 'Explore our latest works and handcrafted collections.',
        gallery_banner_image: ''
    });

    const fetchSettings = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('website_settings')
                .select('setting_key, setting_value');

            if (error) throw error;

            if (data && data.length > 0) {
                const settingsObj = {};
                data.forEach(item => {
                    // If the value is an object/array (JSONB), stringify it for the state
                    // because our inputs/editors expect string values.
                    if (typeof item.setting_value === 'object' && item.setting_value !== null) {
                        settingsObj[item.setting_key] = JSON.stringify(item.setting_value);
                    } else {
                        settingsObj[item.setting_key] = item.setting_value;
                    }
                });
                setSettings(prev => ({ ...prev, ...settingsObj }));
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            addToast('Failed to load settings', 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const getCropTargetSize = (key) => {
        if (!key) return null;
        
        if (typeof key === 'object' && key.type === 'slide') {
            // Desktop slider: 1920x800, Mobile slider: 800x1000
            return key.field === 'mobileImage' ? { width: 800, height: 1000 } : { width: 1920, height: 800 };
        }

        if (typeof key === 'string') {
            if (key === 'home_promo_banner_image_mobile') return { width: 800, height: 260 };
            if (key.includes('_mobile')) return { width: 800, height: 800 }; // Mobile banners are typically square for generous height
            
            if (key === 'home_masonry_1_image') return { width: 900, height: 1200 }; // Left Tall Banner
            if (key === 'home_masonry_2_image' || key === 'home_masonry_3_image') return { width: 1200, height: 800 }; // Right Stacked Banners (3:2 ratio to match 3:4 left banner)
            if (key === 'home_craftsmanship_image' || key === 'home_premium_banner_image') return { width: 1920, height: 820 }; // Ultra wide banners
            if (key.includes('promo_banner')) return { width: 1920, height: 400 };
            if (key.includes('hero')) return { width: 1920, height: 800 };
            if (key.includes('story')) return { width: 1200, height: 900 };
            if (key.includes('category')) return { width: 800, height: 1000 };
        }
        
        return { width: 1000, height: 1000 }; // Fallback square
    };

    const handleImageUpload = (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.addEventListener('load', () => {
             setCropImageSrc(reader.result);
             setCropKey(key);
             setCropModalOpen(true);
             e.target.value = null;
        });
        reader.readAsDataURL(file);
    };

    const handleCropComplete = async (croppedBlob) => {
        if (!croppedBlob) {
             setCropModalOpen(false);
             return;
        }

        try {
            setUploading(true);
            setCropModalOpen(false);

            // Convert Blob to File for compression library
            const file = new File([croppedBlob], `setting_${Date.now()}.jpg`, {
                type: 'image/jpeg',
                lastModified: Date.now()
            });

            const key = cropKey;
            
            let targetSizeMB = 0.08; // Default 80KB for regular images
            if (typeof key === 'object' && key.type === 'slide') {
                targetSizeMB = 0.15; // 150KB for main slides
            } else if (typeof key === 'string' && (key.includes('hero') || key.includes('promo_banner') || key.includes('masonry') || key.includes('craftsmanship') || key.includes('premium_banner'))) {
                targetSizeMB = 0.15; // 150KB for large banners and hero images
            }

            const options = {
                maxSizeMB: targetSizeMB,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                fileType: 'image/webp'
            };
            
            let uploadFile = file;
            try {
                uploadFile = await imageCompression(file, options);
            } catch (cErr) {
                console.warn("Compression failed, using original:", cErr);
            }

            
            let oldUrl = null;
            if (typeof key === 'string') {
                oldUrl = settings[key];
            } else if (key?.type === 'slide') {
                try {
                    const slides = Array.isArray(settings.home_slides_data) ? settings.home_slides_data : JSON.parse(settings.home_slides_data || '[]');
                    oldUrl = slides[key.index][key.field];
                } catch(e) {}
            }

            if (oldUrl) await deleteImage(oldUrl);

            const fileExt = 'webp';
            const fileName = `${typeof key === 'string' ? key : 'slide_' + key.field + '_' + Date.now()}_${Date.now()}.${fileExt}`;
            const filePath = `site-assets/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, uploadFile, {
                    contentType: 'image/webp',
                    cacheControl: '3600'
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            if (typeof key === 'string') {
                setSettings(prev => ({ ...prev, [key]: publicUrl }));
            } else if (key?.type === 'slide') {
                setSettings(prev => {
                    const slides = Array.isArray(prev.home_slides_data) ? [...prev.home_slides_data] : JSON.parse(prev.home_slides_data || '[]');
                    slides[key.index] = { ...slides[key.index], [key.field]: publicUrl };
                    return { ...prev, home_slides_data: slides };
                });
            }
            addToast('Image uploaded! Click "Save Changes" at the bottom to apply.', 'success');

        } catch (error) {
            console.error('Upload failed:', error);
            addToast(`Failed to upload: ${error.message || 'Unknown error'}`, 'error');
        } finally {
            setUploading(false);
            setCropImageSrc(null);
            setCropKey(null);
        }
    };

    const handleImageDelete = async (key) => {
        const keyString = typeof key === 'string' ? key : JSON.stringify(key);
        if (deleteImagePendingKey !== keyString) {
            setDeleteImagePendingKey(keyString);
            addToast('Tap remove again to confirm deletion.', 'error');
            return;
        }
        setDeleteImagePendingKey(null);
        try {
            setUploading(true);
            let oldUrl = null;
            if (typeof key === 'string') {
                oldUrl = settings[key];
                if (oldUrl) await deleteImage(oldUrl);
                setSettings(prev => ({ ...prev, [key]: '' }));
            } else if (key?.type === 'slide') {
                const slides = Array.isArray(settings.home_slides_data) ? settings.home_slides_data : JSON.parse(settings.home_slides_data || '[]');
                oldUrl = slides[key.index]?.[key.field];
                if (oldUrl) await deleteImage(oldUrl);
                setSettings(prev => {
                    const newSlides = Array.isArray(prev.home_slides_data) ? [...prev.home_slides_data] : JSON.parse(prev.home_slides_data || '[]');
                    newSlides[key.index] = { ...newSlides[key.index], [key.field]: '' };
                    return { ...prev, home_slides_data: newSlides };
                });
            }
            addToast('Image removed. Click Save to persist.', 'info');
        } catch (error) {
             console.error('Delete failed:', error);
             addToast('Failed to remove image.', 'error');
        } finally {
            setUploading(false);
        }
    };

    const homeSlides = React.useMemo(() => {
        try {
            return Array.isArray(settings.home_slides_data) ? settings.home_slides_data : JSON.parse(settings.home_slides_data || '[]');
        } catch {
            return [];
        }
    }, [settings.home_slides_data]);

    const handleSlideChange = (index, field, value) => {
        const slides = [...homeSlides];
        slides[index] = { ...slides[index], [field]: value };
        setSettings(prev => ({...prev, home_slides_data: slides}));
    };

    const handleAddSlide = () => {
        const slides = [...homeSlides];
        slides.push({ id: Date.now(), desktopImage: '', mobileImage: '', link: '' });
        setSettings(prev => ({...prev, home_slides_data: slides}));
    };

    const handleRemoveSlide = (index) => {
        const slides = [...homeSlides];
        slides.splice(index, 1);
        setSettings(prev => ({...prev, home_slides_data: slides}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const updates = Object.entries(settings).map(([key, value]) => {
                return supabase
                    .from('website_settings')
                    .upsert({ 
                        setting_key: key, 
                        setting_value: value,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'setting_key' });
            });

            await Promise.all(updates);
            
            // Force global context to refresh immediately
            if (refreshSettings) {
                await refreshSettings(true);
            }
            
            addToast('All settings saved successfully', 'success');
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving settings:', error);
            addToast('Failed to save settings', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader className="w-8 h-8 animate-spin text-rose-900" />
            </div>
        );
    }

    const tabs = [
        { id: 'general', label: 'General Info' },
        { id: 'home', label: 'Home Page' },
        { id: 'about', label: 'About Page' },
        { id: 'custom', label: 'Custom Design' },
        { id: 'mehndi', label: 'Mehndi Booking' },
        { id: 'gallery', label: 'Gallery Page' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-stone-900">Settings & Content</h1>
                    <p className="text-stone-500 text-sm mt-0.5">Manage global settings and page content.</p>
                </div>
                {/* Floating Action Buttons */}
                <div className="fixed bottom-6 right-6 z-50 flex flex-col md:flex-row shadow-2xl rounded-2xl p-2 bg-white/90 backdrop-blur-md border border-stone-200 gap-2 animate-fade-in">
                    {isEditing && (
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="flex-1 md:flex-none justify-center flex items-center px-6 py-3 bg-rose-900 text-white rounded-xl hover:bg-rose-800 disabled:opacity-70 transition-all shadow-sm text-sm font-bold tracking-wide hover:scale-105"
                        >
                            {saving ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin mr-2" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    )}
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`flex-1 md:flex-none justify-center flex items-center px-6 py-3 rounded-xl text-sm font-bold tracking-wide transition-all shadow-sm hover:scale-105 ${
                            isEditing 
                            ? 'bg-stone-100 text-stone-600 hover:bg-stone-200' 
                            : 'bg-stone-900 text-white hover:bg-stone-800'
                        }`}
                    >
                        {isEditing ? (
                            <>
                                <X className="w-4 h-4 mr-2" /> Cancel Editing
                            </>
                        ) : (
                            <>
                                <Pencil className="w-4 h-4 mr-2" /> Edit Settings
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-stone-200 gap-1 no-scrollbar pb-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-5 py-2.5 text-sm font-bold whitespace-nowrap transition-colors relative rounded-t-lg
                            ${activeTab === tab.id 
                                ? 'text-rose-900 bg-rose-50/50' 
                                : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
                            }
                        `}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-[-5px] left-0 right-0 h-0.5 bg-rose-900 rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.form 
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit} 
                    className="space-y-8"
                >
                
                {/* GENERAL TAB */}
                {activeTab === 'general' && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="bg-white p-6 rounded-xl border-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-rose-900" /> Site Preferences
                                </h3>
                                <div className="flex items-center gap-4">
                                    <ToggleSwitch 
                                        label="Enable Chatbot"
                                        value={settings.chatbot_enabled}
                                        onChange={(val) => handleChange({ target: { name: 'chatbot_enabled', value: val } })}
                                        isEditing={isEditing}
                                        icon={<MessageSquare className="w-4 h-4" />}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-6">
                            <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-rose-900" /> Contact Information
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <EditableInput 
                                    label="Contact Email"
                                    name="contactEmail"
                                    value={settings.contactEmail}
                                    onChange={handleChange}
                                    isEditing={isEditing}
                                    placeholder="contact@example.com"
                                />
                                <EditableInput 
                                    label="Contact Phone"
                                    name="contactPhone"
                                    value={settings.contactPhone}
                                    onChange={handleChange}
                                    isEditing={isEditing}
                                    placeholder="+91..."
                                />
                                <div className="md:col-span-2">
                                     <EditableTextarea 
                                        label="Address"
                                        name="address"
                                        value={settings.address}
                                        onChange={handleChange}
                                        isEditing={isEditing}
                                        rows={2}
                                        placeholder="Full address..."
                                    />
                                </div>
                            </div>
                        </div>

                         <div className="bg-white p-6 rounded-xl border-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-6">
                            <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-rose-900" /> Social Links
                            </h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                <EditableInput 
                                    label="Facebook URL"
                                    name="facebookUrl"
                                    value={settings.facebookUrl}
                                    onChange={handleChange}
                                    isEditing={isEditing}
                                    placeholder="https://facebook.com/..."
                                />
                                <EditableInput 
                                    label="Instagram URL"
                                    name="instagramUrl"
                                    value={settings.instagramUrl}
                                    onChange={handleChange}
                                    isEditing={isEditing}
                                    placeholder="https://instagram.com/..."
                                />
                                <EditableInput 
                                    label="Twitter URL"
                                    name="twitterUrl"
                                    value={settings.twitterUrl}
                                    onChange={handleChange}
                                    isEditing={isEditing}
                                    placeholder="https://twitter.com/..."
                                />
                            </div>
                        </div>

                         <div className="bg-white p-6 rounded-xl border-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-6">
                            <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                                <IndianRupee className="w-5 h-5 text-rose-900" /> Store & Shipping Settings
                            </h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                <EditableInput 
                                    label="Minimum Order Value"
                                    name="shipping_min_order_value"
                                    value={settings.shipping_min_order_value}
                                    onChange={handleChange}
                                    isEditing={isEditing}
                                    placeholder="200"
                                    type="number"
                                />
                                <EditableInput 
                                    label="Free Delivery Threshold"
                                    name="shipping_free_delivery_threshold"
                                    value={settings.shipping_free_delivery_threshold}
                                    onChange={handleChange}
                                    isEditing={isEditing}
                                    placeholder="499"
                                    type="number"
                                />
                                <EditableInput 
                                    label="Delivery Charge"
                                    name="shipping_delivery_charge"
                                    value={settings.shipping_delivery_charge}
                                    onChange={handleChange}
                                    isEditing={isEditing}
                                    placeholder="50"
                                    type="number"
                                />
                            </div>
                            <div className="md:col-span-3 pt-2">
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-4">
                                    <h4 className="font-bold text-sm text-amber-800 flex items-center gap-2">
                                        <IndianRupee className="w-4 h-4" /> Cash on Delivery (COD) Settings
                                    </h4>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <EditableInput 
                                            label="COD Extra Charge (₹)"
                                            name="cod_extra_charge"
                                            value={settings.cod_extra_charge}
                                            onChange={handleChange}
                                            isEditing={isEditing}
                                            placeholder="0"
                                            type="number"
                                        />
                                        <div className="relative group/select">
                                            <SelectInput 
                                                label="COD Payment Status"
                                                name="cod_status"
                                                value={settings.cod_status}
                                                onChange={handleChange}
                                                isEditing={isEditing}
                                                options={[
                                                    { value: 'active', label: 'Active (Recommended)' },
                                                    { value: 'hidden', label: 'Hide Choice (Online Only)' },
                                                    { value: 'coming_soon', label: 'Coming Soon (Display Only)' }
                                                ]}
                                            />
                                            {!isEditing && settings.cod_status === 'coming_soon' && (
                                                <div className="absolute -top-1 -right-1">
                                                    <span className="flex h-3 w-3 relative">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-end">
                                            <p className="text-xs text-amber-700 leading-relaxed pb-2">
                                                Control how Cash on Delivery appears to customers. Set extra charge to <strong>0</strong> for no fee.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* HOME TAB */}
                {activeTab === 'home' && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        {/* Main Slider Images */}
                        <div className="bg-white p-6 rounded-xl border-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-rose-900" /> Main Slider Images
                                </h3>
                                {isEditing && (
                                    <button 
                                        type="button" 
                                        onClick={handleAddSlide}
                                        className="flex items-center gap-1 text-xs font-bold text-rose-700 hover:text-rose-900 bg-rose-50 px-3 py-1.5 rounded-full transition-colors"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Add Slide
                                    </button>
                                )}
                            </div>
                            
                            <div className="space-y-8">
                                {homeSlides.map((slide, index) => (
                                    <div key={slide.id || index} className="p-4 border border-stone-200 rounded-lg relative bg-stone-50/50">
                                        {isEditing && (
                                            <button 
                                                type="button"
                                                onClick={() => handleRemoveSlide(index)}
                                                className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                        <h4 className="text-sm font-bold text-stone-700 mb-4 uppercase tracking-wider">Slide {index + 1}</h4>
                                        <div className="grid md:grid-cols-2 gap-6 mb-4">
                                            <ImageUploader 
                                                label="Desktop Image (e.g. 1920x800)"
                                                url={slide.desktopImage} 
                                                uploading={uploading}
                                                onUpload={(e) => handleImageUpload(e, { type: 'slide', index, field: 'desktopImage' })}
                                                onDelete={() => handleImageDelete({ type: 'slide', index, field: 'desktopImage' })}
                                                isEditing={isEditing}
                                            />
                                            <ImageUploader 
                                                label="Mobile Image (e.g. 800x1000)"
                                                url={slide.mobileImage} 
                                                uploading={uploading}
                                                onUpload={(e) => handleImageUpload(e, { type: 'slide', index, field: 'mobileImage' })}
                                                onDelete={() => handleImageDelete({ type: 'slide', index, field: 'mobileImage' })}
                                                isEditing={isEditing}
                                            />
                                        </div>
                                        <EditableInput 
                                            label="Click Link (e.g. /shop or /product/123)"
                                            name={`slide_link_${index}`}
                                            value={slide.link}
                                            onChange={(e) => handleSlideChange(index, 'link', e.target.value)}
                                            isEditing={isEditing}
                                            placeholder="/shop"
                                        />
                                    </div>
                                ))}
                                {homeSlides.length === 0 && (
                                    <p className="text-sm text-stone-500 italic text-center py-4">No slides added yet.</p>
                                )}
                            </div>
                        </div>


                        {/* Promotional Banner */}
                        <div className="bg-white p-6 rounded-xl border-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-6">
                            <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-rose-900" /> Secondary Promo Banner (Summer Edit)
                            </h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <ImageUploader 
                                    label="Promo Banner (Desktop 1920x400)"
                                    url={settings.home_promo_banner_image} 
                                    uploading={uploading}
                                    onUpload={(e) => handleImageUpload(e, 'home_promo_banner_image')}
                                    onDelete={() => handleImageDelete('home_promo_banner_image')}
                                    isEditing={isEditing}
                                />
                                <ImageUploader 
                                    label="Promo Banner (Mobile 800x260)"
                                    url={settings.home_promo_banner_image_mobile} 
                                    uploading={uploading}
                                    onUpload={(e) => handleImageUpload(e, 'home_promo_banner_image_mobile')}
                                    onDelete={() => handleImageDelete('home_promo_banner_image_mobile')}
                                    isEditing={isEditing}
                                />
                                <EditableInput 
                                    label="Banner Link URL"
                                    name="home_promo_banner_link"
                                    value={settings.home_promo_banner_link}
                                    onChange={handleChange}
                                    isEditing={isEditing}
                                />
                            </div>
                        </div>

                        {/* Premium Collections (Masonry) */}
                        <div className="bg-white p-6 rounded-xl border-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-6">
                            <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                                <LayoutTemplate className="w-5 h-5 text-rose-900" /> Premium Collections (Grid)
                            </h3>
                            
                            <div className="space-y-8">
                                {/* Masonry 1 */}
                                <div className="p-4 border border-stone-200 rounded-lg space-y-4">
                                    <h4 className="font-bold text-sm text-stone-700">Left Tall Banner (Collection 1)</h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <ImageUploader 
                                            label="Desktop Image (900x1200)"
                                            url={settings.home_masonry_1_image} 
                                            uploading={uploading}
                                            onUpload={(e) => handleImageUpload(e, 'home_masonry_1_image')}
                                            onDelete={() => handleImageDelete('home_masonry_1_image')}
                                            isEditing={isEditing}
                                        />
                                        <ImageUploader 
                                            label="Mobile Image (800x800)"
                                            url={settings.home_masonry_1_image_mobile} 
                                            uploading={uploading}
                                            onUpload={(e) => handleImageUpload(e, 'home_masonry_1_image_mobile')}
                                            onDelete={() => handleImageDelete('home_masonry_1_image_mobile')}
                                            isEditing={isEditing}
                                        />
                                        <EditableInput 
                                            label="Overlay Text"
                                            name="home_masonry_1_text"
                                            value={settings.home_masonry_1_text}
                                            onChange={handleChange}
                                            isEditing={isEditing}
                                        />
                                        <EditableInput 
                                            label="Link URL"
                                            name="home_masonry_1_link"
                                            value={settings.home_masonry_1_link}
                                            onChange={handleChange}
                                            isEditing={isEditing}
                                        />
                                    </div>
                                </div>

                                {/* Masonry 2 */}
                                <div className="p-4 border border-stone-200 rounded-lg space-y-4">
                                    <h4 className="font-bold text-sm text-stone-700">Top Right Banner (Collection 2)</h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <ImageUploader 
                                            label="Desktop Image (1200x800)"
                                            url={settings.home_masonry_2_image} 
                                            uploading={uploading}
                                            onUpload={(e) => handleImageUpload(e, 'home_masonry_2_image')}
                                            onDelete={() => handleImageDelete('home_masonry_2_image')}
                                            isEditing={isEditing}
                                        />
                                        <ImageUploader 
                                            label="Mobile Image (800x800)"
                                            url={settings.home_masonry_2_image_mobile} 
                                            uploading={uploading}
                                            onUpload={(e) => handleImageUpload(e, 'home_masonry_2_image_mobile')}
                                            onDelete={() => handleImageDelete('home_masonry_2_image_mobile')}
                                            isEditing={isEditing}
                                        />
                                        <EditableInput 
                                            label="Overlay Text"
                                            name="home_masonry_2_text"
                                            value={settings.home_masonry_2_text}
                                            onChange={handleChange}
                                            isEditing={isEditing}
                                        />
                                        <EditableInput 
                                            label="Link URL"
                                            name="home_masonry_2_link"
                                            value={settings.home_masonry_2_link}
                                            onChange={handleChange}
                                            isEditing={isEditing}
                                        />
                                    </div>
                                </div>

                                {/* Masonry 3 */}
                                <div className="p-4 border border-stone-200 rounded-lg space-y-4">
                                    <h4 className="font-bold text-sm text-stone-700">Bottom Right Banner (Collection 3)</h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <ImageUploader 
                                            label="Desktop Image (1200x800)"
                                            url={settings.home_masonry_3_image} 
                                            uploading={uploading}
                                            onUpload={(e) => handleImageUpload(e, 'home_masonry_3_image')}
                                            onDelete={() => handleImageDelete('home_masonry_3_image')}
                                            isEditing={isEditing}
                                        />
                                        <ImageUploader 
                                            label="Mobile Image (800x800)"
                                            url={settings.home_masonry_3_image_mobile} 
                                            uploading={uploading}
                                            onUpload={(e) => handleImageUpload(e, 'home_masonry_3_image_mobile')}
                                            onDelete={() => handleImageDelete('home_masonry_3_image_mobile')}
                                            isEditing={isEditing}
                                        />
                                        <EditableInput 
                                            label="Overlay Text"
                                            name="home_masonry_3_text"
                                            value={settings.home_masonry_3_text}
                                            onChange={handleChange}
                                            isEditing={isEditing}
                                        />
                                        <EditableInput 
                                            label="Link URL"
                                            name="home_masonry_3_link"
                                            value={settings.home_masonry_3_link}
                                            onChange={handleChange}
                                            isEditing={isEditing}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Brand Highlights & Craftsmanship */}
                        <div className="bg-white p-6 rounded-xl border-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-6">
                            <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-rose-900" /> Additional Banners
                            </h3>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4 border border-stone-200 p-4 rounded-lg">
                                    <h4 className="font-bold text-sm text-stone-700">Craftsmanship Banner</h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <ImageUploader 
                                            label="Desktop (1920x820)"
                                            url={settings.home_craftsmanship_image} 
                                            uploading={uploading}
                                            onUpload={(e) => handleImageUpload(e, 'home_craftsmanship_image')}
                                            onDelete={() => handleImageDelete('home_craftsmanship_image')}
                                            isEditing={isEditing}
                                        />
                                        <ImageUploader 
                                            label="Mobile (800x800)"
                                            url={settings.home_craftsmanship_image_mobile} 
                                            uploading={uploading}
                                            onUpload={(e) => handleImageUpload(e, 'home_craftsmanship_image_mobile')}
                                            onDelete={() => handleImageDelete('home_craftsmanship_image_mobile')}
                                            isEditing={isEditing}
                                        />
                                    </div>
                                    <EditableInput 
                                        label="Link URL"
                                        name="home_craftsmanship_link"
                                        value={settings.home_craftsmanship_link}
                                        onChange={handleChange}
                                        isEditing={isEditing}
                                    />
                                </div>
                                <div className="space-y-4 border border-stone-200 p-4 rounded-lg">
                                    <h4 className="font-bold text-sm text-stone-700">Premium Collection Banner</h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <ImageUploader 
                                            label="Desktop (1920x820)"
                                            url={settings.home_premium_banner_image} 
                                            uploading={uploading}
                                            onUpload={(e) => handleImageUpload(e, 'home_premium_banner_image')}
                                            onDelete={() => handleImageDelete('home_premium_banner_image')}
                                            isEditing={isEditing}
                                        />
                                        <ImageUploader 
                                            label="Mobile (800x800)"
                                            url={settings.home_premium_banner_image_mobile} 
                                            uploading={uploading}
                                            onUpload={(e) => handleImageUpload(e, 'home_premium_banner_image_mobile')}
                                            onDelete={() => handleImageDelete('home_premium_banner_image_mobile')}
                                            isEditing={isEditing}
                                        />
                                    </div>
                                    <EditableInput 
                                        label="Link URL"
                                        name="home_premium_banner_link"
                                        value={settings.home_premium_banner_link}
                                        onChange={handleChange}
                                        isEditing={isEditing}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Brand Story Images */}
                        <div className="bg-white p-6 rounded-xl border-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-6">
                            <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-rose-900" /> Brand Story Images
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <ImageUploader 
                                    label="Story Image 1 (Left)"
                                    url={settings.home_brand_story_image_1} 
                                    uploading={uploading}
                                    onUpload={(e) => handleImageUpload(e, 'home_brand_story_image_1')}
                                    onDelete={() => handleImageDelete('home_brand_story_image_1')}
                                    isEditing={isEditing}
                                />
                                <ImageUploader 
                                    label="Story Image 2 (Right)"
                                    url={settings.home_brand_story_image_2} 
                                    uploading={uploading}
                                    onUpload={(e) => handleImageUpload(e, 'home_brand_story_image_2')}
                                    onDelete={() => handleImageDelete('home_brand_story_image_2')}
                                    isEditing={isEditing}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* ABOUT TAB */}
                {activeTab === 'about' && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="bg-white p-6 rounded-xl border-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-6">
                            <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                                <LayoutTemplate className="w-5 h-5 text-rose-900" /> Header Section
                            </h3>
                            <div className="space-y-4">
                                <EditableInput 
                                    label="Page Title"
                                    name="about_hero_title"
                                    value={settings.about_hero_title}
                                    onChange={handleChange}
                                    isEditing={isEditing}
                                />
                                <EditableTextarea 
                                    label="Subtitle"
                                    name="about_hero_subtitle"
                                    value={settings.about_hero_subtitle}
                                    onChange={handleChange}
                                    isEditing={isEditing}
                                    rows={2}
                                />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-6">
                            <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-rose-900" /> Story Section
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <EditableInput 
                                        label="Story Title"
                                        name="about_story_title"
                                        value={settings.about_story_title}
                                        onChange={handleChange}
                                        isEditing={isEditing}
                                    />
                                    <EditableTextarea 
                                        label="Story Content"
                                        name="about_story_text"
                                        value={settings.about_story_text}
                                        onChange={handleChange}
                                        isEditing={isEditing}
                                        rows={8}
                                    />
                                </div>
                                <div>
                                    <ImageUploader 
                                        label="Story Image"
                                        url={settings.about_story_image} 
                                        uploading={uploading}
                                        onUpload={(e) => handleImageUpload(e, 'about_story_image')}
                                        onDelete={() => handleImageDelete('about_story_image')}
                                        isEditing={isEditing}
                                    />
                                    
                                    <div className="mt-6">
                                        <ImageUploader 
                                            label="Signature Image"
                                            url={settings.about_signature_image} 
                                            uploading={uploading}
                                            onUpload={(e) => handleImageUpload(e, 'about_signature_image')}
                                            onDelete={() => handleImageDelete('about_signature_image')}
                                            isEditing={isEditing}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* CUSTOM DESIGN TAB */}
                {activeTab === 'custom' && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                         <div className="bg-white p-6 rounded-xl border-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-6">
                            <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                                <LayoutTemplate className="w-5 h-5 text-rose-900" /> Banner & Header
                            </h3>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <EditableInput 
                                        label="Page Title"
                                        name="custom_design_title"
                                        value={settings.custom_design_title}
                                        onChange={handleChange}
                                        isEditing={isEditing}
                                    />
                                    <EditableTextarea 
                                        label="Subtitle"
                                        name="custom_design_subtitle"
                                        value={settings.custom_design_subtitle}
                                        onChange={handleChange}
                                        isEditing={isEditing}
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <ImageUploader 
                                        label="Banner Image"
                                        url={settings.custom_design_banner_image} 
                                        uploading={uploading}
                                        onUpload={(e) => handleImageUpload(e, 'custom_design_banner_image')}
                                        onDelete={() => handleImageDelete('custom_design_banner_image')}
                                        isEditing={isEditing}
                                    />
                                    <div className="mt-6">
                                        <ImageUploader 
                                            label="Body/Feature Image"
                                            url={settings.custom_design_body_image} 
                                            uploading={uploading}
                                            onUpload={(e) => handleImageUpload(e, 'custom_design_body_image')}
                                            onDelete={() => handleImageDelete('custom_design_body_image')}
                                            isEditing={isEditing}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* MEHNDI TAB */}
                {activeTab === 'mehndi' && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="bg-white p-6 rounded-xl border-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-6">
                            <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                                <LayoutTemplate className="w-5 h-5 text-rose-900" /> Header Section
                            </h3>
                             <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <EditableInput 
                                        label="Page Title"
                                        name="mehndi_title"
                                        value={settings.mehndi_title}
                                        onChange={handleChange}
                                        isEditing={isEditing}
                                    />
                                    <EditableTextarea 
                                        label="Subtitle"
                                        name="mehndi_subtitle"
                                        value={settings.mehndi_subtitle}
                                        onChange={handleChange}
                                        isEditing={isEditing}
                                        rows={3}
                                    />
                                </div>
                                <div>
                                     <ImageUploader 
                                        label="Feature Image"
                                        url={settings.mehndi_feature_image} 
                                        uploading={uploading}
                                        onUpload={(e) => handleImageUpload(e, 'mehndi_feature_image')}
                                        onDelete={() => handleImageDelete('mehndi_feature_image')}
                                        isEditing={isEditing}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Package Editor Section */}
                        <div className="bg-white p-6 rounded-xl border-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-6">
                            <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                                <IndianRupee className="w-5 h-5 text-rose-900" /> Package Pricing
                            </h3>
                            <PackageEditor 
                                packagesJSON={settings.mehndi_packages}
                                onChange={(newJSON) => handleChange({ target: { name: 'mehndi_packages', value: newJSON } })}
                                isEditing={isEditing}
                            />
                        </div>
                    </div>
                )}

                {/* GALLERY TAB */}
                {activeTab === 'gallery' && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                         <div className="bg-white p-6 rounded-xl border-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-6">
                            <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                                <LayoutTemplate className="w-5 h-5 text-rose-900" /> Header Section
                            </h3>
                              <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <EditableInput 
                                        label="Page Title"
                                        name="gallery_title"
                                        value={settings.gallery_title}
                                        onChange={handleChange}
                                        isEditing={isEditing}
                                    />
                                    <EditableTextarea 
                                        label="Subtitle"
                                        name="gallery_subtitle"
                                        value={settings.gallery_subtitle}
                                        onChange={handleChange}
                                        isEditing={isEditing}
                                        rows={3}
                                    />
                                </div>
                                <div>
                                     <ImageUploader 
                                        label="Banner Image"
                                        url={settings.gallery_banner_image} 
                                        uploading={uploading}
                                        onUpload={(e) => handleImageUpload(e, 'gallery_banner_image')}
                                        onDelete={() => handleImageDelete('gallery_banner_image')}
                                        isEditing={isEditing}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}


            </motion.form>
            </AnimatePresence>

            <style jsx>{`
                .input-field {
                    @apply px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900 transition-all;
                }
            `}</style>
             
            {/* Crop Modal */}
            {cropModalOpen && (
                <ImageCropper
                    imageSrc={cropImageSrc}
                    aspect={getCropTargetSize(cropKey) ? getCropTargetSize(cropKey).width / getCropTargetSize(cropKey).height : 1}
                    targetSize={getCropTargetSize(cropKey)}
                    onCancel={() => {
                        setCropModalOpen(false);
                        setCropImageSrc(null);
                        setCropKey(null);
                    }}
                    onCropComplete={handleCropComplete}
                />
            )}
        </div>
    );
};

const EditableInput = ({ label, name, value, onChange, isEditing, placeholder, type = "text" }) => (
    <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
        {isEditing ? (
            <input 
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full input-field"
                placeholder={placeholder}
            />
        ) : (
            <div className="p-2 bg-stone-50 rounded-lg border border-transparent text-stone-800 break-words">
                {value || <span className="text-stone-400 italic">No content set</span>}
            </div>
        )}
    </div>
);

const EditableTextarea = ({ label, name, value, onChange, isEditing, rows = 3, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
        {isEditing ? (
            <textarea 
                name={name}
                value={value}
                onChange={onChange}
                rows={rows}
                className="w-full input-field"
                placeholder={placeholder}
            />
        ) : (
            <div className="p-2 bg-stone-50 rounded-lg border border-transparent text-stone-800 whitespace-pre-wrap break-words">
                {value || <span className="text-stone-400 italic">No content set</span>}
            </div>
        )}
    </div>
);

const ToggleSwitch = ({ label, value, onChange, isEditing, icon }) => {
    const isEnabled = String(value) === 'true';

    return (
        <div className="flex items-center gap-3">
            {icon && <div className={`${isEnabled ? 'text-rose-900' : 'text-stone-400'} transition-colors`}>{icon}</div>}
            <span className="text-sm font-bold text-stone-700">{label}</span>
            <button
                type="button"
                disabled={!isEditing}
                onClick={() => onChange(isEnabled ? 'false' : 'true')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    isEnabled ? 'bg-rose-900' : 'bg-stone-200'
                } ${!isEditing ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
    );
};

const SelectInput = ({ label, name, value, onChange, isEditing, options }) => (
    <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
        {isEditing ? (
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full input-field"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        ) : (
            <div className="p-2 bg-stone-50 rounded-lg border border-transparent text-stone-800 font-medium">
                {options.find(opt => opt.value === value)?.label || value}
            </div>
        )}
    </div>
);

// Helper Component for Image Uploads
const ImageUploader = ({ url, uploading, onUpload, onDelete, isEditing, label }) => (
    <div className="space-y-2">
        {label && <label className="block text-sm font-medium text-stone-700">{label}</label>}
        <div className={`relative aspect-video bg-stone-50 rounded-lg border-2 ${isEditing ? 'border-dashed border-stone-200 hover:border-rose-200' : 'border-transparent'} overflow-hidden flex items-center justify-center group transition-all`}>
            {url ? (
                <img src={url} alt="Preview" className="w-full h-full object-cover" />
            ) : (
                <div className="text-center text-stone-400">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <span className="text-xs">{isEditing ? 'Upload Image' : 'No Image'}</span>
                </div>
            )}
            
            {isEditing && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                     <label className="cursor-pointer w-full h-full flex items-center justify-center">
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={onUpload} 
                            disabled={uploading} 
                            className="hidden" 
                        />
                        <div className="opacity-0 group-hover:opacity-100 bg-white shadow-sm px-3 py-2 rounded-full text-xs font-bold text-stone-700 flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all">
                            <Upload className="w-3 h-3" /> Change
                        </div>
                    </label>
                </div>
            )}
        </div>
        
        {isEditing && url && (
            <div className="flex justify-end">
                <button 
                    type="button"
                    onClick={onDelete}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                    Remove Image
                </button>
            </div>
        )}
    </div>
);

export default Settings;

// Package Editor Component
// Package Editor Component
const PackageEditor = ({ packagesJSON, onChange, isEditing }) => {
    const [localPackages, setLocalPackages] = useState([]);
    const isInternalChange = React.useRef(false);
    const [deletePackagePendingId, setDeletePackagePendingId] = useState(null);
    const { addToast } = useToast();

    useEffect(() => {
        try {
            // If the change came from us, skip syncing state to preserve cursor/focus
            if (isInternalChange.current) {
                isInternalChange.current = false;
                return;
            }
            const parsed = JSON.parse(packagesJSON || '[]');
            setLocalPackages(parsed);
        } catch {
            setLocalPackages([]);
        }
    }, [packagesJSON]);

    const updatePackage = (id, field, value) => {
        if (!isEditing) return;
        isInternalChange.current = true;
        const updated = localPackages.map(pkg => 
            pkg.id === id ? { ...pkg, [field]: value } : pkg
        );
        setLocalPackages(updated);
        onChange(JSON.stringify(updated));
    };

    const updateFeatures = (id, featuresText) => {
        if (!isEditing) return;
        isInternalChange.current = true;
        const featuresArray = featuresText.split('\n');
        
        const updated = localPackages.map(pkg => 
            pkg.id === id ? { ...pkg, features: featuresArray } : pkg
        );
        setLocalPackages(updated);
        onChange(JSON.stringify(updated));
    };

    const addPackage = () => {
        isInternalChange.current = true;
        const newId = localPackages.length > 0 ? Math.max(...localPackages.map(p => p.id)) + 1 : 1;
        const newPackage = {
            id: newId,
            name: "New Package",
            price: 1000,
            duration: "1 Hour",
            features: ["Feature 1", "Feature 2"]
        };
        const updated = [...localPackages, newPackage];
        setLocalPackages(updated);
        onChange(JSON.stringify(updated));
    };

    const deletePackage = (id) => {
        if (deletePackagePendingId !== id) {
            setDeletePackagePendingId(id);
            addToast('Tap delete again to remove package.', 'error');
            return;
        }
        setDeletePackagePendingId(null);
        isInternalChange.current = true;
        const updated = localPackages.filter(p => p.id !== id);
        setLocalPackages(updated);
        onChange(JSON.stringify(updated));
    };

    if (!localPackages || localPackages.length === 0) {
         return (
             <div className="text-center p-4">
                 <p className="text-stone-500 mb-4">No packages defined.</p>
                 {isEditing && (
                    <button type="button" onClick={addPackage} className="text-sm font-bold text-rose-900 border border-rose-900 px-4 py-2 rounded-lg hover:bg-rose-50">
                        + Add First Package
                    </button>
                 )}
             </div>
         );
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6">
                {localPackages.map((pkg) => (
                    <div key={pkg.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50 relative group">
                        {isEditing && (
                            <button 
                                type="button"
                                onClick={() => deletePackage(pkg.id)}
                                className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-1"
                                title="Delete Package"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                        
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-stone-500 mb-1">Package Name</label>
                                {isEditing ? (
                                    <input 
                                        value={pkg.name}
                                        onChange={(e) => updatePackage(pkg.id, 'name', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-bold"
                                    />
                                ) : (
                                    <h4 className="font-bold text-lg text-stone-800">{pkg.name}</h4>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 mb-1">Price (₹)</label>
                                    {isEditing ? (
                                        <input 
                                            type="text" 
                                            value={pkg.price}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                // Allow numeric input but keep as string/number in local state to allow deleting to empty
                                                if (val === '' || /^\d+$/.test(val)) {
                                                    updatePackage(pkg.id, 'price', val === '' ? 0 : Number(val));
                                                }
                                            }}
                                            className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                                        />
                                    ) : (
                                        <p className="text-rose-900 font-bold">₹{pkg.price}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 mb-1">Duration</label>
                                    {isEditing ? (
                                        <input 
                                            value={pkg.duration}
                                            onChange={(e) => updatePackage(pkg.id, 'duration', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                                        />
                                    ) : (
                                        <p className="text-stone-600 text-sm">{pkg.duration}</p>
                                    )}
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-stone-500 mb-1">Features (One per line)</label>
                                {isEditing ? (
                                    <textarea 
                                        value={pkg.features.join('\n')}
                                        onChange={(e) => updateFeatures(pkg.id, e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-mono"
                                    />
                                ) : (
                                    <ul className="list-disc list-inside text-sm text-stone-600 space-y-1">
                                        {pkg.features.map((f, i) => <li key={i}>{f}</li>)}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isEditing && (
                <button 
                    type="button"
                    onClick={addPackage}
                    className="w-full py-3 border-2 border-dashed border-stone-300 rounded-xl text-stone-500 font-bold hover:border-rose-900 hover:text-rose-900 transition-colors flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add New Package
                </button>
            )}
        </div>
    );
};
