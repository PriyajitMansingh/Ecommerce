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
  Mail,
  Phone,
  MessageCircle
} from 'lucide-react'
import Navbar from '../../components/layout/Navbar'

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
            <span className="text-white/90 font-medium">Return & Refund Policy</span>
          </nav>

          <p className="font-mono text-xs uppercase tracking-widest text-[#B8860B] mb-3">
            Legal · Policy 03 of 03
          </p>
          <h1 className="font-serif font-medium text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight mb-4 text-white">
            Return & Refund Policy
          </h1>
          <p className="text-lg text-[#FBF9F2]/80 max-w-2xl mb-4 font-light">
            Not the right fit? Here's how returns, exchanges, and refunds work — start to finish.
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
            <p className="font-mono text-xs uppercase tracking-widest text-[#B8860B] mb-2">Quick overview</p>
            <h2 className="font-serif text-2xl text-[#3d2a1a] font-semibold">Fast facts about returns & refunds</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#3d2a1a]/5">
            <div className="bg-white p-6 hover:bg-[#FBF9F2]/20 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-[#B8860B]" />
                <p className="font-mono text-xs uppercase tracking-wider text-[#6b5940]">Return window</p>
              </div>
              <p className="font-serif font-semibold text-lg text-[#3d2a1a]">30 days</p>
            </div>
            <div className="bg-white p-6 hover:bg-[#FBF9F2]/20 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-[#B8860B]" />
                <p className="font-mono text-xs uppercase tracking-wider text-[#6b5940]">Refund method</p>
              </div>
              <p className="font-serif font-semibold text-lg text-[#3d2a1a]">Original payment</p>
            </div>
            <div className="bg-white p-6 hover:bg-[#FBF9F2]/20 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <RotateCcw className="w-4 h-4 text-[#B8860B]" />
                <p className="font-mono text-xs uppercase tracking-wider text-[#6b5940]">Refund processing</p>
              </div>
              <p className="font-serif font-semibold text-lg text-[#3d2a1a]">5–10 business days</p>
            </div>
            <div className="bg-white p-6 hover:bg-[#FBF9F2]/20 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Truck className="w-4 h-4 text-[#B8860B]" />
                <p className="font-mono text-xs uppercase tracking-wider text-[#6b5940]">Return shipping</p>
              </div>
              <p className="font-serif font-semibold text-lg text-[#3d2a1a]">Free for defective items</p>
            </div>
          </div>
        </div>
      </div>

      {/* Return Journey Steps */}
      <div className="px-6 md:px-8 pt-12 max-w-7xl mx-auto">
        <div className="bg-white border border-[#3d2a1a]/10 rounded-3xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#3d2a1a]/10">
            {/* Step 1 */}
            <div className="p-6 relative group hover:bg-[#FBF9F2]/10 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#B8860B] text-white flex items-center justify-center font-mono text-sm font-semibold">
                  1
                </div>
                <h3 className="font-serif font-semibold text-lg text-[#3d2a1a]">Request</h3>
              </div>
              <p className="text-sm text-[#6b5940] leading-relaxed">
                Contact us or use your account within 30 days of delivery
              </p>
              <ArrowRight className="w-4 h-4 text-[#B8860B] hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10" />
            </div>

            {/* Step 2 */}
            <div className="p-6 relative group hover:bg-[#FBF9F2]/10 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#B8860B] text-white flex items-center justify-center font-mono text-sm font-semibold">
                  2
                </div>
                <h3 className="font-serif font-semibold text-lg text-[#3d2a1a]">Ship it back</h3>
              </div>
              <p className="text-sm text-[#6b5940] leading-relaxed">
                Pack the item and send it using the provided label
              </p>
              <ArrowRight className="w-4 h-4 text-[#B8860B] hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10" />
            </div>

            {/* Step 3 */}
            <div className="p-6 relative group hover:bg-[#FBF9F2]/10 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#B8860B] text-white flex items-center justify-center font-mono text-sm font-semibold">
                  3
                </div>
                <h3 className="font-serif font-semibold text-lg text-[#3d2a1a]">Inspection</h3>
              </div>
              <p className="text-sm text-[#6b5940] leading-relaxed">
                We check the item once it arrives at our warehouse
              </p>
              <ArrowRight className="w-4 h-4 text-[#B8860B] hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10" />
            </div>

            {/* Step 4 */}
            <div className="p-6 hover:bg-[#FBF9F2]/10 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#B8860B] text-white flex items-center justify-center font-mono text-sm font-semibold">
                  4
                </div>
                <h3 className="font-serif font-semibold text-lg text-[#3d2a1a]">Refund issued</h3>
              </div>
              <p className="text-sm text-[#6b5940] leading-relaxed">
                Money back to your original payment method
              </p>
            </div>
          </div>
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
            <section id="window" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">01</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Return window
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed">
                You have <strong className="text-[#3d2a1a] font-semibold">30 days</strong> from the date of delivery to request 
                a return. Items returned after this window can't be accepted, except where required by local law.
              </p>
            </section>

            {/* Section 02 */}
            <section id="eligibility" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">02</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Eligibility
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed mb-4">To be eligible for a return, items must be:</p>
              <ul className="list-none pl-1 text-[#6b5940] space-y-2.5">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Unused, unworn, and in the condition you received them</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>In the original packaging, with tags attached where applicable</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Accompanied by proof of purchase (order number or receipt)</span>
                </li>
              </ul>
            </section>

            {/* Section 03 */}
            <section id="nonreturnable" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">03</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Non-returnable items
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed mb-4">
                Some items can't be returned for hygiene or safety reasons, including:
              </p>
              <ul className="list-none pl-1 text-[#6b5940] space-y-2.5">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Gift cards</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Personal care and intimate items once opened</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Final sale or clearance items, marked as such at checkout</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Custom or made-to-order products</span>
                </li>
              </ul>
            </section>

            {/* Section 04 */}
            <section id="howto" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">04</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  How to start a return
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed mb-4">To start a return:</p>
              <ul className="list-none pl-1 text-[#6b5940] space-y-2.5 mb-5">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Log into your account and select the order, or email us your order number</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Tell us which item(s) you're returning and why</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>We'll email you a return authorization and shipping label (where applicable)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Pack the item securely and drop it off at the specified carrier</span>
                </li>
              </ul>
              <div className="bg-[#FBF9F2] border-l-4 border-[#B8860B] p-4 rounded-xl text-sm flex items-start gap-3 text-[#6b5940]">
                <AlertCircle className="w-5 h-5 text-[#B8860B] flex-shrink-0 mt-0.5" />
                <span>
                  Please don't send returns back to the address on your package without first requesting a return — 
                  unrequested returns may be delayed.
                </span>
              </div>
            </section>

            {/* Section 05 */}
            <section id="shipping-cost" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">05</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Return shipping costs
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed">
                If the return is due to our error — a defective, damaged, or incorrect item — we cover return shipping. 
                For change-of-mind returns, a return shipping fee will be deducted from your refund, or you're welcome 
                to arrange your own shipping.
              </p>
            </section>

            {/* Section 06 */}
            <section id="refunds" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">06</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Refunds
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed">
                Once we receive and inspect your return, we'll notify you by email. If approved, your refund is 
                processed to your original payment method within <strong className="text-[#3d2a1a] font-semibold">5–10 business days</strong>. 
                Depending on your bank, it may take a few extra days for the refund to appear on your statement.
              </p>
            </section>

            {/* Section 07 */}
            <section id="exchanges" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">07</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Exchanges
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed">
                Want a different size or color? The fastest way is to return your original item for a refund and 
                place a new order. This ensures you get the item you want without waiting on inventory checks.
              </p>
            </section>

            {/* Section 08 */}
            <section id="damaged" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">08</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Damaged or defective items
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed">
                If your item arrives damaged or defective, contact us within 7 days of delivery with photos of the 
                issue. We'll arrange a free replacement or full refund — your choice.
              </p>
            </section>

            {/* Section 09 */}
            <section id="late" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">09</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Late or missing refunds
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed">
                If it's been longer than 10 business days since your return was approved and you haven't seen a 
                refund, first check with your bank or card provider, as processing times vary. If it still hasn't 
                appeared, contact us and we'll look into it.
              </p>
            </section>

            {/* Section 10 */}
            <section id="contact" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">10</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Contact us
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed">
                Questions about a return or refund? Reach us at{' '}
                <a href="mailto:returns@houseoftoshali.com" className="text-[#B8860B] underline hover:no-underline font-medium">
                  returns@houseoftoshali.com
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

export default ReturnRefundPolicy