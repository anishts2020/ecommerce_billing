import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { BASE_URL } from "../api/api";
import ProductCard from "../components/ProductCard";
import TopSellersCard from "../components/TopSellersCard";
import Layout from "../components/Layout";
import useCart from "../hooks/useCart.js";
import Carousel from "../components/Carousal.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const { addItem } = useCart();
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];

        const formatted = list.map((p) => ({
          id: p.product_id ?? p.id ?? p.product_code,
          name: p.product_name,
          price: p.selling_price,
          image: `${BASE_URL.replace("/api", "")}/product_images/${p.product_image}`,
          stock: Number(p.min_stock_level),  
        }));

        setProducts(formatted);

        const top = [...formatted]
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 6);

        setTopSellers(top);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
      });
  }, []);

  const addToCart = (product) => {
    addItem(product);
    setToast({ show: true, message: `${product.name} added to cart`, type: "success" });
    setTimeout(() => setToast((s) => ({ ...s, show: false })), 1500);
  };

  return (
    <Layout>
      <Carousel />

      <div className="max-w-6xl mx-auto px-4 py-6 mt-6 mb-2">

        {/* ⭐ TOP SELLERS SECTION */}
        <div className="relative mb-10">
          <SectionHeading
            small="Check out our Featured today!"
            big="FEATURED PRODUCTS"
            underline="/product.png"
          />

          <Link
            to="/top-sellers"
            className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-700 hover:text-black transition"
          >
            View All →
          </Link>
        </div>

        {topSellers.length === 0 ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {topSellers.map((p) => (
              <TopSellersCard
                key={p.id}
                product={p}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}

        {/* ⭐ ALL PRODUCTS SECTION */}
        <div className="relative mt-16 mb-10">
          <SectionHeading
            small="Browse our collection"
            big="PRODUCTS"
            underline="/decor-arrow.png"
          />
          <Link
            to="/products"
            className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-700 hover:text-black transition"
          >
            View All →
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>

      <div className={`toast ${toast.show ? "show" : ""}`}>
        {toast.message}
      </div>
    </Layout>
  );
}
