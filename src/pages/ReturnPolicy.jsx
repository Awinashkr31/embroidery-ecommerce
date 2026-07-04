import React from 'react';
import SEO from '../components/SEO';

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-[#fdfbf7] pt-24 pb-20 font-body">
      <SEO 
        title="Return & Refund Policy" 
        description="Learn about our return, refund, and exchange policies at Embroidery By Sana." 
      />
      <div className="container-custom max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-stone-900 mb-8 text-center">Return & Refund Policy</h1>
        
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-stone-100 prose prose-stone max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">1. No Returns or Refunds</h2>
          <p>We do not provide any returns or refunds on our products. All sales are final. Please carefully review your order before making a purchase.</p>
          
          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">2. 5-Day Replacement Policy for Damaged Products</h2>
          <p>If you receive a damaged or defective product, we offer a 5-day replacement policy. You must notify us within 5 days of delivery to be eligible for a replacement.</p>

          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">3. Mandatory Unboxing Video</h2>
          <p>To process any claim for a damaged product, an <strong>unboxing video is strictly required</strong>. You must send the unboxing video to our WhatsApp support at <strong><a href="https://wa.me/917428013214" className="text-rose-600 hover:underline">+91 7428013214</a></strong> within <strong>48 hours</strong> of receiving the package.</p>
          <p>Without a clear, unedited unboxing video sent within the 48-hour window, we will not be able to process any claims or replacements.</p>

          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">4. Replacement Process</h2>
          <p>Once we receive your unboxing video on WhatsApp and verify the damage, we will process a replacement for the exact same item. We will arrange for the pickup of the damaged product and ship the replacement at no additional cost to you.</p>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
