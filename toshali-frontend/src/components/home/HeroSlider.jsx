import React, { useState, useEffect, useRef } from 'react'
import Navbar from '../layout/Navbar'

// Drop your 5 images here with these exact names:
// src/assets/images/hero-slides/slide1.png
// src/assets/images/hero-slides/slide2.png
// src/assets/images/hero-slides/slide3.png
// src/assets/images/hero-slides/slide4.png
// src/assets/images/hero-slides/slide5.png
import slide1 from '../../assets/images/hero-slides/slide1.png'
import slide2 from '../../assets/images/hero-slides/slide2.png'
import slide3 from '../../assets/images/hero-slides/slide3.png'
import slide4 from '../../assets/images/hero-slides/slide4.png'
import slide5 from '../../assets/images/hero-slides/slide5.png'

const slides = [
  { image: slide1, alt: 'House of Toshali hero slide 1' },
  { image: slide2, alt: 'House of Toshali hero slide 2' },
  { image: slide3, alt: 'House of Toshali hero slide 3' },
  { image: slide4, alt: 'House of Toshali hero slide 4' },
  { image: slide5, alt: 'House of Toshali hero slide 5' },
]

const AUTOPLAY_DELAY = 2800 // ms between auto-swipes

const HeroSlider = () => {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [containerHeight, setContainerHeight] = useState(null)
  const wrapperRef = useRef(null)
  const timerRef = useRef(null)

  const goTo = (index) => setCurrent((index + slides.length) % slides.length)
  const next = () => goTo(current + 1)
  const prev = () => goTo(current - 1)

  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length)
    }, AUTOPLAY_DELAY)
    return () => clearInterval(timerRef.current)
  }, [paused, current])

  const handleManual = (fn) => {
    clearInterval(timerRef.current)
    fn()
  }

  // Recompute the container height to exactly match the current slide's
  // natural aspect ratio at the current width — guarantees every slide is
  // shown fully, with no cropping on any edge, no matter its dimensions.
  const recalcHeight = () => {
    if (!wrapperRef.current) return
    const width = wrapperRef.current.offsetWidth
    const img = wrapperRef.current.querySelector(`img[data-index="${current}"]`)
    if (img && img.naturalWidth) {
      const ratio = img.naturalHeight / img.naturalWidth
      setContainerHeight(width * ratio)
    }
  }

  useEffect(() => {
    recalcHeight()
    window.addEventListener('resize', recalcHeight)
    return () => window.removeEventListener('resize', recalcHeight)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current])

  return (
    <>
      <Navbar />
      <section
        className="relative bg-[#3d2a1a]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        ref={wrapperRef}
      >
        {/* Track — height dynamically matches each slide's true aspect ratio,
            so nothing is ever cropped on any edge */}
        <div
          className="relative w-full overflow-hidden transition-[height] duration-500 ease-in-out"
          style={{ height: containerHeight ? `${containerHeight}px` : '500px' }}
        >
          <div
            className="flex h-full transition-transform duration-500 ease-out"
            style={{
              width: `${slides.length * 100}%`,
              transform: `translateX(-${current * (100 / slides.length)}%)`,
            }}
          >
            {slides.map((slide, i) => (
              <div
                key={i}
                className="h-full flex-shrink-0 overflow-hidden"
                style={{ width: `${100 / slides.length}%` }}
              >
                <img
                  src={slide.image}
                  alt={slide.alt}
                  data-index={i}
                  onLoad={() => i === current && recalcHeight()}
                  className="w-full h-full object-contain"
                  style={{
                    animation: i === current && !paused ? 'toshaliKenBurns 9s ease-out forwards' : 'none',
                  }}
                />
              </div>
            ))}
          </div>

          {/* bottom gradient blends the image smoothly into the next section — no hard seam */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#3d2a1a] via-[#3d2a1a]/50 to-transparent pointer-events-none" />
        </div>

        <style>{`
          @keyframes toshaliKenBurns {
            from { transform: scale(1); }
            to { transform: scale(1.05); }
          }
        `}</style>

        {/* Prev / Next arrows */}
        <button
          onClick={() => handleManual(prev)}
          className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/30 hover:bg-white hover:border-white flex items-center justify-center text-white hover:text-[#3d2a1a] shadow-lg transition-all duration-300 z-20"
          aria-label="Previous slide"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={() => handleManual(next)}
          className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/30 hover:bg-white hover:border-white flex items-center justify-center text-white hover:text-[#3d2a1a] shadow-lg transition-all duration-300 z-20"
          aria-label="Next slide"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Progress-bar dots */}
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => handleManual(() => goTo(i))}
              className="relative h-1 sm:h-1.5 w-6 sm:w-10 rounded-full bg-white/25 overflow-hidden"
              aria-label={`Go to slide ${i + 1}`}
            >
              {i === current && (
                <span
                  className="absolute inset-y-0 left-0 bg-[#D4AF37] rounded-full"
                  style={{
                    animation: paused ? 'none' : `toshaliProgress ${AUTOPLAY_DELAY}ms linear forwards`,
                    width: paused ? '100%' : undefined,
                  }}
                />
              )}
              {i < current && <span className="absolute inset-0 bg-[#D4AF37] rounded-full" />}
            </button>
          ))}
        </div>

        <style>{`
          @keyframes toshaliProgress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}</style>
      </section>
    </>
  )
}

export default HeroSlider