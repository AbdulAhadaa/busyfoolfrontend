import { BrowserRouter, Routes, Route } from "react-router-dom"
import Signup from "./pages/SignUp"
import Login from "./pages/Login"
import Ingredients from "./pages/Ingredients"
import Welcome from "./pages/Welcome"
import Products from "./pages/Products"
import Analytics from "./pages/Analytics"

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Welcome />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
             <Route path="/ingredients" element={<Ingredients />} />
              <Route path="/welcome" element={<Welcome />} />
                       <Route path="/products" element={<Products />} />
                        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
