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
        title: 'Handmade Embroidery Hoops India | Custom Embroidery Gifts',
        description: 'Shop handmade embroidery hoops, personalized embroidery hoops, floral embroidery hoops, and embroidery hoop art. Custom embroidery gifts and embroidery room decor in India.',
        h1: 'Handmade Embroidery Hoops',
        text: 'Discover the finest handmade embroidery hoops in India. Our custom embroidery hoop collection features personalized embroidery hoops with names, dates, and floral patterns. Each embroidery hoop gift is a piece of aesthetic embroidery art — perfect as embroidery room decor, embroidery wall decor, or an embroidery handmade gift. We offer floral embroidery hoops, embroidery name hoops, and embroidery decorative hoops for every occasion. Whether you need an embroidery anniversary gift, embroidery birthday gift, or embroidery wedding gift, our embroidery hoop art is handcrafted with premium quality threads and embroidery personalized decor that will impress.',
    },
    'occasion-gifts': {
        title: 'Handmade Gifts for Every Occasion India | Anniversary, Birthday & Wedding',
        description: 'Find the perfect gift for girlfriend india, anniversary gift india, birthday gift for girlfriend, and romantic handmade gifts. Valentine gifts handmade and wedding gifts handmade.',
        h1: 'Handmade Gifts for Every Occasion',
        text: 'Finding the perfect gift for girlfriend in India has never been easier. Our handmade collection features romantic handmade gifts, handmade anniversary gifts, handmade birthday gifts, and valentine gifts handmade — all crafted with love. Whether you need a surprise gift ideas india, cute gifts for couples, or a special gift for girlfriend, we offer unique gifts for girls that are truly one-of-a-kind. From anniversary bouquet gifts and romantic bouquet gifts to forever flower gifts and handmade wedding decor gifts, every product is designed to create lasting memories. Our gifts for best friend handmade and cute birthday gifts india make thoughtful presents for any celebration.',
    },
    'aesthetic-gifts': {
        title: 'Aesthetic Gifts India | Pinterest Aesthetic Handmade Products',
        description: 'Shop aesthetic gifts india, aesthetic handmade gifts, cute aesthetic gifts, pastel aesthetic gifts, minimalist handmade gifts, and korean aesthetic gifts. Pinterest aesthetic gifts and soft girl aesthetic gifts.',
        h1: 'Aesthetic Gifts & Handmade Products',
        text: 'Welcome to our curated collection of aesthetic gifts india. If you love pinterest aesthetic gifts, soft girl aesthetic gifts, korean aesthetic gifts, or pastel aesthetic gifts — you will love our collection. We offer aesthetic handmade gifts, cute aesthetic gifts, aesthetic bouquet gifts, and aesthetic crochet decor. Our aesthetic floral decor, aesthetic handmade accessories, and aesthetic room decor handmade are perfect for creating a cozy aesthetic decor vibe. Whether you are looking for minimalist handmade gifts, trendy aesthetic gifts, or aesthetic lifestyle gifts, our aesthetic handmade store has it all. Every product is an aesthetic custom gift designed for those who appreciate handmade art.',
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
        title: `${slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} | Embroidery By Sana`,
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
            // Very loose matching for categories to ensure collections populate
            const productSlug = slugify(product.category);
            const titleSlug = slugify(product.name);
            const isMatch = productSlug.includes(slug.split('-')[0]) || titleSlug.includes(slug.split('-')[0]);
            return isMatch;
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
                "item": "https://www.embroiderybysana.live/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Collections",
                "item": "https://www.embroiderybysana.live/categories"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": collectionData.h1,
                "item": `https://www.embroiderybysana.live/collections/${slug}`
            }
        ]
    };

    // CollectionPage Schema
    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": collectionData.h1,
        "description": collectionData.description,
        "url": `https://www.embroiderybysana.live/collections/${slug}`
    };

    return (
        <div className="bg-[#fdfbf7] min-h-screen pb-24 font-body selection:bg-rose-100 selection:text-rose-900">
            <SEO 
                title={collectionData.title} 
                description={collectionData.description} 
                schema={[breadcrumbSchema, collectionSchema]}
                url={`https://www.embroiderybysana.live/collections/${slug}`}
            />
            
            <div className="container-custom pt-24 md:pt-32">
                
                {/* Header */}
                <div className="mb-10 md:mb-16 text-center max-w-3xl mx-auto">
                    <h1 className="font-heading text-3xl md:text-5xl font-bold text-stone-900 mb-6">{collectionData.h1}</h1>
                    <p className="text-stone-600 text-sm md:text-base leading-relaxed">{collectionData.text}</p>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-14">
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
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-14 animate-fade-in">
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
            </div>
        </div>
    );
};

export default Collection;
