import React, { useState } from 'react';
import { X } from 'lucide-react';

const GALLERY_IMAGES = [
  { id: 1, src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop", type: "embroidery", title: "Floral Hoop" },
  { id: 2, src: "https://images.unsplash.com/photo-1594736797933-d0f9dd8b4d40?w=600&h=600&fit=crop", type: "mehndi", title: "Bridal Hands" },
  { id: 3, src: "https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=600&h=400&fit=crop", type: "embroidery", title: "Cushion Cover" },
  { id: 4, src: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop", type: "jewellery", title: "Silk Earrings" },
  { id: 5, src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=800&fit=crop", type: "embroidery", title: "Table Runner" },
  { id: 6, src: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=600&fit=crop", type: "decor", title: "Wall Art" },
  { id: 7, src: "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=600&h=400&fit=crop", type: "accessories", title: "Hair Clips" },
  { id: 8, src: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&h=800&fit=crop", type: "embroidery", title: "Botanical Art" },
];

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'embroidery', label: 'Embroidery' },
  { id: 'mehndi', label: 'Mehndi' },
  { id: 'decor', label: 'Home Decor' },
  { id: 'jewellery', label: 'Jewellery' }
];

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredImages = activeFilter === 'all' 
    ? GALLERY_IMAGES 
    : GALLERY_IMAGES.filter(img => img.type === activeFilter);

  return (
    <div className="bg-white min-h-screen font-sofia py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-light text-gray-800 mb-6">
            Our <span className="text-deep-rose">Gallery</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            A curated collection of our finest work, showcasing the intricate details and passion put into every piece.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {FILTER_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === tab.id
                    ? 'bg-deep-rose text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry-style Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {filteredImages.map(image => (
            <div 
              key={image.id} 
              className="break-inside-avoid group relative rounded-2xl overflow-hidden cursor-zoom-in shadow-sm hover:shadow-xl transition-all"
              onClick={() => setSelectedImage(image)}
            >
              <img 
                src={image.src} 
                alt={image.title}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white font-medium text-lg tracking-wide">{image.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
             onClick={() => setSelectedImage(null)}>
          <button 
            className="absolute top-4 right-4 text-white hover:text-rose-gold transition-colors p-2"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          
          <div className="max-w-4xl w-full max-h-[90vh] relative" onClick={e => e.stopPropagation()}>
            <img 
              src={selectedImage.src} 
              alt={selectedImage.title}
              className="w-full h-full object-contain rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white rounded-b-lg">
              <h3 className="text-xl font-medium">{selectedImage.title}</h3>
              <p className="text-sm text-gray-300 capitalize">{selectedImage.type}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
