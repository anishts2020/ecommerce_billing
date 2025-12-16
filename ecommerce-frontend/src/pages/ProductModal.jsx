import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import Layout from "../components/Layout";

const IMAGE_BASE = "http://127.0.0.1:8000/product_images/";

export default function ProductModal() {
  const { productCode } = useParams();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const preselectedColorId = query.get("color");
  const preselectedSizeId = query.get("size");

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);

  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);

  /* ---------- ZOOM ---------- */
  const imgRef = useRef(null);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [mobileZoom, setMobileZoom] = useState(false);

  /* ---------- FETCH PRODUCT ---------- */
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/product-details/${productCode}`)
      .then(res => res.json())
      .then(data => {
        setProduct({
          name: data.product_name,
          description: data.description,
          material: data.material,
        });

        setVariants(data.variants);

        const uniqueColors = [];
        data.variants.forEach(v => {
          if (!uniqueColors.find(c => c.color_id === v.color_id)) {
            uniqueColors.push({
              color_id: v.color_id,
              color_name: v.color_name,
              image: v.image,
            });
          }
        });

        setColors(uniqueColors);

        const matchedColor = preselectedColorId
          ? uniqueColors.find(c => String(c.color_id) === String(preselectedColorId))
          : uniqueColors[0];

        setSelectedColor(matchedColor || uniqueColors[0] || null);
      });
  }, [productCode, preselectedColorId]);

  /* ---------- UPDATE SIZES WHEN COLOR CHANGES ---------- */
  useEffect(() => {
    if (!selectedColor) return;

    const validVariants = variants.filter(
      v => v.color_id === selectedColor.color_id
    );

    const uniqueSizes = [];
    validVariants.forEach(v => {
      if (!uniqueSizes.find(s => s.size_id === v.size_id)) {
        uniqueSizes.push({
          size_id: v.size_id,
          size_name: v.size_name,
          price: v.price,
        });
      }
    });

    setSizes(uniqueSizes);

    let finalSize = null;
    if (preselectedSizeId) {
      finalSize = uniqueSizes.find(
        s => String(s.size_id) === String(preselectedSizeId)
      );
    }
    if (!finalSize && uniqueSizes.length > 0) {
      finalSize = uniqueSizes[0];
    }

    setSelectedSize(finalSize || null);
    setPrice(finalSize?.price || 0);
  }, [selectedColor, variants, preselectedSizeId]);

  const mainImage = selectedColor
    ? IMAGE_BASE + selectedColor.image
    : "/fallback-image.png";

  /* ---------- ZOOM ---------- */
  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  if (!product) {
    return (
      <Layout>
        <div className="p-10 text-center">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-14">

          {/* IMAGE */}
          <div className="flex gap-6">
            <div className="w-full lg:w-96">
              <img
                ref={imgRef}
                src={mainImage}
                alt={product.name}
                className="w-full object-contain cursor-zoom-in select-none"
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onMouseMove={handleMouseMove}
                onClick={() => setMobileZoom(true)}
                draggable={false}
                onError={(e) => (e.target.src = "/fallback-image.png")}
              />
            </div>
          </div>

          {/* DETAILS */}
          <div className="flex-1 space-y-8">
            <div>
              <h1 className="text-2xl font-semibold">{product.name}</h1>
              <p className="text-gray-700 mt-2">{product.description}</p>
              <p className="text-2xl font-bold mt-4">₹ {price}</p>
            </div>

            <span className="inline-block rounded-full bg-gray-100 px-0 py-1 text-sm">
            Material: {product.material}
            </span>

            {/* SIZE */}
            <div>
              

              {/* Selected size label */}
              {selectedSize && (
                <p className="font-medium mb-1">
                  Size:  <span className="font-semibold">{selectedSize.size_name}</span>
                </p>
              )}
              <br/>
              <div className="flex flex-wrap items-center gap-3">
                {sizes.map((s) => {
                  const selected = selectedSize?.size_id === s.size_id;
                  return (
                    <button
                      key={s.size_id}
                      onClick={() => {
                        setSelectedSize(s);
                        setPrice(s.price);
                      }}
                      className={`
                        w-14 h-14 rounded-lg border text-center font-semibold transition
                        ${
                          selected
                            ? "bg-black text-white border-black"
                            : "border-gray-300 text-gray-800"
                        }
                      `}
                    >
                      {s.size_name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* COLOR */}
            <div>
              <p className="font-medium mb-3">Color</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => {
                  const selected = selectedColor?.color_id === c.color_id;
                  return (
                    <button
                      key={c.color_id}
                      onClick={() => setSelectedColor(c)}
                      className={`
                        px-4 py-1.5 rounded border text-sm transition
                        ${
                          selected
                            ? "border-blue-600 text-blue-600"
                            : "border-gray-300 text-gray-800"
                        }
                      `}
                    >
                      {c.color_name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUANTITY */}
            <div>
              <p className="font-medium mb-2">Quantity</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 border rounded"
                >
                  −
                </button>
                <span className="font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-8 h-8 border rounded"
                >
                  +
                </button>
              </div>
            </div>

            {/* ADD TO CART */}
            <button
              disabled={!selectedColor || sizes.length === 0}
              className="px-10 py-3 rounded-lg font-semibold text-base flex items-center justify-center gap-3 border-2 border-blue-600 text-blue-600 hover:border-blue-700 hover:text-blue-700 hover:bg-blue-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
