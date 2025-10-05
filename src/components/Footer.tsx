import { MapPin, Phone, Mail, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-primary-800 to-primary-700 text-white py-16 relative">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12 mb-12">
          <div className="lg:col-span-4">
            <h3
              className="text-2xl font-bold mb-4 text-white"
              style={{ color: "white" }}
            >
              Asian Paints PPG
            </h3>
            <p className="mb-6 text-white/70 leading-relaxed">
              Leading provider of industrial coating solutions with a commitment
              to quality, innovation, and customer satisfaction.
            </p>
            <div className="flex gap-3">
              {["F", "T", "L", "I"].map((letter, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 border border-white/20 text-white transition-all duration-300 hover:bg-gradient-primary hover:-translate-y-1"
                  aria-label={`Social media link ${letter}`}
                >
                  {letter}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4
              className="text-white font-semibold mb-4 text-lg"
              style={{ color: "white" }}
            >
              Contact Information
            </h4>
            <div className="flex gap-3 mb-3">
              <div className="mt-1">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <p className="text-white/80 text-sm">+91 (22) 6218 2700</p>
            </div>
            <div className="flex gap-3 mb-3">
              <div className="mt-1">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <a
                href="mailto:customercare.apppg@asianpaintsppg.com"
                className="text-white/80 text-sm hover:text-primary transition-colors no-underline"
              >
                customercare.apppg@asianpaintsppg.com
              </a>
            </div>
            <div className="flex gap-3">
              <div className="mt-1">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <a
                href="https://www.asianpaintsppg.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 text-sm hover:text-primary transition-colors no-underline"
              >
                www.asianpaintsppg.com
              </a>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4
              className="text-white font-semibold mb-4 text-lg"
              style={{ color: "white" }}
            >
              Our Location
            </h4>
            <div className="flex gap-3">
              <div className="mt-1">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                Plot No. 5, Gaiwadi Industrial Estate,
                <br />
                S V Road, Goregaon (West),
                <br />
                Mumbai 400 062
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4
              className="text-white font-semibold mb-4 text-lg"
              style={{ color: "white" }}
            >
              Company
            </h4>
            <p className="text-white/80 text-xs">
              <strong>CIN:</strong>
              <br />
              U24110MH2011PTC220557
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 mt-6 text-center border-t border-primary/20">
          <p className="mb-2 text-white/60 text-sm">
            © {new Date().getFullYear()} Asian Paints PPG Private Limited. All
            rights reserved.
          </p>
          <p className="text-white/50 text-xs">
            50:50 Joint Venture - Asian Paints Limited × PPG Industries, USA
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
