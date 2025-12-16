import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { BASE_URL } from "../api/api";
import ProductCard from "../components/ProductCard";
import Layout from "../components/Layout";
import { FiSearch } from "react-icons/fi";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // ✅ FIX
  const [query, setQuery] = useState("");              // ✅ FIX
  const [loading, setLoading] = useState(false);       // ✅ FIX

  const navigate = useNavigate();

  /* SEARCH FILTER */
  useEffect(() => {
    if (!query.trim()) {
      setProducts(allProducts);
      return;
    }

    setLoading(true);

    const debounce = setTimeout(() => {
      const q = query.toLowerCase();

      const filtered = allProducts.filter((p) =>
        p.name
          .toLowerCase()
          .split(" ")
          .some((word) => word.startsWith(q))
      );

      setProducts(filtered);
      setLoading(false);
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, allProducts]);

  /* FETCH PRODUCTS */
  useEffect(() => {
    api.get("/products")
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];

        const formatted = list.map((p) => ({
          product_code: p.product_code,
          name: p.product_name,
          price: p.selling_price,
          description: p.product_description || "",

          /* VARIANT CONTEXT */
          color_id: p.color_id,
          size_id: p.size_id,

          image: p.product_image
            ? `${BASE_URL.replace("/api", "")}/product_images/${p.product_image}`
            : "/fallback-image.png",
        }));

        setAllProducts(formatted); // ✅ FIX
        setProducts(formatted);    // ✅ FIX
      })
      .catch(console.error);
  }, []);

  /* CLICK → PRODUCT PAGE */
  const handleProductClick = (productCode, colorId, sizeId) => {
    navigate(`/product/${productCode}?color=${colorId}&size=${sizeId}`);
  };

  return (
    <Layout>
      {/* SEARCH BAR */}
      <div className="max-w-3xl mx-auto px-4 mt-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border rounded-md pl-12 pr-4 py-3 text-base"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">Products</h2>

        {loading ? (
          <p className="text-gray-500">Searching...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500">No products found</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {products.map((p) => (
              <ProductCard
                key={p.product_code}
                product={p}
                onClick={() =>
                  handleProductClick(
                    p.product_code,
                    p.color_id,
                    p.size_id
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
