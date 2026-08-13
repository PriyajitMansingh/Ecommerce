import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, Eye, Clock, CreditCard, Mail, Phone, MessageCircle } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'

const PrivacyPolicy = () => {
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
            <span className="text-white/90 font-medium">Privacy Policy</span>
          </nav>

          <p className="font-mono text-xs uppercase tracking-widest text-[#B8860B] mb-3">
            Legal · Policy 01 of 03
          </p>
          <h1 className="font-serif font-medium text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight mb-4 text-white">
            Privacy Policy
          </h1>
          <p className="text-lg text-[#FBF9F2]/80 max-w-2xl mb-4 font-light">
            This describes what information we collect when you shop with us, why we collect it, 
            and the choices you have over it.
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
            <p className="font-mono text-xs uppercase tracking-widest text-[#B8860B] mb-2">Quick summary</p>
            <h2 className="font-serif text-2xl text-[#3d2a1a] font-semibold">Privacy at a glance</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#3d2a1a]/5">
            <div className="bg-white p-6 hover:bg-[#FBF9F2]/20 transition-colors">
              <p className="font-mono text-xs uppercase tracking-wider text-[#6b5940] mb-2">Data sold to advertisers</p>
              <p className="font-serif font-semibold text-lg text-[#3d2a1a]">Never</p>
            </div>
            <div className="bg-white p-6 hover:bg-[#FBF9F2]/20 transition-colors">
              <p className="font-mono text-xs uppercase tracking-wider text-[#6b5940] mb-2">You can request deletion</p>
              <p className="font-serif font-semibold text-lg text-[#3d2a1a]">Anytime</p>
            </div>
            <div className="bg-white p-6 hover:bg-[#FBF9F2]/20 transition-colors">
              <p className="font-mono text-xs uppercase tracking-wider text-[#6b5940] mb-2">Request response time</p>
              <p className="font-serif font-semibold text-lg text-[#3d2a1a]">Within 30 days</p>
            </div>
            <div className="bg-white p-6 hover:bg-[#FBF9F2]/20 transition-colors">
              <p className="font-mono text-xs uppercase tracking-wider text-[#6b5940] mb-2">Payment data stored by us</p>
              <p className="font-serif font-semibold text-lg text-[#3d2a1a]">Not stored</p>
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
                { id: 'collect', num: '01', label: 'Information we collect' },
                { id: 'use', num: '02', label: 'How we use it' },
                { id: 'cookies', num: '03', label: 'Cookies & tracking' },
                { id: 'sharing', num: '04', label: 'Sharing with third parties' },
                { id: 'retention', num: '05', label: 'Data retention' },
                { id: 'rights', num: '06', label: 'Your rights & choices' },
                { id: 'security', num: '07', label: 'Security' },
                { id: 'children', num: '08', label: "Children's privacy" },
                { id: 'transfers', num: '09', label: 'International transfers' },
                { id: 'changes', num: '10', label: 'Changes to this policy' },
                { id: 'contact', num: '11', label: 'Contact us' },
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
            <section id="collect" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">01</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Information we collect
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed mb-4">
                We collect information you give us directly and information gathered automatically as you use our site.
              </p>
              <p className="text-[#3d2a1a] font-semibold mb-3 font-serif">Information you provide:</p>
              <ul className="list-none pl-1 text-[#6b5940] space-y-2.5 mb-6">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Name, email address, phone number, and shipping/billing address when you place an order or create an account</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Payment details, handled securely by our payment processor — we do not store full card numbers on our servers</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Messages you send to customer support, including order references and attachments</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Reviews, wishlist items, and marketing preferences you choose to share</span>
                </li>
              </ul>
              <p className="text-[#3d2a1a] font-semibold mb-3 font-serif">Information collected automatically:</p>
              <ul className="list-none pl-1 text-[#6b5940] space-y-2.5">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Device and browser type, IP address, and approximate location</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Pages viewed, products browsed, and time spent on the site</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Referring website or campaign that brought you to us</span>
                </li>
              </ul>
            </section>

            {/* Section 02 */}
            <section id="use" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">02</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  How we use it
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed mb-4">We use the information we collect to:</p>
              <ul className="list-none pl-1 text-[#6b5940] space-y-2.5">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Process and fulfil your orders, including payment, shipping, and customer service</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Send order confirmations, shipping updates, and respond to your enquiries</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Improve our products, site performance, and shopping experience</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Send marketing communications, only if you've opted in — you can unsubscribe at any time</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Detect and prevent fraud, abuse, and security incidents</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Comply with legal and tax obligations</span>
                </li>
              </ul>
            </section>

            {/* Section 03 */}
            <section id="cookies" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">03</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Cookies & tracking
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed mb-4">
                We use cookies and similar technologies to keep your cart working, remember your preferences, 
                and understand how our site is used.
              </p>
              <ul className="list-none pl-1 text-[#6b5940] space-y-2.5">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span><strong className="text-[#3d2a1a] font-serif">Essential cookies</strong> — required for checkout, login, and cart functionality</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span><strong className="text-[#3d2a1a] font-serif">Analytics cookies</strong> — help us understand site traffic and usage patterns</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span><strong className="text-[#3d2a1a] font-serif">Marketing cookies</strong> — used to show you relevant ads on other platforms, only with your consent</span>
                </li>
              </ul>
              <p className="text-[#6b5940] leading-relaxed mt-4">
                You can manage cookie preferences through your browser settings or our cookie banner at any time.
              </p>
            </section>

            {/* Section 04 */}
            <section id="sharing" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">04</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Sharing with third parties
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed mb-4">We share information only where necessary to run our business:</p>
              <ul className="list-none pl-1 text-[#6b5940] space-y-2.5">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span><strong className="text-[#3d2a1a] font-serif">Payment processors</strong> to securely handle transactions</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span><strong className="text-[#3d2a1a] font-serif">Shipping carriers</strong> to deliver your order and provide tracking</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span><strong className="text-[#3d2a1a] font-serif">Analytics and marketing providers</strong> who help us understand and improve the site</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span><strong className="text-[#3d2a1a] font-serif">Legal authorities</strong>, where required by law or to protect our rights</span>
                </li>
              </ul>
              <div className="bg-[#FBF9F2] border-l-4 border-[#B8860B] p-4 rounded-xl text-sm mt-5 text-[#6b5940]">
                We do not sell your personal information to third parties.
              </div>
            </section>

            {/* Section 05 */}
            <section id="retention" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">05</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Data retention
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed">
                We retain your information for as long as your account is active or as needed to provide you services, 
                comply with legal obligations, resolve disputes, and enforce our agreements. Order records are typically 
                kept for the period required by tax and accounting law.
              </p>
            </section>

            {/* Section 06 */}
            <section id="rights" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">06</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Your rights & choices
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed mb-4">Depending on where you live, you may have the right to:</p>
              <ul className="list-none pl-1 text-[#6b5940] space-y-2.5">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Access the personal information we hold about you</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Correct inaccurate or incomplete information</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Request deletion of your information</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Object to or restrict certain processing</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Request a portable copy of your data</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 flex-shrink-0" />
                  <span>Withdraw marketing consent at any time</span>
                </li>
              </ul>
              <p className="text-[#6b5940] leading-relaxed mt-4">
                To exercise any of these rights, contact us using the details below. We'll respond within 30 days.
              </p>
            </section>

            {/* Section 07 */}
            <section id="security" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">07</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Security
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed">
                We use industry-standard safeguards — including encryption in transit and restricted access controls — 
                to protect your information. No method of transmission or storage is 100% secure, but we work to protect 
                your data at every step.
              </p>
            </section>

            {/* Section 08 */}
            <section id="children" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">08</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Children's privacy
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed">
                Our site is not directed to children under 16, and we do not knowingly collect personal information 
                from them. If you believe a child has provided us information, please contact us so we can remove it.
              </p>
            </section>

            {/* Section 09 */}
            <section id="transfers" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">09</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  International transfers
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed">
                Your information may be processed in countries other than your own. Where this happens, we take steps 
                to ensure it receives an adequate level of protection consistent with this policy.
              </p>
            </section>

            {/* Section 10 */}
            <section id="changes" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">10</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Changes to this policy
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed">
                We may update this policy from time to time. Material changes will be reflected by an updated 
                "Last updated" date at the top of this page, and where appropriate, we'll notify you directly.
              </p>
            </section>

            {/* Section 11 */}
            <section id="contact" className="bg-white rounded-3xl border border-[#3d2a1a]/10 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3.5 mb-5 border-b border-[#3d2a1a]/5 pb-4">
                <span className="font-mono text-[#B8860B] text-lg font-semibold">11</span>
                <h2 className="font-serif font-medium text-2xl text-[#3d2a1a] tracking-tight">
                  Contact us
                </h2>
              </div>
              <p className="text-[#6b5940] leading-relaxed">
                Questions about this policy or your data? Reach us at{' '}
                <a href="mailto:privacy@houseoftoshali.com" className="text-[#B8860B] underline hover:no-underline font-medium">
                  privacy@houseoftoshali.com
                </a>
                {' '}or through our{' '}
                <Link to="/contact" className="text-[#B8860B] underline hover:no-underline font-medium">
                  contact page
                </Link>
                .
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

export default PrivacyPolicy