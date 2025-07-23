
import React from "react"
import { Bell, Menu, UserCircle } from "lucide-react"

export const Navbar = ({ onToggleSidebar }) => {
  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-4">
        <button className="md:hidden" onClick={onToggleSidebar}>
          <Menu className="w-6 h-6 text-[#6B4226]" />
        </button>
        <h1 className="text-xl font-bold text-[#6B4226] hidden md:block">Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        <UserCircle className="w-8 h-8 text-[#6B4226]" />
      </div>
    </header>
  )
}
