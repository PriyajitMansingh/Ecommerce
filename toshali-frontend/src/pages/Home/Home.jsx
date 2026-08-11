import React from 'react'
import Hero from '../../components/home/Hero'
import HeroSlider from '../../components/home/HeroSlider'
import TrustBadgesStrip from '../../components/home/TrustBadgesStrip'
import CategoriesSection from '../../components/home/CategoriesSection'
import PromoCarousel from '../../components/home/PromoCarousel'
import BrandStorySection from '../../components/home/BrandStorySection'
import InfoCards from '../../components/home/InfoCards'
import ProductsSection from '../../components/home/ProductsSection'
import WhyChooseSection from '../../components/home/WhyChooseSection'
import UpcomingSection from '../../components/home/UpcomingSection'
import TestimonialsSection from '../../components/home/TestimonialsSection'

const Home = () => {
  return (
    <>
      {/* ===== DESIGN 1: Original Hero (static bowl + promo cards) ===== */}
      {/* <Hero /> */}

      {/* ===== DESIGN 2: New 5-image sliding Hero ===== */}
      <HeroSlider />

      <TrustBadgesStrip />
      <CategoriesSection />
      <PromoCarousel />
      <BrandStorySection />
      <InfoCards />
      <ProductsSection />
      <UpcomingSection />
      <WhyChooseSection />
      <TestimonialsSection />
    </>
  )
}

export default Home