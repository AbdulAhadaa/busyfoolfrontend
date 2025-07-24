import React, { useState, useEffect } from "react"
import { Sidebar } from "../components/Sidebar"
import { Navbar } from "../components/Navbar"
import { motion } from "framer-motion"
import { ArrowDown, Sparkles, Coffee } from "lucide-react"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"

export default function Welcome() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("losing")
  const [currentSlide, setCurrentSlide] = useState(0)

  const [sliderRef, slider] = useKeenSlider({
    slides: { perView: 1.15, spacing: 12 },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    breakpoints: {
      "(min-width: 640px)": { slides: { perView: 2.2, spacing: 20 } },
      "(min-width: 1024px)": { slides: { perView: 3.2, spacing: 24 } },
    },
  })

  // Auto-slide logic
  useEffect(() => {
    if (!slider) return
    const interval = setInterval(() => {
      const next = (slider.track.details.rel + 1) % slider.track.details.slides.length
      slider.moveToIdx(next)
    }, 5000)
    return () => clearInterval(interval)
  }, [slider])

  const summary = {
    revenue: 1243,
    cost: 872,
    profit: 371,
  }

  const sections = {
    losing: [
      { name: "Espresso", loss: -0.35 },
      { name: "Mocha", loss: -0.21 },
    ],
    winners: [
      { name: "Flat White", profit: 0.7 },
      { name: "Cold Brew", profit: 0.55 },
    ],
    quickwins: [
      { name: "Reduce milk waste", tip: "Save 10p per latte" },
      { name: "Smaller cups", tip: "Less ingredient use" },
    ],
  }

  const suggestions = [
    { name: "Oat Latte", gain: "+0.25 profit" },
    { name: "Iced Matcha", gain: "+0.15 profit" },
  ]

  return (
    <div className="flex min-h-screen bg-[#FAF8F5] overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main content area with proper spacing for fixed sidebar */}
      <div className="flex-1 flex flex-col w-full md:ml-64">
        <Navbar onToggleSidebar={() => setSidebarOpen(true)} />
        
        <main className="p-4 sm:p-6 space-y-6 overflow-x-hidden w-full min-h-screen">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-[#6B4226]">Welcome back 👋</h1>
            <p className="text-gray-600 text-sm">Here's a quick glance at your coffee business today.</p>
          </div>

          {/* Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {[
              { label: "Revenue", value: summary.revenue, color: "text-[#6B4226]" },
              { label: "Cost", value: summary.cost, color: "text-orange-500" },
              { label: "Profit", value: summary.profit, color: "text-green-600" },
            ].map((item, i) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow text-center w-full">
                <p className="text-sm text-gray-500">{item.label}</p>
                <h3 className={`text-2xl font-bold ${item.color}`}>£{item.value}</h3>
                <motion.div
                  className="h-2 mt-3 rounded bg-gray-200 overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value / 15}%` }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                >
                  <div className={`h-full ${item.color} bg-opacity-80`} />
                </motion.div>
              </div>
            ))}
          </motion.div>

          {/* Tab Buttons */}
          <div className="flex gap-2 flex-wrap justify-between mt-4">
            {[
              { id: "losing", label: "Losing Money" },
              { id: "winners", label: "Your Winners" },
              { id: "quickwins", label: "Quick Wins" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-sm font-medium px-4 py-2 rounded-full transition ${
                  activeTab === tab.id
                    ? "bg-[#6B4226] text-white"
                    : "text-[#6B4226] hover:bg-[#eee]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Swipeable Cards */}
          <div ref={sliderRef} className="keen-slider w-full px-1">
            {sections[activeTab].map((item, idx) => (
              <div
                key={idx}
                className="keen-slider__slide bg-white p-4 mx-2 rounded-xl shadow flex justify-between items-center box-border min-w-0"
              >
                <div>
                  <p className="font-semibold text-[#6B4226]">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {activeTab === "losing"
                      ? "Loss per sale"
                      : activeTab === "winners"
                      ? "Profit per sale"
                      : item.tip}
                  </p>
                </div>
                <div>
                  {activeTab === "losing" && (
                    <div className="text-red-500 font-bold flex items-center gap-1">
                      <ArrowDown className="w-4 h-4" />
                      £{Math.abs(item.loss).toFixed(2)}
                    </div>
                  )}
                  {activeTab === "winners" && (
                    <div className="text-green-600 font-bold">
                      £{item.profit.toFixed(2)}
                    </div>
                  )}
                  {activeTab === "quickwins" && (
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          {slider && slider.track?.details && (
            <div className="relative h-2 bg-gray-200 rounded-full mt-4 overflow-hidden">
              <motion.div
                key={currentSlide}
                className="absolute top-0 left-0 h-full bg-[#6B4226]"
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    ((slider.track.details.rel + 1) / slider.track.details.slides.length) * 100
                  }%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}

          {/* Live Suggestions */}
          <div className="space-y-4 mt-8">
            <h3 className="text-lg font-semibold text-[#6B4226]">Live Product Suggestions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {suggestions.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="bg-white p-4 rounded-xl shadow flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-[#6B4226]">{s.name}</p>
                    <p className="text-sm text-green-600">{s.gain}</p>
                  </div>
                  <Coffee className="w-5 h-5 text-[#6B4226]" />
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}