import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, MapPin, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import { fetchSetting } from '../utils/settingsUtils';
import { supabase } from '../config/supabase';

// Initial fallback packages
const DEFAULT_PACKAGES = [
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
];

const PREDEFINED_MEHNDI_TYPES = [
    'Arabic Mehndi',
    'Indian (Traditional) Mehndi',
    'Bridal Mehndi',
    'Minimal / Modern Mehndi'
];

const MehndiBooking = () => {
  const [packages, setPackages] = useState(DEFAULT_PACKAGES);
  const [selectedPackage, setSelectedPackage] = useState(DEFAULT_PACKAGES[1]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // For Lightbox
  const [featureImage, setFeatureImage] = useState("https://images.unsplash.com/photo-1594736797933-d0f9dd8b4d40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
  const [pageTitle, setPageTitle] = useState("Mehndi Booking");
  const [pageSubtitle, setPageSubtitle] = useState("Professional mehndi artistry for your special occasions.");
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    const loadSettings = async () => {
      const image = await fetchSetting('mehndi_feature_image');
      if (image) setFeatureImage(image);

      const title = await fetchSetting('mehndi_title');
      if (title) setPageTitle(title);

      const subtitle = await fetchSetting('mehndi_subtitle');
      if (subtitle) setPageSubtitle(subtitle);

      const packagesJson = await fetchSetting('mehndi_packages');
      console.log("Mehndi Packages Fetched:", packagesJson); // DEBUG LOG

      if (packagesJson) {
        try {
          // Check if it's already an object (if Supabase returned JSONB directly)
          let parsed;
          if (typeof packagesJson === 'object' && packagesJson !== null) {
              parsed = packagesJson;
          } else {
              parsed = JSON.parse(packagesJson);
          }

          if (Array.isArray(parsed) && parsed.length > 0) {
            console.log("Setting Packages:", parsed); // DEBUG LOG
            setPackages(parsed);
          }
        } catch (e) {
          console.error("Failed to parse packages setting", e);
        }
      }
    };

    const fetchGallery = async () => {
        try {
            // Fetch random/latest 4 images from mehndi categories
            const { data, error } = await supabase
                .from('gallery')
                .select('image_url, category')
                .in('category', PREDEFINED_MEHNDI_TYPES)
                .limit(4)
                .order('created_at', { ascending: false });
            
            if (!error && data) {
                setGalleryImages(data);
            }
        } catch (err) {
            console.error("Error fetching gallery snippets:", err);
        }
    };

    loadSettings();
    fetchGallery();
  }, []);

  // Sync selectedPackage with loaded packages (to reflect Admin updates like Price/Name immediately)
  useEffect(() => {
    if (selectedPackage && packages.length > 0) {
        const currentInNewList = packages.find(p => p.id === selectedPackage.id);
        // If found and different reference/content, update it
        if (currentInNewList && JSON.stringify(currentInNewList) !== JSON.stringify(selectedPackage)) {
            setSelectedPackage(currentInNewList);
        }
    }
  }, [packages]);

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
  };

  const handleBookNow = () => {
    if (!selectedPackage) {
      alert("Please select a package first.");
      return;
    }
    setShowBookingForm(true);
  };

  const handleBookingSuccess = () => {
    alert("Booking submitted successfully! We will contact you shortly to confirm.");
    setSelectedPackage(null);
  };

  return (
    <div className="bg-[#fcfaf7] min-h-screen font-body pb-32 lg:pb-20">
      
      {/* Hero Section */}
      <div className="relative w-full h-[50vh] min-h-[400px] overflow-hidden">
        <img 
            src={featureImage} 
            alt="Mehndi Art" 
            className="w-full h-full object-cover transition-transform duration-[20s] hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-20">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-full text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in-up">
                <MapPin className="w-3 h-3" /> Based in Delhi NCR
             </div>
             <h1 className="text-4xl md:text-7xl font-heading text-white mb-6 text-shadow-xl animate-fade-in-up delay-100">
                {pageTitle}
             </h1>
             <p className="text-lg md:text-xl text-stone-200 max-w-2xl font-light leading-relaxed animate-fade-in-up delay-200">
                {pageSubtitle}
             </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 animate-fade-in-up delay-300">
          {packages.map((pkg) => (
            <div 
              key={pkg.id}
              className={`bg-white rounded-[2rem] p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer border-2 relative overflow-hidden group transform hover:-translate-y-2 ${
                selectedPackage?.id === pkg.id ? 'border-rose-900 ring-4 ring-rose-900/5 scale-[1.02]' : 'border-transparent'
              }`}
              onClick={() => handlePackageSelect(pkg)}
            >
              {selectedPackage?.id === pkg.id && (
                <div className="absolute top-0 right-0 bg-rose-900 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl shadow-md z-20">
                  SELECTED
                </div>
              )}
              
              <div className="flex flex-col h-full">
                  <div className="mb-6">
                      <h3 className="text-2xl font-bold font-heading text-stone-800 mb-2 group-hover:text-rose-900 transition-colors">{pkg.name}</h3>
                      <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold text-rose-900">₹{pkg.price}</span>
                          <span className="text-sm font-medium text-stone-400">/{pkg.id === 2 ? 'person' : 'session'}</span>
                      </div>
                  </div>

                  <div className="flex-grow space-y-4 mb-8">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start space-x-3 text-stone-600 text-sm list-none">
                        <CheckCircle className="w-5 h-5 text-rose-300 group-hover:text-rose-900 transition-colors flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-stone-100 mt-auto">
                      <div className="flex items-center text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">
                        <Clock className="w-4 h-4 mr-2" /> {pkg.duration}
                      </div>
                      
                      <button 
                        className={`w-full py-3.5 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-md ${
                        selectedPackage?.id === pkg.id 
                        ? 'bg-rose-900 text-white shadow-rose-900/30' 
                        : 'bg-stone-100 text-stone-500 group-hover:bg-stone-200 group-hover:text-stone-800'
                      }`}>
                        {selectedPackage?.id === pkg.id ? 'Selected' : 'Select Package'}
                      </button>
                  </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gallery Preview */}
        {galleryImages.length > 0 && (
            <div className="mb-24">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 px-2">
                    <div>
                        <div className="text-rose-900 font-bold uppercase tracking-widest text-sm mb-2">Our Portfolio</div>
                        <h2 className="text-3xl md:text-5xl font-heading font-bold text-stone-800">Happy Brides & Guests</h2>
                    </div>
                    <Link to="/gallery" className="hidden md:flex items-center text-stone-900 font-bold hover:text-rose-900 transition-colors group">
                        View Full Gallery <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {galleryImages.map((img, idx) => (
                        <div 
                            key={idx} 
                            className="aspect-[3/4] rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all group relative cursor-zoom-in"
                            onClick={() => setSelectedImage(img)}
                        >
                            <img 
                                src={img.image_url} 
                                alt="Mehndi Design" 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <span className="text-white text-xs font-bold uppercase tracking-widest border border-white/50 px-3 py-1 rounded-full backdrop-blur-sm">View</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link to="/gallery" className="inline-flex items-center bg-rose-900 text-white font-bold border-2 border-rose-900 px-8 py-4 rounded-full hover:bg-rose-800 hover:border-rose-800 transition-all shadow-md hover:shadow-xl hover:-translate-y-1">
                        View Full Gallery <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </div>
            </div>
        )}

      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-white/50 flex flex-col items-center justify-center gap-3 lg:hidden z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pb-8 pt-4 rounded-t-3xl">
           <a 
            href={`https://wa.me/917428013214?text=Hello,%20I%20am%20interested%20in%20booking%20a%20Mehndi%20session.${selectedPackage ? `%20I%20have%20selected%20the%20${encodeURIComponent(selectedPackage.name)}.` : ''}%20Please%20let%20me%20know%20the%20availability.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-transform"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Book on WhatsApp
          </a>
          
          <button 
            onClick={handleBookNow}
            className="w-full bg-stone-900 text-white border border-stone-900 px-6 py-4 rounded-2xl font-bold text-lg hover:bg-stone-800 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
          >
             Book Appointment <Calendar className="w-5 h-5" />
          </button>
      </div>

      {/* Desktop Floating Action Bar (Only shows when scrolled usually, but here fixed) */}
      <div className="hidden lg:flex fixed bottom-8 transform -translate-x-1/2 left-1/2 bg-white/90 backdrop-blur-md px-3 py-3 rounded-full shadow-2xl border border-white/50 z-50 items-center gap-2 animate-fade-in-up">
           <a 
            href={`https://wa.me/917428013214?text=Hello,%20I%20am%20interested%20in%20booking%20a%20Mehndi%20session.${selectedPackage ? `%20I%20have%20selected%20the%20${encodeURIComponent(selectedPackage.name)}.` : ''}%20Please%20let%20me%20know%20the%20availability.`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white px-8 py-3 rounded-full font-bold text-lg shadow-md transition-all hover:shadow-[#25D366]/40 flex items-center gap-3 hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="hidden md:inline">WhatsApp</span>
          </a>
          
          <div className="w-px h-8 bg-stone-300 mx-1"></div>

          <button 
            onClick={handleBookNow}
            className="bg-stone-900 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-stone-800 transition-all flex items-center gap-3 shadow-md hover:shadow-xl hover:-translate-y-0.5"
          >
             Book Appointment <Calendar className="w-5 h-5" />
          </button>
      </div>

      {showBookingForm && (
        <BookingForm 
          selectedPackage={selectedPackage} 
          onClose={() => setShowBookingForm(false)} 
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in"
             onClick={() => setSelectedImage(null)}>
            <button 
                className="fixed top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
                onClick={() => setSelectedImage(null)}
            >
                <X size={24} />
            </button>
            <div className="relative max-w-5xl w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
                <img 
                    src={selectedImage.image_url} 
                    alt="Expanded View" 
                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                />
            </div>
        </div>
      )}
    </div>
  );
};

export default MehndiBooking;
