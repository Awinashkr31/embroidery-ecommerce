import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Instagram,
  MessageCircle,
  Mail,
  Heart,
  MapPin,
  ArrowRight,
  ChevronDown
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  return (
    <footer className={`bg-[#f0ece9] text-stone-600 border-t border-stone-200 font-sofia pb-16 md:pb-20 ${location.pathname === '/' ? 'block' : 'hidden md:block'}`}>
      <div className="container-custom py-8 lg:py-10">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-12 gap-x-4 gap-y-8 lg:gap-8">
          {/* 1. Brand Section - Full Width on Mobile */}
          <div className="col-span-2 lg:col-span-4 space-y-3 pb-6 lg:pb-0 border-b border-stone-200 lg:border-0">
            <Link to="/" className="inline-block">
               {/* Logo */}
              <picture>
                <source srcSet="/logo.webp" type="image/webp" />
                <img 
                  src="/logo.png" 
                  alt="Crochet Wali" 
                  className="h-16 lg:h-20 w-auto object-contain drop-shadow-sm opacity-90 hover:opacity-100 transition-opacity" 
                  width={200}
                  height={80}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </Link>
            <p className="text-stone-600 leading-relaxed max-w-sm font-light text-sm">
              Weaving stories into fabric. Handcrafted embroidery and detailed designs 
              that bring a touch of heritage and elegance to your special moments.
            </p>
            <div className="flex gap-3 pt-2">
               <SocialLink href="https://www.instagram.com/crochetwali.in" icon={<Instagram size={16} />} label="Instagram" />
               <SocialLink href="https://wa.me/917428013214" icon={<MessageCircle size={16} />} label="WhatsApp" />
               <SocialLink href="mailto:support@crochetwali.in" icon={<Mail size={16} />} label="Email" />
            </div>
          </div>

          {/* Mobile Accordions & Desktop Columns Container */}
          <div className="col-span-2 lg:col-span-8 flex flex-col lg:grid lg:grid-cols-8 gap-0 lg:gap-8 -mt-4 lg:mt-0">
              {/* 2. Explore Links */}
              <div className="lg:col-span-2 border-b border-stone-200 lg:border-0 py-4 lg:py-0">
                  <details className="group lg:hidden" name="footer-accordion">
                      <summary className="flex items-center justify-between font-heading font-bold text-stone-900 uppercase tracking-widest text-sm cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                          Explore <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform text-stone-600" />
                      </summary>
                      <ul className="space-y-3 mt-4 text-sm pb-2">
                          <FooterLink to="/categories" label="All Collections" />
                          <FooterLink to="/gifts" label="Gift Guide" />
                          <FooterLink to="/shop" label="Shop Collection" />
                          <FooterLink to="/blog" label="Journal & Blog" />

                          <FooterLink to="/custom-design" label="Custom Orders" />
                      </ul>
                  </details>
                  <div className="hidden lg:block space-y-4">
                      <h3 className="font-heading text-base font-bold text-stone-900 uppercase tracking-widest">Explore</h3>
                      <ul className="space-y-3 text-sm">
                          <FooterLink to="/categories" label="All Collections" />
                          <FooterLink to="/gifts" label="Gift Guide" />
                          <FooterLink to="/shop" label="Shop Collection" />
                          <FooterLink to="/blog" label="Journal & Blog" />

                          <FooterLink to="/custom-design" label="Custom Orders" />
                      </ul>
                  </div>
              </div>

              {/* 3. Help Links */}
              <div className="lg:col-span-2 border-b border-stone-200 lg:border-0 py-4 lg:py-0">
                  <details className="group lg:hidden" name="footer-accordion">
                      <summary className="flex items-center justify-between font-heading font-bold text-stone-900 uppercase tracking-widest text-sm cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                          Help <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform text-stone-600" />
                      </summary>
                      <ul className="space-y-3 mt-4 text-sm pb-2">
                          <FooterLink to="/about" label="About" />
                          <FooterLink to="/support" label="Support" />
                          <FooterLink to="/profile" label="Order History" />
                      </ul>
                  </details>
                  <div className="hidden lg:block space-y-4">
                      <h3 className="font-heading text-base font-bold text-stone-900 uppercase tracking-widest">Help</h3>
                      <ul className="space-y-3 text-sm">
                          <FooterLink to="/about" label="About" />
                          <FooterLink to="/support" label="Support" />
                          <FooterLink to="/profile" label="Order History" />
                      </ul>
                  </div>
              </div>

              {/* 4. Policies */}
              <div className="lg:col-span-2 border-b border-stone-200 lg:border-0 py-4 lg:py-0">
                  <details className="group lg:hidden" name="footer-accordion">
                      <summary className="flex items-center justify-between font-heading font-bold text-stone-900 uppercase tracking-widest text-sm cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                          Policies <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform text-stone-600" />
                      </summary>
                      <ul className="space-y-3 mt-4 text-sm pb-2">
                          <FooterLink to="/return-policy" label="Returns & Replacements" />
                          <FooterLink to="/shipping-policy" label="Shipping Policy" />
                          <FooterLink to="/privacy-policy" label="Privacy Policy" />
                          <FooterLink to="/terms-of-service" label="Terms of Service" />
                      </ul>
                  </details>
                  <div className="hidden lg:block space-y-4">
                      <h3 className="font-heading text-base font-bold text-stone-900 uppercase tracking-widest">Policies</h3>
                      <ul className="space-y-3 text-sm">
                          <FooterLink to="/return-policy" label="Returns & Replacements" />
                          <FooterLink to="/shipping-policy" label="Shipping Policy" />
                          <FooterLink to="/privacy-policy" label="Privacy Policy" />
                          <FooterLink to="/terms-of-service" label="Terms of Service" />
                      </ul>
                  </div>
              </div>

              {/* 5. Visit Us */}
              <div className="lg:col-span-2 py-4 lg:py-0">
                  <details className="group lg:hidden" name="footer-accordion">
                      <summary className="flex items-center justify-between font-heading font-bold text-stone-900 uppercase tracking-widest text-sm cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                          Visit Us <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform text-stone-600" />
                      </summary>
                      <ul className="space-y-3 mt-4 text-sm text-stone-700 pb-2">
                          <li className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-rose-900 shrink-0 mt-0.5" />
                              <span>Hauz Khas Village, Near Fort, New Delhi, Delhi 110016</span>
                          </li>
                      </ul>
                  </details>
                  <div className="hidden lg:block space-y-4">
                      <h3 className="font-heading text-base font-bold text-stone-900 uppercase tracking-widest">Visit Us</h3>
                      <ul className="space-y-3 text-sm text-stone-700">
                          <li className="flex items-start gap-2">
                              <MapPin className="w-5 h-5 text-rose-900 shrink-0 mt-0.5" />
                              <span>Hauz Khas Village, Near Fort, New Delhi, Delhi 110016</span>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
        </div>

        {/* SEO-rich Footer Description */}
        <div className="mt-8 pt-6 border-t border-stone-200">
          {/* Handcrafted Collections Links */}
          <div className="text-center mb-5">
            <h4 className="font-heading text-xs font-bold text-stone-900 tracking-wider mb-3">Popular Handcrafted Collections</h4>
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-2.5 max-w-4xl mx-auto">
              <Link to="/collections/crochet-bouquets" className="inline-flex items-center justify-center px-3 py-2 sm:px-2.5 sm:py-1 rounded-full bg-white/70 hover:bg-white text-stone-700 hover:text-rose-900 border border-stone-200/90 hover:border-rose-300 text-xs font-medium transition-all shadow-xs active:scale-95">Crochet Bouquets</Link>
              <Link to="/collections/crochet-flowers" className="inline-flex items-center justify-center px-3 py-2 sm:px-2.5 sm:py-1 rounded-full bg-white/70 hover:bg-white text-stone-700 hover:text-rose-900 border border-stone-200/90 hover:border-rose-300 text-xs font-medium transition-all shadow-xs active:scale-95">Crochet Flowers & Pots</Link>
              <Link to="/collections/reusable-bridal-gajra" className="inline-flex items-center justify-center px-3 py-2 sm:px-2.5 sm:py-1 rounded-full bg-white/70 hover:bg-white text-stone-700 hover:text-rose-900 border border-stone-200/90 hover:border-rose-300 text-xs font-medium transition-all shadow-xs active:scale-95">Reusable Bridal Gajra</Link>
              <Link to="/collections/crochet-keychains" className="inline-flex items-center justify-center px-3 py-2 sm:px-2.5 sm:py-1 rounded-full bg-white/70 hover:bg-white text-stone-700 hover:text-rose-900 border border-stone-200/90 hover:border-rose-300 text-xs font-medium transition-all shadow-xs active:scale-95">Keychains & Bag Charms</Link>
              <Link to="/collections/crochet-claw-clips" className="inline-flex items-center justify-center px-3 py-2 sm:px-2.5 sm:py-1 rounded-full bg-white/70 hover:bg-white text-stone-700 hover:text-rose-900 border border-stone-200/90 hover:border-rose-300 text-xs font-medium transition-all shadow-xs active:scale-95">Hair Claw Clips</Link>
              <Link to="/collections/crochet-parandi" className="inline-flex items-center justify-center px-3 py-2 sm:px-2.5 sm:py-1 rounded-full bg-white/70 hover:bg-white text-stone-700 hover:text-rose-900 border border-stone-200/90 hover:border-rose-300 text-xs font-medium transition-all shadow-xs active:scale-95">Handmade Parandi</Link>
              <Link to="/collections/crochet-rose-bouquet" className="inline-flex items-center justify-center px-3 py-2 sm:px-2.5 sm:py-1 rounded-full bg-white/70 hover:bg-white text-stone-700 hover:text-rose-900 border border-stone-200/90 hover:border-rose-300 text-xs font-medium transition-all shadow-xs active:scale-95">Rose Bouquets</Link>
              <Link to="/collections/crochet-sunflower" className="inline-flex items-center justify-center px-3 py-2 sm:px-2.5 sm:py-1 rounded-full bg-white/70 hover:bg-white text-stone-700 hover:text-rose-900 border border-stone-200/90 hover:border-rose-300 text-xs font-medium transition-all shadow-xs active:scale-95">Sunflower Pots</Link>
              <Link to="/collections/crochet-tulip" className="inline-flex items-center justify-center px-3 py-2 sm:px-2.5 sm:py-1 rounded-full bg-white/70 hover:bg-white text-stone-700 hover:text-rose-900 border border-stone-200/90 hover:border-rose-300 text-xs font-medium transition-all shadow-xs active:scale-95">Pastel Tulips</Link>
              <Link to="/collections/gifts-for-girlfriend" className="inline-flex items-center justify-center px-3 py-2 sm:px-2.5 sm:py-1 rounded-full bg-white/70 hover:bg-white text-stone-700 hover:text-rose-900 border border-stone-200/90 hover:border-rose-300 text-xs font-medium transition-all shadow-xs active:scale-95">Gifts for Girlfriend</Link>
              <Link to="/collections/anniversary-gifts" className="inline-flex items-center justify-center px-3 py-2 sm:px-2.5 sm:py-1 rounded-full bg-white/70 hover:bg-white text-stone-700 hover:text-rose-900 border border-stone-200/90 hover:border-rose-300 text-xs font-medium transition-all shadow-xs active:scale-95">Anniversary Keepsakes</Link>
              <Link to="/collections/gifts-under-500" className="inline-flex items-center justify-center px-3 py-2 sm:px-2.5 sm:py-1 rounded-full bg-white/70 hover:bg-white text-stone-700 hover:text-rose-900 border border-stone-200/90 hover:border-rose-300 text-xs font-medium transition-all shadow-xs active:scale-95">Gifts Under ₹500</Link>
              <Link to="/collections/gifts-under-1000" className="inline-flex items-center justify-center px-3 py-2 sm:px-2.5 sm:py-1 rounded-full bg-white/70 hover:bg-white text-stone-700 hover:text-rose-900 border border-stone-200/90 hover:border-rose-300 text-xs font-medium transition-all shadow-xs active:scale-95">Gifts Under ₹1000</Link>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-stone-600 max-w-4xl mx-auto text-center mb-6">
            <strong className="font-semibold text-stone-800">Crochet Wali</strong> is India's premier handmade crochet gift shop. Shop forever crochet flower bouquets, handmade gajra, crochet hair clips, crochet keychains, crochet parandi, crochet claw clips, flower pots, and personalized gift boxes. Every product at Crochet Wali is 100% handmade with premium yarn. Crochet Wali delivers aesthetic handmade gifts across India — perfect for birthdays, anniversaries, rakhi, and special occasions. Buy handmade crochet gifts online at Crochet Wali.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-600">
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1">
                 <p>© {currentYear} Crochet Wali. All rights reserved.</p>
                 <span className="hidden md:inline text-stone-600">•</span>
                 <a 
                   href="/sitemap.xml" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="text-stone-600 hover:text-rose-900 transition-colors underline-offset-2 hover:underline"
                 >
                   Sitemap
                 </a>
               </div>
               <div className="flex items-center gap-1 text-stone-600 md:pr-28">
                  <span>Handcrafted with</span>
                  <Heart className="w-3 h-3 text-rose-900 fill-current" />
                  <span>in India</span>
               </div>
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
            className="group flex items-center gap-2 text-stone-700 hover:text-rose-900 transition-colors"
        >
            <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300">
                <ArrowRight size={12} />
            </span>
            {label}
        </Link>
    </li>
);

const FooterExternalLink = ({ href, label }) => (
    <li>
        <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-stone-700 hover:text-rose-900 transition-colors"
        >
            <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300">
                <ArrowRight size={12} />
            </span>
            {label}
        </a>
    </li>
);

export default Footer;
