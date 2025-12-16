import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://127.0.0.1:8000";

export default function CreateCarousel() {
    const [carouselType, setCarouselType] = useState("image");
    const [carouselOrder, setCarouselOrder] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const fileRef = useRef(null);
    const navigate = useNavigate();

    // Reset file when type changes
    useEffect(() => {
        console.log("Carousel type changed:", carouselType);
        setFile(null);
        if (fileRef.current) fileRef.current.value = "";
    }, [carouselType]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("SUBMIT CLICKED");
        console.log("carouselType:", carouselType);
        console.log("carouselOrder (raw):", carouselOrder);
        console.log("carouselOrder (number):", Number(carouselOrder));
        console.log("file:", file);

        if (!file || !carouselOrder) {
            alert("All fields are required");
            return;
        }

        const formData = new FormData();
        formData.append("carousel_type", carouselType);
        formData.append("carousel_order", Number(carouselOrder)); // force number
        formData.append("file", file);

        // 🔥 DEBUG: Print FormData content
        console.log("FORM DATA CONTENTS:");
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        try {
            setLoading(true);

            const res = await axios.post(
                `${BASE_URL}/api/carousels`,
                formData
            );

            console.log("SUCCESS RESPONSE:", res.data);

            const svgDataUrl =
                "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjMjU2M2ViIiBkPSJNNDcwLjYzIDk1Ljk1TDIyMi41MiAzNDQuMDcgNDEuMzcgMjA4LjgyIDYuNTkgMjQzLjYyIDIyMi41MiA0NTQuNzggNTA1LjQxIDEzMC43NCA0NzAuNjMgOTUuOTV6Ii8+PC9zdmc+";

            await Swal.fire({
                title: "Carousel Created!",
                text: "The carousel item has been added successfully.",
                imageUrl: svgDataUrl,
                imageAlt: "Success",
                imageWidth: 60,
                imageHeight: 60,
                confirmButtonText: "Go to Carousel List",
                confirmButtonColor: "#2563eb",
            });

            navigate("/carousel");

            // Reset form
            setCarouselOrder("");
            setFile(null);
            if (fileRef.current) fileRef.current.value = "";

        } catch (error) {
            console.error("❌ CREATE ERROR FULL:", error);

            if (error.response) {
                console.error("❌ STATUS:", error.response.status);
                console.error("❌ RESPONSE DATA:", error.response.data);
                alert("This Carousel Order is already taken")
            } else if (error.request) {
                console.error("❌ NO RESPONSE FROM SERVER:", error.request);
                alert("No response from server (network issue)");
            } else {
                console.error("❌ UNKNOWN ERROR:", error.message);
                
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Add Carousel</h2>

            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="block mb-1 font-medium">Carousel Type</label>
                    <select
                        value={carouselType}
                        onChange={(e) => setCarouselType(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-medium">
                        {carouselType === "image" ? "Upload Image" : "Upload Video"}
                    </label>

                    <div className="flex items-center gap-3">
                        <input
                            ref={fileRef}
                            type="file"
                            accept={carouselType === "image" ? "image/*" : "video/*"}
                            className="hidden"
                            onChange={(e) => {
                                const selected = e.target.files[0];
                                if (!selected) return;

                                console.log("FILE SELECTED:", selected);
                                console.log("FILE TYPE:", selected.type);
                                console.log("FILE SIZE (MB):", (selected.size / 1024 / 1024).toFixed(2));

                                if (
                                    carouselType === "image" &&
                                    !selected.type.startsWith("image/")
                                ) {
                                    alert("Please upload an IMAGE file only");
                                    e.target.value = "";
                                    return;
                                }

                                if (
                                    carouselType === "video" &&
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

                <div>
                    <label className="block mb-1 font-medium">Carousel Order</label>
                    <input
                        type="number"
                        min="1"
                        value={carouselOrder}
                        onChange={(e) => setCarouselOrder(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !carouselOrder || !file}
                    className={`w-full py-2 rounded text-white ${loading || !carouselOrder || !file
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loading ? "Uploading..." : "Save Carousel"}
                </button>
            </form>
        </div>
    );
}
