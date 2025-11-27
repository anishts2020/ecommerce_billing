import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import colorsJson from "../data/colors.json";

export default function Colors() {
  const [colors, setColors] = useState([]); // always start as array
  const [selectedColor, setSelectedColor] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchColors = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/colors");
      console.log("colors API response:", res.data);

      // safer: try multiple common shapes, fallback to empty array
      const serverColors =
        (res.data && res.data.colors) ?? // { colors: [...] }
        (res.data && res.data.data) ??   // { data: [...] }
        res.data ??                      // raw array or object
        [];

      // ensure it's an array
      setColors(Array.isArray(serverColors) ? serverColors : []);
    } catch (err) {
      console.error("Failed to fetch colors", err);
      setColors([]); // on error, keep it an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  // make sure colorsJson is defined and an array before mapping
  const options = Array.isArray(colorsJson)
    ? colorsJson.map((c) => ({
        label: `${c.name} (${c.hex})`,
        value: c.name,
        code: c.hex,
      }))
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedColor) return;

    try {
      await axios.post("http://127.0.0.1:8000/api/colors", {
        color_name: selectedColor.value,
        color_code: selectedColor.code,
        is_active: 1,
      });

      setSelectedColor(null);
      fetchColors();
      alert("Color Saved Successfully");
    } catch (err) {
      console.error("Error saving color", err);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Color Management</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8 grid gap-4">
        <Select
          options={options}
          value={selectedColor}
          onChange={(v) => setSelectedColor(v)}
          placeholder="Search & Select a Color"
          isSearchable
        />

        {selectedColor && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: selectedColor.code }}></div>
            <p className="font-semibold">{selectedColor.code}</p>
          </div>
        )}

        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Save Color
        </button>
      </form>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-2">Color Name</th>
              <th className="p-2">Color Code</th>
              <th className="p-2">Active</th>
              <th className="p-2">Preview</th>
            </tr>
          </thead>
          <tbody>
            {/* guard here too */}
            {Array.isArray(colors) && colors.length > 0 ? (
              colors.map((c) => (
                <tr key={c.id ?? c.color_code ?? Math.random()} className="border-b text-center hover:bg-gray-100">
                  <td>{c.color_name}</td>
                  <td>{c.color_code}</td>
                  <td>{c.is_active ? "Yes" : "No"}</td>
                  <td>
                    <div className="w-6 h-6 mx-auto rounded" style={{ backgroundColor: c.color_code }}></div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  {loading ? "Loading colors..." : "No colors found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
