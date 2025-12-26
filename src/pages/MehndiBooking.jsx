import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, MapPin } from 'lucide-react';
import BookingForm from '../components/BookingForm';
import { fetchSetting } from '../utils/settingsUtils';

const PACKAGES = [
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

const MehndiBooking = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [featureImage, setFeatureImage] = useState("https://images.unsplash.com/photo-1594736797933-d0f9dd8b4d40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
  const [pageTitle, setPageTitle] = useState("Mehndi Booking");
  const [pageSubtitle, setPageSubtitle] = useState("Professional mehndi artistry for your special occasions.");

  useEffect(() => {
    const loadSettings = async () => {
      const image = await fetchSetting('mehndi_feature_image');
      if (image) setFeatureImage(image);

      const title = await fetchSetting('mehndi_title');
      if (title) setPageTitle(title);

      const subtitle = await fetchSetting('mehndi_subtitle');
      if (subtitle) setPageSubtitle(subtitle);
    };
    loadSettings();
  }, []);

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
    <div className="bg-warm-beige min-h-screen font-sofia py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-900/10 text-rose-900 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <MapPin className="w-3 h-3" /> Service Available in Delhi Only
          </div>
          <h1 className="text-4xl lg:text-5xl font-light text-gray-800 mb-6 font-heading">
            {pageTitle}
          </h1>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
            {pageSubtitle}
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {PACKAGES.map((pkg) => (
            <div 
              key={pkg.id}
              className={`bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all cursor-pointer border-2 relative overflow-hidden group ${
                selectedPackage?.id === pkg.id ? 'border-rose-900 ring-4 ring-rose-900/5' : 'border-transparent'
              }`}
              onClick={() => handlePackageSelect(pkg)}
            >
              {selectedPackage?.id === pkg.id && (
                <div className="absolute top-0 right-0 bg-rose-900 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                  SELECTED
                </div>
              )}
              <h3 className="text-2xl font-bold font-heading text-gray-800 mb-2">{pkg.name}</h3>
              <div className="text-3xl font-bold text-rose-900 mb-6">
                ₹{pkg.price}<span className="text-base font-normal text-gray-500">/{pkg.id === 2 ? 'person' : 'session'}</span>
              </div>
              <ul className="space-y-4 mb-8">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start space-x-3 text-gray-600 text-sm">
                    <CheckCircle className="w-5 h-5 text-rose-900 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded-lg">
                <Clock className="w-4 h-4 mr-2" /> Approx time: {pkg.duration}
              </div>
              <button 
                className={`w-full py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all ${
                selectedPackage?.id === pkg.id 
                ? 'bg-rose-900 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
              }`}>
                {selectedPackage?.id === pkg.id ? 'Package Selected' : 'Select Package'}
              </button>
            </div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex flex-col lg:flex-row items-center justify-center gap-3 lg:static lg:bg-transparent lg:border-none lg:p-0 z-40">
           <button 
            onClick={handleBookNow}
            className={`w-full max-w-md lg:w-auto bg-rose-900 text-white px-12 py-4 rounded-full font-bold text-lg shadow-xl transition-all hover:-translate-y-1 hover:shadow-rose-900/30 flex items-center justify-center gap-3 ${!selectedPackage ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!selectedPackage}
          >
            Schedule Appointment <Calendar className="w-5 h-5" />
          </button>
          
          <div className="hidden lg:block w-px h-10 bg-stone-300 mx-2"></div>
          
           <a 
            href={`https://wa.me/917428013214?text=Hello,%20I%20am%20interested%20in%20booking%20a%20Mehndi%20session.${selectedPackage ? `%20I%20have%20selected%20the%20${encodeURIComponent(selectedPackage.name)}.` : ''}%20Please%20let%20me%20know%20the%20availability.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-md lg:w-auto bg-[#25D366] text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-all hover:-translate-y-1 hover:shadow-[#25D366]/30 flex items-center justify-center gap-3 whitespace-nowrap"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Book on WhatsApp
          </a>
        </div>

        {/* Calendar Section (Visual Context) */}
        <div className="mt-16 bg-white rounded-[2.5rem] shadow-xl p-8 lg:p-12 overflow-hidden relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-3xl font-heading font-bold text-gray-800 mb-6">Why Book With Us?</h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-rose-900" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-1">Based in Delhi</h3>
                    <p className="text-gray-600">We provide doorstep services across Delhi NCR for bookings above ₹2000. Studio visits available in Hauz Khas.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-rose-900" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-1">Flexible Scheduling</h3>
                    <p className="text-gray-600">Morning, afternoon, and evening slots available. We recommend booking at least 48 hours in advance.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative h-80 lg:h-96 rounded-3xl overflow-hidden shadow-lg rotate-1 hover:rotate-0 transition-transform duration-700">
               <img 
                 src={featureImage} 
                 alt="Mehndi Application" 
                 className="absolute inset-0 w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                 <p className="text-white font-medium text-lg">"The detail and color were absolutely stunning!"</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {showBookingForm && (
        <BookingForm 
          selectedPackage={selectedPackage} 
          onClose={() => setShowBookingForm(false)} 
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default MehndiBooking;
