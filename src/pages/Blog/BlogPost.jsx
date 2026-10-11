import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import SEO from '../../components/SEO';
import { blogPosts } from './posts';
import { ArrowLeft } from 'lucide-react';

const BlogPost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const found = blogPosts.find(p => p.slug === slug);
        if (found) {
            setPost(found);
        } else {
            navigate('/blog', { replace: true });
        }
    }, [slug, navigate]);

    if (!post) return null;

    return (
        <div className="min-h-screen bg-[#fdfbf7] pt-8 md:pt-12 pb-24 font-body">
            <SEO 
                title={post.metaTitle}
                description={post.metaDescription}
                keywords={post.keywords}
                image={post.image}
                url={window.location.href}
                schema={[{
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "headline": post.title,
                    "image": [
                        `https://www.crochetwali.in${post.image}`
                    ],
                    "datePublished": post.date,
                    "dateModified": post.date,
                    "author": [{
                        "@type": "Person",
                        "name": "Sana (Founder & Lead Artisan)",
                        "url": "https://www.crochetwali.in/about"
                    }],
                    "publisher": {
                        "@type": "Organization",
                        "name": "Crochet Wali",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://www.crochetwali.in/logo.png"
                        }
                    }
                }]}
            />

            <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/blog" className="inline-flex items-center text-stone-500 hover:text-rose-900 transition-colors mb-8 text-sm font-medium">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
                </Link>

                <div className="mb-10 text-center">
                    <span className="text-rose-900 text-sm font-bold tracking-widest uppercase mb-4 block">
                        {new Date(post.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-heading font-bold text-stone-900 mb-6 leading-tight">
                        {post.title}
                    </h1>
                </div>

                <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden mb-12 shadow-sm">
                    <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                        loading="eager"
                        decoding="async"
                    />
                </div>

                <div className="prose prose-stone prose-rose max-w-none prose-headings:font-heading prose-headings:font-bold prose-h3:text-2xl prose-a:text-rose-700 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
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
