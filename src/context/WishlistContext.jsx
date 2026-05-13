import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { supabase } from '../../config/supabase';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { addToast } = useToast();
  const { currentUser, openLoginSheet } = useAuth();
  
  // Fetch remote wishlist on login
  useEffect(() => {
    let mounted = true;
    const fetchRemoteWishlist = async () => {
        if (!(currentUser?.uid || currentUser?.id)) {
            setWishlist([]); // Clear if logged out
            return;
        }
        
        try {
            const { data, error } = await supabase
                .from('wishlist_items')
                .select('*, products(id, name, price, original_price, images, stock_quantity)')
                .eq('user_id', (currentUser.uid || currentUser.id));

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

    const handleOnline = () => {
        if (currentUser) fetchRemoteWishlist();
    };
    window.addEventListener('online', handleOnline);

    fetchRemoteWishlist();

    return () => { 
        mounted = false; 
        window.removeEventListener('online', handleOnline);
    };
  }, [currentUser]);

  const addToWishlist = async (product) => {
    if (!currentUser) {
        openLoginSheet();
        return;
    }

    // Check if already in wishlist to prevent duplicates (and double toasts)
    if (isInWishlist(product.id)) {
        addToast('Already in wishlist!', 'info');
        return;
    }
    
    addToast('Added to wishlist!', 'success');
    
    setWishlist(prev => {
      // Double check inside setter just for state consistency, but no side effects here
      if (prev.some(item => item.id === product.id)) return prev;
      return [...prev, product];
    });

    if ((currentUser?.uid || currentUser?.id)) {
        try {
            // Check if already exists to avoid duplicate error if state out of sync
            const { data } = await supabase.from('wishlist_items').select('id').eq('user_id', (currentUser.uid || currentUser.id)).eq('product_id', product.id).single();
            if (!data) {
                await supabase
                    .from('wishlist_items')
                    .insert({ user_id: (currentUser.uid || currentUser.id), product_id: product.id });
            }
        } catch (error) {
            console.error("Error adding to wishlist DB:", error);
        }
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!currentUser) {
        openLoginSheet();
        return;
    }
    
    addToast('Removed from wishlist', 'info');
    setWishlist(prev => prev.filter(item => item.id !== productId));

    if ((currentUser?.uid || currentUser?.id)) {
        try {
            await supabase
                .from('wishlist_items')
                .delete()
                .eq('user_id', (currentUser.uid || currentUser.id))
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
      if (!currentUser) {
          openLoginSheet();
          return;
      }

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
