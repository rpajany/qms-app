import React, { useState } from 'react';
import { replace, useNavigate } from 'react-router-dom';
import { Auth_Login_Service } from '../services/LoginService';
import { useAuth } from '../context/AuthContext';
import Audit_logo from '../assets/Audit-Logo.PNG';
import wave_2 from '../assets/wave_2.png';

export const Login = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    const [isSubmitting, setIsSubmitting] = useState(false); // Track Form submission state
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [loginData, setLoginData] = useState({ username: "", password: "" }); // username: "admin", password: "123" 


    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData((preve) => ({
            ...preve,
            [name]: value.trim()
        }));
    };

    // console.log('loginData', loginData);
    // console.log('user', user);

    const handle_FormSubmit = async (e) => {
        e.preventDefault();

        setErrorMessage("");
        setIsSubmitting(true);
        setLoading(true);

        const result = await Auth_Login_Service(loginData);
        // console.log('result.data :', result?.data[0])
        if (result.success) {

            setUser(result?.data[0]);
            // console.log('user', user);
            navigate('/', { replace: true });
        } else if (!result.success) {
            setErrorMessage(result.message);
        }

        setIsSubmitting(false);
        setLoading(false);
    };

    return (

        <div className="relative flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl flex flex-col lg:flex-row">

                {/* Logo Section */}
                <div className="hidden lg:flex items-center justify-center lg:w-1/2 bg-blue-50 p-6">
                    <div>
                        <img src={Audit_logo} alt="audit-logo" className="w-50" />
                    </div>


                </div>

                {/* Form Section */}
                <div className="w-full lg:w-1/2 p-8">
                    <div className="text-center">
                        <span className="text-3xl font-semibold text-gray-800">Login</span>
                    </div>
                    <form onSubmit={handle_FormSubmit} className="mt-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                onChange={handleChange}
                                value={loginData.username}
                                required
                                className="border border-gray-300 rounded py-2 px-4 block w-full focus:outline-none focus:ring-2 focus:ring-blue-700"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                onChange={handleChange}
                                value={loginData.password}
                                required
                                className="border border-gray-300 rounded py-2 px-4 block w-full focus:outline-none focus:ring-2 focus:ring-blue-700"
                            />
                        </div>
                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-2 px-4 rounded text-white font-bold ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-600'}`}
                            >
                                Login
                            </button>
                        </div>
                        {errorMessage && (
                            <span className="text-red-500 text-sm mt-4 block text-center">{errorMessage}</span>
                        )}
                    </form>
                </div>

                {/* Decorative Wave Image */}
                <div className="absolute bottom-0 left-0 mt-6 hidden lg:flex  ">
                    <img src={wave_2} alt="brand-logo" className="w-48" />
                </div>

            </div>

        </div>

    )
}
