import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
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
            Privacy Policy
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
                1. Introduction
              </h2>
              <p>
                Marry Matha Karupatti ("we," "our," or "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you visit our website or purchase our products.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-karupatti-brownDark mb-4">
                2. Information We Collect
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Personal Information:</strong> Name, email address, phone number, shipping address</li>
                <li><strong>Payment Information:</strong> Transaction details (processed securely via payment gateway)</li>
                <li><strong>Technical Information:</strong> IP address, browser type, device information</li>
                <li><strong>Usage Data:</strong> Pages visited, time spent, referring website</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-karupatti-brownDark mb-4">
                3. How We Use Your Information
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Communicate about orders, products, and promotions</li>
                <li>Improve our website and customer experience</li>
                <li>Comply with legal obligations</li>
                <li>Prevent fraudulent activities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-karupatti-brownDark mb-4">
                4. Data Security
              </h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal 
                information. However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-karupatti-brownDark mb-4">
                5. Third-Party Services
              </h2>
              <p>
                We use trusted third-party services for payment processing, shipping, and analytics. 
                These services have their own privacy policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-karupatti-brownDark mb-4">
                6. Your Rights
              </h2>
              <p>
                You have the right to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-karupatti-brownDark mb-4">
                7. Contact Us
              </h2>
              <p>
                For privacy-related questions, contact us at:
                <br />
                <strong>Email:</strong> marrymathakarupatti@gmail.com
                <br />
                <strong>Phone:</strong> +91 70923 37678
                <br />
                <strong>Address:</strong> Narippaiyur, Ramanathapuram, Tamil Nadu
              </p>
            </section>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-karupatti-brown">
                This Privacy Policy may be updated periodically. We encourage you to review this page regularly.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex justify-center gap-6 mt-12 text-sm">
          <Link to="/terms-conditions" className="text-karupatti-accent hover:text-karupatti-brownDark transition-colors">
            Terms & Conditions
          </Link>
          <Link to="/" className="text-karupatti-brown hover:text-karupatti-accent transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;