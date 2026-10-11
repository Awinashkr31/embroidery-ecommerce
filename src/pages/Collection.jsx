import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';
import SEO from '../components/SEO';
import { Sparkles, ChevronDown } from 'lucide-react';
import { getProductUrl } from '../utils/urlUtils';

const slugify = (str) => (str || '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const COLLECTION_SEO_CONTENT = {
    'crochet-bouquets': {
        title: 'Handmade Crochet Bouquet India | Aesthetic Gifts',
        description: 'Explore our premium collection of handmade crochet bouquets. Perfect for aesthetic gifting, anniversaries, and personalized presents. Shop everlasting forever flower bouquets in India.',
        h1: 'Handmade Crochet Bouquets',
        text: 'Welcome to our exclusive collection of handmade crochet bouquets. Every piece is meticulously crafted by skilled artisans in India, ensuring that your floral gift lasts forever. Our aesthetic crochet flowers are perfect for anniversaries, birthdays, or simply as an aesthetic home decor piece. Unlike real flowers that wither in a few days, a forever flower bouquet retains its charm and vibrant colors for a lifetime. Choose from a variety of styles, from delicate single roses to grand mixed floral arrangements. Whether you are looking for a unique crochet bouquet for girlfriend or a personalized present for a best friend, our handmade flower bouquets offer an emotional and everlasting gifting experience.',
    },
    'custom-embroidery-hoops': {
        title: 'Custom Embroidery Hoops | Personalized Handmade Gifts India',
        description: 'Order custom embroidery hoops for weddings, anniversaries, and baby announcements. 100% aesthetic handmade gifts in India with premium quality threads and aesthetic designs.',
        h1: 'Custom Embroidery Hoops',
        text: 'Discover the art of personalized gifting with our custom embroidery hoops. Handcrafted in India, these delicate pieces of art capture your most cherished memories in thread and fabric. Perfect for a handmade anniversary gift, romantic handmade gifts, baby announcements, or aesthetic room decor handmade, our embroidery hoops are designed to wow. We use premium cotton threads, high-quality wooden hoops, and aesthetic floral patterns to bring your ideas to life. You can customize the names, dates, quotes, and color palettes to perfectly match the occasion. A custom embroidery hoop is not just a gift; it is a personalized aesthetic gift that holds emotional value for years to come.',
    },
    'handmade-gifts': {
        title: 'Handmade Gifts India | Aesthetic & Personalized Gifting',
        description: 'Shop the best handmade gifts in India. From custom embroidery to aesthetic crochet accessories, find the perfect personalized handmade gifts for any occasion.',
        h1: 'Handmade Gifts for Every Occasion',
        text: 'In a world of mass-produced items, handmade gifts stand out for their thought, effort, and uniqueness. Our collection of handmade gifts in India is curated for those who appreciate art and aesthetic lifestyle products. Whether you are looking for a handmade birthday gift, an anniversary present, or a special token of appreciation, our handcrafted collection has something for everyone. From beautifully embroidered hoops and cute handmade accessories to vibrant crochet bouquets, every item is crafted with love and precision. Gifting custom handmade gifts shows that you care enough to choose something truly unique and meaningful.',
    },
    'personalized-gifts': {
        title: 'Personalized Gifts India | Custom Handmade Art & Accessories',
        description: 'Create unforgettable moments with our personalized gifts. Handcrafted embroidery, personalized bouquet gifts, and custom aesthetic gifts available online in India.',
        h1: 'Personalized Gifts & Custom Art',
        text: 'Make your loved ones feel truly special with our range of personalized gifts. We believe that the best gifts are those that tell a story. Our personalized handmade gifts in India allow you to add custom names, special dates, and meaningful quotes to our premium embroidery and crochet products. Ideal for weddings, anniversaries, baby showers, and birthdays, our custom gifts are designed to leave a lasting impression. Every personalized item is handcrafted with meticulous attention to detail, ensuring a high-quality finish that makes for the perfect custom gift india.',
    },
    'crochet-accessories': {
        title: 'Aesthetic Crochet Accessories | Handmade Fashion India',
        description: 'Elevate your style with our aesthetic handmade crochet accessories. Shop crochet bags, hair clips, and fashion accessories made in India.',
        h1: 'Aesthetic Crochet Accessories',
        text: 'Add a touch of handmade elegance to your everyday style with our crochet accessories india. Handcrafted with precision, our collection features beautifully designed crochet hair accessories, aesthetic crochet decor, and delicate fashion items. Crochet fashion is making a massive comeback, and our products blend traditional craftsmanship with cute aesthetic gifts. Whether you are dressing up for a casual day out or looking for a unique accessory to complete your outfit, our cute handmade accessories are the perfect choice. Made with premium yarns and intricate patterns, they are durable, stylish, and eco-friendly.',
    },
    'embroidery-hoops': {
        title: 'Handmade Crochet Gifts Hoops India | Custom Embroidery Gifts',
        description: 'Shop Handmade Crochet Gifts hoops, personalized embroidery hoops, floral embroidery hoops, and embroidery hoop art. Custom embroidery gifts and embroidery room decor in India.',
        h1: 'Handmade Crochet Gifts Hoops',
        text: 'Discover the finest Handmade Crochet Gifts hoops in India. Our custom embroidery hoop collection features personalized embroidery hoops with names, dates, and floral patterns. Each embroidery hoop gift is a piece of aesthetic embroidery art — perfect as embroidery room decor, embroidery wall decor, or an embroidery handmade gift. We offer floral embroidery hoops, embroidery name hoops, and embroidery decorative hoops for every occasion. Whether you need an embroidery anniversary gift, embroidery birthday gift, or embroidery wedding gift, our embroidery hoop art is handcrafted with premium quality threads and embroidery personalized decor that will impress.',
    },
    'crochet-gifts': {
        title: 'Crochet Gifts India | Unique Handmade Gifts | Crochet Wali',
        description: 'Explore our curated collection of unique crochet gifts. Handmade in India, perfect for anniversaries, birthdays, and customized aesthetic gifts.',
        h1: 'Handmade Crochet Gifts',
        text: 'Welcome to our exclusive collection of handmade crochet gifts. Every piece is carefully handcrafted by artisans in India using premium yarns. Whether you are looking for a unique crochet gift for your girlfriend, personalized handmade gifts, or budget-friendly crochet gifts under ₹500, we have something special for every occasion. Unlike mass-produced items, our crochet gifts offer a personal touch that lasts forever. From aesthetic custom pieces to ready-to-ship handmade treasures, discover the perfect crochet gift today.',
    },
    'crochet-flowers': {
        title: 'Handmade Crochet Flowers & Bouquets India | Crochet Wali',
        description: 'Shop beautiful handmade crochet flowers and forever flower bouquets. Made to order in India. The perfect sustainable gift that never wilts.',
        h1: 'Handmade Crochet Flowers',
        text: 'Discover the beauty of forever flowers with our handmade crochet flower collection. Handcrafted in India, our crochet flowers are the perfect sustainable alternative to fresh bouquets. They never wilt, require zero maintenance, and serve as a beautiful keepsake for years to come. Whether you are looking for a classic crochet rose bouquet, a bright sunflower pot, or a mixed aesthetic floral arrangement, our crochet flowers are designed to impress. Ideal for Valentine\'s Day, anniversaries, or as an aesthetic room decor addition.',
    },
    'crochet-gajra': {
        title: 'Handmade Crochet Gajra India | Reusable Floral Hair Accessory',
        description: 'Shop reusable handmade crochet gajra for weddings, Haldi, Mehendi, and festive hairstyles. Never turns brown, scent-sprayable, and lasts forever.',
        h1: 'Handmade Crochet Gajra',
        text: 'Elevate your festive and bridal ethnic look with our handcrafted crochet gajra. Real jasmine flowers turn brown within hours, but our crocheted floral gajras retain their pristine beauty forever. Spray your favorite attar or perfume onto the yarn fibers for a fragrant touch that lasts all day. Ideal for bun styling, braid accents, Haldi ceremonies, and wedding guests. Hand-crocheted in India with premium yarn.',
    },
    'reusable-bridal-gajra': {
        title: 'Reusable Bridal Gajra for Haldi, Mehendi & Wedding | Crochet Wali',
        description: 'Stunning reusable crochet gajras designed for brides and bridesmaids. Perfect keepsake hair jewelry for Haldi ceremonies, sangeet, and traditional festivities.',
        h1: 'Reusable Bridal Gajra',
        text: 'Make your wedding memories timeless with Crochet Wali’s reusable bridal gajra collection. Designed specifically for Indian brides, bridesmaids, and festive dancers, each gajra is crafted to stay lightweight and secure without wilting or shedding petals. Reusable across every wedding ritual from Mehendi to Reception.',
    },
    'crochet-keychains': {
        title: 'Cute Crochet Keychains & Amigurumi Charms India | Crochet Wali',
        description: 'Shop handmade crochet keychains and cute amigurumi bag charms in India. The perfect budget-friendly cute surprise gift for friends, sisters, and bags.',
        h1: 'Handmade Crochet Keychains & Bag Charms',
        text: 'Discover our delightful collection of handmade crochet keychains and amigurumi bag charms. Each piece is hand-stitched with durable yarn and sturdy metal key rings. Perfect as a cute, thoughtful gift for besties, college bags, car keys, or birthday surprise hampers.',
    },
    'crochet-claw-clips': {
        title: 'Handmade Crochet Claw Clips & Hair Clips India | Crochet Wali',
        description: 'Shop aesthetic handmade crochet claw clips, floral hair pins, and aesthetic hair accessories in India. Snag-free, durable, and handcrafted with soft yarn.',
        h1: 'Handmade Crochet Claw Clips & Hair Accessories',
        text: 'Level up your daily hair styling with Crochet Wali’s handcrafted crochet claw clips and floral hair pins. Built on durable, salon-grade hair clips and wrapped in soft, botanical-toned crochet flowers, our hair accessories offer a firm yet snag-free hold for everyday comfort.',
    },
    'crochet-parandi': {
        title: 'Handmade Crochet Parandi for Hair Braids India | Crochet Wali',
        description: 'Traditional handcrafted crochet parandi with floral tassels. Perfect for Punjabi braid styling, bridal Haldi, festive dance, and weddings in India.',
        h1: 'Handmade Crochet Parandi',
        text: 'Celebrate traditional Indian hair elegance with our handmade crochet parandi. Featuring intricate floral tassels and vibrant colored cords, these parandis add instant drama and charm to any long braid or festive hair style.',
    },
    'gifts-for-girlfriend': {
        title: 'Handmade Gifts for Girlfriend | Romantic Crochet Keepsakes India',
        description: 'Find thoughtful, unique handmade gifts for your girlfriend in India. Forever crochet bouquets, aesthetic hair accessories, and personalized gift boxes.',
        h1: 'Romantic Handmade Gifts for Girlfriend',
        text: 'Show her how much you care with a gift that never fades. Fresh roses wilt in three days, but a handmade crochet flower bouquet from Crochet Wali stays as vibrant as your love. Browse our romantic curated picks including everlasting roses, cute amigurumi charms, and personalized handwritten cards.',
    },
    'anniversary-gifts': {
        title: 'Handmade Anniversary Gifts India | Everlasting Romantic Keepsakes',
        description: 'Celebrate love with handcrafted crochet anniversary gifts in India. Forever flower pots, customized initial hoops, and luxury keepsake gift boxes.',
        h1: 'Handmade Anniversary Keepsakes',
        text: 'Mark your special milestone with an anniversary gift that stands the test of time. Our handmade anniversary keepsakes symbolize lasting love — from forever crochet tulip pots to personalized gift boxes packaged with love in India.',
    }
};

const Collection = () => {
    const { slug } = useParams();
    const { products, fetchProducts, loading } = useProducts();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;

    useEffect(() => {
        fetchProducts();
        window.scrollTo(0, 0);
    }, [fetchProducts, slug]);

    const collectionData = COLLECTION_SEO_CONTENT[slug] || {
        title: `${slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} | Crochet Wali`,
        description: `Explore our beautiful collection of ${slug.replace('-', ' ')}. Handmade in India with love.`,
        h1: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        text: `Welcome to our ${slug.replace('-', ' ')} collection. We offer a wide range of premium handmade products tailored just for you. Explore our collection and find the perfect piece that resonates with your aesthetic.`
    };

    const allFilteredProducts = useMemo(() => {
        let flattened = [];
        products.forEach(prod => {
            const validVariants = prod.variants?.filter(v => v.color && v.images && v.images.length > 0) || [];
            if (validVariants.length > 0) {
                validVariants.forEach(v => {
                    flattened.push({
                        ...prod,
                        uniqueId: `${prod.id}-${slugify(v.color)}`,
                        preselectedVariant: v,
                        price: v.price ? Number(v.price) : prod.price,
                    });
                });
            } else {
                flattened.push({
                    ...prod,
                    uniqueId: prod.id,
                    preselectedVariant: null,
                });
            }
        });

        return flattened.filter(product => {
            const productSlug = slugify(product.category);
            const titleSlug = slugify(product.name);
            const keywords = slug.split('-');

            // Recipient & Occasion special matching
            if (slug === 'gifts-for-girlfriend' || slug === 'anniversary-gifts') {
                return titleSlug.includes('bouquet') || titleSlug.includes('rose') || titleSlug.includes('flower') || titleSlug.includes('pot') || productSlug.includes('bouquet') || productSlug.includes('flower');
            }
            if (slug === 'reusable-bridal-gajra') {
                return titleSlug.includes('gajra') || productSlug.includes('gajra') || titleSlug.includes('parandi');
            }

            // Keyword specific filter (e.g. gajra, parandi, clip, keychain, bouquet, sunflower, rose)
            const targetKeywords = keywords.filter(k => k !== 'crochet' && k !== 'handmade' && k !== 'gifts' && k !== 'custom');
            if (targetKeywords.length > 0) {
                return targetKeywords.some(k => productSlug.includes(k) || titleSlug.includes(k));
            }
            return productSlug.includes(keywords[0]) || titleSlug.includes(keywords[0]);
        });
    }, [products, slug]);

    const totalPages = Math.ceil(allFilteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = allFilteredProducts.slice(0, currentPage * ITEMS_PER_PAGE);

    // Breadcrumb Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.crochetwali.in/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Collections",
                "item": "https://www.crochetwali.in/categories"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": collectionData.h1,
                "item": `https://www.crochetwali.in/collections/${slug}`
            }
        ]
    };

    // CollectionPage Schema
    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": collectionData.h1,
        "description": collectionData.description,
        "url": `https://www.crochetwali.in/collections/${slug}`
    };

    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": allFilteredProducts.map((p, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `https://www.crochetwali.in${getProductUrl(p)}`
        }))
    };

    return (
        <div className="bg-[#fdfbf7] min-h-screen pb-24 font-body selection:bg-rose-100 selection:text-rose-900">
            <SEO 
                title={collectionData.title} 
                description={collectionData.description} 
                schema={[breadcrumbSchema, collectionSchema, itemListSchema]}
                url={`https://www.crochetwali.in/collections/${slug}`}
            />
            
            <div className="container-custom pt-24 md:pt-32">
                
                {/* Header */}
                <div className="mb-10 md:mb-16 text-center max-w-3xl mx-auto">
                    <h1 className="font-heading text-3xl md:text-5xl font-bold text-stone-900 mb-6">{collectionData.h1}</h1>
                    <p className="text-stone-600 text-sm md:text-base leading-relaxed">{collectionData.text}</p>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 4xl:grid-cols-7 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-14 xl:gap-x-10 xl:gap-y-16 3xl:gap-x-12 3xl:gap-y-20">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[2/3] md:aspect-[4/5] bg-stone-200 rounded-2xl mb-4" />
                                <div className="h-4 bg-stone-200 rounded w-3/4 mb-2" />
                                <div className="h-4 bg-stone-200 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : allFilteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <Sparkles className="w-8 h-8 text-stone-300 mx-auto mb-4" />
                        <h3 className="text-2xl font-heading text-stone-900 mb-2">No products found in this collection</h3>
                        <Link to="/shop" className="text-rose-900 underline underline-offset-4 hover:text-rose-700 text-sm font-medium">
                            Browse all products
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 4xl:grid-cols-7 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-14 xl:gap-x-10 xl:gap-y-16 3xl:gap-x-12 3xl:gap-y-20 animate-fade-in">
                            {paginatedProducts.map((product) => (
                                <div key={product.uniqueId} className="animate-fade-up">
                                    <Link 
                                        to={`${getProductUrl(product)}${product.preselectedVariant ? `?color=${encodeURIComponent(product.preselectedVariant.color)}` : ''}`}
                                        className="group block"
                                    >
                                        <ProductCard product={product} toggleWishlist={toggleWishlist} isInWishlist={isInWishlist} />
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {/* Load More */}
                        {currentPage < totalPages && (
                            <div className="flex justify-center mt-12 mb-8">
                                <button 
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    className="w-full max-w-xs py-3 rounded-xl bg-stone-900 text-white font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-stone-800"
                                >
                                    View More
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Collection Buyer's Guide & Craft Notes for SEO & E-E-A-T */}
                <div className="mt-16 md:mt-24 pt-12 border-t border-stone-200 max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl p-6 md:p-10 border border-stone-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 text-rose-800 text-xs font-bold uppercase tracking-widest">
                            <Sparkles className="w-4 h-4" /> Buyer's Guide &amp; Craft Notes
                        </div>
                        <h2 className="text-xl md:text-2xl font-heading font-bold text-stone-900">
                            Everything You Need to Know About Our {collectionData.h1}
                        </h2>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-stone-600 leading-relaxed pt-2">
                            <div className="space-y-1.5 bg-stone-50/70 p-4 rounded-2xl border border-stone-100">
                                <h3 className="font-bold text-stone-900 text-sm">✨ 100% Handcrafted Artisanal Quality</h3>
                                <p className="text-xs">
                                    Every item in this collection is individually hand-knitted by skilled artisans using premium botanical-dyed milk cotton yarn. Zero plastic mass-production.
                                </p>
                            </div>
                            <div className="space-y-1.5 bg-stone-50/70 p-4 rounded-2xl border border-stone-100">
                                <h3 className="font-bold text-stone-900 text-sm">🚚 Pan-India Express Delivery</h3>
                                <p className="text-xs">
                                    Dispatched with protective aesthetic gift packing in 1-3 business days. Arrives safely in 4-7 days via premium couriers with live tracking.
                                </p>
                            </div>
                            <div className="space-y-1.5 bg-stone-50/70 p-4 rounded-2xl border border-stone-100">
                                <h3 className="font-bold text-stone-900 text-sm">💌 Complimentary Gift Note Card</h3>
                                <p className="text-xs">
                                    Ordering as a surprise gift? We include a handwritten personal note card with your custom message and luxury ribbon wrapping at checkout.
                                </p>
                            </div>
                            <div className="space-y-1.5 bg-stone-50/70 p-4 rounded-2xl border border-stone-100">
                                <h3 className="font-bold text-stone-900 text-sm">🌸 Zero Wilting &amp; Easy Care</h3>
                                <p className="text-xs">
                                    Never wilts or needs water. Simply dust with a cool hairdryer or soft powder brush every few weeks to keep yarn colors fresh for years.
                                </p>
                            </div>
                        </div>

                        {/* Internal cross-links */}
                        <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs">
                            <span className="text-stone-400 font-medium py-1">Related collections:</span>
                            <Link to="/collections/crochet-bouquets" className="px-3 py-1 bg-stone-100 hover:bg-rose-50 hover:text-rose-900 rounded-full text-stone-700 transition-colors">Crochet Bouquets</Link>
                            <Link to="/collections/reusable-bridal-gajra" className="px-3 py-1 bg-stone-100 hover:bg-rose-50 hover:text-rose-900 rounded-full text-stone-700 transition-colors">Bridal Gajra</Link>
                            <Link to="/collections/gifts-under-500" className="px-3 py-1 bg-stone-100 hover:bg-rose-50 hover:text-rose-900 rounded-full text-stone-700 transition-colors">Gifts Under ₹500</Link>
                            <Link to="/collections/gifts-for-girlfriend" className="px-3 py-1 bg-stone-100 hover:bg-rose-50 hover:text-rose-900 rounded-full text-stone-700 transition-colors">Gifts for Her</Link>
                            <Link to="/custom-design" className="px-3 py-1 bg-stone-100 hover:bg-rose-50 hover:text-rose-900 rounded-full text-stone-700 transition-colors">Custom Orders</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Collection;
