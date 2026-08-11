import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'
import logo from '../../assets/images/logo.png'

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Products',
    href: '/admin/products',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    label: 'Orders',
    href: '/admin/orders',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M9 2h6l1 4H8l1-4z" />
        <path d="M5 6h14l-1 14H6L5 6z" />
      </svg>
    ),
  },
  {
    label: 'Bulk Orders',
    href: '/admin/bulk-orders',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M4 5h16M4 12h16M4 19h16" />
      </svg>
    ),
  },
]

const AdminLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { admin, logout } = useAdminAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false) // mobile drawer
  const [collapsed, setCollapsed] = useState(false)      // desktop squeeze

  useEffect(() => {
    const saved = localStorage.getItem('adminSidebarCollapsed')
    if (saved === 'true') setCollapsed(true)
  }, [])

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      localStorage.setItem('adminSidebarCollapsed', String(!prev))
      return !prev
    })
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const isActive = (href) =>
    href === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(href)

  const pageTitle = navItems.find((n) => isActive(n.href))?.label || 'Admin'

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 bg-[#2b1d14] text-white flex flex-col shadow-2xl lg:shadow-none transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? 'lg:w-20' : 'lg:w-64'} w-64
        `}
      >
        {/* Brand + collapse toggle */}
        <div className={`flex items-center gap-3 px-5 py-6 border-b border-white/10 ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}>
          <div className="bg-white rounded-xl p-1.5 flex-shrink-0">
            <img src={logo} alt="House of Toshali" className="h-8 w-auto object-contain" />
          </div>
          <div className={`min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
            <p className="font-serif text-sm leading-tight truncate">House of Toshali</p>
            <p className="text-[10px] text-white/50 tracking-wide uppercase">Admin Panel</p>
          </div>
        </div>

        {/* Desktop collapse toggle — floats on the sidebar edge */}
        <button
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden lg:flex absolute -right-3 top-[4.25rem] w-6 h-6 rounded-full bg-[#D4AF37] text-[#2b1d14] items-center justify-center shadow-md hover:scale-110 hover:bg-[#c49f2e] transition-all z-10"
        >
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto overflow-x-hidden">
          <p className={`text-[10px] font-bold text-white/30 uppercase tracking-wider px-3 mb-2 transition-opacity ${collapsed ? 'lg:hidden' : ''}`}>
            Menu
          </p>
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                title={collapsed ? item.label : undefined}
                className={`group relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all
                  ${collapsed ? 'lg:justify-center' : ''}
                  ${active
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#c49f2e] text-[#2b1d14] shadow-lg shadow-[#D4AF37]/25'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className={`whitespace-nowrap ${collapsed ? 'lg:hidden' : ''}`}>{item.label}</span>

                {/* Tooltip when collapsed (desktop only) */}
                {collapsed && (
                  <span className="hidden lg:group-hover:flex absolute left-full ml-3 items-center whitespace-nowrap bg-[#2b1d14] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg z-20">
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer: profile + logout */}
        <div className="px-3 py-5 border-t border-white/10">
          <div className={`flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-white/5 ${collapsed ? 'lg:justify-center' : ''}`}>
            <span className="w-9 h-9 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#2b1d14] font-bold text-sm flex-shrink-0">
              {admin?.name?.charAt(0) || 'A'}
            </span>
            <div className={`min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
              <p className="text-xs font-semibold text-white truncate">{admin?.name || 'Admin'}</p>
              <p className="text-[10px] text-white/50 truncate">{admin?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title={collapsed ? 'Sign Out' : undefined}
            className={`group relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-red-500/15 hover:text-red-300 transition-colors w-full ${collapsed ? 'lg:justify-center' : ''}`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            <span className={collapsed ? 'lg:hidden' : ''}>Sign Out</span>

            {collapsed && (
              <span className="hidden lg:group-hover:flex absolute left-full ml-3 items-center whitespace-nowrap bg-[#2b1d14] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg z-20">
                Sign Out
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content — squeezes based on collapsed state */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <header className="bg-white/90 backdrop-blur-sm border-b border-[#3d2a1a]/10 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-[#3d2a1a] w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#F3E4C8] transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h2 className="text-sm font-bold text-[#3d2a1a]">{pageTitle}</h2>
              <p className="hidden sm:block text-[11px] text-[#a89c8a]">Manage your {pageTitle.toLowerCase()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-sm text-[#6b5940]">
              <span className="font-semibold text-[#3d2a1a]">{admin?.email}</span>
            </span>
            <span className="w-9 h-9 rounded-full bg-[#F3E4C8] flex items-center justify-center text-[#B8860B] font-bold text-sm ring-2 ring-[#D4AF37]/20">
              {admin?.name?.charAt(0) || 'A'}
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout