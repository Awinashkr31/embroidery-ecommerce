import dotenv from "dotenv";
dotenv.config();

const token = process.env.VITE_DELHIVERY_TOKEN;
console.log("Token:", token ? "Present" : "Missing");

const url = new URL("https://track.delhivery.com/api/kinko/v1/invoice/charges/");
// Params from edge function logic
url.searchParams.append("md", "S");
url.searchParams.append("ss", "Delivered");
url.searchParams.append("d_pin", "560001"); // Bangalore
url.searchParams.append("o_pin", "110001"); // Delhi
url.searchParams.append("cgm", "500");
url.searchParams.append("pt", "Pre-paid");

async function testDirect() {
    console.log(`Fetching: ${url.toString()}`);
    try {
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log("Status:", response.status);
        console.log("StatusText:", response.statusText);
        const text = await response.text();
        console.log("Body Start:", text.substring(0, 500));
        
        try {
            const json = JSON.parse(text);
            console.log("Parsed JSON:", json);
        } catch (e) {
            console.log("Not JSON. Raw Text captured.");
        }

    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

testDirect();
