import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../config/supabase';
import { Save, Globe, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Loader, Image as ImageIcon, Upload, FileText, LayoutTemplate, Type, Pencil, X, Plus, Trash2, IndianRupee, Clock } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import imageCompression from 'browser-image-compression';

const Settings = () => {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('general');

    const [settings, setSettings] = useState({
        // General
        contactEmail: '',
        contactPhone: '',
        address: '',
        facebookUrl: '',
        instagramUrl: '',
        twitterUrl: '',

        // Home
        home_hero_title: 'Weaving Stories in Thread',
        home_hero_subtitle: 'Timeless hand embroidery blending tradition with modern aesthetics.',
        home_hero_image: '',
        home_category_hoop_image: '',
        home_category_bridal_image: '',
        home_brand_story_image_1: '',
        home_brand_story_image_2: '',
        
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
                .select('*');

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

    const deleteImageFromStorage = async (imageUrl) => {
        if (!imageUrl) return;
        try {
           const urlObj = new URL(imageUrl);
           const pathParts = urlObj.pathname.split('/public/');
           if (pathParts.length > 1) {
               const fullPath = pathParts[1];
               const storagePath = fullPath.replace(/^images\//, '');
               const { error } = await supabase.storage
                    .from('images')
                    .remove([storagePath]);
               if (error) console.error("Error deleting old file:", error);
           }
        } catch (err) {
            console.error("Error parsing URL for cleanup:", err);
        }
    };



    const handleImageUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);

            // COMPRESSION LOGIC
            const options = {
                maxSizeMB: 0.2, // < 200KB
                maxWidthOrHeight: 1920,
                useWebWorker: true
            };
            
            let uploadFile = file;
            try {
                uploadFile = await imageCompression(file, options);
                console.log(`Compressed: ${(uploadFile.size / 1024 / 1024).toFixed(2)} MB`);
            } catch (cErr) {
                console.warn("Compression failed, using original:", cErr);
            }

            const oldUrl = settings[key];
            if (oldUrl) await deleteImageFromStorage(oldUrl);

            const fileExt = uploadFile.name.split('.').pop();
            const fileName = `${key}_${Date.now()}.${fileExt}`;
            const filePath = `site-assets/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, uploadFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            setSettings(prev => ({ ...prev, [key]: publicUrl }));
            addToast('Image uploaded! Click "Save Changes" at the bottom to apply.', 'success');

        } catch (error) {
            console.error('Upload failed:', error);
            addToast(`Failed to upload: ${error.message || 'Unknown error'}`, 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleImageDelete = async (key) => {
        if (!window.confirm('Remove this image?')) return;
        try {
            setUploading(true);
            const oldUrl = settings[key];
            if (oldUrl) await deleteImageFromStorage(oldUrl);
            setSettings(prev => ({ ...prev, [key]: '' }));
            addToast('Image removed. Click Save to persist.', 'info');
        } catch (error) {
             console.error('Delete failed:', error);
             addToast('Failed to remove image.', 'error');
        } finally {
            setUploading(false);
        }
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
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900">Settings & Content</h1>
                    <p className="text-stone-500">Manage global settings and page content.</p>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                        isEditing 
                        ? 'bg-stone-100 text-stone-600 hover:bg-stone-200' 
                        : 'bg-rose-900 text-white hover:bg-rose-800'
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

            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-stone-200 gap-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors relative
                            ${activeTab === tab.id 
                                ? 'text-rose-900' 
                                : 'text-stone-500 hover:text-stone-800'
                            }
                        `}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-900 rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* GENERAL TAB */}
                {activeTab === 'general' && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm space-y-6">
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

                         <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm space-y-6">
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
                    </div>
                )}

                {/* HOME TAB */}
                {activeTab === 'home' && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm space-y-6">
                            <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                                <LayoutTemplate className="w-5 h-5 text-rose-900" /> Hero Section
                            </h3>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <EditableInput 
                                        label="Hero Title"
                                        name="home_hero_title"
                                        value={settings.home_hero_title}
                                        onChange={handleChange}
                                        isEditing={isEditing}
                                        placeholder="Weaving Stories in Thread"
                                    />
                                    <EditableTextarea 
                                        label="Hero Subtitle"
                                        name="home_hero_subtitle"
                                        value={settings.home_hero_subtitle}
                                        onChange={handleChange}
                                        isEditing={isEditing}
                                        placeholder="Timeless hand embroidery..."
                                    />
                                </div>

                                <div>
                                    <ImageUploader 
                                        label="Hero Image"
                                        url={settings.home_hero_image} 
                                        uploading={uploading}
                                        onUpload={(e) => handleImageUpload(e, 'home_hero_image')}
                                        onDelete={() => handleImageDelete('home_hero_image')}
                                        isEditing={isEditing}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Category Images */}
                        <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm space-y-6">
                            <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-rose-900" /> Category Images
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <ImageUploader 
                                    label="Hoop Art Image"
                                    url={settings.home_category_hoop_image} 
                                    uploading={uploading}
                                    onUpload={(e) => handleImageUpload(e, 'home_category_hoop_image')}
                                    onDelete={() => handleImageDelete('home_category_hoop_image')}
                                    isEditing={isEditing}
                                />
                                <ImageUploader 
                                    label="Bridal Image"
                                    url={settings.home_category_bridal_image} 
                                    uploading={uploading}
                                    onUpload={(e) => handleImageUpload(e, 'home_category_bridal_image')}
                                    onDelete={() => handleImageDelete('home_category_bridal_image')}
                                    isEditing={isEditing}
                                />
                            </div>
                        </div>

                        {/* Brand Story Images */}
                        <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm space-y-6">
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
                        <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm space-y-6">
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

                        <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm space-y-6">
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
                         <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm space-y-6">
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
                        <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm space-y-6">
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
                        <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm space-y-6">
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
                         <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm space-y-6">
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

                {isEditing && (
                    <div className="flex justify-end pt-4 border-t border-stone-200">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center px-6 py-3 bg-rose-900 text-white rounded-lg hover:bg-rose-800 disabled:opacity-70 transition-colors shadow-sm font-medium"
                        >
                            {saving ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin mr-2" />
                                    Saving Changes...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5 mr-2" />
                                    Save All Changes
                                </>
                            )}
                        </button>
                    </div>
                )}
            </form>

            <style jsx>{`
                .input-field {
                    @apply px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900 transition-all;
                }
            `}</style>
        </div>
    );
};

const EditableInput = ({ label, name, value, onChange, isEditing, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
        {isEditing ? (
            <input 
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
        if (!window.confirm("Delete this package?")) return;
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
                                                    updatePackage(pkg.id, 'price', val === '' ? 0 : parseInt(val));
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
