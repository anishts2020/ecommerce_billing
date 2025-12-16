import { useEffect, useState } from "react";
import api, { ASSET_BASE_URL } from "../api/api";
import Layout from "../components/Layout";
import TopSellersCard from "../components/TopSellersCard";
import SectionHeading from "../components/SectionHeading.jsx";
import useCart from "../hooks/useCart.js";

export default function OccasionalProducts() {
  const [products, setProducts] = useState([]);
  const { addItem } = useCart();

  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data.data || [];
        const formatted = list.map((p) => ({
          id: p.product_id ?? p.id ?? p.product_code,
          name: p.product_name,
          price: p.selling_price,
          image: `${ASSET_BASE_URL}/product_images/${p.product_image}`,
          occational_products: p.occational_products,
        }));
        setProducts(formatted);
      })
      .catch((err) => console.error(err));
  }, []);

  const addToCart = (product) => addItem(product);

  const filtered = products.filter((p) => p.occational_products === 1);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <SectionHeading
          small="Perfect for special occasions"
          big="OCCASIONAL PRODUCTS"
          underline="/sell.png"
        />
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <TopSellersCard
              key={p.id}
              product={p}
              onAddToCart={addToCart}
              badge="Occasional"
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
