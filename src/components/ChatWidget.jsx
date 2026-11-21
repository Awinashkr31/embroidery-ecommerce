import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  X,
  MessageCircle,
  MessageSquare,
  FileText,
  Package,
  ArrowRight
} from 'lucide-react';

const WHATSAPP_NUMBER = "917428013214";

const ROTATING_MESSAGES = [
  "Help ?",
  "Order on WhatsApp",
  "Track Order"
];

export default function ChatWidget() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
  const [isPillVisible, setIsPillVisible] = useState(false);

  // Cycle: Appear -> Stay 3.8s -> Disappear with animation -> Wait 1.5s -> Next message appears
  useEffect(() => {
    if (isOpen) {
      setIsPillVisible(false);
      return;
    }

    let timeoutId;
    let isMounted = true;

    const showDuration = 3800; // Stay visible for 3.8 seconds
    const hideDuration = 1500; // Wait 1.5 seconds while hidden

    const runCycle = () => {
      if (!isMounted) return;
      setIsPillVisible(true);

      timeoutId = setTimeout(() => {
        if (!isMounted) return;
        setIsPillVisible(false);

        timeoutId = setTimeout(() => {
          if (!isMounted) return;
          setCurrentMsgIndex((prev) => (prev + 1) % ROTATING_MESSAGES.length);
          runCycle();
        }, hideDuration);
      }, showDuration);
    };

    // First appearance 1.5s after page load
    timeoutId = setTimeout(runCycle, 1500);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [isOpen]);

  // Render on Home page ('/'). Hide on /custom-design (which has dedicated action) and /checkout
  const isHomePage = location.pathname === '/';
  if (!isHomePage) return null;

  const createWhatsAppUrl = (text) => {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const actionItems = [
    {
      id: 'custom-help',
      title: 'Help & Custom Queries',
      badge: 'QUICK HELP',
      badgeClass: 'bg-rose-100/80 text-rose-800',
      description: 'Colors, custom sizes & design support',
      icon: MessageSquare,
      iconWrapperClass: 'bg-rose-50 text-rose-700 border border-rose-100',
      arrowClass: 'text-stone-400 group-hover:text-rose-900 group-hover:bg-rose-100',
      cardClass: 'border-stone-200/90 hover:border-rose-300 hover:shadow-md',
      url: createWhatsAppUrl("Hi Crochet Wali, I need help with custom queries, colors, or design support!")
    },
    {
      id: 'direct-order',
      title: 'Order on WhatsApp',
      badge: 'DIRECT ORDER',
      badgeClass: 'bg-emerald-500 text-white font-bold',
      description: 'Share reference photo to place direct order...',
      icon: FileText,
      iconWrapperClass: 'bg-gradient-to-br from-emerald-500 to-[#075e54] text-white shadow-xs',
      arrowClass: 'bg-emerald-500 text-white shadow-xs group-hover:scale-105',
      cardClass: 'border-2 border-emerald-500/80 bg-emerald-50/20 hover:border-emerald-600 hover:shadow-md',
      url: createWhatsAppUrl("Hi Crochet Wali, I would like to place a direct order on WhatsApp. Here are my reference photos / details:")
    },
    {
      id: 'track-order',
      title: 'Track My Order',
      badge: 'LIVE STATUS',
      badgeClass: 'bg-amber-100 text-amber-800',
      description: 'Check dispatch updates & courier AWB',
      icon: Package,
      iconWrapperClass: 'bg-amber-50 text-amber-700 border border-amber-100',
      arrowClass: 'text-stone-400 group-hover:text-amber-700 group-hover:bg-amber-100',
      cardClass: 'border-stone-200/90 hover:border-amber-300 hover:shadow-md',
      url: createWhatsAppUrl("Hi Crochet Wali, I want to check my order dispatch status and courier tracking AWB updates.")
    }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay when Popup is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* WhatsApp Popup Card */}
      {isOpen && (
        <div
          className="fixed bottom-[84px] md:bottom-24 right-3 md:right-8 left-3 sm:left-auto sm:w-[370px] md:w-[380px] bg-white rounded-3xl shadow-[0_16px_48px_rgba(0,0,0,0.22)] overflow-hidden border border-stone-200/80 z-50 animate-in fade-in zoom-in-95 duration-200 max-h-[82vh] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Crochet Wali WhatsApp Support"
        >
          {/* Header */}
          <div className="bg-[#075e54] text-white p-4 flex items-center justify-between shadow-sm relative">
            <div className="flex items-center gap-3">
              {/* WhatsApp Icon with Live Online Ping */}
              <div className="relative w-11 h-11 rounded-full bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
                <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.712 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#075e54] rounded-full" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-base sm:text-lg leading-tight text-white">
                    Crochet Wali
                  </h3>
                  <span className="text-[10px] font-semibold text-white/95 bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-xs">
                    Official
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-100/90 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  <span>Typically replies in &lt; 1 hour</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              aria-label="Close WhatsApp support menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Feature Actions List */}
          <div className="p-3.5 space-y-2.5 bg-[#faf9f6]">
            {actionItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-white rounded-2xl p-3 border shadow-xs transition-all flex items-center gap-3 group text-left cursor-pointer ${item.cardClass}`}
                >
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${item.iconWrapperClass}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <strong className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">
                        {item.title}
                      </strong>
                      <span className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${item.badgeClass}`}>
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5 leading-snug truncate">
                      {item.description}
                    </p>
                  </div>

                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${item.arrowClass}`}>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </a>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 bg-white border-t border-stone-100 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Verified Support</span>
            </div>
            <div className="text-stone-500 font-medium">
              Pan-India Delivery 🇮🇳
            </div>
          </div>
        </div>
      )}

      {/* Floating Action WhatsApp Button with Animated Cycling Message Pill */}
      <aside aria-label="WhatsApp Crochet Wali Support" className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 flex flex-col items-end pointer-events-none">
        {/* Animated Message Pill: Appear -> Wait -> Disappear -> Wait -> Next Message */}
        {!isOpen && (
          <div
            className={`mb-2 relative transition-all duration-500 ease-out transform ${isPillVisible
                ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
              }`}
          >
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="group relative flex items-center gap-2 bg-white/95 backdrop-blur-sm pl-2.5 pr-3.5 py-1.5 rounded-full border border-stone-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:shadow-md hover:border-emerald-500/70 transition-all active:scale-95 cursor-pointer"
              aria-label={`WhatsApp quick query: ${ROTATING_MESSAGES[currentMsgIndex]}`}
            >
              {/* Green Live Indicator Ping Dot */}
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>

              {/* Cycling Text */}
              <span className="text-xs font-bold text-stone-800 tracking-tight">
                {ROTATING_MESSAGES[currentMsgIndex]}
              </span>

              {/* Pointer Triangle pointing directly down to WhatsApp button */}
              <div
                className="absolute -bottom-1 right-3.5 md:right-4 w-2 h-2 bg-white border-r border-b border-stone-200/90 rotate-45"
                aria-hidden="true"
              />
            </button>
          </div>
        )}

        {/* Compact Circular WhatsApp Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close WhatsApp support" : "Open WhatsApp support with Crochet Wali"}
          className="pointer-events-auto flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#075e54] hover:bg-[#05463e] text-white shadow-[0_4px_16px_rgba(7,94,84,0.4)] hover:shadow-[0_6px_24px_rgba(7,94,84,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          {isOpen ? (
            <X className="w-5 h-5 md:w-5.5 md:h-5.5" />
          ) : (
            <svg
              className="w-5.5 h-5.5 md:w-6 md:h-6 fill-white drop-shadow-xs"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.712 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          )}
        </button>
      </aside>
    </>
  );
}
