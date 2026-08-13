import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, Package, CreditCard, Truck, FileText, Mail, Phone, MessageCircle } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'

const TermsOfService = () => {
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
            <span className="text-white/90 font-medium">Terms of Service</span>
          </nav>

          <p className="font-mono text-xs uppercase tracking-widest text-[#B8860B] mb-3">
            Legal · General guidelines
          </p>
          <h1 className="font-serif font-medium text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight mb-4 text-white">
            Terms of Service
          </h1>
          <p className="text-lg text-[#FBF9F2]/80 max-w-2xl mb-4 font-light">
            Please read these terms carefully before using our services. Throughout this site, 
            the terms "we," "us," and "our" refer to House of Toshali.
          </p>
          <p className="font-mono text-xs text-[#B8860B] mt-4">
            Last updated: January 2024
          </p>
        </div>
      </div>

      {/* At-a-Glance Section */}
      <div className="px-6 md:px-8 -mt-8 relative z-10 max-w-7xl mx-auto">
        <div className="bg-white border border-[#3d2a1a]/10 rounded-3xl shadow-[0_8px_30px_rgba(61,42,26,0.08)] overflow-hidden">
          <div className="px-6 py-6 sm:px-8 sm:py-8 border-b border-[#3d2a1a]/5 bg-[#FBF9F2]/40">
            <p className="font-mono text-xs uppercase tracking-widest text-[#B8860B] mb-2">Legal snapshop</p>
            <h2 className="font-serif text-2xl text-[#3d2a1a] font-semibold">Guidelines at a glance</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#3d2a1a]/5">
            <div className="bg-white p-6 hover:bg-[#FBF9F2]/20 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-[#B8860B]" />
                <p className="font-mono text-xs uppercase tracking-wider text-[#6b5940]">Eligibility</p>
              </div>
              <p className="font-serif font-semibold text-lg text-[#3d2a1a]">18+ or Supervised</p>
            </div>
            <div className="bg-white p-6 hover:bg-[#FBF9F2]/20 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-[#B8860B]" />
                <p className="font-mono text-xs uppercase tracking-wider text-[#6b5940]">Payment Security</p>
              </div>
              <p className="font-serif font-semibold text-lg text-[#3d2a1a]">Full Encryption</p>
            </div>
            <div className="bg-white p-6 hover:bg-[#FBF9F2]/20 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-[#B8860B]" />
                <p className="font-mono text-xs uppercase tracking-wider text-[#6b5940]">Refuse Service</p>
              </div>
              <p className="font-serif font-semibold text-lg text-[#3d2a1a]">Rights Reserved</p>
            </div>
            <div className="bg-white p-6 hover:bg-[#FBF9F2]/20 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-4 h-4 text-[#B8860B]" />
                <p className="font-mono text-xs uppercase tracking-wider text-[#6b5940]">Contact response</p>
              </div>
              <p className="font-serif font-semibold text-lg text-[#3d2a1a]">Quick support</p>
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
                { id: 'eligibility', num: '01', label: 'Eligibility' },
                { id: 'conditions', num: '02', label: 'General Conditions' },
                { id: 'accuracy', num: '03', label: 'Accuracy of Information' },
                { id: 'pricing', num: '04', label: 'Product Pricing' },
                { id: 'orders', num: '05', label: 'Orders & Account' },
                { id: 'payments', num: '06', label: 'Payments' },
                { id: 'shipping', num: '07', label: 'Shipping & Delivery' },
                { id: 'returns', num: '08', label: 'Returns & Refunds' },
                { id: 'prohibited', num: '09', label: 'Prohibited Uses' },
                { id: 'property', num: '10', label: 'Intellectual Property' },
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
            <section id="eligibility" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">01</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Eligibility
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed mb-4">
                By using this site, you confirm that you are able to enter into legally binding contracts under 
                applicable Indian law. If you are a minor (under 18 years of age but at least 13), you may use 
                this site only under the supervision of a parent or legal guardian who agrees to be bound by these Terms.
              </p>
              <p className="text-[#6b5940] leading-relaxed">
                An account is required to place an order, so that you can view your order history and manage your 
                saved addresses.
              </p>
            </section>

            {/* Section 02 */}
            <section id="conditions" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">02</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  General Conditions
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed mb-4">We reserve the right to refuse service to anyone, for any reason, at any time.</p>
              <ul className="list-none pl-1 text-[#6b5940] space-y-2.5">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Content you submit to us (excluding payment information) may be transmitted over various networks and may be adapted to meet technical requirements. Payment information is always encrypted during transfer.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>You agree not to reproduce, duplicate, copy, sell, or exploit any portion of our service or your access to it without our prior written permission.</span>
                </li>
              </ul>
            </section>

            {/* Section 03 */}
            <section id="accuracy" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">03</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Accuracy of Information
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed">
                We aim to keep product descriptions, pricing, and availability accurate and current, but the site 
                may occasionally contain typographical errors or outdated information. We reserve the right to 
                correct such errors and to update information at any time without prior notice.
              </p>
            </section>

            {/* Section 04 */}
            <section id="pricing" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">04</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Product Pricing and Availability
                </h2>
              </div>
              <ul className="list-none pl-1 text-[#6b5940] space-y-2.5">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Prices for our products are subject to change without notice.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>We make every effort to display product images and descriptions accurately, but colors and packaging may appear slightly different on different screens.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>We reserve the right to limit the quantity of any product sold and to discontinue any product at any time.</span>
                </li>
              </ul>
            </section>

            {/* Section 05 */}
            <section id="orders" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">05</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Orders and Account Accuracy
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed mb-4">
                You agree to provide accurate, current, and complete information when creating your account and placing 
                an order — including your name, contact number, and delivery address — and to keep this information up to date.
              </p>
              <p className="text-[#6b5940] leading-relaxed">
                We reserve the right to refuse, limit, or cancel any order, including orders that appear to contain 
                pricing or listing errors, or orders we reasonably suspect involve fraudulent activity.
              </p>
            </section>

            {/* Section 06 */}
            <section id="payments" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">06</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Payments
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed mb-4">
                All payments are processed through our payment gateway partner. We do not store your full card, UPI, 
                or banking credentials on our servers — payment details are handled directly by our payment processor.
              </p>
              <p className="text-[#6b5940] leading-relaxed">
                You are responsible for ensuring that any payment method you use belongs to you and is used with proper authorization.
              </p>
            </section>

            {/* Section 07 */}
            <section id="shipping" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">07</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Shipping and Delivery
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed">
                Estimated delivery timelines are provided for convenience and are not guaranteed. Delays may occur 
                due to courier availability, weather, regional restrictions, or other circumstances outside our control.
              </p>
            </section>

            {/* Section 08 */}
            <section id="returns" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">08</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Returns and Refunds
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed">
                Please refer to our separate{' '}
                <Link to="/return-refund-policy" className="text-[#B8860B] font-semibold hover:underline inline-flex items-center gap-1">
                  Returns &amp; Refunds Policy
                  <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                </Link>{' '}
                for the current return window, eligibility conditions, and refund process.
              </p>
            </section>

            {/* Section 09 */}
            <section id="prohibited" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">09</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Prohibited Uses
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed mb-4">You may not use this site or its content:</p>
              <ul className="list-none pl-1 text-[#6b5940] space-y-2.5">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>for any unlawful purpose, or to solicit others to perform unlawful acts</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>to violate any applicable law or regulation</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>to infringe our intellectual property rights or those of others</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>to harass, abuse, or discriminate against any person</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>to submit false or misleading information</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>to upload viruses, malware, or any code intended to disrupt the site</span>
                </li>
              </ul>
            </section>

            {/* Section 10 */}
            <section id="property" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">10</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Intellectual Property
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed">
                All content on this website — including our logo, product photography, graphics, text, and design — 
                is the property of House of Toshali and is protected under applicable intellectual property law.
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

export default TermsOfService