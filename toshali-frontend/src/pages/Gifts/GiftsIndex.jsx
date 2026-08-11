import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import axiosInstance from '../../api/axiosInstance'

const OccasionThumb = ({ src, alt }) => {
  const [failed, setFailed] = useState(false)
  if (failed || !src) {
    return (
      <div className="w-full aspect-[4/3] rounded-xl bg-[#F3E4C8] flex items-center justify-center">
        <svg className="w-8 h-8 text-[#B8860B]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M20 12v10H4V12M2 7h20v5H2V7zM12 22V7M12 7C10.5 7 8 6 8 4a2.5 2.5 0 015 0c0-1.5 1.5-2 2.5-2A2 2 0 0117.5 4c0 2-2.5 3-5.5 3z" />
        </svg>
      </div>
    )
  }
  return <img src={src} alt={alt} className="w-full aspect-[4/3] object-cover rounded-xl" onError={() => setFailed(true)} />
}

const GiftsIndex = () => {
  const [occasions, setOccasions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosInstance
      .get('/gift-occasions')
      .then(({ data }) => setOccasions(data))
      .catch(() => setOccasions([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Navbar />
      <section className="bg-[#FBF9F2] min-h-screen pb-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto pt-12">
          <p className="text-xs font-semibold text-[#B8860B] tracking-[0.22em] uppercase mb-3 text-center">
            House of Toshali
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-[#3d2a1a] mb-3 text-center">
            Gifting Collection
          </h1>
          <p className="text-[#6b5940] text-sm text-center max-w-xl mx-auto mb-12">
            Curated dry fruit hampers for every occasion — pick the one that fits your moment.
          </p>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-[#F3E4C8] aspect-[4/3] animate-pulse" />
              ))}
            </div>
          ) : occasions.length === 0 ? (
            <p className="text-sm text-[#a89c8a] text-center py-10">No gift occasions available right now.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              {occasions.map((item) => (
                <Link
                  key={item._id}
                  to={`/gifts/${item.slug}`}
                  className="group flex flex-col items-center gap-3 bg-white rounded-2xl border border-[#3d2a1a]/10 p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <OccasionThumb src={item.image} alt={item.title} />
                  <span className="text-sm font-bold text-[#3d2a1a] text-center group-hover:text-[#B8860B] transition-colors">
                    {item.title}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default GiftsIndex