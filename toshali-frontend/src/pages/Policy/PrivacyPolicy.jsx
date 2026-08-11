import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, Eye, Clock, CreditCard, Mail } from 'lucide-react'

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

  return (
    <div className="bg-white min-h-screen">
   

      {/* Hero Section */}
      <header className="px-6 md:px-8 py-16 md:py-20 max-w-7xl mx-auto">
        <p className="font-mono text-sm uppercase tracking-widest text-[#21665A] mb-4">
          Legal · Policy 01 of 03
        </p>
        <h1 className="font-serif font-medium text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight mb-4 text-[#161B22]">
          Privacy Policy
        </h1>
        <p className="text-lg text-[#5B6570] max-w-2xl mb-2">
          This describes what information we collect when you shop with us, why we collect it, 
          and the choices you have over it.
        </p>
        <p className="font-mono text-sm text-[#5B6570] mt-4">
          Last updated: August 7, 2026
        </p>
      </header>

      {/* At-a-Glance Section */}
      <div className="px-6 md:px-8 pb-16 max-w-7xl mx-auto">
        <div className="bg-[#F8FAF7] border border-[#E1E4E1] rounded-[2rem] shadow-sm overflow-hidden">
          <div className="px-6 py-6 sm:px-8 sm:py-8 border-b border-[#E1E4E1]">
            <p className="font-mono text-xs uppercase tracking-widest text-[#21665A] mb-3">Quick summary</p>
            <h2 className="font-serif text-2xl text-[#161B22] font-semibold">Privacy at a glance</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#E1E4E1]">
            <div className="bg-white p-6">
              <p className="font-mono text-xs uppercase tracking-wider text-[#5B6570] mb-2">Data sold to advertisers</p>
              <p className="font-serif font-semibold text-lg text-[#161B22]">Never</p>
            </div>
            <div className="bg-white p-6">
              <p className="font-mono text-xs uppercase tracking-wider text-[#5B6570] mb-2">You can request deletion</p>
              <p className="font-serif font-semibold text-lg text-[#161B22]">Anytime</p>
            </div>
            <div className="bg-white p-6">
              <p className="font-mono text-xs uppercase tracking-wider text-[#5B6570] mb-2">Request response time</p>
              <p className="font-serif font-semibold text-lg text-[#161B22]">Within 30 days</p>
            </div>
            <div className="bg-white p-6">
              <p className="font-mono text-xs uppercase tracking-wider text-[#5B6570] mb-2">Payment data stored by us</p>
              <p className="font-serif font-semibold text-lg text-[#161B22]">Not stored</p>
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
            <section id="collect" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">01</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  Information we collect
                </h2>
              </div>
              <p className="text-[#333a42] mb-4">
                We collect information you give us directly and information gathered automatically as you use our site.
              </p>
              <p className="text-[#161B22] font-semibold mb-3">Information you provide:</p>
              <ul className="list-disc pl-5 text-[#333a42] space-y-2 mb-4">
                <li>Name, email address, phone number, and shipping/billing address when you place an order or create an account</li>
                <li>Payment details, handled securely by our payment processor — we do not store full card numbers on our servers</li>
                <li>Messages you send to customer support, including order references and attachments</li>
                <li>Reviews, wishlist items, and marketing preferences you choose to share</li>
              </ul>
              <p className="text-[#161B22] font-semibold mb-3">Information collected automatically:</p>
              <ul className="list-disc pl-5 text-[#333a42] space-y-2">
                <li>Device and browser type, IP address, and approximate location</li>
                <li>Pages viewed, products browsed, and time spent on the site</li>
                <li>Referring website or campaign that brought you to us</li>
              </ul>
            </section>

            {/* Section 02 */}
            <section id="use" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">02</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  How we use it
                </h2>
              </div>
              <p className="text-[#333a42] mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-5 text-[#333a42] space-y-2">
                <li>Process and fulfil your orders, including payment, shipping, and customer service</li>
                <li>Send order confirmations, shipping updates, and respond to your enquiries</li>
                <li>Improve our products, site performance, and shopping experience</li>
                <li>Send marketing communications, only if you've opted in — you can unsubscribe at any time</li>
                <li>Detect and prevent fraud, abuse, and security incidents</li>
                <li>Comply with legal and tax obligations</li>
              </ul>
            </section>

            {/* Section 03 */}
            <section id="cookies" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">03</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  Cookies & tracking
                </h2>
              </div>
              <p className="text-[#333a42] mb-4">
                We use cookies and similar technologies to keep your cart working, remember your preferences, 
                and understand how our site is used.
              </p>
              <ul className="list-disc pl-5 text-[#333a42] space-y-2">
                <li><strong className="text-[#161B22]">Essential cookies</strong> — required for checkout, login, and cart functionality</li>
                <li><strong className="text-[#161B22]">Analytics cookies</strong> — help us understand site traffic and usage patterns</li>
                <li><strong className="text-[#161B22]">Marketing cookies</strong> — used to show you relevant ads on other platforms, only with your consent</li>
              </ul>
              <p className="text-[#333a42] mt-4">
                You can manage cookie preferences through your browser settings or our cookie banner at any time.
              </p>
            </section>

            {/* Section 04 */}
            <section id="sharing" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">04</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  Sharing with third parties
                </h2>
              </div>
              <p className="text-[#333a42] mb-4">We share information only where necessary to run our business:</p>
              <ul className="list-disc pl-5 text-[#333a42] space-y-2">
                <li><strong className="text-[#161B22]">Payment processors</strong> to securely handle transactions</li>
                <li><strong className="text-[#161B22]">Shipping carriers</strong> to deliver your order and provide tracking</li>
                <li><strong className="text-[#161B22]">Analytics and marketing providers</strong> who help us understand and improve the site</li>
                <li><strong className="text-[#161B22]">Legal authorities</strong>, where required by law or to protect our rights</li>
              </ul>
              <div className="bg-[#DCEAE6] border-l-4 border-[#21665A] p-4 rounded-sm text-sm mt-5">
                We do not sell your personal information to third parties.
              </div>
            </section>

            {/* Section 05 */}
            <section id="retention" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">05</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  Data retention
                </h2>
              </div>
              <p className="text-[#333a42]">
                We retain your information for as long as your account is active or as needed to provide you services, 
                comply with legal obligations, resolve disputes, and enforce our agreements. Order records are typically 
                kept for the period required by tax and accounting law.
              </p>
            </section>

            {/* Section 06 */}
            <section id="rights" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">06</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  Your rights & choices
                </h2>
              </div>
              <p className="text-[#333a42] mb-4">Depending on where you live, you may have the right to:</p>
              <ul className="list-disc pl-5 text-[#333a42] space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your information</li>
                <li>Object to or restrict certain processing</li>
                <li>Request a portable copy of your data</li>
                <li>Withdraw marketing consent at any time</li>
              </ul>
              <p className="text-[#333a42] mt-4">
                To exercise any of these rights, contact us using the details below. We'll respond within 30 days.
              </p>
            </section>

            {/* Section 07 */}
            <section id="security" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">07</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  Security
                </h2>
              </div>
              <p className="text-[#333a42]">
                We use industry-standard safeguards — including encryption in transit and restricted access controls — 
                to protect your information. No method of transmission or storage is 100% secure, but we work to protect 
                your data at every step.
              </p>
            </section>

            {/* Section 08 */}
            <section id="children" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">08</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  Children's privacy
                </h2>
              </div>
              <p className="text-[#333a42]">
                Our site is not directed to children under 16, and we do not knowingly collect personal information 
                from them. If you believe a child has provided us information, please contact us so we can remove it.
              </p>
            </section>

            {/* Section 09 */}
            <section id="transfers" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">09</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  International transfers
                </h2>
              </div>
              <p className="text-[#333a42]">
                Your information may be processed in countries other than your own. Where this happens, we take steps 
                to ensure it receives an adequate level of protection consistent with this policy.
              </p>
            </section>

            {/* Section 10 */}
            <section id="changes" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">10</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  Changes to this policy
                </h2>
              </div>
              <p className="text-[#333a42]">
                We may update this policy from time to time. Material changes will be reflected by an updated 
                "Last updated" date at the top of this page, and where appropriate, we'll notify you directly.
              </p>
            </section>

            {/* Section 11 */}
            <section id="contact" className="bg-white rounded-3xl border border-[#E1E4E1] p-8 shadow-sm">
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className="font-mono text-[#21665A] text-base">11</span>
                <h2 className="font-serif font-medium text-2xl text-[#161B22] tracking-tight">
                  Contact us
                </h2>
              </div>
              <p className="text-[#333a42]">
                Questions about this policy or your data? Reach us at{' '}
                <a href="mailto:privacy@houseoftoshali.com" className="text-[#21665A] underline hover:no-underline">
                  privacy@houseoftoshali.com
                </a>
                {' '}or through our{' '}
                <Link to="/contact" className="text-[#21665A] underline hover:no-underline">
                  contact page
                </Link>
                .
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

export default PrivacyPolicy