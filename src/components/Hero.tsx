const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-white py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_20%_50%,rgba(46,98,132,0.15)_0%,transparent_50%)]" />
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_80%_80%,rgba(226,83,60,0.1)_0%,transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 text-center py-8 relative z-10">
        <div className="flex justify-center">
          <div className="max-w-5xl">
            <div className="mb-6">
              <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full px-6 py-2 mb-6 text-sm font-semibold tracking-wide shadow-lg">
                Industry Leading Solutions
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-fadeInUp bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 bg-clip-text text-transparent leading-tight">
              Protection and Performance Solutions
            </h1>

            <p
              className="text-xl mx-auto mb-12 max-w-3xl leading-relaxed text-gray-700 font-normal animate-fadeIn"
              style={{ animationDelay: "0.2s" }}
            >
              Leading the industry with innovative industrial coating solutions
              designed to protect, preserve, and enhance your assets. Our
              comprehensive range of products delivers exceptional performance
              in the most demanding environments.
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { title: "Innovation", icon: "⚡" },
                { title: "Quality", icon: "✨" },
                { title: "Performance", icon: "🎯" },
                { title: "Reliability", icon: "🛡️" },
              ].map((item, index) => (
                <div key={index}>
                  <div className="p-4 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-primary-100">
                    <div className="text-5xl mb-2" aria-hidden="true">
                      {item.icon}
                    </div>
                    <div className="font-semibold text-primary-700">
                      {item.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
