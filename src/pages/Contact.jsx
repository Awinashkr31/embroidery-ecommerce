import React, { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, MessageCircle, Send } from 'lucide-react';
import { supabase } from '../../config/supabase';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
          }
        ]);

      if (error) throw error;

      alert('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-[#fdfbf7] min-h-screen font-body pt-24 pb-20">
      <div className="container-custom">
        <div className="text-center mb-16 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
          <span className="text-xs font-bold text-rose-900 uppercase tracking-[0.2em] mb-3 block">Get Connected</span>
          <h1 className="text-4xl lg:text-6xl font-heading font-bold text-stone-900 mb-6">
            We'd love to <span className="text-rose-900 italic">hear from you</span>
          </h1>
          <p className="text-lg text-stone-600 leading-relaxed">
            Have a question about a custom order, or just want to discuss your vision? We are here to help you create something beautiful.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Contact Info */}
          <div className="space-y-8 animate-in slide-in-from-left-8 duration-700 delay-100">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100 space-y-10 relative overflow-hidden">
               {/* Decorative bg */}
               <div className="absolute top-0 right-0 w-40 h-40 bg-rose-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 opacity-60"></div>

              <div className="flex items-start space-x-6 relative z-10">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center flex-shrink-0 rotate-3">
                  <Phone className="w-6 h-6 text-rose-900" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-stone-900 mb-1">Phone / WhatsApp</h3>
                  <a href="https://wa.me/917428013214" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-rose-900 transition-colors block text-lg font-medium">
                    +91 74280 13214
                  </a>
                  <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mt-1">Mon-Fri • 10am - 7pm</p>
                </div>
              </div>

              <div className="flex items-start space-x-6 relative z-10">
                <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center flex-shrink-0 -rotate-2">
                  <Mail className="w-6 h-6 text-stone-600" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-stone-900 mb-1">Email Support</h3>
                  <a href="mailto:hello@sanaembroidery.com" className="text-stone-600 hover:text-rose-900 transition-colors block text-lg font-medium">
                    hello@sanaembroidery.com
                  </a>
                  <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mt-1">Online orders & Enquiries</p>
                </div>
              </div>

              <div className="flex items-start space-x-6 relative z-10">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center flex-shrink-0 rotate-1">
                  <MapPin className="w-6 h-6 text-rose-900" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-stone-900 mb-1">The Studio</h3>
                  <p className="text-stone-600 text-lg">Hauz Khas Village, Near Fort</p>
                  <p className="text-stone-600 text-lg">New Delhi, Delhi 110016</p>
                </div>
              </div>
            </div>

            <div className="bg-stone-900 text-white rounded-[2rem] p-8 shadow-xl relative overflow-hidden">
               <div className="absolute bottom-0 right-0 w-32 h-32 bg-rose-900 rounded-full blur-2xl translate-y-1/3 translate-x-1/3 opacity-40"></div>
              <h3 className="text-2xl font-heading font-bold mb-6">Connect on Social</h3>
              <div className="flex space-x-4">
                <a href="#" className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all hover:-translate-y-1 backdrop-blur-sm">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all hover:-translate-y-1 backdrop-blur-sm">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all hover:-translate-y-1 backdrop-blur-sm">
                  <MessageCircle className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-[2rem] shadow-xl border border-stone-100 p-8 lg:p-12 animate-in slide-in-from-right-8 duration-700 delay-200">
            <h2 className="text-2xl font-heading font-bold text-stone-900 mb-8">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3.5 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-rose-900 focus:bg-white focus:ring-0 outline-none transition-all font-medium text-stone-800"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                     className="w-full px-5 py-3.5 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-rose-900 focus:bg-white focus:ring-0 outline-none transition-all font-medium text-stone-800"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                   className="w-full px-5 py-3.5 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-rose-900 focus:bg-white focus:ring-0 outline-none transition-all font-medium text-stone-800"
                  placeholder="How can we help?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                   className="w-full px-5 py-3.5 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-rose-900 focus:bg-white focus:ring-0 outline-none transition-all font-medium text-stone-800 resize-none"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-rose-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-rose-800 transition-all shadow-lg hover:shadow-rose-900/30 flex items-center justify-center gap-3 group"
              >
                Send Message
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
