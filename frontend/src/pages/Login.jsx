import { useState } from "react";
import API from "../api";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const { data } = await API.post("/login", form);

   if (data.success) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  navigate("/dashboard", { replace: true });
}
 else if (data.redirectBogus) {
  // 🚨 Clear real login session
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Activate bogus mode
  localStorage.setItem("bogusMode", "true");

 navigate("/myuser", { replace: true });
}
    else {
      alert(`Wrong password. Attempts left: ${data.attemptsLeft}`);
    }
  } catch (error) {
    console.log(error);
  }
};
useEffect(() => {
  const bogusMode = localStorage.getItem("bogusMode");
  const token = localStorage.getItem("token");

  if (bogusMode) {
    window.location.replace("/myuser");
    return;
  }

  if (token) {
    navigate("/dashboard", { replace: true });
  }
}, [navigate]);
 return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
        Login
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>

      <p className="text-center mt-6 text-gray-600">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-blue-600 font-semibold hover:underline"
        >
          Signup
        </Link>
      </p>
    </div>
  </div>
);
}

export default Login;