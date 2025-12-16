// Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { BASE_URL } from "../api/api";
import ProductCard from "../components/ProductCard";
import TopSellersCard from "../components/TopSellersCard";
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
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const [selectedColorIds, setSelectedColorIds] = useState([]);
  const [sortOrder, setSortOrder] = useState(""); // added sort state

  // Fetch all colors
  useEffect(() => {
    api.get("/products")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data.data || [];

        // include both id and product_id so downstream code is unambiguous
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
          id: p.product_id,
          product_id: p.product_id,
          name: p.product_name,
          price: p.selling_price,
          image: `${BASE_URL.replace("/api", "")}/product_images/${p.product_image}`,
          color_id: p.color_id,
          color_name: p.color_name,
          color_code: p.color_code,
        }));
        setProducts(formatted);

        const top = [...formatted]
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 6);

        setTopSellers(top);
      })
      .catch(console.error);
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
  
  

  /* CLICK → PRODUCT PAGE */
  const handleProductClick = (productCode, colorId, sizeId) => {
    navigate(`/product/${productCode}?color=${colorId}&size=${sizeId}`);
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
              <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
            ))}
          </div>
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

      <div className={`toast ${toast.show ? "show" : ""}`}>
        {toast.message}
      </div>
    </Layout>
  );
}
