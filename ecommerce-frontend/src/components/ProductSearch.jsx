import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { BASE_URL } from "../api/api";
import Layout from "./Layout";
import ProductCard from "./ProductCard";

export default function ProductSearch() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }

    const debounce = setTimeout(() => {
      setLoading(true);

      api.get(`/products/search?q=${query}`)
        .then((res) => {
          const list = Array.isArray(res.data)
            ? res.data
            : res.data.data || [];

          const filtered = list
            .filter((p) =>
              p.product_name
                .toLowerCase()
                .split(" ")
                .some((word) =>
                  word.startsWith(query.toLowerCase())
                )
            )
            .map((p) => ({
              product_code: p.product_code,
              name: p.product_name,
              price: p.selling_price || 0,
              image: p.product_image
                ? `${BASE_URL.replace("/api", "")}/product_images/${p.product_image}`
                : "/fallback-image.png",
            }));

          setProducts(filtered);
        })
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* SEARCH BAR */}
        <input
          type="text"
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border rounded-md p-4 mb-6 text-lg"
        />

        {/* RESULTS */}
        {loading && <p className="text-gray-500">Searching...</p>}

        {!loading && query && products.length === 0 && (
          <p className="text-gray-500">No products found.</p>
        )}

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.product_code}
              product={product}
              onImageClick={() =>
                navigate(`/product/${product.product_code}`)
              }
              showAddToCart={false}
              showViewDetails={true}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
