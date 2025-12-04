import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, Loader } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import emailjs from '@emailjs/browser';

// Initialize EmailJS
emailjs.init('C7pKv_CNjKBp6SFj9');

const Contact = () => {
  const { toast } = useToast();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Send email using EmailJS - UPDATED IDs
      const result = await emailjs.send(
        'service_ansg4la',       // ✅ UPDATED Service ID
        'template_f3kqjco',      // ✅ UPDATED Template ID
        {
          to_email: 'marrymathakarupatti@gmail.com',
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone || 'Not provided',
          subject: formData.subject,
          message: formData.message,
        }
      );

      console.log('Email sent successfully:', result);

      toast({
        title: 'Thank you! 🙏',
        description: 'We received your message. We will get back to you within 24 hours.',
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'general',
        message: '',
      });
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: 'Oops! Something went wrong',
        description: 'Please try again or contact us directly via WhatsApp.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // FAQ Data
  const faqItems = [
    {
      id: 1,
      question: 'Where do you ship?',
      answer: 'We currently ship across Tamil Nadu and nearby regions. For bulk/wholesale orders, we can arrange special shipping. Contact us for details.',
    },
    {
      id: 2,
      question: 'Do you offer wholesale?',
      answer: 'Yes! We supply karupatti wholesale to shops and retailers. Please select "Wholesale/Bulk Order" in the contact form for pricing and terms.',
    },
    {
      id: 3,
      question: 'How many days for delivery?',
      answer: 'Standard delivery: 3-5 business days. Express delivery available in some areas. Delivery time will be confirmed after order placement.',
    },
  ];

  // Contact Info Data
  const contactInfo = [
    {
      icon: Phone,
      label: 'WhatsApp / Phone',
      value: '+91 70923 37624',
      action: 'https://wa.me/917092337624?text=Hello%20Marry%20Matha%20Karupatti',
      type: 'whatsapp',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'marrymathakarupatti@gmail.com',
      action: 'mailto:marrymathakarupatti@gmail.com',
      type: 'email',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Narippaiyur, Ramanathapuram, Tamil Nadu',
      action: null,
      type: 'location',
    },
    {
      icon: Clock,
      label: 'Support Hours',
      value: '10:00 AM - 7:00 PM (Mon-Sat)',
      action: null,
      type: 'hours',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-karupatti-cream to-white">
      {/* ========== HERO SECTION ========== */}
      <section className="relative py-16 md:py-20 px-4 md:px-6 bg-karupatti-creamDark overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-karupatti-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-karupatti-brown/3 rounded-full blur-3xl"></div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-6">
            <h1 className="font-serif font-bold text-4xl md:text-5xl text-karupatti-brownDark mb-4 tracking-tight">
              Get in Touch with Us
            </h1>
            <p className="text-lg text-karupatti-brown max-w-2xl mx-auto">
              Have questions about our karupatti? Want to order wholesale? We're here to help!
            </p>
          </div>

          {/* Decorative divider */}
          <div className="flex justify-center gap-2 mb-8">
            <div className="w-12 h-1 bg-karupatti-accent rounded-full"></div>
            <div className="w-2 h-2 bg-karupatti-brownDark rounded-full"></div>
            <div className="w-12 h-1 bg-karupatti-accent rounded-full"></div>
          </div>
        </div>
      </section>

      {/* ========== MAIN CONTENT ========== */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* LEFT SIDE: Contact Info */}
            <div>
              <h2 className="font-serif font-bold text-3xl text-karupatti-brownDark mb-8">
                Contact Information
              </h2>

              <div className="space-y-6">
                {contactInfo.map((info) => {
                  const Icon = info.icon;
                  return (
                    <div key={info.label}>
                      {info.action ? (
                        <a
                          href={info.action}
                          target={info.type === 'whatsapp' ? '_blank' : '_self'}
                          rel={info.type === 'whatsapp' ? 'noopener noreferrer' : 'noopener'}
                          className="block group"
                        >
                          <div className="flex items-start gap-4 p-5 rounded-xl transition-all duration-300 bg-white hover:bg-karupatti-creamDark hover:shadow-lg cursor-pointer transform hover:scale-105">
                            <div className="flex-shrink-0">
                              <Icon className="w-6 h-6 text-karupatti-accent mt-1" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-karupatti-brown text-sm uppercase tracking-wide">
                                {info.label}
                              </p>
                              <p className="text-karupatti-brownDark font-bold text-lg mt-1">
                                {info.value}
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <Send className="w-5 h-5 text-karupatti-accent/50 group-hover:text-karupatti-accent transition-colors" />
                            </div>
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-start gap-4 p-5 rounded-xl bg-white/60">
                          <div className="flex-shrink-0">
                            <Icon className="w-6 h-6 text-karupatti-accent mt-1" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-karupatti-brown text-sm uppercase tracking-wide">
                              {info.label}
                            </p>
                            <p className="text-karupatti-brownDark font-bold text-lg mt-1">
                              {info.value}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Response Time Notice */}
              <div className="mt-10 p-5 bg-karupatti-accent/10 rounded-xl border-l-4 border-karupatti-accent">
                <p className="text-karupatti-brown font-semibold">
                  ⏱️ Response Time
                </p>
                <p className="text-karupatti-brown/80 text-sm mt-2">
                  We typically respond within 24 hours on business days. Thank you for your patience!
                </p>
              </div>

              {/* Social Links */}
              <div className="mt-10">
                <p className="font-semibold text-karupatti-brown mb-4">Follow Us</p>
                <div className="flex gap-3">
                  <a
                    href="https://wa.me/917092337624?text=Hello%20Marry%20Matha%20Karupatti"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
                    title="WhatsApp"
                  >
                    <MessageSquare className="w-6 h-6" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
                    title="Instagram"
                  >
                    📷
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Contact Form */}
            <div>
              <h2 className="font-serif font-bold text-3xl text-karupatti-brownDark mb-8">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-karupatti-brown mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-karupatti-border rounded-lg focus:outline-none focus:ring-2 focus:ring-karupatti-accent focus:border-transparent transition-all bg-white text-karupatti-brownDark"
                    required
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-karupatti-brown mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-karupatti-border rounded-lg focus:outline-none focus:ring-2 focus:ring-karupatti-accent focus:border-transparent transition-all bg-white text-karupatti-brownDark"
                    required
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-karupatti-brown mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-3 border border-karupatti-border rounded-lg focus:outline-none focus:ring-2 focus:ring-karupatti-accent focus:border-transparent transition-all bg-white text-karupatti-brownDark"
                  />
                </div>

                {/* Subject Dropdown */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-karupatti-brown mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-karupatti-border rounded-lg focus:outline-none focus:ring-2 focus:ring-karupatti-accent focus:border-transparent transition-all bg-white text-karupatti-brownDark appearance-none cursor-pointer"
                    required
                  >
                    <option value="general">General Question</option>
                    <option value="order">Order / Delivery Issue</option>
                    <option value="wholesale">Wholesale / Bulk Order</option>
                    <option value="feedback">Feedback / Suggestion</option>
                  </select>
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-karupatti-brown mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us what's on your mind..."
                    rows="5"
                    className="w-full px-4 py-3 border border-karupatti-border rounded-lg focus:outline-none focus:ring-2 focus:ring-karupatti-accent focus:border-transparent transition-all bg-white text-karupatti-brownDark resize-none"
                    required
                  ></textarea>
                </div>

                {/* Privacy Notice */}
                <p className="text-xs text-karupatti-brown/60 italic">
                  We respect your privacy. Your information will never be shared or sold.
                </p>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 bg-karupatti-accent hover:bg-karupatti-accentHover text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FAQ SECTION ========== */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-karupatti-creamDark">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-karupatti-brownDark mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-karupatti-brown max-w-2xl mx-auto">
              Can't find what you're looking for? Check our FAQs or reach out directly!
            </p>
          </div>

          {/* FAQ Accordions */}
          <div className="space-y-4">
            {faqItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === item.id ? null : item.id)
                  }
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-karupatti-creamDark/50 transition-colors duration-200"
                >
                  <p className="font-semibold text-karupatti-brownDark text-lg">
                    {item.question}
                  </p>
                  <div
                    className={`w-6 h-6 flex-shrink-0 transition-transform duration-300 ${
                      expandedFaq === item.id ? 'rotate-180' : ''
                    }`}
                  >
                    <span className="text-karupatti-accent text-2xl leading-none">
                      {expandedFaq === item.id ? '−' : '+'}
                    </span>
                  </div>
                </button>

                {/* Accordion Content */}
                {expandedFaq === item.id && (
                  <div className="px-6 py-4 bg-karupatti-cream/30 border-t border-karupatti-border">
                    <p className="text-karupatti-brown leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA FOOTER ========== */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-karupatti-brownDark text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-serif font-bold text-3xl md:text-4xl mb-4">
            Prefer to Call?
          </h2>
          <p className="text-lg text-gray-200 mb-8">
            Give us a call or message on WhatsApp anytime. We're always ready to help!
          </p>
          <a
            href="https://wa.me/917092337624?text=Hello%20Marry%20Matha%20Karupatti"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <MessageSquare className="w-5 h-5" />
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
};

export default Contact;
