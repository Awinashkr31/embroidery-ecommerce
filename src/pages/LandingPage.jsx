import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Star, Heart, CheckCircle, Package, Truck, ArrowRight, Sparkles } from 'lucide-react';

const LandingPage = () => {
  const landingSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Crochet Wali - Handmade Crochet Gifts Made with Love",
    "description": "Discover Crochet Wali for premium handmade crochet flowers, bouquets, gajra, and personalized gifts. Beautifully crafted in India.",
    "publisher": {
      "@type": "Organization",
      "name": "Crochet Wali"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Crochet Wali?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Crochet Wali is India's premier destination for premium handmade crochet gifts, specializing in forever crochet flower bouquets, traditional gajras, cute keychains, and aesthetic home decor. Every piece is handcrafted with love."
        }
      },
      {
        "@type": "Question",
        "name": "Why buy Crochet gifts instead of fresh flowers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Unlike fresh flowers that wither in a few days, handmade crochet flowers last forever. They act as a permanent keepsake and a memory of your special occasion, making them a more sustainable and meaningful gift."
        }
      },
      {
        "@type": "Question",
        "name": "How are Crochet Gifts made?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Each crochet gift is meticulously hand-knit using premium quality, soft, and durable yarn. The process involves hours of careful looping, stitching, and shaping by skilled artisans to create lifelike flowers and adorable plushies."
        }
      },
      {
        "@type": "Question",
        "name": "Are Crochet Flowers washable?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, crochet flowers are washable! We recommend gentle hand washing with cold water and mild detergent. Do not wring them; simply press out the excess water and let them air dry to maintain their shape."
        }
      },
      {
        "@type": "Question",
        "name": "Do Crochet Gifts make good presents for anniversaries?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! A crochet rose bouquet or customized amigurumi pair makes for a deeply personal and unique anniversary gift. It symbolizes a love that lasts forever, just like the yarn used to create the gift."
        }
      }
    ]
  };

  return (
    <div className="font-body bg-[#fcf5ef] text-stone-800 selection:bg-rose-900 selection:text-white">
      <SEO 
        title="Crochet Wali – Handmade Crochet Gifts Made with Love"
        description="Discover Crochet Wali for premium handmade crochet flowers, bouquets, gajra, and personalized gifts. Beautifully crafted in India. Shop our aesthetic collections today!"
        schema={[landingSchema, faqSchema]}
        url="https://www.embroiderybysana.live/crochet-wali"
      />

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-[#6e132b] mb-6 leading-tight">
            Crochet Wali <br/>
            <span className="text-2xl md:text-4xl text-rose-800 block mt-2">Handmade Crochet Gifts Made with Love</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Welcome to Crochet Wali! Your ultimate destination for aesthetic, sustainable, and meticulously handcrafted gifts. From vibrant sunflower bouquets to elegant hair clips, we knit your feelings into reality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="bg-[#6e132b] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#4a0d1d] transition-colors shadow-lg flex items-center justify-center gap-2">
              Shop All Collections <ArrowRight size={20} />
            </Link>
            <Link to="/gifts" className="bg-white text-[#6e132b] border-2 border-[#6e132b] px-8 py-4 rounded-full font-bold text-lg hover:bg-stone-50 transition-colors flex items-center justify-center gap-2">
              Gift Guide <Sparkles size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="py-16 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#6e132b] mb-6">Our Brand Story: The Magic of Yarn</h2>
            <div className="space-y-4 text-stone-600 text-lg leading-relaxed">
              <p>
                Every knot tells a story, and at <strong>Crochet Wali</strong>, our story began with a simple hook and a ball of yarn. What started as a passionate hobby to create personal, heartfelt gifts for friends and family quickly blossomed into a beloved brand across India. We realized that in a world of mass-produced plastic items, people were craving the warmth, authenticity, and personal touch that only handmade goods can provide.
              </p>
              <p>
                As <em>Crochet Wali</em> grew, so did our vision. We wanted to create sustainable alternatives to fresh flowers—gifts that wouldn't wilt and die within a week, but would stand proudly on a bedside table for years to come. Today, our <strong>Crochet Flower Bouquets</strong>, intricate <strong>Gajras</strong>, and adorable <strong>Keychains</strong> bring smiles to hundreds of faces every month.
              </p>
              <p>
                We believe that gifting is an art form. It’s not just about the object; it's about the sentiment attached to it. When you buy from Crochet Wali, you aren't just buying a product; you are purchasing hours of dedication, years of practiced skill, and a tangible piece of art crafted specifically for your loved ones.
              </p>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800" 
              alt="Crochet Wali crafting process" 
              className="rounded-2xl shadow-xl w-full h-auto object-cover"
              loading="lazy"
            />
            <div className="absolute -bottom-6 -left-6 bg-[#6e132b] text-white p-6 rounded-xl shadow-lg hidden md:block">
              <p className="font-bold text-xl">100%</p>
              <p className="text-sm">Handmade with Love</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 bg-[#fcf5ef] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#6e132b] mb-12">Why Choose Crochet Wali?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <Heart className="mx-auto text-rose-500 mb-4" size={40} />
              <h3 className="font-bold text-xl mb-2">Sustainable Gifting</h3>
              <p className="text-stone-600">Our crochet flowers never wilt. They are an eco-friendly, zero-waste alternative to traditional floral arrangements.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <CheckCircle className="mx-auto text-emerald-500 mb-4" size={40} />
              <h3 className="font-bold text-xl mb-2">Premium Quality Yarn</h3>
              <p className="text-stone-600">We source only the softest, most vibrant, and highly durable yarns to ensure your gift feels as good as it looks.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <Package className="mx-auto text-purple-500 mb-4" size={40} />
              <h3 className="font-bold text-xl mb-2">Customization Available</h3>
              <p className="text-stone-600">From color palettes to specific flower types, we take custom orders to make your gift truly one of a kind.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <Truck className="mx-auto text-blue-500 mb-4" size={40} />
              <h3 className="font-bold text-xl mb-2">Pan-India Delivery</h3>
              <p className="text-stone-600">Whether you are in Mumbai, Delhi, or a remote village, Crochet Wali delivers aesthetic happiness straight to your door.</p>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTIONS & CATEGORIES */}
      <section className="py-16 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#6e132b] mb-8 text-center">Explore Our Handmade Collections</h2>
          <p className="text-center text-stone-600 max-w-3xl mx-auto mb-12 text-lg">
            Dive into our diverse range of meticulously crafted items. Whether you are looking for a statement piece for your home or a delicate accessory for your hair, we have something special for you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Collection 1 */}
            <Link to="/categories" className="group block overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all">
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600" alt="Crochet Flower Bouquets" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-6 bg-white">
                <h3 className="text-2xl font-bold text-[#6e132b] mb-2">Crochet Flower Bouquets</h3>
                <p className="text-stone-600 mb-4">Sunflowers, tulips, roses, and daisies that last a lifetime. The perfect gift for anniversaries, birthdays, and Valentine's Day.</p>
                <span className="text-rose-600 font-bold group-hover:underline">Explore Bouquets &rarr;</span>
              </div>
            </Link>

            {/* Collection 2 */}
            <Link to="/categories" className="group block overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all">
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <img src="https://images.unsplash.com/photo-1596755389378-c11d66f442b3?w=600" alt="Hair Accessories & Gajras" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-6 bg-white">
                <h3 className="text-2xl font-bold text-[#6e132b] mb-2">Hair Accessories & Gajra</h3>
                <p className="text-stone-600 mb-4">Traditional Indian aesthetics blended with modern crochet art. Our crochet gajras and floral hair clips add elegance to any outfit.</p>
                <span className="text-rose-600 font-bold group-hover:underline">Explore Accessories &rarr;</span>
              </div>
            </Link>

            {/* Collection 3 */}
            <Link to="/categories" className="group block overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all">
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600" alt="Crochet Keychains & Amigurumi" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-6 bg-white">
                <h3 className="text-2xl font-bold text-[#6e132b] mb-2">Keychains & Miniatures</h3>
                <p className="text-stone-600 mb-4">Cute, squishy, and absolutely adorable. Our amigurumi keychains are perfect for school bags, car keys, and small heartfelt gifts.</p>
                <span className="text-rose-600 font-bold group-hover:underline">Explore Keychains &rarr;</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* THE HANDMADE PROCESS */}
      <section className="py-16 bg-[#6e132b] text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-12 text-center">How Are Crochet Gifts Made?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Design & Yarn Selection</h3>
              <p className="text-white/80">We conceptualize the design and carefully select the highest quality yarn, matching colors perfectly to ensure the final product looks vibrant and lifelike.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">The Art of Crocheting</h3>
              <p className="text-white/80">Using a simple hook, our artisans spend hours looping and weaving the yarn. Every single stitch is placed with precision, love, and immense patience.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold">3</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Finishing & Packaging</h3>
              <p className="text-white/80">The crafted pieces are assembled, steamed for shape retention, and then beautifully packed into aesthetic gift boxes, ready to surprise someone special.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOM ORDERS */}
      <section className="py-16 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center border-4 border-[#fcf5ef] p-8 md:p-12 rounded-3xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#6e132b] mb-4">Looking for Something Specific?</h2>
          <p className="text-stone-600 text-lg mb-8">
            At Crochet Wali, we understand that some gifts need to be as unique as the person receiving them. Whether you want a bouquet of a specific flower that isn't listed, or an embroidery hoop with a custom name or portrait, we are here to help.
          </p>
          <Link to="/custom-design" className="inline-block bg-[#6e132b] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#4a0d1d] transition-colors shadow-lg">
            Request a Custom Design
          </Link>
        </div>
      </section>

      {/* AEO / FAQ SECTION */}
      <section className="py-16 bg-[#fcf5ef] px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#6e132b] mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold text-[#6e132b] mb-3">What is Crochet Wali?</h3>
              <p className="text-stone-700 leading-relaxed">
                <strong>Crochet Wali</strong> is India's premier destination for premium handmade crochet gifts, specializing in forever crochet flower bouquets, traditional gajras, cute keychains, and aesthetic home decor. Every piece is handcrafted with love by skilled artisans.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold text-[#6e132b] mb-3">Why buy Crochet gifts instead of fresh flowers?</h3>
              <p className="text-stone-700 leading-relaxed">
                Unlike fresh flowers that wither in a few days, handmade crochet flowers last forever. They act as a permanent keepsake and a memory of your special occasion, making them a more sustainable and meaningful gift for anniversaries, birthdays, and Valentine's Day.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold text-[#6e132b] mb-3">Are Crochet Flowers washable?</h3>
              <p className="text-stone-700 leading-relaxed">
                Yes, crochet flowers are washable! We recommend gentle hand washing with cold water and mild detergent. Do not wring them; simply press out the excess water and let them air dry flat to maintain their beautiful shape.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold text-[#6e132b] mb-3">How long does shipping take?</h3>
              <p className="text-stone-700 leading-relaxed">
                Since all our products are handmade to order, please allow 2-4 days for crafting. Once dispatched, standard shipping across India takes approximately 4-7 business days depending on your location. We provide tracking information for all orders.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-16 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#6e132b] mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-stone-50 p-8 rounded-2xl">
              <div className="flex justify-center text-yellow-400 mb-4">
                {[...Array(5)].map((_,i) => <Star key={i} fill="currentColor" size={20} />)}
              </div>
              <p className="text-stone-600 mb-4 italic">"I ordered a sunflower crochet bouquet for my girlfriend's birthday. The detailing is mind-blowing, and she absolutely loved it. Thank you Crochet Wali!"</p>
              <p className="font-bold text-[#6e132b]">- Rahul S.</p>
            </div>
            <div className="bg-stone-50 p-8 rounded-2xl">
              <div className="flex justify-center text-yellow-400 mb-4">
                {[...Array(5)].map((_,i) => <Star key={i} fill="currentColor" size={20} />)}
              </div>
              <p className="text-stone-600 mb-4 italic">"The crochet gajra is so beautiful and lightweight. I wore it for a family function and everyone kept asking where I got it from. Highly recommended!"</p>
              <p className="font-bold text-[#6e132b]">- Priya M.</p>
            </div>
            <div className="bg-stone-50 p-8 rounded-2xl">
              <div className="flex justify-center text-yellow-400 mb-4">
                {[...Array(5)].map((_,i) => <Star key={i} fill="currentColor" size={20} />)}
              </div>
              <p className="text-stone-600 mb-4 italic">"Customized a keychain with my cat's face. The similarity is uncanny and the yarn quality is super soft. Best customized gift ever."</p>
              <p className="font-bold text-[#6e132b]">- Sneha K.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
