import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { supabase } from '../../config/supabase';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const localWishlist = localStorage.getItem('wishlist');
      return localWishlist ? JSON.parse(localWishlist) : [];
    } catch (error) {
       console.error('Error parsing wishlist', error);
      return [];
    }
  });
  const { addToast } = useToast();
  const { currentUser } = useAuth();
  
  // Sync with Supabase on login
  useEffect(() => {
    let mounted = true;
    const fetchRemoteWishlist = async () => {
        if (!currentUser?.uid) return;
        try {
            const { data, error } = await supabase
                .from('wishlist_items')
                .select('*, products(*)')
                .eq('user_id', currentUser.uid);

            if (error) throw error;
            if (data && mounted) {
                // Flatten structure
                const mappedWishlist = data.map(item => ({
                    ...item.products,
                    wishlistItemId: item.id
                }));
                setWishlist(mappedWishlist);
            }
        } catch (error) {
            console.error('Error fetching remote wishlist:', error);
        }
    };

    if (currentUser) {
        fetchRemoteWishlist();
    } else {
         try {
            const localWishlist = localStorage.getItem('wishlist');
            if (localWishlist) setWishlist(JSON.parse(localWishlist));
        } catch (e) {
            console.error(e);
        }
    }
    return () => { mounted = false; };
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, currentUser]);

  const addToWishlist = async (product) => {
    setWishlist(prev => {
      if (prev.some(item => item.id === product.id)) {
        addToast('Already in wishlist!', 'info');
        return prev;
      }
      addToast('Added to wishlist!', 'success');
      return [...prev, product];
    });

    if (currentUser?.uid) {
        try {
            // Check if already exists to avoid duplicate error if state out of sync
            const { data } = await supabase.from('wishlist_items').select('id').eq('user_id', currentUser.uid).eq('product_id', product.id).single();
            if (!data) {
                await supabase
                    .from('wishlist_items')
                    .insert({ user_id: currentUser.uid, product_id: product.id });
            }
        } catch (error) {
            console.error("Error adding to wishlist DB:", error);
        }
    }
  };

  const removeFromWishlist = async (productId) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
    addToast('Removed from wishlist', 'info');

    if (currentUser?.uid) {
        try {
            await supabase
                .from('wishlist_items')
                .delete()
                .eq('user_id', currentUser.uid)
                .eq('product_id', productId);
        } catch (error) {
            console.error("Error removing from wishlist DB:", error);
        }
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };
  
  const toggleWishlist = (product) => {
      if (isInWishlist(product.id)) {
          removeFromWishlist(product.id);
      } else {
          addToWishlist(product);
      }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
