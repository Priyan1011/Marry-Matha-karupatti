import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

const AboutUs = () => {
  const navigate = useNavigate();
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const teamMembers = [
    {
      id: 1,
      name: 'ஈஸ்தாகியார்',
      nameEng: 'Esthakiyar',
      role: 'Palm Climber',
      roleDesc: 'Traditional palm juice collector with 30+ years experience',
      image: '/images/esthakiyar.png',
      accent: 'from-amber-100 to-amber-50',
    },
    {
      id: 2,
      name: 'மாரி',
      nameEng: 'Marry',
      role: 'Jaggery Master',
      roleDesc: 'Expert in traditional stone-pressed jaggery making',
      image: '/images/marry.jpg',
      accent: 'from-orange-100 to-orange-50',
    },
    {
      id: 3,
      name: 'ரேமி',
      nameEng: 'Remi',
      role: 'Master Artisan',
      roleDesc: 'Skilled craftsman preserving 150 years of family tradition',
      image: '/images/remi.png',
      accent: 'from-yellow-100 to-yellow-50',
    },
  ];

  const processSteps = [
    {
      id: 1,
      icon: '🌴',
      title: 'Palm Collection',
      description: 'Fresh palm juice collected at dawn',
    },
    {
      id: 2,
      icon: '🔥',
      title: 'Slow Boiling',
      description: 'Heated in clay pots over firewood',
    },
    {
      id: 3,
      icon: '⚗️',
      title: 'Zero Chemicals',
      description: 'No additives, preservatives, or colors',
    },
    {
      id: 4,
      icon: '🍯',
      title: 'Traditional Molding',
      description: 'Hand-shaped using ancestral methods',
    },
    {
      id: 5,
      icon: '📦',
      title: 'Eco Packaging',
      description: 'Natural packaging to preserve freshness',
    },
    {
      id: 6,
      icon: '🚚',
      title: 'Fresh Delivery',
      description: 'Delivered direct from village to your kitchen',
    },
  ];

  const values = [
    {
      id: 1,
      icon: '🌿',
      title: 'Pure & Natural',
      description: 'No chemicals, no sugar, no artificial colors—just pure palm goodness.',
    },
    {
      id: 2,
      icon: '🤝',
      title: 'Fair Trade',
      description: 'Supporting local farmers and artisans at ethical prices for over 150 years.',
    },
    {
      id: 3,
      icon: '♻️',
      title: 'Sustainable',
      description: 'Eco-friendly practices and traditional methods passed down through generations.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-karupatti-cream to-karupatti-creamDark">
      {/* ========== PREMIUM HERO SECTION ========== */}
      <section className="relative min-h-screen md:h-screen px-4 md:px-6 overflow-hidden flex items-center justify-center pt-16 md:pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-karupatti-creamDark via-karupatti-cream to-karupatti-cream"></div>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }}></div>
        <div className="absolute top-10 right-10 w-96 h-96 bg-karupatti-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-karupatti-brown/3 rounded-full blur-3xl"></div>

        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <div className="hidden lg:block h-20"></div>

          <div className="flex justify-center mb-12 md:mb-16">
            <div className="relative group">
              <div className="absolute -inset-12 md:-inset-16 lg:-inset-20 rounded-full border-2 border-karupatti-accent/20 transition-all duration-700 group-hover:border-karupatti-accent/60 group-hover:scale-150 group-hover:blur-sm"></div>
              <div className="absolute -inset-8 md:-inset-12 rounded-full border border-karupatti-accent/15 transition-all duration-700 group-hover:scale-125"></div>
              <div className="absolute -inset-4 md:-inset-6 rounded-full border border-karupatti-accent/10 group-hover:border-karupatti-accent/30 transition-all duration-500"></div>

              <div className="relative w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64">
                {!logoLoaded && (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-karupatti-cream to-karupatti-accent/10 rounded-full animate-pulse">
                    <div className="text-center">
                      <div className="font-serif text-xl md:text-2xl font-bold text-karupatti-brownDark mb-1">
                        Marry Matha
                      </div>
                      <div className="font-serif text-lg md:text-xl font-bold text-karupatti-accent">
                        Karupatti
                      </div>
                    </div>
                  </div>
                )}

                <img
                  src="/images/logo.png"
                  alt="Marry Matha Karupatti Logo"
                  className={`relative w-full h-full object-contain hover:scale-150 transition-transform duration-700 drop-shadow-xl cursor-pointer ${!logoLoaded ? 'opacity-0 absolute' : 'opacity-100'}`}
                  onLoad={() => setLogoLoaded(true)}
                  onError={(e) => {
                    console.error('Logo failed to load, showing fallback');
                    e.target.style.display = 'none';
                    setLogoLoaded(false);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mb-6 md:mb-8">
            <h1 className="font-serif font-bold text-5xl md:text-7xl lg:text-8xl text-karupatti-brownDark mb-4 tracking-tight leading-tight drop-shadow-lg animate-fadeIn font-tamil">
              நம் கற்பத்தி, நம் வரலாறு
            </h1>
          </div>

          <div className="mb-8 md:mb-10">
            <p className="text-lg md:text-2xl lg:text-2xl text-karupatti-brown font-light tracking-wide mb-3 leading-relaxed">
              A Tradition Sweetened by Time
            </p>
            <p className="text-base md:text-lg text-karupatti-accent font-semibold tracking-widest uppercase">
              150+ Years of Purity & Heritage
            </p>
          </div>

          <div className="flex justify-center items-center gap-4 mb-12 md:mb-16">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent to-karupatti-accent rounded-full"></div>
            <div className="flex gap-3">
              <div className="w-2.5 h-2.5 bg-karupatti-accent rounded-full shadow-lg"></div>
              <div className="w-2.5 h-2.5 bg-karupatti-brownDark rounded-full shadow-lg"></div>
              <div className="w-2.5 h-2.5 bg-karupatti-accent rounded-full shadow-lg"></div>
            </div>
            <div className="w-16 h-1 bg-gradient-to-l from-transparent to-karupatti-accent rounded-full"></div>
          </div>

          <div className="mb-16 md:mb-20">
            <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-2xl mx-auto">
              <div className="group">
                <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/40 hover:border-karupatti-accent/30">
                  <p className="font-serif font-bold text-2xl md:text-4xl text-karupatti-accent mb-2">
                    150+
                  </p>
                  <p className="text-xs md:text-sm text-karupatti-brown font-medium">
                    Years Old
                  </p>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/40 hover:border-karupatti-accent/30">
                  <p className="font-serif font-bold text-2xl md:text-4xl text-karupatti-accent mb-2">
                    4
                  </p>
                  <p className="text-xs md:text-sm text-karupatti-brown font-medium">
                    Generations
                  </p>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/40 hover:border-karupatti-accent/30">
                  <p className="font-serif font-bold text-2xl md:text-4xl text-karupatti-accent mb-2">
                    100%
                  </p>
                  <p className="text-xs md:text-sm text-karupatti-brown font-medium">
                    Pure & Natural
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-8">
            <div className="flex flex-col items-center gap-3 animate-bounce">
              <p className="text-xs md:text-sm text-karupatti-brown/50 font-semibold uppercase tracking-widest">
                Scroll to explore
              </p>
              <svg
                className="w-6 h-6 text-karupatti-accent/70 animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ========== OUR STORY SECTION ========== */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="font-serif font-bold text-3xl md:text-4xl text-karupatti-brownDark mb-6 leading-tight">
                Our Story: A Tradition Sweetened by Time
              </h2>

              <div className="space-y-4 text-karupatti-brown text-base md:text-lg leading-relaxed">
                <p>
                  Our journey began in the heart of Tamil Nadu, where palm trees stand tall and tradition lives in every household. At Marry Matha Karupatti, we continue the ancestral art of making pure palm jaggery using firewood, clay pots, and sacred craftsmanship—without chemicals, preservatives, or machines.
                </p>

                <p>
                  For <span className="font-bold text-karupatti-brownDark">over 150 years</span>, our family in Narippaiyur village, Ramanathapuram district, has perfected this craft. From our grandfather's grandfather to today, every generation has maintained the same principles: purity, tradition, and respect for the land.
                </p>

                <p>
                  We supply pure karupatti to nearby shops wholesale, ensuring every batch meets our family's uncompromising standards. No shortcuts. No compromises. Just the same authentic karupatti that has nourished generations.
                </p>

                <p className="pt-4 italic text-karupatti-accent font-semibold font-tamil">
                  "செய்யும் கரங்களில் உணர்வு இருந்தால் சவையில் பாரம்பரியம் இருக்கும்."
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-10">
                <div className="border-l-4 border-karupatti-accent pl-4">
                  <p className="font-serif font-bold text-3xl text-karupatti-brownDark">150+</p>
                  <p className="text-sm text-karupatti-brown">Years of Tradition</p>
                </div>
                <div className="border-l-4 border-karupatti-accent pl-4">
                  <p className="font-serif font-bold text-3xl text-karupatti-brownDark">4</p>
                  <p className="text-sm text-karupatti-brown">Generations</p>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-karupatti-accent/20 to-karupatti-brown/10 rounded-2xl blur-3xl"></div>
                <img
                  src="/images/our-story1.png"
                  alt="Traditional Karupatti Making Process"
                  className="relative w-full rounded-2xl shadow-2xl object-cover aspect-square md:aspect-auto"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute -bottom-6 -right-6 bg-karupatti-accent text-white p-6 rounded-full shadow-lg">
                  <p className="font-serif font-bold text-center">
                    <span className="text-2xl md:text-3xl block">100%</span>
                    <span className="text-xs md:text-sm">Pure & Natural</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PROCESS TIMELINE SECTION ========== */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-karupatti-creamDark">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-karupatti-brownDark mb-4">
              From Palm to Your Table
            </h2>
            <p className="text-karupatti-brown text-lg max-w-2xl mx-auto">
              Each step honors the traditional methods passed down through generations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {processSteps.map((step, index) => (
              <div key={step.id} className="relative group">
                <div className="bg-white rounded-xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="text-4xl md:text-5xl mb-4 text-center">{step.icon}</div>
                  <h3 className="font-bold text-karupatti-brown text-center text-base md:text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-karupatti-brown/70 text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 lg:-right-6 w-8 lg:w-12 h-1 bg-gradient-to-r from-karupatti-accent to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== MEET THE TEAM SECTION ========== */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-karupatti-brownDark mb-4">
              Crafted by People, Not Machines
            </h2>
            <p className="text-karupatti-brown text-lg max-w-2xl mx-auto">
              Meet the artisans who dedicate their lives to preserving this sacred craft
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="group text-center transform transition-all duration-300 hover:scale-105"
              >
                <div
                  className={`relative mb-6 rounded-2xl overflow-hidden shadow-lg h-64 md:h-72 bg-gradient-to-b ${member.accent}`}
                >
                  <img
                    src={member.image}
                    alt={member.nameEng}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1592187270271-9a4b84faa222?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300"></div>
                </div>

                <div className="bg-gradient-to-b from-karupatti-creamDark to-white p-4 rounded-lg">
                  <h3 className="font-serif font-bold text-xl text-karupatti-brownDark mb-1">
                    {member.nameEng}
                  </h3>
                  <p className="text-sm text-karupatti-accent font-semibold mb-3 font-tamil">
                    {member.name}
                  </p>
                  <p className="font-bold text-karupatti-brown mb-2">{member.role}</p>
                  <p className="text-sm text-karupatti-brown/70 leading-relaxed">
                    {member.roleDesc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== VALUES SECTION ========== */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-karupatti-creamDark">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-karupatti-brownDark mb-4">
              Why Our Karupatti
            </h2>
            <p className="text-karupatti-brown text-lg max-w-2xl mx-auto">
              The values that guide every batch we make
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.id}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="font-bold text-xl text-karupatti-brownDark mb-3">
                  {value.title}
                </h3>
                <p className="text-karupatti-brown leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== NEW FSSAI CERTIFICATE SECTION ========== */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-karupatti-brownDark mb-4">
              Officially Certified & Registered
            </h2>
            <p className="text-karupatti-brown text-lg max-w-2xl mx-auto">
              Our commitment to quality and safety is verified by government authorities
            </p>
          </div>

          <div className="bg-gradient-to-r from-karupatti-creamDark to-karupatti-cream rounded-3xl p-8 md:p-12 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="font-bold text-green-700 text-lg">Active Registration</p>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div>
                    <p className="text-sm text-karupatti-brown/70 mb-1">Registration Number</p>
                    <p className="font-serif font-bold text-2xl text-karupatti-brownDark">22424326000116</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-karupatti-brown/70 mb-1">Issued On</p>
                      <p className="font-bold text-karupatti-brownDark">26-01-2024</p>
                    </div>
                    <div>
                      <p className="text-sm text-karupatti-brown/70 mb-1">Valid Until</p>
                      <p className="font-bold text-karupatti-brownDark">25-01-2029</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-karupatti-brown/70 mb-1">Issuing Authority</p>
                    <p className="font-bold text-karupatti-brownDark">Tamil Nadu Food Safety Wing</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-karupatti-brown/70 mb-1">Business Type</p>
                    <p className="font-bold text-karupatti-brownDark">Registered Retailer</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-karupatti-brown/70 mb-1">Contact Number</p>
                    <p className="font-bold text-karupatti-brownDark text-xl">70923 37624</p>
                  </div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl">
                  <p className="text-sm text-karupatti-brown">
                    <span className="font-semibold">Certified under:</span> Food Safety and Standards Act, 2006
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-karupatti-accent/20 to-transparent rounded-2xl blur-2xl"></div>
                <img
                  src="/images/fssai-certificate.jpg"
                  alt="FSSAI Registration Certificate"
                  className="relative w-full rounded-xl shadow-2xl border-4 border-white"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute -top-4 -right-4 bg-karupatti-accent text-white px-4 py-2 rounded-lg shadow-lg">
                  <p className="text-sm font-semibold">FSSAI Certified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== LOCATION & HERITAGE SECTION ========== */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-karupatti-creamDark to-karupatti-cream rounded-3xl p-12 md:p-16 text-center shadow-xl">
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-karupatti-brownDark mb-4">
              Narippaiyur, Ramanathapuram
            </h2>
            <p className="text-karupatti-brown text-lg md:text-xl mb-6 leading-relaxed">
              A small village in Tamil Nadu where tradition meets passion. Here, under palm-filled skies, three generations craft pure karupatti using the same methods that have stood the test of time.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <div className="bg-white rounded-lg px-6 py-3 shadow-md">
                <p className="font-bold text-karupatti-brownDark">📍 Village Heritage</p>
              </div>
              <div className="bg-white rounded-lg px-6 py-3 shadow-md">
                <p className="font-bold text-karupatti-brownDark">🌾 Artisan Made</p>
              </div>
              <div className="bg-white rounded-lg px-6 py-3 shadow-md">
                <p className="font-bold text-karupatti-brownDark">🏆 Award Quality</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION - EXPLORE PRODUCTS ========== */}
      <section className="py-20 md:py-28 px-4 md:px-6 bg-karupatti-brownDark text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-serif font-bold text-3xl md:text-4xl mb-6">
            Experience Pure Karupatti
          </h2>
          <p className="text-lg md:text-xl text-gray-200 mb-12 leading-relaxed">
            Taste the difference that 150 years of tradition brings. Every batch is a testament to our commitment to purity and quality.
          </p>

          <button
            onClick={() => navigate('/shop/listing')}
            className="group inline-flex items-center justify-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-karupatti-accent hover:bg-karupatti-accent/90 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
          >
            <span>Explore Our Products</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* ========== FOOTER QUOTE SECTION ========== */}
      <section className="py-12 md:py-16 px-4 md:px-6 bg-gradient-to-b from-karupatti-brownDark to-karupatti-brown text-white text-center">
        <div className="container mx-auto max-w-3xl">
          <p className="font-serif text-lg md:text-xl italic leading-relaxed font-tamil">
            "செய்யும் கரங்களில் உணர்வு இருந்தால் சவையில் பாரம்பரியம் இருக்கும்."
          </p>
          <p className="text-sm text-gray-300 mt-4">
            When love flows through working hands, tradition flows through the creation.
          </p>
          <div className="mt-8 pt-8 border-t border-white/20 text-sm text-gray-300">
            <p>Marry Matha Karupatti © 2025 | Narippaiyur Village, Ramanathapuram, Tamil Nadu</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;