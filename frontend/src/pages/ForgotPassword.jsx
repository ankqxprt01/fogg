import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [form, setForm] = useState({ email: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/forgot-password", {
        email: form.email,
      });

      // setMessage(`OTP sent! (DEV ONLY: ${data.otp})`);
      setMessage("Sending OTP...");

     // show OTP sent message after API success
    setTimeout(() => {
      setMessage("OTP sent to your email!");

      navigate("/reset-password", {
        state: { email: form.email },
      });
    }, 3000); // 3 seconds delay
    } catch (err) {
      console.log(err.response?.data);
      setMessage(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Forgot Password
        </h2>

        {message && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;