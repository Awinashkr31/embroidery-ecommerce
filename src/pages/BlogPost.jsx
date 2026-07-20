import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { ArrowLeft, Share2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

// Hardcoded for demo purposes. In production, this would come from Supabase.
const blogPosts = {
    'top-10-handmade-embroidery-gifts': {
        title: 'Top 10 Handmade Anniversary Gifts for Your Girlfriend in India',
        date: '2023-11-15',
        author: 'Sana',
        image: 'https://images.unsplash.com/photo-1620783770629-122b7f187703?q=80&w=1200&auto=format&fit=crop',
        content: `
            <p>Anniversaries are special milestones that deserve equally special gifts. In a world dominated by mass-produced items, personalized handmade gifts offer a deeply personal and thoughtful touch. Here are our top 10 romantic handmade gifts that make the perfect anniversary gift in India.</p>
            <h2>1. Custom Embroidery Portrait Hoops</h2>
            <p>A custom embroidery hoop captures your favorite memory in thread. Whether it's a wedding photo or a candid moment, a personalized embroidery hoop is a piece of handmade art that will last forever. These make the perfect gift for girlfriend or boyfriend on any special occasion.</p>
            <h2>2. Handmade Crochet Bouquets</h2>
            <p>A forever flower bouquet made from crochet is one of the most trending aesthetic gifts in India. Unlike real flowers that wilt, a handmade crochet bouquet retains its beauty for a lifetime. Choose from crochet rose bouquets, tulip bouquets, and sunflower bouquets.</p>
            <h2>3. Anniversary Date Calendar Hoops</h2>
            <p>Commemorate the exact day you said "I do" with a beautifully stitched calendar hoop, featuring a heart over your special date. A truly unique handmade anniversary gift.</p>
            <p><em>(More ideas coming soon...)</em></p>
        `
    },
    'why-crochet-bouquets-last-forever': {
        title: 'Why a Forever Flower Bouquet is the Perfect Crochet Gift for Girlfriend',
        date: '2023-12-02',
        author: 'Sana',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1200&auto=format&fit=crop',
        content: `
            <p>We all love receiving flowers, but there is one inevitable truth: they die. Within a week, that beautiful bouquet ends up in the trash. Enter the aesthetic crochet bouquet — a handmade flower bouquet that lasts forever.</p>
            <h2>Everlasting Beauty of a Crochet Flower Bouquet</h2>
            <p>Crochet flowers never wilt, fade, or die. A handmade crochet bouquet offers the aesthetic beauty of floral arrangements with the permanence of art. Whether you choose a crochet rose bouquet, crochet tulip bouquet, or a crochet sunflower bouquet, these forever flower bouquets are the ultimate romantic handmade gift.</p>
            <h2>Allergy-Free & Eco-Friendly</h2>
            <p>Perfect for recipients with pollen allergies, aesthetic crochet flowers bring the joy of nature indoors without the sneezes. Plus, as a handmade gift, they are a sustainable and eco-conscious choice.</p>
            <h2>Trending on Pinterest & Instagram</h2>
            <p>Crochet bouquets are one of the most viral crochet bouquet trends right now. From pinterest handmade gifts boards to instagram handmade business reels, these aesthetic flower bouquets are everywhere.</p>
        `
    },
    'aesthetic-crochet-accessories-trend': {
        title: 'Trending: Aesthetic Crochet Accessories & Cute Handmade Gifts in India',
        date: '2024-01-10',
        author: 'Sana',
        image: 'https://images.unsplash.com/photo-1605370258169-2a9dbcdff158?q=80&w=1200&auto=format&fit=crop',
        content: `
            <p>Crochet is no longer just a hobby for grandmothers. It has exploded onto the fashion scene as a highly sought-after aesthetic. Crochet accessories in India are booming, from cute handmade accessories to trendy fashion pieces.</p>
            <h2>Slow Fashion Movement & Handmade Business India</h2>
            <p>As consumers become more conscious of their environmental impact, the slow fashion movement has gained massive traction. Crochet accessories are inherently slow fashion — each piece takes hours to make by hand. Small business handmade gifts are leading the charge.</p>
            <h2>Crochet Hair Accessories & Cute Aesthetic Gifts</h2>
            <p>From crochet claw clips and crochet flower clips to crochet bow clips, the range of crochet hair accessories is incredible. These cute aesthetic gifts make perfect personalized gifts for friends and family.</p>
            <h2>Unique and Customizable</h2>
            <p>No two handmade pieces are exactly alike. When you wear a crochet accessory, you are wearing a unique piece of art — a custom aesthetic gift that cannot be replicated.</p>
        `
    }
};

const BlogPost = () => {
    const { slug } = useParams();
    const { addToast } = useToast();
    const [post, setPost] = useState(null);
    const [toc, setToc] = useState([]);
    const [contentHtml, setContentHtml] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
        if (blogPosts[slug]) {
            const rawPost = blogPosts[slug];
            setPost(rawPost);

            const tempToc = [];
            let modifiedContent = rawPost.content;
            
            const h2Regex = /<h2>(.*?)<\/h2>/g;
            modifiedContent = modifiedContent.replace(h2Regex, (match, p1) => {
                const id = p1.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                tempToc.push({ id, title: p1 });
                return `<h2 id="${id}">${p1}</h2>`;
            });
            
            setToc(tempToc);
            setContentHtml(modifiedContent);
        }
    }, [slug]);

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-stone-900 mb-4">Article Not Found</h1>
                    <Link to="/blog" className="text-rose-900 underline hover:text-rose-700">Return to Journal</Link>
                </div>
            </div>
        );
    }

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://www.embroiderybysana.live/blog/${slug}`
        },
        "headline": post.title,
        "image": post.image,  
        "author": {
            "@type": "Person",
            "name": post.author
        },  
        "publisher": {
            "@type": "Organization",
            "name": "Embroidery By Sana",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.embroiderybysana.live/logo.png"
            }
        },
        "datePublished": post.date
    };

    return (
        <div className="bg-[#fdfbf7] min-h-screen pb-24 font-body selection:bg-rose-100 selection:text-rose-900">
            <SEO 
                title={`${post.title} | Handmade Journal`}
                description={post.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'}
                url={`https://www.embroiderybysana.live/blog/${slug}`}
                image={post.image}
                schema={articleSchema}
            />
            
            <div className="container-custom pt-24 md:pt-32 max-w-4xl">
                <Link to="/blog" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 mb-8 transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Journal
                </Link>

                <div className="mb-10">
                    <div className="flex items-center gap-4 text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">
                        <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <span>•</span>
                        <span>By {post.author}</span>
                    </div>
                    <h1 className="font-heading text-3xl md:text-5xl font-bold text-stone-900 leading-tight mb-8">
                        {post.title}
                    </h1>
                    
                    <div className="w-full aspect-video rounded-2xl overflow-hidden bg-stone-100 mb-12">
                        <img 
                            src={post.image} 
                            alt={post.title} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-12">
                    {/* Social Share sidebar */}
                    <div className="md:w-24 shrink-0 flex md:flex-col gap-4">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-widest hidden md:block">Share</span>
                        <button
                            onClick={async () => {
                                const shareData = {
                                    title: post.title,
                                    text: `Read this article on Embroidery By Sana`,
                                    url: window.location.href,
                                };
                                if (navigator.share) {
                                    try { await navigator.share(shareData); } catch { /* user cancelled */ }
                                } else {
                                    await navigator.clipboard.writeText(window.location.href);
                                    addToast('Link copied to clipboard!', 'success');
                                }
                            }}
                            className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-rose-50 hover:text-rose-900 hover:border-rose-200 transition-all"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>

                    {toc.length > 0 && (
                        <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 mb-10 max-w-xl">
                            <h3 className="font-heading font-bold text-lg text-stone-900 mb-4 flex items-center gap-2">
                                Table of Contents
                            </h3>
                            <ul className="space-y-3">
                                {toc.map((item, index) => (
                                    <li key={index}>
                                        <a 
                                            href={`#${item.id}`} 
                                            className="text-stone-600 hover:text-rose-900 transition-colors text-sm flex items-start gap-2 leading-tight"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                        >
                                            <span className="text-stone-400 font-mono text-xs mt-0.5">{index + 1}.</span>
                                            <span>{item.title}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* SECURITY WARNING: dangerouslySetInnerHTML is currently safe because the content 
                        is hardcoded in this file. However, when migrating blog posts to Supabase/CMS, 
                        this becomes a critical stored XSS vector. You must use DOMPurify:
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} */}
                    <article 
                        className="prose prose-stone lg:prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-a:text-rose-900 prose-img:rounded-xl prose-headings:scroll-mt-24"
                        dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />
                </div>
            </div>
        </div>
    );
};

export default BlogPost;
