import React, { useState, useEffect, useRef } from 'react'
import banner1 from '../../assets/images/banners/banner1.png'
import banner2 from '../../assets/images/banners/banner2.png'

// Add more entries here whenever you have more banner images.
// Just drop the new file in src/assets/images/banners/, import it above,
// and add it to this array — e.g. { image: banner3, alt: 'Banner 3' }
const slides = [
  { image: banner1, alt: 'House of Toshali promo banner 1' },
  { image: banner2, alt: 'House of Toshali promo banner 2' },
]

const AUTOPLAY_DELAY = 4000 // ms between auto-swipes

const PromoCarousel = () => {
  const [current, setCurrent] = useState(0)
  const [containerHeight, setContainerHeight] = useState(null)
  const wrapperRef = useRef(null)
  const timerRef = useRef(null)

  const goTo = (index) => {
    setCurrent((index + slides.length) % slides.length)
  }

  const next = () => goTo(current + 1)
  const prev = () => goTo(current - 1)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length)
    }, AUTOPLAY_DELAY)
    return () => clearInterval(timerRef.current)
  }, [])

  const handleManual = (fn) => {
    clearInterval(timerRef.current)
    fn()
    timerRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length)
    }, AUTOPLAY_DELAY)
  }

  // Recompute the container height to exactly match the current slide's
  // natural aspect ratio at the current width — this guarantees the whole
  // image is always visible (no crop) and there's never blank letterbox space.
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
    <section className="px-4 md:px-10 py-8 bg-[#FBF9F2]">
      <div className="max-w-7xl mx-auto relative rounded-3xl overflow-hidden shadow-xl bg-[#2b1d3a]" ref={wrapperRef}>
        {/* Track — height adjusts smoothly to match each slide's true aspect ratio, so nothing ever crops */}
        <div
          className="relative w-full transition-[height] duration-500 ease-in-out"
          style={{ height: containerHeight ? `${containerHeight}px` : 'auto' }}
        >
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{
              width: `${slides.length * 100}%`,
              transform: `translateX(-${current * (100 / slides.length)}%)`,
            }}
          >
            {slides.map((slide, i) => (
              <div
                key={i}
                className="h-full flex-shrink-0"
                style={{ width: `${100 / slides.length}%` }}
              >
                <img
                  src={slide.image}
                  alt={slide.alt}
                  data-index={i}
                  onLoad={() => i === current && recalcHeight()}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={() => handleManual(prev)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-[#3d2a1a] shadow-md transition-colors"
          aria-label="Previous slide"
        >
          ←
        </button>
        <button
          onClick={() => handleManual(next)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-[#3d2a1a] shadow-md transition-colors"
          aria-label="Next slide"
        >
          →
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => handleManual(() => goTo(i))}
              className={`h-2 rounded-full transition-all ${
                i === current ? 'w-6 bg-[#D4AF37]' : 'w-2 bg-white/70 hover:bg-white'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default PromoCarousel