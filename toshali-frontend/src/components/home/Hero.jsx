// import React from 'react'
// import heroBowl from '../../assets/images/hero-bowl.png'
// import decorativeBorder from '../../assets/images/decorative-border.png'
// import almondLoose from '../../assets/images/almond-loose.png'
// import cashewLoose from '../../assets/images/cashew-loose.png'
// import makhanaLoose from '../../assets/images/makhana-loose.png'
// import Navbar from '../layout/Navbar'

// const features = [
//   {
//     label: '100% Natural',
//     icon: (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//         <path d="M12 2C8 6 6 10 6 13a6 6 0 0012 0c0-3-2-7-6-11z" />
//       </svg>
//     ),
//   },
//   {
//     label: 'Rich in Nutrients',
//     icon: (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//         <path d="M12 21s-7-4.5-9-9a5 5 0 019-4 5 5 0 019 4c-2 4.5-9 9-9 9z" />
//         <path d="M9 11l1.5 1.5L15 8" />
//       </svg>
//     ),
//   },
//   {
//     label: 'Hygienically Packed',
//     icon: (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//         <path d="M12 2l7 3v6c0 5-3 8-7 9-4-1-7-4-7-9V5l7-3z" />
//         <path d="M9 12l2 2 4-4" />
//       </svg>
//     ),
//   },
//   {
//     label: 'No Preservatives',
//     icon: (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//         <path d="M7 3h10M7 21h10M8 3v5l-3 6a5 5 0 004 8h6a5 5 0 004-8l-3-6V3" />
//       </svg>
//     ),
//   },
// ]

// const Hero = () => {
//   return (
//     <section className="bg-gradient-to-br from-[#F3E4C8] via-[#EFDFC8] to-[#E9D3AC] relative overflow-hidden">
//       <Navbar />

//       <div className="absolute top-20 left-1/3 w-72 h-72 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

//       <div className="absolute top-32 left-6 hidden lg:block z-0">
//         <img src={almondLoose} alt="" className="relative w-24 rotate-[-10deg]" />
//         <div className="w-16 h-3 bg-black/25 rounded-full blur-md mx-auto -mt-1" />
//       </div>

//       <div className="absolute bottom-16 left-16 hidden lg:block z-0">
//         <img src={makhanaLoose} alt="" className="relative w-20 rotate-[8deg]" />
//         <div className="w-14 h-3 bg-black/25 rounded-full blur-md mx-auto -mt-1" />
//       </div>

//       <div className="absolute top-32 right-10 hidden lg:block z-0">
//         <img src={cashewLoose} alt="" className="relative w-20 rotate-[15deg]" />
//         <div className="w-14 h-3 bg-black/25 rounded-full blur-md mx-auto -mt-1" />
//       </div>

//       <div className="max-w-7xl mx-auto px-6 md:px-10 py-24 grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10">
//         <div>
//           <div className="inline-flex items-center gap-2 mb-5 bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm">
//             <span className="h-px w-6 bg-[#B8860B]" />
//             <span className="text-xs font-semibold text-[#B8860B] tracking-[0.2em] uppercase">
//               Premium Dry Fruits
//             </span>
//           </div>

//           <h1 className="font-serif text-5xl md:text-6xl text-[#3d2a1a] leading-[1.1] mb-1 drop-shadow-sm">
//             Goodness of Nature,
//           </h1>
//           <h1 className="font-serif text-5xl md:text-6xl text-[#B8860B] leading-[1.1] mb-6 italic">
//             Handpicked for You!
//           </h1>

//           <p className="text-[#6b5940] text-base mb-9 max-w-md leading-relaxed">
//             Carefully selected premium dry fruits for a healthy you and your loved ones.
//           </p>

//           <div className="flex flex-wrap items-center gap-5 mb-12">
//             <button className="bg-[#3d2a1a] text-white font-semibold px-8 py-4 rounded-full flex items-center gap-2 hover:bg-[#2b1d14] hover:-translate-y-1 hover:shadow-2xl transition-all shadow-xl shadow-[#3d2a1a]/30">
//               Shop Now
//               <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">→</span>
//             </button>

//             <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
//               <span className="text-[#D4AF37] text-sm">★★★★★</span>
//               <span className="text-xs text-[#6b5940] font-semibold">4.8 (2,300+ reviews)</span>
//             </div>
//           </div>

//           <div className="grid grid-cols-4 gap-4 pt-8 border-t border-[#3d2a1a]/10">
//             {features.map((f) => (
//               <div key={f.label} className="flex flex-col items-center text-center">
//                 <span className="w-12 h-12 rounded-full border border-[#3d2a1a]/20 bg-white/60 shadow-sm flex items-center justify-center text-[#B8860B] mb-2">
//                   {f.icon}
//                 </span>
//                 <p className="text-[11px] text-[#6b5940] leading-tight font-medium">{f.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="relative flex justify-center">
//           <img
//             src={decorativeBorder}
//             alt=""
//             className="absolute -left-20 md:-left-24 top-1/2 -translate-y-1/2 h-[140%] w-auto opacity-90 pointer-events-none hidden md:block z-20"
//           />

//           <div
//             className="relative w-full max-w-lg aspect-[4/3] overflow-hidden z-10"
//             style={{
//               borderRadius: '40px',
//               boxShadow: '0 40px 80px -20px rgba(61,42,26,0.3)',
//               maskImage: 'radial-gradient(ellipse 80% 80% at center, black 60%, transparent 100%)',
//               WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at center, black 60%, transparent 100%)',
//             }}
//           >
//             <img
//               src={heroBowl}
//               alt="Premium dry fruits bowl"
//               className="w-full h-full object-cover"
//             />
//           </div>

//           <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl px-5 py-3 flex items-center gap-3 z-30">
//             <span className="w-10 h-10 rounded-full bg-[#EFDFC8] flex items-center justify-center text-[#B8860B] text-sm font-bold">
//               ✓
//             </span>
//             <div>
//               <p className="text-xs font-semibold text-[#3d2a1a]">Certified Quality</p>
//               <p className="text-[10px] text-[#6b5940]">Est. Odisha</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default Hero

//==========================================================================================================================================
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

const Hero = () => {
  return (
    <>
      <Navbar />
      <section className="px-4 md:px-10 py-10 bg-[#FBF9F2]">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-[#F3E4C8] via-[#EFDFC8] to-[#E9D3AC] rounded-[32px] px-8 md:px-16 py-14 md:py-20 relative overflow-hidden min-h-[600px] shadow-2xl shadow-[#3d2a1a]/10 border border-white/40">

          <div className="absolute top-0 right-1/4 w-[420px] h-[420px] bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#B8860B]/10 rounded-full blur-3xl pointer-events-none" />

          <img src={almondLoose} alt="" className="absolute top-10 left-10 w-16 rotate-[-15deg] opacity-70 hidden md:block pointer-events-none drop-shadow-lg" />

          <div className="relative z-10 max-w-xl">
            <div className="hero-anim hero-d1 inline-flex items-center gap-2.5 mb-6 bg-white/80 backdrop-blur-sm px-5 py-2 rounded-full shadow-sm">
              <span className="h-px w-6 bg-[#B8860B]" />
              <span className="text-xs font-bold text-[#B8860B] tracking-[0.22em] uppercase">
                Premium Nutrition
              </span>
            </div>

            <h1 className="hero-anim hero-d2 font-serif text-4xl md:text-[64px] text-[#3d2a1a] leading-[1.05] mb-1 tracking-tight">
              Healthy Snacking,
            </h1>
            <h1 className="hero-anim hero-d3 font-serif text-4xl md:text-[64px] text-[#B8860B] italic leading-[1.05] mb-5 tracking-tight">
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

          <div className="hidden lg:flex absolute right-8 md:right-16 top-1/2 -translate-y-1/2 z-10">
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
      </section>

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