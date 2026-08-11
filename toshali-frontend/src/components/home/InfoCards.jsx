import React from 'react'
import heroBowl from '../../assets/images/hero-bowl.png'
import almondLoose from '../../assets/images/almond-loose.png'

const cards = [
  {
    title: ['From Nature', 'To Your Home'],
    desc: 'Bringing you the finest & freshest dry fruits, sourced directly from Odisha.',
    cta: 'Shop Now',
    accent: 'from-[#F3E4C8] to-[#E9D3AC]',
  },
  {
    title: ['Premium Quality', 'You Can Trust'],
    desc: 'Sourced from the best farms, hand-sorted and sealed for guaranteed freshness.',
    cta: 'Learn More',
    accent: 'from-[#EFE0C4] to-[#E3CBA0]',
  },
]

const InfoCards = () => {
  return (
    <section className="relative bg-[#EFDFC8] py-20 px-6 md:px-12 overflow-hidden">
      <img src={almondLoose} alt="" className="hidden xl:block absolute top-8 right-10 w-20 rotate-[15deg] opacity-50 pointer-events-none drop-shadow-lg" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {cards.map((card) => (
          <div
            key={card.title[0]}
            className={`bg-gradient-to-br ${card.accent} rounded-3xl p-8 md:p-10 flex items-center justify-between overflow-hidden relative shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 min-h-[260px] border border-white/40`}
          >
            <div className="max-w-[58%] relative z-10">
              <span className="inline-block h-px w-8 bg-[#B8860B] mb-4" />
              <h3 className="font-serif text-2xl md:text-[28px] text-[#3d2a1a] mb-3 leading-snug">
                {card.title[0]}
                <br />
                {card.title[1]}
              </h3>
              <p className="text-sm text-[#6b5940] mb-6 leading-relaxed">
                {card.desc}
              </p>
              <button className="bg-[#3d2a1a] text-white text-xs font-bold tracking-wide px-6 py-3 rounded-full hover:bg-[#2b1d14] hover:-translate-y-0.5 hover:shadow-lg transition-all inline-flex items-center gap-2">
                {card.cta}
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">→</span>
              </button>
            </div>

            <img
              src={heroBowl}
              alt=""
              className="absolute right-0 bottom-0 w-44 md:w-56 object-cover rounded-tl-[28px] shadow-2xl"
              style={{ boxShadow: '-20px -10px 40px -10px rgba(61,42,26,0.25)' }}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default InfoCards