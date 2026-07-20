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
            </article>
        </div>
    );
};

export default BlogPost;
