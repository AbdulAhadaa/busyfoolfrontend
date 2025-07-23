import React, { useState } from "react"
import { Sidebar } from "../components/Sidebar"
import { Navbar } from "../components/Navbar"
import { motion } from "framer-motion"
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Coffee, 
  DollarSign,
  Trash2,
  BarChart3,
  Calendar,
  Package,
  Target,
  Eye,
  ChevronRight
} from "lucide-react"

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d")
  const [selectedCategory, setSelectedCategory] = useState("all")
const [sidebarOpen, setSidebarOpen] = useState(false)

  // Mock data based on the brief
  const periods = [
    { id: "1d", label: "Today" },
    { id: "7d", label: "7 Days" },
    { id: "30d", label: "30 Days" },
    { id: "90d", label: "3 Months" }
  ]

  const categories = [
    { id: "all", label: "All Products" },
    { id: "coffee", label: "Coffee" },
    { id: "iced", label: "Iced Drinks" },
    { id: "toasties", label: "Toasties" }
  ]

  const keyMetrics = {
    totalRevenue: 8647,
    totalCosts: 6234,
    trueProfit: 2413,
    avgMargin: 27.9,
    wasteValue: 184,
    lostOpportunity: 312
  }

  const topLosers = [
    { name: "Rose Latte", lossPerUnit: 0.47, unitsSold: 87, totalLoss: 40.89, trend: "up" },
    { name: "Lavender Honey Oat", lossPerUnit: 0.23, unitsSold: 52, totalLoss: 11.96, trend: "steady" },
    { name: "Matcha Cloud", lossPerUnit: 0.15, unitsSold: 34, totalLoss: 5.10, trend: "down" }
  ]

  const topWinners = [
    { name: "Cold Brew", profitPerUnit: 4.20, unitsSold: 143, totalProfit: 600.60, margin: 76 },
    { name: "Vanilla Latte", profitPerUnit: 3.80, unitsSold: 94, totalProfit: 357.20, margin: 68 },
    { name: "Americano", profitPerUnit: 2.95, unitsSold: 156, totalProfit: 460.20, margin: 82 }
  ]

  const wasteAnalysis = [
    { ingredient: "Oat Milk", purchased: "40L", used: "30L", wasted: "10L", wasteValue: 45, wastePercent: 25 },
    { ingredient: "Rose Syrup", purchased: "2L", used: "1.3L", wasted: "0.7L", wasteValue: 28, wastePercent: 35 },
    { ingredient: "Edible Flowers", purchased: "100g", used: "65g", wasted: "35g", wasteValue: 42, wastePercent: 35 }
  ]

  const missingRecipes = [
    { name: "Maple Oat Latte", sales: 23, estimatedLoss: 0.30 },
    { name: "Cinnamon Cloud", sales: 18, estimatedLoss: 0.25 },
    { name: "Honey Americano", sales: 12, estimatedLoss: 0.20 }
  ]

  return (
     <div className="flex min-h-screen bg-[#FAF8F5] overflow-hidden">
    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

    <div className="md:pl-64 flex flex-col w-full min-h-screen">
      <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

      <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
    <div className="min-h-screen bg-[#FAF8F5] p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#6B4226] mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Deep insights into your coffee shop's true performance</p>
      </div>

      {/* Period & Category Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-1 bg-white p-1 rounded-lg shadow-sm">
          {periods.map(period => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                selectedPeriod === period.id 
                  ? "bg-[#6B4226] text-white" 
                  : "text-[#6B4226] hover:bg-[#6B4226]/10"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
        
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-[#6B4226] focus:outline-none focus:ring-2 focus:ring-[#6B4226]/20"
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Key Metrics Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8"
      >
        {[
          { label: "Total Revenue", value: keyMetrics.totalRevenue, icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Costs", value: keyMetrics.totalCosts, icon: Package, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "True Profit", value: keyMetrics.trueProfit, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
          { label: "Avg Margin", value: `${keyMetrics.avgMargin}%`, icon: Target, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Waste Value", value: keyMetrics.wasteValue, icon: Trash2, color: "text-red-600", bg: "bg-red-50" },
          { label: "Lost Opportunity", value: keyMetrics.lostOpportunity, icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-50" }
        ].map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-4 rounded-xl shadow-sm"
          >
            <div className={`w-10 h-10 ${metric.bg} rounded-lg flex items-center justify-center mb-3`}>
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
            </div>
            <p className="text-xs text-gray-500 mb-1">{metric.label}</p>
            <p className={`text-lg font-bold ${metric.color}`}>
              {typeof metric.value === 'number' ? `£${metric.value.toLocaleString()}` : metric.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Top Money Losers */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#6B4226] flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-500" />
              Money Losers
            </h2>
            <span className="text-sm text-gray-500">Per unit loss</span>
          </div>
          
          <div className="space-y-3">
            {topLosers.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100"
              >
                <div className="flex-1">
                  <p className="font-semibold text-[#6B4226]">{item.name}</p>
                  <p className="text-xs text-gray-600">{item.unitsSold} sold • £{item.totalLoss} total loss</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">-£{item.lossPerUnit}</p>
                  <div className={`text-xs flex items-center gap-1 ${
                    item.trend === 'up' ? 'text-red-500' : item.trend === 'down' ? 'text-green-500' : 'text-gray-500'
                  }`}>
                    {item.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : 
                     item.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : <div className="w-3 h-3" />}
                    {item.trend}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2 text-[#6B4226] font-medium hover:bg-[#6B4226]/5 rounded-lg transition flex items-center justify-center gap-2">
            View All Losing Products <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Top Money Winners */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#6B4226] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Top Performers
            </h2>
            <span className="text-sm text-gray-500">Per unit profit</span>
          </div>
          
          <div className="space-y-3">
            {topWinners.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100"
              >
                <div className="flex-1">
                  <p className="font-semibold text-[#6B4226]">{item.name}</p>
                  <p className="text-xs text-gray-600">{item.unitsSold} sold • {item.margin}% margin</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">+£{item.profitPerUnit}</p>
                  <p className="text-xs text-green-600">£{item.totalProfit} total</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2 text-[#6B4226] font-medium hover:bg-[#6B4226]/5 rounded-lg transition flex items-center justify-center gap-2">
            View All Profitable Products <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      {/* Waste Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#6B4226] flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-orange-500" />
            Waste Analysis
          </h2>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Waste Value</p>
            <p className="text-lg font-bold text-orange-600">£{keyMetrics.wasteValue}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wasteAnalysis.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 border border-orange-100 rounded-lg bg-orange-50/50"
            >
              <h3 className="font-semibold text-[#6B4226] mb-2">{item.ingredient}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Purchased:</span>
                  <span className="font-medium">{item.purchased}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Used:</span>
                  <span className="font-medium">{item.used}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wasted:</span>
                  <span className="font-medium text-orange-600">{item.wasted} ({item.wastePercent}%)</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-orange-200">
                  <span className="text-gray-600">Waste Value:</span>
                  <span className="font-bold text-orange-600">£{item.wasteValue}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Missing Recipes Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <h2 className="text-xl font-semibold text-[#6B4226]">Missing Recipe Detection</h2>
        </div>
        
        <p className="text-gray-600 mb-4">Found products being sold without proper cost tracking:</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {missingRecipes.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
            >
              <h3 className="font-semibold text-[#6B4226] mb-2">{item.name}</h3>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-600">Sales found:</span>
                <span className="font-medium">{item.sales}</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-600">Est. loss each:</span>
                <span className="font-medium text-yellow-600">£{item.estimatedLoss}</span>
              </div>
              <button className="w-full py-2 bg-[#6B4226] text-white rounded-lg hover:bg-[#5a3620] transition flex items-center justify-center gap-2 text-sm">
                <Coffee className="w-4 h-4" />
                Add Recipe
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
     </main>
    </div>
  </div>
  )
}