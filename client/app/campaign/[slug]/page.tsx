"use client";

import React from "react";
import { useContext } from "react";
import { StateContext } from "@/components/context";
import { useState } from "react";
import RequestForm from "@/components/requestForm";
import { useAccount } from "wagmi";

export default function Page({ params }: { params: { slug: string } }) {
  const [campaigns, setCampaigns] = useState<any>();
  const [progressPercentage, setProgressPercentage] = useState<any>();
  const [category, setCategory] = useState();
  const [verified, setVerified] = useState();
  const { address } = useAccount();
  const {
    getCampaigns,
    donateToCampaign,
    getAllDonators,
    createFundReleaseRequest,
    approveFundReleaseRequest,
    releaseFundsToVendors,
    getUserByAddress,
  }: any = useContext(StateContext);
  const [amount, setAmount] = useState<any>();
  const [modal, setModal] = useState(false);

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
  // console.log(
  //   new Date(parseInt(campaigns[params.slug].deadline["_hex"]) * 1000)
  // );
  // console.log(campaigns[params.slug]);
  // get user categories
  if (address) {
    const checkUSer = getUserByAddress(address);
    checkUSer
      .then((res: any) => {
        setCategory(res.category);
        setVerified(res.verified);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
  // handle submits
  const handleSubmit = (event: any) => {
    event.preventDefault();
    const campaignId = params.slug;
    const correctAmount = amount * Math.pow(10, 18);
    const campParams = {
      correctAmount,
      campaignId,
    };
    donateToCampaign(campParams);
  };

  //   get investor donations
  //   const donation = getAllDonators(params.slug);
  // console.log(campaigns[params.slug].requestCreated);

  // days Remaining
  const days = (
    (new Date(
      parseInt(campaigns ? campaigns[params.slug].deadline["_hex"] : "") * 1000
    ).getTime() -
      new Date().getTime()) /
    (1000 * 60 * 60 * 24)
  ).toFixed();

  return (
    <>
      {campaigns ? (
        <>
          {" "}
          <h1 className="text-4xl font-bold text-center py-8">
            Campaign Details
          </h1>
          <div className="flex flex-col w-screen px-6 my-10 md:flex-row">
            <div className="flex flex-col w-full px-7 md:w-7/12 mxs:w-full">
              <img src={campaigns[params.slug].imageUri} alt="image" />
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
              <div className="pt-6 text-2xl font-bold">{days} Days left</div>
              {category === 1 ? (
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
              ) : (
                <button className="px-3 py-2 my-3 bg-blue-600 text-white">
                  Only Investors can Contribute
                </button>
              )}
              <p>
                Minimum Contribution:{" "}
                <span className="font-medium text-blue-700">
                  {parseInt(campaigns[params.slug].minimumContribution["_hex"])}{" "}
                  Eth
                </span>
              </p>
              {modal ? (
                <RequestForm
                  modal={modal}
                  setModal={setModal}
                  limit={convertHexString(
                    campaigns[params.slug].raisedAmount["_hex"]
                  ).toFixed(2)}
                  id={params.slug}
                />
              ) : progressPercentage > 0.5 && category === 0 ? (
                <button
                  onClick={() => setModal(true)}
                  className="my-6 uppercase bg-blue-600 text-white mx-auto rounded-md px-5 py-2.5 text-xs"
                >
                  Create Funds Release request
                </button>
              ) : (
                ""
              )}
              {address && verified ? (
                category === 0 && campaigns[params.slug].requestCreated ? (
                  <button
                    onClick={() => {
                      releaseFundsToVendors(params.slug);
                    }}
                    className="my-6 uppercase bg-blue-600 text-white mx-auto rounded-md px-5 py-2.5 text-xs"
                  >
                    Release Funds
                  </button>
                ) : category === 1 && campaigns[params.slug].requestCreated ? (
                  <button
                    onClick={() => {
                      approveFundReleaseRequest(params.slug);
                    }}
                    className="my-6 uppercase bg-blue-600 text-white mx-auto rounded-md px-5 py-2.5 text-xs"
                  >
                    Approve request
                  </button>
                ) : (
                  ""
                )
              ) : (
                "button"
              )}

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
        </>
      ) : (
        ""
      )}
    </>
  );
}
