import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const { addToast } = useToast();

  // Loading state for cart
  const [isFetchingCart, setIsFetchingCart] = useState(true);

  // Initialize cart from local storage for initial render
  const [cart, setCart] = useState(() => {
    try {
      const localCart = localStorage.getItem('cart');
      const parsed = localCart ? JSON.parse(localCart) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
      return [];
    }
  });

  // Fetch cart when user logs in
  useEffect(() => {
    let mounted = true;

    const fetchRemoteCart = async () => {
        if (!currentUser?.id) {
             setIsFetchingCart(false);
             return;
        }
        
        setIsFetchingCart(true);
        try {
            console.log("Fetching remote cart for user:", currentUser.id);

            // Check for local items to merge
            const localCartStr = localStorage.getItem('cart');
            let failedItems = [];

            if (localCartStr) {
                const localCart = JSON.parse(localCartStr);
                if (localCart.length > 0) {
                    console.log("Merging local cart items...", localCart.length);
                    
                    // Merge logic: Add local items to Supabase
                    for (const item of localCart) {
                        try {
                             // Check if item already exists in DB to update quantity
                             let query = supabase
                                .from('cart_items')
                                .select('quantity, id')
                                .eq('user_id', currentUser.id)
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
                             
                             const { data: existing, error: fetchError } = await query.maybeSingle();

                             if (fetchError) {
                                console.error("Error checking existing item:", fetchError);
                                throw fetchError;
                             }

                             if (existing) {
                                 console.log(`Updating existing item ${existing.id} quantity by ${item.quantity}`);
                                 const { error: updateError } = await supabase
                                    .from('cart_items')
                                    .update({ quantity: existing.quantity + item.quantity })
                                    .eq('id', existing.id);
                                 
                                 if (updateError) throw updateError;

                             } else {
                                console.log(`Inserting new item ${item.id}`);
                                 const { error: insertError } = await supabase
                                    .from('cart_items')
                                    .insert({ 
                                        user_id: currentUser.id, 
                                        product_id: item.id, 
                                        quantity: item.quantity,
                                        selected_size: item.selectedSize || null,
                                        selected_color: item.selectedColor || null
                                    });

                                 if (insertError) throw insertError;
                             }
                        } catch (err) {
                            console.error(`Failed to merge item ${item.id}`, err);
                            failedItems.push(item);
                        }
                    }
                    
                    // Update local storage: connect only failed items
                    if (failedItems.length > 0) {
                        console.warn("Some items failed to sync to DB.", failedItems.length);
                    }
                }
            }

            const { data, error } = await supabase
                .from('cart_items')
                .select('*, products(*)')
                .eq('user_id', currentUser.id);

            if (error) throw error;

            console.log("Remote cart fetched:", data?.length);

            if (mounted) {
                // 1. Process Remote Items
                const mappedCart = (data || []).map(item => {
                    const p = item.products;
                    
                    // Safety check: if product was deleted or FK broken
                    if (!p) {
                        console.warn('Cart item found with missing product data:', item);
                        return null;
                    }

                    // Calculate Variant Price
                    let finalPrice = p.price;
                    if (p.clothingInformation?.variantStock && item.selected_size && item.selected_color) {
                        const key = `${item.selected_color}-${item.selected_size}`;
                        const variant = p.clothingInformation.variantStock[key];
                        if (variant && variant.price) {
                            finalPrice = parseInt(variant.price);
                        }
                    }

                    // Normalize Image
                    const displayImage = p.images && p.images.length > 0 ? p.images[0] : p.image;

                    return {
                        ...p,
                        image: displayImage, // Ensure image is set
                        price: finalPrice, // Override base price
                        quantity: item.quantity,
                        selectedSize: item.selected_size,
                        selectedColor: item.selected_color,
                        cartItemId: item.id
                    };
                }).filter(Boolean); // Filter out nulls
                
                // 2. Merge with Failed Items (Deduplicate if necessary, though failed items shouldn't be in DB)
                // We prefer DB items, but if an item failed to sync, it's NOT in DB, so we add it.
                // However, check for ID overlap just in case.
                
                const finalCart = [...mappedCart];
                failedItems.forEach(localItem => {
                    const exists = finalCart.find(r => 
                        r.id === localItem.id && 
                        r.selectedSize === localItem.selectedSize && 
                        r.selectedColor === localItem.selectedColor
                    );
                    if (!exists) {
                        finalCart.push(localItem);
                    }
                });

                if (failedItems.length > 0 && data?.length === 0) {
                     addToast("Sync issue: Showing local cart items.", "info");
                }

                setCart(Array.isArray(finalCart) ? finalCart : []);
            }
        } catch (error) {
            console.error('Error fetching remote cart:', error);
            // On critical error, fallback to local cart if meaningful? 
            // Current logic already handles mixed state via failedItems if merge ran.
        } finally {
            if (mounted) setIsFetchingCart(false);
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
        setIsFetchingCart(false);
    }



    return () => { mounted = false; };
  }, [currentUser, loading, addToast]);

  // Sync to local storage whenever cart changes (Persistence Layer)
  useEffect(() => {
    // We always persist the cart to local storage as a backup/cache
    // This handles both guest users and logged-in users (offline support)
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (product) => {
    // Normalize properties to ensure consistency (Wishlist items might have undefined)
    const normalizedSize = product.selectedSize || null;
    const normalizedColor = product.selectedColor || null;
    const normalizedImage = product.images && product.images.length > 0 ? product.images[0] : product.image;

    // Check Stock
    // UNIQUE IDENTIFIER: Product ID + Selected Size + Selected Color
    const currentItem = cart.find(item => 
        item.id === product.id && 
        (item.selectedSize || null) === normalizedSize &&
        (item.selectedColor || null) === normalizedColor
    );
    const currentQty = currentItem ? currentItem.quantity : 0;
    
    let availableStock = 100;
    if (product?.clothingInformation?.sizes && normalizedSize) {
        availableStock = product.clothingInformation.sizes[normalizedSize] || 0;
    } else if (product) {
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
          (item.selectedSize || null) === normalizedSize &&
          (item.selectedColor || null) === normalizedColor
      );
      if (existingItem) {
        return prevCart.map(item =>
          (item.id === product.id && (item.selectedSize || null) === normalizedSize && (item.selectedColor || null) === normalizedColor)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { 
          ...product, 
          image: normalizedImage, // Ensure image is set correctly
          selectedSize: normalizedSize,
          selectedColor: normalizedColor,
          quantity: 1 
      }];
    });

    // DB Sync
    if (currentUser?.id) {
        try {
            // Check if exists in DB to update or insert
            let query = supabase
                .from('cart_items')
                .select('*')
                .eq('user_id', currentUser.id)
                .eq('product_id', product.id);
            
            if (normalizedSize) {
                query = query.eq('selected_size', normalizedSize);
            } else {
                query = query.is('selected_size', null);
            }

            if (normalizedColor) {
                query = query.eq('selected_color', normalizedColor);
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
                        user_id: currentUser.id, 
                        product_id: product.id, 
                        quantity: 1,
                        selected_size: normalizedSize,
                        selected_color: normalizedColor
                    });
            }
        } catch (error) {
            console.error("Error syncing cart add:", error);
            addToast("Saved locally (Sync pending)", "info");
        }
    }
    return true;
  };

  const removeFromCart = async (productId, selectedSize = null, selectedColor = null) => {
    // Normalize arguments
    const targetSize = selectedSize || null;
    const targetColor = selectedColor || null;

    let updatedCart = [];
    setCart(prevCart => {
        updatedCart = prevCart.filter(item => {
            const isMatch = item.id === productId && 
                            (item.selectedSize || null) === targetSize && 
                            (item.selectedColor || null) === targetColor;
            return !isMatch;
        });
        return updatedCart;
    });
    
    if (currentUser?.uid) {
        try {
            let query = supabase
                .from('cart_items')
                .delete()
                .eq('user_id', currentUser.id)
                .eq('product_id', productId);
            
            if (targetSize) {
                query = query.eq('selected_size', targetSize);
            } else {
                query = query.is('selected_size', null);
            }
            
            if (targetColor) {
                query = query.eq('selected_color', targetColor);
            } else {
                query = query.is('selected_color', null);
            }
            
            await query;
        } catch (error) {
            console.error("Error removing from cart DB:", error);
            addToast("Removed locally (Sync pending)", "info");
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
    
    let updatedCart = [];
    setCart(prevCart => {
      updatedCart = prevCart.map(item =>
        (item.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor)
          ? { ...item, quantity: Number(quantity) }
          : item
      );
      return updatedCart;
    });

    if (currentUser?.uid) {
        try {
            let query = supabase
                .from('cart_items')
                .update({ quantity: Number(quantity) })
                .eq('user_id', currentUser.id)
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

            const { error } = await query;
            if (error) throw error;
        } catch (error) {
             console.error("Error updating cart quantity:", error);
             addToast("Updated locally (Sync pending)", "info");
        }
    }
  };

  const clearCart = async () => {
    setCart([]);
    setCart([]);
    if (currentUser?.id) {
        await supabase.from('cart_items').delete().eq('user_id', currentUser.id);
    }
  };

  // Order Management
  const placeOrder = async (userDetails = {}, paymentOverrides = {}) => {
    // Basic validation
    if (!Array.isArray(cart) || cart.length === 0) throw new Error("Cart is empty");

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
      // payload must match the argument name in the SQL function: place_order(order_data JSONB)
      const { data, error } = await supabase
        .rpc('place_order', { order_data: newOrder });
        
      if (error) throw error;
      
      // The function returns the order object (or just ID if we simpler)
      // Our SQL returns the whole object as JSONB
      const createdOrder = data;

      if (!createdOrder || !createdOrder.id) {
          throw new Error("Order creation failed: No ID returned");
      }
      
      clearCart();
      return createdOrder.id; // Return just the ID as the component expects
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  };


  // Coupon Management - Supabase Integration
  const [coupons, setCoupons] = useState([]);

  const fetchCoupons = async () => {
      try {
          const { data, error } = await supabase
              .from('coupons')
              .select('*')
              .order('created_at', { ascending: false });

          if (error) throw error;

          if (data) {
              // Map DB snake_case to App camelCase
              const mappedCoupons = data.map(c => ({
                  id: c.id,
                  code: c.code,
                  type: c.type,
                  discount: Number(c.discount),
                  minOrder: Number(c.min_order),
                  maxDiscount: Number(c.max_discount),
                  startDate: c.start_date,
                  expiry: c.expiry,
                  usageLimit: c.usage_limit,
                  perUserLimit: c.per_user_limit,
                  includedCategories: c.included_categories
              }));
              setCoupons(mappedCoupons);
              console.log("Coupons loaded:", mappedCoupons.length);
          }
      } catch (error) {
          console.error("Error fetching coupons:", error);
      }
  };

  useEffect(() => {
      fetchCoupons();
  }, []); // Run once on mount

  const addCoupon = async (couponData) => {
    try {
        // Map App camelCase to DB snake_case
        const dbCoupon = {
            code: couponData.code,
            type: couponData.type,
            discount: couponData.discount,
            min_order: couponData.minOrder,
            max_discount: couponData.maxDiscount,
            start_date: couponData.startDate,
            expiry: couponData.expiry,
            usage_limit: couponData.usageLimit,
            per_user_limit: couponData.perUserLimit,
            included_categories: couponData.includedCategories
        };

        const { data, error } = await supabase
            .from('coupons')
            .insert([dbCoupon])
            .select()
            .single();

        if (error) throw error;

        // Optimistic update using returned data mapped back
        const newCoupon = {
            id: data.id,
            code: data.code,
            type: data.type,
            discount: Number(data.discount),
            minOrder: Number(data.min_order),
            maxDiscount: Number(data.max_discount),
            startDate: data.start_date,
            expiry: data.expiry,
            usageLimit: data.usage_limit,
            perUserLimit: data.per_user_limit,
            includedCategories: data.included_categories
        };

        setCoupons(prev => [newCoupon, ...prev]);
        addToast("Coupon created successfully", "success");
    } catch (error) {
        console.error("Error adding coupon:", error);
        addToast("Failed to create coupon", "error");
    }
  };

  const deleteCoupon = async (id) => {
    try {
        const { error } = await supabase
            .from('coupons')
            .delete()
            .eq('id', id);

        if (error) throw error;

        setCoupons(prev => prev.filter(c => c.id !== id));
        addToast("Coupon deleted", "info");
    } catch (error) {
        console.error("Error deleting coupon:", error);
        addToast("Failed to delete coupon", "error");
    }
  };

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const applyCoupon = (code) => {
    const normalizedCode = code.trim().toUpperCase();
    
    // Debugging Logs
    console.log(`Applying coupon: "${normalizedCode}"`);
    console.log("Available Coupons:", coupons.map(c => c.code));

    const coupon = coupons.find(c => c.code.toUpperCase() === normalizedCode);
    
    if (!coupon) {
      throw new Error(`Invalid coupon code: "${code}"`);
    }
    
    // Validate Dates
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    if (coupon.startDate) {
        const start = new Date(coupon.startDate);
        start.setHours(0, 0, 0, 0);
        if (start > today) {
            throw new Error(`Coupon is valid from ${start.toLocaleDateString()}`);
        }
    }
    
    if (coupon.expiry) {
        const expiry = new Date(coupon.expiry);
        expiry.setHours(23, 59, 59, 999); // End of expiry day
        if (expiry < now) {
            throw new Error(`Coupon expired on ${expiry.toLocaleDateString()}`);
        }
    }

    // Check Min Order
    const currentSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    if (coupon.minOrder && currentSubtotal < coupon.minOrder) {
        throw new Error(`Minimum order of ₹${coupon.minOrder} required`);
    }

    // Check Category Eligibility
    if (coupon.includedCategories && coupon.includedCategories.length > 0) {
        // Ensure item.category matches the IDs in includedCategories
        // Note: item.category might be a name or ID depending on product structure. 
        // Assuming it matches the strings in includedCategories.
        const hasEligibleItem = cart.some(item => coupon.includedCategories.includes(item.category));
        if (!hasEligibleItem) {
             throw new Error(`Coupon only applicable on specific categories`);
        }
    }

    setAppliedCoupon(coupon);
    addToast("Coupon applied successfully!", "success");
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
      if (currentUser?.id) {
        try {
          const { data, error } = await supabase
            .from('addresses')
            .select('*')
            .eq('user_id', currentUser.id)
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

  const cartCount = (cart || []).reduce((total, item) => total + (item.quantity || 0), 0);
  const subtotal = (cart || []).reduce((total, item) => total + ((item.price || 0) * (item.quantity || 0)), 0);
  
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
  // Shipping Rules
  const MIN_ORDER_VALUE = 200;
  const FREE_DELIVERY_THRESHOLD = 499;
  const DELIVERY_CHARGE = 50;

  const shippingCharge = subtotal < FREE_DELIVERY_THRESHOLD ? DELIVERY_CHARGE : 0;
  const cartTotal = subtotal - discountAmount + shippingCharge;
  const isOrderDeployable = subtotal >= MIN_ORDER_VALUE;

  return (
    <CartContext.Provider value={{
      cart,
      cartLoading: loading || isFetchingCart,
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
      deleteAddress,
      // Rules
      MIN_ORDER_VALUE,
      FREE_DELIVERY_THRESHOLD,
      DELIVERY_CHARGE,
      isOrderDeployable
    }}>
      {children}
    </CartContext.Provider>
  );
};
