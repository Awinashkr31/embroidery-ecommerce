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
            // 1. Merge Local Items into DB (Sync on Login)
            const localWishlistStr = localStorage.getItem('wishlist');
            if (localWishlistStr) {
                const localWishlist = JSON.parse(localWishlistStr);
                if (localWishlist.length > 0) {
                    // Get existing DB items first to avoid duplicates
                    const { data: existingDB } = await supabase
                        .from('wishlist_items')
                        .select('product_id')
                        .eq('user_id', currentUser.uid);

                    const existingIds = new Set((existingDB || []).map(i => i.product_id));
                    const itemsToSync = localWishlist.filter(item => !existingIds.has(item.id));

                    if (itemsToSync.length > 0) {
                        const { error: syncError } = await supabase
                            .from('wishlist_items')
                            .insert(itemsToSync.map(item => ({
                                user_id: currentUser.uid,
                                product_id: item.id
                            })));
                        
                        if (syncError) console.error("Error syncing wishlist items:", syncError);
                    }
                }
            }

            // 2. Fetch Final Merged List
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
                
                // 3. Update State & Clear Local Storage (as per spec)
                setWishlist(mappedWishlist);
                localStorage.removeItem('wishlist'); 
            }
        } catch (error) {
            console.error('Error fetching remote wishlist:', error);
        }
    };

    const handleOnline = () => {
        if (currentUser) fetchRemoteWishlist();
    };
    window.addEventListener('online', handleOnline);

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
    return () => { 
        mounted = false; 
        window.removeEventListener('online', handleOnline);
    };
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser && wishlist.length > 0) {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, currentUser]);

  const addToWishlist = async (product) => {
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
    addToast('Removed from wishlist', 'info');
    setWishlist(prev => prev.filter(item => item.id !== productId));

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
