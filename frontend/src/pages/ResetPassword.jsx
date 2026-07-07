import { useState } from "react";
import { useNavigate, useLocation,Navigate } from "react-router-dom";
import API from "../api";

function ResetPassword() {
  const [form, setForm] = useState({
    otp: "",
    newPassword: "",
  });

  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/reset-password", {
        email,
        otp: form.otp,
        newPassword: form.newPassword,
      });

      setMessage(data.message);

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);

    } catch (err) {
      setMessage(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Reset Password
        </h2>

        {message && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={form.otp}
            onChange={handleChange}
            className="w-full mb-4 p-3 border rounded-lg"
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full mb-6 p-3 border rounded-lg"
          />

          <button className="w-full bg-blue-600 text-white p-3 rounded-lg">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;