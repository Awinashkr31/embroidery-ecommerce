import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, PackageSearch, ShoppingBag, RefreshCcw, Sparkles, Gift, Palette } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

export default function ChatWidget() {
    const { currentUser } = useAuth();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(() => {
        return sessionStorage.getItem('chat_is_open') === 'true';
    });
    const [messages, setMessages] = useState(() => {
        const stored = sessionStorage.getItem('chat_messages');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch(e) {}
        }
        return [{ sender: 'bot', text: 'Hi! I am the Embroidery By Sana AI assistant. How can I help you today?' }];
    });
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState('');
    const messagesEndRef = useRef(null);

    // Pages where chatbot should NOT appear
    const hiddenRoutes = ['/checkout', '/login', '/register', '/forgot-password', '/reset-password', '/order-confirmation', '/order-success', '/order-failed'];
    const shouldHide = hiddenRoutes.some(route => location.pathname === route) || location.pathname.startsWith('/sadmin');

    // Check if bottom nav is visible (it hides on checkout, product pages, mehndi-booking, and full cart)
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
            ? `Hi ${name}! I am the Sana AI assistant. How can I help you today?`
            : `Hi! I am the Sana AI assistant. How can I help you today?`;
            
        setMessages(prev => {
            if (prev.length === 1 && prev[0].sender === 'bot') {
                 return [{ sender: 'bot', text: greeting }];
            }
            return prev;
        });
    }, [currentUser]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
        sessionStorage.setItem('chat_messages', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        sessionStorage.setItem('chat_is_open', isOpen);
    }, [isOpen]);

    const submitMessage = async (msgText) => {
        if (!msgText.trim() || isLoading) return;

        const userMsg = msgText.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        setIsLoading(true);

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
        { text: "Book Mehndi design", icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" /> },
        { text: "Custom embroidery", icon: <Palette className="w-3.5 h-3.5 text-fuchsia-500" /> },
        { text: "Need gift ideas", icon: <Gift className="w-3.5 h-3.5 text-rose-500" /> },
        { text: "Track my order", icon: <PackageSearch className="w-3.5 h-3.5 text-stone-500" /> }
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
                    return <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:text-rose-800 underline font-medium cursor-pointer transition-colors">{label}</a>;
                }
                return (
                    <Link key={i} to={url} onClick={() => setIsOpen(false)} className="text-rose-600 hover:text-rose-800 underline font-medium cursor-pointer transition-colors">
                        {label}
                    </Link>
                );
            }
            return <span key={i}>{part}</span>;
        });
    };

    // Don't render on hidden routes
    if (shouldHide) return null;

    return (
        <>
            {/* Chat Window - fullscreen on mobile, floating on desktop */}
            {isOpen && (
                <div className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 z-[60] md:z-50 flex flex-col md:block">
                    <div className="bg-white w-full h-full md:w-[400px] md:h-[500px] md:max-h-[80vh] md:rounded-2xl shadow-2xl flex flex-col md:mb-4 border-0 md:border md:border-stone-200 overflow-hidden">
                        {/* Header */}
                        <div className="bg-rose-900 text-white p-4 flex items-center justify-between shadow-sm flex-shrink-0">
                            <div>
                                <h3 className="font-heading font-semibold text-lg">Sana Assistant</h3>
                                <p className="text-rose-200 text-xs text-left">Always online</p>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-rose-800 p-1 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Body */}
                        <div className="flex-1 p-4 overflow-y-auto bg-stone-50 space-y-4">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.sender === 'user' ? 'bg-stone-900 text-white rounded-br-none' : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-sm'}`}>
                                        <p className="text-sm break-words whitespace-pre-wrap leading-relaxed">{renderMessage(msg.text)}</p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-none px-4 py-2 shadow-sm flex gap-2 items-center">
                                        <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce [animation-delay:-.1s]"></div>
                                        <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce [animation-delay:-.2s]"></div>
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
                                    <button 
                                        key={idx}
                                        onClick={() => submitMessage(chip.text)}
                                        disabled={isLoading}
                                        className="whitespace-nowrap flex items-center gap-1.5 text-xs font-medium bg-rose-50/50 text-rose-800 border border-rose-200 shadow-sm px-3.5 py-1.5 rounded-full hover:bg-rose-100 hover:border-rose-300 transform hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ease-out disabled:opacity-50 disabled:hover:transform-none disabled:cursor-not-allowed active:scale-95"
                                    >
                                        {chip.icon}
                                        {chip.text}
                                    </button>
                                ))}
                            </div>

                            {/* Text Input */}
                            <form onSubmit={handleSend} className="p-3 flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-stone-100 border border-stone-200 px-4 py-2.5 rounded-full text-sm focus:outline-none focus:border-rose-300"
                                />
                                <button 
                                    type="submit" 
                                    disabled={!input.trim() || isLoading}
                                    className="bg-rose-900 text-white p-2.5 rounded-full hover:bg-rose-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button — positioned above bottom nav on mobile */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className={`fixed right-4 z-50 bg-rose-900 text-white p-3.5 md:p-4 flex items-center justify-center rounded-full shadow-lg hover:bg-rose-800 hover:-translate-y-1 transition-all hover:shadow-xl group ${
                        bottomNavHidden ? 'bottom-4' : 'bottom-20 md:bottom-6'
                    }`}
                >
                    <MessageSquare className="w-5 h-5 md:w-6 md:h-6 group-hover:animate-pulse" />
                </button>
            )}
        </>
    );
}
