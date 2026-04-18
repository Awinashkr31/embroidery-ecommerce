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
                    .select('id, title, description, image_url, images, category, created_at')
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

    // Swipe Logic
    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)
    const minSwipeDistance = 50

    const onTouchStart = (e) => {
        setTouchEnd(null) 
        setTouchStart(e.targetTouches[0].clientX)
    }

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX)

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance
        
        if (isLeftSwipe) {
             nextLightboxImage()
        }
        if (isRightSwipe) {
             prevLightboxImage()
        }
    }

    const nextLightboxImage = (e) => {
        if (e) e.stopPropagation();
        if (selectedItem && selectedItem.images.length > 1) {
            setLightboxIndex((prev) => (prev + 1) % selectedItem.images.length);
        }
    };

    const prevLightboxImage = (e) => {
        if (e) e.stopPropagation();
        if (selectedItem && selectedItem.images.length > 1) {
            setLightboxIndex((prev) => (prev - 1 + selectedItem.images.length) % selectedItem.images.length);
        }
    };

    return (
        <div className="bg-white min-h-screen font-sofia">
            
            {/* --- Banner Section --- */}
            <div className="relative bg-[#fdfbf7] pt-32 pb-16 lg:pt-48 lg:pb-24 text-center px-4 overflow-hidden border-b border-stone-100">
                 {/* Soft background glow */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[120%] bg-gradient-to-b from-rose-100/50 to-transparent blur-3xl -z-10 rounded-full pointer-events-none"></div>

                 {bannerImage && (
                    <div className="absolute inset-0 z-0 opacity-10 mix-blend-multiply">
                        <img src={bannerImage} alt="" className="w-full h-full object-cover" />
                    </div>
                 )}
                 <div className="relative z-10 max-w-4xl mx-auto">
                    <span className="inline-block py-1 px-3 rounded-full bg-rose-50 border border-rose-100 text-rose-900 text-[10px] font-bold tracking-widest uppercase mb-6 shadow-sm">Our Portfolio</span>
                    <h1 className="text-4xl lg:text-7xl font-heading font-medium text-stone-900 mb-6 tracking-tight leading-none">{pageTitle}</h1>
                    <p className="text-lg lg:text-2xl text-stone-500 max-w-2xl mx-auto font-light leading-relaxed">{pageSubtitle}</p>
                 </div>
            </div>

            {/* --- Main Navigation Tabs --- */}
            <div className="sticky top-4 lg:top-6 z-40 px-4 mb-8 md:-mt-8 transition-all duration-500 flex flex-col items-center gap-3">
                <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full p-1.5 flex overflow-x-auto no-scrollbar w-full md:w-auto snap-x">
                    {['Mehndi', 'Hand Embroidery', 'Art', 'Custom Design'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { setActiveMainTab(tab); setActiveSubTab('All'); }}
                            className={`px-6 py-2.5 md:px-8 md:py-3 rounded-full text-[11px] md:text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 flex-shrink-0 snap-center ${
                                activeMainTab === tab
                                    ? 'bg-stone-900 text-white shadow-md'
                                    : 'text-stone-500 hover:text-stone-900 hover:bg-white/60'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Sub Navigation (Only for Mehndi) */}
                {activeMainTab === 'Mehndi' && (
                    <div className="flex overflow-x-auto gap-2 no-scrollbar px-2 max-w-full justify-start md:justify-center animate-in slide-in-from-top-2 fade-in duration-300">
                        {['All', ...PREDEFINED_MEHNDI_TYPES].map((subTab) => (
                            <button
                                key={subTab}
                                onClick={() => setActiveSubTab(subTab)}
                                className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                                    activeSubTab === subTab
                                        ? 'bg-rose-50 border-rose-200 text-rose-900 shadow-sm'
                                        : 'bg-white/50 backdrop-blur-sm border-transparent text-stone-500 hover:bg-white hover:border-stone-200'
                                }`}
                            >
                                {subTab.replace(' Mehndi', '')}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* --- Content Area --- */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {loading ? (
                    <div className="flex h-96 items-center justify-center">
                        <Loader className="w-8 h-8 animate-spin text-stone-300" />
                    </div>
                ) : filteredImages.length === 0 ? (
                    <div className="text-center py-32 bg-stone-50 rounded-3xl border border-dashed border-stone-200">
                        <p className="text-stone-400 text-lg">No designs found in this collection yet.</p>
                    </div>
                ) : (
                    <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3 md:gap-6 md:space-y-6">
                        {filteredImages.map(image => (
                            <div 
                                key={image.id} 
                                className="break-inside-avoid group relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-stone-100 cursor-zoom-in transition-all duration-500 lg:hover:-translate-y-2 lg:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.25)]"
                                onClick={() => openLightbox(image)}
                            >
                                <img 
                                    src={getOptimizedImageUrl(image.images[0], { width: 600, quality: 80 })} 
                                    alt={image.title}
                                    className="w-full h-auto object-cover transition-transform duration-1000 md:group-hover:scale-[1.03]"
                                    loading="lazy"
                                />
                                
                                {/* Multi-image Indicator */}
                                {image.images.length > 1 && (
                                    <div className="absolute top-3 right-3 md:top-5 md:right-5 bg-white/20 backdrop-blur-md border border-white/30 text-white px-2.5 py-1 rounded-full text-[10px] md:text-[11px] font-bold tracking-widest flex items-center gap-1.5 z-10 shadow-sm">
                                        <Layers size={12} className="md:w-3.5 md:h-3.5" />
                                        <span>+{image.images.length - 1}</span>
                                    </div>
                                )}
                                
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent p-5 md:p-8 flex flex-col justify-end opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500">
                                    <div className="transform translate-y-0 md:translate-y-6 md:group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                        <div className="inline-flex items-center gap-1.5 mb-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)] animate-pulse"></span>
                                            <span className="text-rose-100 text-[10px] font-bold uppercase tracking-widest hidden md:inline-block">
                                                {image.category}
                                            </span>
                                        </div>
                                        <p className="text-white font-heading text-lg md:text-3xl font-medium leading-tight drop-shadow-md">{image.title}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* --- Lightbox Modal --- */}
            {selectedItem && (
                <div 
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-0 md:p-4 lg:p-10 animate-fade-in"
                    onClick={() => setSelectedItem(null)}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    
                    <button 
                        className="fixed top-4 right-4 md:top-6 md:right-6 p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
                        onClick={() => setSelectedItem(null)}
                    >
                        <X size={20} className="md:w-6 md:h-6" />
                    </button>

                    {/* Navigation Buttons (Desktop Only) */}
                    {selectedItem.images.length > 1 && (
                        <>
                            <button
                                onClick={prevLightboxImage}
                                className="hidden md:block fixed left-4 lg:left-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-50"
                            >
                                <ChevronLeft size={32} />
                            </button>
                            <button
                                onClick={nextLightboxImage}
                                className="hidden md:block fixed right-4 lg:right-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-50"
                            >
                                <ChevronRight size={32} />
                            </button>
                        </>
                    )}
                    
                    <div className="w-full max-w-6xl flex flex-col items-center h-full md:h-auto justify-center" onClick={e => e.stopPropagation()}>
                        <div className="relative w-full flex justify-center h-[70vh] md:h-[80vh]">
                            <img 
                                src={selectedItem.images[lightboxIndex]} 
                                alt={selectedItem.title}
                                className="max-w-full max-h-full object-contain md:rounded-lg shadow-2xl"
                            />
                        </div>
                        
                        {/* Dots Indicator */}
                        {selectedItem.images.length > 1 && (
                            <div className="flex gap-2 mt-4">
                                {selectedItem.images.map((_, idx) => (
                                    <div 
                                        key={idx}
                                        className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${
                                            idx === lightboxIndex ? 'bg-white w-3 md:w-4' : 'bg-white/30'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}

                        <div className="mt-4 md:mt-6 text-center text-white max-w-lg px-4 pb-8 md:pb-0">
                            <h3 className="text-lg md:text-2xl font-heading mb-1 md:mb-2">{selectedItem.title}</h3>
                            {selectedItem.description && (
                                <p className="text-white/60 font-light text-xs md:text-base">{selectedItem.description}</p>
                            )}
                             {/* Mobile Swipe Hint */}
                            {selectedItem.images.length > 1 && (
                                <p className="text-white/30 text-[10px] mt-2 md:hidden uppercase tracking-widest">Swipe for more</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
