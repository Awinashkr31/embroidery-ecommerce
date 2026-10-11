import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, schema, url, image, noIndex, children }) => {
    const siteTitle = "Crochet Wali | Handmade Crochet Flowers, Gajra, Hair Clips & Gifts India";
    const fullTitle = title 
        ? (title.includes('Crochet Wali') ? title : `${title} | Crochet Wali`) 
        : siteTitle;
    const metaDescription = description || "Shop Crochet Wali for handmade crochet bouquets, gajra, flower pots, parandi, keychains, hair clips & personalized gift boxes. Aesthetic handmade gifts, made to order across India.";
    const metaKeywords = keywords || "crochet wali, crochet flower bouquet, handmade gajra, crochet flower pot, crochet parandi, crochet keychain, crochet hair clips, embroidery hair clips, handmade gift box india, crochet claw clip, crochet bow, aesthetic handmade gifts india, custom crochet gifts, forever flower bouquet india";
    const metaUrl = url || (typeof window !== 'undefined' ? `https://www.crochetwali.in${window.location.pathname}` : "https://www.crochetwali.in");
    const metaImage = image || "https://www.crochetwali.in/hero-gift.png";

    useEffect(() => {
        if (typeof document === 'undefined') return;

        // 1. Direct document title update
        document.title = fullTitle;

        // 2. Direct single meta description update & deduplication
        const allDescs = document.querySelectorAll('meta[name="description"]');
        if (allDescs.length > 0) {
            allDescs[0].setAttribute('content', metaDescription);
            for (let i = 1; i < allDescs.length; i++) {
                allDescs[i].remove();
            }
        } else {
            const el = document.createElement('meta');
            el.setAttribute('name', 'description');
            el.setAttribute('content', metaDescription);
            document.head.appendChild(el);
        }

        // 3. Direct single canonical link update & deduplication
        const allCanonicals = document.querySelectorAll('link[rel="canonical"]');
        if (allCanonicals.length > 0) {
            allCanonicals[0].setAttribute('href', metaUrl);
            for (let i = 1; i < allCanonicals.length; i++) {
                allCanonicals[i].remove();
            }
        } else {
            const el = document.createElement('link');
            el.setAttribute('rel', 'canonical');
            el.setAttribute('href', metaUrl);
            document.head.appendChild(el);
        }

        // 4. Update OpenGraph and Twitter tags in place
        const updateMeta = (selector, attr, val) => {
            const metas = document.querySelectorAll(selector);
            if (metas.length > 0) {
                metas[0].setAttribute('content', val);
                for (let i = 1; i < metas.length; i++) {
                    metas[i].remove();
                }
            } else {
                const el = document.createElement('meta');
                if (selector.includes('property=')) {
                    el.setAttribute('property', selector.split('="')[1].replace('"]', ''));
                } else if (selector.includes('name=')) {
                    el.setAttribute('name', selector.split('="')[1].replace('"]', ''));
                }
                el.setAttribute('content', val);
                document.head.appendChild(el);
            }
        };

        updateMeta('meta[property="og:title"]', 'content', fullTitle);
        updateMeta('meta[property="og:description"]', 'content', metaDescription);
        updateMeta('meta[property="og:url"]', 'content', metaUrl);
        updateMeta('meta[property="og:image"]', 'content', metaImage);
        updateMeta('meta[property="twitter:title"]', 'content', fullTitle);
        updateMeta('meta[property="twitter:description"]', 'content', metaDescription);
        updateMeta('meta[property="twitter:url"]', 'content', metaUrl);
        updateMeta('meta[property="twitter:image"]', 'content', metaImage);
    }, [fullTitle, metaDescription, metaUrl, metaImage]);

    return (
        <Helmet>
            {children}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />
            <meta name="robots" content={noIndex ? "noindex, follow" : "index, follow"} />
            
            {/* Open Graph / Facebook */}
            <meta property="og:site_name" content="Crochet Wali" />
            <meta property="og:locale" content="en_IN" />
            <meta property="og:type" content={schema && (Array.isArray(schema) ? schema.some(s => s["@type"] === "Product") : schema["@type"] === "Product") ? "product" : "website"} />
            <meta property="og:url" content={metaUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />
            
            {/* Product specifics for Pinterest/Instagram */}
            {schema && (Array.isArray(schema) ? schema.some(s => s["@type"] === "Product") : schema["@type"] === "Product") && (
                <>
                    <meta property="product:price:amount" content={
                        (Array.isArray(schema) ? schema.find(s => s["@type"] === "Product") : schema)?.offers?.price
                    } />
                    <meta property="product:price:currency" content="INR" />
                </>
            )}
            
            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={metaUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />

            {/* Schema.org JSON-LD */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
