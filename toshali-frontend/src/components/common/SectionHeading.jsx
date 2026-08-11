import React from 'react'
import dividerSwirl from '../../assets/images/divider-swirl.png'

/**
 * Ornamental heading used under every section title.
 * Uses the actual divider-swirl.png image for a pixel-exact match
 * with the reference design.
 *
 * Usage:
 * <SectionHeading eyebrow="Our Bestsellers" title="Handpicked, Just for You" />
 */
const SectionHeading = ({ eyebrow, title, className = '' }) => {
  return (
    <div className={`text-center ${className}`}>
      {eyebrow && (
        <p className="text-xs font-semibold text-[#6E1F2F] tracking-[0.2em] uppercase mb-3">
          {eyebrow}
        </p>
      )}

      <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-[#3d2a1a]">
        {title}
      </h2>

      <div className="flex justify-center mt-0">
        <img src={dividerSwirl} alt="" className="h-20 md:h-24 w-auto" />
      </div>
    </div>
  )
}

export default SectionHeading