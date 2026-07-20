import React from 'react';
import SEO from '../components/SEO';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#fdfbf7] pt-24 pb-20 font-body">
      <SEO 
        title="Privacy Policy" 
        description="Our privacy policy explains how we collect, use, and protect your personal information." 
      />
      <div className="container-custom max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-stone-900 mb-8 text-center">Privacy Policy</h1>
        
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-stone-100 prose prose-stone max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">1. Information We Collect</h2>
          <p>When you visit our website, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.</p>
          <p>Additionally, when you make a purchase or attempt to make a purchase through the Site, we collect certain information from you, including your name, billing address, shipping address, payment information, email address, and phone number.</p>

          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">2. How We Use Your Information</h2>
          <p>We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).</p>
          <p>Additionally, we use this Order Information to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Communicate with you;</li>
            <li>Screen our orders for potential risk or fraud; and</li>
            <li>When in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.</li>
          </ul>

          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">3. Sharing Your Personal Information</h2>
          <p>We share your Personal Information with third parties to help us use your Personal Information, as described above. For example, we use third-party delivery partners to fulfill your orders.</p>
          <p>We may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.</p>

          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">4. Data Retention</h2>
          <p>When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.</p>

          <h2 className="text-xl font-heading font-semibold text-stone-900 mt-8 mb-4">5. Contact Us</h2>
          <p>For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at <strong>support@embroiderybysana.live</strong> or by mail using the details provided below:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Crochet Wali</strong></li>
            <li>New Delhi, India</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
