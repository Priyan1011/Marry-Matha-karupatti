import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* LEFT SIDE - HERO SECTION */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden px-8">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-r from-yellow-500/20 to-yellow-400/10 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-t from-yellow-500/10 to-transparent rounded-full blur-3xl -ml-32 -mb-32 animate-pulse" style={{ animationDelay: "0.5s" }}></div>

        <div className="relative z-10 max-w-sm space-y-4 text-center">
          {/* Brand Logo - Emoji */}
          <div className="flex justify-center mb-2 animate-fadeInDown">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center text-4xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              🍯
            </div>
          </div>

          {/* Brand Name */}
          <div className="space-y-0.5 animate-fadeIn" style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}>
            <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-lg">
              Marry Matha
            </h1>
            <p className="text-yellow-400 font-semibold uppercase tracking-widest text-xs">
              Karupatti Premium
            </p>
          </div>

          {/* Headline */}
          <h2 className="text-xl font-bold text-white leading-tight drop-shadow-md animate-fadeIn" style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}>
            Pure <span className="text-yellow-400">Jaggery</span> Crafted with <span className="text-yellow-400">Tradition</span>
          </h2>

          {/* Description */}
          <p className="text-gray-300 text-xs leading-relaxed animate-fadeIn" style={{ animationDelay: "0.4s", animationFillMode: "backwards" }}>
            Experience authentic 100% natural karupatti handcrafted using traditional methods passed down for generations.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-2 pt-1 animate-fadeIn" style={{ animationDelay: "0.5s", animationFillMode: "backwards" }}>
            <div className="bg-white/10 backdrop-blur border border-yellow-500/30 rounded-lg p-2.5 hover:bg-white/15 hover:border-yellow-400 transition-all duration-300 cursor-pointer group">
              <div className="text-2xl mb-0.5 group-hover:scale-110 transition-transform duration-300">🌾</div>
              <p className="font-semibold text-white text-xs">Farm Fresh</p>
              <p className="text-gray-400 text-xs">Direct from farms</p>
            </div>
            <div className="bg-white/10 backdrop-blur border border-yellow-500/30 rounded-lg p-2.5 hover:bg-white/15 hover:border-yellow-400 transition-all duration-300 cursor-pointer group">
              <div className="text-2xl mb-0.5 group-hover:scale-110 transition-transform duration-300">✨</div>
              <p className="font-semibold text-white text-xs">Pure Quality</p>
              <p className="text-gray-400 text-xs">No additives</p>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-1.5 pt-1 animate-fadeIn" style={{ animationDelay: "0.6s", animationFillMode: "backwards" }}>
            <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-md p-1.5 hover:bg-yellow-500/30 transition-all duration-300 hover:scale-105">
              <div className="text-lg mb-0.5">⚡</div>
              <p className="text-gray-200 text-xs font-medium">Natural Energy</p>
            </div>
            <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-md p-1.5 hover:bg-yellow-500/30 transition-all duration-300 hover:scale-105">
              <div className="text-lg mb-0.5">💪</div>
              <p className="text-gray-200 text-xs font-medium">Rich Minerals</p>
            </div>
            <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-md p-1.5 hover:bg-yellow-500/30 transition-all duration-300 hover:scale-105">
              <div className="text-lg mb-0.5">🏥</div>
              <p className="text-gray-200 text-xs font-medium">Health Boost</p>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="bg-white/10 backdrop-blur border border-yellow-500/25 rounded-lg p-2.5 space-y-1.5 mt-2 animate-fadeIn" style={{ animationDelay: "0.7s", animationFillMode: "backwards" }}>
            <p className="text-gray-400 uppercase text-xs font-semibold tracking-wide">Trusted by Thousands</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-base">★★★★★</span>
              <span className="text-white font-bold text-sm">4.9/5</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-yellow-500/20">
              <div>
                <p className="text-yellow-400 font-bold text-base">15K+</p>
                <p className="text-gray-400 text-xs uppercase">Customers</p>
              </div>
              <div>
                <p className="text-yellow-400 font-bold text-base">50K+</p>
                <p className="text-gray-400 text-xs uppercase">Orders</p>
              </div>
              <div>
                <p className="text-yellow-400 font-bold text-base">4.8★</p>
                <p className="text-gray-400 text-xs uppercase">Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - AUTH FORM */}
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default AuthLayout;