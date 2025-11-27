import { useState } from "react";
import axios from "axios";
import UserList from "./UserList";
import AlertModal from "./AlertModal";

function CreateUser() {
  const [isOpen, setIsOpen] = useState(false);

  const [form, setForm] = useState({
    user_name: "",
    user_email: "",
    user_pass: "",
    user_mobile: "",
  });

  const [errors, setErrors] = useState({});

  // ALERT STATE
  const [alert, setAlert] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const [reload, setReload] = useState(false);

  const showAlert = (type, title, message) => {
    setAlert({
      open: true,
      type,
      title,
      message,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!/^[A-Za-z\s]+$/.test(form.user_name)) {
      newErrors.user_name = ["Name cannot contain numbers or special characters"];
    }
    if (form.user_pass.length < 8) {
      newErrors.user_pass = ["Password must be at least 8 characters"];
    }
    if (!/^\d{10}$/.test(form.user_mobile)) {
      newErrors.user_mobile = ["Mobile number must be exactly 10 digits"];
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/users", {
        name: form.user_name,
        email: form.user_email,
        password: form.user_pass,
        mobile: form.user_mobile,
      });

      showAlert("success", "Success", "User created successfully!");

      setReload(!reload);

      setForm({
        user_name: "",
        user_email: "",
        user_pass: "",
        user_mobile: "",
      });

      setIsOpen(false);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        showAlert("error", "Error", "Failed to save user!");
      }
    }
  };

  return (
    <>
      {/* Add User Button */}
      <div className="flex justify-center p-6">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg"
        >
         + Add User
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-8 relative">

            {/* Fake hidden form prevents autofill */}
            <form autoComplete="off" style={{ display: "none" }}>
              <input type="text" name="fake_user" />
              <input type="password" name="fake_pass" />
            </form>

            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-xl font-bold"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>

            <h1 className="text-2xl font-bold text-center mb-6">Create User</h1>

            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">

              {/* Name */}
              <div>
                <input
                  type="text"
                  name="user_name"
                  autoComplete="off"
                  value={form.user_name}
                  className="border rounded-lg p-3 w-full"
                  placeholder="Enter Username"
                  onChange={(e) => setForm({ ...form, user_name: e.target.value })}
                />
                {errors.user_name && (
                  <span className="text-red-500 text-sm">{errors.user_name[0]}</span>
                )}
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="user_email"
                  autoComplete="new-email"
                  value={form.user_email}
                  className="border rounded-lg p-3 w-full"
                  placeholder="Enter Email"
                  onChange={(e) => setForm({ ...form, user_email: e.target.value })}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">{errors.email[0]}</span>
                )}
              </div>

              {/* Password */}
              <div>
                <input
                  type="password"
                  name="user_pass"
                  autoComplete="new-password"
                  value={form.user_pass}
                  className="border rounded-lg p-3 w-full"
                  placeholder="Enter Password"
                  onChange={(e) => setForm({ ...form, user_pass: e.target.value })}
                />
                {errors.user_pass && (
                  <span className="text-red-500 text-sm">{errors.user_pass[0]}</span>
                )}
              </div>

              {/* Mobile */}
              <div>
                <input
                  type="text"
                  name="user_mobile"
                  autoComplete="off"
                  value={form.user_mobile}
                  className="border rounded-lg p-3 w-full"
                  placeholder="Enter Mobile Number"
                  maxLength={10}
                  onChange={(e) => setForm({ ...form, user_mobile: e.target.value })}
                />
                {errors.user_mobile && (
                  <span className="text-red-500 text-sm">{errors.user_mobile[0]}</span>
                )}
              </div>

              {/* Save */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg"
                >
                  Save User
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Alert Popup */}
      <AlertModal
        isOpen={alert.open}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        autoClose={true}
        onClose={() => setAlert({ ...alert, open: false })}
      />

      {/* User List */}
      <UserList reload={reload} />
    </>
  );
}

export default CreateUser;
