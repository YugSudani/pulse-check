import api from "../lib/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        pwd: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // ----------------- VALIDATION FUNCTION -----------------
    const validate = () => {
        let newErrors = {};

        // NAME VALIDATION
        if (!/^[A-Za-z ]+$/.test(form.name)) {
            newErrors.name = "Name must contain only letters.";
        }
        if (form.name.length < 2) {
            newErrors.name = "Name must be at least 2 characters.";
        }
        if (form.name.length > 30) {
            newErrors.name = "Name cannot exceed 30 characters.";
        }

        // EMAIL VALIDATION
        if (!form.email) {
            newErrors.email = "Email is required.";
        }

        // PASSWORD VALIDATION
        if (form.pwd.length < 6) {
            newErrors.pwd = "Password must be at least 6 characters.";
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.pwd)) {
            newErrors.pwd = "Password must include at least one special character.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        console.log("Signup data:", form);

        try {
            const response = await api.post(`/user/signup`, form);
            if (!response.data.success) {
                alert("failed to register");
            } else {
                navigate("/login", { replace: true });
            }
        } catch (error) {
            alert("Server error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0F17] px-6">

            <div className="w-full max-w-md bg-[#0D121C] p-8 rounded-2xl shadow-xl border border-gray-800">

                {/* Title */}
                <h2 className="text-center text-3xl font-bold text-white mb-6">
                    Create Account<span className="text-green-500">.</span>
                </h2>

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* --------- NAME FIELD --------- */}
                    <div>
                        <label className="text-gray-300 block mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-2 bg-[#121A28] border rounded-lg text-gray-200 placeholder-gray-500 outline-none
                                ${errors.name ? "border-red-500" : "border-gray-700 focus:ring-2 focus:ring-green-500"}`}
                        />
                        {errors.name && (
                            <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* --------- EMAIL FIELD --------- */}
                    <div>
                        <label className="text-gray-300 block mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-2 bg-[#121A28] border rounded-lg text-gray-200 placeholder-gray-500 outline-none
                                ${errors.email ? "border-red-500" : "border-gray-700 focus:ring-2 focus:ring-green-500"}`}
                        />
                        {errors.email && (
                            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* --------- PASSWORD FIELD --------- */}
                    <div>
                        <label className="text-gray-300 block mb-1">Password</label>
                        <input
                            type="password"
                            name="pwd"
                            placeholder="Enter password"
                            value={form.pwd}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-2 bg-[#121A28] border rounded-lg text-gray-200 placeholder-gray-500 outline-none
                                ${errors.pwd ? "border-red-500" : "border-gray-700 focus:ring-2 focus:ring-green-500"}`}
                        />
                        {errors.pwd && (
                            <p className="text-red-400 text-sm mt-1">{errors.pwd}</p>
                        )}
                    </div>

                    {/* SIGNUP BUTTON */}
                    <button
                        type="submit"
                        className="w-full bg-green-500 py-3 rounded-lg text-black font-semibold text-lg hover:bg-green-400 transition"
                    >
                        Sign Up
                    </button>
                </form>

                {/* Bottom text */}
                <p className="text-center text-gray-400 mt-6 text-sm">
                    Already have an account?{" "}
                    <button onClick={() => navigate("/login", { replace: true })} className="text-green-500 cursor-pointer hover:underline">
                        Login
                    </button>
                </p>

            </div>
        </div>
    );
}
