import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();

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
            const { data, error } = await supabase
                .from('cart_items')
                .select('*, products(*)')
                .eq('user_id', currentUser.uid);

            if (error) throw error;

            if (data && mounted) {
                // Merge remote cart items. 
                // Note: The structure from DB join is slightly different (product details in 'products').
                // We need to flatten it to match existing app structure { ...product, quantity }.
                const mappedCart = data.map(item => ({
                    ...item.products,
                    quantity: item.quantity,
                    cartItemId: item.id // Keep reference to DB ID if needed
                }));
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
    // Optimistic Update
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
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
            const existingItem = cart.find(item => item.id === product.id);
            if (existingItem) {
                 await supabase
                    .from('cart_items')
                    .update({ quantity: existingItem.quantity + 1 })
                    .eq('user_id', currentUser.uid)
                    .eq('product_id', product.id);
            } else {
                await supabase
                    .from('cart_items')
                    .insert({ user_id: currentUser.uid, product_id: product.id, quantity: 1 });
            }
        } catch (error) {
            console.error("Error syncing cart add:", error);
        }
    }
  };

  const removeFromCart = async (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    
    if (currentUser?.uid) {
        try {
            await supabase
                .from('cart_items')
                .delete()
                .eq('user_id', currentUser.uid)
                .eq('product_id', productId);
        } catch (error) {
            console.error("Error removing from cart DB:", error);
        }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: Number(quantity) }
          : item
      )
    );

    if (currentUser?.uid) {
        try {
            await supabase
                .from('cart_items')
                .update({ quantity: Number(quantity) })
                .eq('user_id', currentUser.uid)
                .eq('product_id', productId);
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
  const placeOrder = async (userDetails = {}) => {
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
      payment_status: 'pending' // Default
    };

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([newOrder])
        .select()
        .single();
        
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
  
  const discountAmount = appliedCoupon ? (subtotal * (appliedCoupon.discount / 100)) : 0;
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
