import { useState, useEffect } from 'react';

const CustomHeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full overflow-hidden aspect-[2.0/1] md:aspect-[2.3/1] border-b-[4px] md:border-b-[8px] border-white group">
       
       {/* Slide 0: Handmade Beauty Sale */}
       <div className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === 0 ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'} bg-[#fdf0e6] flex flex-row items-center`}>
           <div 
             className="absolute top-0 right-0 bottom-0 w-[55%] bg-[#831828] overflow-hidden" 
             style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }}
           >
              <img 
                 src="/assets/hero_crochet_1.webp" 
                 alt="Handmade Beauty Sale" 
                 className="w-full h-full object-cover object-center opacity-90 hover:scale-105 transition-transform duration-1000" 
              />
              <div className="absolute inset-0 bg-[#831828]/10 mix-blend-multiply"></div>
           </div>

           <div className="relative z-10 flex flex-col justify-center w-[60%] md:w-[50%] h-full py-4 md:py-8 pl-6 md:pl-12 lg:pl-16">
               <div className="flex flex-col items-start w-max">
                   <h2 className="font-serif italic text-[#831828] text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-none mb-1 md:mb-2 drop-shadow-sm whitespace-nowrap" style={{ fontFamily: 'Georgia, serif' }}>
                      Handmade Beauty Sale
                   </h2>
                   <div className="flex gap-2 items-center w-full justify-center opacity-70">
                      <div className="h-[1px] w-8 md:w-12 bg-[#831828]"></div>
                      <Heart className="w-3 h-3 md:w-4 md:h-4 text-[#831828]" fill="#831828" />
                      <div className="h-[1px] w-8 md:w-12 bg-[#831828]"></div>
                   </div>
               </div>

               <div className="flex flex-col items-start mt-4 md:mt-6">
                   <span className="font-bold text-[#831828] text-sm sm:text-base md:text-lg lg:text-xl tracking-widest leading-none mb-2">UP TO</span>
                   
                   <div className="flex items-start text-[#831828] font-black leading-none drop-shadow-md">
                       <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl tracking-tighter leading-[0.85]">50</span>
                       <div className="flex flex-col text-sm sm:text-lg md:text-xl lg:text-2xl mx-1 md:mx-2 mt-2 md:mt-4 opacity-90">
                          <span>%</span>
                          <span className="text-center font-bold">-</span>
                       </div>
                       <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl tracking-tighter leading-[0.85] text-white drop-shadow-xl z-20">80</span>
                       <div className="flex flex-col text-sm sm:text-base md:text-lg lg:text-xl ml-1 md:ml-2 mt-4 md:mt-8 z-20">
                          <span className="text-white drop-shadow-md">%</span>
                          <span className="text-white tracking-widest mt-1 drop-shadow-md">OFF</span>
                       </div>
                   </div>

                   <div className="mt-4 md:mt-6 w-full max-w-[90%] md:max-w-[80%] z-20">
                       <p className="text-stone-800 font-medium text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed tracking-wide">
                           Unique handcrafted gifts<br/>for every occasion
                       </p>
                   </div>

                   <div className="w-full flex justify-start mt-6 md:mt-8 z-20 mb-4 md:mb-6">
                       <Link to="/shop" className="bg-[#831828] text-white font-bold uppercase text-xs sm:text-sm md:text-base px-6 py-2 md:px-8 md:py-3 rounded-full hover:bg-[#5a111f] hover:shadow-xl transition-all flex items-center gap-2 group tracking-wider">
                          SHOP NOW <span className="group-hover:translate-x-1 transition-transform">{'>'}</span>
                       </Link>
                   </div>
               </div>
               
               <div className="flex justify-start gap-4 sm:gap-6 md:gap-8 lg:gap-10 text-[#831828] mt-auto pt-4">
                  <div className="flex flex-col items-center">
                     <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-[2px] border-[#831828] rounded-full flex items-center justify-center mb-2">
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" strokeWidth={2} />
                     </div>
                     <span className="text-[8px] sm:text-[9px] md:text-[11px] font-semibold tracking-widest text-center uppercase leading-tight">HANDMADE<br/>WITH LOVE</span>
                  </div>
                  <div className="flex flex-col items-center">
                     <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-[2px] border-[#831828] rounded-full flex items-center justify-center mb-2">
                        <Gift className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" strokeWidth={2} />
                     </div>
                     <span className="text-[8px] sm:text-[9px] md:text-[11px] font-semibold tracking-widest text-center uppercase leading-tight">UNIQUE &<br/>PERSONALISED</span>
                  </div>
                  <div className="flex flex-col items-center">
                     <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-[2px] border-[#831828] rounded-full flex items-center justify-center mb-2">
                        <Diamond className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" strokeWidth={2} />
                     </div>
                     <span className="text-[8px] sm:text-[9px] md:text-[11px] font-semibold tracking-widest text-center uppercase leading-tight">PREMIUM<br/>QUALITY</span>
                  </div>
               </div>
           </div>
       </div>

       {/* Slide 1: Handmade Crochet Sale */}
       <div className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === 1 ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'} bg-[#fdf0e6] flex flex-row items-center`}>
           <div 
             className="absolute top-0 right-0 bottom-0 w-[55%] bg-[#831828] overflow-hidden" 
             style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }}
           >
              <img 
                 src="/assets/hero_crochet_2.webp" 
                 alt="Handmade Crochet Gifts" 
                 className="w-full h-full object-cover object-center opacity-90 hover:scale-105 transition-transform duration-1000" 
              />
              <div className="absolute inset-0 bg-[#831828]/10 mix-blend-multiply"></div>
           </div>

           <div className="relative z-10 flex flex-col justify-center w-[60%] md:w-[50%] h-full py-4 md:py-8 pl-6 md:pl-12 lg:pl-16">
               <div className="flex flex-col items-start w-max">
                   <h2 className="font-serif italic text-[#831828] text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-none mb-1 md:mb-2 drop-shadow-sm whitespace-nowrap" style={{ fontFamily: 'Georgia, serif' }}>
                      Handmade Crochet Sale
                   </h2>
                   <div className="flex gap-2 items-center w-full justify-center opacity-70">
                      <div className="h-[1px] w-8 md:w-12 bg-[#831828]"></div>
                      <Heart className="w-3 h-3 md:w-4 md:h-4 text-[#831828]" fill="#831828" />
                      <div className="h-[1px] w-8 md:w-12 bg-[#831828]"></div>
                   </div>
               </div>

               <div className="flex flex-col items-start mt-4 md:mt-6">
                   <span className="font-bold text-[#831828] text-sm sm:text-base md:text-lg lg:text-xl tracking-widest leading-none mb-2">UP TO</span>
                   
                   <div className="flex items-start text-[#831828] font-black leading-none drop-shadow-md">
                       <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl tracking-tighter leading-[0.85]">50</span>
                       <div className="flex flex-col text-sm sm:text-lg md:text-xl lg:text-2xl mx-1 md:mx-2 mt-2 md:mt-4 opacity-90">
                          <span>%</span>
                          <span className="text-center font-bold">-</span>
                       </div>
                       <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl tracking-tighter leading-[0.85] text-white drop-shadow-xl z-20">80</span>
                       <div className="flex flex-col text-sm sm:text-base md:text-lg lg:text-xl ml-1 md:ml-2 mt-4 md:mt-8 z-20">
                          <span className="text-white drop-shadow-md">%</span>
                          <span className="text-white tracking-widest mt-1 drop-shadow-md">OFF</span>
                       </div>
                   </div>

                   <div className="mt-4 md:mt-6 w-full max-w-[90%] md:max-w-[80%] z-20">
                       <p className="text-stone-800 font-medium text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed tracking-wide">
                           Unique crochet gifts<br/>made with love
                       </p>
                   </div>

                   <div className="w-full flex justify-start mt-6 md:mt-8 z-20 mb-4 md:mb-6">
                       <Link to="/shop" className="bg-[#831828] text-white font-bold uppercase text-xs sm:text-sm md:text-base px-6 py-2 md:px-8 md:py-3 rounded-full hover:bg-[#5a111f] hover:shadow-xl transition-all flex items-center gap-2 group tracking-wider">
                          SHOP NOW <span className="group-hover:translate-x-1 transition-transform">{'>'}</span>
                       </Link>
                   </div>
               </div>
               
               <div className="flex justify-start gap-4 sm:gap-6 md:gap-8 lg:gap-10 text-[#831828] mt-auto pt-4">
                  <div className="flex flex-col items-center">
                     <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-[2px] border-[#831828] rounded-full flex items-center justify-center mb-2">
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" strokeWidth={2} />
                     </div>
                     <span className="text-[8px] sm:text-[9px] md:text-[11px] font-semibold tracking-widest text-center uppercase leading-tight">HANDMADE<br/>WITH LOVE</span>
                  </div>
                  <div className="flex flex-col items-center">
                     <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-[2px] border-[#831828] rounded-full flex items-center justify-center mb-2">
                        <Gift className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" strokeWidth={2} />
                     </div>
                     <span className="text-[8px] sm:text-[9px] md:text-[11px] font-semibold tracking-widest text-center uppercase leading-tight">UNIQUE &<br/>PERSONALISED</span>
                  </div>
                  <div className="flex flex-col items-center">
                     <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-[2px] border-[#831828] rounded-full flex items-center justify-center mb-2">
                        <Diamond className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" strokeWidth={2} />
                     </div>
                     <span className="text-[8px] sm:text-[9px] md:text-[11px] font-semibold tracking-widest text-center uppercase leading-tight">PREMIUM<br/>QUALITY</span>
                  </div>
               </div>
           </div>
       </div>

      {/* Slider Controls */}
      <button 
        onClick={() => setCurrentSlide(prev => prev === 0 ? 1 : 0)} 
        className="absolute left-[2vw] top-1/2 -translate-y-1/2 w-[4vw] h-[4vw] min-w-[32px] min-h-[32px] bg-white/30 hover:bg-white/70 backdrop-blur-sm text-stone-800 rounded-full flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
      >
        <span className="text-xl md:text-3xl leading-none font-bold -ml-1">‹</span>
      </button>
      <button 
        onClick={() => setCurrentSlide(prev => prev === 0 ? 1 : 0)} 
        className="absolute right-[2vw] top-1/2 -translate-y-1/2 w-[4vw] h-[4vw] min-w-[32px] min-h-[32px] bg-white/30 hover:bg-white/70 backdrop-blur-sm text-stone-800 rounded-full flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
      >
        <span className="text-xl md:text-3xl leading-none font-bold -mr-1">›</span>
      </button>

      {/* Slider Dots */}
      <div className="absolute bottom-[1.5vw] left-0 w-full flex justify-center gap-[1vw] z-30">
          <button onClick={() => setCurrentSlide(0)} className={`w-[1vw] h-[1vw] min-w-[8px] min-h-[8px] rounded-full transition-colors shadow-sm cursor-pointer ${currentSlide === 0 ? 'bg-stone-800 scale-125' : 'bg-stone-300 hover:bg-stone-500'}`}></button>
          <button onClick={() => setCurrentSlide(1)} className={`w-[1vw] h-[1vw] min-w-[8px] min-h-[8px] rounded-full transition-colors shadow-sm cursor-pointer ${currentSlide === 1 ? 'bg-stone-800 scale-125' : 'bg-stone-300 hover:bg-stone-500'}`}></button>
      </div>

    </section>
  );
};

export default CustomHeroBanner;
