import { DelhiveryService } from './src/services/delhivery.js';
import dotenv from 'dotenv';

dotenv.config();

async function testDelhivery() {
    console.log("Testing Delhivery Serviceability...");
    try {
        const pincode = "110001"; // Delhi Pincode
        const result = await DelhiveryService.checkServiceability(pincode);
        console.log("Serviceability Result:", result);
        
        if (result.serviceable) {
            console.log("SUCCESS: Pincode is serviceable!");
        } else {
            console.log("WARNING: Pincode not serviceable (but API call worked).");
        }
    } catch (error) {
        console.error("ERROR: API Call Failed", error);
    }
}

testDelhivery();
