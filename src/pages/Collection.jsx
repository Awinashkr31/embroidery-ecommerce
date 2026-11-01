import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';
import SEO from '../components/SEO';
import { Sparkles, ChevronDown } from 'lucide-react';
import { getProductUrl } from '../utils/urlUtils';
import { isDuplicateProduct } from '../utils/productSanitizer';

const slugify = (str) => (str || '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const COLLECTION_SEO_CONTENT = {
    'crochet-bouquets': {
        title: 'Buy Crochet Bouquet Online India | Crochet Wali',
        description: 'Buy crochet bouquet online India with honest crochet bouquet price options from ₹99. Everlasting handmade flower bouquets delivered across India.',
        h1: 'Buy Crochet Bouquet Online India',
        text: 'Welcome to Crochet Wali, the premier place to buy crochet bouquet online India. If you are checking crochet bouquet price options, our handcrafted forever flower arrangements offer everlasting botanical charm starting from ₹99. Each bouquet is meticulously hand-knitted with premium milk cotton yarn to preserve its vibrant bloom forever without wilting. Explore our flower-specific collections including rose bouquets, sunflowers, and tulips. Handcrafted to order in India with confirmed delivery: 2–4 days crafting + 4–7 business days shipping across India.',
    },
    'crochet-bags': {
        title: 'Handmade Crochet Bags India | Granny Square & Rose Bags | Crochet Wali',
        description: 'Shop handmade crochet bags in India. Discover artisan granny square shoulder bags, round rose bags, and 3D floral handbags from ₹1,499. Handcrafted in India.',
        h1: 'Handmade Crochet Bags & Artisanal Totes',
        text: 'Discover our exclusive collection of handmade crochet bags in India. Handcrafted using premium soft yarn, our artisanal bag collection features retro granny square totes, 3D rose statement bags, and elegant round rose handbags with pearl and golden chain accents. Perfect for outings, festive styling, and thoughtful handmade gifts. Handcrafted to order in India: 2–4 days crafting + 4–7 business days shipping across India.',
    },
    'handmade-gifts': {
        title: 'Handmade Gifts India | Aesthetic & Personalized Gifting',
        description: 'Shop the best handmade gifts in India. From custom embroidery to aesthetic crochet accessories, find the perfect personalized handmade gifts for any occasion.',
        h1: 'Handmade Gifts for Every Occasion',
        text: 'In a world of mass-produced items, handmade gifts stand out for their thought, effort, and uniqueness. Our collection of handmade gifts in India is curated for those who appreciate art and aesthetic lifestyle products. Whether you are looking for a handmade birthday gift, an anniversary present, or a special token of appreciation, our handcrafted collection has something for everyone. From beautifully embroidered hoops and cute handmade accessories to vibrant crochet bouquets, every item is crafted with love and precision. Gifting custom handmade gifts shows that you care enough to choose something truly unique and meaningful.',
    },
    'crochet-accessories': {
        title: 'Crochet Hair Accessories & Scrunchies | Crochet Wali',
        description: 'Shop handmade crochet hair accessories, including each crochet scrunchie, floral crochet clutcher, and hair clip in India. Live creations from ₹49 to ₹1,699.',
        h1: 'Handmade Crochet Hair Accessories, Scrunchies & Clutchers',
        text: 'Add artisan charm to your everyday look with our handcrafted crochet hair accessories. From a soft crochet scrunchie and floral crochet clutcher to clips, hair ties, and statement bags, each accessory is handcrafted with premium yarn for durable, snag-free comfort. Live accessory creations range from ₹49 to ₹1,699. Handcrafted to order in India: 2–4 days crafting + 4–7 business days shipping across India.',
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
        title: 'Buy Crochet Gajra Online India | Crochet Wali',
        description: 'Looking to buy crochet gajra? Shop handmade crochet gajra online in India from ₹199. Reusable floral hair accessories that never turn brown or wilt.',
        h1: 'Buy Handmade Crochet Gajra Online',
        text: 'Looking to buy crochet gajra for weddings and festivities? Order authentic handmade crochet gajra online from Crochet Wali. Real flowers wilt in hours, but our crocheted gajras retain pristine petal beauty forever and can be lightly scented with your favorite perfume or attar. Live pieces range from ₹199 to ₹349. For bridal occasions, explore our dedicated reusable bridal gajra collection. Handcrafted to order: 2–4 days crafting + 4–7 business days shipping across India.',
    },
    'reusable-bridal-gajra': {
        title: 'Reusable Bridal Gajra | Crochet Bridal Gajra | Crochet Wali',
        description: 'Shop handcrafted reusable bridal gajra and crochet bridal gajra in India from ₹199 to ₹349. Everlasting floral hair jewelry for Haldi, Mehendi, and weddings.',
        h1: 'Reusable Bridal Gajra & Crochet Bridal Hair Florals',
        text: 'Make your wedding memories timeless with our reusable bridal gajra and crochet bridal gajra designs. Handcrafted specifically for Indian brides, bridesmaids, and wedding guests, each piece is lightweight, secure, and will never wilt, shed petals, or turn brown during long ceremonies. Live bridal creations range from ₹199 to ₹349. For everyday ethnic accents, visit our classic crochet gajra collection. Handcrafted to order: 2–4 days crafting + 4–7 business days shipping across India.',
    },
    'crochet-keychains': {
        title: 'Crochet Keychain & Crochet Bag Charm | Crochet Wali',
        description: 'Shop cute crochet keychain designs and aesthetic crochet bag charm accessories in India. Handcrafted amigurumi charms for bags and keys from ₹99 to ₹299.',
        h1: 'Handmade Crochet Keychain & Crochet Bag Charm Picks',
        text: 'Discover our delightful collection of handmade crochet keychain and trending crochet bag charm accessories. Whether you want a mini floral bouquet, cute amigurumi animal, or sweet charm for your handbag or car keys, each piece is hand-stitched with durable yarn and sturdy metal rings. Live creations range from ₹99 to ₹299. Handcrafted to order in India: 2–4 days crafting + 4–7 business days shipping across India.',
    },
    'crochet-claw-clips': {
        title: 'Crochet Claw Clips & Crochet Hair Clips | Crochet Wali',
        description: 'Shop aesthetic crochet claw clips and handmade crochet hair clips in India. Snag-free floral clips, bows, and clutchers handcrafted from ₹49 to ₹349.',
        h1: 'Handmade Crochet Claw Clips & Crochet Hair Clips',
        text: 'Elevate your daily hairstyles with our handcrafted crochet claw clips and aesthetic crochet hair clips. Built on durable salon-grade clips wrapped in soft botanical crochet flowers and bows, our clips provide a strong, snag-free hold for all hair types. Live hair creations range from ₹49 to ₹349. Handcrafted to order in India: 2–4 days crafting + 4–7 business days shipping across India.',
    },
    'crochet-parandi': {
        title: 'Crochet Parandi | Punjabi Parandi | Crochet Wali',
        description: 'Shop traditional Punjabi parandi braids and handmade crochet parandi designs in India from ₹199 to ₹249. Floral tassels handcrafted for festive hair styling.',
        h1: 'Handmade Crochet Parandi & Punjabi Parandi Braids',
        text: 'Celebrate authentic Indian hair traditions with our handmade crochet parandi and festive Punjabi parandi designs. Handcrafted with intricate floral tassels, delicate beads, and rich colored cords, our parandis add instant grace to long braids for Haldi ceremonies, Sangeet dances, and weddings. Live parandi creations range from ₹199 to ₹249. Handcrafted to order in India: 2–4 days crafting + 4–7 business days shipping across India.',
    },
    'gifts-for-girlfriend': {
        title: 'Handmade & Crochet Gifts for Girlfriend | Crochet Wali',
        description: 'Discover unique handmade gifts for girlfriend and romantic crochet gifts for girlfriend in India. Forever bouquets, pots, and accessories from ₹49 to ₹1,599.',
        h1: 'Handmade Gifts for Girlfriend & Romantic Keepsakes',
        text: 'Show her how much you care with romantic handmade gifts for girlfriend that never fade. Fresh roses wither within days, but our curated crochet gifts for girlfriend—from everlasting tulip pots and sunflower bouquets to artisan bags and hair charms—preserve your loving memories for years. Live curated creations range from ₹49 to ₹1,599. Handcrafted to order in India: 2–4 days crafting + 4–7 business days shipping across India.',
    },
    'anniversary-gifts': {
        title: 'Anniversary Gifts Handmade in India | Crochet Wali',
        description: 'Celebrate your milestone with everlasting anniversary gifts handmade in India. Romantic crochet flower pots, bouquets, and keepsake gifts from ₹49 to ₹1,599.',
        h1: 'Anniversary Gifts Handmade with Love',
        text: 'Mark your milestone celebration with thoughtful anniversary gifts handmade to stand the test of time. Unlike conventional presents, our handcrafted crochet keepsakes—from everlasting floral pots to romantic bouquets and heirloom bags—symbolize enduring love and warmth. Live anniversary creations range from ₹49 to ₹1,599. Handcrafted to order in India: 2–4 days crafting + 4–7 business days shipping across India.',
    },
    'gifts-under-500': {
        title: 'Handmade Crochet Gifts Under ₹500 in India | Budget Aesthetic Gifts',
        description: 'Shop affordable handmade crochet gifts under ₹500 in India. Cute keychains, floral claw clips, bridal gajra bracelets, and mini keepsakes under ₹500.',
        h1: 'Handmade Gifts Under ₹500',
        text: 'Discover our budget-friendly curation of 100% handcrafted crochet gifts under ₹500. Thoughtful gifting does not have to be expensive. From cute animal keychains and elegant floral hair clips to traditional gajra bracelets, find charming handmade treasures that look premium without breaking your budget.',
    },
    'gifts-under-1000': {
        title: 'Handmade Gifts Under ₹1000 in India | Premium Crochet Creations',
        description: 'Explore premium handmade crochet gifts under ₹1000 in India. Everlasting flower pots, granny square bags, and luxury curated gift hampers.',
        h1: 'Handmade Gifts Under ₹1000',
        text: 'Looking for a standout handmade gift under ₹1000? Our premium selection includes everlasting crochet tulip and sunflower pots, artisanal granny square shoulder bags, and curated gift hampers that offer the perfect blend of craftsmanship, durability, and aesthetic charm.',
    },
    'crochet-rose-bouquet': {
        title: 'Handmade Crochet Rose Bouquets India | Forever Romantic Roses',
        description: 'Buy handmade crochet rose bouquets online in India. Everlasting red, pink, and pastel roses handcrafted with premium milk cotton yarn that never wilt.',
        h1: 'Handmade Crochet Rose Bouquets',
        text: 'Express timeless love with our handcrafted crochet rose bouquets. Fresh cut roses wilt in days, but our hand-knitted crochet roses preserve their elegance for years. Available in romantic red, blush pink, and vibrant pastels, wrapped in aesthetic Korean floral paper with satin ribbons.',
    },
    'crochet-sunflower': {
        title: 'Handmade Crochet Sunflowers India | Bright Forever Flower Pots & Gifts',
        description: 'Shop bright handmade crochet sunflowers in India. Potted sunflowers, cheerful sunflower bouquets, and sunny car hanging charms made with love.',
        h1: 'Handmade Crochet Sunflowers',
        text: 'Bring sunshine into any room with Crochet Wali handcrafted crochet sunflowers. Handcrafted with rich golden yellow and chocolate brown yarn, our everlasting sunflower bouquets and desk pots make uplifting gifts for birthdays, graduations, and room decor.',
    },
    'crochet-tulip': {
        title: 'Handmade Crochet Tulips India | Aesthetic Pastel Tulip Pots & Bouquets',
        description: 'Shop delicate handmade crochet tulips in India. Pastel pink, lavender, and yellow tulip flower pots and bouquets crafted with soft milk cotton yarn.',
        h1: 'Handmade Crochet Tulips',
        text: 'Adorn your study desk, bedside table, or gift a loved one with our charming handmade crochet tulips. Featuring soft pastel shades and lifelike botanical forms, these forever tulip flowers bring clean cottagecore elegance that requires zero maintenance.',
    },
    'crochet-gift-hampers': {
        title: 'Crochet Gift Hamper | Handmade Gift Hamper India | Crochet Wali',
        description: 'Discover beautiful handmade gift hamper India options at Crochet Wali. Each crochet gift hamper features handcrafted florals and artisanal treasures for birthdays, anniversaries, and festive gifting.',
        h1: 'Handmade Crochet Gift Hampers India',
        text: 'Welcome to our curated crochet gift hamper collection. If you are searching for a thoughtful handmade gift hamper India delivery, our hampers bring together authentic Indian embroidery and delicate handcrafted crochet florals. Meticulously crafted with soft wool and premium yarn, each gift hamper is ideal for birthday celebrations, romantic anniversaries, and festive gifting. Care is simple: hand wash gently and dry flat. Live hamper creations currently range from ₹399 to ₹599 with confirmed delivery: 2–4 days crafting + 4–7 business days shipping across India. Looking for bulk corporate orders or wedding return gifts? Request a bespoke custom quotation via our custom design page, or explore our related crochet bouquets and crochet gifts collections.'
    },
    'crochet-flower-pots': {
        title: 'Crochet Flower Pot | Crochet Plant Pot Gift India | Crochet Wali',
        description: 'Shop everlasting handmade crochet flower pot creations and cute crochet plant pot gift designs in India. Perfect forever mini potted plants for desks, shelves, and gifting.',
        h1: 'Handmade Crochet Flower Pots & Mini Plants',
        text: 'Welcome to our everlasting crochet flower pot collection. If you are looking for an aesthetic crochet plant pot gift for your desk, study table, or home decor corner, our handmade potted plants bring lasting botanical warmth that never fades. Each piece features botanical blossoms—including sunny sunflowers, delicate pink tulips, and playful hanging strawberry vines—individually hand-crocheted and anchored in miniature textured pots. Ideal for home and office decor, or as a thoughtful keepsake for birthdays, anniversaries, and housewarmings. Care is simple: zero watering required, simply dust with a soft brush. Live potted creations range from ₹499 to ₹799 with confirmed delivery in 2–4 days crafting + 4–7 business days shipping across India. Explore our related crochet bouquets and crochet gifts collections for more everlasting floral inspiration.'
    },
    'crochet-plushies': {
        title: 'Crochet Plushies | Handmade Crochet Soft Toy India | Crochet Wali',
        description: 'Shop adorable handmade crochet plushie creations and cute crochet soft toy India designs. Soft, textured handcrafted companions for nursery decor and gifting.',
        h1: 'Handmade Crochet Plushies & Soft Toys',
        text: 'Welcome to our charming crochet plushie collection. If you are looking for an adorable crochet soft toy India delivery or looking to buy crochet plushie India designs handcrafted with genuine artisan care, our cuddly companions bring handmade warmth, textured character, and joyful personality to any space. Each plushie is individually crocheted by hand using soft, tactile yarn and stuffed with plush filling—ranging from our sweet floppy-eared bunny doll with custom outfit details to our cheerful little chick holding a delicate flower. While makers refer to this Japanese craft as amigurumi, our focus is simple: creating heirloom-quality plush friends that last forever. Perfect as keepsakes for room styling, nursery decor accents, baby shower gifting, desk companions, and celebratory gifts for birthdays and festive occasions. Care is simple: hand wash gently in cool water with mild soap and dry flat in shade. Live plushie creations range from ₹349 to ₹1,199 with confirmed delivery in 2–4 days crafting + 4–7 business days shipping across India. Explore our related crochet gifts and crochet bouquets collections for more handmade inspiration.'
    }
};

const Collection = () => {
    const { slug } = useParams();
    const { products, fetchProducts, loading } = useProducts();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;

    const shouldRedirect = slug === 'personalized-gifts' || slug === 'embroidery-hoops' || slug === 'custom-embroidery-hoops';

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
        // One card per product - color variants are selectable on the product page
        const uniqueProducts = (products || [])
            .filter(prod => !isDuplicateProduct(prod))
            .map(prod => ({
                ...prod,
                uniqueId: String(prod.id),
                preselectedVariant: null,
                price: Number(prod.price),
            }));

        return uniqueProducts.filter(product => {
            const productSlug = slugify(product.category);
            const titleSlug = slugify(product.name);
            const keywords = slug.split('-');

            // Recipient & Occasion special matching
            if (slug === 'crochet-bags') {
                return (
                    product.id === '314035ce-5e96-451b-86a3-ec79043177f4' ||
                    product.id === 'cbb84c37-ca75-41a2-b7e0-bf03f167512a' ||
                    product.id === '70f2e066-81dc-4f8d-bebf-93d066d4e999' ||
                    (titleSlug.includes('bag') && !titleSlug.includes('charm') && !titleSlug.includes('pouch') && !titleSlug.includes('keychain'))
                );
            }
            if (slug === 'crochet-plushies') {
                return (product.category && product.category.toLowerCase().includes('toy')) || productSlug.includes('toy');
            }
            if (slug === 'crochet-flower-pots') {
                return productSlug.includes('flower-pot') || (product.category && product.category.toLowerCase().includes('flower pot'));
            }
            if (slug === 'crochet-gift-hampers') {
                return productSlug.includes('hamper') || (product.category && product.category.toLowerCase().includes('hamper'));
            }
            if (slug === 'gifts-for-girlfriend' || slug === 'anniversary-gifts') {
                return titleSlug.includes('bouquet') || titleSlug.includes('rose') || titleSlug.includes('flower') || titleSlug.includes('pot') || productSlug.includes('bouquet') || productSlug.includes('flower');
            }
            if (slug === 'reusable-bridal-gajra') {
                return titleSlug.includes('gajra') || productSlug.includes('gajra') || titleSlug.includes('parandi');
            }
            if (slug === 'gifts-under-500') {
                return Number(product.price) <= 500;
            }
            if (slug === 'gifts-under-1000') {
                return Number(product.price) <= 1000;
            }
            if (slug === 'crochet-rose-bouquet') {
                return titleSlug.includes('rose') || productSlug.includes('rose');
            }
            if (slug === 'crochet-sunflower') {
                return titleSlug.includes('sunflower') || productSlug.includes('sunflower');
            }
            if (slug === 'crochet-tulip') {
                return titleSlug.includes('tulip') || productSlug.includes('tulip');
            }
            if (slug === 'crochet-bouquets') {
                return titleSlug.includes('bouquet') || productSlug.includes('bouquet');
            }
            if (slug === 'crochet-keychains') {
                return titleSlug.includes('keychain') || productSlug.includes('keychain') || titleSlug.includes('charm');
            }
            if (slug === 'crochet-claw-clips') {
                return titleSlug.includes('clip') || titleSlug.includes('claw') || titleSlug.includes('hair') || productSlug.includes('hair');
            }
            if (slug === 'crochet-parandi') {
                return titleSlug.includes('parandi') || productSlug.includes('parandi');
            }
            if (slug === 'crochet-accessories') {
                return titleSlug.includes('clip') || titleSlug.includes('claw') || titleSlug.includes('hair') || titleSlug.includes('bag') || titleSlug.includes('keychain') || titleSlug.includes('gajra') || titleSlug.includes('parandi') || productSlug.includes('hair') || productSlug.includes('accessories');
            }
            if (slug === 'crochet-flowers') {
                return titleSlug.includes('flower') || productSlug.includes('flower') || titleSlug.includes('bouquet') || productSlug.includes('bouquet') || titleSlug.includes('rose') || titleSlug.includes('tulip') || titleSlug.includes('sunflower') || productSlug.includes('pot');
            }
            if (slug === 'handmade-gifts' || slug === 'crochet-gifts') {
                return true; // All creations on Crochet Wali are 100% handmade crochet gifts
            }

            // Keyword specific filter (e.g. gajra, parandi, clip, keychain, bouquet, sunflower, rose)
            const targetKeywords = keywords.filter(k => k !== 'crochet' && k !== 'handmade' && k !== 'gifts' && k !== 'custom');
            if (targetKeywords.length > 0) {
                return targetKeywords.some(k => {
                    const singular = k.endsWith('s') ? k.slice(0, -1) : k;
                    return productSlug.includes(k) || 
                           titleSlug.includes(k) || 
                           productSlug.includes(singular) || 
                           titleSlug.includes(singular);
                });
            }
            const firstKw = keywords[0];
            const firstSingular = firstKw ? (firstKw.endsWith('s') ? firstKw.slice(0, -1) : firstKw) : '';
            return productSlug.includes(firstKw) || titleSlug.includes(firstKw) || 
                   (firstSingular && (productSlug.includes(firstSingular) || titleSlug.includes(firstSingular)));
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

    if (shouldRedirect) {
        return <Navigate to="/shop" replace />;
    }

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
                    {slug === 'crochet-bags' ? (
                        <div className="text-stone-600 text-sm md:text-base leading-relaxed space-y-4 text-left bg-white p-6 md:p-8 rounded-2xl border border-stone-100 shadow-sm">
                            <p>
                                Welcome to our artisanal <strong>crochet bags</strong> collection. If you are looking for aesthetic handmade bags in India, our handcrafted creations blend nostalgic granny square patterns with romantic floral crochet craftsmanship.
                            </p>
                            <p>
                                <strong>What this collection contains:</strong> Exactly three distinct handmade statement pieces—the <em>Crochet Rose Round Bag</em> featuring a central red rose embellishment and delicate pearl chain strap, the <em>3D Rose Granny Square Bag (Red)</em> with textured three-dimensional roses and a chic golden chain, and the classic <em>Granny Square Bag</em> hand-assembled from cheerful cream, pink, and yellow floral motifs.
                            </p>
                            <p>
                                <strong>Who it is for:</strong> Designed for women, teens, and fashion lovers who appreciate artisanal, tactile fashion. Perfect for brunch dates, casual weekend outings, festive occasions, and meaningful heirloom gifting.
                            </p>
                            <p>
                                <strong>Available Styles &amp; Colours:</strong>
                            </p>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                <li><strong>Granny Square Bag:</strong> Cream base with vibrant pink and yellow square motifs (soft crochet handle).</li>
                                <li><strong>3D Rose Granny Square Bag:</strong> Bold red with dimensional hand-crocheted roses and elegant golden chain strap.</li>
                                <li><strong>Crochet Rose Round Bag:</strong> Classic red with centered botanical rose and refined pearl chain strap.</li>
                                <li><em>Note: Interior capacity and exact bag dimensions are to be verified with the artisan team (TODO: Owner to update dimensions).</em></li>
                            </ul>
                            <p>
                                <strong>Materials &amp; Craftsmanship:</strong> Handcrafted with premium soft crochet yarn, durable stitching, and accent chains. Each bag is made one stitch at a time in India.
                            </p>
                            <p>
                                <strong>Care Basics:</strong> Hand wash gently in cool water with mild detergent and lay flat on a clean towel to dry in shade. Do not wring, machine wash, or iron directly.
                            </p>
                            <p>
                                <strong>Delivery:</strong> Handcrafted to order in India with confirmed delivery: 2–4 days crafting + 4–7 business days shipping across India.
                            </p>
                            <p className="pt-2 text-sm text-stone-500">
                                Looking for matching handmade accents? Explore our related <Link to="/collections/crochet-accessories" className="text-rose-900 font-semibold underline hover:text-rose-700">crochet accessories</Link>, <Link to="/collections/gifts-under-1000" className="text-rose-900 font-semibold underline hover:text-rose-700">gifts under ₹1000</Link>, and <Link to="/collections/gifts-under-500" className="text-rose-900 font-semibold underline hover:text-rose-700">gifts under ₹500</Link>. For care instructions and styling inspiration, visit the <Link to="/blog" className="text-rose-900 font-semibold underline hover:text-rose-700">Crochet Wali Blog &amp; Guides</Link>.
                            </p>
                        </div>
                    ) : slug === 'crochet-gift-hampers' ? (
                        <div className="text-stone-600 text-sm md:text-base leading-relaxed space-y-4 text-left bg-white p-6 md:p-8 rounded-2xl border border-stone-100 shadow-sm">
                            <p>
                                Welcome to our curated <strong>crochet gift hamper</strong> collection. If you are searching for a thoughtful <strong>handmade gift hamper India</strong> delivery, our hampers bring together authentic Indian embroidery and delicate handcrafted crochet florals.
                            </p>
                            <p>
                                <strong>What’s inside:</strong> Each gift hamper is meticulously crafted with soft wool and premium yarn, featuring delicate florals and botanical accents. Perfect for birthday surprises, romantic anniversaries, and festive celebrations.
                            </p>
                            <p>
                                <strong>Care Basics:</strong> Hand wash gently and dry flat, or dust with a soft brush to keep yarn colors fresh for years.
                            </p>
                            <p>
                                <strong>Pricing &amp; Delivery:</strong> Live hamper creations currently range from ₹399 to ₹599. Handcrafted to order with confirmed delivery: 2–4 days crafting + 4–7 business days shipping across India.
                            </p>
                            <p className="pt-2 text-sm text-stone-500">
                                Looking for bulk gifting or wedding return gifts? Contact us for a bespoke <Link to="/custom-design" className="text-rose-900 font-semibold underline hover:text-rose-700">custom quotation</Link> (quotation only; custom pricing varies by volume and design). Explore our <Link to="/collections/crochet-bouquets" className="text-rose-900 font-semibold underline hover:text-rose-700">crochet bouquets</Link> and <Link to="/collections/crochet-gifts" className="text-rose-900 font-semibold underline hover:text-rose-700">crochet gifts</Link> for more handmade inspiration.
                            </p>
                        </div>
                    ) : slug === 'crochet-flower-pots' ? (
                        <div className="text-stone-600 text-sm md:text-base leading-relaxed space-y-4 text-left bg-white p-6 md:p-8 rounded-2xl border border-stone-100 shadow-sm">
                            <p>
                                Welcome to our everlasting <strong>crochet flower pot</strong> collection. If you are looking for an aesthetic <strong>crochet plant pot gift</strong> for your desk, study table, or home decor corner, our handmade potted plants bring lasting botanical warmth that never fades.
                            </p>
                            <p>
                                <strong>What our pots are:</strong> Each piece features botanical blossoms—including sunny sunflowers, delicate pink tulips, and playful hanging strawberry vines—individually hand-crocheted and anchored in miniature textured pots.
                            </p>
                            <p>
                                <strong>Who they are for:</strong> Ideal for home, office, and study desk decor, as well as thoughtful keepsakes for plant lovers, birthdays, anniversaries, housewarmings, or festive tokens of appreciation.
                            </p>
                            <p>
                                <strong>Care Basics:</strong> 100% maintenance-free with zero watering needed. Simply dust gently with a soft brush or cool hairdryer every few weeks to keep the yarn vibrant and clean.
                            </p>
                            <p>
                                <strong>Pricing &amp; Delivery:</strong> Live flower pot creations range from ₹499 to ₹799. Handcrafted to order in India with confirmed delivery: 2–4 days crafting + 4–7 business days shipping across India.
                            </p>
                            <p className="pt-2 text-sm text-stone-500">
                                Looking for other everlasting floral designs? Explore our <Link to="/collections/crochet-bouquets" className="text-rose-900 font-semibold underline hover:text-rose-700">crochet bouquets</Link> and <Link to="/collections/crochet-gifts" className="text-rose-900 font-semibold underline hover:text-rose-700">crochet gifts</Link> collections.
                            </p>
                        </div>
                    ) : slug === 'crochet-plushies' ? (
                        <div className="text-stone-600 text-sm md:text-base leading-relaxed space-y-4 text-left bg-white p-6 md:p-8 rounded-2xl border border-stone-100 shadow-sm">
                            <p>
                                Welcome to our charming <strong>crochet plushie</strong> collection. If you are looking for an adorable <strong>crochet soft toy India</strong> delivery or looking to <strong>buy crochet plushie India</strong> designs handcrafted with genuine artisan care, our cuddly companions bring handmade warmth, textured character, and joyful personality to any space.
                            </p>
                            <p>
                                <strong>What our plushies are:</strong> Each plushie is individually crocheted by hand using soft, tactile yarn and stuffed with plush filling—ranging from our sweet floppy-eared bunny doll with custom outfit details to our cheerful little chick holding a delicate flower. While makers refer to this Japanese craft as amigurumi, our focus is simple: creating heirloom-quality plush friends that last forever.
                            </p>
                            <p>
                                <strong>Who they are for:</strong> Thoughtful keepsakes for room styling, nursery decor accents, baby shower gifting, desk companions, and celebratory gifts for birthdays and festive occasions.
                            </p>
                            <p>
                                <strong>Care Basics:</strong> Hand wash gently in cool water with mild soap and dry flat in shade, or spot clean and dust with a soft brush to keep yarn textures vibrant and fresh.
                            </p>
                            <p>
                                <strong>Pricing &amp; Delivery:</strong> Live plushie creations range from ₹349 to ₹1,199. Handcrafted to order in India with confirmed delivery: 2–4 days crafting + 4–7 business days shipping across India.
                            </p>
                            <p className="pt-2 text-sm text-stone-500">
                                Looking for other artisanal keepsakes? Explore our <Link to="/collections/crochet-gifts" className="text-rose-900 font-semibold underline hover:text-rose-700">crochet gifts</Link> and <Link to="/collections/crochet-bouquets" className="text-rose-900 font-semibold underline hover:text-rose-700">crochet bouquets</Link> collections, or get in touch for custom colors and personalized characters via our <Link to="/custom-design" className="text-rose-900 font-semibold underline hover:text-rose-700">custom design</Link> studio.
                            </p>
                        </div>
                    ) : slug === 'crochet-bouquets' ? (
                        <div className="text-stone-600 text-sm md:text-base leading-relaxed space-y-4 text-left bg-white p-6 md:p-8 rounded-2xl border border-stone-100 shadow-sm">
                            <p>
                                Welcome to Crochet Wali, the premier place to <strong>buy crochet bouquet online India</strong>. If you are checking <strong>crochet bouquet price</strong> options, our handcrafted forever flower arrangements offer everlasting botanical charm starting from ₹99.
                            </p>
                            <p>
                                Each bouquet is meticulously hand-knitted with premium milk cotton yarn to preserve its vibrant bloom forever without wilting. Perfect for romantic surprises, graduation gifts, anniversaries, and permanent home accents.
                            </p>
                            <p>
                                <strong>Care Basics:</strong> 100% maintenance-free with zero watering needed. Simply dust gently with a soft powder brush or cool hairdryer to keep petals clean and vibrant.
                            </p>
                            <p>
                                <strong>Pricing &amp; Delivery:</strong> Live bouquet creations range from ₹99 to ₹149. Handcrafted to order in India with confirmed delivery: 2–4 days crafting + 4–7 business days shipping across India.
                            </p>
                            <p className="pt-2 text-sm text-stone-500">
                                Looking for specific floral varieties? Explore our flower-specific collections: <Link to="/collections/crochet-rose-bouquet" className="text-rose-900 font-semibold underline hover:text-rose-700">rose bouquets</Link>, <Link to="/collections/crochet-sunflower" className="text-rose-900 font-semibold underline hover:text-rose-700">sunflowers</Link>, and <Link to="/collections/crochet-tulip" className="text-rose-900 font-semibold underline hover:text-rose-700">tulips</Link>.
                            </p>
                        </div>
                    ) : slug === 'crochet-gajra' ? (
                        <div className="text-stone-600 text-sm md:text-base leading-relaxed space-y-4 text-left bg-white p-6 md:p-8 rounded-2xl border border-stone-100 shadow-sm">
                            <p>
                                Looking to <strong>buy crochet gajra</strong> for weddings and festivities? Order authentic handmade <strong>crochet gajra online</strong> from Crochet Wali. Real flowers wilt in hours, but our crocheted floral gajras retain pristine petal beauty forever and can be lightly scented with your favorite perfume or attar.
                            </p>
                            <p>
                                <strong>Care Basics:</strong> Hand wash gently in cool water if needed and dry flat in shade. Reusable for years across multiple celebrations.
                            </p>
                            <p>
                                <strong>Pricing &amp; Delivery:</strong> Live gajra pieces range from ₹199 to ₹349. Handcrafted to order in India with confirmed delivery: 2–4 days crafting + 4–7 business days shipping across India.
                            </p>
                            <p className="pt-2 text-sm text-stone-500">
                                For brides, bridesmaids, and wedding rituals, explore our specialized <Link to="/collections/reusable-bridal-gajra" className="text-rose-900 font-semibold underline hover:text-rose-700">reusable bridal gajra</Link> collection.
                            </p>
                        </div>
                    ) : slug === 'reusable-bridal-gajra' ? (
                        <div className="text-stone-600 text-sm md:text-base leading-relaxed space-y-4 text-left bg-white p-6 md:p-8 rounded-2xl border border-stone-100 shadow-sm">
                            <p>
                                Make your wedding memories timeless with our <strong>reusable bridal gajra</strong> and <strong>crochet bridal gajra</strong> designs. Handcrafted specifically for Indian brides, bridesmaids, and wedding guests, each piece is lightweight, secure, and will never wilt, shed petals, or turn brown during long ceremonies.
                            </p>
                            <p>
                                <strong>Care Basics:</strong> Spray with your favorite fragrance for a scented touch, and gently store flat after celebrations for future use.
                            </p>
                            <p>
                                <strong>Pricing &amp; Delivery:</strong> Live bridal gajras and parandis range from ₹199 to ₹349. Handcrafted to order in India with confirmed delivery: 2–4 days crafting + 4–7 business days shipping across India.
                            </p>
                            <p className="pt-2 text-sm text-stone-500">
                                For everyday ethnic styling and festive hair accessories, browse our classic <Link to="/collections/crochet-gajra" className="text-rose-900 font-semibold underline hover:text-rose-700">crochet gajra</Link> collection.
                            </p>
                        </div>
                    ) : (
                        <p className="text-stone-600 text-sm md:text-base leading-relaxed">{collectionData.text}</p>
                    )}
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
                                        to={getProductUrl(product)}
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
                            <span className="text-stone-700 font-medium py-1">Related collections:</span>
                            <Link to="/collections/crochet-bouquets" className="px-3 py-1 bg-stone-100 hover:bg-rose-50 hover:text-rose-900 rounded-full text-stone-700 transition-colors">Crochet Bouquets</Link>
                            <Link to="/collections/crochet-gifts" className="px-3 py-1 bg-stone-100 hover:bg-rose-50 hover:text-rose-900 rounded-full text-stone-700 transition-colors">Crochet Gifts</Link>
                            <Link to="/collections/crochet-gift-hampers" className="px-3 py-1 bg-stone-100 hover:bg-rose-50 hover:text-rose-900 rounded-full text-stone-700 transition-colors">Gift Hampers</Link>
                            <Link to="/collections/crochet-flower-pots" className="px-3 py-1 bg-stone-100 hover:bg-rose-50 hover:text-rose-900 rounded-full text-stone-700 transition-colors">Flower Pots</Link>
                            <Link to="/collections/crochet-plushies" className="px-3 py-1 bg-stone-100 hover:bg-rose-50 hover:text-rose-900 rounded-full text-stone-700 transition-colors">Crochet Plushies</Link>
                            <Link to="/collections/crochet-gajra" className="px-3 py-1 bg-stone-100 hover:bg-rose-50 hover:text-rose-900 rounded-full text-stone-700 transition-colors">Crochet Gajra</Link>
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
