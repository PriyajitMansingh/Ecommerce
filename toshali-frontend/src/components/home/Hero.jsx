import React from 'react'
import heroBowl from '../../assets/images/hero-bowl.png'
import almond from '../../assets/images/almond.png'
import cashew from '../../assets/images/cashew.png'
import makhana from '../../assets/images/makhana.png'
import almondLoose from '../../assets/images/almond-loose.png'
import Navbar from '../layout/Navbar'

const promoCards = [
  { name: 'Almonds', tag: 'Best Value', image: almond, bg: 'from-[#EFE3C8] to-[#E3D2A8]' },
  { name: 'Cashews', tag: '25% OFF', image: cashew, bg: 'from-[#E9D9C0] to-[#DDC6A0]' },
  { name: 'Makhana', tag: 'New Arrival', image: makhana, bg: 'from-[#F0E6CC] to-[#E4D2AA]' },
]

const badges = [
  { icon: '🌿', label: '100% Natural' },
  { icon: '✅', label: 'FSSAI Certified' },
  { icon: '🌍', label: 'Ship Worldwide' },
]

/* ============================================================
   DESKTOP FRAME (lg and up)
   Text block on the left, bowl absolutely positioned on the right,
   full-size promo cards, wide badge row — untouched original layout.
   ============================================================ */
const HeroDesktop = () => (
  <div className="hidden lg:block px-10 py-10 bg-[#FBF9F2]">
    <div className="max-w-7xl mx-auto bg-gradient-to-br from-[#F3E4C8] via-[#EFDFC8] to-[#E9D3AC] rounded-[32px] px-16 py-20 relative overflow-hidden min-h-[600px] shadow-2xl shadow-[#3d2a1a]/10 border border-white/40">

      <div className="absolute top-0 right-1/4 w-[420px] h-[420px] bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#B8860B]/10 rounded-full blur-3xl pointer-events-none" />

      <img src={almondLoose} alt="" className="absolute top-10 left-10 w-16 rotate-[-15deg] opacity-70 pointer-events-none drop-shadow-lg" />

      <div className="relative z-10 max-w-xl">
        <div className="hero-anim hero-d1 inline-flex items-center gap-2.5 mb-6 bg-white/80 backdrop-blur-sm px-5 py-2 rounded-full shadow-sm">
          <span className="h-px w-6 bg-[#B8860B]" />
          <span className="text-xs font-bold text-[#B8860B] tracking-[0.22em] uppercase">
            Premium Nutrition
          </span>
        </div>

        <h1 className="hero-anim hero-d2 font-serif text-[64px] text-[#3d2a1a] leading-[1.05] mb-1 tracking-tight">
          Healthy Snacking,
        </h1>
        <h1 className="hero-anim hero-d3 font-serif text-[64px] text-[#B8860B] italic leading-[1.05] mb-5 tracking-tight">
          starts here.
        </h1>

        <p className="hero-anim hero-d4 text-[#6b5940] text-[15px] mb-9 max-w-md leading-relaxed">
          Handpicked, hygienically packed dry fruits — delivered fresh from the heart of Odisha to your doorstep.
        </p>

        <div className="hero-anim hero-d5 flex flex-wrap items-center gap-5 mb-10">
          <button className="bg-[#3d2a1a] text-white font-semibold text-[15px] px-8 py-4 rounded-full flex items-center gap-2.5 hover:bg-[#2b1d14] hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-300 shadow-lg shadow-[#3d2a1a]/30">
            Shop Now
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">→</span>
          </button>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-sm">
            <span className="text-[#D4AF37] text-sm">★★★★★</span>
            <span className="text-xs text-[#6b5940] font-semibold">4.8 (2,300+ reviews)</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-9 max-w-lg">
          {promoCards.map((card) => (
            <div
              key={card.name}
              className={`bg-gradient-to-br ${card.bg} rounded-2xl p-4 h-40 flex flex-col justify-between border border-[#3d2a1a]/10 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
            >
              <span className="text-[10px] font-bold text-[#B8860B] uppercase tracking-wide bg-white/80 px-2.5 py-1 rounded-full w-fit shadow-sm">
                {card.tag}
              </span>
              <div className="flex flex-col items-center">
                <img src={card.image} alt={card.name} className="h-16 w-16 object-contain drop-shadow-md mb-1.5" />
                <span className="text-xs font-bold text-[#3d2a1a]">{card.name}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-6 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 w-fit flex-wrap shadow-sm">
          {badges.map((b) => (
            <span key={b.label} className="flex items-center gap-2 text-xs font-bold text-[#3d2a1a]">
              <span>{b.icon}</span>
              {b.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex absolute right-16 top-1/2 -translate-y-1/2 z-10">
        <div className="hero-bowl-wrap relative w-[420px] h-[420px]">
          <div className="hero-bowl-float relative w-full h-full">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#D4AF37]/40 animate-[spin_45s_linear_infinite]" />

            <div
              className="absolute inset-5 rounded-full overflow-hidden shadow-2xl ring-[6px] ring-white/60"
              style={{ boxShadow: '0 40px 80px -18px rgba(61,42,26,0.45)' }}
            >
              <img src={heroBowl} alt="Premium dry fruits bowl" className="w-full h-full object-cover" />
            </div>

            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl px-5 py-3 flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-[#EFDFC8] flex items-center justify-center text-[#B8860B] text-base font-bold">
                ✓
              </span>
              <div>
                <p className="text-xs font-bold text-[#3d2a1a] leading-tight">Certified Quality</p>
                <p className="text-[10px] text-[#6b5940] leading-tight">Est. Odisha</p>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-[#D4AF37] rounded-full shadow-lg w-[68px] h-[68px] flex flex-col items-center justify-center text-[#3d2a1a] rotate-12">
              <span className="text-base font-bold leading-none">25%</span>
              <span className="text-[9px] font-bold leading-none">OFF</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

/* ============================================================
   MOBILE FRAME (below lg)
   Its own layout, built for a narrow viewport: bowl centered at
   the top, everything else stacked and center-aligned, sized for
   phone/tablet widths — not the desktop layout scaled down.
   ============================================================ */
const HeroMobile = () => (
  <div className="lg:hidden px-4 py-6 bg-[#FBF9F2]">
    <div className="max-w-md mx-auto bg-gradient-to-br from-[#F3E4C8] via-[#EFDFC8] to-[#E9D3AC] rounded-[24px] px-5 py-8 relative overflow-hidden shadow-xl shadow-[#3d2a1a]/10 border border-white/40">

      <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#B8860B]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Bowl centered up top — this is the frame's focal point on mobile */}
      <div className="relative z-10 flex justify-center mb-7">
        <div className="hero-bowl-wrap relative w-56 h-56">
          <div className="hero-bowl-float relative w-full h-full">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#D4AF37]/40 animate-[spin_45s_linear_infinite]" />

            <div
              className="absolute inset-4 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/60"
              style={{ boxShadow: '0 30px 60px -14px rgba(61,42,26,0.45)' }}
            >
              <img src={heroBowl} alt="Premium dry fruits bowl" className="w-full h-full object-cover" />
            </div>

            <div className="absolute -bottom-3 -left-3 bg-white rounded-xl shadow-xl px-3 py-2 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#EFDFC8] flex items-center justify-center text-[#B8860B] text-sm font-bold">
                ✓
              </span>
              <div>
                <p className="text-[10px] font-bold text-[#3d2a1a] leading-tight">Certified Quality</p>
                <p className="text-[9px] text-[#6b5940] leading-tight">Est. Odisha</p>
              </div>
            </div>

            <div className="absolute -top-3 -right-3 bg-[#D4AF37] rounded-full shadow-lg w-14 h-14 flex flex-col items-center justify-center text-[#3d2a1a] rotate-12">
              <span className="text-sm font-bold leading-none">25%</span>
              <span className="text-[8px] font-bold leading-none">OFF</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 text-center">
        <div className="hero-anim hero-d1 inline-flex items-center gap-2 mb-4 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm">
          <span className="h-px w-5 bg-[#B8860B]" />
          <span className="text-[10px] font-bold text-[#B8860B] tracking-[0.16em] uppercase">
            Premium Nutrition
          </span>
        </div>

        <h1 className="hero-anim hero-d2 font-serif text-[32px] text-[#3d2a1a] leading-[1.1] mb-1 tracking-tight">
          Healthy Snacking,
        </h1>
        <h1 className="hero-anim hero-d3 font-serif text-[32px] text-[#B8860B] italic leading-[1.1] mb-4 tracking-tight">
          starts here.
        </h1>

        <p className="hero-anim hero-d4 text-[#6b5940] text-sm mb-6 leading-relaxed">
          Handpicked, hygienically packed dry fruits — delivered fresh from the heart of Odisha to your doorstep.
        </p>

        <div className="hero-anim hero-d5 flex flex-col items-center gap-3 mb-7">
          <button className="w-full bg-[#3d2a1a] text-white font-semibold text-sm px-6 py-3.5 rounded-full flex items-center justify-center gap-2 hover:bg-[#2b1d14] transition-all duration-300 shadow-lg shadow-[#3d2a1a]/30">
            Shop Now
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">→</span>
          </button>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3.5 py-2 rounded-full shadow-sm">
            <span className="text-[#D4AF37] text-xs">★★★★★</span>
            <span className="text-[11px] text-[#6b5940] font-semibold">4.8 (2,300+ reviews)</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {promoCards.map((card) => (
            <div
              key={card.name}
              className={`bg-gradient-to-br ${card.bg} rounded-xl p-2.5 h-28 flex flex-col justify-between border border-[#3d2a1a]/10 shadow-md`}
            >
              <span className="text-[7px] font-bold text-[#B8860B] uppercase tracking-wide bg-white/80 px-2 py-0.5 rounded-full w-fit shadow-sm">
                {card.tag}
              </span>
              <div className="flex flex-col items-center">
                <img src={card.image} alt={card.name} className="h-9 w-9 object-contain drop-shadow-md mb-1" />
                <span className="text-[9px] font-bold text-[#3d2a1a]">{card.name}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-stretch gap-2 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-sm">
          {badges.map((b) => (
            <span key={b.label} className="flex items-center justify-center gap-2 text-[11px] font-bold text-[#3d2a1a]">
              <span>{b.icon}</span>
              {b.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
)

const Hero = () => {
  return (
    <>
      <Navbar />
      <HeroDesktop />
      <HeroMobile />

      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroScaleIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }

        .hero-anim {
          opacity: 0;
          animation: heroFadeUp 0.7s ease-out forwards;
        }
        .hero-d1 { animation-delay: 0.1s; }
        .hero-d2 { animation-delay: 0.25s; }
        .hero-d3 { animation-delay: 0.4s; }
        .hero-d4 { animation-delay: 0.55s; }
        .hero-d5 { animation-delay: 0.7s; }

        .hero-bowl-wrap {
          opacity: 0;
          animation: heroScaleIn 0.8s ease-out 0.3s forwards;
        }
        .hero-bowl-float {
          animation: heroFloat 4s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}

export default Hero