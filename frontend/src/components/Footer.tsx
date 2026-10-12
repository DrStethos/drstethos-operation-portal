import { Link } from "react-router-dom";
import { scrollToId } from "@/lib/motion";

const Footer = () => {
  return (
    <footer className="bg-[hsl(150,35%,8%)] text-white overflow-x-hidden">
      <div className="page-container py-14 md:py-16">
        <div className="grid md:grid-cols-[1.2fr_1fr_1fr] gap-10 md:gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="DrStethos" className="h-8 w-8 rounded-lg" />
              <span className="font-display text-lg font-semibold tracking-tight">DrStethos</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Connecting doctors with hospitals for modern healthcare hiring.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35 mb-4">
              Navigate
            </p>
            <ul className="space-y-3 text-sm text-white/65">
              {[
                ["about", "About"],
                ["for-doctors", "For Doctors"],
                ["for-hospitals", "For Hospitals"],
                ["how-it-works", "How it works"],
                ["pricing", "Pricing"],
                ["get-in-touch", "Contact"],
              ].map(([id, label]) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => scrollToId(id, 72)}
                    className="hover:text-white transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35 mb-4">
              Legal
            </p>
            <ul className="space-y-3 text-sm text-white/65">
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/termsandservices/forhospitals" className="hover:text-white transition-colors">
                  Terms for Hospitals
                </Link>
              </li>
              <li>
                <Link to="/termsandservices/fordoctors" className="hover:text-white transition-colors">
                  Terms for Doctors
                </Link>
              </li>
              <li>
                <Link to="/safety-standards" className="hover:text-white transition-colors">
                  Safety Standards
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-xs text-white/35">
          © {new Date().getFullYear()} DrStethos. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
