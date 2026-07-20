import React from 'react';
import SEO from '../components/SEO';
import { useCart } from '../context/CartContext';

const ShippingPolicy = () => {
  const { FREE_DELIVERY_THRESHOLD } = useCart();
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
          <p>All of our products are lovingly handcrafted. Standard orders are processed and dispatched within <strong>1 to 3 business days</strong>.</p>
          <p>Custom or personalized orders may require additional time. You will be notified of the estimated processing time during the checkout or consultation process.</p>

          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">2. Shipping Rates & Delivery Estimates</h2>
          <p>We ship all across India. Shipping charges for your order will be calculated and displayed at checkout.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Standard Shipping:</strong> 3-7 business days</li>
            <li><strong>Express Shipping:</strong> Available on request (additional charges apply)</li>
          </ul>
          <p className="mt-4 text-stone-500 italic">Please note: Delivery delays can occasionally occur due to unforeseen courier issues.</p>

          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">3. Free Shipping</h2>
          <p>We offer <strong>Free Standard Shipping</strong> on all domestic orders over ₹{FREE_DELIVERY_THRESHOLD || 999}.</p>

          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">4. Shipment Confirmation & Order Tracking</h2>
          <p>You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.</p>

          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">5. Damages</h2>
          <p>Crochet Wali is not liable for any products damaged or lost during shipping. However, if you received your order damaged, please contact us within 48 hours of delivery with photographic evidence, and we will do our best to assist you in filing a claim with the shipment carrier.</p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
