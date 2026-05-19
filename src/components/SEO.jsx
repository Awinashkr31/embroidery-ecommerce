import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, schema, url, image }) => {
    const siteTitle = "Handmade Embroidery Gifts & Crochet Accessories India | Embroidery By Sana";
    const fullTitle = title ? `${title} | Embroidery By Sana` : siteTitle;
    const metaDescription = description || "Shop handmade embroidery hoops, crochet bouquets, personalized gifts, and aesthetic handmade accessories online in India.";
    const metaKeywords = keywords || "crochet bouquet india, handmade gifts india, personalized handmade gifts, crochet flower bouquet, forever flower bouquet, crochet bouquet for girlfriend, aesthetic handmade gifts, custom handmade gifts, crochet accessories india, cute handmade accessories, personalized bouquet gift, aesthetic crochet bouquet, handmade anniversary gift, custom gift india, handmade flower bouquet";
    const metaUrl = url || "https://www.embroiderybysana.live";
    const metaImage = image || "https://www.embroiderybysana.live/logo.png";

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />
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
