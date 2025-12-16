import { useEffect, useState, useMemo } from "react";
import api, { ASSET_BASE_URL } from "../api/api";

import Layout from "../components/Layout";
import FilterSidebar from "../components/FilterSidebar";
import TopSellersCard from "../components/TopSellersCard";
import SectionHeading from "../components/SectionHeading";
import useCart from "../hooks/useCart";

export default function ProductsPage({
  title = "Products",
  subtitle = "Browse our collection",
  underline = "/sell.png",
  flagKey,
  badge,
}) {
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [categories, setCategories] = useState([]);
  const { addItem } = useCart();

  const [filters, setFilters] = useState({
    sizes: [],
    colors: [],
    categories: [],
    price: { min: 0, max: 1000 },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [prodRes, sizeRes, colorRes, catRes] = await Promise.all([
          api.get("/products"),
          api.get("/product-sizes"),
          api.get("/colors"),
          api.get("/product-categories"),
        ]);

        const productsList = Array.isArray(prodRes.data)
          ? prodRes.data
          : prodRes.data?.data || [];

        setProducts(
          productsList.map((p) => ({
            id: p.product_id ?? p.id,
            name: p.product_name,
            price: p.selling_price,
            image: `${ASSET_BASE_URL}/product_images/${p.product_image}`,
            size_id: p.size_id,
            color_id: p.color_id,
            category_id: p.category_id,
            flag: flagKey ? p[flagKey] : 1,
          }))
        );

        setSizes(Array.isArray(sizeRes.data) ? sizeRes.data : sizeRes.data?.data || []);
        setColors(Array.isArray(colorRes.data) ? colorRes.data : colorRes.data?.data || []);
        setCategories(
          Array.isArray(catRes.data) ? catRes.data : catRes.data?.data || []
        );

        // Set dynamic price range based on products
        if (productsList.length) {
          const prices = productsList.map((p) => p.selling_price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          setFilters((prev) => ({
            ...prev,
            price: { min: minPrice, max: maxPrice },
          }));
        }
      } catch (err) {
        console.error("Failed to fetch product data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [flagKey]);

  const filteredProducts = useMemo(
    () =>
      products
        .filter((p) => p.flag === 1)
        .filter((p) => (filters.sizes.length ? filters.sizes.includes(p.size_id) : true))
        .filter((p) =>
          filters.colors.length ? filters.colors.includes(p.color_id) : true
        )
        .filter((p) =>
          filters.categories.length
            ? filters.categories.includes(p.category_id)
            : true
        )
        .filter(
          (p) =>
            p.price >= (filters.price?.min ?? 0) &&
            p.price <= (filters.price?.max ?? 1000)
        ),
    [products, filters]
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <SectionHeading small={subtitle} big={title} underline={underline} />

        <div className="flex gap-8">
          {/* Sidebar */}
          <FilterSidebar
            sizes={sizes}
            colors={colors}
            categories={categories}
            filters={filters}
            setFilters={setFilters}
          />

          {/* Products Grid */}
          <div className="flex-1 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-72 bg-gray-200 animate-pulse rounded"
                />
              ))
            ) : filteredProducts.length ? (
              filteredProducts.map((p) => (
                <TopSellersCard
                  key={p.id}
                  product={p}
                  badge={badge}
                  onAddToCart={addItem}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 mt-20">
                No products found for selected filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
