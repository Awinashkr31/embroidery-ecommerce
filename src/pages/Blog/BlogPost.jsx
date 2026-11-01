import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import SEO from '../../components/SEO';
import { supabase } from '../../config/supabase';
import { ArrowLeft, Loader } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/imageUtils';
import { blogPosts as fallbackPosts } from './posts';

const getFallbackPost = (targetSlug) => {
    const fallback = fallbackPosts.find(p => p.slug === targetSlug);
    if (!fallback) return null;
    return {
        ...fallback,
        publish_date: fallback.date ? `${fallback.date}T00:00:00+05:30` : new Date().toISOString(),
        meta_title: fallback.metaTitle,
        meta_description: fallback.metaDescription,
        status: 'published'
    };
};

const BlogPost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(() => getFallbackPost(slug));
    const [loading, setLoading] = useState(() => !getFallbackPost(slug));

    const normalizedContent = useMemo(() => {
        if (!post?.content) return '';
        // If markdown starts with H3s but lacks H2s, promote H4 -> H3 and H3 -> H2 to ensure valid heading hierarchy (WCAG 1.3.1)
        const hasH2 = /^##\s+/m.test(post.content);
        if (!hasH2 && /^###\s+/m.test(post.content)) {
            return post.content.replace(/^(#{3,4})\s+(.*$)/gm, (match, hashes, title) => {
                if (hashes === '####') return `### ${title}`;
                if (hashes === '###') return `## ${title}`;
                return match;
            });
        }
        return post.content;
    }, [post?.content]);

    useEffect(() => {
        window.scrollTo(0, 0);

        const currentFallback = getFallbackPost(slug);
        if (currentFallback) {
            setPost(currentFallback);
            setLoading(false);
        } else {
            setLoading(true);
        }

        const fetchPost = async () => {
            let foundPost = null;

            try {
                const { data, error } = await supabase
                    .from('blog_posts')
                    .select('*')
                    .eq('slug', slug)
                    .eq('status', 'published')
                    .maybeSingle();

                if (!error && data) {
                    foundPost = data;
                }
            } catch (err) {
                console.warn('Supabase post fetch failed, trying fallback:', err);
            }

            // Fallback to static post if not found in Supabase
            if (!foundPost) {
                foundPost = getFallbackPost(slug);
            }

            if (!foundPost) {
                navigate('/blog', { replace: true });
            } else {
                setPost(foundPost);
            }
            setLoading(false);
        };
        fetchPost();
    }, [slug, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
                <Loader className="w-8 h-8 animate-spin text-stone-400" />
            </div>
        );
    }

    if (!post) return null;

    const articleUrl = `https://www.crochetwali.in/blog/${post.slug}`;
    const imageUrl = post.image
        ? (post.image.startsWith('http') ? post.image : `https://www.crochetwali.in${post.image.startsWith('/') ? '' : '/'}${post.image}`)
        : null;

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
    };

    const publishDate = formatDate(post.publish_date) || formatDate(post.created_at) || new Date().toISOString().split('T')[0];
    const modifiedDate = formatDate(post.updated_at) || publishDate;

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.meta_description || post.excerpt,
        "datePublished": publishDate,
        "dateModified": modifiedDate,
        "author": {
            "@type": "Organization",
            "name": "Crochet Wali",
            "url": "https://www.crochetwali.in"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Crochet Wali",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.crochetwali.in/logo.png"
            }
        },
        "url": articleUrl,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": articleUrl
        },
        ...(imageUrl ? { "image": [imageUrl] } : {})
    };

    const displayDate = (() => {
        const d = new Date(post.publish_date || post.created_at || Date.now());
        return isNaN(d.getTime())
            ? ''
            : d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    })();

    return (
        <div className="min-h-screen bg-[#fdfbf7] pt-8 md:pt-12 pb-24 font-body">
            <SEO
                title={post.meta_title || post.title}
                description={post.meta_description || post.excerpt}
                keywords={post.keywords}
                image={imageUrl || "https://www.crochetwali.in/hero-gift.png"}
                url={articleUrl}
                schema={articleSchema}
            />

            <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/blog" className="inline-flex items-center text-stone-700 hover:text-rose-900 transition-colors mb-8 text-sm font-medium">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
                </Link>

                <div className="mb-10 text-center">
                    <span className="text-rose-900 text-sm font-bold tracking-widest uppercase mb-4 block">
                        {displayDate}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-heading font-bold text-stone-900 mb-6 leading-tight">
                        {post.title}
                    </h1>
                </div>

                <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden mb-12 shadow-sm">
                    <img
                        src={getOptimizedImageUrl(post.image, { width: 720, quality: 75 })}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        loading="eager"
                        decoding="async"
                    />
                </div>

                <div className="prose prose-stone prose-rose max-w-none prose-headings:font-heading prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-a:text-rose-700 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
                    <ReactMarkdown>{normalizedContent}</ReactMarkdown>
                </div>

                {/* Author / Artisan Bio for E-E-A-T */}
                <div className="mt-16 pt-8 border-t border-stone-200">
                    <div className="bg-white rounded-2xl p-6 md:p-8 border border-stone-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5">
                        <img
                            src="/logo.png"
                            alt="Sana - Founder & Lead Artisan"
                            className="w-16 h-16 rounded-full object-contain bg-rose-50 border border-rose-100 p-2 shrink-0"
                        />
                        <div className="text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                                <h3 className="font-heading font-bold text-lg text-stone-900">Sana</h3>
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 w-fit mx-auto sm:mx-0">
                                    Founder & Lead Artisan
                                </span>
                            </div>
                            <p className="text-stone-600 text-sm leading-relaxed mb-3">
                                Sana is the creator and head artisan behind Crochet Wali, handcrafting forever flower bouquets, traditional gajra, and aesthetic keepsakes from New Delhi, India. She is passionate about sustainable textile arts and helping people gift meaningful handcrafted treasures.
                            </p>
                            <Link to="/about" className="text-rose-700 hover:text-rose-900 font-medium text-xs inline-flex items-center gap-1">
                                Read our full story →
                            </Link>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default BlogPost;
