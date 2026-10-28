import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { supabase } from '../../config/supabase';
import { ChevronRight, Loader } from 'lucide-react';

import { blogPosts as fallbackPosts } from './posts';

const BlogIndex = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data, error } = await supabase
                    .from('blog_posts')
                    .select('slug, title, excerpt, image, publish_date')
                    .eq('status', 'published')
                    .order('publish_date', { ascending: false });

                if (!error && data && data.length > 0) {
                    // Merge DB posts with any fallback posts not yet in DB
                    const dbSlugs = new Set(data.map(p => p.slug));
                    const missingFallback = fallbackPosts
                        .filter(p => !dbSlugs.has(p.slug))
                        .map(p => ({
                            slug: p.slug,
                            title: p.title,
                            excerpt: p.excerpt,
                            image: p.image,
                            publish_date: p.date ? `${p.date}T00:00:00+05:30` : new Date().toISOString()
                        }));
                    setPosts([...data, ...missingFallback]);
                } else {
                    // Fallback to static posts
                    setPosts(fallbackPosts.map(p => ({
                        slug: p.slug,
                        title: p.title,
                        excerpt: p.excerpt,
                        image: p.image,
                        publish_date: p.date ? `${p.date}T00:00:00+05:30` : new Date().toISOString()
                    })));
                }
            } catch (err) {
                console.warn('Supabase blog fetch failed, using fallback:', err);
                setPosts(fallbackPosts.map(p => ({
                    slug: p.slug,
                    title: p.title,
                    excerpt: p.excerpt,
                    image: p.image,
                    publish_date: p.date ? `${p.date}T00:00:00+05:30` : new Date().toISOString()
                })));
            }
            setLoading(false);
        };
        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-[#fdfbf7] pt-12 pb-24 font-body">
            <SEO 
                title="Blog | Handmade Gifting & Crochet Guides | Crochet Wali"
                description="Read the latest articles on handmade gifts, crochet care guides, and sustainable gifting ideas from Crochet Wali."
                keywords="crochet blog, handmade gifts guide, crochet wali blog"
                url="https://www.crochetwali.in/blog"
            />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-stone-900 mb-4">The Crochet Wali Blog</h1>
                    <p className="text-stone-600 max-w-2xl mx-auto">Discover gifting ideas, crochet care guides, and the stories behind our handmade creations.</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader className="w-8 h-8 animate-spin text-stone-400" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link 
                                key={post.slug} 
                                to={`/blog/${post.slug}`}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-stone-100 group flex flex-col"
                            >
                                <div className="aspect-[16/10] overflow-hidden">
                                    <img 
                                        src={post.image} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <span className="text-rose-900 text-xs font-bold tracking-widest uppercase mb-2">{new Date(post.publish_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    <h2 className="font-heading font-bold text-xl text-stone-900 mb-3 group-hover:text-rose-700 transition-colors">{post.title}</h2>
                                    <p className="text-stone-600 text-sm leading-relaxed mb-6 flex-grow">{post.excerpt}</p>
                                    <div className="flex items-center text-rose-900 text-sm font-semibold mt-auto">
                                        Read Article <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogIndex;
