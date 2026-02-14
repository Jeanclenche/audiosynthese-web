import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import OrderForm from './pages/OrderForm'
import OrderConfirmation from './pages/OrderConfirmation'
import Contact from './pages/Contact'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/produits" element={<Catalog />} />
            <Route path="/produits/:category" element={<Catalog />} />
            <Route path="/produit/:id" element={<ProductDetail />} />
            <Route path="/panier" element={<Cart />} />
            <Route path="/commander" element={<OrderForm />} />
            <Route path="/confirmation" element={<OrderConfirmation />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}
