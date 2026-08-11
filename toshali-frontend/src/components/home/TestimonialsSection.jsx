import React from 'react'
import SectionHeading from '../common/SectionHeading'
import almondLoose from '../../assets/images/almond-loose.png'
import cashewLoose from '../../assets/images/cashew-loose.png'
import makhanaLoose from '../../assets/images/makhana-loose.png'

const testimonials = [
  {
    name: 'Priya Sharma',
    location: 'Bengaluru, Karnataka',
    rating: 5,
    text: 'The almonds are super fresh and crunchy. You can taste the quality in every bite. My go-to brand for healthy snacking!',
  },
  {
    name: 'Rahul Mehta',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    text: 'I gifted the premium hamper to my clients and they absolutely loved it. Elegant packaging and amazing quality!',
  },
  {
    name: 'Sneha Patnaik',
    location: 'Bhubaneswar, Odisha',
    rating: 5,
    text: 'Phool Makhana from House of Toshali is a super healthy snack option for my whole family. We love it!',
  },
  {
    name: 'Amit Verma',
    location: 'Delhi',
    rating: 5,
    text: 'Cashews are rich, creamy and perfectly roasted. Great quality, fast delivery and excellent customer service.',
  },
]

const stats = [
  {
    label: 'Happy Customers',
    value: '50K+',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    label: 'Average Rating',
    value: '4.8/5',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    label: 'Quality Satisfaction',
    value: '99%',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    label: 'Hampers Delivered',
    value: '1L+',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M20 12v10H4V12M2 7h20v5H2V7zM12 22V7M12 7C10.5 7 8 6 8 4a2.5 2.5 0 015 0c0-1.5 1.5-2 2.5-2A2 2 0 0117.5 4c0 2-2.5 3-5.5 3z" />
      </svg>
    ),
  },
]

const Stars = ({ count }) => (
  <div className="flex justify-center gap-0.5 text-[#D4AF37] text-sm mb-4">
    {Array.from({ length: count }).map((_, i) => (
      <span key={i}>★</span>
    ))}
  </div>
)

const MiniDivider = () => (
  <div className="flex items-center justify-center gap-2 mb-4">
    <span className="h-px w-8 bg-[#B8860B]/30" />
    <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B]/50" />
    <span className="h-px w-8 bg-[#B8860B]/30" />
  </div>
)

const TestimonialsSection = () => {
  return (
    <section className="relative bg-[#FBF3E3] py-20 px-6 md:px-12 overflow-hidden">
      <img src={almondLoose} alt="" className="hidden lg:block absolute top-10 left-6 w-20 rotate-[-15deg] opacity-60 pointer-events-none drop-shadow-lg" />
      <img src={cashewLoose} alt="" className="hidden lg:block absolute top-1/2 right-8 w-20 rotate-[10deg] opacity-60 pointer-events-none drop-shadow-lg" />
      <img src={makhanaLoose} alt="" className="hidden lg:block absolute bottom-10 left-16 w-16 rotate-[8deg] opacity-50 pointer-events-none drop-shadow-lg" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeading eyebrow="Loved by Thousands" title="Trusted Every Day" />

        <p className="text-center text-sm text-[#6b5940] max-w-lg mx-auto mb-14 -mt-4">
          Real stories from real people who choose health, quality and goodness with House of Toshali.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-6 text-center border border-[#B8860B]/15 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <span className="block text-4xl font-serif text-[#D4AF37] leading-none mb-2 select-none">
                &ldquo;
              </span>

              <p className="text-sm text-[#3d2a1a]/80 leading-relaxed mb-4 min-h-[95px]">
                {t.text}
              </p>

              <Stars count={t.rating} />
              <MiniDivider />

              <p className="text-sm font-bold text-[#3d2a1a]">{t.name}</p>
              <p className="text-xs text-[#a89c8a]">{t.location}</p>
            </div>
          ))}
        </div>

        {/* Trust stats bar — matches the reference layout */}
        <div className="bg-white rounded-2xl border border-[#B8860B]/20 shadow-sm px-6 py-6 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#B8860B]/15">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3 justify-center py-3 md:py-0">
              <span className="w-11 h-11 rounded-full border-2 border-[#B8860B]/40 text-[#B8860B] flex items-center justify-center flex-shrink-0">
                {s.icon}
              </span>
              <span className="text-left">
                <span className="block text-lg font-serif font-bold text-[#3d2a1a]">{s.value}</span>
                <span className="block text-xs text-[#6b5940]">{s.label}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
