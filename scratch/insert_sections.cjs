const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.jsx', 'utf8');

const pincodeMarker = 'Lovingly made to order • Dispatches in 3-5 working days\n                            </p>\n                        </div>';
const pincodeHTML = `
                        {/* Mobile-optimized Delivery Box */}
                        <div className="mb-2 w-full pt-2">
                            <PincodeChecker />
                        </div>`;
code = code.replace(pincodeMarker, pincodeMarker + '\n' + pincodeHTML);

const endRightColumnMarker = '                            </div>\n                        </div>\n\n                    </section>';
const perfectForBundleHTML = `
                        {/* Perfect For Section */}
                        {(info.perfectFor || !info.perfectFor) && (
                            <div className="mt-8 mb-6 block">
                                <h4 className="text-[11px] font-bold text-[#8a3c32] uppercase tracking-[0.15em] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Perfect For</h4>
                                <div className="flex flex-wrap gap-2.5">
                                    {(info.perfectFor ? info.perfectFor.split(',') : ["Birthday Gift", "Valentine's Day Gift", "Christmas Gift", "Anniversary Gift", "Kids", "Girls", "Teenagers", "Bunny Lovers", "Plush Toy Lovers", "Handmade Gift Lovers", "Room Décor", "Nursery Décor", "Cute Décor", "Gift Collection"]).map((tag, i) => (
                                        <span key={i} className="px-4 py-2 bg-white border border-[#dac1bd]/60 rounded-xl text-[12px] font-medium text-[#554340] shadow-sm hover:border-[#8a3c32]/40 transition-colors">
                                            {tag.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Order Timeline */}
                        <div className="mt-8 mb-8 lg:mb-12 block p-5 bg-[#ffffff] rounded-2xl border border-[#dac1bd]/40 shadow-sm">
                            <h4 className="text-[11px] font-bold text-[#8a3c32] uppercase tracking-[0.15em] mb-6 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>Order Journey</h4>
                            <div className="flex items-center justify-between text-center relative max-w-sm mx-auto">
                                <div className="absolute top-5 left-6 right-6 h-[1px] bg-[#dac1bd] -z-0"></div>
                                <div className="relative z-10 flex flex-col items-center gap-2 bg-[#ffffff] px-2">
                                    <div className="w-10 h-10 rounded-full bg-[#1f1b1a] text-white flex items-center justify-center shadow-sm"><ShoppingBag className="w-4 h-4" /></div>
                                    <span className="text-[11px] font-bold text-[#1f1b1a]">Order Placed</span>
                                </div>
                                <div className="relative z-10 flex flex-col items-center gap-2 bg-[#ffffff] px-2">
                                    <div className="w-10 h-10 rounded-full bg-[#f6ecea] text-[#1f1b1a] flex items-center justify-center border border-[#dac1bd]"><Star className="w-4 h-4" /></div>
                                    <span className="text-[11px] font-bold text-[#1f1b1a]">Handmade</span>
                                </div>
                                <div className="relative z-10 flex flex-col items-center gap-2 bg-[#ffffff] px-2">
                                    <div className="w-10 h-10 rounded-full bg-[#f6ecea] text-[#1f1b1a] flex items-center justify-center border border-[#dac1bd]"><Truck className="w-4 h-4" /></div>
                                    <span className="text-[11px] font-bold text-[#1f1b1a]">Shipped</span>
                                </div>
                                <div className="relative z-10 flex flex-col items-center gap-2 bg-[#ffffff] px-2">
                                    <div className="w-10 h-10 rounded-full bg-[#f6ecea] text-[#1f1b1a] flex items-center justify-center border border-[#dac1bd]"><CheckCircle2 className="w-4 h-4" /></div>
                                    <span className="text-[11px] font-bold text-[#1f1b1a]">Delivered</span>
                                </div>
                            </div>
                        </div>

                {/* Frequently Bought Together Bundle */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12 mb-8 font-sans">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcf1ef] border border-[#dac1bd]/60 text-[#8a3c32] text-[10px] font-bold uppercase tracking-widest mb-3">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Bundle & Save
                                </div>
                                <h2 className="text-[26px] font-bold text-[#1f1b1a] tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Complete the look ✨</h2>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-[#ffffff] to-[#fff8f6] rounded-2xl border border-[#dac1bd]/50 p-6 shadow-sm">
                            <div className="flex items-center gap-4 overflow-x-auto pb-6 hide-scrollbar snap-x -mx-2 px-2">
                                {/* Current Product */}
                                <div className="shrink-0 flex flex-col gap-2.5 w-28 snap-start">
                                    <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-sm border border-[#dac1bd]/40 bg-white relative">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                                    </div>
                                    <div>
                                        <div className="text-[13px] font-bold text-[#1f1b1a] truncate">This Item</div>
                                        <div className="text-[11px] text-[#87726f] font-medium">₹{currentPrice.toLocaleString('en-IN')}</div>
                                    </div>
                                </div>
                                <Plus className="w-5 h-5 text-[#dac1bd] shrink-0" />
                                
                                {/* Related Product */}
                                <div className="shrink-0 flex flex-col gap-2.5 w-28 snap-start">
                                    <Link to={getProductUrl(relatedProducts[0])} className="aspect-[4/5] rounded-xl overflow-hidden shadow-sm border border-[#dac1bd]/40 block hover:border-[#8a3c32]/50 transition-colors bg-white group relative">
                                        <img src={relatedProducts[0].image} alt={relatedProducts[0].name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" />
                                        <div className="absolute top-2 left-2 bg-[#1f1b1a]/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 rounded shadow-sm tracking-wider uppercase">Add-on</div>
                                    </Link>
                                    <div>
                                        <Link to={getProductUrl(relatedProducts[0])} className="text-[13px] font-bold text-[#1f1b1a] truncate hover:text-[#8a3c32] transition-colors block">{relatedProducts[0].name}</Link>
                                        <div className="text-[11px] text-[#87726f] font-medium">₹{relatedProducts[0].price.toLocaleString('en-IN')}</div>
                                    </div>
                                </div>
                                
                                <Plus className="w-5 h-5 text-[#dac1bd] shrink-0" />
                                
                                {/* Premium Gift Packaging */}
                                <div className="shrink-0 flex flex-col gap-2.5 w-28 snap-start">
                                    <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-sm border border-[#dac1bd]/40 bg-[#fcf1ef] flex flex-col items-center justify-center p-3 text-center relative">
                                        <span className="text-[32px] mb-2">🎁</span>
                                        <span className="text-[11px] font-bold text-[#8a3c32] leading-tight">Gift Ready Wrap</span>
                                    </div>
                                    <div>
                                        <div className="text-[13px] font-bold text-[#1f1b1a] truncate">Add-on</div>
                                        <div className="text-[11px] text-[#87726f] font-medium">₹29</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-5 border-t border-[#dac1bd]/30">
                                <div className="flex items-end justify-between mb-5">
                                    <div>
                                        <div className="text-[12px] text-[#87726f] font-medium mb-1">Total Bundle Price</div>
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-[24px] font-bold text-[#1f1b1a]">
                                                ₹{(currentPrice + relatedProducts[0].price + 29 - 49).toLocaleString('en-IN')}
                                            </span>
                                            <span className="text-[14px] text-[#87726f] line-through">
                                                ₹{(currentPrice + relatedProducts[0].price + 29).toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-[#d1e5d1] text-[#2c5332] text-[11px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">
                                        Save ₹49
                                    </div>
                                </div>

                                <button
                                    onClick={async () => {
                                        if (!validateSelection('add')) return;
                                        
                                        let relatedSize = null;
                                        let relatedColor = null;
                                        const relatedInfo = relatedProducts[0].clothingInformation;
                                        if (relatedInfo?.sizes && Object.keys(relatedInfo.sizes).length > 0) {
                                            relatedSize = Object.keys(relatedInfo.sizes)[0];
                                            if (relatedInfo.sizes['Free']) relatedSize = 'Free';
                                            else if (relatedInfo.sizes['Standard']) relatedSize = 'Standard';
                                        }
                                        
                                        if (relatedProducts[0].variants && relatedProducts[0].variants.length > 0) {
                                            relatedColor = relatedProducts[0].variants[0].color;
                                        } else if (relatedInfo?.colors && relatedInfo.colors.length > 0) {
                                            relatedColor = relatedInfo.colors[0];
                                        }

                                        const relatedVariantId = relatedProducts[0].variants && relatedProducts[0].variants.length > 0 
                                            ? relatedProducts[0].variants[0].id 
                                            : null;

                                        await addToCart({ 
                                            ...product, 
                                            selectedSize, 
                                            selectedColor, 
                                            price: currentPrice, 
                                            variantId: selectedVariant?.id, 
                                            giftPackaging: true, 
                                            giftNote: giftNote || 'Bundle Gift'
                                        });
                                        
                                        await addToCart({ 
                                            ...relatedProducts[0], 
                                            selectedSize: relatedSize,
                                            selectedColor: relatedColor,
                                            variantId: relatedVariantId,
                                            price: relatedProducts[0].price 
                                        });
                                        
                                        navigate('/cart');
                                    }}
                                    className="w-full py-4 bg-[#1f1b1a] text-white font-bold rounded-xl text-[14px] hover:bg-[#352c2a] transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-2"
                                >
                                    <ShoppingBag size={18} />
                                    Add Bundle To Cart
                                </button>
                            </div>
                        </div>
                    </div>
                )}`;
code = code.replace(endRightColumnMarker, perfectForBundleHTML + '\n\n' + endRightColumnMarker);

fs.writeFileSync('src/pages/ProductDetails.jsx', code);
console.log('Modifications completed.');
