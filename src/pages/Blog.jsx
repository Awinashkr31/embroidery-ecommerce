import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { BookOpen } from 'lucide-react';

const blogPosts = [
    {
        slug: 'top-10-handmade-embroidery-gifts',
        title: 'Top 10 Handmade Anniversary Gifts for Your Girlfriend in India',
        excerpt: 'Discover the most thoughtful personalized handmade gifts you can give to your partner. From custom embroidery hoops to aesthetic crochet bouquets, these romantic handmade gifts will melt any heart.',
        date: '2023-11-15',
        image: 'https://images.unsplash.com/photo-1620783770629-122b7f187703?q=80&w=600&auto=format&fit=crop'
    },
    {
        slug: 'why-crochet-bouquets-last-forever',
        title: 'Why a Forever Flower Bouquet is the Perfect Crochet Gift for Girlfriend',
        excerpt: 'Real flowers wilt in a week, but a crochet bouquet lasts a lifetime. Learn why aesthetic crochet flowers and handmade flower bouquets are the ultimate romantic gift trending on Pinterest and Instagram.',
        date: '2023-12-02',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop'
    },
    {
        slug: 'aesthetic-crochet-accessories-trend',
        title: 'Trending: Aesthetic Crochet Accessories & Cute Handmade Gifts in India',
        excerpt: 'From crochet hair accessories to handmade keychains, explore how cute handmade accessories and aesthetic crochet decor are taking over small business fashion in India.',
        date: '2024-01-10',
        image: 'https://images.unsplash.com/photo-1605370258169-2a9dbcdff158?q=80&w=600&auto=format&fit=crop'
    }
];

const Blog = () => {
    return (
        <div className="bg-[#fdfbf7] min-h-screen pb-24 font-body selection:bg-rose-100 selection:text-rose-900">
            <SEO 
                title="Handmade Journal & Blog | Embroidery By Sana"
                description="Read our latest articles on handmade embroidery, aesthetic crochet trends, and personalized gifting ideas in India."
                url="https://www.embroiderybysana.live/blog"
            />
            
            <div className="container-custom pt-24 md:pt-32">
                <div className="mb-12 md:mb-20 text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center justify-center p-3 bg-rose-50 rounded-full mb-4">
                        <BookOpen className="w-6 h-6 text-rose-900" />
                    </div>
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-stone-900 mb-6">The Handmade Journal</h1>
                    <p className="text-stone-600 text-sm md:text-base leading-relaxed">
                        Insights, inspiration, and trends from the world of handmade embroidery, crochet, and personalized gifting.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {blogPosts.map((post) => (
                        <article key={post.slug} className="group cursor-pointer">
                            <Link to={`/blog/${post.slug}`} className="block">
                                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-stone-100">
                                    <img 
                                        src={post.image} 
                                        alt={post.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <span className="text-xs font-bold text-rose-900 uppercase tracking-widest">{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    <h2 className="text-xl md:text-2xl font-heading font-bold text-stone-900 group-hover:text-rose-900 transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>
                                    <p className="text-stone-600 text-sm leading-relaxed line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Blog;
