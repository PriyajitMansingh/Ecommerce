import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, Package, CreditCard, Truck, FileText, Mail, Phone, MessageCircle } from 'lucide-react'

const Section = ({ number, title, children, icon: Icon }) => (
  <div className="border-b border-[#3d2a1a]/8 py-8 last:border-b-0 transition-all duration-300 hover:bg-[#FBF9F2]/50 rounded-lg px-4 -mx-4">
    <div className="flex items-start gap-4 mb-4">
      {Icon && (
        <div className="w-10 h-10 rounded-full bg-[#B8860B]/10 flex items-center justify-center flex-shrink-0 mt-1">
          <Icon className="w-5 h-5 text-[#B8860B]" />
        </div>
      )}
      <div className="flex-1">
        <h2 className="font-serif text-xl text-[#3d2a1a] mb-3 flex items-center gap-2">
          <span className="text-[#B8860B] font-semibold">{number}.</span>
          {title}
        </h2>
        <div className="text-sm text-[#6b5940] leading-relaxed space-y-3">{children}</div>
      </div>
    </div>
  </div>
)

const TermsOfService = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="bg-[#FBF9F2] min-h-screen">
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

        <div className="relative px-6 md:px-12 py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-[#B8860B]/80 mb-6 animate-fadeIn">
              <Link 
                to="/" 
                className="hover:text-[#B8860B] transition-all duration-300 flex items-center gap-1 group"
              >
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                <span>Home</span>
              </Link>
              <span className="text-[#B8860B]/40">/</span>
              <span className="text-white/90 font-medium">Terms of Service</span>
            </nav>

            {/* Title */}
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-4 tracking-tight leading-tight">
              Terms of Service
            </h1>
            <p className="text-lg text-[#B8860B]/90 font-light max-w-2xl">
              Please read these terms carefully before using our services
            </p>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
              {[
                { icon: Shield, label: 'Legal Protection', color: 'bg-white/10 backdrop-blur-sm' },
                { icon: FileText, label: 'Clear Guidelines', color: 'bg-white/10 backdrop-blur-sm' },
                { icon: CreditCard, label: 'Payment Security', color: 'bg-white/10 backdrop-blur-sm' },
                { icon: Package, label: 'Order Policies', color: 'bg-white/10 backdrop-blur-sm' },
              ].map((item, index) => (
                <div 
                  key={index}
                  className={`${item.color} rounded-2xl p-4 border border-white/20 hover:border-[#B8860B]/50 transition-all duration-300 group cursor-default`}
                >
                  <item.icon className="w-5 h-5 text-[#B8860B] mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-xs text-white/80 font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-16">
        {/* Introduction Card */}
        <div className="bg-white rounded-3xl border border-[#3d2a1a]/10 shadow-[0_8px_30px_rgba(61,42,26,0.08)] p-8 md:p-10 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#B8860B]/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-[#B8860B]" />
            </div>
            <div>
              <p className="text-sm text-[#6b5940] leading-relaxed">
                This website is operated by <span className="font-semibold text-[#3d2a1a]">House of Toshali</span>. 
                Throughout this site, the terms "we," "us," and "our" refer to House of Toshali. 
                By visiting our website and/or purchasing something from us, you agree to be bound by 
                the following Terms of Service.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#a89c8a] bg-[#FBF9F2] rounded-xl p-4">
            <Shield className="w-4 h-4 text-[#B8860B]" />
            <span>Last updated: January 2024</span>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="bg-white rounded-3xl border border-[#3d2a1a]/10 shadow-[0_8px_30px_rgba(61,42,26,0.08)] p-8 md:p-10">
          {/* Table of Contents */}
          <div className="bg-gradient-to-r from-[#FBF9F2] to-white rounded-2xl p-6 mb-8 border border-[#3d2a1a]/5">
            <h3 className="font-serif text-lg text-[#3d2a1a] mb-4">Quick Navigation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                'Eligibility',
                'General Conditions',
                'Accuracy of Information',
                'Product Pricing',
                'Orders & Account',
                'Payments',
                'Shipping & Delivery',
                'Returns & Refunds',
                'Prohibited Uses',
                'Intellectual Property',
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const element = document.getElementById(`section-${index + 1}`)
                    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }}
                  className="text-left text-sm text-[#6b5940] hover:text-[#B8860B] transition-colors flex items-center gap-2 group py-1"
                >
                  <span className="w-1 h-1 rounded-full bg-[#B8860B]/0 group-hover:bg-[#B8860B] transition-all"></span>
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div id="section-1">
            <Section number={1} title="Eligibility" icon={Shield}>
              <p>
                By using this site, you confirm that you are able to enter into
                legally binding contracts under applicable Indian law. If you are a
                minor (under 18 years of age but at least 13), you may use this site
                only under the supervision of a parent or legal guardian who agrees to
                be bound by these Terms.
              </p>
              <p>
                An account is required to place an order, so that you can view your
                order history and manage your saved addresses.
              </p>
            </Section>
          </div>

          <div id="section-2">
            <Section number={2} title="General Conditions" icon={FileText}>
              <ul className="list-disc pl-5 space-y-2">
                <li>We reserve the right to refuse service to anyone, for any reason, at any time.</li>
                <li>
                  Content you submit to us (excluding payment information) may be
                  transmitted over various networks and may be adapted to meet
                  technical requirements. Payment information is always encrypted
                  during transfer.
                </li>
                <li>
                  You agree not to reproduce, duplicate, copy, sell, or exploit any
                  portion of our service or your access to it without our prior
                  written permission.
                </li>
              </ul>
            </Section>
          </div>

          <div id="section-3">
            <Section number={3} title="Accuracy of Information" icon={FileText}>
              <p>
                We aim to keep product descriptions, pricing, and availability
                accurate and current, but the site may occasionally contain
                typographical errors or outdated information. We reserve the right to
                correct such errors and to update information at any time without
                prior notice.
              </p>
            </Section>
          </div>

          <div id="section-4">
            <Section number={4} title="Product Pricing and Availability" icon={Package}>
              <ul className="list-disc pl-5 space-y-2">
                <li>Prices for our products are subject to change without notice.</li>
                <li>
                  We make every effort to display product images and descriptions
                  accurately, but colors and packaging may appear slightly different
                  on different screens.
                </li>
                <li>
                  We reserve the right to limit the quantity of any product sold and 
                  to discontinue any product at any time.
                </li>
              </ul>
            </Section>
          </div>

          <div id="section-5">
            <Section number={5} title="Orders and Account Accuracy" icon={Package}>
              <p>
                You agree to provide accurate, current, and complete information when
                creating your account and placing an order — including your name,
                contact number, and delivery address — and to keep this information
                up to date.
              </p>
              <p>
                We reserve the right to refuse, limit, or cancel any order, including
                orders that appear to contain pricing or listing errors, or orders we
                reasonably suspect involve fraudulent activity.
              </p>
            </Section>
          </div>

          <div id="section-6">
            <Section number={6} title="Payments" icon={CreditCard}>
              <p>
                All payments are processed through our payment gateway partner. We do
                not store your full card, UPI, or banking credentials on our servers —
                payment details are handled directly by our payment processor.
              </p>
              <p>
                You are responsible for ensuring that any payment method you use
                belongs to you and is used with proper authorization.
              </p>
            </Section>
          </div>

          <div id="section-7">
            <Section number={7} title="Shipping and Delivery" icon={Truck}>
              <p>
                Estimated delivery timelines are provided for convenience and are not
                guaranteed. Delays may occur due to courier availability, weather,
                regional restrictions, or other circumstances outside our control.
              </p>
            </Section>
          </div>

          <div id="section-8">
            <Section number={8} title="Returns and Refunds" icon={Package}>
              <p>
                Please refer to our separate{' '}
                <Link to="/returns-policy" className="text-[#B8860B] font-semibold hover:underline inline-flex items-center gap-1">
                  Returns &amp; Refunds Policy
                  <ArrowLeft className="w-3 h-3 rotate-180" />
                </Link>{' '}
                for the current return window, eligibility conditions, and refund
                process.
              </p>
            </Section>
          </div>

          <div id="section-9">
            <Section number={9} title="Prohibited Uses" icon={Shield}>
              <p>You may not use this site or its content:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>for any unlawful purpose, or to solicit others to perform unlawful acts;</li>
                <li>to violate any applicable law or regulation;</li>
                <li>to infringe our intellectual property rights or those of others;</li>
                <li>to harass, abuse, or discriminate against any person;</li>
                <li>to submit false or misleading information;</li>
                <li>to upload viruses, malware, or any code intended to disrupt the site;</li>
              </ul>
            </Section>
          </div>

          <div id="section-10">
            <Section number={10} title="Intellectual Property" icon={Shield}>
              <p>
                All content on this website — including our logo, product
                photography, graphics, text, and design — is the property of House
                of Toshali and is protected under applicable intellectual property
                law.
              </p>
            </Section>
          </div>

          {/* Continue with remaining sections 11-18 similarly */}
          {/* ... */}

          {/* Contact Section */}
          <div className="mt-8 p-6 bg-gradient-to-br from-[#FBF9F2] to-white rounded-2xl border border-[#3d2a1a]/10">
            <h3 className="font-serif text-xl text-[#3d2a1a] mb-4">Need Help?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-[#B8860B]/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#B8860B]" />
                </div>
                <div>
                  <p className="text-xs text-[#a89c8a]">Email</p>
                  <p className="text-sm font-medium text-[#3d2a1a]">support@houseoftoshali.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-[#B8860B]/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[#B8860B]" />
                </div>
                <div>
                  <p className="text-xs text-[#a89c8a]">Phone</p>
                  <p className="text-sm font-medium text-[#3d2a1a]">+91 XXXXXXXXXX</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-[#B8860B]/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-[#B8860B]" />
                </div>
                <div>
                  <p className="text-xs text-[#a89c8a]">Live Chat</p>
                  <p className="text-sm font-medium text-[#3d2a1a]">Available 10 AM - 6 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-[#B8860B] text-white rounded-full shadow-lg hover:bg-[#9A7209] transition-all duration-300 flex items-center justify-center hover:scale-110 group z-50"
        >
          <ArrowLeft className="w-5 h-5 rotate-90 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>
    </div>
  )
}

export default TermsOfService