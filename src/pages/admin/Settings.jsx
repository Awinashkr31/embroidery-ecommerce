import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../config/supabase';
import { Save, Globe, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Loader } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const Settings = () => {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        storeName: '',
        storeDescription: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
        facebookUrl: '',
        instagramUrl: '',
        twitterUrl: ''
    });

    const fetchSettings = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('website_settings')
                .select('*');

            if (error) throw error;

            if (data && data.length > 0) {
                // Transform array of key-value pairs to object
                const settingsObj = {};
                data.forEach(item => {
                    settingsObj[item.setting_key] = item.setting_value;
                });
                
                // Merge with defaults to ensure all fields exist
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
        setSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            // Upsert each setting individually
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
            addToast('Settings saved successfully', 'success');
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

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-stone-900">Website Settings</h1>
                <p className="text-stone-500">Manage your store's global configuration</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Settings */}
                <div className="bg-white rounded-xl border border-stone-100 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-rose-900" />
                        General Information
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-stone-700">Store Name</label>
                            <input
                                type="text"
                                name="storeName"
                                value={settings.storeName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900 transition-all"
                                placeholder="e.g. Enbroidery"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-stone-700">Store Description</label>
                            <textarea
                                name="storeDescription"
                                value={settings.storeDescription}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900 transition-all"
                                placeholder="Brief description of your store..."
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-xl border border-stone-100 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-rose-900" />
                        Contact Information
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-stone-400" /> Email Address
                            </label>
                            <input
                                type="email"
                                name="contactEmail"
                                value={settings.contactEmail}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900 transition-all"
                                placeholder="contact@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-stone-400" /> Phone Number
                            </label>
                            <input
                                type="tel"
                                name="contactPhone"
                                value={settings.contactPhone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900 transition-all"
                                placeholder="+91 98765 43210"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-stone-400" /> Address
                            </label>
                            <textarea
                                name="address"
                                value={settings.address}
                                onChange={handleChange}
                                rows="2"
                                className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900 transition-all"
                                placeholder="Store physical address..."
                            />
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="bg-white rounded-xl border border-stone-100 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-rose-900" />
                        Social Media
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                                <Facebook className="w-4 h-4 text-blue-600" /> Facebook
                            </label>
                            <input
                                type="url"
                                name="facebookUrl"
                                value={settings.facebookUrl}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900 transition-all"
                                placeholder="https://facebook.com/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                                <Instagram className="w-4 h-4 text-pink-600" /> Instagram
                            </label>
                            <input
                                type="url"
                                name="instagramUrl"
                                value={settings.instagramUrl}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900 transition-all"
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                                <Twitter className="w-4 h-4 text-sky-500" /> Twitter / X
                            </label>
                            <input
                                type="url"
                                name="twitterUrl"
                                value={settings.twitterUrl}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900 transition-all"
                                placeholder="https://twitter.com/..."
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-rose-900 text-white rounded-lg font-bold hover:bg-rose-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-rose-900/20"
                    >
                        {saving ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" /> Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" /> Save Settings
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;
