import dotenv from 'dotenv';
dotenv.config();

try {
    const url = process.env.VITE_SUPABASE_URL;
    if (!url) {
        console.log("NO_URL");
    } else {
        const hostname = new URL(url).hostname;
        console.log("HOSTNAME:" + hostname);
    }
} catch (e) {
    console.log("ERROR:" + e.message);
}
