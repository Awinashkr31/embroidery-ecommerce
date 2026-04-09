import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const AnnouncementBar = () => {
  const { settings } = useSettings();
  const rawAnnouncements = Array.isArray(settings?.announcement_bar) 
    ? settings.announcement_bar.map(s => typeof s === 'string' ? s.trim() : s).filter(Boolean) 
    : [];
  const announcements = rawAnnouncements.length > 0
    ? rawAnnouncements
    : ["Get 10% off your first order with code SANA10."]; // Safe fallback
    
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  return (
    <div className="bg-rose-900 text-white px-4 py-2 flex items-center justify-between text-xs md:text-sm font-medium">
      <button 
        onClick={handlePrev} 
        className="text-white hover:text-white/80 p-1"
        aria-label="Previous announcement"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      
      <div className="flex-1 text-center overflow-hidden">
        <p className="animate-fade-in-up truncate inline-block px-2" key={currentIndex}>
          {announcements[currentIndex]}
        </p>
      </div>

      <button 
        onClick={handleNext} 
        className="text-white hover:text-white/80 p-1"
        aria-label="Next announcement"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default AnnouncementBar;
