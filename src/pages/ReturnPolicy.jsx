import React from 'react';
import SEO from '../components/SEO';

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-[#fdfbf7] pt-24 pb-20 font-body">
      <SEO 
        title="Return & Refund Policy" 
        description="Learn about our return, refund, and exchange policies at Crochet Wali." 
      />
      <div className="container-custom max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-stone-900 mb-8 text-center">Return & Refund Policy</h1>
        
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-stone-100 prose prose-stone max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">1. No Returns or Refunds</h2>
          <p>Due to the handcrafted, made-to-order nature of our crochet and embroidery creations, all sales are final. We do not provide returns or refunds for change of mind or personal preference. Please carefully review your order details before making a purchase.</p>
          
          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">2. 5-Day Replacement Policy for Damaged Products</h2>
          <p>If you receive a damaged or defective product from transit, we offer a 5-day replacement policy. You must notify us within 5 days of delivery to be eligible for a free replacement.</p>

          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">3. Mandatory Unboxing Video</h2>
          <p>To process any claim for a damaged product, an <strong>unboxing video is strictly required</strong>. You must record a clear, continuous, unedited video while opening the sealed package and send it to our WhatsApp support at <strong><a href="https://wa.me/917428013214" className="text-rose-600 hover:underline">+91 74280 13214</a></strong> or email <strong><a href="mailto:support@crochetwali.in" className="text-rose-600 hover:underline">support@crochetwali.in</a></strong> within <strong>5 days</strong> of delivery.</p>
          <p>Without a clear, unedited unboxing video recorded while opening the parcel and sent within the 5-day delivery window, we cannot process any replacement claims.</p>

          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">4. Replacement Process</h2>
          <p>Once we receive your unboxing video on WhatsApp or email and verify the transit damage, we will process and handcraft a replacement for the exact same item. We will ship the replacement at no additional cost to you.</p>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
