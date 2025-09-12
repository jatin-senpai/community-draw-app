"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { httpUrl } from "@/components/config";

export default function Signin() {
    const router = useRouter();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    async function signinnn() {
        try{
            const res = await axios.post(`${httpUrl}/signin`, {
                email: emailRef.current?.value,
                password: passwordRef.current?.value,
            });

            const token = res.data.token;
            localStorage.setItem("token", token);
            if (res.status == 200) {
                router.push("/dashboard");
            }
        }
        catch(err){
            alert("Sign in failed. Please check your credentials and try again.");
        }
        
    }

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
            <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-900 p-10 rounded-2xl shadow-2xl w-full max-w-md gap-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Sign In to Your Account
                </h2>
                <p className="text-gray-500 dark:text-gray-300 mb-4 text-center">
                    Welcome back! Please enter your details.
                </p>

                <div className="flex flex-col gap-4 w-full">
                    <input
                        className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 
                                   dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none 
                                   focus:ring-2 focus:ring-blue-400 transition"
                        type="email"
                        ref={emailRef}
                        placeholder="Email"
                    />
                    <input
                        className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 
                                   dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none 
                                   focus:ring-2 focus:ring-blue-400 transition"
                        type="password"
                        ref={passwordRef}
                        placeholder="Password"
                    />
                    <button
                        onClick={signinnn}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 
                                   rounded-lg transition w-full shadow"
                    >
                        Sign In
                    </button>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <>
                        Don't have an account?{" "}
                        <a href="/signup" className="text-blue-600 hover:underline">
                            Sign Up
                        </a>
                    </>
                </div>
            </div>
        </div>
    );
}
