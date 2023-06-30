"use client";

import React from "react";
import { useContext } from "react";
import { StateContext } from "@/components/context";
import { useState } from "react";

export default function Page({ params }: { params: { slug: string } }) {
  const [campaigns, setCampaigns] = useState<any>();
  const [progressPercentage, setProgressPercentage] = useState<any>();
  const { getCampaigns, donateToCampaign, getAllDonators }: any =
    useContext(StateContext);
  const [amount, setAmount] = useState<any>();

  // convert hex string
  const convertHexString = (value: string) => {
    const hexToInt = (hex: string) => parseInt(hex, 16);
    const weiToEth = (wei: number) => wei / Math.pow(10, 18);
    const inWei = hexToInt(value);
    const inEth = weiToEth(inWei);
    return inEth;
  };

  //   get campaigns
  const allCampaigns = getCampaigns();

  allCampaigns
    .then((res: any) => {
      setCampaigns(res);
      setProgressPercentage(
        (convertHexString(campaigns[params.slug].raisedAmount["_hex"]) /
          convertHexString(campaigns[params.slug].targetAmount["_hex"])) *
          100
      );
    })
    .catch((err: any) => {
      console.log(err);
    });
  //   console.log(campaigns[params.slug]);

  // handle submits
  const handleSubmit = (event: any) => {
    event.preventDefault();
    const campaignId = params.slug;
    const correctAmount = amount * 100000000 * 10000000;
    const campParams = {
      correctAmount,
      campaignId,
    };
    donateToCampaign(campParams);
  };

  //   //   get investor donations
  //   //   const donation = getAllDonators(params.slug);
  //   console.log(
  //     parseInt(
  //       "0x42a4fda80000000000000000000000000000000000000000000000000000000000000002"
  //     )
  //   );

  return (
    <>
      {campaigns ? (
        <div className="flex flex-col w-screen px-6 my-5 md:flex-row">
          <div className="flex flex-col w-full px-7 md:w-7/12 mxs:w-full">
            <img
              src="https://skywarriorthemes.com/fundingpress/wp-content/uploads/2020/08/1-4-850x530.jpg"
              alt="image"
            />
            <h1 className="text-4xl font-semibold py-6 capitalize">
              {campaigns[params.slug].campaignTitle}
            </h1>
            <p className="text-center text-sm">
              {campaigns[params.slug].campaignDescription}
            </p>
          </div>
          <div className="w-full flex flex-col py-16 px-5 md:w-5/12">
            <div className="h-3 w-10/12 bg-gray-300">
              <div
                style={{ width: `${progressPercentage}%` }}
                className={`h-full ${
                  progressPercentage < 70 ? "bg-blue-600" : "bg-green-600"
                }`}
              ></div>
            </div>
            <span className="text-xs text-blue-600">
              {Math.floor(progressPercentage)}% funded
            </span>

            <div className="pt-6 text-2xl font-bold">
              {convertHexString(
                campaigns[params.slug].raisedAmount["_hex"]
              ).toFixed(2)}{" "}
              Eth
            </div>
            <span className="text-lg text-gray-500">
              raised out of{" "}
              {convertHexString(campaigns[params.slug].targetAmount["_hex"])}{" "}
              Eth Needed.
            </span>
            <form onSubmit={handleSubmit}>
              <div className="mt-6">
                <label
                  htmlFor="Amount"
                  className="block text-sm font-medium leading-5 text-gray-700"
                >
                  Amount
                </label>
                <div className="mt-1 rounded-md shadow-sm">
                  <input
                    id="Amount"
                    name="amount"
                    type="number"
                    min={parseInt(
                      campaigns[params.slug].minimumContribution["_hex"]
                    )}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-3 py-2 my-3 bg-blue-600 text-white"
              >
                CONTRIBUTE
              </button>
            </form>
            <p>
              Minimum Contribution:{" "}
              <span className="font-medium text-blue-700">
                {parseInt(campaigns[params.slug].minimumContribution["_hex"])}{" "}
                Eth
              </span>
            </p>

            <h1 className="py-4 text-2xl font-semibold">
              List of Investors who contributed
            </h1>
            {campaigns[params.slug].investors > 0 ? (
              campaigns[params.slug].investors.map(
                (investor: any, i: number) => (
                  <code className="bg-white px-2 py-1 text-blue-500" key={i}>
                    {investor}
                  </code>
                )
              )
            ) : (
              <div>No Contributors yet.</div>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
