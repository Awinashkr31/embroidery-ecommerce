import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cart, setCart] = useState(() => {
    try {
      const localCart = localStorage.getItem('cart');
      return localCart ? JSON.parse(localCart) : [];
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
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
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
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
  };

  const clearCart = () => {
    setCart([]);
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
