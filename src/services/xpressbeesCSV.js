
/**
 * Xpressbees Bulk CSV Generator
 * Strictly adheres to the 70+ column format provided by the user.
 */

// Format: 
// Order ID, Payment Type, COD Collectable Amount, First Name, Last Name, ...
// Product(1), Quantity(1), SKU(1), Price(1), Total(1) ...

export const generateXpressbeesCSV = (orders) => {
    if (!orders || orders.length === 0) return null;

    // 🧾 6. CSV BUILDING PROCESS - Headers
    const headers = [
        // 🧾 Basic Fields
        "Order ID", "Payment Type", "COD Collectable Amount", 
        "First Name", "Last Name", 
        "Address 1", "Address 2", 
        "Phone", "Alternate phone", 
        "City", "State", "Pincode",
        
        // 📦 Shipment Fields
        "Weight(gm)", "Length(cm)", "Breadth(cm)", "Height(cm)",
        
        // 💰 Charges
        "Shipping Charges", "COD Charges", "Discount",
        
        // 🛍 Product Blocks (1-10)
        // 🛍 Product Blocks (1-10)
        // Repeat structure: SKU(i), Product(i), Quantity(i), Price(i), Total(i)
        "SKU(1)", "Product(1)", "Quantity(1)", "Per Product Price(1)", "Total Price(1)",
        "SKU(2)", "Product(2)", "Quantity(2)", "Per Product Price(2)", "Total Price(2)",
        "SKU(3)", "Product(3)", "Quantity(3)", "Per Product Price(3)", "Total Price(3)",
        "SKU(4)", "Product(4)", "Quantity(4)", "Per Product Price(4)", "Total Price(4)",
        "SKU(5)", "Product(5)", "Quantity(5)", "Per Product Price(5)", "Total Price(5)",
        "SKU(6)", "Product(6)", "Quantity(6)", "Per Product Price(6)", "Total Price(6)",
        "SKU(7)", "Product(7)", "Quantity(7)", "Per Product Price(7)", "Total Price(7)",
        "SKU(8)", "Product(8)", "Quantity(8)", "Per Product Price(8)", "Total Price(8)",
        "SKU(9)", "Product(9)", "Quantity(9)", "Per Product Price(9)", "Total Price(9)",
        "SKU(10)", "Product(10)", "Quantity(10)", "Per Product Price(10)", "Total Price(10)"
    ];

    const csvRows = [headers.join(',')];

    // Helper to escape CSV fields
    const escape = (text) => {
        if (text === null || text === undefined) return '';
        const stringText = String(text).trim();
        // If containing comma, quote, or newline, wrap in quotes
        if (stringText.includes(',') || stringText.includes('"') || stringText.includes('\n')) {
            return `"${stringText.replace(/"/g, '""')}"`;
        }
        return stringText;
    };

    let processedCount = 0;
    let errorCount = 0;

    orders.forEach(order => {
        // 5. DATA VALIDATION
        // Basic Checks
        if (!order.customer?.phone || String(order.customer.phone).replace(/\D/g, '').length < 10) {
            console.warn(`Skipping Order ${order.id}: Invalid Phone`);
            // We might want to include even invalid ones for review? 
            // The requirement says: "If failed: Skip order + log error"
            errorCount++;
            return;
        }

        const items = order.items || [];
        if (items.length === 0) {
            console.warn(`Skipping Order ${order.id}: No items`);
            errorCount++;
            return; 
        }

        // 🧩 4. MULTI-PRODUCT HANDLING
        // Split items into chunks of 10
        // If items > 10, split into multiple rows (same Order ID)
        
        // How to handle total COD amount when splitting?
        // Usually, the carrier treats strict duplicate Order IDs as errors or updates.
        // Assuming Xpressbees bulk upload treats rows as shipments.
        // If we split an order into two cached shipments, they need unique AWB.
        // But for "CSV Upload", usually one row = one AWB.
        // So duplicates of Order ID means multiple pkgs?
        // Let's assume we split items 1-10 in Row 1, 11-20 in Row 2.
        
        const chunkSize = 10;
        // Calculate number of chunks
        const numChunks = Math.ceil(items.length / chunkSize);

        for (let i = 0; i < numChunks; i++) {
            const start = i * chunkSize;
            const end = start + chunkSize;
            const chunk = items.slice(start, end);
            
            // 🧾 Basic Fields Construction (Per Row)
            
            // ✅ C. Name Split
            const firstName = escape(order.customer.firstName || '');
            const lastName = escape(order.customer.lastName || '.'); 

            // ✅ D. Address Split
            const fullAddr = order.customer.address || '';
            // Simple split logic: First 60 chars to Addr 1, rest to Addr 2 (or safe limit)
            const addr1 = escape(fullAddr.substring(0, 100)); 
            const addr2 = escape(fullAddr.substring(100) || '.'); 
            
            // ✅ A. Payment Mapping
            const isCOD = order.paymentMethod === 'cod';
            const paymentType = isCOD ? "COD" : "Prepaid";

            // ✅ B. COD Collectable Amount
            // "COD -> order total. Prepaid -> 0"
            // If splitting into multiple rows, we shouldn't ask for full payment twice.
            // Logic: Assign full COD amount to the FIRST row, 0 to subsequent rows.
            let codAmount = 0;
            if (isCOD) {
                if (i === 0) {
                   codAmount = order.total;
                } else {
                   codAmount = 0;
                }
            }

            // ✅ E. Default Shipping Values
            // Weight: "If missing: Weight -> convert to grams. 0.5 kg -> 500 gm"
            // We sum up the weight of items in THIS chunk.
            let chunkWeight = 0;
            chunk.forEach(item => {
                // Heuristic: If item.weight exists and < 20, assume kg -> *1000. If > 20, assume grams?
                // Safest default as per req: "0.5 kg -> 500 gm". 
                // Let's assume database stores in grams or we default to 500g.
                // If item.weight is missing, add 500.
                let w = item.weight ? parseFloat(item.weight) : 500;
                // Basic correction logic if needed, but for now trusting explicit or default.
                if (w < 10) w = w * 1000; // Assume KG if very small
                chunkWeight += w;
            });
            // If explicit default needed: "Weight -> convert to grams (VERY IMPORTANT)"
            if (chunkWeight === 0) chunkWeight = 500;


            // Construct the row array
            // 🆕 Address handling: City, State, Pincode
            const city = escape(order.customer.city);
            const state = escape(order.customer.state);
            const pincode = escape(order.customer.zipCode);

            // Phone Cleaning: Remove all non-digits, take last 10
            let phone = (order.customer.phone || '').toString().replace(/\D/g, '');
            if (phone.length > 10) {
                // If starts with 91, remove it
                if (phone.startsWith('91') && phone.length === 12) {
                    phone = phone.substring(2);
                } else {
                    // Otherwise just take last 10
                    phone = phone.slice(-10);
                }
            }
            // If length is less than 10, Xpressbees might reject, but we can't invent digits.
            // Ideally validation earlier would catch this, here just ensure we don't send > 10.
            
            const row = [
                escape(order.id),                       // Order ID
                paymentType,                            // Payment Type
                codAmount,                              // COD Collectable Amount
                firstName,                              // First Name
                lastName,                               // Last Name
                addr1,                                  // Address 1
                addr2,                                  // Address 2
                phone,                                  // Phone (Cleaned)
                "",                                     // Alternate phone
                city,                                   // City
                state,                                  // State
                pincode,                                // Pincode
                
                chunkWeight,                            // Weight(gm)
                10,                                     // Length(cm) - Default
                10,                                     // Breadth(cm) - Default
                5,                                      // Height(cm) - Default
                
                0,                                      // Shipping Charges (Seller internal?) Usually 0 for carrier manifest
                0,                                      // COD Charges
                0,                                      // Discount
            ];

            // 🛍 Product Blocks (1-10)
            const MAX_SLOTS = 10;
            for (let j = 0; j < MAX_SLOTS; j++) {
                if (j < chunk.length) {
                    const item = chunk[j];
                    
                    // MRP Display Logic: "Product Name (MRP ₹500)"
                    // We use 'originalPrice' as MRP if available and higher than selling price
                    let productName = item.name;
                    if (item.originalPrice && item.originalPrice > item.price) {
                        productName = `${item.name} (MRP ₹${item.originalPrice})`;
                    }

                    // SKU(1), Product(1), Quantity(1), Price(1), Total(1)
                    // Price(1) MUST be Selling Price (item.price), NOT MRP.
                    row.push(
                        escape(item.sku || item.id),    // SKU
                        escape(productName),            // Product (with MRP)
                        item.quantity,                  // Quantity
                        item.price,                     // Price (Selling Price)
                        item.price * item.quantity      // Total (Selling Price * Qty)
                    );
                } else {
                    // Empty slots
                    row.push("", "", "", "", "");
                }
            }

            csvRows.push(row.join(','));
        }
        processedCount++;
    });

    console.log(`Xpressbees CSV: Processed ${processedCount} orders. Skipped ${errorCount} errors.`);
    return csvRows.join("\n");
};
