import React, { useState } from 'react';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

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
    ]
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
    ]
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
    ]
  }
];

const MehndiBooking = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);

  return (
    <div className="bg-warm-beige min-h-screen font-sofia py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-light text-gray-800 mb-6">
            Mehndi <span className="text-sage">Booking</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Book your session for weddings, festivals, or special occasions. We use 100% organic, chemical-free henna for creating deep, rich stains.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {PACKAGES.map((pkg) => (
            <div 
              key={pkg.id}
              className={`bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all cursor-pointer border-2 ${
                selectedPackage === pkg.id ? 'border-sage ring-2 ring-sage/20' : 'border-transparent'
              }`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              <h3 className="text-2xl font-medium text-gray-800 mb-4">{pkg.name}</h3>
              <div className="text-3xl font-bold text-sage mb-6">
                ₹{pkg.price}<span className="text-base font-normal text-gray-500">/{pkg.id === 2 ? 'person' : 'session'}</span>
              </div>
              <ul className="space-y-4 mb-8">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start space-x-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-xl font-medium transition-colors ${
                selectedPackage === pkg.id 
                ? 'bg-sage text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
                {selectedPackage === pkg.id ? 'Selected' : 'Select Package'}
              </button>
            </div>
          ))}
        </div>

        {/* Calendar Section (Visual Only) */}
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-medium text-gray-800 mb-6">Schedule Your Session</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-sage" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Select Date & Time</h3>
                    <p className="text-gray-600">Choose a slot that works best for you. We recommend booking at least 2 days in advance.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-sage" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Duration</h3>
                    <p className="text-gray-600">Sessions typically last between 30 minutes to 4 hours depending on the design intricacy.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <button 
                  className="bg-deep-rose text-white px-8 py-4 rounded-full font-semibold hover:bg-deep-rose/90 transition-all shadow-lg w-full sm:w-auto"
                  onClick={() => alert('Booking system integration coming soon! Please call us to book.')}
                >
                  Proceed to Book
                </button>
              </div>
            </div>
            
            <div className="relative h-64 lg:h-full min-h-[300px] rounded-xl overflow-hidden">
               <img 
                 src="https://images.unsplash.com/photo-1594736797933-d0f9dd8b4d40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                 alt="Mehndi Application" 
                 className="absolute inset-0 w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
                 <p className="text-white font-medium">Professional application in a comfortable environment</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MehndiBooking;
