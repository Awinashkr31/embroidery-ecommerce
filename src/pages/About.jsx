import React, { useState, useEffect } from 'react';
import { fetchSetting } from '../utils/settingsUtils';
import { Link } from 'react-router-dom';
import { Scissors, Flower, Sparkles, Heart, Home as HomeIcon, Calendar, ArrowRight, Instagram } from 'lucide-react';

const About = () => {
  const [storyImage, setStoryImage] = useState("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
  const [heroTitle, setHeroTitle] = useState("About Sana");
  const [heroSubtitle, setHeroSubtitle] = useState("A passionate artist dedicated to preserving and celebrating the timeless beauty of hand embroidery and mehndi art.");
  const [storyTitle, setStoryTitle] = useState("My Journey with Thread & Henna");
  const [storyText, setStoryText] = useState("What started as a childhood fascination with my grandmother's intricate needlework has blossomed into a lifelong passion for preserving traditional crafts.");
  const [signatureImage, setSignatureImage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadSettings = async () => {
        const image = await fetchSetting('about_story_image');
        if (image) setStoryImage(image);

        const hTitle = await fetchSetting('about_hero_title');
        if (hTitle) setHeroTitle(hTitle);

        const hSubtitle = await fetchSetting('about_hero_subtitle');
        if (hSubtitle) setHeroSubtitle(hSubtitle);

        const sTitle = await fetchSetting('about_story_title');
        if (sTitle) setStoryTitle(sTitle);

        const sText = await fetchSetting('about_story_text');
        if (sText) setStoryText(sText);

        const sSig = await fetchSetting('about_signature_image');
        if (sSig) setSignatureImage(sSig);
    };
    loadSettings();
  }, []);

  return (
    <div className="bg-[#fcfaf8] min-h-screen font-body selection:bg-rose-100 selection:text-rose-900">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
         {/* Background with parallax-like static fix */}
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-fixed"></div>
         <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px]"></div>

         <div className="container-custom relative z-10 text-center px-6">
            <span className="inline-block py-1 px-4 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 text-xs font-bold uppercase tracking-[0.2em] mb-6 animate-fade-in-up">
                The Artist
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white mb-8 leading-tight tracking-tight animate-fade-in-up delay-100">
                {heroTitle}
            </h1>
            <p className="text-xl md:text-2xl text-stone-200 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up delay-200 border-l-4 border-rose-500 pl-6 text-left md:text-center md:border-l-0 md:pl-0">
               {heroSubtitle}
            </p>
         </div>

         {/* Scroll indicator */}
         <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
            <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white to-transparent"></div>
         </div>
      </section>

      {/* 2. STORY SECTION */}
      <section className="py-24 relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-rose-50/50 -skew-x-12 translate-x-1/4 -z-10"></div>

        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Image Side */}
            <div className="relative group animate-on-scroll">
                <div className="absolute top-4 left-4 w-full h-full border-2 border-rose-900/10 rounded-[2rem] -z-10 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2"></div>
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
                    <img 
                        src={storyImage} 
                        alt="Sana Artist" 
                        className="w-full h-[600px] object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent opacity-60"></div>
                    
                    <div className="absolute bottom-8 left-8 text-white">
                        <p className="font-heading text-3xl font-bold mb-2">Artistry in every stitch</p>
                        <div className="h-1 w-12 bg-rose-500"></div>
                    </div>
                </div>
                
                {/* Floating Card */}
                <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-xl shadow-xl max-w-xs hidden md:block animate-move-y">
                     <div className="flex items-center gap-4 mb-3">
                        <div className="bg-rose-100 p-2 rounded-full">
                            <Heart className="w-5 h-5 text-rose-600" />
                        </div>
                        <div>
                            <span className="block font-bold text-stone-900">Passion Driven</span>
                            <span className="text-xs text-stone-500">Since 2018</span>
                        </div>
                     </div>
                     <p className="text-sm text-stone-600 italic">"Design is not just what it looks like, it's how it feels."</p>
                </div>
            </div>

            {/* Text Side */}
            <div className="space-y-8 animate-on-scroll">
               <h2 className="text-4xl md:text-5xl font-heading font-bold text-stone-900 leading-tight">
                  {storyTitle}
               </h2>
               <div className="space-y-6 text-stone-600 text-lg leading-relaxed font-light">
                   <p className="whitespace-pre-line">
                       {storyText}
                   </p>
                   <p>
                       Every piece I create is infused with mindfulness and dedication. Whether it's the intricate flow of henna on a bride's hand or the delicate thread work on a hoop, my goal is to create something that resonates with your soul.
                   </p>
               </div>

               <div className="pt-8 flex items-center gap-8">
                   {signatureImage && (
                       <img src={signatureImage} alt="Signature" className="h-16 opacity-80 invert-0" />
                   )}
                   
                   <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-rose-900 font-bold hover:gap-4 transition-all">
                       <Instagram className="w-5 h-5" /> Follow My Journey <ArrowRight className="w-4 h-4" />
                   </a>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SKILLS GRID */}
      <section className="py-24 bg-stone-900 text-white relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-20 max-w-2xl mx-auto">
             <span className="text-rose-400 font-bold tracking-widest text-sm uppercase mb-3 block">Expertise</span>
             <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Mastery & Craft</h2>
             <p className="text-stone-400 text-lg">Blending traditional Indian artistry with contemporary aesthetics across multiple mediums.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[
               { icon: Scissors, name: "Hand Embroidery", desc: "Detailed French knots, satin stitch, and intricate thread painting." },
               { icon: Flower, name: "Bridal Mehndi", desc: "Customized bridal henna with intricate storytelling figures." },
               { icon: Sparkles, name: "Custom Designs", desc: "Bespoke creations tailored to your specific vision and occasion." },
               { icon: Heart, name: "Jewelry Making", desc: "Handcrafted embroidered earrings, necklaces and accessories." },
               { icon: HomeIcon, name: "Home Interior", desc: "Artistic hoops and textiles to elevate your living space." },
               { icon: Calendar, name: "Workshops", desc: "Teaching the art of embroidery and henna to the next generation." }
             ].map((skill, i) => (
                 <div key={i} className="group bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-rose-900 hover:border-rose-800 transition-all duration-300 hover:-translate-y-2">
                     <div className="mb-6 inline-flex p-3 rounded-lg bg-white/10 text-rose-300 group-hover:bg-white group-hover:text-rose-900 transition-colors">
                         <skill.icon className="w-6 h-6" />
                     </div>
                     <h3 className="text-xl font-bold mb-3 font-heading">{skill.name}</h3>
                     <p className="text-stone-400 group-hover:text-rose-100 text-sm leading-relaxed">{skill.desc}</p>
                 </div>
             ))}
          </div>
        </div>
      </section>

      {/* 4. CTA */}
      <section className="py-24 bg-rose-50">
          <div className="container-custom">
              <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-xl border border-rose-100 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-400 via-rose-600 to-rose-900"></div>
                  
                  <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                      <h2 className="text-4xl md:text-6xl font-heading font-bold text-stone-900">
                          Ready to create something <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-900">timeless?</span>
                      </h2>
                      <p className="text-xl text-stone-600">
                          From bridal henna to custom embroidered hoops, let's bring your vision to life with elegance and precision.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link to="/custom-design" className="px-10 py-4 bg-rose-900 text-white rounded-full font-bold shadow-lg shadow-rose-900/30 hover:shadow-xl hover:-translate-y-1 transition-all">
                            Start a Project
                        </Link>
                        <Link to="/contact" className="px-10 py-4 bg-white text-stone-900 border-2 border-stone-200 rounded-full font-bold hover:border-rose-900 hover:text-rose-900 transition-all">
                            Contact Me
                        </Link>
                      </div>
                  </div>
              </div>
          </div>
      </section>

    </div>
  );
};

export default About;
