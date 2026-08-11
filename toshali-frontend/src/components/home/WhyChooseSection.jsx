import React, { useState } from 'react'

// Drop your banner image here (Vite public folder — referenced by absolute
// path, so the build never breaks even if the file is missing; a fallback
// message shows instead until you add it).
// Recommended size: keep the same as your source image (roughly 1536x1024,
// landscape), .jpg or .webp, under ~300KB for fast loading.
//   public/images/home/why-choose-house-of-toshali.png
const BANNER_SRC = '/images/home/why-choose-house-of-toshali.png'

const WhyChooseSection = () => {
  const [failed, setFailed] = useState(false)

  return (
    <section className="bg-[#FBF9F2] py-14 px-4 md:px-6">
      <div className="max-w-[1400px] mx-auto">
        {failed ? (
          <div className="w-full aspect-[3/2] rounded-2xl bg-[#F3E4C8] flex items-center justify-center text-center px-6">
            <p className="text-sm text-[#3d2a1a]/70">
              Add the banner image at <code className="font-mono">public{BANNER_SRC}</code> to show this section.
            </p>
          </div>
        ) : (
          <img
            src={BANNER_SRC}
            alt="Why choose House of Toshali — 100% natural, premium quality, rich in nutrition, perfect for gifting"
            className="w-full h-auto rounded-2xl shadow-md"
            onError={() => setFailed(true)}
          />
        )}
      </div>
    </section>
  )
}

export default WhyChooseSection