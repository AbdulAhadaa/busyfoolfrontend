import React, { useState, useEffect } from "react"; // Fixed capitalization
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Coffee, 
  Edit,
  Trash2,
  Eye,
  Calculator,
  ChevronDown,
  DollarSign,
  Package,
  Target,
  Zap,
  ArrowRight,
  BarChart3,
  Sparkles,
  AlertCircle,
  CheckCircle,
  X,
  MoreHorizontal,
  RefreshCw,
  Star,
  Flame,
  ArrowUpRight
} from "lucide-react";

export default function Products() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("margin");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showIngredients, setShowIngredients] = useState({});
  const [viewMode, setViewMode] = useState("cards"); // cards or table
  const [showQuickWins, setShowQuickWins] = useState(true);

  // Sample products data based on the brief
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Rose Latte",
      category: "Coffee",
      sellPrice: 4.50,
      totalCost: 4.97,
      marginPercent: -10.4,
      marginAmount: -0.47,
      status: "losing money",
      sales: 87,
      trending: "hot",
      avgRating: 4.8,
      ingredients: [
        { name: "Espresso", quantity: 30, unit: "ml", cost: 0.45 },
        { name: "Oat Milk", quantity: 200, unit: "ml", cost: 0.68 },
        { name: "Rose Syrup", quantity: 15, unit: "ml", cost: 1.20 },
        { name: "Edible Rose Petals", quantity: 2, unit: "each", cost: 0.40 },
        { name: "Whipped Cream", quantity: 30, unit: "g", cost: 0.25 }
      ],
      quickWin: "Remove edible petals to save £0.40 per drink"
    },
    {
      id: 2,
      name: "Cold Brew",
      category: "Coffee",
      sellPrice: 4.20,
      totalCost: 1.35,
      marginPercent: 67.9,
      marginAmount: 2.85,
      status: "profitable",
      sales: 143,
      trending: "rising",
      avgRating: 4.6,
      ingredients: [
        { name: "Cold Brew Coffee", quantity: 250, unit: "ml", cost: 1.20 },
        { name: "Simple Syrup", quantity: 10, unit: "ml", cost: 0.15 }
      ]
    },
    {
      id: 3,
      name: "Lavender Honey Oat Latte",
      category: "Coffee",
      sellPrice: 5.00,
      totalCost: 5.23,
      marginPercent: -4.6,
      marginAmount: -0.23,
      status: "losing money",
      sales: 52,
      trending: "stable",
      avgRating: 4.9,
      ingredients: [
        { name: "Espresso", quantity: 30, unit: "ml", cost: 0.45 },
        { name: "Oat Milk", quantity: 200, unit: "ml", cost: 0.68 },
        { name: "Lavender Syrup", quantity: 15, unit: "ml", cost: 0.90 },
        { name: "Honey", quantity: 10, unit: "ml", cost: 0.25 },
        { name: "Edible Lavender", quantity: 1, unit: "each", cost: 0.30 }
      ],
      quickWin: "Increase price by £1.00 to achieve 15% margin"
    },
    {
      id: 4,
      name: "Ham & Cheese Toastie",
      category: "Food",
      sellPrice: 6.50,
      totalCost: 3.20,
      marginPercent: 50.8,
      marginAmount: 3.30,
      status: "profitable",
      sales: 76,
      trending: "stable",
      avgRating: 4.4,
      ingredients: [
        { name: "Sourdough Bread", quantity: 2, unit: "slices", cost: 0.80 },
        { name: "Ham", quantity: 50, unit: "g", cost: 1.20 },
        { name: "Cheddar Cheese", quantity: 30, unit: "g", cost: 0.90 },
        { name: "Butter", quantity: 10, unit: "g", cost: 0.30 }
      ]
    },
    {
      id: 5,
      name: "Vanilla Latte",
      category: "Coffee",
      sellPrice: 4.30,
      totalCost: 1.85,
      marginPercent: 57.0,
      marginAmount: 2.45,
      status: "profitable",
      sales: 94,
      trending: "stable",
      avgRating: 4.5,
      ingredients: [
        { name: "Espresso", quantity: 30, unit: "ml", cost: 0.45 },
        { name: "Whole Milk", quantity: 200, unit: "ml", cost: 0.50 },
        { name: "Vanilla Syrup", quantity: 15, unit: "ml", cost: 0.35 }
      ]
    }
  ]);

  const categories = ["all", "Coffee", "Food", "Iced Drinks", "Pastries"];
  const statuses = ["all", "profitable", "breaking even", "losing money"];

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === "all" || product.category === filterCategory) &&
      (filterStatus === "all" || product.status === filterStatus)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "margin":
          return b.marginPercent - a.marginPercent;
        case "sales":
          return b.sales - a.sales;
        case "price":
          return b.sellPrice - a.sellPrice;
        case "name":
          return a.name.localeCompare(b.name);
        case "impact":
          return Math.abs(b.marginAmount * b.sales) - Math.abs(a.marginAmount * a.sales);
        default:
          return 0;
      }
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "profitable":
        return "text-green-700 bg-green-100 border-green-200";
      case "breaking even":
        return "text-yellow-700 bg-yellow-100 border-yellow-200";
      case "losing money":
        return "text-red-700 bg-red-100 border-red-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getMarginIcon = (marginPercent) => {
    if (marginPercent > 50) return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (marginPercent > 0) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (marginPercent < 0) return <AlertCircle className="w-5 h-5 text-red-600" />;
    return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
  };

  const getTrendingIcon = (trending) => {
    switch (trending) {
      case "hot":
        return <Flame className="w-4 h-4 text-orange-500" />;
      case "rising":
        return <ArrowUpRight className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const toggleIngredients = (productId) => {
    setShowIngredients(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const losingMoneyProducts = products.filter(p => p.status === "losing money");
  const totalDailyLoss = losingMoneyProducts.reduce((acc, p) => acc + (Math.abs(p.marginAmount) * p.sales), 0);

  const QuickWinsAlert = () => {
    if (!showQuickWins || losingMoneyProducts.length === 0) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 mb-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full -mr-16 -mt-16 opacity-20"></div>
        <button
          onClick={() => setShowQuickWins(false)}
          className="absolute top-3 right-3 p-1 hover:bg-red-100 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-red-600" />
        </button>
        
        <div className="flex items-start gap-3">
          <div className="bg-red-100 p-2 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-red-800 mb-1">⚠️ Urgent: Products Losing Money</h3>
            <p className="text-red-700 text-sm mb-3">
              You're losing <span className="font-bold">£{totalDailyLoss.toFixed(2)}</span> daily from {losingMoneyProducts.length} products
            </p>
            <div className="flex flex-wrap gap-2">
              {losingMoneyProducts.slice(0, 2).map((product) => (
                <div key={product.id} className="bg-white rounded-lg p-3 border border-red-200 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-gray-800">{product.name}</span>
                    <span className="text-red-600 font-bold text-sm">-£{Math.abs(product.marginAmount).toFixed(2)}</span>
                  </div>
                  {product.quickWin && (
                    <p className="text-xs text-gray-600 mb-2">{product.quickWin}</p>
                  )}
                  <button className="bg-red-600 text-white text-xs px-3 py-1 rounded-full hover:bg-red-700 transition-colors">
                    Fix Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const EnhancedProductCard = ({ product }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
    >
      <div className="relative">
        <div className={`h-2 ${product.status === 'profitable' ? 'bg-green-400' : product.status === 'losing money' ? 'bg-red-400' : 'bg-yellow-400'}`}></div>
        
        <div className="p-6 pb-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-xl text-gray-900 group-hover:text-[#6B4226] transition-colors">
                  {product.name}
                </h3>
                {getTrendingIcon(product.trending)}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {product.category}
                </span>
                {product.avgRating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600">{product.avgRating}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-1">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
              >
                <Eye className="w-4 h-4 text-gray-600" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors opacity-0 group-hover:opacity-100"              >
                <Edit className="w-4 h-4 text-gray-600" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-600" />
              </motion.button>
            </div>
          </div>

          <div className="mb-4">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(product.status)}`}>
              {getMarginIcon(product.marginPercent)}
              {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200 rounded-full -mr-8 -mt-8 opacity-30"></div>
              <DollarSign className="w-5 h-5 text-blue-600 mb-2" />
              <p className="text-xs font-medium text-blue-800 mb-1">Sell Price</p>
              <p className="text-xl font-bold text-blue-900">£{product.sellPrice.toFixed(2)}</p>
            </div>
            
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-100 rounded-xl p-4 border border-orange-200">
              <div className="absolute top-0 right-0 w-16 h-16 bg-orange-200 rounded-full -mr-8 -mt-8 opacity-30"></div>
              <Package className="w-5 h-5 text-orange-600 mb-2" />
              <p className="text-xs font-medium text-orange-800 mb-1">Total Cost</p>
              <p className="text-xl font-bold text-orange-900">£{product.totalCost.toFixed(2)}</p>
            </div>
          </div>

          <div className="relative bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getMarginIcon(product.marginPercent)}
                <span className="font-bold text-gray-800">Profit Margin</span>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Sales Today</p>
                <div className="flex items-center gap-1">
                  <BarChart3 className="w-3 h-3 text-gray-400" />
                  <span className="font-bold text-sm text-gray-700">{product.sales}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-end justify-between">
              <div>
                <p className={`text-3xl font-bold ${product.marginPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.marginPercent > 0 ? '+' : ''}{product.marginPercent.toFixed(1)}%
                </p>
                <p className="text- sm text-gray-600">
                  £{product.marginAmount > 0 ? '+' : ''}{product.marginAmount.toFixed(2)} per sale
                </p>
              </div>
              
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(0, Math.min(100, (product.marginPercent + 20) * 1.25))}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className={`h-full rounded-full ${product.marginPercent >= 0 ? 'bg-green-400' : 'bg-red-400'}`}
                />
              </div>
            </div>
          </div>

          <div className={`rounded-xl p-4 mb-4 border-2 ${
            product.marginAmount >= 0 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
              : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className={`w-5 h-5 ${product.marginAmount >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                <span className="font-bold text-sm text-gray-800">Today's Impact</span>
              </div>
              <div className="text-right">
                <p className={`font-bold text-2xl ${product.marginAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  £{product.marginAmount >= 0 ? '+' : ''}{(product.marginAmount * product.sales).toFixed(2)}
                </p>
                <p className="text-xs text-gray-600">
                  {product.sales} × £{product.marginAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {product.quickWin && product.status === "losing money" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4"
            >
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-yellow-800 mb-1">Quick Win</p>
                  <p className="text-sm text-yellow-700">{product.quickWin}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <motion.button
          onClick={() => toggleIngredients(product.id)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors border-t border-gray-100"
          whileHover={{ backgroundColor: "#f9fafb" }}
        >
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-700">
              Ingredients ({product.ingredients.length})
            </span>
          </div>
          <motion.div
            animate={{ rotate: showIngredients[product.id] ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {showIngredients[product.id] && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              Milano
              transition={{ duration: 0.3 }}
              className="border-t border-gray-100"
            >
              <div className="p-4 space-y-2">
                {product.ingredients.map((ingredient, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#6B4226] rounded-full"></div>
                      <div>
                        <span className="font-medium text-sm text-gray-800">{ingredient.name}</span>
                        <p className="text-xs text-gray-500">
                          {ingredient.quantity}{ingredient.unit}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-[#6B4226] bg-[#6B4226]/5 px-2 py-1 rounded">
                      £{ingredient.cost.toFixed(2)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-2">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#6B4226] text-white py-3 px-4 rounded-xl text-sm font-semibold hover:bg-[#5a3620] transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
            >
              <Calculator className="w-4 h-4" />
              What-If
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white text-gray-700 py-3 px-4 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2 border border-gray-200 shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Clone
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Moved TableView component before the return statement
  const TableView = ({ products }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-700">Product</th>
              <th className="text-left p-4 font-semibold text-gray-700">Category</th>
              <th className="text-right p-4 font-semibold text-gray-700">Price</th>
              <th className="text-right p-4 font-semibold text-gray-700">Cost</th>
              <th className="text-right p-4 font-semibold text-gray-700">Margin</th>
              <th className="text-center p-4 font-semibold text-gray-700">Sales</th>
              <th className="text-right p-4 font-semibold text-gray-700">Impact</th>
              <th className="text-center p-4 font-semibold text-gray-700">Status</th>
              <th className="text-center p-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      product.status === 'profitable' ? 'bg-green-400' : 
                      product.status === 'losing money' ? 'bg-red-400' : 'bg-yellow-400'
                    }`}></div>
                    <div>
                      <p className="font-semibold text-gray-900">{product.name}</p>
                      {product.trending && (
                        <div className="flex items-center gap-1 mt-1">
                          {getTrendingIcon(product.trending)}
                          <span className="text-xs text-gray-500 capitalize">{product.trending}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
                    {product.category}
                  </span>
                </td>
                <td className="p-4 text-right font-semibold text-gray-900">
                  £{product.sellPrice.toFixed(2)}
                </td>
                <td className="p-4 text-right font-semibold text-orange-600">
                  £{product.totalCost.toFixed(2)}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {getMarginIcon(product.marginPercent)}
                    <span className={`font-bold ${product.marginPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.marginPercent > 0 ? '+' : ''}{product.marginPercent.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 text-right">
                    £{product.marginAmount > 0 ? '+' : ''}{product.marginAmount.toFixed(2)}
                  </p>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <BarChart3 className="w-3 h-3 text-gray-400" />
                    <span className="font-semibold text-gray-700">{product.sales}</span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <span className={`font-bold text-lg ${product.marginAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    £{product.marginAmount >= 0 ? '+' : ''}{(product.marginAmount * product.sales).toFixed(2)}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(product.status)}`}>
                    {getMarginIcon(product.marginPercent)}
                    {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FAF8F5] via-white to-[#F5F3F0] overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col w-full md:ml-64">
        <Navbar onToggleSidebar={() => setSidebarOpen(true)} />
        
        <main className="p-4 sm:p-6 space-y-6 overflow-x-hidden w-full min-h-screen">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#6B4226] to-[#8B4513] bg-clip-text text-transparent">
                Products
              </h1>
              <p className="text-gray-600 text-sm mt-1">Smart margin tracking for your coffee shop</p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-gray-700 px-4 py-2 rounded-xl flex items-center gap-2 border border-gray-200 hover:border-gray-300 transition-all shadow-sm"
              >
                <Filter className="w-4 h-4" />
                Filters
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddProduct(true)}
                className="bg-gradient-to-r from-[#6B4226] to-[#5a3620] text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </motion.button>
            </div>
          </motion.div>

          <QuickWinsAlert />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {[
              { 
                icon: Coffee, 
                label: "Total Products", 
                value: products.length, 
                color: "from-[#6B4226] to-[#5a3620]",
                bgColor: "from-[#6B4226]/10 to-[#5a3620]/10",
                change: "+2 this week"
              },
              { 
                icon: TrendingUp, 
                label: "Profitable", 
                value: products.filter(p => p.status === "profitable").length, 
                color: "from-green-600 to-green-700",
                bgColor: "from-green-50 to-emerald-50",
                change: "+1 today"
              },
              { 
                icon: AlertCircle, 
                label: "Losing Money", 
                value: products.filter(p => p.status === "losing money").length, 
                color: "from-red-600 to-red-700",
                bgColor: "from-red-50 to-pink-50",
                change: "Fix these!"
              },
              { 
                icon: BarChart3, 
                label: "Avg Margin", 
                value: `${(products.reduce((acc, p) => acc + p.marginPercent, 0) / products.length).toFixed(1)}%`, 
                color: "from-blue-600 to-blue-700",
                bgColor: "from-blue-50 to-indigo-50",
                change: "+2.3% vs yesterday"
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -2 }}
                className={`bg-gradient-to-br ${stat.bgColor} p-5 rounded-2xl shadow-sm border border-white/50 hover:shadow-md transition-all`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-gray-500 bg-white/50 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products, ingredients, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6B4226] focus:border-transparent transition-all placeholder-gray-400 text-sm"
                />
              </div>
              
              <div className="flex gap-3 flex-wrap lg:flex-nowrap">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6B4226] focus:border-transparent text-sm min-w-[140px] bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6B4226] focus:border-transparent text-sm min-w-[130px] bg-white"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status === "all" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6B4226] focus:border-transparent text-sm min-w-[140px] bg-white"
                >
                  <option value="margin">Sort by Margin</option>
                  <option value="sales">Sort by Sales</option>
                  <option value="price">Sort by Price</option>
                  <option value="name">Sort by Name</option>
                  <option value="impact">Sort by Impact</option>
                </select>
                
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("cards")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      viewMode === "cards" 
                        ? "bg-white text-[#6B4226] shadow-sm" 
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Cards
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      viewMode === "table" 
                        ? "bg-white text-[#6B4226] shadow-sm" 
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Table
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {viewMode === "cards" ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <EnhancedProductCard key={product.id} product={product} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <TableView products={filteredProducts} />
          )}

          {filteredProducts.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white rounded-2xl border border-gray-100"
            >
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Coffee className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm || filterCategory !== "all" || filterStatus !== "all" 
                  ? "Try adjusting your search terms or filters to find what you're looking for."
                  : "Start by adding your first product to track margins and optimize profitability."
                }
              </p>
              <div className="flex gap-3 justify-center">
                {(searchTerm || filterCategory !== "all" || filterStatus !== "all") && (
                  <button 
                    onClick={() => {
                      setSearchTerm("");
                      setFilterCategory("all");
                      setFilterStatus("all");
                    }}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Clear Filters
                  </button>
                )}
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="bg-gradient-to-r from-[#6B4226] to-[#5a3620] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-medium flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Product
                </button>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}