import React from "react";
import logo from "../../assets/images/logo.png";
import almondLoose from "../../assets/images/almond-loose.png";
import cashewLoose from "../../assets/images/cashew-loose.png";
import makhanaLoose from "../../assets/images/makhana-loose.png";

import footerBanner from "../../assets/images/footer-banner1.png";

// Payment methods with distinct brand-ish colors instead of flat white chips
const paymentMethods = [
  { name: "UPI", bg: "#5F259F", text: "#FFFFFF" },
  { name: "Visa", bg: "#1A1F71", text: "#FFFFFF" },
  { name: "Mastercard", bg: "#EB001B", text: "#FFFFFF" },
  { name: "RuPay", bg: "#0A5C36", text: "#FFFFFF" },
  { name: "COD", bg: "#B8860B", text: "#FFFFFF" },
];

const Footer = () => {
  return (
    <>
      {/* ===== Pre-footer photo banner with curved divider into the footer ===== */}
      <section className="relative bg-[#FBF9F2] pt-16 pb-28 md:pb-36 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex items-center justify-center gap-8 md:gap-16 relative z-10">
          <div className="text-center md:text-right hidden sm:block">
            <p className="font-serif text-xl md:text-3xl text-[#3d2a1a] leading-tight">
              Pure Joy,
            </p>
            <p className="font-serif text-xl md:text-3xl italic text-[#B8860B] leading-tight">
              Naturally Yours.
            </p>
          </div>

          <img
            src={footerBanner}
            alt="House of Toshali"
            className="w-56 md:w-72 lg:w-80 object-contain drop-shadow-2xl flex-shrink-0"
          />

          <div className="text-center md:text-left hidden sm:block">
            <p className="font-serif text-xl md:text-3xl text-[#3d2a1a] leading-tight">
              Made with Care,
            </p>
            <p className="font-serif text-xl md:text-3xl italic text-[#B8860B] leading-tight">
              In Odisha.
            </p>
          </div>
        </div>

        {/* Curved divider — a distinct wave shape (not a mirror of any existing brand's curve),
            blending smoothly from the page background into the footer's cream tone below */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          style={{ height: "90px" }}
        >
          <path
            d="M0,0 C360,110 1080,110 1440,0 L1440,120 L0,120 Z"
            fill="#F3E4C8"
          />
        </svg>
      </section>

      {/* ===== Main footer ===== */}
      <footer className="bg-gradient-to-b from-[#F3E4C8] to-[#EFDFC8] text-[#3d2a1a] pt-10 pb-8 px-6 md:px-16 relative overflow-hidden border-t border-[#3d2a1a]/10">
        <img
          src={almondLoose}
          alt=""
          className="absolute -top-6 left-10 w-40 opacity-25 rotate-[-15deg] pointer-events-none select-none"
        />
        <img
          src={cashewLoose}
          alt=""
          className="absolute top-10 right-16 w-48 opacity-25 rotate-[10deg] pointer-events-none select-none"
        />
        <img
          src={makhanaLoose}
          alt=""
          className="absolute bottom-10 left-1/3 w-40 opacity-20 rotate-[8deg] pointer-events-none select-none"
        />

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10">
          <div>
            <div className="bg-white rounded-2xl p-3 shadow-md w-fit mb-4">
              <img
                src={logo}
                alt="House of Toshali"
                className="h-16 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-[#6b5940] leading-relaxed mb-4">
              Premium dry fruits, handpicked from the heart of Odisha.
            </p>

            {/* License / registration numbers — sit right under the logo & tagline */}
            <div className="flex flex-col gap-1.5">
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#3d2a1a] bg-white/70 border border-[#3d2a1a]/10 px-3 py-1.5 rounded-md w-fit">
                <span className="text-[#B8860B]">FSSAI</span>
                <span className="text-[#6b5940] font-medium">
                  12026999000089
                </span>
              </div>
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#3d2a1a] bg-white/70 border border-[#3d2a1a]/10 px-3 py-1.5 rounded-md w-fit">
                <span className="text-[#B8860B]">GSTIN</span>
                <span className="text-[#6b5940] font-medium">
                  21XXXXX0000X1Z5
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 text-[#B8860B]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-[#6b5940]">
              <li>
                <a href="/" className="hover:text-[#B8860B] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="hover:text-[#B8860B] transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className="hover:text-[#B8860B] transition-colors"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-[#B8860B] transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 text-[#B8860B]">
              Customer Care
            </h4>
            <ul className="space-y-2 text-sm text-[#6b5940]">
              <li>
                <a
                  href="/terms-of-service"
                  className="hover:text-[#B8860B] transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  className="hover:text-[#B8860B] transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/shipping-policy"
                  className="hover:text-[#B8860B] transition-colors"
                >
                  Shipping Policy
                </a>
              </li>
              <li>
                <a
                  href="/return-refund-policy"
                  className="hover:text-[#B8860B] transition-colors"
                >
                  Return & Refund Policy
                </a>
              </li>
              <li>
              
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 text-[#B8860B]">
              Get in Touch
            </h4>
            <p className="text-sm text-[#6b5940] mb-2">
              support@houseoftoshali.com
            </p>
            <p className="text-sm text-[#6b5940]">+91 98765 43210</p>
          </div>
        </div>

        <div className="border-t border-[#3d2a1a]/10 mt-10 pt-6 max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-5">
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#3d2a1a] hover:bg-[#3d2a1a] hover:text-white transition-colors shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12a10 10 0 10-11.5 9.9v-7H8v-2.9h2.5V9.4c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.5.3v2.7h-1.4c-1.4 0-1.7.6-1.7 1.5v1.9H17l-.4 2.9h-2.4v7A10 10 0 0022 12z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#3d2a1a] hover:bg-[#3d2a1a] hover:text-white transition-colors shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>
              <a
                href="#"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#3d2a1a] hover:bg-[#3d2a1a] hover:text-white transition-colors shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.04 2c-5.5 0-10 4.5-10 10 0 1.8.5 3.5 1.3 4.9L2 22l5.3-1.4c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10s-4.4-9.8-9.96-9.8zm5.8 14.1c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-.9-.3-1.6-.6-2.7-1.2-4.5-3.9-4.6-4.1-.1-.2-1.1-1.4-1.1-2.7s.7-1.9 1-2.2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4.2.5.7 1.7.7 1.8.1.2.1.3 0 .5-.1.2-.2.3-.3.5-.2.2-.3.3-.5.5-.2.2-.4.4-.2.7.3.5 1 1.4 1.9 2.1 1 .9 1.8 1.2 2.2 1.4.3.1.5.1.6-.1.2-.2.6-.7.8-1 .2-.2.4-.3.6-.2.2.1 1.5.7 1.7.8.2.1.4.2.4.3.1.2.1.7-.1 1.3z" />
                </svg>
              </a>
            </div>

            {/* Colorful payment badges — each carries its own brand color instead of a flat white chip */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-[#6b5940] mr-1">We accept:</span>
              {paymentMethods.map((method) => (
                <span
                  key={method.name}
                  className="text-[11px] font-semibold px-3 py-1.5 rounded-md shadow-sm"
                  style={{ backgroundColor: method.bg, color: method.text }}
                >
                  {method.name}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-[#B8860B]/20 pt-5 flex flex-col md:flex-row items-center justify-center md:justify-between gap-3 text-xs">
            <p className="text-[#6b5940]">
              © 2026{" "}
              <span className="font-semibold text-[#3d2a1a]">
                House of Toshali
              </span>
              . All rights reserved.
            </p>

            <p className="flex items-center gap-1.5 text-[#6b5940]">
              <span>IT Maintenance by</span>

              <a
                href="https://fidelsya.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="
        group relative inline-flex items-center
        px-3 py-1 rounded-full
        font-semibold
        text-[#8B6508]
        bg-gradient-to-r from-[#FFF8DC] via-[#F5E6A8] to-[#FFF8DC]
        border border-[#D4AF37]/40
        shadow-[0_2px_8px_rgba(184,134,11,0.15)]
        hover:shadow-[0_4px_14px_rgba(184,134,11,0.3)]
        hover:from-[#F5E6A8]
        hover:via-[#FFEFA8]
        hover:to-[#F5E6A8]
        hover:text-[#6B4E00]
        hover:-translate-y-[1px]
        transition-all duration-300
      "
              >
                <span className="relative z-10">
                  Fidelsya Technologies Pvt. Ltd.
                </span>

                <span
                  className="
          absolute inset-0 rounded-full
          bg-gradient-to-r from-transparent via-white/50 to-transparent
          opacity-0 group-hover:opacity-100
          -translate-x-full group-hover:translate-x-full
          transition-all duration-700
        "
                />
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
