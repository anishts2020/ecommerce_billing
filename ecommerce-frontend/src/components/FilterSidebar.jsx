import React, { useState, useCallback } from "react";
import { Range, getTrackBackground } from "react-range";
import { motion, AnimatePresence } from "framer-motion";

// Reusable Filter Button
function FilterButton({ active, onClick, children, className = "", style }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 border rounded text-sm transition-all duration-200 ${className} ${
        active ? "bg-black text-white" : "bg-white hover:bg-gray-100"
      }`}
      style={style}
    >
      {children}
    </button>
  );
}

// Reusable Collapsible Section
function CollapsibleSection({ title, isOpen, onToggle, children }) {
  return (
    <div className="mb-4">
      <div
        className="flex justify-between items-center cursor-pointer mb-2"
        onClick={onToggle}
      >
        <h3 className="font-medium mb-1">{title}</h3>
        <motion.svg
          className="w-4 h-4"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap gap-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FilterSidebar({
  sizes = [],
  colors = [],
  categories = [],
  filters,
  setFilters,
}) {
  const [openSections, setOpenSections] = useState({
    categories: true,
    sizes: true,
    colors: true,
    price: true,
  });

  const MIN = 0;
  const MAX = 100000;

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleFilter = useCallback(
    (type, id) => {
      setFilters((prev) => ({
        ...prev,
        [type]: prev[type].includes(id)
          ? prev[type].filter((v) => v !== id)
          : [...prev[type], id],
      }));
    },
    [setFilters]
  );

  const handlePriceChange = (values) => {
    const [min, max] = values.map((v) => Math.min(Math.max(v, MIN), MAX));
    setFilters((prev) => ({
      ...prev,
      price: { min, max },
    }));
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <aside className="w-64 shrink-0 space-y-8 pr-6 mr-6 border-r border-gray-300">
      {/* The pr-6 adds padding inside, mr-6 shifts it slightly left */}
      
      {/* Categories */}
      <CollapsibleSection
        title="Product type"
        isOpen={openSections.categories}
        onToggle={() => toggleSection("categories")}
      >
        {categories.map((cat) => (
          <FilterButton
            key={cat.product_category_id}
            active={filters.categories?.includes(cat.product_category_id)}
            onClick={() => toggleFilter("categories", cat.product_category_id)}
          >
            {capitalize(cat.product_category_name)}
          </FilterButton>
        ))}
      </CollapsibleSection>

      {/* Sizes */}
      <CollapsibleSection
        title="Size"
        isOpen={openSections.sizes}
        onToggle={() => toggleSection("sizes")}
      >
        {sizes.map((size) => (
          <FilterButton
            key={size.size_id}
            active={filters.sizes?.includes(size.size_id)}
            onClick={() => toggleFilter("sizes", size.size_id)}
          >
            {capitalize(size.size_name)}
          </FilterButton>
        ))}
      </CollapsibleSection>

      {/* Colors */}
      <CollapsibleSection
        title="Color"
        isOpen={openSections.colors}
        onToggle={() => toggleSection("colors")}
      >
        {colors.map((color) => (
          <FilterButton
            key={color.color_id}
            active={filters.colors?.includes(color.color_id)}
            onClick={() => toggleFilter("colors", color.color_id)}
            className="w-8 h-8 rounded-full border-2 transition transform hover:scale-105"
            style={{ backgroundColor: color.color_code }}
          />
        ))}
      </CollapsibleSection>

      {/* Price */}
      <CollapsibleSection
        title="Price"
        isOpen={openSections.price}
        onToggle={() => toggleSection("price")}
      >
        <div className="flex flex-col gap-4 w-full">
          <Range
            step={100}
            min={MIN}
            max={MAX}
            values={[filters.price?.min ?? MIN, filters.price?.max ?? MAX]}
            onChange={handlePriceChange}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                className="h-1 w-full rounded-lg"
                style={{
                  background: getTrackBackground({
                    values: [filters.price?.min ?? MIN, filters.price?.max ?? MAX],
                    colors: ["#000", "#ddd", "#000"],
                    min: MIN,
                    max: MAX,
                  }),
                }}
              >
                {children}
              </div>
            )}
            renderThumb={({ props }) => (
              <div
                {...props}
                className="h-5 w-5 rounded-full bg-black shadow-md cursor-pointer"
              />
            )}
          />

          {/* Min & Max Inputs */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={MIN}
              max={MAX}
              value={filters.price?.min ?? MIN}
              onChange={(e) =>
                handlePriceChange([Number(e.target.value), filters.price?.max ?? MAX])
              }
              className="w-full border rounded p-1 text-sm"
            />
            <span>to</span>
            <input
              type="number"
              min={MIN}
              max={MAX}
              value={filters.price?.max ?? MAX}
              onChange={(e) =>
                handlePriceChange([filters.price?.min ?? MIN, Number(e.target.value)])
              }
              className="w-full border rounded p-1 text-sm"
            />
          </div>
        </div>
      </CollapsibleSection>
    </aside>
  );
}
