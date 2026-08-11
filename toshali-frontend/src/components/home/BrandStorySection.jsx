import React, { useState, useRef, useEffect } from 'react'
import heroBowl from '../../assets/images/hero-bowl.png'

// Save your video with this exact name and path:
// src/assets/videos/brand-story.mp4
import brandVideo from '../../assets/videos/brand-story.mp4'

const BrandStorySection = () => {
  const wrapperRef = useRef(null)
  const videoRef = useRef(null)
  const [videoHeight, setVideoHeight] = useState(null)

  // Measure the video's REAL dimensions once it loads, then size its
  // container to match that exact aspect ratio at the current width.
  // This guarantees the video always fills all the space it's given,
  // shows completely with zero cropping, and never forces the page to
  // grow taller than necessary — on any screen size or device.
  const recalcHeight = () => {
    if (!wrapperRef.current || !videoRef.current) return
    const { videoWidth, videoHeight: vh } = videoRef.current
    if (videoWidth && vh) {
      const width = wrapperRef.current.offsetWidth
      setVideoHeight(width * (vh / videoWidth))
    }
  }

  useEffect(() => {
    recalcHeight()
    window.addEventListener('resize', recalcHeight)
    return () => window.removeEventListener('resize', recalcHeight)
  }, [])

  return (
    <section className="bg-[#3d2a1a] px-6 md:px-16 py-14 md:py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* Text content */}
        <div>
          <span className="inline-flex items-center gap-2 mb-4 md:mb-5 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full">
            <span className="h-px w-6 bg-[#D4AF37]" />
            <span className="text-xs font-bold text-[#D4AF37] tracking-[0.22em] uppercase">
              Our Story
            </span>
          </span>

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-[1.1] mb-4">
            Crafted with Care,<br />
            <span className="italic text-[#E8C766]">Rooted in Tradition</span>
          </h2>

          <p className="text-white/85 text-sm md:text-base mb-7 leading-relaxed max-w-md">
            Every batch of House of Toshali dry fruits carries the warmth of Odisha —
            handpicked, hand-sorted, and packed with the same care as a family recipe.
          </p>

          <button className="bg-[#D4AF37] text-[#3d2a1a] font-bold text-sm px-7 py-3.5 rounded-full hover:bg-white hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-300">
            Discover Our Story
          </button>
        </div>

        {/* Video — fills 100% of the width given to it, height calculated
            to exactly match its real aspect ratio, so it's always fully
            visible (zero crop) at the largest size that fits without
            forcing extra scroll. */}
        <div
          ref={wrapperRef}
          className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-[#2b1d14]"
          style={{ height: videoHeight ? `${videoHeight}px` : 'auto', maxHeight: '75vh' }}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            autoPlay
            loop
            muted
            playsInline
            webkit-playsinline="true"
            preload="auto"
            poster={heroBowl}
            onLoadedMetadata={recalcHeight}
          >
            <source src={brandVideo} type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  )
}

export default BrandStorySection