import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Pencil, Trash2, Plus, Search, Upload, Download, DollarSign, Package, Percent, User, Calendar, TrendingUp, AlertCircle } from "lucide-react"
import { Sidebar } from "../components/Sidebar"
import { Navbar } from "../components/Navbar"

// Waste presets by category as mentioned in the brief
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

// Mock data based on coffee shop ingredients from the brief
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
    cost_per_ml: 0.00344, // calculated with waste
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
    const baseCost = purchasePrice / packageSize
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

    // Sort functionality
    filtered.sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]
      
      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      
      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    setFilteredIngredients(filtered)
  }, [search, selectedCategory, ingredients, sortBy, sortOrder])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.purchase_price) {
      alert("Please fill in all required fields")
      return
    }

    const costs = calculateCosts(
      parseFloat(formData.purchase_price),
      parseFloat(formData.package_size) || 1,
      parseFloat(formData.waste_percent) || wastePresets[formData.category] || 5,
      formData.unit
    )

    const newIngredient = {
      id: editingIngredient ? editingIngredient.id : Date.now(),
      name: formData.name,
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

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this ingredient?")) {
      setIngredients(prev => prev.filter(ing => ing.id !== id))
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

  const exportToCSV = () => {
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
  }

  return (
      <div className="min-h-screen bg-white">
   
  <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    <div className="md:pl-64 flex flex-col min-h-screen">
      <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

      <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">

    <div className="min-h-screen bg-gradient-to-br bg-white p-4">
     
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-amber-900 mb-2">Ingredient Management</h1>
            <p className="text-amber-700">Track costs, waste, and margins for your coffee shop</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportToCSV} className="hidden sm:flex">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => setShowAddModal(true)} className="bg-amber-900 hover:bg-amber-800">
              <Plus className="w-4 h-4 mr-2" />
              Add Ingredient
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Ingredients</p>
                  <p className="text-2xl font-bold text-gray-900">{ingredients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Low Stock</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {ingredients.filter(ing => ing.stock_level <= 5).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Percent className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Waste</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(ingredients.reduce((sum, ing) => sum + ing.waste_percent, 0) / ingredients.length).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${ingredients.reduce((sum, ing) => sum + (ing.purchase_price * ing.stock_level), 0).toFixed(0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-white/80 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search ingredients..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
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
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="cost_per_unit">Cost</SelectItem>
                  <SelectItem value="waste_percent">Waste %</SelectItem>
                  <SelectItem value="stock_level">Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Desktop Table */}
        <Card className="hidden lg:block bg-white/90 backdrop-blur">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-amber-100/50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-amber-900">Ingredient</th>
                    <th className="text-left p-4 font-semibold text-amber-900">Category</th>
                    <th className="text-left p-4 font-semibold text-amber-900">True Cost</th>
                    <th className="text-left p-4 font-semibold text-amber-900">Waste %</th>
                    <th className="text-left p-4 font-semibold text-amber-900">Stock</th>
                    <th className="text-left p-4 font-semibold text-amber-900">Supplier</th>
                    <th className="text-center p-4 font-semibold text-amber-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIngredients.map((ingredient, index) => {
                    const stockStatus = getStockStatus(ingredient.stock_level)
                    const StockIcon = stockStatus.icon
                    
                    return (
                      <tr key={ingredient.id} className={`border-b hover:bg-amber-50/50 transition-colors ${index % 2 === 0 ? 'bg-white/50' : 'bg-amber-25/25'}`}>
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-gray-900">{ingredient.name}</div>
                            <div className="text-xs text-gray-500">Per {ingredient.unit}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="text-xs">{ingredient.category}</Badge>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-green-700">
                            ${ingredient.cost_per_unit.toFixed(4)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Base: ${(ingredient.purchase_price / ingredient.package_size).toFixed(4)}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant={ingredient.waste_percent > 10 ? "destructive" : ingredient.waste_percent > 5 ? "default" : "secondary"}>
                            {ingredient.waste_percent}%
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <StockIcon className="w-4 h-4" />
                            <span className="font-medium">{ingredient.stock_level}</span>
                            <Badge variant={stockStatus.color} className="text-xs">
                              {stockStatus.text}
                            </Badge>
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
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(ingredient)}
                              className="hover:bg-amber-100"
                            >
                              <Pencil className="w-4 h-4 text-amber-700" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(ingredient.id)}
                              className="hover:bg-red-100"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {filteredIngredients.map((ingredient) => {
            const stockStatus = getStockStatus(ingredient.stock_level)
            const StockIcon = stockStatus.icon
            
            return (
              <Card key={ingredient.id} className="bg-white/90 backdrop-blur hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{ingredient.name}</h3>
                      <Badge variant="outline" className="text-xs mt-1">{ingredient.category}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(ingredient)}>
                        <Pencil className="w-4 h-4 text-amber-700" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(ingredient.id)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">True Cost:</span>
                      <div className="font-semibold text-green-700">${ingredient.cost_per_unit.toFixed(4)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Waste:</span>
                      <div>
                        <Badge variant={ingredient.waste_percent > 10 ? "destructive" : ingredient.waste_percent > 5 ? "default" : "secondary"}>
                          {ingredient.waste_percent}%
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Stock:</span>
                      <div className="flex items-center gap-2">
                        <StockIcon className="w-4 h-4" />
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
            )
          })}
        </div>

        {/* Add/Edit Modal */}
        <Dialog open={showAddModal} onOpenChange={(open) => !open && resetForm()}>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingIngredient ? "Edit Ingredient" : "Add New Ingredient"}
              </DialogTitle>
              <DialogDescription>
                {editingIngredient ? "Update ingredient information" : "Add a new ingredient with waste-aware costing"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Oat Milk"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={formData.unit} onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {unitOptions.map(unit => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="package_size">Package Size</Label>
                  <Input
                    id="package_size"
                    type="number"
                    step="0.01"
                    value={formData.package_size}
                    onChange={(e) => setFormData(prev => ({ ...prev, package_size: e.target.value }))}
                    placeholder="1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="purchase_price">Purchase Price ($) *</Label>
                <Input
                  id="purchase_price"
                  type="number"
                  step="0.01"
                  value={formData.purchase_price}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchase_price: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <Label htmlFor="waste_percent">
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
                />
              </div>
              
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Select value={formData.supplier} onValueChange={(value) => setFormData(prev => ({ ...prev, supplier: value }))}>
                  <SelectTrigger>
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
                <Label htmlFor="stock_level">Current Stock Level</Label>
                <Input
                  id="stock_level"
                  type="number"
                  value={formData.stock_level}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock_level: e.target.value }))}
                  placeholder="0"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-amber-900 hover:bg-amber-800">
                {editingIngredient ? "Update" : "Add"} Ingredient
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Floating Action Button for Mobile */}
        <div className="lg:hidden fixed bottom-6 right-6">
          <Button
            onClick={() => setShowAddModal(true)}
            className="rounded-full w-14 h-14 p-0 bg-amber-900 hover:bg-amber-800 shadow-2xl"
          >
            <Plus className="w-6 h-6 text-white" />
          </Button>
        </div>
      </div>
    </div>
  </main>
    </div>
  </div>
  )
}