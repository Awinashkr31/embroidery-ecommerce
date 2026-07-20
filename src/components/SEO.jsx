import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, schema, url, image, children }) => {
    const siteTitle = "Crochet Wali | Handmade Crochet Flowers, Gajra, Hair Clips & Gifts India";
    const fullTitle = title 
        ? (title.includes('Crochet Wali') ? title : `${title} | Crochet Wali`) 
        : siteTitle;
    const metaDescription = description || "Shop Crochet Wali for handmade crochet bouquets, gajra, flower pots, parandi, keychains, hair clips & personalized gift boxes. Aesthetic handmade gifts, made to order across India.";
    const metaKeywords = keywords || "crochet wali, crochet flower bouquet, handmade gajra, crochet flower pot, crochet parandi, crochet keychain, crochet hair clips, embroidery hair clips, handmade gift box india, crochet claw clip, crochet bow, aesthetic handmade gifts india, custom crochet gifts, forever flower bouquet india";
    const metaUrl = url || "https://www.embroiderybysana.live";
    const metaImage = image || "https://www.embroiderybysana.live/hero-gift.png";

    return (
        <Helmet>
            {children}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={metaUrl} />
            
            {/* Open Graph / Facebook */}
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
