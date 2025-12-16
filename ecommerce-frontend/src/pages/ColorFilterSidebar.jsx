// src/components/ColorFilterSidebar.jsx
import React from "react";

export default function ColorFilterSidebar({
  colors,
  selectedColorIds,
  onToggleColor,
  onSortChange,
}) {
  const [isOpen, setIsOpen] = React.useState(true);
  const [sortOrder, setSortOrder] = React.useState(""); // current selected sort

  const circleSize = 32;
  const containerWidth = 256;
  const containerHeight = 192;
  const positionsRef = React.useRef({});

  // Assign positions to colors
  if (Object.keys(positionsRef.current).length === 0 && colors.length > 0) {
    const assigned = [];
    colors.forEach((col) => {
      let attempt = 0;
      let pos;
      do {
        pos = {
          left: Math.random() * (containerWidth - circleSize),
          top: Math.random() * (containerHeight - circleSize),
        };
        attempt++;
        const overlap = assigned.some(
          (prev) =>
            !(
              pos.left + circleSize < prev.left ||
              prev.left + circleSize < pos.left ||
              pos.top + circleSize < prev.top ||
              prev.top + circleSize < pos.top
            )
        );
        if (!overlap) break;
      } while (attempt < 100);
      assigned.push(pos);
      positionsRef.current[col.color_id] = pos;
    });
  }

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOrder(value);
    if (onSortChange) onSortChange(value);
  };

  return (
    <aside className="w-64 p-4 h-full">
      {/* Color Filter Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Color</h3>
        <button
          onClick={toggleOpen}
          className="p-1 flex items-center justify-center"
        >
          <div
            className={`rounded-full p-1 ${
              isOpen ? "bg-black" : "bg-gray-200 hover:bg-black"
            }`}
          >
            <svg
              className={`w-4 h-4 fill-current ${
                isOpen ? "text-white" : "text-gray-800 hover:text-white"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              {isOpen ? <path d="M5 15l7-7 7 7" /> : <path d="M19 9l-7 7-7-7" />}
            </svg>
          </div>
        </button>
      </div>

      {/* Color Circles */}
      {isOpen && (
        <div className="relative w-full h-48 rounded overflow-hidden mb-4">
          {colors.map((col) => {
            const pos = positionsRef.current[col.color_id];
            const isSelected = selectedColorIds.includes(col.color_id);
            return (
              <div
                key={col.color_id}
                onClick={() => onToggleColor(col.color_id)}
                title={col.color_name}
                className={`w-8 h-8 rounded-full cursor-pointer absolute transition-all duration-200 ${
                  isSelected ? "ring-2 ring-black" : ""
                }`}
                style={{
                  backgroundColor: col.color_code,
                  top: pos.top,
                  left: pos.left,
                }}
              />
            );
          })}
        </div>
      )}

      {/* ---------------- Sort Dropdown (Shopify style) ---------------- */}
      <div className="flex items-center gap-2">
        <span className="font-bold text-gray-700">Sort by:</span>

        <select
          className="border rounded px-3 py-2 bg-white shadow-sm cursor-pointer flex-1"
          value={sortOrder}
          onChange={handleSortChange}
        >
          <option value="">Featured</option>
         
          <option value="low-to-high">Price, low to high</option>
          <option value="high-to-low">Price, high to low</option>
        
        </select>
      </div>
    </aside>
  );
}