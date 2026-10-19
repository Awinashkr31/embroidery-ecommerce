import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, schema, url, image, noIndex, children }) => {
    const siteTitle = "Crochet Wali | Handmade Crochet Flowers, Gajra, Hair Clips & Gifts India";
    const fullTitle = title 
        ? (title.includes('Crochet Wali') ? title : `${title} | Crochet Wali`) 
        : siteTitle;
    const metaDescription = description || "Buy 100% handmade crochet flower bouquets, bridal gajras, hair accessories & personalized gift boxes starting at ₹99. Everlasting aesthetic gifts made with love in India. Free shipping over ₹799! Order now.";
    const metaKeywords = keywords || "crochet wali, crochet flower bouquet, handmade gajra, crochet flower pot, crochet parandi, crochet keychain, crochet hair clips, embroidery hair clips, handmade gift box india, crochet claw clip, crochet bow, aesthetic handmade gifts india, custom crochet gifts, forever flower bouquet india";
    const metaUrl = url || (typeof window !== 'undefined' ? `https://www.crochetwali.in${window.location.pathname}` : "https://www.crochetwali.in");
    const metaImage = image || "https://www.crochetwali.in/hero-gift.png";

    useEffect(() => {
        if (typeof document === 'undefined') return;

        // 1. Direct document title update for instant tab text update
        document.title = fullTitle;

        // 2. Direct single meta description update in-place (NEVER remove DOM nodes to prevent React 19 reconciler crashes)
        const descEl = document.querySelector('meta[name="description"]');
        if (descEl) {
            descEl.setAttribute('content', metaDescription);
        }

        // 3. Direct canonical link update in-place
        const canonicalEl = document.querySelector('link[rel="canonical"]');
        if (canonicalEl) {
            canonicalEl.setAttribute('href', metaUrl);
        }

        // 4. Update OpenGraph and Twitter tags in place
        const updateMetaAttr = (selector, val) => {
            const el = document.querySelector(selector);
            if (el) {
                el.setAttribute('content', val);
            }
        };

        updateMetaAttr('meta[property="og:title"]', fullTitle);
        updateMetaAttr('meta[property="og:description"]', metaDescription);
        updateMetaAttr('meta[property="og:url"]', metaUrl);
        updateMetaAttr('meta[property="og:image"]', metaImage);
        updateMetaAttr('meta[name="twitter:title"]', fullTitle);
        updateMetaAttr('meta[name="twitter:description"]', metaDescription);
        updateMetaAttr('meta[name="twitter:url"]', metaUrl);
        updateMetaAttr('meta[name="twitter:image"]', metaImage);
    }, [fullTitle, metaDescription, metaUrl, metaImage]);

    return (
        <Helmet>
            {children}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />
            <meta name="robots" content={noIndex ? "noindex, follow" : "index, follow"} />
            <link rel="canonical" href={metaUrl} />
            
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
