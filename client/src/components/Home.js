import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Home = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <h1 className="text-3xl mb-6">Welcome to the Home Page!</h1>
            <div className="flex space-x-4">
                <button
                    onClick={() => navigate("/signup")} // Navigate to Signup
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Sign Up
                </button>
                <button
                    onClick={() => navigate("/login")} // Navigate to Login
                    className="bg-green-500 text-white p-2 rounded"
                >
                    Login
                </button>
                <button
                    onClick={() => navigate("/greencover")} // Navigate to Login
                    className="bg-green-500 text-white p-2 rounded"
                >
                    Green Cover Estimator
                </button>
                <button
                    onClick={() => navigate("/treecount")} // Navigate to Login
                    className="bg-green-500 text-white p-2 rounded"
                >
                    Trees Count
                </button>
                <button
                    onClick={() => navigate("/treespecies")} // Navigate to Login
                    className="bg-green-500 text-white p-2 rounded"
                >
                    Trees Species
                </button>
                <button
                    onClick={() => navigate("/optimalpathing")} // Navigate to Login
                    className="bg-green-500 text-white p-2 rounded"
                >
                    Optimal Pathing
                </button>
                <button
                    onClick={() => navigate("/historicaldata")} // Navigate to Login
                    className="bg-green-500 text-white p-2 rounded"
                >
                    Historical Data
                </button>
            </div>
        </div>
    );
};

export default Home;
