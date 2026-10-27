import React, { useEffect } from 'react';
import SEO from '../components/SEO';
import customHoop from '../assets/custom_hoop.webp';

const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const aboutSchema = [
        {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About Crochet Wali",
            "description": "Discover the story behind Sana's artisanal journey creating handmade crochet bouquets, accessories, and custom embroidery hoops.",
            "url": "https://www.crochetwali.in/about"
        },
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Crochet Wali",
            "url": "https://www.crochetwali.in",
            "logo": "https://www.crochetwali.in/logo.png",
            "founder": {
                "@type": "Person",
                "name": "Sana"
            },
            "sameAs": [
                "https://www.instagram.com/crochetwali.in"
            ],
            "contactPoint": {
                "@type": "ContactPoint",
                "email": "support@crochetwali.in",
                "contactType": "customer support"
            }
        },
        {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Sana",
            "jobTitle": "Lead Artisan & Founder",
            "worksFor": {
                "@type": "Organization",
                "name": "Crochet Wali"
            },
            "url": "https://www.crochetwali.in/about",
            "description": "Artisan specializing in handmade crochet forever bouquets, floral accessories, and custom heirloom embroidery in India."
        }
    ];

    return (
        <div className="bg-[#fdfbf7] min-h-screen pb-24 font-body selection:bg-rose-100 selection:text-rose-900">
            <SEO 
                title="About Us – The Handmade Journey"
                description="Learn the story behind Crochet Wali, founded by Sana in New Delhi. We create timeless handcrafted crochet flowers, custom embroidery hoops, and heartfelt artisanal gifts."
                url="https://www.crochetwali.in/about"
                schema={aboutSchema}
            />
            
            <div className="container-custom pt-24 md:pt-32 max-w-4xl">
                <div className="mb-12 md:mb-20 text-center">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-stone-900 mb-6">Our Story</h1>
                    <p className="text-stone-600 text-lg leading-relaxed max-w-2xl mx-auto">
                        Every thread has a story. Every knot holds a memory. Welcome to Crochet Wali — your home for artisanal crochet flowers, custom keepsake hoops, and heartwarming handmade gifts in India.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
                    <div className="rounded-2xl overflow-hidden shadow-lg bg-stone-100">
                        {/* TODO: OWNER - Replace customHoop with a real studio/workshop photograph if preferred */}
                        <img 
                            src={customHoop} 
                            alt="Crochet Wali handmade hoop art craft" 
                            className="w-full h-full object-cover aspect-square"
                            loading="lazy"
                        />
                    </div>
                    <div className="space-y-6 text-stone-700 leading-relaxed">
                        <h2 className="font-heading text-3xl font-bold text-stone-900">Meet Sana</h2>
                        <p>
                            What started as a quiet hobby quickly blossomed into a profound passion for preserving memories through the timeless art of crochet and embroidery. Today, Crochet Wali is a cherished handmade gifting brand across India.
                        </p>
                        <p>
                            I specialize in translating photographs, dates, and emotions into custom heirloom embroidery hoops and floral art. Each piece is meticulously hand-stitched with premium-quality cotton threads on natural hoops, ensuring a meaningful keepsake that lasts for years.
                        </p>
                        <p>
                            Beyond traditional needlework, my love for handcrafted aesthetics led me to explore crochet. From everlasting flower bouquets and traditional festive gajras to aesthetic daily hair accessories, every piece is made with patient attention to detail right here in India.
                        </p>
                        <p className="mt-4 font-medium">
                            <strong>Connect With Us:</strong> We are based in New Delhi, India. Follow our journey on Instagram at <a href="https://www.instagram.com/crochetwali.in" target="_blank" rel="noopener noreferrer" className="text-rose-700 hover:underline">@crochetwali.in</a>. For bespoke orders and queries, write to us at <a href="mailto:support@crochetwali.in" className="text-rose-700 hover:underline">support@crochetwali.in</a>.
                        </p>
                    </div>
                </div>

                {/* What We Offer Section */}
                <div className="mb-24">
                    <h2 className="font-heading text-3xl font-bold text-stone-900 text-center mb-12">What We Offer</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 text-center">
                            <h3 className="font-heading text-lg font-bold text-stone-900 mb-3">Custom Keepsake Hoops</h3>
                            <p className="text-stone-600 text-sm leading-relaxed">
                                Bespoke portrait hoops, anniversary date stitching, and personalized name art made with fine cotton floss and natural wooden frames.
                            </p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 text-center">
                            <h3 className="font-heading text-lg font-bold text-stone-900 mb-3">Forever Crochet Bouquets</h3>
                            <p className="text-stone-600 text-sm leading-relaxed">
                                Sunflowers, tulips, roses, and daisies hand-crocheted from milk cotton yarn. A sustainable, non-wilting floral gift for anniversaries and birthdays.
                            </p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 text-center">
                            <h3 className="font-heading text-lg font-bold text-stone-900 mb-3">Artisanal Accessories</h3>
                            <p className="text-stone-600 text-sm leading-relaxed">
                                Traditional crochet gajras, floral claw clips, bow hair ties, and adorable amigurumi keychains crafted for everyday style.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Perfect For Section */}
                <div className="mb-24">
                    <h2 className="font-heading text-3xl font-bold text-stone-900 text-center mb-8">Crafted for Meaningful Moments</h2>
                    <p className="text-stone-600 text-center max-w-2xl mx-auto mb-12 text-sm leading-relaxed">
                        Whether celebrating an anniversary, birthday, Valentine's Day, wedding festivities, or simply sending a thoughtful surprise, our handmade pieces turn feelings into lasting keepsakes.
                    </p>
                </div>

                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-stone-100 text-center">
                    <h3 className="font-heading text-2xl font-bold text-stone-900 mb-4">Why Handmade?</h3>
                    <p className="text-stone-600 max-w-2xl mx-auto mb-8">
                        In an era of mass production, handmade gifts carry genuine warmth and human connection. Each creation represents hours of dedication, patience, and artisan care. When you choose Crochet Wali, you bring home art crafted with heart.
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
