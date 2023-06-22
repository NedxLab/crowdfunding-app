"use client";

import React from "react";
import Link from "next/link";

const Register = () => {
  return (
    <>
      <section className="antialiased bg-gray-100 text-gray-600 min-h-screen p-4">
        <div className="h-full">
          <div>
            <div
              className="relative px-4 sm:px-6 lg:px-8 pb-8 max-w-lg mx-auto"
              x-data="{ card: true }"
            >
              <div className="bg-white px-8 pb-6 rounded-b shadow-lg">
                <div className="text-center mb-6">
                  <div className="mb-2">
                    <img
                      className="-mt-8 inline-flex rounded-full"
                      src="https://avatars.githubusercontent.com/u/6250754?s=200&v=4"
                      width="64"
                      height="64"
                      alt="User"
                    />
                  </div>
                  <h1 className="text-xl leading-snug text-gray-800 font-semibold mb-2">
                    Web3 CrowdFunding App 🔥
                  </h1>
                  <div className="text-sm">
                    Support and create campaigns when you flow with us.
                  </div>
                </div>

                <div>
                  <div className="space-y-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="name"
                      >
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full"
                        type="text"
                        placeholder="Write your name"
                        required
                      />
                    </div>

                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="email"
                        >
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="email"
                          className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full"
                          type="email"
                          placeholder="Your email address"
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="number"
                        >
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="number"
                          className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full"
                          type="number"
                          placeholder="Phone Number"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="category"
                      >
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="category"
                        className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full min-w-full"
                        required
                      >
                        <option value="1">Entrepreneur</option>
                        <option value="2">Investor</option>
                        <option value="3">Vendor</option>
                      </select>
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="username"
                      >
                        Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="username"
                        className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full"
                        type="text"
                        placeholder="User Name"
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="password"
                      >
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="password"
                        className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full"
                        type="password"
                        placeholder="password"
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="confirmPassword"
                      >
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="confirmPassword"
                        className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full"
                        type="password"
                        placeholder="confirm password"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="mb-4">
                      <button className="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out w-full bg-[#297ce7] hover:border-[#297ce7] hover:border hover:bg-white hover:text-[#297ce7] focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo text-white focus:outline-none focus-visible:ring-2">
                        Register Now
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 italic text-center">
                      Already have an account?
                      <span className="mt-2 text-center text-sm leading-5 text-[#297ce7] max-w">
                        <Link
                          href="/login"
                          className="font-medium text-[#297ce7] hover:text-[#297ce7] focus:outline-none focus:underline transition ease-in-out duration-150"
                        >
                          {" "}
                          login
                        </Link>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
