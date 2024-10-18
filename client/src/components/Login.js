import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // Initialize useNavigate

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", formData);
            setMessage(res.data.message);
            
            // Navigate to home page after successful login
            if (res.data.token) { // Assuming the response contains a token on successful login
                // You might want to store the token in local storage or context here
                localStorage.setItem("token", res.data.token); // Store token if needed
                navigate("/"); // Navigate to home page
            }
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-2xl mb-4">Login</h2>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border p-2 mb-4 w-full"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border p-2 mb-4 w-full"
                />
                <button className="bg-blue-500 text-white p-2 w-full">Login</button>
                {message && <p className="mt-4 text-red-500">{message}</p>}
            </form>
        </div>
    );
};

export default Login;