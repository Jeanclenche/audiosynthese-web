import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/ui/ProtectedRoute'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import OrderForm from './pages/OrderForm'
import OrderConfirmation from './pages/OrderConfirmation'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Account from './pages/Account'
import Orders from './pages/Orders'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/produits" element={<Catalog />} />
              <Route path="/produits/:category" element={<Catalog />} />
              <Route path="/produit/:id" element={<ProductDetail />} />
              <Route path="/panier" element={<Cart />} />
              <Route path="/commander" element={<ProtectedRoute><OrderForm /></ProtectedRoute>} />
              <Route path="/confirmation" element={<OrderConfirmation />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/connexion" element={<Login />} />
              <Route path="/inscription" element={<Register />} />
              <Route path="/mon-compte" element={<ProtectedRoute><Account /></ProtectedRoute>} />
              <Route path="/mes-commandes" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
