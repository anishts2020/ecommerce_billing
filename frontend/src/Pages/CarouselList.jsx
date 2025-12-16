import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import EditCarouselModal from "../Pages/EditCarouselModal";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const BASE_URL = "http://127.0.0.1:8000";

export default function CarouselList() {
    const [carousels, setCarousels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editItem, setEditItem] = useState(null);
    const [swapping, setSwapping] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCarousels();
    }, []);

    const fetchCarousels = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/carousels`);
            setCarousels(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to load carousels");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this carousel?")) return;

        try {
            await axios.delete(`${BASE_URL}/api/carousels/${id}`);
            setCarousels((prev) => prev.filter((c) => c.id !== id));
        } catch (err) {
            console.error(err);
            alert("Delete failed");
        }
    };

    // 🔥 OPTIMISTIC SWAP + BACKEND SYNC
    const swapOrder = async (id, direction) => {
        if (swapping) return;
        setSwapping(true);

        setCarousels((prev) => {
            // always work on sorted list
            const sorted = [...prev].sort(
                (a, b) => a.carousel_order - b.carousel_order
            );

            const index = sorted.findIndex((c) => c.id === id);
            if (index === -1) return prev;

            const targetIndex =
                direction === "up" ? index - 1 : index + 1;

            if (targetIndex < 0 || targetIndex >= sorted.length) {
                return prev;
            }

            // 🔥 swap POSITIONS, not numbers
            [sorted[index], sorted[targetIndex]] =
                [sorted[targetIndex], sorted[index]];

            // 🔥 reassign correct sequential order
            return sorted.map((item, i) => ({
                ...item,
                carousel_order: i + 1,
            }));
        });

        try {
            await axios.post(`${BASE_URL}/api/carousels/${id}/swap`, {
                direction,
            });
        } catch (err) {
            console.error(err);
            fetchCarousels(); // rollback
        } finally {
            setSwapping(false);
        }
    };


    // 🔥 ALWAYS RENDER SORTED DATA (THE REAL FIX)
    const sortedCarousels = useMemo(() => {
        return [...carousels].sort(
            (a, b) => a.carousel_order - b.carousel_order
        );
    }, [carousels]);

    const maxOrder = useMemo(() => {
        if (!carousels.length) return 0;
        return Math.max(...carousels.map((c) => Number(c.carousel_order)));
    }, [carousels]);

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-6">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Carousel List</h2>
                <button
                    type="button"
                    onClick={() => navigate("/carousel/create")}
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                >
                    + Add Carousel
                </button>
            </div>

            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full border-collapse">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="px-4 py-3 text-left">Order</th>
                            <th className="px-4 py-3 text-left">Type</th>
                            <th className="px-4 py-3 text-left">Preview</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {sortedCarousels.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-6">
                                    No carousel data
                                </td>
                            </tr>
                        ) : (
                            sortedCarousels.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    {/* ORDER */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                disabled={swapping || item.carousel_order === 1}
                                                onClick={() => swapOrder(item.id, "up")}
                                                className="text-green-600 disabled:text-gray-300"
                                            >
                                                ▲
                                            </button>

                                            <span className="font-semibold">
                                                {item.carousel_order}
                                            </span>

                                            <button
                                                type="button"
                                                disabled={swapping || item.carousel_order === maxOrder}
                                                onClick={() => swapOrder(item.id, "down")}
                                                className="text-red-600 disabled:text-gray-300"
                                            >
                                                ▼
                                            </button>
                                        </div>
                                    </td>

                                    {/* TYPE */}
                                    <td className="px-4 py-3 capitalize">
                                        {item.carousel_type}
                                    </td>

                                    {/* PREVIEW */}
                                    <td className="px-4 py-3">
                                        {item.carousel_type === "image" ? (
                                            <img
                                                src={`${BASE_URL}/${item.carousel_url}`}
                                                alt="carousel"
                                                className="h-16 w-24 object-cover rounded border"
                                            />
                                        ) : (
                                            <video
                                                src={`${BASE_URL}/${item.carousel_url}`}
                                                className="h-16 w-24 rounded border"
                                                controls
                                            />
                                        )}
                                    </td>

                                    {/* ACTIONS */}
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex justify-center items-center gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setEditItem(item)}
                                                className="text-indigo-600 hover:text-indigo-800"
                                                title="Edit"
                                            >
                                                <FaEdit size={18} />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDelete(item.id)}
                                                className="text-red-600 hover:text-red-700"
                                                title="Delete"
                                            >
                                                <FaTrash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* EDIT MODAL */}
            {editItem && (
                <EditCarouselModal
                    data={editItem}
                    onClose={() => setEditItem(null)}
                    onUpdated={() => {
                        setEditItem(null);
                        fetchCarousels();
                    }}
                />
            )}
        </div>
    );
}
