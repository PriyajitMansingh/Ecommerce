import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Truck, Clock, Globe, Package, AlertCircle } from 'lucide-react'

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

  return (
    <div className="bg-white min-h-screen">
    
      {/* Hero Section */}
      <header className="px-6 md:px-8 py-16 md:py-20 max-w-7xl mx-auto">
        <p className="font-mono text-sm uppercase tracking-widest text-[#21665A] mb-4">
          Legal · Policy 02 of 03
        </p>
        <h1 className="font-serif font-medium text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight mb-4 text-[#161B22]">
          Shipping Policy
        </h1>
        <p className="text-lg text-[#5B6570] max-w-2xl mb-2">
          Here's how, when, and where we get your order to you — including timelines, 
          rates, and what happens if something goes wrong along the way.
        </p>
        <p className="font-mono text-sm text-[#5B6570] mt-4">
          Last updated: August 7, 2026
        </p>
      </header>

      {/* At-a-Glance Section */}
      <div className="px-6 md:px-8 pb-10 max-w-7xl mx-auto">
        <div className="bg-[#F8FAF7] border border-[#E1E4E1] rounded-[2rem] shadow-sm overflow-hidden">
          <div className="px-6 py-6 sm:px-8 sm:py-8 border-b border-[#E1E4E1]">
            <p className="font-mono text-xs uppercase tracking-widest text-[#21665A] mb-3">Shipping snapshot</p>
            <h2 className="font-serif text-2xl text-[#161B22] font-semibold">Quick shipping overview</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#E1E4E1]">
            <div className="bg-white p-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-[#21665A]" />
                <p className="font-mono text-xs uppercase tracking-wider text-[#5B6570]">Order processing</p>
              </div>
              <p className="font-serif font-semibold text-xl text-[#161B22]">1–2 business days</p>
            </div>
            <div className="bg-white p-6">
              <div className="flex items-center gap-2 mb-3">
                <Truck className="w-4 h-4 text-[#21665A]" />
                <p className="font-mono text-xs uppercase tracking-wider text-[#5B6570]">Standard delivery</p>
              </div>
              <p className="font-serif font-semibold text-xl text-[#161B22]">3–7 business days</p>
            </div>
            <div className="bg-white p-6">
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-4 h-4 text-[#21665A]" />
                <p className="font-mono text-xs uppercase tracking-wider text-[#5B6570]">Free shipping over</p>
              </div>
              <p className="font-serif font-semibold text-xl text-[#161B22]">₹499</p>
            </div>
            <div className="bg-white p-6">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-[#21665A]" />
                <p className="font-mono text-xs uppercase tracking-wider text-[#5B6570]">International shipping</p>
              </div>
              <p className="font-serif font-semibold text-xl text-[#161B22]">Available, 50+ countries</p>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Rate Table */}
      <div className="px-6 md:px-8 pb-16 max-w-7xl mx-auto">
        <div className="border border-[#E1E4E1] rounded overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#161B22]">
                <th className="font-mono uppercase text-xs tracking-wider text-left text-white py-3.5 px-4 md:px-5 font-medium">
                  Method
                </th>
                <th className="font-mono uppercase text-xs tracking-wider text-left text-white py-3.5 px-4 md:px-5 font-medium">
                  Estimated transit
                </th>
                <th className="font-mono uppercase text-xs tracking-wider text-left text-white py-3.5 px-4 md:px-5 font-medium">
                  Cost
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="even:bg-[#F0F2F0]">
                <td className="py-4 px-4 md:px-5 border-t border-[#E1E4E1]">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#21665A]" />
                    <span className="font-serif font-medium text-[#161B22]">Standard</span>
                  </div>
                </td>
                <td className="py-4 px-4 md:px-5 border-t border-[#E1E4E1] text-sm text-[#333a42]">
                  3–7 business days
                </td>
                <td className="py-4 px-4 md:px-5 border-t border-[#E1E4E1]">
                  <span className="font-mono text-[#21665A] font-medium text-sm">
                    ₹40 · Free over ₹499
                  </span>
                </td>
              </tr>
              <tr className="even:bg-[#F0F2F0]">
                <td className="py-4 px-4 md:px-5 border-t border-[#E1E4E1]">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#21665A]" />
                    <span className="font-serif font-medium text-[#161B22]">Express</span>
                  </div>
                </td>
                <td className="py-4 px-4 md:px-5 border-t border-[#E1E4E1] text-sm text-[#333a42]">
                  2–3 business days
                </td>
                <td className="py-4 px-4 md:px-5 border-t border-[#E1E4E1]">
                  <span className="font-mono text-[#21665A] font-medium text-sm">₹99</span>
                </td>
              </tr>
              <tr className="even:bg-[#F0F2F0]">
                <td className="py-4 px-4 md:px-5 border-t border-[#E1E4E1]">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#21665A]" />
                    <span className="font-serif font-medium text-[#161B22]">Next-day</span>
                  </div>
                </td>
                <td className="py-4 px-4 md:px-5 border-t border-[#E1E4E1] text-sm text-[#333a42]">
                  1 business day
                </td>
                <td className="py-4 px-4 md:px-5 border-t border-[#E1E4E1]">
                  <span className="font-mono text-[#21665A] font-medium text-sm">₹199</span>
                </td>
              </tr>
              <tr className="even:bg-[#F0F2F0]">
                <td className="py-4 px-4 md:px-5 border-t border-[#E1E4E1]">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#21665A]" />
                    <span className="font-serif font-medium text-[#161B22]">International</span>
                  </div>
                </td>
                <td className="py-4 px-4 md:px-5 border-t border-[#E1E4E1] text-sm text-[#333a42]">
                  7–21 business days, varies by destination
                </td>
                <td className="py-4 px-4 md:px-5 border-t border-[#E1E4E1]">
                  <span className="font-mono text-[#21665A] font-medium text-sm">
                    Calculated at checkout
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="px-6 md:px-8 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-16">
          
          {/* Table of Contents */}
          <nav className="lg:sticky lg:top-7 self-start bg-[#F8FAF7] rounded-3xl border border-[#E1E4E1] p-6 shadow-sm" aria-label="Table of contents">
            <p className="font-mono text-xs uppercase tracking-wider text-[#21665A] mb-4">
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
                    className="flex gap-2.5 text-[#5B6570] text-sm py-1.5 px-2 rounded hover:bg-[#F0F2F0] hover:text-[#161B22] transition-all w-full text-left"
                  >
                    <span className="font-mono text-[#21665A] text-sm">{item.num}</span>
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          {/* Content Sections */}
          <main className="space-y-8">
            
            {/* Section 01 */}
            <section id="processing" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">01</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  Order processing time
                </h2>
              </div>
              <p className="text-[#333a42]">
                All orders are processed within <strong className="text-[#161B22]">1–2 business days</strong> after 
                payment is confirmed. Orders placed on weekends or public holidays are processed the next business day. 
                During sale periods or high-demand launches, processing may take slightly longer — we'll always flag 
                this at checkout if it applies.
              </p>
            </section>

            {/* Section 02 */}
            <section id="methods" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">02</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  Shipping methods & rates
                </h2>
              </div>
              <p className="text-[#333a42]">
                We offer several shipping speeds so you can choose what fits your timeline, shown in the table above. 
                Exact rates and delivery estimates are calculated at checkout based on your location and cart weight.
              </p>
            </section>

            {/* Section 03 */}
            <section id="domestic" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">03</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  Domestic shipping
                </h2>
              </div>
              <p className="text-[#333a42]">
                Domestic orders ship via our trusted courier partners and typically arrive within 3–7 business days 
                for standard shipping. Remote or rural areas may take a little longer.
              </p>
            </section>

            {/* Section 04 */}
            <section id="international" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">04</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  International shipping
                </h2>
              </div>
              <p className="text-[#333a42] mb-4">
                We currently ship to over 50 countries. International delivery times range from 7–21 business days 
                depending on destination and customs processing.
              </p>
              <div className="bg-[#DCEAE6] border-l-4 border-[#21665A] p-4 rounded-sm text-sm mt-5 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#21665A] flex-shrink-0 mt-0.5" />
                <span>
                  Import duties, taxes, and customs fees are set by your destination country and are the customer's 
                  responsibility. These are not included in our shipping charges.
                </span>
              </div>
            </section>

            {/* Section 05 */}
            <section id="tracking" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">05</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  Order tracking
                </h2>
              </div>
              <p className="text-[#333a42]">
                Once your order ships, you'll receive a confirmation email with a tracking number and link. Please 
                allow 24–48 hours for tracking information to update after your order leaves our warehouse.
              </p>
            </section>

            {/* Section 06 */}
            <section id="delays" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">06</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  Delays
                </h2>
              </div>
              <p className="text-[#333a42]">
                Occasionally, factors outside our control — weather, customs processing, courier disruptions — can 
                delay a delivery beyond the original estimate. We'll do our best to keep you informed if we're aware 
                of a delay affecting your order.
              </p>
            </section>

            {/* Section 07 */}
            <section id="lost" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">07</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  Lost or damaged packages
                </h2>
              </div>
              <p className="text-[#333a42]">
                If your order arrives damaged or doesn't arrive at all within the expected window, contact us within 
                14 days of the estimated delivery date. We'll work with the courier to locate it, and arrange a 
                replacement or refund where appropriate.
              </p>
            </section>

            {/* Section 08 */}
            <section id="address" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">08</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  Address accuracy
                </h2>
              </div>
              <p className="text-[#333a42]">
                Please double-check your shipping address at checkout. We're not able to reroute a package once it 
                has shipped, and we can't be held responsible for orders delivered to an incorrectly entered address. 
                If you notice an error shortly after ordering, contact us right away — we'll do our best to update it 
                before the order ships.
              </p>
            </section>

            {/* Section 09 */}
            <section id="contact" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">09</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  Contact us
                </h2>
              </div>
              <p className="text-[#333a42]">
                Questions about a shipment? Reach us at{' '}
                <a href="mailto:support@houseoftoshali.com" className="text-[#21665A] underline hover:no-underline">
                  support@houseoftoshali.com
                </a>
                {' '}or through our{' '}
                <Link to="/contact" className="text-[#21665A] underline hover:no-underline">
                  contact page
                </Link>
                , with your order number handy.
              </p>
            </section>

          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#E1E4E1] py-8 text-center text-sm text-[#5B6570]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <p>&copy; {new Date().getFullYear()} House of Toshali. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default ShippingPolicy