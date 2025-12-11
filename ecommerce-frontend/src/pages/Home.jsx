import { useEffect, useState } from "react";
import api, { BASE_URL } from "../api/api";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import Layout from "../components/Layout";
import { FiSearch } from "react-icons/fi";
import SearchDrawer from "../components/SearchDrawer";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Search drawer toggle
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // ================================
  // Load all products
  // ================================
  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data.data || [];
        const formatted = list.map((p) => ({
          id: p.id || p.product_id,
          name: p.product_name,
          price: p.selling_price,
          image: p.product_image
            ? `${BASE_URL.replace("/api", "")}/product_images/${p.product_image}`
            : "/fallback-image.png",
          description: p.product_description || "No description available",
          size: p.size?.size_name || "N/A",
          color: p.color?.color_name || "N/A",
          material_id: p.material_id || null,
          material: null,
        }));
        setProducts(formatted);
      })
      .catch((err) => console.error("Failed to load products:", err));
  }, []);

  // ================================
  // Add to Cart
  // ================================
  const addToCart = (product) => setCart((prev) => [...prev, product]);

  // ================================
  // Open modal and fetch material
  // ================================
  const openModal = async (product) => {
  setIsSearchOpen(false); // close search drawer
  let fullProduct = { ...product };

  // Fetch material name if missing
  if (!fullProduct.material && fullProduct.material_id) {
    try {
      const res = await api.get(`/materials/${fullProduct.material_id}`);
      fullProduct.material = res.data.material_name;
    } catch {
      fullProduct.material = "N/A";
    }
  }

  // Ensure size, color, description are included
  if (!fullProduct.size || !fullProduct.color || !fullProduct.description) {
    // Fetch full product details from API if search API returns partial data
    try {
      const res = await api.get(`/products/${fullProduct.id}`);
      const data = res.data;
      fullProduct.size = data.size?.size_name || "N/A";
      fullProduct.color = data.color?.color_name || "N/A";
      fullProduct.description = data.product_description || "No description available";
      fullProduct.price = data.selling_price || fullProduct.price;
    } catch {
      // fallback
      fullProduct.size = fullProduct.size || "N/A";
      fullProduct.color = fullProduct.color || "N/A";
      fullProduct.description = fullProduct.description || "No description available";
    }
  }

  setSelectedProduct(fullProduct);
  setIsModalOpen(true);
};

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <Layout>
      {/* Search Icon */}
      <div className="flex justify-end px-4 mt-4">
        <button className="text-2xl" onClick={() => setIsSearchOpen(true)}>
          <FiSearch />
        </button>
      </div>

      {/* Products Grid */}
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
                onImageClick={() => openModal(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Modal */}
      {isModalOpen && selectedProduct && (
        <ProductModal product={selectedProduct} onClose={closeModal} />
      )}

      {/* Search Drawer */}
      {isSearchOpen && (
        <SearchDrawer onClose={() => setIsSearchOpen(false)} onProductSelect={openModal} />
      )}
    </Layout>
  );
}
