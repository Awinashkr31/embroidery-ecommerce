import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load .env manually
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const TOKEN = process.env.VITE_DELHIVERY_TOKEN;
const BASE_URL = 'https://track.delhivery.com'; // Direct URL for testing, bypassing proxy

console.log(`Checking Delhivery API with Token: ${TOKEN ? 'Present' : 'MISSING'}`);

if (!TOKEN) {
    console.error("ERROR: VITE_DELHIVERY_TOKEN is missing in .env");
    process.exit(1);
}

async function checkServiceability(pincode) {
    console.log(`\nTesting Serviceability for Pincode: ${pincode}...`);
    try {
        const url = `${BASE_URL}/c/api/pin-codes/json/?filter_codes=${pincode}`;
        console.log(`Requesting: ${url}`);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error(`API Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error(`Response Body: ${text}`);
            return;
        }

        const data = await response.json();
        console.log("API Response Success!");
        // console.log(JSON.stringify(data, null, 2));

        const deliveryCodes = data.delivery_codes;
        if (deliveryCodes && deliveryCodes.length > 0) {
            const codeData = deliveryCodes.find(c => c.postal_code.pin == pincode);
            if (codeData) {
                console.log(`\n✅ Pincode ${pincode} is VALID.`);
                console.log(`City: ${codeData.postal_code.district}`);
                console.log(`State: ${codeData.postal_code.state_code}`);
                console.log(`Pre-paid: ${codeData.postal_code.pre_paid}`);
                console.log(`COD: ${codeData.postal_code.cod}`);
            } else {
                console.warn(`\n⚠️ Pincode ${pincode} found in response but not matched?`);
            }
        } else {
            console.warn(`\n❌ Pincode ${pincode} not serviceable or not found.`);
        }

    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

// Run Test
checkServiceability("110001");
