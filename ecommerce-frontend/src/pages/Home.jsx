import { useEffect, useState } from "react";
import api, { BASE_URL } from "../api/api";
import ProductCard from "../components/ProductCard";
import Layout from "../components/Layout";
import FilterPanel from "../components/FilterPanel";

export default function Home() {
  const [products, setProducts] = useState([]);       // displayed
  const [allProducts, setAllProducts] = useState([]); // master list
  const [cart, setCart] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]); // now holds type IDs (numbers)
  const [types, setTypes] = useState([]);
  const [sortBy, setSortBy] = useState("featured");

  const SORT_OPTIONS = [
    { value: "featured", label: "Featured" },
    { value: "best", label: "Best Selling" },
    { value: "az", label: "Alphabetically, A-Z" },
    { value: "za", label: "Alphabetically, Z-A" },
    { value: "old", label: "Date, old to new" },
    { value: "new", label: "Date, new to old" },
  ];

  // Load product types
  useEffect(() => {
    api
      .get("/product-types")
      .then((res) => setTypes(Array.isArray(res.data) ? res.data : res.data.data || []))
      .catch((err) => console.error("Failed to load types", err));
  }, []);

  // Load all products once (no backend filtering)
  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data.data || [];

        const formatted = list.map((p) => ({
          id: p.product_id,
          name: p.product_name,
          price: p.selling_price,
          // keep numeric type id for robust filtering
          typeId: Number(p.type_id ?? p.type?.product_type_id ?? 0),
          // keep typeName for display if available
          typeName: p.type?.product_type_name || "",
          image: `${BASE_URL.replace("/api", "")}/product_images/${p.product_image}`,
          raw: p, // keep raw in case you need more fields later
        }));

        setAllProducts(formatted);
        setProducts(formatted); // initial display (will be replaced by combined effect anyway)
      })
      .catch((err) => console.error("Failed to load products", err));
  }, []);

  // Combined filter + sort effect (single source of truth)
  useEffect(() => {
    // wait until we have products loaded
    if (!allProducts.length) {
      setProducts([]); // ensure UI shows none until loaded
      return;
    }

    // start from master list
    let result = [...allProducts];

    // 1) Filter by selected type IDs (if any)
    if (selectedTypes.length > 0) {
      // selectedTypes contains numbers (type IDs)
      result = result.filter((p) => selectedTypes.includes(p.typeId));
    }

    // 2) Apply sorting
    switch (sortBy) {
      case "az":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "za":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "old":
        result.sort((a, b) => a.id - b.id);
        break;
      case "new":
        result.sort((a, b) => b.id - a.id);
        break;
      case "best":
        // if you add rating later, sort here. For now keep original order.
        break;
      default:
        // featured or other: keep API order
        break;
    }

    // DEBUG: inspect filter/sort pipeline in console
    // Remove these logs if you don't want them
    // eslint-disable-next-line no-console
    console.log("Home: applying pipeline", {
      selectedTypes,
      sortBy,
      allProductsCount: allProducts.length,
      resultCount: result.length,
    });

    setProducts(result);
  }, [selectedTypes, sortBy, allProducts]);

  // toggleType now receives typeId (number)
  const toggleType = (typeId) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId]
    );
  };

  const addToCart = (product) => setCart((prev) => [...prev, product]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* FILTER PANEL */}
        <FilterPanel types={types} selectedTypes={selectedTypes} toggleType={toggleType} />

        {/* PRODUCT GRID */}
        <div className="flex-1">
          {/* SORTING UI */}
          <div className="flex justify-end mb-4">
            <div className="relative">
              <span className="font-bold text-gray-700 mr-2">Sort by:</span>
              <select
                className="border rounded px-3 py-2 bg-white shadow-sm cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6">Products</h2>

          {products.length === 0 ? (
            <p className="text-gray-500">No products found.</p>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
