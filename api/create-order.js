import Razorpay from 'razorpay';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        console.log('RAZORPAY_KEY_ID present:', !!keyId, 'length:', keyId?.length);
        console.log('RAZORPAY_KEY_SECRET present:', !!keySecret, 'length:', keySecret?.length);

        if (!keyId || !keySecret) {
            return res.status(500).json({ 
                error: 'Razorpay credentials not configured on server.',
                debug: { keyIdPresent: !!keyId, keySecretPresent: !!keySecret }
            });
        }

        const { amount, currency = 'INR', receipt = `receipt_${Date.now()}` } = req.body;

        if (!amount || amount < 100) {
            return res.status(400).json({ error: 'Amount must be at least 100 paise (â‚¹1)' });
        }

        const razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });

        const options = {
            amount: amount, // amount in the smallest currency unit (paise)
            currency: currency,
            receipt: receipt,
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).json({ error: 'Some error occurred while creating order' });
        }

        return res.status(200).json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
