import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { ASSET_BASE_URL } from "../api/api";
import TopSellersCard from "../components/TopSellersCard";
import Layout from "../components/Layout";
import useCart from "../hooks/useCart.js";
import Carousel from "../components/Carousal.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import FullWidthCarousel from "../components/FullWidthCarousal.jsx";
import HeroVideoCarousel from "../components/HeroVideoCarousal.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const [occasionalProducts, setOccasionalProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { addItem } = useCart();
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

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
          image: `${ASSET_BASE_URL}/product_images/${p.product_image}`,
          sold: p.total_sold ?? 0,
          new_arrivals: p.new_arrivals,
          top_sellers: p.top_sellers,
          occational_products: p.occational_products,
          featured_products: p.featured_products,
        }));

        // ✅ Always keep products as array
        setProducts(formatted);

        // Filter top sellers
        setTopSellers(formatted.filter((p) => p.top_sellers === 1).slice(0, 6));

        // Filter occasional products
        setOccasionalProducts(formatted.filter((p) => p.occational_products === 1).slice(0, 6));

        // Filter featured products
        setFeaturedProducts(formatted.filter((p) => p.featured_products === 1).slice(0, 6));
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
      });
  }, []);

  const addToCart = (product) => {
    addItem(product);
    setToast({
      show: true,
      message: `${product.name} added to cart`,
      type: "success",
    });
    setTimeout(() => setToast((s) => ({ ...s, show: false })), 1500);
  };

  // Filter new arrivals dynamically
  const newArrivals = products.filter((p) => p.new_arrivals === 1);

  return (
    <Layout>
      {/* 🎡 Carousel */}
      <HeroVideoCarousel />

      <div className="max-w-6xl mx-auto px-4 py-6 mt-6 mb-2">

        {/* 🆕 NEW ARRIVALS */}
        <div className="relative mb-10">
          <SectionHeading
            small="Fresh & just launched"
            big="NEW ARRIVALS"
            underline="/sell.png"
          />
          <Link
            to="/new-arrivals"
            className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-700 hover:text-black transition"
          >
            View All →
          </Link>
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {newArrivals.slice(0, 6).map((p) => (
            <TopSellersCard
              key={p.id}
              product={p}
              onAddToCart={addToCart}
              badge="New Arrival"
            />
          ))}
        </div>

        {/* ⭐ TOP SELLERS */}
        <div className="relative mt-16 mb-10">
          <SectionHeading
            small="Check out our bestsellers"
            big="TOP SELLERS"
            underline="/sell.png"
          />
          <Link
            to="/top-sellers"
            className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-700 hover:text-black transition"
          >
            View All →
          </Link>
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {topSellers.map((p) => (
            <TopSellersCard
              key={p.id}
              product={p}
              onAddToCart={addToCart}
              badge="Top Seller"
            />
          ))}
        </div>

        <Carousel />

        {/* 🎉 OCCASIONAL PRODUCTS */}
        <div className="relative mt-16 mb-10">
          <SectionHeading
            small="Perfect for special occasions"
            big="OCCASIONAL PRODUCTS"
            underline="/sell.png"
          />
          <Link
            to="/occasional-products"
            className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-700 hover:text-black transition"
          >
            View All →
          </Link>
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {occasionalProducts.map((p) => (
            <TopSellersCard
              key={p.id}
              product={p}
              onAddToCart={addToCart}
              badge="Occasional"
            />
          ))}
        </div>

        {/* 🌟 FEATURED PRODUCTS */}
        <div className="relative mt-16 mb-10">
          <SectionHeading
            small="Handpicked favorites"
            big="FEATURED PRODUCTS"
            underline="/sell.png"
          />
          <Link
            to="/featured-products"
            className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-700 hover:text-black transition"
          >
            View All →
          </Link>
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {featuredProducts.map((p) => (
            <TopSellersCard
              key={p.id}
              product={p}
              onAddToCart={addToCart}
              badge="Featured"
            />
          ))}
        </div>
      </div>

      {/* <FullWidthCarousel/> */}

      {/* 🔔 TOAST */}
      <div className={`toast ${toast.show ? "show" : ""}`}>
        {toast.message}
      </div>
    </Layout>
  );
}
