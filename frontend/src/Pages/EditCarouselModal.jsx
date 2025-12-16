import { useState, useEffect, useRef } from "react";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

export default function EditCarouselModal({ data, onClose, onUpdated }) {
    const [type, setType] = useState("");
    const [order, setOrder] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const fileRef = useRef(null);

    // Initialize data safely
    useEffect(() => {
        if (!data) return;

        setType(data.carousel_type);
        setOrder(data.carousel_order);
        setFile(null);

        if (fileRef.current) {
            fileRef.current.value = "";
        }
    }, [data]);

    // Reset file when type changes
    useEffect(() => {
        setFile(null);
        if (fileRef.current) {
            fileRef.current.value = "";
        }
    }, [type]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("carousel_type", type);
        formData.append("carousel_order", order);

        // Laravel PUT workaround for multipart
        formData.append("_method", "PUT");

        if (file) {
            formData.append("file", file);
        }

        try {
            setLoading(true);

            const res = await axios.post(
                `${BASE_URL}/api/carousels/${data.id}`,
                formData
            );

            onUpdated(res.data.data);
            onClose();
        } catch (err) {
            console.error("UPDATE ERROR:", err);

            if (err.response?.data?.errors) {
                const errors = err.response.data.errors;
                alert(Object.values(errors)[0][0]);
            } else {
                alert("Update failed");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!data) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded w-96">
                <h3 className="text-lg font-bold mb-4">Edit Carousel</h3>

                <form onSubmit={handleSubmit} className="space-y-3">

                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                    </select>

                    <input
                        type="number"
                        min="1"
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />

                    <div>
                        <label className="block mb-1 font-medium">
                            {type === "image" ? "Upload Image" : "Upload Video"}
                        </label>

                        <div className="flex items-center gap-3">
                            <input
                                ref={fileRef}
                                type="file"
                                accept={type === "image" ? "image/*" : "video/*"}
                                className="hidden"
                                onChange={(e) => {
                                    const selected = e.target.files[0];
                                    if (!selected) return;

                                    if (
                                        type === "image" &&
                                        !selected.type.startsWith("image/")
                                    ) {
                                        alert("Please upload an IMAGE file only");
                                        e.target.value = "";
                                        return;
                                    }

                                    if (
                                        type === "video" &&
                                        !selected.type.startsWith("video/")
                                    ) {
                                        alert("Please upload a VIDEO file only");
                                        e.target.value = "";
                                        return;
                                    }

                                    setFile(selected);
                                }}
                            />

                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
                            >
                                Choose File
                            </button>

                            <span className="text-sm text-gray-600 truncate max-w-[200px]">
                                {file ? file.name : "No file chosen"}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-1 border rounded"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading || !order}
                            className={`px-3 py-1 rounded text-white ${loading || !order
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {loading ? "Updating..." : "Update"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
