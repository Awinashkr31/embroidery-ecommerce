import { performance } from 'perf_hooks';

const mockSupabase = () => {
    let callCount = 0;

    const db = {
        cart_items: []
    };

    const delay = () => new Promise(r => setTimeout(r, 5));

    return {
        getCallCount: () => callCount,
        from: (table) => {
            return {
                select: (fields) => {
                    return {
                        eq: (col1, val1) => {
                            if (col1 === 'user_id' && typeof fields === 'string' && fields.includes('quantity, id')) {
                                // Old way single
                                return {
                                    eq: (col2, val2) => {
                                        let q = {
                                            is: () => q,
                                            eq: () => q,
                                            maybeSingle: async () => {
                                                callCount++;
                                                await delay();
                                                return { data: null, error: null };
                                            }
                                        };
                                        return q;
                                    }
                                }
                            } else if (col1 === 'user_id') {
                                // New way bulk
                                return Object.assign(Promise.resolve({ data: [], error: null }), {
                                    then: async (resolve) => {
                                        callCount++;
                                        await delay();
                                        resolve({ data: [], error: null });
                                    }
                                });
                            }
                            return { eq: () => ({ eq: () => ({ maybeSingle: async () => { callCount++; await delay(); return { data: null }; } }) }) };
                        }
                    }
                },
                insert: async (data) => {
                    callCount++;
                    await delay();
                    return { error: null };
                },
                update: (data) => {
                    return {
                        eq: async (col, val) => {
                            callCount++;
                            await delay();
                            return { error: null };
                        }
                    };
                },
                upsert: async (data) => {
                    callCount++;
                    await delay();
                    return { error: null };
                }
            }
        }
    };
};

const currentUser = { id: 'user1' };
const localCart = Array.from({ length: 20 }, (_, i) => ({
    id: `prod${i}`,
    quantity: 1,
    selectedSize: 'M',
    selectedColor: 'Red',
    variantId: null
}));

const oldSync = async (localCart, supabase, currentUser) => {
    let failedItems = [];
    for (const item of localCart) {
        if (item.isSynced || item.cartItemId) continue;

        try {
            let query = supabase
                .from('cart_items')
                .select('quantity, id')
                .eq('user_id', currentUser.id)
                .eq('product_id', item.id);

            if (item.selectedSize) query = query.eq('selected_size', item.selectedSize);
            else query = query.is('selected_size', null);

            if (item.selectedColor) query = query.eq('selected_color', item.selectedColor);
            else query = query.is('selected_color', null);

            if (item.variantId) query = query.eq('variant_id', item.variantId);
            else query = query.is('variant_id', null);

            const { data: existing, error: fetchError } = await query.maybeSingle();

            if (existing) {
                await supabase.from('cart_items').update({ quantity: existing.quantity + item.quantity }).eq('id', existing.id);
            } else {
                await supabase.from('cart_items').insert({
                    user_id: currentUser.id,
                    product_id: item.id,
                    quantity: item.quantity,
                    selected_size: item.selectedSize || null,
                    selected_color: item.selectedColor || null,
                    variant_id: item.variantId || null
                });
            }
        } catch (err) {
            failedItems.push(item);
        }
    }
};

const newSync = async (localCart, supabase, currentUser) => {
    let failedItems = [];
    try {
        const unsyncedItems = localCart.filter(item => !item.isSynced && !item.cartItemId);
        if (unsyncedItems.length === 0) return;

        const { data: existingItems, error: fetchError } = await supabase
            .from('cart_items')
            .select('id, product_id, selected_size, selected_color, variant_id, quantity')
            .eq('user_id', currentUser.id);

        if (fetchError) throw fetchError;

        const upserts = unsyncedItems.map(item => {
            const match = (existingItems || []).find(ex =>
                ex.product_id === item.id &&
                ex.selected_size === (item.selectedSize || null) &&
                ex.selected_color === (item.selectedColor || null) &&
                ex.variant_id === (item.variantId || null)
            );

            if (match) {
                return {
                    id: match.id,
                    user_id: currentUser.id,
                    product_id: item.id,
                    quantity: match.quantity + item.quantity,
                    selected_size: item.selectedSize || null,
                    selected_color: item.selectedColor || null,
                    variant_id: item.variantId || null
                };
            } else {
                return {
                    user_id: currentUser.id,
                    product_id: item.id,
                    quantity: item.quantity,
                    selected_size: item.selectedSize || null,
                    selected_color: item.selectedColor || null,
                    variant_id: item.variantId || null
                };
            }
        });

        if (upserts.length > 0) {
            const { error: upsertError } = await supabase
                .from('cart_items')
                .upsert(upserts);

            if (upsertError) throw upsertError;
        }
    } catch (err) {
        failedItems = [...localCart];
    }
};

(async () => {
    console.log("Running baseline (Old Sync)...");
    const supabaseOld = mockSupabase();
    const startOld = performance.now();
    await oldSync(localCart, supabaseOld, currentUser);
    const endOld = performance.now();
    console.log(`Old Sync Time: ${(endOld - startOld).toFixed(2)}ms`);
    console.log(`Old Sync Queries: ${supabaseOld.getCallCount()}`);

    console.log("\nRunning optimized (New Sync)...");
    const supabaseNew = mockSupabase();
    const startNew = performance.now();
    await newSync(localCart, supabaseNew, currentUser);
    const endNew = performance.now();
    console.log(`New Sync Time: ${(endNew - startNew).toFixed(2)}ms`);
    console.log(`New Sync Queries: ${supabaseNew.getCallCount()}`);
})();
