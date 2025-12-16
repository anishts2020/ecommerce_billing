// AddressForm.jsx (Styled for a Boutique Site)
import React, { useState } from "react";

export default function AddressForm() {
    const [form, setForm] = useState({
        fullName: "",
        mobile: "",
        pincode: "",
        flat: "",
        area: "",
        landmark: "",
        city: "",
        state: "",
        defaultAddress: false,
        deliveryInstructions: "", // Keep this state key
    });

    const states = [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal",
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

    };

    // Common input class for better styling
    const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-3 text-sm transition duration-150 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";
    const labelClass = "block font-semibold mb-1 text-gray-700 text-sm";


    return (
        <div className="max-w-xl mx-auto my-12 p-8 rounded-2xl shadow-2xl bg-white border border-gray-100">

            {/* Title with improved styling */}
            <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">
                Communication Address
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Full Name */}
                <div>
                    <label className={labelClass}>
                        Full Name (First and Last name)
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="John Doe"
                    />
                </div>

                {/* Mobile & Pincode in a single row */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className={labelClass}>Mobile Number</label>
                        <input
                            type="text"
                            name="mobile"
                            value={form.mobile}
                            onChange={(e) => {
                                // Allows only digits and limits length
                                const { value } = e.target;
                                if (/^\d*$/.test(value) && value.length <= 10) {
                                    handleChange(e);
                                }
                            }}
                            maxLength={10}
                            placeholder="10 digits"
                            className={inputClass}
                        />
                    </div>
                    <div className="flex-1">
                        <label className={labelClass}>Pincode</label>
                        <input
                            type="text"
                            name="pincode"
                            value={form.pincode}
                            onChange={(e) => {
                                // Allows only digits and limits length
                                const { value } = e.target;
                                if (/^\d*$/.test(value) && value.length <= 6) {
                                    handleChange(e);
                                }
                            }}
                            maxLength={6}
                            placeholder="6 digits PIN code"
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Flat / Building */}
                <div>
                    <label className={labelClass}>
                        Flat, House no., Building, Company, Apartment
                    </label>
                    <input
                        type="text"
                        name="flat"
                        value={form.flat}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                {/* Area */}
                <div>
                    <label className={labelClass}>
                        Area, Street, Sector, Village
                    </label>
                    <input
                        type="text"
                        name="area"
                        value={form.area}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                {/* Landmark */}
                <div>
                    <label className={labelClass}>Landmark (Optional)</label>
                    <input
                        type="text"
                        name="landmark"
                        value={form.landmark}
                        onChange={handleChange}
                      //  placeholder="E.g. near Apollo Hospital"
                        className={inputClass}
                    />
                </div>

                {/* City and State in a single row */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className={labelClass}>Town/City</label>
                        <input
                            type="text"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </div>
                    <div className="flex-1">
                        <label className={labelClass}>State</label>
                        <select
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            className={`${inputClass} appearance-none bg-white`} // Added appearance-none to better control styling
                        >
                            <option value="">Choose a state</option>
                            {states.map((state) => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>



                {/* Default Address Checkbox (Styled) */}
                <div className="pt-2">
                    <label className="inline-flex items-center cursor-pointer text-gray-700">
                        <input
                            type="checkbox"
                            name="defaultAddress"
                            checked={form.defaultAddress}
                            onChange={handleChange}
                            className="form-checkbox h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm font-medium">
                            Make this my default address
                        </span>
                    </label>
                </div>

                {/* Submit Button (Primary Color) */}
                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        Use This Address
                    </button>
                </div>
            </form>
        </div>
    );
}