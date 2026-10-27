import React from 'react';
import SEO from '../components/SEO';
import { 
  FREE_SHIPPING_THRESHOLD, 
  SHIPPING_CHARGE_BELOW_THRESHOLD, 
  DISPATCH_DAYS, 
  DELIVERY_DAYS, 
  EXPRESS_OPTION 
} from '../constants/shippingConfig';

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-[#fdfbf7] pt-24 pb-20 font-body">
      <SEO 
        title="Shipping Policy" 
        description="Learn about shipping rates, processing times, and delivery estimates for your handcrafted orders." 
      />
      <div className="container-custom max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-stone-900 mb-8 text-center">Shipping Policy</h1>
        
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-stone-100 prose prose-stone max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">1. Order Processing Time</h2>
          <p>All of our products are lovingly handcrafted. Standard orders are processed and dispatched within <strong>{DISPATCH_DAYS}</strong>.</p>
          <p>Custom or personalized orders may require additional time. You will be notified of the estimated processing time during the checkout or consultation process.</p>

          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">2. Shipping Rates & Delivery Estimates</h2>
          <p>We ship all across India. Standard shipping is ₹{SHIPPING_CHARGE_BELOW_THRESHOLD} for orders below ₹{FREE_SHIPPING_THRESHOLD}, and FREE for orders of ₹{FREE_SHIPPING_THRESHOLD} and above.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Standard Delivery:</strong> {DELIVERY_DAYS} across India</li>
            {EXPRESS_OPTION ? <li><strong>Express Shipping:</strong> {EXPRESS_OPTION}</li> : null}
          </ul>
          <p className="mt-4 text-stone-500 italic">Please note: Delivery delays can occasionally occur due to unforeseen courier issues.</p>

          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">3. Free Shipping</h2>
          <p>We offer <strong>Free Standard Shipping</strong> on all domestic orders over ₹{FREE_SHIPPING_THRESHOLD}.</p>

          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">4. Shipment Confirmation & Order Tracking</h2>
          <p>You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.</p>

          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">5. Damages</h2>
          <p>Crochet Wali is not liable for any products damaged or lost during shipping. However, if you received your order damaged, please contact us within 48 hours of delivery with photographic evidence, and we will do our best to assist you in filing a claim with the shipment carrier.</p>

          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">6. Contact Us</h2>
          <p>If you have any questions or concerns regarding your order's shipping, please reach out to our support team:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Email:</strong> support@crochetwali.in</li>
            <li><strong>Operating Hours:</strong> Monday - Saturday, 10:00 AM - 6:00 PM IST</li>
            <li><strong>Location:</strong> New Delhi, India</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
