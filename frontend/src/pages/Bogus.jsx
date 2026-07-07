import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Bogus() {
  const navigate = useNavigate();

  useEffect(() => {
    const bogusMode = localStorage.getItem("bogusMode");

    if (!bogusMode) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("bogusMode");

    window.location.replace("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center w-96">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Welcome User 🎭
        </h2>
        <p className="mb-6 text-gray-600">
          This is your dashboard.
        </p>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Bogus;