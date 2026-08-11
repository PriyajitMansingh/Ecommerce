import React from 'react'
import Navbar from '../../components/layout/Navbar'
import { useNavigate } from 'react-router-dom'
import heroBowl from '../../assets/images/hero-bowl.png'
import almondLoose from '../../assets/images/almond-loose.png'
import cashewLoose from '../../assets/images/cashew-loose.png'
import makhanaLoose from '../../assets/images/makhana-loose.png'

const About = () => {
  const navigate = useNavigate()

  return (
    <>
      <Navbar />
      <section className="relative bg-[#FBF9F2] min-h-screen pb-20 px-6 md:px-16 overflow-hidden">
      {/* Scattered loose nuts — decorative, consistent with the Hero/Footer theme */}
      <img src={almondLoose} alt="" className="hidden md:block absolute top-16 left-6 w-24 rotate-[-15deg] opacity-70 pointer-events-none drop-shadow-lg" />
      <img src={cashewLoose} alt="" className="hidden md:block absolute top-40 right-8 w-24 rotate-[12deg] opacity-70 pointer-events-none drop-shadow-lg" />
      <img src={makhanaLoose} alt="" className="hidden md:block absolute bottom-24 left-10 w-20 rotate-[8deg] opacity-60 pointer-events-none drop-shadow-lg" />

      <div className="max-w-5xl mx-auto pt-8 relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#6b5940] hover:text-[#B8860B] transition-colors mb-10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-[#B8860B] tracking-[0.22em] uppercase mb-3">
            Our Story
          </p>
          <h1 className="font-serif text-3xl md:text-5xl text-[#3d2a1a] mb-6 leading-tight">
            Rooted in the Heart of Odisha
          </h1>
          <p className="text-[#6b5940] text-base leading-relaxed max-w-2xl mx-auto">
            House of Toshali was born from a simple belief — that dry fruits deserve to be pure,
            natural, and handpicked with care. We work directly with trusted growers to bring you
            almonds, cashews and makhana that carry the richness of tradition and the promise of quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
          <div>
            <h2 className="font-serif text-2xl text-[#3d2a1a] mb-4">
              Handpicked, <span className="italic text-[#B8860B]">Hand-Sorted.</span>
            </h2>
            <p className="text-sm text-[#6b5940] leading-relaxed mb-4">
              Every batch that carries the House of Toshali name is sorted by hand, sealed for freshness,
              and shipped with the same care we'd give a gift for our own family. No shortcuts, no fillers —
              just honest, premium dry fruits.
            </p>
            <p className="text-sm text-[#6b5940] leading-relaxed">
              We're proud to be based in Odisha, and even prouder to bring a taste of home to households
              across the country.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <img src={heroBowl} alt="House of Toshali dry fruits bowl" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#3d2a1a]/10">
            <p className="font-serif text-3xl font-bold text-[#B8860B] mb-2">100%</p>
            <p className="text-sm text-[#6b5940]">Natural &amp; Pure</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#3d2a1a]/10">
            <p className="font-serif text-3xl font-bold text-[#B8860B] mb-2">10k+</p>
            <p className="text-sm text-[#6b5940]">Happy Customers</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#3d2a1a]/10">
            <p className="font-serif text-3xl font-bold text-[#B8860B] mb-2">4.8★</p>
            <p className="text-sm text-[#6b5940]">Customer Rating</p>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}

export default About