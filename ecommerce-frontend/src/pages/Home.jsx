import { useEffect, useState } from "react";
import api, { BASE_URL } from "../api/api";
import ProductCard from "../components/ProductCard";
import Layout from "../components/Layout";
import useCart from "../hooks/useCart.js";

export default function Home() {
  const [products, setProducts] = useState([]);
  const { addItem } = useCart();

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
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
      });
  }, []);

  const addToCart = (product) => {
    addItem(product);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">Products</h2>

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
    </Layout>
  );
}
