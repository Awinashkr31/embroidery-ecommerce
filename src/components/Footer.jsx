import React from 'react';
import { Link } from 'react-router-dom';
import {
  Instagram,
  MessageCircle,
  Mail,
  Heart,
  MapPin,
  ArrowRight
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#f0ece9] text-stone-600 border-t border-stone-200 font-sofia">
      <div className="container-custom py-6 lg:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">
          {/* 1. Brand Section */}
          <div className="lg:col-span-4 space-y-3">
            <Link to="/" className="inline-block">
               {/* Logo: Displaying original (likely dark) logo without filters for light bg */}
              <img 
                src="/logo.png" 
                alt="Embroidery By Sana" 
                className="h-20 w-auto object-contain mix-blend-multiply opacity-90 hover:opacity-100 transition-opacity" 
              />
            </Link>
            <p className="text-stone-500 leading-relaxed max-w-sm font-light text-sm">
              Weaving stories into fabric. Handcrafted embroidery and detailed Mehndi designs 
              that bring a touch of heritage and elegance to your special moments.
            </p>
            <div className="flex gap-3 pt-1">
               <SocialLink href="https://www.instagram.com/embroidery_by__sana" icon={<Instagram size={18} />} label="Instagram" />
               <SocialLink href="https://wa.me/917428013214" icon={<MessageCircle size={18} />} label="WhatsApp" />
               <SocialLink href="mailto:hello@sanaembroidery.com" icon={<Mail size={18} />} label="Email" />
            </div>
          </div>

          {/* 2. Quick Links */}
          <div className="lg:col-span-3 lg:pl-8 space-y-4">
             <h4 className="font-heading text-base font-bold text-stone-900 uppercase tracking-widest">Explore</h4>
             <ul className="space-y-2 text-sm">
                <FooterLink to="/shop" label="Shop Collection" />
                <FooterLink to="/gallery" label="Our Gallery" />
                <FooterLink to="/mehndi-booking" label="Book Mehndi" />
                <FooterLink to="/custom-design" label="Custom Orders" />
             </ul>
          </div>

          {/* 3. Help & Info */}
          <div className="lg:col-span-2 space-y-4">
             <h4 className="font-heading text-base font-bold text-stone-900 uppercase tracking-widest">Help</h4>
             <ul className="space-y-2 text-sm">
                <FooterLink to="/about" label="Our Story" />
                <FooterLink to="/support" label="Contact Us" />
                <FooterLink to="/profile" label="Order History" />
             </ul>
          </div>

          {/* 4. Contact / Location */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-heading text-base font-bold text-stone-900 uppercase tracking-widest">Visit Us</h4>
            <ul className="space-y-3 text-sm text-stone-500">
                <li className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-rose-800 shrink-0" />
                    <span>Based in India,<br/>Shipping Worldwide</span>
                </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-stone-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
             <p>&copy; {currentYear} Embroidery By Sana. All rights reserved.</p>
             <div className="flex items-center gap-1">
                <span>Handcrafted with</span>
                <Heart className="w-3 h-3 text-rose-500 fill-current" />
                <span>in India</span>
             </div>
        </div>
      </div>
    </footer>
  );
};

// Helper Components
const SocialLink = ({ href, icon, label }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full border border-stone-200 text-stone-600 flex items-center justify-center hover:bg-rose-900 hover:border-rose-900 hover:text-white transition-all duration-300"
        aria-label={label}
    >
        {icon}
    </a>
);

const FooterLink = ({ to, label }) => (
    <li>
        <Link 
            to={to} 
            className="group flex items-center gap-2 text-stone-500 hover:text-rose-900 transition-colors"
        >
            <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300">
                <ArrowRight size={12} />
            </span>
            {label}
        </Link>
    </li>
);

export default Footer;
