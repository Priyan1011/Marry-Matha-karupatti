import React from 'react';
import { Link } from 'react-router-dom';

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-karupatti-cream to-karupatti-creamDark py-16 px-4 md:px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-block mb-6">
            <span className="text-karupatti-brownDark hover:text-karupatti-accent transition-colors font-serif font-bold text-xl">
              ← Back to Home
            </span>
          </Link>
          <h1 className="font-serif font-bold text-3xl md:text-4xl text-karupatti-brownDark mb-4">
            Terms & Conditions
          </h1>
          <p className="text-karupatti-brown">
            Last Updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="prose prose-lg max-w-none text-karupatti-brown">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-karupatti-brownDark mb-4">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using the Marry Matha Karupatti website and services, you agree to be bound by these Terms & Conditions. 
                If you disagree with any part, you may not access our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-karupatti-brownDark mb-4">
                2. Products & Services
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>All products are 100% natural palm jaggery products</li>
                <li>Product images are for representation; actual products may vary slightly</li>
                <li>We reserve the right to modify or discontinue products without notice</li>
                <li>Prices are subject to change without notice</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-karupatti-brownDark mb-4">
                3. Orders & Payments
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Orders are subject to availability</li>
                <li>Payment must be completed before order processing</li>
                <li>We accept various payment methods as displayed during checkout</li>
                <li>All payments are processed securely through trusted payment gateways</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-karupatti-brownDark mb-4">
                4. Shipping & Delivery
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>We ship throughout India via trusted courier partners</li>
                <li>Shipping times are estimates and not guaranteed</li>
                <li>Shipping costs are calculated at checkout</li>
                <li>Risk of loss transfers to you upon delivery</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-karupatti-brownDark mb-4">
                5. Returns & Refunds
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>We accept returns within 7 days of delivery for defective/damaged products</li>
                <li>Products must be in original packaging</li>
                <li>Refunds are processed within 5-7 business days</li>
                <li>Shipping costs are non-refundable unless the error is ours</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-karupatti-brownDark mb-4">
                6. Intellectual Property
              </h2>
              <p>
                All content on this website (logos, text, images, design) is the property of Marry Matha Karupatti 
                and protected by copyright laws. You may not reproduce, distribute, or create derivative works without permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-karupatti-brownDark mb-4">
                7. Limitation of Liability
              </h2>
              <p>
                Marry Matha Karupatti is not liable for any indirect, incidental, or consequential damages arising from:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Use or inability to use our services</li>
                <li>Unauthorized access to your data</li>
                <li>Third-party conduct on our website</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-karupatti-brownDark mb-4">
                8. Governing Law
              </h2>
              <p>
                These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive 
                jurisdiction of courts in Ramanathapuram, Tamil Nadu.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-karupatti-brownDark mb-4">
                9. Contact Information
              </h2>
              <p>
                For questions about these Terms:
                <br />
                <strong>Marry Matha Karupatti</strong>
                <br />
                Narippaiyur, Ramanathapuram, Tamil Nadu
                <br />
                Email: marrymathakarupatti@gmail.com
                <br />
                Phone: +91 70923 37678
              </p>
            </section>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-karupatti-brown">
                We reserve the right to update these Terms & Conditions at any time. Continued use of our services 
                constitutes acceptance of revised terms.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex justify-center gap-6 mt-12 text-sm">
          <Link to="/privacy-policy" className="text-karupatti-accent hover:text-karupatti-brownDark transition-colors">
            Privacy Policy
          </Link>
          <Link to="/" className="text-karupatti-brown hover:text-karupatti-accent transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;