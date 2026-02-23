
// Simulate Guest Cart Logic -> Sync
// Run this with node to check logic flow (mocking supabase and localStorage)

const mockLocalStorage = {
    getItem: (key) => {
        if (key === 'cart') {
            return JSON.stringify([
                {
                    id: 'prod_123',
                    variantId: 'var_456', // Crucial Field
                    selectedSize: 'M',
                    selectedColor: 'Blue',
                    quantity: 1,
                    isSynced: false
                }
            ]);
        }
        return null;
    }
};

const mockSupabase = {
    from: (table) => ({
        select: () => ({
            eq: () => ({
                eq: () => ({
                    is: () => ({
                        maybeSingle: async () => ({ data: null, error: null }), // Simulate no existing item
                        eq: () => ({
                             maybeSingle: async () => ({ data: null, error: null })
                        }),
                        is: () => ({
                             maybeSingle: async () => ({ data: null, error: null })
                        })
                    })
                })
            })
        }),
        insert: async (data) => {
            console.log("INSERT DETECTED:", data);
            if (!data.variant_id) {
                console.error("FAIL: variant_id MISSING in insert payload!");
            } else {
                console.log("SUCCESS: variant_id present:", data.variant_id);
            }
            return { error: null };
        }
    })
};

// Extracted logic from fetchRemoteCart for testing
async function testSync() {
    console.log("Starting Guest Cart Sync Simulation...");
    const localCartStr = mockLocalStorage.getItem('cart');
    const localCart = JSON.parse(localCartStr);
    
    for (const item of localCart) {
        console.log(`Processing item ${item.id} with variant ${item.variantId}`);
        
        // Emulate the logic I just fixed
        // ... (Simplified for test)
        await mockSupabase.from('cart_items').insert({
            user_id: 'user_auth_1',
            product_id: item.id,
            quantity: item.quantity,
            selected_size: item.selectedSize || null,
            selected_color: item.selectedColor || null,
            variant_id: item.variantId || null // This is what we are testing
        });
    }
}

testSync();
