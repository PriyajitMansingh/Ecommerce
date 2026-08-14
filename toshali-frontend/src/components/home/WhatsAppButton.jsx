import React from 'react'

const WHATSAPP_NUMBER = '919560771457' // country code + number, no + or spaces
const DEFAULT_MESSAGE = "Hi! I'm interested in House of Toshali's premium dry fruits."

const WhatsAppButton = () => {
  const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 group"
    >
      {/* Pulsing ring for attention, subtle not distracting */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping" />

      <span className="relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe5a] flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.04 2c-5.5 0-10 4.5-10 10 0 1.8.5 3.5 1.3 4.9L2 22l5.3-1.4c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10s-4.4-9.8-9.96-9.8zm5.8 14.1c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-.9-.3-1.6-.6-2.7-1.2-4.5-3.9-4.6-4.1-.1-.2-1.1-1.4-1.1-2.7s.7-1.9 1-2.2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4.2.5.7 1.7.7 1.8.1.2.1.3 0 .5-.1.2-.2.3-.3.5-.2.2-.3.3-.5.5-.2.2-.4.4-.2.7.3.5 1 1.4 1.9 2.1 1 .9 1.8 1.2 2.2 1.4.3.1.5.1.6-.1.2-.2.6-.7.8-1 .2-.2.4-.3.6-.2.2.1 1.5.7 1.7.8.2.1.4.2.4.3.1.2.1.7-.1 1.3z" />
        </svg>
      </span>

      {/* Tooltip on hover — desktop only */}
      <span className="hidden md:block absolute right-16 top-1/2 -translate-y-1/2 bg-[#3d2a1a] text-white text-xs font-medium px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none shadow-lg">
        Chat with us
        <span className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-[#3d2a1a] rotate-45" />
      </span>
    </a>
  )
}

export default WhatsAppButton