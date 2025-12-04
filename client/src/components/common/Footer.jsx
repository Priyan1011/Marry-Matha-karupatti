import { Mail, Phone, MapPin, Clock, Instagram, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-karupatti-brownDark text-karupatti-cream mt-16">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1: Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">
              🌴 Marry Matha Karupatti
            </h3>
            <p className="text-karupatti-cream text-sm leading-relaxed">
              Natural palm jaggery products from Tamil Nadu – healthy sweetness for your family. Pure, organic, and artisanal.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://wa.me/917092337678?text=Hello%20Marry%20Matha%20Karupatti"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg"
                title="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg"
                title="Instagram"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-widest mb-5 border-b border-karupatti-golden pb-2">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/shop"
                  className="text-karupatti-cream hover:text-karupatti-golden transition-colors duration-200"
                >
                  🏠 Home
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/listing"
                  className="text-karupatti-cream hover:text-karupatti-golden transition-colors duration-200"
                >
                  🛍️ Shop Products
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/packing-details"
                  className="text-karupatti-cream hover:text-karupatti-golden transition-colors duration-200"
                >
                  📦 Packing Details
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/about"
                  className="text-karupatti-cream hover:text-karupatti-golden transition-colors duration-200"
                >
                  ℹ️ About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/contact"
                  className="text-karupatti-cream hover:text-karupatti-golden transition-colors duration-200"
                >
                  📞 Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Products */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-widest mb-5 border-b border-karupatti-golden pb-2">
              Our Products
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <span className="text-karupatti-cream cursor-default">
                  🍯 Karupatti (Palm Jaggery)
                </span>
              </li>
              <li>
                <span className="text-karupatti-cream cursor-default">
                  ✨ Palm Kalkandu
                </span>
              </li>
              <li>
                <span className="text-karupatti-cream cursor-default">
                  💧 Karupatti Syrup
                </span>
              </li>
              <li>
                <span className="text-karupatti-cream cursor-default">
                  🌾 Jaggery Powder
                </span>
              </li>
              <li>
                <a
                  href="/shop/contact"
                  className="text-karupatti-cream hover:text-karupatti-golden transition-colors duration-200"
                >
                  💼 Wholesale Orders
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-widest mb-5 border-b border-karupatti-golden pb-2">
              Contact Info
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-karupatti-golden flex-shrink-0 mt-0.5" />
                <span className="text-karupatti-cream">
                  <a
                    href="tel:+917092337678"
                    className="hover:text-karupatti-golden transition-colors"
                  >
                    +91 70923 37678
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-karupatti-golden flex-shrink-0 mt-0.5" />
                <span className="text-karupatti-cream">
                  <a
                    href="mailto:marrymathakarupatti@gmail.com"
                    className="hover:text-karupatti-golden transition-colors break-all"
                  >
                    marrymathakarupatti@gmail.com
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-karupatti-golden flex-shrink-0 mt-0.5" />
                <span className="text-karupatti-cream">
                  Narippaiyur, Ramanathapuram, Tamil Nadu
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-karupatti-golden flex-shrink-0 mt-0.5" />
                <span className="text-karupatti-cream">
                  10:00 AM - 7:00 PM (Mon-Sat)
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-karupatti-golden/30"></div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-karupatti-cream/80">
          <p>
            © {currentYear} Marry Matha Karupatti. All rights reserved. | Made with ❤️ in Tamil Nadu
          </p>
          <div className="flex gap-6">
    <Link 
      to="/privacy-policy" 
      className="hover:text-karupatti-golden transition-colors"
    >
      Privacy Policy
    </Link>
    <Link 
      to="/terms-conditions" 
      className="hover:text-karupatti-golden transition-colors"
    >
      Terms & Conditions
    </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;