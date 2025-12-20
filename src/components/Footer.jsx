import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-stone-900 text-stone-300 text-sm" data-id="main-footer">
            <div className="container-custom py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2 space-y-6" data-id="footer-brand">
                        <Link to="/" className="inline-block">
                             <h3 className="font-heading text-2xl font-bold text-white mb-2" data-id="footer-logo">
                                Hand Embroidery
                                <span className="block text-rose-500 text-sm font-sans tracking-widest uppercase mt-1">by Sana</span>
                            </h3>
                        </Link>
                        <p className="text-stone-400 max-w-md leading-relaxed" data-id="footer-description">
                            Creating beautiful handcrafted embroidery and intricate mehndi designs with passion, precision, and artistic heritage. Join us in celebrating the art of slow fashion.
                        </p>
                        <div className="flex space-x-4 pt-2" data-id="social-links">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-stone-800 p-2 rounded-full hover:bg-rose-900 hover:text-white transition-all transform hover:scale-110">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-stone-800 p-2 rounded-full hover:bg-rose-900 hover:text-white transition-all transform hover:scale-110">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="bg-stone-800 p-2 rounded-full hover:bg-rose-900 hover:text-white transition-all transform hover:scale-110">
                                <MessageCircle className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div data-id="footer-links" className="space-y-6">
                        <h4 className="text-white font-semibold tracking-wide uppercase text-xs" data-id="quick-links-title">Navigation</h4>
                        <ul className="space-y-3" data-id="quick-links-list">
                            <li><Link to="/about" className="hover:text-rose-400 transition-colors">About Us</Link></li>
                            <li><Link to="/shop" className="hover:text-rose-400 transition-colors">Shop Collection</Link></li>
                            <li><Link to="/custom-design" className="hover:text-rose-400 transition-colors">Custom Orders</Link></li>
                            <li><Link to="/mehndi-booking" className="hover:text-rose-400 transition-colors">Mehndi Services</Link></li>
                            <li><Link to="/contact" className="hover:text-rose-400 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div data-id="footer-contact" className="space-y-6">
                        <h4 className="text-white font-semibold tracking-wide uppercase text-xs" data-id="contact-info-title">Contact Us</h4>
                        <div className="space-y-4" data-id="contact-info-list">
                            <div className="flex items-start space-x-3" data-id="phone-info">
                                <Phone className="w-5 h-5 text-rose-500 mt-0.5" />
                                <div className="flex flex-col">
                                    <span className="text-xs text-stone-500 uppercase font-bold">Call / WhatsApp</span>
                                    <a href="https://wa.me/917428013214" className="hover:text-white transition-colors">+91 74280 13214</a>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3" data-id="email-info">
                                <Mail className="w-5 h-5 text-rose-500 mt-0.5" />
                                <div className="flex flex-col">
                                    <span className="text-xs text-stone-500 uppercase font-bold">Email</span>
                                    <span className="hover:text-white cursor-pointer transition-colors">hello@sanaembroidery.com</span>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3" data-id="location-info">
                                <MapPin className="w-5 h-5 text-rose-500 mt-0.5" />
                                <div className="flex flex-col">
                                     <span className="text-xs text-stone-500 uppercase font-bold">Location</span>
                                    <span>New Delhi, India</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-stone-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500" data-id="footer-bottom">
                    <p data-id="copyright">
                        © {new Date().getFullYear()} Hand Embroidery by Sana. All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        <Link to="#" className="hover:text-stone-300">Privacy Policy</Link>
                        <Link to="#" className="hover:text-stone-300">Terms of Service</Link>
                        <Link to="#" className="hover:text-stone-300">Shipping Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
