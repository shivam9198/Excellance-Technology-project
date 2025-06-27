import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import baseurl from "../utils/baseurl";

const AuthForm = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const url = isRegister ? "/register" : "/login";

    try {
      const response = await axios.post(baseurl + url, formData, {
        withCredentials: true,
      });

      // ✅ Save user data to localStorage for access in Dashboard
      localStorage.setItem("user", JSON.stringify(response.data));

      // ✅ Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-center">
          {isRegister ? "Register" : "Login"}
        </h2>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        {isRegister && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isRegister ? "Register" : "Login"}
        </button>

        <p
          onClick={() => {
            setIsRegister(!isRegister);
            setError("");
          }}
          className="text-sm text-center text-blue-500 cursor-pointer mt-2"
        >
          {isRegister
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
