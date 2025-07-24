import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertTriangle, Pencil, Trash2, Plus, Search, Download, DollarSign, Package, Percent, Calendar, AlertCircle } from "lucide-react"
import { Sidebar } from "../components/Sidebar"
import { Navbar } from "../components/Navbar"

// Waste presets by category
const wastePresets = {
  "Dairy": 8,
  "Syrups": 3,
  "Coffee": 5,
  "Baked Goods": 12,
  "Fresh Items": 15,
  "Dry Goods": 2,
  "Beverages": 4
}

const supplierOptions = [
  "Main Supplier",
  "Local Dairy",
  "Wholesaler",
  "Flavor Co.",
  "Sweet Syrups Inc.",
  "Coffee Roasters Ltd",
  "Fresh Foods Co"
]

const unitOptions = [
  "ml", "L", "g", "kg", "each", "oz", "lb", "cup", "tsp", "tbsp"
]

const categoryOptions = Object.keys(wastePresets)

// Mock data
const initialIngredients = [
  { 
    id: 1,
    name: "Oat Milk", 
    category: "Dairy",
    unit: "L", 
    purchase_price: 3.20,
    package_size: 1,
    waste_percent: 8, 
    supplier: "Local Dairy",
    last_updated: "2025-01-15",
    cost_per_ml: 0.00344,
    cost_per_unit: 3.44,
    stock_level: 25
  },
  { 
    id: 2,
    name: "Coffee Beans (Arabica)", 
    category: "Coffee",
    unit: "kg", 
    purchase_price: 24.50,
    package_size: 1,
    waste_percent: 5, 
    supplier: "Coffee Roasters Ltd",
    last_updated: "2025-01-18",
    cost_per_gram: 0.02573,
    cost_per_unit: 25.73,
    stock_level: 12
  },
  { 
    id: 3,
    name: "Vanilla Syrup", 
    category: "Syrups",
    unit: "ml", 
    purchase_price: 8.90,
    package_size: 500,
    waste_percent: 3, 
    supplier: "Flavor Co.",
    last_updated: "2025-01-10",
    cost_per_ml: 0.01834,
    cost_per_unit: 0.01834,
    stock_level: 8
  },
  { 
    id: 4,
    name: "Lavender Flowers (Edible)", 
    category: "Fresh Items",
    unit: "g", 
    purchase_price: 15.00,
    package_size: 50,
    waste_percent: 15, 
    supplier: "Fresh Foods Co",
    last_updated: "2025-01-12",
    cost_per_gram: 0.345,
    cost_per_unit: 0.345,
    stock_level: 3
  },
  { 
    id: 5,
    name: "Honey", 
    category: "Syrups",
    unit: "ml", 
    purchase_price: 12.00,
    package_size: 400,
    waste_percent: 3, 
    supplier: "Local Supplier",
    last_updated: "2025-01-14",
    cost_per_ml: 0.0309,
    cost_per_unit: 0.0309,
    stock_level: 15
  },
  { 
    id: 6,
    name: "Whipped Cream", 
    category: "Dairy",
    unit: "ml", 
    purchase_price: 4.50,
    package_size: 250,
    waste_percent: 8, 
    supplier: "Local Dairy",
    last_updated: "2025-01-16",
    cost_per_ml: 0.01944,
    cost_per_unit: 0.01944,
    stock_level: 6
  }
]

export default function BusyFoolIngredients() {
  const [ingredients, setIngredients] = useState(initialIngredients)
  const [filteredIngredients, setFilteredIngredients] = useState(initialIngredients)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState(null)
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state for add/edit modal
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unit: "",
    purchase_price: "",
    package_size: "",
    waste_percent: "",
    supplier: "",
    stock_level: ""
  })

  // Calculate costs including waste
  const calculateCosts = (purchasePrice, packageSize, wastePercent, unit) => {
    const wasteMultiplier = 1 + (wastePercent / 100)
    const baseCost = purchasePrice / (packageSize || 1)
    const trueCost = baseCost * wasteMultiplier
    
    return {
      cost_per_unit: trueCost,
      cost_per_ml: unit === "L" ? trueCost / 1000 : trueCost,
      cost_per_gram: unit === "kg" ? trueCost / 1000 : trueCost
    }
  }

  // Filter and search logic
  useEffect(() => {
    let filtered = ingredients.filter(ingredient =>
      ingredient.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === "all" || ingredient.category === selectedCategory)
    )

    filtered.sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]
      
      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      
      return sortOrder === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1)
    })

    setFilteredIngredients(filtered)
  }, [search, selectedCategory, ingredients, sortBy, sortOrder])

  // Form validation
  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = "Name is required"
    if (!formData.category) errors.category = "Category is required"
    if (!formData.purchase_price || formData.purchase_price <= 0) 
      errors.purchase_price = "Valid purchase price is required"
    if (formData.package_size && formData.package_size <= 0) 
      errors.package_size = "Package size must be positive"
    if (formData.waste_percent && formData.waste_percent < 0) 
      errors.waste_percent = "Waste percentage cannot be negative"
    if (formData.stock_level && formData.stock_level < 0) 
      errors.stock_level = "Stock level cannot be negative"
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate async operation

    const costs = calculateCosts(
      parseFloat(formData.purchase_price),
      parseFloat(formData.package_size) || 1,
      parseFloat(formData.waste_percent) || wastePresets[formData.category] || 5,
      formData.unit
    )

    const newIngredient = {
      id: editingIngredient ? editingIngredient.id : Date.now(),
      name: formData.name.trim(),
      category: formData.category,
      unit: formData.unit,
      purchase_price: parseFloat(formData.purchase_price),
      package_size: parseFloat(formData.package_size) || 1,
      waste_percent: parseFloat(formData.waste_percent) || wastePresets[formData.category] || 5,
      supplier: formData.supplier,
      stock_level: parseInt(formData.stock_level) || 0,
      last_updated: new Date().toISOString().split('T')[0],
      ...costs
    }

    if (editingIngredient) {
      setIngredients(prev => prev.map(ing => ing.id === editingIngredient.id ? newIngredient : ing))
    } else {
      setIngredients(prev => [...prev, newIngredient])
    }

    setIsSubmitting(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      unit: "",
      purchase_price: "",
      package_size: "",
      waste_percent: "",
      supplier: "",
      stock_level: ""
    })
    setFormErrors({})
    setShowAddModal(false)
    setEditingIngredient(null)
  }

  const handleEdit = (ingredient) => {
    setEditingIngredient(ingredient)
    setFormData({
      name: ingredient.name,
      category: ingredient.category,
      unit: ingredient.unit,
      purchase_price: ingredient.purchase_price.toString(),
      package_size: ingredient.package_size.toString(),
      waste_percent: ingredient.waste_percent.toString(),
      supplier: ingredient.supplier,
      stock_level: ingredient.stock_level.toString()
    })
    setShowAddModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this ingredient?")) {
      setIsSubmitting(true)
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate async operation
      setIngredients(prev => prev.filter(ing => ing.id !== id))
      setIsSubmitting(false)
    }
  }

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      category,
      waste_percent: wastePresets[category]?.toString() || ""
    }))
  }

  const getStockStatus = (level) => {
    if (level <= 5) return { color: "destructive", text: "Low Stock", icon: AlertTriangle }
    if (level <= 10) return { color: "default", text: "Medium", icon: AlertCircle }
    return { color: "secondary", text: "Good", icon: Package }
  }

  const exportToCSV = async () => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate async operation
    const headers = ["Name", "Category", "Unit", "Purchase Price", "Package Size", "Waste %", "Supplier", "Cost per Unit", "Stock Level"]
    const csvContent = [
      headers.join(","),
      ...ingredients.map(ing => [
        ing.name,
        ing.category,
        ing.unit,
        ing.purchase_price,
        ing.package_size,
        ing.waste_percent,
        ing.supplier,
        ing.cost_per_unit.toFixed(4),
        ing.stock_level
      ].join(","))
    ].join("\n")
    
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "busy-fool-ingredients.csv"
    a.click()
    URL.revokeObjectURL(url)
    setIsSubmitting(false)
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } }
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br bg-white ">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="md:pl-64 flex flex-col min-h-screen">
          <Navbar onToggleSidebar={() => setSidebarOpen(true)} />
          
          <main className="flex-1 p-4 sm:p-6 space-y-6">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
              >
                <div>
                  <h1 className="text-3xl font-bold text-amber-900 tracking-tight">Ingredient Management</h1>
                  <p className="text-amber-700 mt-1 text-sm">Optimize your coffee shop's inventory with ease</p>
                </div>
                <div className="flex gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        onClick={exportToCSV} 
                        disabled={isSubmitting}
                        className="border-amber-300 hover:bg-amber-100 transition-all duration-200 hover:shadow-md"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {isSubmitting ? "Exporting..." : "Export"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Export inventory to CSV</TooltipContent>
                  </Tooltip>
                  <Button 
                    onClick={() => setShowAddModal(true)} 
                    className="bg-gradient-to-r from-[#6B4226] to-[#5a3620] text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all shadow-sm"
                    disabled={isSubmitting}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Ingredient
                  </Button>
                </div>
              </motion.div>

              {/* Stats Cards */}
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
              >
                {[
                  { icon: Package, color: "green", label: "Total Ingredients", value: ingredients.length },
                  { icon: AlertTriangle, color: "red", label: "Low Stock", value: ingredients.filter(ing => ing.stock_level <= 5).length },
                  { icon: Percent, color: "amber", label: "Avg Waste", value: `${(ingredients.reduce((sum, ing) => sum + ing.waste_percent, 0) / ingredients.length).toFixed(1)}%` },
                  { icon: DollarSign, color: "blue", label: "Total Value", value: `$${ingredients.reduce((sum, ing) => sum + (ing.purchase_price * ing.stock_level), 0).toFixed(0)}` }
                ].map((stat) => (
                  <motion.div key={stat.label} variants={cardVariants}>
                    <Card className="bg-white/80 backdrop-blur-md hover:shadow-lg transition-all duration-300 border-amber-100">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <motion.div 
                            className={`p-3 bg-${stat.color}-100 rounded-full`}
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                          </motion.div>
                          <div>
                            <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                            <p className="text-xl font-semibold text-amber-900">{stat.value}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Filters - Sticky on Mobile */}
              <Card className="mb-6 bg-white/90 backdrop-blur-md sticky top-0 z-10 border-amber-100">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-4 h-4" />
                        <Input
                          placeholder="Search ingredients..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="pl-10 border-amber-200 focus:ring-amber-500 transition-all duration-200 hover:border-amber-300"
                        />
                      </div>
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full sm:w-48 border-amber-200 focus:ring-amber-500">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categoryOptions.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full sm:w-40 border-amber-200 focus:ring-amber-500">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="cost_per_unit">Cost</SelectItem>
                        <SelectItem value="waste_percent">Waste %</SelectItem>
                        <SelectItem value="stock_level">Stock</SelectItem>
                      </SelectContent>
                    </Select>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 border border-amber-200 rounded-md hover:bg-amber-100 transition-all duration-200"
                      onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    >
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </motion.button>
                  </div>
                </CardContent>
              </Card>

              {/* Desktop Table */}
              <Card className="hidden lg:block bg-white/90 backdrop-blur-md border-amber-100">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-amber-100/50 border-b sticky top-0 z-10">
                        <tr>
                          {["Ingredient", "Category", "True Cost", "Waste %", "Stock", "Supplier", "Actions"].map(header => (
                            <th key={header} className="text-left p-4 font-semibold text-amber-900 tracking-tight">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence>
                          {filteredIngredients.map((ingredient) => {
                            const stockStatus = getStockStatus(ingredient.stock_level)
                            const StockIcon = stockStatus.icon
                            
                            return (
                              <motion.tr 
                                key={ingredient.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="border-b hover:bg-amber-50/30 transition-all duration-200"
                              >
                                <td className="p-4">
                                  <div className="font-medium text-gray-900">{ingredient.name}</div>
                                  <div className="text-xs text-gray-500">Per {ingredient.unit}</div>
                                </td>
                                <td className="p-4">
                                  <Badge variant="outline" className="border-amber-300 text-amber-700 font-medium">{ingredient.category}</Badge>
                                </td>
                                <td className="p-4">
                                  <div className="font-medium text-green-700">${ingredient.cost_per_unit.toFixed(4)}</div>
                                  <div className="text-xs text-gray-500">Base: ${(ingredient.purchase_price / ingredient.package_size).toFixed(4)}</div>
                                </td>
                                <td className="p-4">
                                  <Badge variant={ingredient.waste_percent > 10 ? "destructive" : ingredient.waste_percent > 5 ? "default" : "secondary"}>
                                    {ingredient.waste_percent}%
                                  </Badge>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <StockIcon className={`w-4 h-4 text-${stockStatus.color}-600`} />
                                    <span className="font-medium">{ingredient.stock_level}</span>
                                    <Badge variant={stockStatus.color} className="text-xs">{stockStatus.text}</Badge>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="text-sm text-gray-600">{ingredient.supplier}</div>
                                  <div className="text-xs text-gray-400">
                                    <Calendar className="w-3 h-3 inline mr-1" />
                                    {ingredient.last_updated}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="flex justify-center gap-2">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleEdit(ingredient)}
                                            disabled={isSubmitting}
                                            className="hover:bg-amber-100"
                                          >
                                            <Pencil className="w-4 h-4 text-amber-600" />
                                          </Button>
                                        </motion.div>
                                      </TooltipTrigger>
                                      <TooltipContent>Edit ingredient</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleDelete(ingredient.id)}
                                            disabled={isSubmitting}
                                            className="hover:bg-red-100"
                                          >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                          </Button>
                                        </motion.div>
                                      </TooltipTrigger>
                                      <TooltipContent>Delete ingredient</TooltipContent>
                                    </Tooltip>
                                  </div>
                                </td>
                              </motion.tr>
                            )
                          })}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                <AnimatePresence>
                  {filteredIngredients.map((ingredient) => {
                    const stockStatus = getStockStatus(ingredient.stock_level)
                    const StockIcon = stockStatus.icon
                    
                    return (
                      <motion.div
                        key={ingredient.id}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        <Card className="bg-white/90 backdrop-blur-md hover:shadow-lg transition-all duration-300 border-amber-100">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-semibold text-gray-900 text-lg">{ingredient.name}</h3>
                                <Badge variant="outline" className="text-xs mt-1 border-amber-300 text-amber-700">{ingredient.category}</Badge>
                              </div>
                              <div className="flex gap-2">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                      <Button size="sm" variant="ghost" onClick={() => handleEdit(ingredient)} disabled={isSubmitting}>
                                        <Pencil className="w-4 h-4 text-amber-600" />
                                      </Button>
                                    </motion.div>
                                  </TooltipTrigger>
                                  <TooltipContent>Edit</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                      <Button size="sm" variant="ghost" onClick={() => handleDelete(ingredient.id)} disabled={isSubmitting}>
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                      </Button>
                                    </motion.div>
                                  </TooltipTrigger>
                                  <TooltipContent>Delete</TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">True Cost:</span>
                                <div className="font-semibold text-green-700">${ingredient.cost_per_unit.toFixed(4)}</div>
                              </div>
                              <div>
                                <span className="text-gray-500">Waste:</span>
                                <Badge variant={ingredient.waste_percent > 10 ? "destructive" : ingredient.waste_percent > 5 ? "default" : "secondary"}>
                                  {ingredient.waste_percent}%
                                </Badge>
                              </div>
                              <div>
                                <span className="text-gray-500">Stock:</span>
                                <div className="flex items-center gap-2">
                                  <StockIcon className={`w-4 h-4 text-${stockStatus.color}-600`} />
                                  <span className="font-medium">{ingredient.stock_level}</span>
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-500">Supplier:</span>
                                <div className="font-medium truncate">{ingredient.supplier}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>

              {/* Add/Edit Modal */}
              <AnimatePresence>
                {showAddModal && (
                  <Dialog open={showAddModal} onOpenChange={(open) => !open && resetForm()}>
                    <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-md border-amber-100">
                      <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <DialogHeader>
                          <DialogTitle className="text-amber-900 text-xl tracking-tight">
                            {editingIngredient ? "Edit Ingredient" : "Add New Ingredient"}
                          </DialogTitle>
                          <DialogDescription className="text-gray-600">
                            {editingIngredient ? "Update ingredient details" : "Add a new ingredient with waste-aware costing"}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-5 py-4">
                          <div>
                            <Label htmlFor="name" className="text-amber-900 font-medium">Name *</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="e.g., Oat Milk"
                              className={`mt-1 ${formErrors.name ? "border-red-500" : "border-amber-200 focus:ring-amber-500"} transition-all duration-200`}
                            />
                            {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                          </div>
                          
                          <div>
                            <Label htmlFor="category" className="text-amber-900 font-medium">Category *</Label>
                            <Select value={formData.category} onValueChange={handleCategoryChange}>
                              <SelectTrigger className={`mt-1 ${formErrors.category ? "border-red-500" : "border-amber-200 focus:ring-amber-500"}`}>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categoryOptions.map(cat => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {formErrors.category && <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="unit" className="text-amber-900 font-medium">Unit</Label>
                              <Select value={formData.unit} onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}>
                                <SelectTrigger className="mt-1 border-amber-200 focus:ring-amber-500">
                                  <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                                <SelectContent>
                                  {unitOptions.map(unit => (
                                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="package_size" className="text-amber-900 font-medium">Package Size</Label>
                              <Input
                                id="package_size"
                                type="number"
                                step="0.01"
                                value={formData.package_size}
                                onChange={(e) => setFormData(prev => ({ ...prev, package_size: e.target.value }))}
                                placeholder="1"
                                className={`mt-1 ${formErrors.package_size ? "border-red-500" : "border-amber-200 focus:ring-amber-500"}`}
                              />
                              {formErrors.package_size && <p className="text-red-500 text-xs mt-1">{formErrors.package_size}</p>}
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="purchase_price" className="text-amber-900 font-medium">Purchase Price ($) *</Label>
                            <Input
                              id="purchase_price"
                              type="number"
                              step="0.01"
                              value={formData.purchase_price}
                              onChange={(e) => setFormData(prev => ({ ...prev, purchase_price: e.target.value }))}
                              placeholder="0.00"
                              className={`mt-1 ${formErrors.purchase_price ? "border-red-500" : "border-amber-200 focus:ring-amber-500"}`}
                            />
                            {formErrors.purchase_price && <p className="text-red-500 text-xs mt-1">{formErrors.purchase_price}</p>}
                          </div>
                          
                          <div>
                            <Label htmlFor="waste_percent" className="text-amber-900 font-medium">
                              Waste % 
                              {formData.category && wastePresets[formData.category] && (
                                <span className="text-sm text-gray-500 ml-1">
                                  (Default: {wastePresets[formData.category]}%)
                                </span>
                              )}
                            </Label>
                            <Input
                              id="waste_percent"
                              type="number"
                              step="0.1"
                              value={formData.waste_percent}
                              onChange={(e) => setFormData(prev => ({ ...prev, waste_percent: e.target.value }))}
                              placeholder="5"
                              className={`mt-1 ${formErrors.waste_percent ? "border-red-500" : "border-amber-200 focus:ring-amber-500"}`}
                            />
                            {formErrors.waste_percent && <p className="text-red-500 text-xs mt-1">{formErrors.waste_percent}</p>}
                          </div>
                          
                          <div>
                            <Label htmlFor="supplier" className="text-amber-900 font-medium">Supplier</Label>
                            <Select value={formData.supplier} onValueChange={(value) => setFormData(prev => ({ ...prev, supplier: value }))}>
                              <SelectTrigger className="mt-1 border-amber-200 focus:ring-amber-500">
                                <SelectValue placeholder="Select supplier" />
                              </SelectTrigger>
                              <SelectContent>
                                {supplierOptions.map(supplier => (
                                  <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="stock_level" className="text-amber-900 font-medium">Current Stock Level</Label>
                            <Input
                              id="stock_level"
                              type="number"
                              value={formData.stock_level}
                              onChange={(e) => setFormData(prev => ({ ...prev, stock_level: e.target.value }))}
                              placeholder="0"
                              className={`mt-1 ${formErrors.stock_level ? "border-red-500" : "border-amber-200 focus:ring-amber-500"}`}
                            />
                            {formErrors.stock_level && <p className="text-red-500 text-xs mt-1">{formErrors.stock_level}</p>}
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button 
                              variant="outline" 
                              onClick={resetForm}
                              className="border-amber-300 hover:bg-amber-100 transition-all duration-200"
                              disabled={isSubmitting}
                            >
                              Cancel
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button 
                              onClick={handleSubmit} 
                              className="bg-amber-600 hover:bg-amber-700 transition-all duration-200"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Processing..." : editingIngredient ? "Update" : "Add"} Ingredient
                            </Button>
                          </motion.div>
                        </DialogFooter>
                      </motion.div>
                    </DialogContent>
                  </Dialog>
                )}
              </AnimatePresence>

              {/* Floating Action Button for Mobile */}
              <div className="lg:hidden fixed bottom-6 right-6 z-20">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Button
                        onClick={() => setShowAddModal(true)}
                        className="rounded-full w-14 h-14 p-0 bg-amber-600 hover:bg-amber-700 shadow-xl transition-all duration-200"
                        disabled={isSubmitting}
                      >
                        <Plus className="w-6 h-6 text-white" />
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>Add new ingredient</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}