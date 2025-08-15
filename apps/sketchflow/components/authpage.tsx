"use client";
import { useRouter } from "next/router";
export function AuthPage({isSignin}:{isSignin:boolean}) {
    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
            <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-900 p-10 rounded-2xl shadow-2xl w-full max-w-md gap-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {isSignin ? 'Sign In to Your Account' : 'Create an Account'}
                </h2>
                <p className="text-gray-500 dark:text-gray-300 mb-4 text-center">
                    {isSignin ? 'Welcome back! Please enter your details.' : 'Join us! Please fill in your details.'}
                </p>
                <form className="flex flex-col gap-4 w-full">
                    {!isSignin && (
                        <input
                            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            type="text"
                            name="name"
                            placeholder="Name"
                            autoComplete="name"
                            required
                        />
                    )}
                    <input
                        className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        type="email"
                        name="email"
                        placeholder="Email"
                        autoComplete="email"
                        required
                    />
                    <input
                        className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        type="password"
                        name="password"
                        placeholder="Password"
                        autoComplete={isSignin ? "current-password" : "new-password"}
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition w-full shadow"
                    >
                        {isSignin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {isSignin ? (
                        <>
                            Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign Up</a>
                        </>
                    ) : (
                        <>
                            Already have an account? <a href="/signin" className="text-blue-600 hover:underline">Sign In</a>
                        </>
                    )}
                </div>
            </div>
            

        </div>
    )
}