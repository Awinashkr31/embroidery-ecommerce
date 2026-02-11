const fetch = require('node-fetch'); // Ensure you have node-fetch or use native fetch if Node 18+

// Configuration
const PROJECT_REF = "yqtrlqkmitgnaehbawdm";
const FUNCTION_URL = `https://${PROJECT_REF}.supabase.co/functions/v1/delhivery-webhook`;
const SECRET = "sec_delhivery_wbhk_2026_xyz";

// Test Payloads
const testPayload = {
    "Shipment": {
        "AWB": "TEST_AWB_12345", // We need a real AWB or this will fail to find an order (expected 404 is fine for connectivity test)
        "ReferenceNo": "TEST_ORDER_REF",
        "Status": {
            "Status": "In Transit",
            "StatusLocation": "Mumbai Hub",
            "StatusDateTime": new Date().toISOString()
        }
    }
};

async function testWebhook() {
    console.log("Testing Webhook Connectivity...");
    console.log(`URL: ${FUNCTION_URL}`);

    try {
        // 1. Test Unauthorized (No Secret)
        console.log("\n1. Testing Unauthorized Request...");
        const res401 = await fetch(FUNCTION_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testPayload)
        });
        console.log(`Status: ${res401.status} (Expected 401)`);
        
        // 2. Test Authorized (With Secret)
        console.log("\n2. Testing Authorized Request...");
        const res200 = await fetch(`${FUNCTION_URL}?secret=${SECRET}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-delhivery-token': SECRET 
            },
            body: JSON.stringify(testPayload)
        });
        
        const data = await res200.json();
        console.log(`Status: ${res200.status}`);
        console.log("Response:", data);

        if (res200.status === 200) {
            console.log("\n✅ Webhook is reachable and authenticated!");
        } else if (res200.status === 404) {
             console.log("\n✅ Webhook reachable! (404 is expected because TEST_AWB doesn't exist in DB)");
        } else {
            console.log("\n❌ Webhook returned unexpected error.");
        }

    } catch (error) {
        console.error("\n❌ Request Failed:", error.message);
    }
}

// Run if native fetch available (Node 18+) or suggest installing node-fetch
if (typeof fetch === 'undefined') {
    console.log("Please run: npm install node-fetch");
    console.log("Then run: node scripts/simulate_webhook.js");
} else {
    testWebhook();
}
