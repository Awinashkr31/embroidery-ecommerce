// Fallback images for category cards when no products have images yet
export const getCategoryFallbackImage = (categoryId) => {
    const slug = (categoryId || '').toLowerCase().trim();
    
    const imageMap = {
        'hair-accessories': '/category-images/hair-accessories.png',
        'hair clips': '/category-images/hair-accessories.png', // DB id: "Hair clips"
        'hair-clips': '/category-images/hair-accessories.png',
        'embroidery': '/category-images/hair-accessories.png', // DB id: "embroidery"
        'embroidery-hair-clips': '/category-images/hair-accessories.png',
        'rubber-bands': '/category-images/hair-accessories.png', // DB id: "rubber-bands"
        'parandi': '/category-images/hair-accessories.png', // DB id: "parandi"
        'claw-clip': '/category-images/hair-accessories.png', // DB id: "claw-clip"
        'bow': '/category-images/hair-accessories.png', // DB id: "bow"
        
        'gajray': '/category-images/gajra.png', // DB id: "gajray"
        'gajra': '/category-images/gajra.png',
        
        'gift-box': '/category-images/gift-box.png', // DB id: "gift-box"
        
        'bouquet': '/category-images/bouquet.png', // DB id: "bouquet"
        
        'handmade keychain': '/category-images/handmade-keychain.png', // DB id: "handmade keychain"
        
        'flower-pot': '/category-images/flower-pots.png', // DB id: "flower-pot"
        'flower-pots': '/category-images/flower-pots.png',
        
        'flowers': '/category-images/flower.png', // DB id: "flowers"
        'flower': '/category-images/flower.png'
    };

    return imageMap[slug] || '/logo.png'; // default fallback for unknown new categories
};
