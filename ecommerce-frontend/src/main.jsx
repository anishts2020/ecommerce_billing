import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CartProvider from './context/CartProvider.jsx'
import "@fontsource/montserrat"; 
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>,
)
