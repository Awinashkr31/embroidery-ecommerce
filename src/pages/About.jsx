import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Flower, Sparkles, Heart, Home as HomeIcon, Calendar } from 'lucide-react';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#fdfbf7] min-h-screen font-body">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden" data-id="about-hero">
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto" data-id="about-hero-content">
             <span className="inline-block py-1 px-4 rounded-full bg-rose-50 text-rose-900 text-xs font-bold uppercase tracking-widest mb-6 border border-rose-100">The Artist Behind the Art</span>
            <h1 className="text-5xl lg:text-7xl font-heading font-bold text-stone-900 mb-8 leading-tight" data-id="about-hero-title">
              About <span className="text-rose-900 italic">Sana</span>
            </h1>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed" data-id="about-hero-subtitle">
              A passionate artist dedicated to preserving and celebrating the timeless beauty of hand embroidery and mehndi art.
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
         <div className="absolute top-0 left-0 w-96 h-96 bg-rose-100 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-stone-100 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 opacity-70"></div>
      </section>

      {/* Main Story Section */}
      <section className="py-20 bg-white" data-id="main-story">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative group" data-id="story-image-container">
              <div className="absolute inset-0 bg-rose-900 rounded-[2rem] rotate-3 group-hover:rotate-2 transition-transform opacity-10"></div>
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Sana working on embroidery"
                className="relative rounded-[2rem] shadow-xl w-full h-[500px] object-cover border-4 border-white rotate-[-3deg] group-hover:rotate-0 transition-transform duration-700"
                data-id="story-main-image" />
               <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-lg animate-bounce-slow max-w-xs border border-stone-50 hidden md:block">
                  <p className="font-heading font-bold text-lg text-rose-900 mb-1">"Crafting memories"</p>
                   <p className="text-stone-500 text-sm">One stitch at a time</p>
               </div>
            </div>

            <div data-id="story-content" className="space-y-8">
              <h2 className="text-4xl font-heading font-bold text-stone-900 leading-tight" data-id="story-title">
                My Journey with <br/><span className="text-rose-900">Thread & Henna</span>
              </h2>
              <div className="space-y-6 text-stone-600 text-lg leading-relaxed">
                <p data-id="story-para-1">
                  What started as a childhood fascination with my grandmother's intricate needlework has blossomed into a lifelong
                  passion for preserving traditional crafts. Over five years ago, I began my journey into the world of hand embroidery,
                  drawn by the meditative rhythm of needle through fabric.
                </p>
                <p data-id="story-para-2">
                  My love for mehndi art developed alongside my embroidery skills. There's something deeply satisfying about creating
                  temporary art that marks life's special moments – from weddings and festivals to simple celebrations of joy.
                </p>
                <p data-id="story-para-3">
                  Today, I'm honored to share these traditional arts with modern clients who appreciate handmade beauty. Every piece
                  I create carries not just aesthetic value, but the love, patience, and cultural heritage that make handcrafted
                  items truly special.
                </p>
              </div>
              <div className="pt-4">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Signature_sample.svg/1200px-Signature_sample.svg.png" alt="Signature" className="h-12 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills & Specialties */}
      <section className="py-24 bg-[#fdfbf7]" data-id="skills-section">
        <div className="container-custom">
          <div className="text-center mb-16" data-id="skills-header">
            <h2 className="text-4xl font-heading font-bold text-stone-900 mb-4" data-id="skills-title">
              Skills & Specialties
            </h2>
            <div className="h-1 w-24 bg-rose-900 mx-auto rounded-full mb-6"></div>
            <p className="text-stone-600 max-w-2xl mx-auto" data-id="skills-subtitle">
              Years of practice have honed these traditional techniques and modern applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-id="skills-grid">
            {[
              { icon: Scissors, name: "Hand Embroidery", desc: "French knots, chain stitch, and mixed-media techniques for decor." },
              { icon: Flower, name: "Bridal Mehndi", desc: "Intricate bridal patterns and traditional motifs that tell a story." },
              { icon: Sparkles, name: "Custom Designs", desc: "Personalized embroidery incorporating names and dates." },
              { icon: Heart, name: "Jewelry Making", desc: "Handcrafted embroidered earrings and accessories." },
              { icon: HomeIcon, name: "Home Decor", desc: "Wall art and cushion covers that bring warmth to living spaces." },
              { icon: Calendar, name: "Event Mehndi", desc: "Festival designs and group sessions for celebrations." }
            ].map((skill, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 hover:shadow-xl hover:-translate-y-1 transition-all group duration-300">
                  <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-rose-900 group-hover:text-white transition-colors duration-300">
                    <skill.icon className="w-8 h-8 text-rose-900 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-stone-900 mb-3 group-hover:text-rose-900 transition-colors">{skill.name}</h3>
                  <p className="text-stone-500 leading-relaxed">
                    {skill.desc}
                  </p>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-stone-900 text-white relative overflow-hidden" data-id="cta-section">
          {/* Background pattern */}
         <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>

        <div className="container-custom text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-heading font-bold mb-8" data-id="cta-title">
            Let's Create Something <span className="text-rose-400 italic">Beautiful</span> Together
          </h2>
          <p className="text-xl text-stone-300 mb-10 max-w-2xl mx-auto" data-id="cta-description">
            Whether you're looking for a special gift, custom embroidery, or beautiful mehndi for your celebration.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center" data-id="cta-buttons">
            <Link to="/custom-design"
              className="px-8 py-4 bg-rose-900 text-white rounded-full font-bold uppercase tracking-widest hover:bg-rose-800 transition-colors shadow-lg shadow-rose-900/40">
              Request Custom Design
            </Link>
            <Link to="/contact"
              className="px-8 py-4 bg-transparent border-2 border-stone-700 text-white rounded-full font-bold uppercase tracking-widest hover:bg-white hover:text-stone-900 transition-all">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
