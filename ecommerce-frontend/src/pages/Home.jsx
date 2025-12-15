import React, { useEffect, useState } from "react";
import api, { BASE_URL } from "../api/api";
import ProductCard from "../components/ProductCard";
import Layout from "../components/Layout";
import ColorFilterSidebar from "./ColorFilterSidebar";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [colors, setColors] = useState([]);
  const [isLoadingColors, setIsLoadingColors] = useState(true);

  const [selectedColorIds, setSelectedColorIds] = useState([]);
  const [sortOrder, setSortOrder] = useState(""); // added sort state

  // Fetch all colors
  useEffect(() => {
    async function fetchAllColors() {
      try {
        let all = [];
        let page = 1;
        let lastPage = 1;

        do {
          const res = await api.get(`/colors?page=${page}`);
          const body = res.data;

          const data = Array.isArray(body.data) 
            ? body.data 
            : Array.isArray(body) 
              ? body 
              : [];

          all = all.concat(data);

          lastPage = body.last_page || body.meta?.last_page || lastPage;

          page += 1;
        } while (page <= lastPage);

        setColors(all);
      } catch (err) {
        console.error("Error fetching all colors:", err);
      } finally {
        setIsLoadingColors(false);
      }
    }

    fetchAllColors();
  }, []);

  // Fetch all products
  useEffect(() => {
    api.get("/products")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data.data || [];
        const formatted = list.map((p) => ({
          id: p.product_id,
          name: p.product_name,
          price: p.selling_price,
          image: `${BASE_URL.replace("/api", "")}/product_images/${p.product_image}`,
          color_id: p.color_id,
          color_name: p.color_name,
          color_code: p.color_code,
        }));
        setProducts(formatted);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
      });
  }, []);

  // Toggle color selection
  const handleToggleColor = (colorId) => {
    setSelectedColorIds((prev) => {
      if (prev.includes(colorId)) {
        return prev.filter((id) => id !== colorId);
      } else {
        return [...prev, colorId];
      }
    });
  };

  // Handle sort change
  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  // Apply color filter
  let filteredProducts = selectedColorIds.length > 0
    ? products.filter((p) => selectedColorIds.includes(p.color_id))
    : [...products];

  // Apply sorting
  if (sortOrder === "low-to-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "high-to-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6 flex">
        {isLoadingColors ? (
          <p>Loading filter options...</p>
        ) : (
          <ColorFilterSidebar
            colors={colors}
            selectedColorIds={selectedColorIds}
            onToggleColor={handleToggleColor}
            onSortChange={handleSortChange} // pass sort callback
          />
        )}

        <div className="flex-1 pl-6">
          <h2 className="text-2xl font-bold mb-6">Products</h2>

          {filteredProducts.length === 0 ? (
            <p className="text-gray-500">No products to show.</p>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}