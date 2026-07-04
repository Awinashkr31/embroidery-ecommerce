import React from 'react';
import SEO from '../components/SEO';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-[#fdfbf7] pt-24 pb-20 font-body">
      <SEO 
        title="Terms of Service" 
        description="Read our Terms of Service to understand the rules and guidelines for using Embroidery By Sana." 
      />
      <div className="container-custom max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-stone-900 mb-8 text-center">Terms of Service</h1>
        
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-stone-100 prose prose-stone max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">1. Introduction</h2>
          <p>Welcome to Embroidery By Sana. By accessing or using our website, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services.</p>
          
          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">2. Products and Services</h2>
          <p>Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to replacement only according to our Return Policy (No returns are permitted; only 5-day replacements for damaged goods with a mandatory unboxing video).</p>
          <p>We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.</p>

          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">3. Accuracy of Billing and Account Information</h2>
          <p>We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e-mail and/or billing address/phone number provided at the time the order was made.</p>

          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">4. User Comments and Feedback</h2>
          <p>If, at our request, you send certain specific submissions or without a request from us you send creative ideas, suggestions, proposals, plans, or other materials, whether online, by email, by postal mail, or otherwise, you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us.</p>

          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">5. Modifications to the Service and Prices</h2>
          <p>Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.</p>

          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">6. Contact Information</h2>
          <p>Questions about the Terms of Service should be sent to us at <strong>hello@sanaembroidery.com</strong>.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
