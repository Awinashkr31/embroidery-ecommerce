import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, PackageSearch, Gift, Palette, Truck, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link, useLocation } from 'react-router-dom';

export default function ChatWidget() {
    const { currentUser } = useAuth();
    const { CHATBOT_ENABLED } = useCart();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [showBubble, setShowBubble] = useState(false);
    
    const [messages, setMessages] = useState(() => {
        const stored = sessionStorage.getItem('chat_messages');
        if (stored) {
            try { return JSON.parse(stored); } catch {}
        }
        return []; // We'll initialize it in useEffect
    });
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState('');
    const messagesEndRef = useRef(null);

    // Only show the chatbot on the Home page ('/')
    const shouldHide = location.pathname !== '/';

    // Check if bottom nav is visible
    const bottomNavHidden = ['/checkout', '/mehndi-booking'].includes(location.pathname) || location.pathname.startsWith('/product/');

    useEffect(() => {
        let storedId = localStorage.getItem('chat_session_id');
        if (!storedId) {
            storedId = Math.random().toString(36).substring(2, 15);
            localStorage.setItem('chat_session_id', storedId);
        }
        setSessionId(storedId);
    }, []);

    useEffect(() => {
        let name = "";
        if (currentUser) {
            name = currentUser.user_metadata?.first_name || 
                   currentUser.user_metadata?.full_name?.split(' ')[0] || 
                   currentUser.displayName?.split(' ')[0] || 
                   "";
        }
        
        const greeting = name 
            ? `👋 Hi ${name}!\nHow can I help you today?`
            : `👋 Hi!\nHow can I help you today?`;
            
        setMessages(prev => {
            if (prev.length === 0 || (prev.length === 1 && prev[0].sender === 'bot')) {
                 return [{ sender: 'bot', text: greeting }];
            }
            return prev;
        });
    }, [currentUser]);

    useEffect(() => {
        if (messagesEndRef.current && isOpen) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
        sessionStorage.setItem('chat_messages', JSON.stringify(messages));
    }, [messages, isOpen]);

    // Auto-open Bubble Logic
    useEffect(() => {
        if (shouldHide || !CHATBOT_ENABLED) return;

        let bubbleTimer;
        let hasShownBubble = sessionStorage.getItem('chat_bubble_shown') === 'true';

        const showIt = () => {
            if (!hasShownBubble && !isOpen) {
                setShowBubble(true);
                sessionStorage.setItem('chat_bubble_shown', 'true');
                hasShownBubble = true;
            }
        };

        // 1. Timer (15 seconds)
        if (!hasShownBubble) {
            bubbleTimer = setTimeout(() => {
                showIt();
            }, 15000);
        }

        // 2. Scroll (40%)
        const handleScroll = () => {
            if (hasShownBubble) return;
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            if (scrollPercent > 40) {
                showIt();
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            clearTimeout(bubbleTimer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [shouldHide, CHATBOT_ENABLED, isOpen]);

    const submitMessage = async (msgText) => {
        if (!msgText.trim() || isLoading) return;

        const userMsg = msgText.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        setIsLoading(true);
        setShowBubble(false); // Hide tooltip if active

        try {
            const apiUrl = import.meta.env.VITE_ML_API_URL || 'https://embroidery-ml-api.onrender.com';
            const res = await fetch(`${apiUrl}/api/chat/${sessionId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg })
            });
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Server offline");
            }
            
            const data = await res.json();
            setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'bot', text: `Sorry, I encountered an error: ${error.message}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        await submitMessage(input);
    };

    const quickReplies = [
        { text: "Track Order", icon: <PackageSearch className="w-3.5 h-3.5 text-stone-500" /> },
        { text: "Find Gift", icon: <Gift className="w-3.5 h-3.5 text-rose-500" /> },
        { text: "Custom Embroidery", icon: <Palette className="w-3.5 h-3.5 text-fuchsia-500" /> },
        { text: "Delivery Check", icon: <Truck className="w-3.5 h-3.5 text-blue-500" /> },
        { text: "WhatsApp Support", icon: <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />, isLink: true, url: "https://wa.me/1234567890" }
    ];

    const renderMessage = (text) => {
        if (!text) return null;
        const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
        return parts.map((part, i) => {
            const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
            if (match) {
                const label = match[1];
                const url = match[2];
                if (url.startsWith('http')) {
                    return <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-[#A0004F] hover:text-rose-800 underline font-medium cursor-pointer transition-colors">{label}</a>;
                }
                return (
                    <Link key={i} to={url} onClick={() => setIsOpen(false)} className="text-[#A0004F] hover:text-rose-800 underline font-medium cursor-pointer transition-colors">
                        {label}
                    </Link>
                );
            }
            return <span key={i}>{part}</span>;
        });
    };

    // Don't render on hidden routes or if disabled by admin
    if (shouldHide || !CHATBOT_ENABLED) return null;

    return (
        <>
            {/* Background Blur Overlay (Mobile only) */}
            <div 
                className={`fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-[55] md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Chat Window */}
            <div 
                className={`chatbot-container fixed bottom-0 left-0 right-0 md:inset-auto md:bottom-24 md:right-6 z-[60] flex flex-col md:w-[380px] h-[75vh] md:h-[500px] md:max-h-[80vh] bg-white rounded-t-[20px] md:rounded-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] overflow-hidden border-0 md:border md:border-stone-100 ${isOpen ? 'chatbot-open' : 'chatbot-close'}`}
            >
                {/* Header */}
                <div className="bg-[#A0004F] text-white p-4 flex items-center justify-between shadow-sm flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className="font-heading font-semibold text-lg leading-tight">Embroidery Assistant</h3>
                            <p className="text-rose-200 text-xs text-left">Typically replies instantly</p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="hover:bg-rose-800/80 p-1.5 rounded-full transition-colors active:scale-95">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-4 overflow-y-auto bg-[#FDFBF7] space-y-5">
                    {messages.map((msg, i) => (
                        <div 
                            key={i}
                            className={`flex animate-fade-in ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm border ${msg.sender === 'user' ? 'bg-[#A0004F] text-white rounded-br-sm border-transparent' : 'bg-white border-stone-100 text-stone-800 rounded-bl-sm'}`}>
                                <p className="text-sm break-words whitespace-pre-wrap leading-relaxed">{renderMessage(msg.text)}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start animate-fade-in">
                            <div className="bg-white border border-stone-100 rounded-2xl rounded-bl-sm px-4 py-3.5 shadow-sm flex gap-1.5 items-center">
                                <div className="w-1.5 h-1.5 bg-rose-400 rounded-full typing-dot"></div>
                                <div className="w-1.5 h-1.5 bg-rose-400 rounded-full typing-dot"></div>
                                <div className="w-1.5 h-1.5 bg-rose-400 rounded-full typing-dot"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area Group */}
                <div className="bg-white border-t border-stone-100 flex flex-col flex-shrink-0" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                    {/* Quick Replies */}
                    <div className="px-3 pt-3 pb-1 flex gap-2 overflow-x-auto no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                        {quickReplies.map((chip, idx) => (
                            chip.isLink ? (
                                <a 
                                    key={idx}
                                    href={chip.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="whitespace-nowrap flex items-center gap-1.5 text-xs font-medium bg-stone-50 text-stone-700 border border-stone-200 shadow-sm px-3.5 py-1.5 rounded-full hover:bg-stone-100 active:scale-95 transition-all"
                                >
                                    {chip.icon}
                                    {chip.text}
                                </a>
                            ) : (
                                <button 
                                    key={idx}
                                    onClick={() => submitMessage(chip.text)}
                                    disabled={isLoading}
                                    className="whitespace-nowrap flex items-center gap-1.5 text-xs font-medium bg-rose-50/50 text-[#A0004F] border border-rose-100 shadow-sm px-3.5 py-1.5 rounded-full hover:bg-rose-50 hover:border-rose-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {chip.icon}
                                    {chip.text}
                                </button>
                            )
                        ))}
                    </div>

                    {/* Text Input */}
                    <form onSubmit={handleSend} className="p-3 flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-full text-sm focus:outline-none focus:border-[#A0004F] focus:ring-1 focus:ring-[#A0004F] transition-all"
                        />
                        <button 
                            type="submit" 
                            disabled={!input.trim() || isLoading}
                            className="bg-[#A0004F] text-white p-2.5 rounded-full hover:bg-rose-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>

            {/* Toggle Button — positioned above bottom nav on mobile */}
            <div className={`fixed right-4 z-50 transition-all duration-300 ${bottomNavHidden ? 'bottom-4' : 'bottom-[75px]'}`}>
                {/* Auto-open Bubble Tooltip */}
                {showBubble && !isOpen && (
                    <div className="absolute bottom-[70px] right-0 animate-fade-up">
                        <div className="bg-white text-stone-800 text-sm font-medium px-4 py-2.5 rounded-2xl rounded-br-sm shadow-lg border border-stone-100 whitespace-nowrap flex items-center gap-2">
                            Need help finding products?
                            <button onClick={(e) => { e.stopPropagation(); setShowBubble(false); }} className="p-0.5 text-stone-400 hover:text-stone-600 rounded-full">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                )}
                
                <button 
                    onClick={() => { setIsOpen(!isOpen); setShowBubble(false); }}
                    className={`w-[56px] h-[56px] bg-[#A0004F] text-white flex items-center justify-center rounded-full shadow-[0_4px_12px_rgba(160,0,79,0.4)] hover:shadow-[0_6px_16px_rgba(160,0,79,0.5)] transition-all active:scale-95 ${!isOpen && !showBubble ? 'animate-pulse' : ''}`}
                    title={isOpen ? "Close chat" : "Chat with us"}
                >
                    {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
                </button>
            </div>
        </>
    );
}
