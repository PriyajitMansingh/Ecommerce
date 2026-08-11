import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  RotateCcw, 
  Clock, 
  CreditCard, 
  Truck, 
  Package, 
  Shield, 
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Mail
} from 'lucide-react'

const ReturnRefundPolicy = () => {
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
          Legal · Policy 03 of 03
        </p>
        <h1 className="font-serif font-medium text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight mb-4 text-[#161B22]">
          Return & Refund Policy
        </h1>
        <p className="text-lg text-[#5B6570] max-w-2xl mb-2">
          Not the right fit? Here's how returns, exchanges, and refunds work — start to finish.
        </p>
        <p className="font-mono text-sm text-[#5B6570] mt-4">
          Last updated: August 7, 2026
        </p>
      </header>

      {/* At-a-Glance Section */}
      <div className="px-6 md:px-8 pb-10 max-w-7xl mx-auto">
        <div className="bg-[#F8FAF7] border border-[#E1E4E1] rounded-[2rem] shadow-sm overflow-hidden">
          <div className="px-6 py-6 sm:px-8 sm:py-8 border-b border-[#E1E4E1]">
            <p className="font-mono text-xs uppercase tracking-widest text-[#21665A] mb-3">Quick overview</p>
            <h2 className="font-serif text-2xl text-[#161B22] font-semibold">Fast facts about returns & refunds</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#E1E4E1]">
            <div className="bg-white p-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-[#21665A]" />
                <p className="font-mono text-xs uppercase tracking-wider text-[#5B6570]">Return window</p>
              </div>
              <p className="font-serif font-semibold text-xl text-[#161B22]">30 days</p>
            </div>
            <div className="bg-white p-6">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-[#21665A]" />
                <p className="font-mono text-xs uppercase tracking-wider text-[#5B6570]">Refund method</p>
              </div>
              <p className="font-serif font-semibold text-xl text-[#161B22]">Original payment</p>
            </div>
            <div className="bg-white p-6">
              <div className="flex items-center gap-2 mb-3">
                <RotateCcw className="w-4 h-4 text-[#21665A]" />
                <p className="font-mono text-xs uppercase tracking-wider text-[#5B6570]">Refund processing</p>
              </div>
              <p className="font-serif font-semibold text-xl text-[#161B22]">5–10 business days</p>
            </div>
            <div className="bg-white p-6">
              <div className="flex items-center gap-2 mb-3">
                <Truck className="w-4 h-4 text-[#21665A]" />
                <p className="font-mono text-xs uppercase tracking-wider text-[#5B6570]">Return shipping</p>
              </div>
              <p className="font-serif font-semibold text-xl text-[#161B22]">Free for defective items</p>
            </div>
          </div>
        </div>
      </div>

      {/* Return Journey Steps */}
      <div className="px-6 md:px-8 pb-16 max-w-7xl mx-auto">
        <div className="border border-[#E1E4E1] rounded overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="p-6 border-b sm:border-b lg:border-b-0 lg:border-r border-[#E1E4E1] relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#21665A] text-white flex items-center justify-center font-mono text-sm font-medium">
                  1
                </div>
                <ArrowRight className="w-4 h-4 text-[#21665A] hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2" />
              </div>
              <h3 className="font-serif font-medium text-lg text-[#161B22] mb-2">Request</h3>
              <p className="text-sm text-[#5B6570]">
                Contact us or use your account within 30 days of delivery
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 border-b sm:border-b lg:border-b-0 lg:border-r border-[#E1E4E1] relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#21665A] text-white flex items-center justify-center font-mono text-sm font-medium">
                  2
                </div>
                <ArrowRight className="w-4 h-4 text-[#21665A] hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2" />
              </div>
              <h3 className="font-serif font-medium text-lg text-[#161B22] mb-2">Ship it back</h3>
              <p className="text-sm text-[#5B6570]">
                Pack the item and send it using the provided label
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 border-b sm:border-b lg:border-b-0 lg:border-r border-[#E1E4E1] relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#21665A] text-white flex items-center justify-center font-mono text-sm font-medium">
                  3
                </div>
                <ArrowRight className="w-4 h-4 text-[#21665A] hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2" />
              </div>
              <h3 className="font-serif font-medium text-lg text-[#161B22] mb-2">Inspection</h3>
              <p className="text-sm text-[#5B6570]">
                We check the item once it arrives at our warehouse
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#21665A] text-white flex items-center justify-center font-mono text-sm font-medium">
                  4
                </div>
              </div>
              <h3 className="font-serif font-medium text-lg text-[#161B22] mb-2">Refund issued</h3>
              <p className="text-sm text-[#5B6570]">
                Money back to your original payment method
              </p>
            </div>
          </div>
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
                { id: 'window', num: '01', label: 'Return window' },
                { id: 'eligibility', num: '02', label: 'Eligibility' },
                { id: 'nonreturnable', num: '03', label: 'Non-returnable items' },
                { id: 'howto', num: '04', label: 'How to start a return' },
                { id: 'shipping-cost', num: '05', label: 'Return shipping costs' },
                { id: 'refunds', num: '06', label: 'Refunds' },
                { id: 'exchanges', num: '07', label: 'Exchanges' },
                { id: 'damaged', num: '08', label: 'Damaged or defective items' },
                { id: 'late', num: '09', label: 'Late or missing refunds' },
                { id: 'contact', num: '10', label: 'Contact us' },
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
            <section id="window" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">01</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  Return window
                </h2>
              </div>
              <p className="text-[#333a42]">
                You have <strong className="text-[#161B22]">30 days</strong> from the date of delivery to request 
                a return. Items returned after this window can't be accepted, except where required by local law.
              </p>
            </section>

            {/* Section 02 */}
            <section id="eligibility" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">02</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  Eligibility
                </h2>
              </div>
              <p className="text-[#333a42] mb-4">To be eligible for a return, items must be:</p>
              <ul className="list-disc pl-5 text-[#333a42] space-y-2">
                <li>Unused, unworn, and in the condition you received them</li>
                <li>In the original packaging, with tags attached where applicable</li>
                <li>Accompanied by proof of purchase (order number or receipt)</li>
              </ul>
            </section>

            {/* Section 03 */}
            <section id="nonreturnable" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">03</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  Non-returnable items
                </h2>
              </div>
              <p className="text-[#333a42] mb-4">
                Some items can't be returned for hygiene or safety reasons, including:
              </p>
              <ul className="list-disc pl-5 text-[#333a42] space-y-2">
                <li>Gift cards</li>
                <li>Personal care and intimate items once opened</li>
                <li>Final sale or clearance items, marked as such at checkout</li>
                <li>Custom or made-to-order products</li>
              </ul>
            </section>

            {/* Section 04 */}
            <section id="howto" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">04</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  How to start a return
                </h2>
              </div>
              <p className="text-[#333a42] mb-4">To start a return:</p>
              <ul className="list-disc pl-5 text-[#333a42] space-y-2 mb-5">
                <li>Log into your account and select the order, or email us your order number</li>
                <li>Tell us which item(s) you're returning and why</li>
                <li>We'll email you a return authorization and shipping label (where applicable)</li>
                <li>Pack the item securely and drop it off at the specified carrier</li>
              </ul>
              <div className="bg-[#DCEAE6] border-l-4 border-[#21665A] p-4 rounded-sm text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#21665A] flex-shrink-0 mt-0.5" />
                <span>
                  Please don't send returns back to the address on your package without first requesting a return — 
                  unrequested returns may be delayed.
                </span>
              </div>
            </section>

            {/* Section 05 */}
            <section id="shipping-cost" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">05</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  Return shipping costs
                </h2>
              </div>
              <p className="text-[#333a42]">
                If the return is due to our error — a defective, damaged, or incorrect item — we cover return shipping. 
                For change-of-mind returns, a return shipping fee will be deducted from your refund, or you're welcome 
                to arrange your own shipping.
              </p>
            </section>

            {/* Section 06 */}
            <section id="refunds" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">06</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  Refunds
                </h2>
              </div>
              <p className="text-[#333a42]">
                Once we receive and inspect your return, we'll notify you by email. If approved, your refund is 
                processed to your original payment method within <strong className="text-[#161B22]">5–10 business days</strong>. 
                Depending on your bank, it may take a few extra days for the refund to appear on your statement.
              </p>
            </section>

            {/* Section 07 */}
            <section id="exchanges" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">07</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  Exchanges
                </h2>
              </div>
              <p className="text-[#333a42]">
                Want a different size or color? The fastest way is to return your original item for a refund and 
                place a new order. This ensures you get the item you want without waiting on inventory checks.
              </p>
            </section>

            {/* Section 08 */}
            <section id="damaged" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">08</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  Damaged or defective items
                </h2>
              </div>
              <p className="text-[#333a42]">
                If your item arrives damaged or defective, contact us within 7 days of delivery with photos of the 
                issue. We'll arrange a free replacement or full refund — your choice.
              </p>
            </section>

            {/* Section 09 */}
            <section id="late" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">09</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  Late or missing refunds
                </h2>
              </div>
              <p className="text-[#333a42]">
                If it's been longer than 10 business days since your return was approved and you haven't seen a 
                refund, first check with your bank or card provider, as processing times vary. If it still hasn't 
                appeared, contact us and we'll look into it.
              </p>
            </section>

            {/* Section 10 */}
            <section id="contact" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">10</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  Contact us
                </h2>
              </div>
              <p className="text-[#333a42]">
                Questions about a return or refund? Reach us at{' '}
                <a href="mailto:returns@houseoftoshali.com" className="text-[#21665A] underline hover:no-underline">
                  returns@houseoftoshali.com
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

export default ReturnRefundPolicy