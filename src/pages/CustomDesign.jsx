import React, { useState } from 'react';
import { Palette, Upload, Send } from 'lucide-react';

const CustomDesign = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'embroidery', // embroidery or mehndi
    description: '',
    budget: '',
    date: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your request! We will contact you shortly.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      type: 'embroidery',
      description: '',
      budget: '',
      date: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-warm-beige min-h-screen font-sofia py-12 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-light text-gray-800 mb-6">
            Custom <span className="text-deep-rose">Design Request</span>
          </h1>
          <p className="text-xl text-gray-600">
            Let's bring your unique vision to life. Fill out the form below to start the creative process.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Design Type Section */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-gray-800">What are you looking for?</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    formData.type === 'embroidery' 
                    ? 'border-deep-rose bg-deep-rose/5' 
                    : 'border-gray-200 hover:border-deep-rose/50'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, type: 'embroidery' }))}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      formData.type === 'embroidery' ? 'bg-deep-rose text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Palette size={20} />
                    </div>
                    <span className="font-medium text-lg">Custom Embroidery</span>
                  </div>
                </div>

                <div 
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    formData.type === 'mehndi' 
                    ? 'border-sage bg-sage/5' 
                    : 'border-gray-200 hover:border-sage/50'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, type: 'mehndi' }))}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      formData.type === 'mehndi' ? 'bg-sage text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Upload size={20} />
                    </div>
                    <span className="font-medium text-lg">Mehndi Design</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-deep-rose focus:border-transparent outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-deep-rose focus:border-transparent outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-deep-rose focus:border-transparent outline-none transition-all"
                  placeholder="+91 74280 13214"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Preferred Date (Optional)</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-deep-rose focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Design Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Design Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-deep-rose focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Describe your idea, colors, size, and any specific requirements..."
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Estimated Budget</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-deep-rose focus:border-transparent outline-none transition-all"
                    placeholder="e.g. 5000"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-deep-rose text-white py-4 rounded-xl font-semibold text-lg hover:bg-deep-rose/90 transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Send size={20} />
              <span>Submit Request</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomDesign;
