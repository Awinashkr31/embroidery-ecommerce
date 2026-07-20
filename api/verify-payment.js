import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ error: 'Missing required Razorpay parameters' });
        }

        const secret = process.env.RAZORPAY_KEY_SECRET;

        // Create the expected signature
        const hmac = crypto.createHmac('sha256', secret);
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const expectedSignature = hmac.digest('hex');

        // Compare signatures securely
        if (expectedSignature === razorpay_signature) {
            // Payment is verified
            return res.status(200).json({ success: true, message: 'Payment verified successfully' });
        } else {
            // Signature mismatch
            return res.status(400).json({ success: false, error: 'Invalid signature. Payment verification failed.' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
