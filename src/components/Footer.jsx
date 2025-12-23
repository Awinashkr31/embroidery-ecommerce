import React from 'react';
import { Link } from 'react-router-dom';
import {
  Instagram,
  MessageCircle,
  Phone,
  Mail,
  Heart,
  ArrowUpRight
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#141312] text-stone-300 overflow-hidden">
      {/* Top Accent */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-rose-800/60 to-transparent" />

      <div className="container-custom py-12 lg:py-14">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-10">

          {/* Brand */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-block">
              <h3 className="font-heading text-4xl font-bold text-white tracking-tight">
                Embroidery<span className="text-rose-500">.</span>
              </h3>
              <span className="block mt-1 text-[11px] tracking-[0.35em] uppercase font-semibold text-rose-500">
                By Sana
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-stone-400 max-w-sm">
              Celebrating the timeless art of hand embroidery. Every piece is
              thoughtfully handcrafted to bring elegance, heritage, and warmth
              into your everyday life.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://www.instagram.com/embroidery_by__sana"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-rose-700 transition"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/917428013214"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-green-600 transition"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="lg:col-span-2 space-y-5">
            <h4 className="text-white font-heading font-semibold text-lg">
              Shop
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                ['Shop All', '/shop'],
                ['Bridal Collection', '/shop?category=Bridal'],
                ['Hoop Art', '/shop?category=Hoop Art'],
                ['Accessories', '/shop?category=Accessories'],
              ].map(([label, path]) => (
                <li key={label}>
                  <Link
                    to={path}
                    className="group inline-flex items-center gap-1 text-stone-400 hover:text-white transition"
                  >
                    {label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2 space-y-5">
            <h4 className="text-white font-heading font-semibold text-lg">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li><Link to="/about" className="hover:text-white">Our Story</Link></li>
              <li><Link to="/gallery" className="hover:text-white">Gallery</Link></li>
              <li><Link to="/support" className="hover:text-white">Contact Us</Link></li>
              <li><Link to="/mehndi-booking" className="hover:text-white">Mehndi Services</Link></li>
            </ul>
          </div>

          {/* Contact Card */}
          <div className="lg:col-span-4">
            <div className="relative bg-gradient-to-br from-stone-800/60 to-stone-900/60 border border-stone-700 rounded-2xl p-8 space-y-6">
              <h4 className="text-white font-heading font-semibold text-xl">
                Contact Us
              </h4>

              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-rose-900/20 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-rose-500" />
                  </div>
                  <span className="text-stone-200 font-medium">
                    +91 74280 13214
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-rose-900/20 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-rose-500" />
                  </div>
                  <span className="text-stone-200 font-medium">
                    hello@sanaembroidery.com
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {currentYear} Hand Embroidery by Sana</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-500" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
