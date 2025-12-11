// Home.jsx
import { useEffect, useState } from "react";
import api, { BASE_URL } from "../api/api";
import ProductCard from "../components/ProductCard";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/products")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data.data || [];

        // include both id and product_id so downstream code is unambiguous
        const formatted = list.map((p) => ({
          id: p.product_id,
          product_id: p.product_id,
          name: p.product_name,
          price: p.selling_price,
          image: `${BASE_URL.replace("/api", "")}/product_images/${p.product_image}`,
        }));

        setProducts(formatted);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
      });
  }, []);
  const addToCart = async (product) => {
    try {
      let cartId = sessionStorage.getItem("cart_id");
  
      // Generate if missing or invalid
      if (!cartId || isNaN(Number(cartId))) {
        cartId = Date.now().toString();  // always valid number string
        sessionStorage.setItem("cart_id", cartId);
      }
  
      const payload = {
        cart_id: Number(cartId),
        product_id: product.product_id ?? product.id,
      };
  
      console.log("DEBUG PAYLOAD:", payload);
  
      const res = await api.post("/cart/add", payload);
      console.log("Cart Added:", res.data);
  
      alert("Added to cart");
    } catch (err) {
      console.error("FAILED:", err.response?.data || err);
    }
  };
  
  

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">Products</h2>

        <button
          onClick={() => navigate("/cart")}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
        >
          View Cart 🛒
        </button>

        {products.length === 0 ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
