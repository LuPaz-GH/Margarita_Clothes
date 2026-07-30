import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { AppRoutes } from './routes/AppRoutes'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <main>
          <AppRoutes />
        </main>
        <Footer />
      </CartProvider>
    </AuthProvider>
  )
}

export default App
