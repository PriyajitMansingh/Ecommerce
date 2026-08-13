import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Truck, Clock, Globe, Package, AlertCircle, Mail, Phone, MessageCircle } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'

const ShippingPolicy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="bg-[#FBF9F2] min-h-screen font-sans">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#3d2a1a] via-[#4a3520] to-[#3d2a1a] overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 opacity-20 bg-no-repeat bg-center"
            style={{
              backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            }}
          />
        </div>

        <div className="relative px-6 md:px-12 py-16 md:py-24 max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[#B8860B]/80 mb-6">
            <Link 
              to="/" 
              className="hover:text-[#B8860B] transition-all duration-300 flex items-center gap-1 group text-[#B8860B]"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Home</span>
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white/90 font-medium">Shipping Policy</span>
          </nav>

          <p className="font-mono text-xs uppercase tracking-widest text-[#B8860B] mb-3">
            Legal · Policy 02 of 03
          </p>
          <h1 className="font-serif font-medium text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight mb-4 text-white">
            Shipping Policy
          </h1>
          <p className="text-lg text-[#FBF9F2]/80 max-w-2xl mb-4 font-light">
            Here's how, when, and where we get your order to you — including timelines, 
            rates, and what happens if something goes wrong along the way.
          </p>
          <p className="font-mono text-xs text-[#B8860B] mt-4">
            Last updated: August 7, 2026
          </p>
        </div>
      </div>

      {/* At-a-Glance Section */}
      <div className="px-6 md:px-8 -mt-8 relative z-10 max-w-7xl mx-auto">
        <div className="bg-white border border-[#3d2a1a]/10 rounded-3xl shadow-[0_8px_30px_rgba(61,42,26,0.08)] overflow-hidden">
          <div className="px-6 py-6 sm:px-8 sm:py-8 border-b border-[#3d2a1a]/5 bg-[#FBF9F2]/40">
            <p className="font-mono text-xs uppercase tracking-widest text-[#B8860B] mb-2">Shipping snapshot</p>
            <h2 className="font-serif text-2xl text-[#3d2a1a] font-semibold">Quick shipping overview</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#3d2a1a]/5">
            <div className="bg-white p-6 hover:bg-[#FBF9F2]/20 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-[#B8860B]" />
                <p className="font-mono text-xs uppercase tracking-wider text-[#6b5940]">Order processing</p>
              </div>
              <p className="font-serif font-semibold text-lg text-[#3d2a1a]">1–2 business days</p>
            </div>
            <div className="bg-white p-6 hover:bg-[#FBF9F2]/20 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Truck className="w-4 h-4 text-[#B8860B]" />
                <p className="font-mono text-xs uppercase tracking-wider text-[#6b5940]">Standard delivery</p>
              </div>
              <p className="font-serif font-semibold text-lg text-[#3d2a1a]">3–7 business days</p>
            </div>
            <div className="bg-white p-6 hover:bg-[#FBF9F2]/20 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-4 h-4 text-[#B8860B]" />
                <p className="font-mono text-xs uppercase tracking-wider text-[#6b5940]">Free shipping over</p>
              </div>
              <p className="font-serif font-semibold text-lg text-[#3d2a1a]">₹499</p>
            </div>
            <div className="bg-white p-6 hover:bg-[#FBF9F2]/20 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-[#B8860B]" />
                <p className="font-mono text-xs uppercase tracking-wider text-[#6b5940]">International shipping</p>
              </div>
              <p className="font-serif font-semibold text-lg text-[#3d2a1a]">Available, 50+ countries</p>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Rate Table */}
      <div className="px-6 md:px-8 pt-12 max-w-7xl mx-auto">
        <div className="bg-white border border-[#3d2a1a]/10 rounded-3xl shadow-sm overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#3d2a1a]">
                <th className="font-mono uppercase text-xs tracking-wider text-left text-white py-4 px-6 font-medium">
                  Method
                </th>
                <th className="font-mono uppercase text-xs tracking-wider text-left text-white py-4 px-6 font-medium">
                  Estimated transit
                </th>
                <th className="font-mono uppercase text-xs tracking-wider text-left text-white py-4 px-6 font-medium">
                  Cost
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-[#FBF9F2]/20 transition-colors">
                <td className="py-4 px-6 border-t border-[#3d2a1a]/10">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#B8860B]" />
                    <span className="font-serif font-medium text-[#3d2a1a]">Standard</span>
                  </div>
                </td>
                <td className="py-4 px-6 border-t border-[#3d2a1a]/10 text-sm text-[#6b5940]">
                  3–7 business days
                </td>
                <td className="py-4 px-6 border-t border-[#3d2a1a]/10">
                  <span className="font-mono text-[#B8860B] font-semibold text-sm">
                    ₹40 · Free over ₹499
                  </span>
                </td>
              </tr>
              <tr className="bg-[#FBF9F2]/10 hover:bg-[#FBF9F2]/20 transition-colors">
                <td className="py-4 px-6 border-t border-[#3d2a1a]/10">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#B8860B]" />
                    <span className="font-serif font-medium text-[#3d2a1a]">Express</span>
                  </div>
                </td>
                <td className="py-4 px-6 border-t border-[#3d2a1a]/10 text-sm text-[#6b5940]">
                  2–3 business days
                </td>
                <td className="py-4 px-6 border-t border-[#3d2a1a]/10">
                  <span className="font-mono text-[#B8860B] font-semibold text-sm">₹99</span>
                </td>
              </tr>
              <tr className="hover:bg-[#FBF9F2]/20 transition-colors">
                <td className="py-4 px-6 border-t border-[#3d2a1a]/10">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#B8860B]" />
                    <span className="font-serif font-medium text-[#3d2a1a]">Next-day</span>
                  </div>
                </td>
                <td className="py-4 px-6 border-t border-[#3d2a1a]/10 text-sm text-[#6b5940]">
                  1 business day
                </td>
                <td className="py-4 px-6 border-t border-[#3d2a1a]/10">
                  <span className="font-mono text-[#B8860B] font-semibold text-sm">₹199</span>
                </td>
              </tr>
              <tr className="bg-[#FBF9F2]/10 hover:bg-[#FBF9F2]/20 transition-colors">
                <td className="py-4 px-6 border-t border-[#3d2a1a]/10">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#B8860B]" />
                    <span className="font-serif font-medium text-[#3d2a1a]">International</span>
                  </div>
                </td>
                <td className="py-4 px-6 border-t border-[#3d2a1a]/10 text-sm text-[#6b5940]">
                  7–21 business days, varies by destination
                </td>
                <td className="py-4 px-6 border-t border-[#3d2a1a]/10">
                  <span className="font-mono text-[#B8860B] font-semibold text-sm">
                    Calculated at checkout
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="px-6 md:px-8 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
          
          {/* Table of Contents */}
          <nav className="lg:sticky lg:top-24 self-start bg-white rounded-3xl border border-[#3d2a1a]/10 p-6 shadow-sm" aria-label="Table of contents">
            <p className="font-mono text-xs uppercase tracking-wider text-[#B8860B] mb-4 font-semibold">
              On this page
            </p>
            <ol className="list-none space-y-1">
              {[
                { id: 'processing', num: '01', label: 'Order processing time' },
                { id: 'methods', num: '02', label: 'Shipping methods & rates' },
                { id: 'domestic', num: '03', label: 'Domestic shipping' },
                { id: 'international', num: '04', label: 'International shipping' },
                { id: 'tracking', num: '05', label: 'Order tracking' },
                { id: 'delays', num: '06', label: 'Delays' },
                { id: 'lost', num: '07', label: 'Lost or damaged packages' },
                { id: 'address', num: '08', label: 'Address accuracy' },
                { id: 'contact', num: '09', label: 'Contact us' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="flex gap-2.5 text-[#6b5940] text-sm py-2 px-2.5 rounded-xl hover:bg-[#FBF9F2] hover:text-[#3d2a1a] transition-all w-full text-left font-medium group"
                  >
                    <span className="font-mono text-[#B8860B] text-sm group-hover:scale-105 transition-transform">{item.num}</span>
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          {/* Content Sections */}
          <main className="space-y-8">
            
            {/* Section 01 */}
            <section id="processing" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">01</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Order processing time
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed">
                All orders are processed within <strong className="text-[#3d2a1a] font-semibold">1–2 business days</strong> after 
                payment is confirmed. Orders placed on weekends or public holidays are processed the next business day. 
                During sale periods or high-demand launches, processing may take slightly longer — we'll always flag 
                this at checkout if it applies.
              </p>
            </section>

            {/* Section 02 */}
            <section id="methods" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">02</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Shipping methods & rates
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed">
                We offer several shipping speeds so you can choose what fits your timeline, shown in the table above. 
                Exact rates and delivery estimates are calculated at checkout based on your location and cart weight.
              </p>
            </section>

            {/* Section 03 */}
            <section id="domestic" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">03</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Domestic shipping
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed">
                Domestic orders ship via our trusted courier partners and typically arrive within 3–7 business days 
                for standard shipping. Remote or rural areas may take a little longer.
              </p>
            </section>

            {/* Section 04 */}
            <section id="international" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">04</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  International shipping
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed mb-4">
                We currently ship to over 50 countries. International delivery times range from 7–21 business days 
                depending on destination and customs processing.
              </p>
              <div className="bg-[#FBF9F2] border-l-4 border-[#B8860B] p-4 rounded-xl text-sm flex items-start gap-3 text-[#6b5940]">
                <AlertCircle className="w-5 h-5 text-[#B8860B] flex-shrink-0 mt-0.5" />
                <span>
                  Import duties, taxes, and customs fees are set by your destination country and are the customer's 
                  responsibility. These are not included in our shipping charges.
                </span>
              </div>
            </section>

            {/* Section 05 */}
            <section id="tracking" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">05</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Order tracking
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed">
                Once your order ships, you'll receive a confirmation email with a tracking number and link. Please 
                allow 24–48 hours for tracking information to update after your order leaves our warehouse.
              </p>
            </section>

            {/* Section 06 */}
            <section id="delays" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">06</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Delays
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed">
                Occasionally, factors outside our control — weather, customs processing, courier disruptions — can 
                delay a delivery beyond the original estimate. We'll do our best to keep you informed if we're aware 
                of a delay affecting your order.
              </p>
            </section>

            {/* Section 07 */}
            <section id="lost" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">07</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Lost or damaged packages
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed">
                If your order arrives damaged or doesn't arrive at all within the expected window, contact us within 
                14 days of the estimated delivery date. We'll work with the courier to locate it, and arrange a 
                replacement or refund where appropriate.
              </p>
            </section>

            {/* Section 08 */}
            <section id="address" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">08</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Address accuracy
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed">
                Please double-check your shipping address at checkout. We're not able to reroute a package once it 
                has shipped, and we can't be held responsible for orders delivered to an incorrectly entered address. 
                If you notice an error shortly after ordering, contact us right away — we'll do our best to update it 
                before the order ships.
              </p>
            </section>

            {/* Section 09 */}
            <section id="contact" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">09</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Contact us
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed">
                Questions about a shipment? Reach us at{' '}
                <a href="mailto:support@houseoftoshali.com" className="text-[#B8860B] underline hover:no-underline font-medium">
                  support@houseoftoshali.com
                </a>
                {' '}or through our{' '}
                <Link to="/contact" className="text-[#B8860B] underline hover:no-underline font-medium">
                  contact page
                </Link>
                , with your order number handy.
              </p>
            </section>

            {/* Need Help? Footer Box */}
            <div className="p-6 bg-gradient-to-br from-[#FBF9F2] to-white rounded-3xl border border-[#3d2a1a]/10 mt-12">
              <h3 className="font-serif text-xl text-[#3d2a1a] mb-4">Need Help?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#3d2a1a]/5 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-[#B8860B]/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#B8860B]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#6b5940] uppercase tracking-wider font-mono">Email</p>
                    <p className="text-xs font-semibold text-[#3d2a1a] break-all">support@houseoftoshali.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#3d2a1a]/5 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-[#B8860B]/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#B8860B]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#6b5940] uppercase tracking-wider font-mono">Phone</p>
                    <p className="text-xs font-semibold text-[#3d2a1a]">+91 XXXXXXXXXX</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#3d2a1a]/5 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-[#B8860B]/10 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-[#B8860B]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#6b5940] uppercase tracking-wider font-mono">Live Chat</p>
                    <p className="text-xs font-semibold text-[#3d2a1a]">Available 10 AM - 6 PM</p>
                  </div>
                </div>
              </div>
            </div>

          </main>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-[#B8860B] text-white rounded-full shadow-lg hover:bg-[#9A7209] transition-all duration-300 flex items-center justify-center hover:scale-110 group z-50 border border-white/20"
      >
        <ArrowLeft className="w-5 h-5 rotate-90 group-hover:-translate-y-1 transition-transform" />
      </button>
    </div>
  )
}

export default ShippingPolicy