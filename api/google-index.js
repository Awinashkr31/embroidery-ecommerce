import { google } from 'googleapis';
import crypto from 'crypto';

export default async function handler(req, res) {
    // Basic security check (optional but recommended: pass ?secret=YOUR_SECRET in the URL)
    const secret = req.query.secret || req.body?.secret;
    const expectedSecret = process.env.INDEXING_SECRET;

    if (expectedSecret) {
        if (!secret) {
            return res.status(401).json({ error: 'Unauthorized: Missing secret key' });
        }
        
        // Prevent timing attacks using crypto.timingSafeEqual
        const expectedBuffer = Buffer.from(expectedSecret);
        const secretBuffer = Buffer.from(secret);
        
        if (expectedBuffer.length !== secretBuffer.length || !crypto.timingSafeEqual(expectedBuffer, secretBuffer)) {
            return res.status(401).json({ error: 'Unauthorized: Invalid secret key' });
        }
    }

    const url = req.query.url || req.body?.url;
    const type = req.query.type || req.body?.type || 'URL_UPDATED';

    if (!url) {
        return res.status(400).json({ error: 'Missing "url" parameter. Please provide the URL you want to index.' });
    }

    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!clientEmail || !privateKey) {
        return res.status(500).json({ 
            error: 'Google credentials not configured.',
            message: 'Please add GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY to your Vercel Environment Variables.'
        });
    }

    // Handle newlines in private key if passed via environment variables
    privateKey = privateKey.replace(/\\n/g, '\n');

    try {
        const jwtClient = new google.auth.JWT(
            clientEmail,
            null,
            privateKey,
            ['https://www.googleapis.com/auth/indexing'],
            null
        );

        // Authenticate with Google
        await jwtClient.authorize();

        const options = {
            url: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                url: url,
                type: type, // 'URL_UPDATED' or 'URL_DELETED'
            },
        };

        const response = await jwtClient.request(options);
        
        return res.status(200).json({ 
            success: true, 
            message: 'URL successfully submitted to Google Indexing API',
            url: url,
            googleResponse: response.data 
        });

    } catch (error) {
        console.error('Google Indexing API Error:', error);
        return res.status(500).json({ 
            error: 'Failed to submit to Google Indexing API', 
            details: error.message 
        });
    }
}
