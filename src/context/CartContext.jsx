import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  // Initialize cart from local storage for initial render
  const [cart, setCart] = useState(() => {
    try {
      const localCart = localStorage.getItem('cart');
      return localCart ? JSON.parse(localCart) : [];
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
      return [];
    }
  });

  // Fetch cart when user logs in
  useEffect(() => {
    let mounted = true;

    const fetchRemoteCart = async () => {
        if (!currentUser?.uid) return;
        
        try {
            // Check for local items to merge
            const localCartStr = localStorage.getItem('cart');
            if (localCartStr) {
                const localCart = JSON.parse(localCartStr);
                if (localCart.length > 0) {
                    // Merge logic: Add local items to Supabase
                    for (const item of localCart) {
                        try {
                             // Check if item already exists in DB to update quantity
                             let query = supabase
                                .from('cart_items')
                                .select('quantity, id')
                                .eq('user_id', currentUser.uid)
                                .eq('product_id', item.id);
                             
                             if (item.selectedSize) {
                                 query = query.eq('selected_size', item.selectedSize);
                             } else {
                                 query = query.is('selected_size', null);
                             }
                             
                             if (item.selectedColor) {
                                 query = query.eq('selected_color', item.selectedColor);
                             } else {
                                 query = query.is('selected_color', null);
                             }
                             
                             const { data: existing } = await query.single();

                             if (existing) {
                                 await supabase
                                    .from('cart_items')
                                    .update({ quantity: existing.quantity + item.quantity })
                                    .eq('id', existing.id);
                             } else {
                                 await supabase
                                    .from('cart_items')
                                    .insert({ 
                                        user_id: currentUser.uid, 
                                        product_id: item.id, 
                                        quantity: item.quantity,
                                        selected_size: item.selectedSize || null,
                                        selected_color: item.selectedColor || null
                                    });
                             }
                        } catch (err) {
                            console.error(`Failed to merge item ${item.id}`, err);
                        }
                    }
                    // Clear local cart after merging
                    localStorage.removeItem('cart');
                }
            }

            const { data, error } = await supabase
                .from('cart_items')
                .select('*, products(*)')
                .eq('user_id', currentUser.uid);

            if (error) throw error;

            if (data && mounted) {
                // Merge remote cart items. 
                // Note: The structure from DB join is slightly different (product details in 'products').
                // We need to flatten it to match existing app structure { ...product, quantity }.
                const mappedCart = data.map(item => {
                    const p = item.products;
                    // Calculate Variant Price
                    let finalPrice = p.price;
                    if (p.clothingInformation?.variantStock && item.selected_size && item.selected_color) {
                        const key = `${item.selected_color}-${item.selected_size}`;
                        const variant = p.clothingInformation.variantStock[key];
                        if (variant && variant.price) {
                            finalPrice = parseInt(variant.price);
                        }
                    }

                    return {
                        ...p,
                        price: finalPrice, // Override base price
                        quantity: item.quantity,
                        selectedSize: item.selected_size,
                        selectedColor: item.selected_color,
                        cartItemId: item.id
                    };
                });
                setCart(mappedCart);
            }
        } catch (error) {
            console.error('Error fetching remote cart:', error);
        }
    };

    if (currentUser) {
        fetchRemoteCart();
    } else {
        // Load local cart if no user
        try {
            const localCart = localStorage.getItem('cart');
            if (localCart) setCart(JSON.parse(localCart));
        } catch (e) {
            console.error(e);
        }
    }

    return () => { mounted = false; };
  }, [currentUser]);

  // Sync to local storage only if guest
  useEffect(() => {
    if (!currentUser) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, currentUser]);

  const addToCart = async (product) => {
    // Check Stock
    // UNIQUE IDENTIFIER: Product ID + Selected Size + Selected Color
    const currentItem = cart.find(item => 
        item.id === product.id && 
        item.selectedSize === product.selectedSize &&
        item.selectedColor === product.selectedColor
    );
    const currentQty = currentItem ? currentItem.quantity : 0;
    
    let availableStock = 100;
    if (product.clothingInformation?.sizes && product.selectedSize) {
        availableStock = product.clothingInformation.sizes[product.selectedSize] || 0;
    } else {
         availableStock = product.stock !== undefined ? product.stock : (product.stock_quantity !== undefined ? product.stock_quantity : 100);
    }

    if (currentQty + 1 > availableStock) {
        addToast(`Cannot add more. Only ${availableStock} items in stock.`, 'error');
        return false;
    }

    // Optimistic Update
    setCart(prevCart => {
      const existingItem = prevCart.find(item => 
          item.id === product.id && 
          item.selectedSize === product.selectedSize &&
          item.selectedColor === product.selectedColor
      );
      if (existingItem) {
        return prevCart.map(item =>
          (item.id === product.id && item.selectedSize === product.selectedSize && item.selectedColor === product.selectedColor)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });

    // DB Sync
    if (currentUser?.uid) {
        try {
            // Check if exists in DB to update or insert
            let query = supabase
                .from('cart_items')
                .select('*')
                .eq('user_id', currentUser.uid)
                .eq('product_id', product.id);
            
            if (product.selectedSize) {
                query = query.eq('selected_size', product.selectedSize);
            } else {
                query = query.is('selected_size', null);
            }

            if (product.selectedColor) {
                query = query.eq('selected_color', product.selectedColor);
            } else {
                query = query.is('selected_color', null);
            }

            const { data: existingItems } = await query;
            const existingItem = existingItems && existingItems.length > 0 ? existingItems[0] : null;

            if (existingItem) {
                 await supabase
                    .from('cart_items')
                    .update({ quantity: existingItem.quantity + 1 })
                    .eq('id', existingItem.id);
            } else {
                await supabase
                    .from('cart_items')
                    .insert({ 
                        user_id: currentUser.uid, 
                        product_id: product.id, 
                        quantity: 1,
                        selected_size: product.selectedSize || null,
                        selected_color: product.selectedColor || null
                    });
            }
        } catch (error) {
            console.error("Error syncing cart add:", error);
        }
    }
    return true;
  };

  const removeFromCart = async (productId, selectedSize = null, selectedColor = null) => {
    setCart(prevCart => prevCart.filter(item => !(item.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor)));
    
    if (currentUser?.uid) {
        try {
            let query = supabase
                .from('cart_items')
                .delete()
                .eq('user_id', currentUser.uid)
                .eq('product_id', productId);
            
            if (selectedSize) {
                query = query.eq('selected_size', selectedSize);
            } else {
                query = query.is('selected_size', null);
            }
            
            if (selectedColor) {
                query = query.eq('selected_color', selectedColor);
            } else {
                query = query.is('selected_color', null);
            }
            
            await query;
        } catch (error) {
            console.error("Error removing from cart DB:", error);
        }
    }
  };

  const updateQuantity = async (productId, quantity, selectedSize = null, selectedColor = null) => {
    if (quantity < 1) {
      removeFromCart(productId, selectedSize, selectedColor);
      return;
    }

    // Check Stock for increase
    const item = cart.find(i => i.id === productId && i.selectedSize === selectedSize && i.selectedColor === selectedColor);
    
    if (item && quantity > item.quantity) { 
        let availableStock = 100;
        if (item.clothingInformation?.sizes && item.selectedSize) {
            availableStock = item.clothingInformation.sizes[item.selectedSize] || 0;
        } else {
            availableStock = item.stock !== undefined ? item.stock : (item.stock_quantity !== undefined ? item.stock_quantity : 100);
        }
        
        if (quantity > availableStock) {
            addToast(`Cannot add more. Only ${availableStock} items in stock.`, 'error');
            return;
        }
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        (item.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor)
          ? { ...item, quantity: Number(quantity) }
          : item
      )
    );

    if (currentUser?.uid) {
        try {
            let query = supabase
                .from('cart_items')
                .update({ quantity: Number(quantity) })
                .eq('user_id', currentUser.uid)
                .eq('product_id', productId);
            
            if (selectedSize) {
                query = query.eq('selected_size', selectedSize);
            } else {
                query = query.is('selected_size', null);
            }

            if (selectedColor) {
                query = query.eq('selected_color', selectedColor);
            } else {
                query = query.is('selected_color', null);
            }

            await query;
        } catch (error) {
             console.error("Error updating cart quantity:", error);
        }
    }
  };

  const clearCart = async () => {
    setCart([]);
    if (currentUser?.uid) {
        await supabase.from('cart_items').delete().eq('user_id', currentUser.uid);
    }
  };

  // Order Management
  const placeOrder = async (userDetails = {}, paymentOverrides = {}) => {
    // Basic validation
    if (cart.length === 0) throw new Error("Cart is empty");

    const newOrder = {
      // let Supabase generate ID
      customer_name: `${userDetails.firstName} ${userDetails.lastName}`,
      customer_email: userDetails.email,
      customer_phone: userDetails.phone,
      shipping_address: {
        address: userDetails.address,
        city: userDetails.city,
        state: userDetails.state,
        zipCode: userDetails.zipCode
      },
      items: cart,
      subtotal: subtotal,
      shipping_cost: shippingCharge,
      discount: discountAmount,
      total: cartTotal,
      status: 'pending',
      payment_method: userDetails.paymentMethod,
      payment_status: paymentOverrides.status || 'pending', // Use override or default
      payment_id: paymentOverrides.paymentId || null // Store Razorpay ID if provided
    };

    try {
      const { data, error } = await supabase
        .rpc('place_order', { order_data: newOrder });
        
      if (error) throw error;
      
      clearCart();
      return data;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  };


  const [coupons, setCoupons] = useState(() => {
    try {
      const localCoupons = localStorage.getItem('coupons');
      return localCoupons ? JSON.parse(localCoupons) : [];
    } catch (error) {
       console.error('Error parsing coupons', error);
       return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    localStorage.setItem('coupons', JSON.stringify(coupons));
  }, [coupons]);

  const addCoupon = (coupon) => {
    setCoupons(prev => [...prev, { ...coupon, id: Date.now() }]);
  };

  const deleteCoupon = (id) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const applyCoupon = (code) => {
    const coupon = coupons.find(c => c.code === code);
    if (!coupon) {
      throw new Error('Invalid coupon code');
    }
    // Check expiry
    if (new Date(coupon.expiry) < new Date()) {
      throw new Error('Coupon has expired');
    }
    // Check Start Date
    if (coupon.startDate && new Date(coupon.startDate) > new Date()) {
        throw new Error(`Coupon is valid from ${new Date(coupon.startDate).toLocaleDateString()}`);
    }

    // Check Min Order
    const currentSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    if (coupon.minOrder && currentSubtotal < coupon.minOrder) {
        throw new Error(`Minimum order of ₹${coupon.minOrder} required`);
    }

    // Check Category Eligibility (Optional: Throw error if no eligible items? Or just apply £0?)
    // Better UX: Warn if no eligible items.
    if (coupon.includedCategories && coupon.includedCategories.length > 0) {
        const hasEligibleItem = cart.some(item => coupon.includedCategories.includes(item.category));
        if (!hasEligibleItem) {
             throw new Error(`Coupon only applicable on: ${coupon.includedCategories.join(', ')}`);
        }
    }

    setAppliedCoupon(coupon);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Address Management
  const [savedAddresses, setSavedAddresses] = useState([]);

  // Helper to map DB columns to App fields
  const mapAddressFromDB = (addr) => ({
    id: addr.id,
    userId: addr.user_id,
    firstName: addr.first_name,
    lastName: addr.last_name,
    phone: addr.phone,
    address: addr.address,
    city: addr.city,
    state: addr.state,
    zipCode: addr.zip_code,
    isDefault: addr.is_default
  });

  useEffect(() => {
    let mounted = true;
    const fetchAddresses = async () => {
      if (currentUser?.uid) {
        try {
          const { data, error } = await supabase
            .from('addresses')
            .select('*')
            .eq('user_id', currentUser.uid)
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error fetching addresses:', error);
            return;
          }

          if (data && mounted) {
            const mapped = data.map(mapAddressFromDB);
            setSavedAddresses(mapped);
          }
        } catch (error) {
          console.error("Supabase fetch error:", error);
        }
      } else {
        if (mounted) setSavedAddresses([]);
      }
    };

    fetchAddresses();

    return () => {
      mounted = false;
    };
  }, [currentUser]);

  const saveAddress = async (address, userId) => {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .insert([{
          user_id: userId,
          first_name: address.firstName,
          last_name: address.lastName,
          phone: address.phone,
          address: address.address,
          city: address.city,
          state: address.state,
          zip_code: address.zipCode
        }])
        .select()
        .single();

      if (error) throw error;
      
      const newAddress = mapAddressFromDB(data);
      setSavedAddresses(prev => [newAddress, ...prev]);
      return newAddress;
    } catch (error) {
      console.error('Error saving address:', error);
      throw error;
    }
  };

  const deleteAddress = async (id) => {
    // Optimistic update
    const originalAddresses = [...savedAddresses];
    setSavedAddresses(prev => prev.filter(a => a.id !== id));

    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting address:', error);
      setSavedAddresses(originalAddresses); // Revert
      throw error;
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  const discountAmount = appliedCoupon ? (() => {
      // 1. Validate General Rules
      if (appliedCoupon.minOrder && subtotal < appliedCoupon.minOrder) return 0;
      const now = new Date();
      if (appliedCoupon.startDate && new Date(appliedCoupon.startDate) > now) return 0;
      if (new Date(appliedCoupon.expiry) < now) return 0;
      
      // 2. Identify Eligible Items & Subtotal
      let eligibleItems = cart;
      if (appliedCoupon.includedCategories && appliedCoupon.includedCategories.length > 0) {
          eligibleItems = cart.filter(item => appliedCoupon.includedCategories.includes(item.category));
      }
      
      const eligibleSubtotal = eligibleItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      if (eligibleSubtotal === 0) return 0;

      // 3. Calculate Discount
      let discount = 0;
      if (appliedCoupon.type === 'flat') {
          discount = appliedCoupon.discount;
          // Cap at eligible subtotal (can't discount more than item value)
          if (discount > eligibleSubtotal) discount = eligibleSubtotal;
      } else {
          // Percentage
          discount = eligibleSubtotal * (appliedCoupon.discount / 100);
          
          // Cap at Max Discount (for percentage)
          if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
              discount = appliedCoupon.maxDiscount;
          }
      }
      
      return Math.round(discount);
  })() : 0;
  const shippingCharge = subtotal < 499 ? 50 : 0;
  const cartTotal = subtotal - discountAmount + shippingCharge;

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      placeOrder,
      cartCount,
      cartTotal,
      coupons,
      addCoupon,
      deleteCoupon,
      applyCoupon,
      removeCoupon,
      appliedCoupon,
      discountAmount,
      shippingCharge,
      subtotal,
      savedAddresses,
      saveAddress,
      deleteAddress
    }}>
      {children}
    </CartContext.Provider>
  );
};
