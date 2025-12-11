import { useState } from "react";

export default function FilterPanel({ types = [], selectedTypes = [], toggleType }) {
  const [openType, setOpenType] = useState(false);

  return (
    <div className="w-64">
      {/* Filters Title */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg font-semibold">⚙️ Filters</span>
      </div>

      <hr />

      {/* Product Type Section */}
      <div className="py-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setOpenType(!openType)}
        >
          <h3 className="font-semibold">Product type</h3>

          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-lg">
            {openType ? "▲" : "▼"}
          </div>
        </div>

        {/* Collapsible content */}
        {openType && (
          <div className="mt-4 flex flex-col gap-3">
            {types.map((t) => (
              <label key={t.product_type_id} className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={selectedTypes.includes(Number(t.product_type_id))}
                  onChange={() => toggleType(Number(t.product_type_id))}
                />
                <span>{t.product_type_name}</span>
              </label>
            ))}

            {types.length === 0 && <div className="text-sm text-gray-500">No types found</div>}
          </div>
        )}
      </div>

      <hr />
    </div>
  );
}
