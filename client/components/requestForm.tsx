"use client";

import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { StateContext } from "./context";

const RequestForm = ({ modal, setModal, limit, id }: any) => {
  const { createFundReleaseRequest }: any = useContext(StateContext);
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // handle submits
  const handleSubmit = (event: any) => {
    event.preventDefault();
    setSpinner(true);
    const params: any = {
      id,
      amount,
      address,
    };
    // const response =
    const listen = createFundReleaseRequest(params);
    listen
      .then((res: any) => {
        setSpinner(false);
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        setSpinner(false);
        setModal(false);
      });
    // setModal(false);
  };
  return (
    <>
      <div className=" bg-gray-50 flex flex-col justify-center py-3 sm:px-6 lg:px-8 px-6">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <span className="text-red-500">{errorMessage}</span>
          <div className="bg-white py-2 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium leading-5  text-gray-700"
                >
                  Amount
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    required
                  />
                  <div className="hidden absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium leading-5 text-gray-700"
                >
                  Address
                </label>
                <div className="mt-1 rounded-md shadow-sm">
                  <input
                    id="address"
                    name="address"
                    type="text"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <span className="block w-full rounded-md shadow-sm">
                  {!spinner ? (
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-[#297ce7] hover:border-[#297ce7] hover:border hover:bg-white hover:text-[#297ce7] focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                    >
                      Create
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="w-full  justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-[#297ce7] hover:border-[#297ce7] hover:border hover:bg-white hover:text-[#297ce7] focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out flex flex-row items-center space-x-2"
                      disabled
                    >
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </button>
                  )}
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestForm;
