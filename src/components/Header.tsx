import logo from "../assets/appg-logo.png";

const Header = () => {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-primary-700 to-primary-600 py-20 px-4">
      <div className="container mx-auto text-center relative z-10">
        <h1
          className="text-6xl md:text-7xl font-bold mb-4 animate-fadeInUp tracking-wider text-white"
          style={{ color: "white" }}
        >
          CORCON 2025
        </h1>
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Asian Paints PPG Private Limited"
            className="h-24 md:h-32 w-auto object-contain animate-fadeIn"
            style={{ animationDelay: "0.2s" }}
          />
        </div>
        <div
          className="inline-block bg-white/10 backdrop-blur-md rounded-full px-8 py-4 animate-fadeIn shadow-xl border border-white/20"
          style={{ animationDelay: "0.3s" }}
        >
          <span className="font-semibold text-white text-sm md:text-base">
            50:50 Joint Venture
          </span>
          <span className="mx-3 text-white/50">•</span>
          <span className="text-white/90 text-sm md:text-base">
            Asian Paints Limited × PPG Industries, USA
          </span>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-[20%] left-[10%] w-[150px] h-[150px] rounded-full blur-[40px] z-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
      <div className="absolute bottom-[20%] right-[10%] w-[200px] h-[200px] rounded-full blur-[40px] z-0 bg-[radial-gradient(circle,rgba(226,83,60,0.2)_0%,transparent_70%)]" />

      {/* Animated pulse effect */}
      <div className="absolute top-0 right-0 w-full h-full animate-pulse-slow">
        <div className="absolute top-[-50%] right-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
      </div>
    </header>
  );
};

export default Header;
