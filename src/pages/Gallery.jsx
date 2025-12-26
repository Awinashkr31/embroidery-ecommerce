import React, { useState, useEffect } from 'react';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { X, Loader, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { fetchSetting } from '../utils/settingsUtils';
import { supabase } from '../config/supabase';

// --- Configuration ---
const PREDEFINED_MEHNDI_TYPES = [
    'Arabic Mehndi',
    'Indian (Traditional) Mehndi',
    'Bridal Mehndi',
    'Minimal / Modern Mehndi'
];

const Gallery = () => {
    // State
    const [activeMainTab, setActiveMainTab] = useState('Mehndi'); // 'Mehndi' | 'Hand Embroidery' | 'Art' | 'Custom Design'
    const [activeSubTab, setActiveSubTab] = useState('All'); // For Mehndi internal filters

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [lightboxIndex, setLightboxIndex] = useState(0); // Current image index in lightbox

    // Settings State
    const [pageTitle, setPageTitle] = useState("Gallery");
    const [pageSubtitle, setPageSubtitle] = useState("Handcrafted Artistry");
    const [bannerImage, setBannerImage] = useState(null);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const banner = await fetchSetting('gallery_banner_image');
                if (banner) setBannerImage(banner);

                const title = await fetchSetting('gallery_title');
                if (title) setPageTitle(title);

                const subtitle = await fetchSetting('gallery_subtitle');
                if (subtitle) setPageSubtitle(subtitle);

                const { data, error } = await supabase
                    .from('gallery')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                // Normalize images: if 'images' array is empty, populate it with single 'image_url'
                const normalizedData = (data || []).map(item => ({
                    ...item,
                    images: (item.images && item.images.length > 0) ? item.images : [item.image_url]
                }));

                setImages(normalizedData);
            } catch (error) {
                console.error("Error loading gallery data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter Logic
    const getFilteredImages = () => {
        if (activeMainTab === 'Mehndi') {
            const mehndiImages = images.filter(img => 
                PREDEFINED_MEHNDI_TYPES.includes(img.category)
            );
            if (activeSubTab === 'All') return mehndiImages;
            return mehndiImages.filter(img => img.category === activeSubTab);
        } else if (activeMainTab === 'Art') {
            return images.filter(img => img.category === 'Art');
        } else if (activeMainTab === 'Custom Design') {
            return images.filter(img => img.category === 'Custom Design');
        } else {
            // Hand Embroidery View (Existing "Hand Embroidery" category + Gifts/Decor/Other fallback)
            // Anything NOT Mehndi AND NOT Art AND NOT Custom Design
            return images.filter(img => 
                !PREDEFINED_MEHNDI_TYPES.includes(img.category) && 
                img.category !== 'Art' &&
                img.category !== 'Custom Design'
            );
        }
    };

    const filteredImages = getFilteredImages();

    // Grouping for "All" view in sub-categories (Optional, if we want sections again)
    // For now, let's stick to a clean Masonry grid for the main views as requested by "2 main category" simplification.
    // Actually, for "Hand Embroidery", showing sections (Embroidery vs Gifts) might still be nice if they exist.
    // But let's keep it simple first.

    const openLightbox = (item) => {
        setSelectedItem(item);
        setLightboxIndex(0);
    };

    const nextLightboxImage = (e) => {
        e.stopPropagation();
        if (selectedItem && selectedItem.images.length > 1) {
            setLightboxIndex((prev) => (prev + 1) % selectedItem.images.length);
        }
    };

    const prevLightboxImage = (e) => {
        e.stopPropagation();
        if (selectedItem && selectedItem.images.length > 1) {
            setLightboxIndex((prev) => (prev - 1 + selectedItem.images.length) % selectedItem.images.length);
        }
    };

    return (
        <div className="bg-white min-h-screen font-sofia">
            
            {/* --- Banner Section --- */}
            <div className="relative bg-stone-50 pt-24 pb-12 lg:pt-32 lg:pb-16 text-center px-4">
                 {bannerImage && (
                    <div className="absolute inset-0 z-0 opacity-10">
                        <img src={bannerImage} alt="" className="w-full h-full object-cover" />
                    </div>
                 )}
                 <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-4xl lg:text-5xl font-heading text-stone-800 mb-4">{pageTitle}</h1>
                    <p className="text-lg text-stone-500 max-w-2xl mx-auto">{pageSubtitle}</p>
                 </div>
            </div>

            {/* --- Main Navigation Tabs --- */}
            <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center w-full">
                        <div className="flex flex-wrap justify-center p-2 gap-2">
                            {['Mehndi', 'Hand Embroidery', 'Art', 'Custom Design'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => { setActiveMainTab(tab); setActiveSubTab('All'); }}
                                    className={`px-8 py-3 rounded-full text-lg font-heading transition-all duration-300 ${
                                        activeMainTab === tab
                                            ? 'bg-rose-900 text-white shadow-lg transform scale-105'
                                            : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sub Navigation (Only for Mehndi) */}
                    {activeMainTab === 'Mehndi' && (
                        <div className="flex overflow-x-auto py-3 gap-2 no-scrollbar justify-start md:justify-center border-t border-stone-100 mt-2">
                            {['All', ...PREDEFINED_MEHNDI_TYPES].map((subTab) => (
                                <button
                                    key={subTab}
                                    onClick={() => setActiveSubTab(subTab)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                        activeSubTab === subTab
                                            ? 'bg-rose-100 text-rose-800 ring-1 ring-rose-200'
                                            : 'text-stone-500 hover:bg-stone-50'
                                    }`}
                                >
                                    {subTab.replace(' Mehndi', '')}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* --- Content Area --- */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="flex h-96 items-center justify-center">
                        <Loader className="w-8 h-8 animate-spin text-stone-300" />
                    </div>
                ) : filteredImages.length === 0 ? (
                    <div className="text-center py-32 bg-stone-50 rounded-3xl border border-dashed border-stone-200">
                        <p className="text-stone-400 text-lg">No designs found in this collection yet.</p>
                    </div>
                ) : (
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                        {filteredImages.map(image => (
                            <div 
                                key={image.id} 
                                className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-stone-100 cursor-zoom-in"
                                onClick={() => openLightbox(image)}
                            >
                                <img 
                                    src={getOptimizedImageUrl(image.images[0], { width: 600, quality: 80 })} 
                                    alt={image.title}
                                    className="w-full h-auto object-cover transition-transform duration-700 md:group-hover:scale-105"
                                    loading="lazy"
                                />
                                
                                {/* Multi-image Indicator */}
                                {image.images.length > 1 && (
                                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 z-10">
                                        <Layers size={12} />
                                        <span>+{image.images.length - 1}</span>
                                    </div>
                                )}
                                
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <div className="transform translate-y-4 md:group-hover:translate-y-0 transition-transform duration-300">
                                        <span className="text-rose-200 text-xs font-bold uppercase tracking-widest mb-1 block">
                                            {image.category}
                                        </span>
                                        <p className="text-white font-heading text-xl">{image.title}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* --- Lightbox Modal --- */}
            {selectedItem && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 lg:p-10 animate-fade-in"
                     onClick={() => setSelectedItem(null)}>
                    
                    <button 
                        className="fixed top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
                        onClick={() => setSelectedItem(null)}
                    >
                        <X size={24} />
                    </button>

                    {/* Navigation Buttons (Only if multiple images) */}
                    {selectedItem.images.length > 1 && (
                        <>
                            <button
                                onClick={prevLightboxImage}
                                className="fixed left-4 lg:left-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-50"
                            >
                                <ChevronLeft size={32} />
                            </button>
                            <button
                                onClick={nextLightboxImage}
                                className="fixed right-4 lg:right-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-50"
                            >
                                <ChevronRight size={32} />
                            </button>
                        </>
                    )}
                    
                    <div className="w-full max-w-6xl flex flex-col items-center" onClick={e => e.stopPropagation()}>
                        <div className="relative w-full flex justify-center h-[80vh]">
                            <img 
                                src={selectedItem.images[lightboxIndex]} 
                                alt={selectedItem.title}
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            />
                        </div>
                        
                        {/* Dots Indicator */}
                        {selectedItem.images.length > 1 && (
                            <div className="flex gap-2 mt-4">
                                {selectedItem.images.map((_, idx) => (
                                    <div 
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                            idx === lightboxIndex ? 'bg-white w-4' : 'bg-white/30'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}

                        <div className="mt-6 text-center text-white max-w-lg px-4">
                            <h3 className="text-2xl font-heading mb-2">{selectedItem.title}</h3>
                            {selectedItem.description && (
                                <p className="text-white/60 font-light">{selectedItem.description}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
