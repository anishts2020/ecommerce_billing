import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { ASSET_BASE_URL } from "../api/api";
import Layout from "../components/Layout";
import TopSellersCard from "../components/TopSellersCard";
import Carousel from "../components/Carousal.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import HeroVideoCarousel from "../components/HeroVideoCarousal.jsx";
import useCart from "../hooks/useCart.js";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const [occasionalProducts, setOccasionalProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const { addItem } = useCart();
  const navigate = useNavigate();

  /* ---------- FETCH PRODUCTS ---------- */
  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];

        const formatted = list.map((p) => ({
          id: p.product_id,
          product_code: p.product_code,
          name: p.product_name,
          price: p.selling_price,
          image: p.product_image
            ? `${ASSET_BASE_URL}/product_images/${p.product_image}`
            : "/fallback-image.png",
          new_arrivals: p.new_arrivals,
          top_sellers: p.top_sellers,
          occational_products: p.occational_products,
          featured_products: p.featured_products,
          color_id: p.color_id,
          size_id: p.size_id,
        }));

        setProducts(formatted);
        setTopSellers(formatted.filter((p) => p.top_sellers === 1).slice(0, 6));
        setOccasionalProducts(
          formatted.filter((p) => p.occational_products === 1).slice(0, 6)
        );
        setFeaturedProducts(
          formatted.filter((p) => p.featured_products === 1).slice(0, 6)
        );
      })
      .catch(console.error);
  }, []);

  /* ---------- ACTIONS ---------- */
  const addToCart = (product) => {
    addItem(product);
  };

  const handleProductClick = (p) => {
    navigate(`/product/${p.product_code}?color=${p.color_id}&size=${p.size_id}`);
  };

  const newArrivals = products.filter((p) => p.new_arrivals === 1);

  return (
    <Layout>
      <HeroVideoCarousel />

      {/* NEW ARRIVALS */}
      <section className="mt-10">
        <SectionHeading
          small="Fresh & just launched"
          big="NEW ARRIVALS"
          underline="/sell.png"
        />
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {newArrivals.slice(0, 6).map((p) => (
            <TopSellersCard
              key={p.id}
              product={p}
              badge="New Arrival"
              onAddToCart={addToCart}
              onClick={() => handleProductClick(p)}
            />
          ))}
        </div>
      </section>

      {/* TOP SELLERS */}
      <section className="mt-16">
        <SectionHeading
          small="Check out our bestsellers"
          big="TOP SELLERS"
          underline="/sell.png"
        />
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {topSellers.map((p) => (
            <TopSellersCard
              key={p.id}
              product={p}
              badge="Top Seller"
              onAddToCart={addToCart}
              onClick={() => handleProductClick(p)}
            />
          ))}
        </div>
      </section>

      <Carousel />

      {/* OCCASIONAL */}
      <section className="mt-16">
        <SectionHeading
          small="Perfect for special occasions"
          big="OCCASIONAL PRODUCTS"
          underline="/sell.png"
        />
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {occasionalProducts.map((p) => (
            <TopSellersCard
              key={p.id}
              product={p}
              badge="Occasional"
              onAddToCart={addToCart}
              onClick={() => handleProductClick(p)}
            />
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="mt-16 mb-20">
        <SectionHeading
          small="Handpicked favorites"
          big="FEATURED PRODUCTS"
          underline="/sell.png"
        />
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {featuredProducts.map((p) => (
            <TopSellersCard
              key={p.id}
              product={p}
              badge="Featured"
              onAddToCart={addToCart}
              onClick={() => handleProductClick(p)}
            />
          ))}
        </div>
      </section>
    </Layout>
  );
}