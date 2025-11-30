import { useState } from "react";
import axios from "axios";

function CustomerDetailsForm() {
    const [formData, setFormData] = useState({
        customer_name: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        gst_number: "",
    });

    const [existingId, setExistingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhoneCheck = (phone) => {
        if (phone.length < 10) return;

        setLoading(true);

        axios
            .get(`http://127.0.0.1:8000/api/customer/check-phone/${phone}`)
            .then((res) => {
                if (res.data.exists) {
                    const c = res.data.data;

                    setFormData({
                        customer_name: c.customer_name,
                        phone: c.phone,
                        email: c.email,
                        address: c.address,
                        city: c.city,
                        state: c.state,
                        pincode: c.pincode,
                        gst_number: c.gst_number || "",
                    });

                    setExistingId(c.id);
                } else {
                    setExistingId(null);
                }
            })
            .finally(() => setLoading(false));
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setFormData({ ...formData, phone: value });

        if (value.length >= 10) {
            handlePhoneCheck(value);
        }
    };

    const handleSave = () => {
        if (existingId) {
            axios
                .put(`http://127.0.0.1:8000/api/customer/${existingId}`, formData)
                .then(() => alert("Customer updated successfully!"))
                .catch(() => alert("Update failed!"));
        } else {
            axios
                .post("http://127.0.0.1:8000/api/customer", formData)
                .then(() => alert("Customer added successfully!"))
                .catch(() => alert("Create failed!"));
        }
    };

    return (
        <div>
            {/* Button to Open Modal */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
                Add / Edit Customer
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-xl p-6 rounded-xl shadow-xl relative">

                        {/* Close Button */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
                        >
                            ✕
                        </button>

                        <h2 className="text-2xl font-bold mb-4 text-gray-800">
                            Customer Details
                        </h2>

                        <div className="space-y-4">

                            {/* Phone */}
                            <div>
                                <label>Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handlePhoneChange}
                                    onBlur={(e) => handlePhoneCheck(e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                                {loading && <p className="text-blue-600 text-sm">Checking...</p>}
                                {existingId && (
                                    <p className="text-green-600 text-sm">Existing customer loaded.</p>
                                )}
                            </div>

                            {/* Customer Name */}
                            <div>
                                <label>Customer Name</label>
                                <input
                                    type="text"
                                    name="customer_name"
                                    value={formData.customer_name}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label>Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            {/* City & State */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>

                                <div>
                                    <label>State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </div>

                            {/* Pincode & GST */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label>Pincode</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>

                                <div>
                                    <label>GST Number</label>
                                    <input
                                        type="text"
                                        name="gst_number"
                                        value={formData.gst_number}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Save / Update Button */}
                        <button
                            onClick={() => {
                                handleSave();
                                setIsModalOpen(false);
                            }}
                            className="w-full mt-6 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                        >
                            {existingId ? "Update Customer" : "Save Customer"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CustomerDetailsForm;
