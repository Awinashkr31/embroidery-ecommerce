import React, { useEffect } from 'react';
import SEO from '../components/SEO';

const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const aboutSchema = [
        {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About Crochet Wali",
            "description": "Discover the story behind Sana's passion for Handmade Crochet Gifts and personalized crochet gifts.",
            "url": "https://www.embroiderybysana.live/about"
        },
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Crochet Wali",
            "url": "https://www.embroiderybysana.live",
            "logo": "https://www.embroiderybysana.live/logo.png",
            "founder": {
                "@type": "Person",
                "name": "Sana"
            },
            "sameAs": [
                "https://www.instagram.com/Crochet Wali",
                "https://www.pinterest.com/Crochet Wali"
            ],
            "contactPoint": {
                "@type": "ContactPoint",
                "email": "support@embroiderybysana.live",
                "contactType": "customer support"
            }
        },
        {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Sana",
            "jobTitle": "Lead Embroidery Artist & Founder",
            "worksFor": {
                "@type": "Organization",
                "name": "Crochet Wali"
            },
            "url": "https://www.embroiderybysana.live/about",
            "description": "Expert embroidery artist specializing in custom portrait hoops and handmade crochet bouquets in India."
        }
    ];

    return (
        <div className="bg-[#fdfbf7] min-h-screen pb-24 font-body selection:bg-rose-100 selection:text-rose-900">
            <SEO 
                title="About Us - The Handmade Journey"
                description="Learn about Sana, an expert embroidery artist in India creating custom embroidery hoops, personalized embroidery hoops, crochet bouquets, aesthetic handmade gifts, and Handmade Crochet Gifts decor."
                url="https://www.embroiderybysana.live/about"
                keywords="custom embroidery hoop, Handmade Crochet Gifts hoop, embroidery hoop gift, personalized embroidery hoop, aesthetic embroidery art, embroidery room decor, floral embroidery hoop, embroidery handmade gift, custom embroidery gifts, embroidery decor india, embroidery wall decor, embroidery name hoop, handmade gifts india, personalized gifts india, aesthetic handmade gifts"
                schema={aboutSchema}
            />
            
            <div className="container-custom pt-24 md:pt-32 max-w-4xl">
                <div className="mb-12 md:mb-20 text-center">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-stone-900 mb-6">Our Story</h1>
                    <p className="text-stone-600 text-lg leading-relaxed max-w-2xl mx-auto">
                        Every thread has a story. Every knot holds a memory. Welcome to Crochet Wali — your destination for custom embroidery hoops, handmade crochet bouquets, and personalized handmade gifts in India.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                        <img 
                            src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop" 
                            alt="Handmade Crochet Gifts hoop art process" 
                            className="w-full h-full object-cover aspect-square"
                        />
                    </div>
                    <div className="space-y-6 text-stone-700 leading-relaxed">
                        <h2 className="font-heading text-3xl font-bold text-stone-900">Meet Sana</h2>
                        <p>
                            What started as a quiet hobby quickly blossomed into a profound passion for preserving memories through the timeless art of embroidery. Today, Crochet Wali is a trusted handmade gifting brand in India.
                        </p>
                        <p>
                            I specialize in translating photographs, dates, and emotions into custom embroidery hoops and personalized embroidery hoops. From embroidery name hoops to floral embroidery hoops, each piece of embroidery hoop art is handcrafted with premium quality threads. Whether it's embroidery room decor, embroidery wall decor, or a custom embroidery gift for a loved one — every stitch tells a story.
                        </p>
                        <p>
                            Beyond traditional embroidery, my love for handcrafted aesthetics led me to explore the vibrant world of crochet. From everlasting crochet bouquets and forever flower bouquets to aesthetic crochet accessories, every piece is made with meticulous attention to detail right here in India.
                        </p>
                        <p className="mt-4 font-medium">
                            <strong>Connect With Us:</strong> We are based in New Delhi, India. You can follow our journey and view our latest designs on Instagram at <a href="https://instagram.com/Crochet Wali" className="text-rose-700 hover:underline">@Crochet Wali</a> and on Pinterest at <a href="https://pinterest.com/Crochet Wali" className="text-rose-700 hover:underline">@Crochet Wali</a>. For custom inquiries, email us directly at support@embroiderybysana.live.
                        </p>
                    </div>
                </div>

                {/* What We Offer Section */}
                <div className="mb-24">
                    <h2 className="font-heading text-3xl font-bold text-stone-900 text-center mb-12">What We Offer</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 text-center">
                            <h3 className="font-heading text-lg font-bold text-stone-900 mb-3">Custom Embroidery Hoops</h3>
                            <p className="text-stone-600 text-sm leading-relaxed">
                                Handmade Crochet Gifts hoops, personalized embroidery hoops, embroidery name hoops, floral embroidery hoops, and aesthetic embroidery art. Perfect as an embroidery anniversary gift, embroidery birthday gift, or embroidery wedding gift.
                            </p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 text-center">
                            <h3 className="font-heading text-lg font-bold text-stone-900 mb-3">Crochet Bouquets & Flowers</h3>
                            <p className="text-stone-600 text-sm leading-relaxed">
                                Handmade crochet bouquets, crochet rose bouquets, crochet tulip bouquets, crochet sunflower bouquets, and mini crochet bouquets. A luxury crochet bouquet is the perfect crochet bouquet gift for anniversary, birthday, or as a forever flower gift.
                            </p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 text-center">
                            <h3 className="font-heading text-lg font-bold text-stone-900 mb-3">Aesthetic Accessories</h3>
                            <p className="text-stone-600 text-sm leading-relaxed">
                                Crochet hair accessories, crochet claw clips, crochet flower clips, crochet bow clips, crochet scrunchies handmade, crochet keychain handmade, and cute crochet accessories. Trendy aesthetic handmade accessories for the modern woman.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Perfect For Section */}
                <div className="mb-24">
                    <h2 className="font-heading text-3xl font-bold text-stone-900 text-center mb-8">Perfect For Every Occasion</h2>
                    <p className="text-stone-600 text-center max-w-2xl mx-auto mb-12 text-sm leading-relaxed">
                        Looking for a gift for girlfriend in India? An anniversary gift or a birthday gift for girlfriend? Our personalized handmade gifts are perfect for Valentine's Day, weddings, birthdays, and surprise gifts. We create romantic handmade gifts, valentine gifts handmade, wedding gifts handmade, and cute gifts for couples.
                    </p>
                </div>

                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-stone-100 text-center">
                    <h3 className="font-heading text-2xl font-bold text-stone-900 mb-4">Why Handmade?</h3>
                    <p className="text-stone-600 max-w-2xl mx-auto mb-8">
                        In an era of mass production, handmade gifts carry a unique energy. They represent time, patience, and human connection. As a small business handmade gifts brand, we pour our heart into every product. When you gift a piece from Crochet Wali, you are gifting premium handmade gifts — a piece of aesthetic handmade art that was slowly and carefully brought to life just for you.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        <div>
                            <div className="text-3xl font-bold text-rose-900 mb-2">100%</div>
                            <div className="text-sm font-semibold tracking-wider text-stone-500 uppercase">Handmade</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-rose-900 mb-2">∞</div>
                            <div className="text-sm font-semibold tracking-wider text-stone-500 uppercase">Customizable</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-rose-900 mb-2">India</div>
                            <div className="text-sm font-semibold tracking-wider text-stone-500 uppercase">Made With Love</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
