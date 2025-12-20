import React, { useState } from 'react';
import { Calendar, CheckCircle, Clock, MapPin } from 'lucide-react';
import BookingForm from '../components/BookingForm';

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
            Mehndi <span className="text-sage text-rose-900">Booking</span>
          </h1>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
            Book your session for weddings, festivals, or special occasions. We use 100% organic, chemical-free henna for creating deep, rich stains.
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
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex justify-center lg:static lg:bg-transparent lg:border-none lg:p-0 z-40">
           <button 
            onClick={handleBookNow}
            className={`w-full max-w-md lg:w-auto bg-rose-900 text-white px-12 py-4 rounded-full font-bold text-lg shadow-xl transition-all hover:-translate-y-1 hover:shadow-rose-900/30 flex items-center justify-center gap-3 ${!selectedPackage ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!selectedPackage}
          >
            Schedule Appointment <Calendar className="w-5 h-5" />
          </button>
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
                 src="https://images.unsplash.com/photo-1594736797933-d0f9dd8b4d40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
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
