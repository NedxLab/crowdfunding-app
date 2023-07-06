"use client";

import React from "react";
import { useContext } from "react";
import { StateContext } from "@/components/context";
import { useState } from "react";
import RequestForm from "@/components/requestForm";
import { useAccount } from "wagmi";
import { Web3Button } from "@web3modal/react";
import { Montserrat } from "next/font/google";

const quicksand = Montserrat({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

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
    getAllDonations,
  }: any = useContext(StateContext);
  const [amount, setAmount] = useState<any>();
  const [modal, setModal] = useState(false);
  const [donations, setDonations] = useState([]);
  const [contSpin, setContSpin] = useState(false);
  const [approveSpin, setApproveSpin] = useState(false);
  const [releaseSpin, setReleaseSpin] = useState(false);
  const [text, setText] = useState("Release Funds");

  // convert hex string
  const convertHexString = (value: string) => {
    const hexToInt = (hex: string) => parseInt(hex, 16);
    const weiToEth = (wei: number) => wei / Math.pow(10, 18);
    const inWei = hexToInt(value);
    const inEth = weiToEth(inWei);
    return inEth;
  };

  // get donations
  const allDonations = getAllDonations(params.slug);
  allDonations
    .then((res: any) => {
      setDonations(res);
    })
    .catch((err: any) => {
      console.log(err);
    });
  // console.log(getAllDonations(params.slug));

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
    setContSpin(true);
    const campaignId = params.slug;
    const correctAmount = amount * Math.pow(10, 18);
    const campParams = {
      correctAmount,
      campaignId,
    };
    const listen = donateToCampaign(campParams);
    listen
      .then((res: any) => {
        setContSpin(false);
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        setContSpin(false);
      });
  };

  //   get investor donations
  //   const donation = getAllDonators(params.slug);
  // console.log(campaigns[params.slug]);

  // approve funds
  const approveFunds = () => {
    const listen = approveFundReleaseRequest(params.slug);
    setApproveSpin(true);
    listen
      .then((res: any) => {
        setApproveSpin(false);
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        setApproveSpin(false);
      });
  };

  // release funds
  const releaseFunds = () => {
    const listen = releaseFundsToVendors(params.slug);
    setReleaseSpin(true);
    listen
      .then((res: any) => {
        setReleaseSpin(false);
        // if (res.status === 200) {
        //   setText("Released!");
        // }
        console.log(res);
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        setReleaseSpin(false);
      });
  };

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
          <div
            className={`${quicksand.className} flex flex-col w-screen px-6 my-10 lg:flex-row`}
          >
            <div className="flex flex-col w-full px-7 lg:w-7/12 mxs:w-full">
              <img src={campaigns[params.slug].imageUri} alt="image" />
              <h1 className="text-4xl font-semibold py-6 capitalize">
                {campaigns[params.slug].campaignTitle}
              </h1>
              <p className=" text-xs">
                {campaigns[params.slug].campaignDescription}
              </p>
            </div>
            <div className="w-full flex flex-col py-16 px-5 lg:w-5/12">
              <div className="h-3 w-10/12 bg-gray-300">
                <div
                  style={{ width: `${progressPercentage}%` }}
                  className={`h-full ${
                    progressPercentage < 70 ? "bg-blue-600" : "bg-green-600"
                  }`}
                ></div>
              </div>
              <span className="text-xs py-2 text-blue-600">
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
                Eth Needed with{" "}
                <div className="text-xl font-bold">{days} Days left</div>
              </span>
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

                  {!contSpin ? (
                    <button
                      type="submit"
                      className="px-3 py-2 my-3 bg-blue-600 text-white"
                    >
                      CONTRIBUTE
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="px-3 py-2 my-3 bg-blue-600 text-white flex flex-row items-center space-x-2"
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
              ) : progressPercentage > 50 && category === 0 && verified ? (
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
                  !releaseSpin ? (
                    <button
                      onClick={releaseFunds}
                      className="my-6 uppercase bg-blue-600 text-white mx-auto rounded-md px-5 py-2.5 text-xs"
                    >
                      {text}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="my-6 uppercase bg-blue-600 text-white mx-auto rounded-md px-5 py-2.5 text-xs flex flex-row items-center space-x-2"
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
                  )
                ) : category === 1 && campaigns[params.slug].requestCreated ? (
                  !approveSpin ? (
                    <button
                      onClick={approveFunds}
                      className="my-6 uppercase bg-blue-600 text-white mx-auto rounded-md px-5 py-2.5 text-xs"
                    >
                      Approve request
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="my-6 uppercase bg-blue-600 text-white mx-auto rounded-md px-5 py-2.5 text-xs flex flex-row items-center space-x-2"
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
                  )
                ) : (
                  ""
                )
              ) : (
                ""
              )}
              <div className="flex flex-row items-center justify-center gap-6 py-5">
                <img
                  src="https://img.freepik.com/free-icon/user_318-159711.jpg"
                  alt=" user"
                  className=" w-20 h-20 rounded-full"
                />
                <h1 className="text-sm font-bold text-center">
                  Created by{" "}
                  <span className="text-xs">
                    {campaigns[params.slug].entrepreneur}
                  </span>{" "}
                </h1>
              </div>{" "}
              <h1 className="py-4 text-2xl font-semibold">
                List of Investors who contributed
              </h1>
              {campaigns[params.slug].investors > 0 ? (
                <div className="flex flex-row">
                  <div>
                    {campaigns[params.slug].investors.map(
                      (investor: any, i: number) => (
                        <h1
                          className="bg-white px-2 py-1 text-blue-500"
                          key={i}
                        >
                          {investor} :
                        </h1>
                      )
                    )}
                  </div>
                  <div>
                    {donations && donations.length > 0
                      ? donations.map((amountD: any, i: number) => (
                          <h1
                            className="bg-white px-2 py-1 text-blue-500"
                            key={i}
                          >
                            {convertHexString(amountD["_hex"])} Eth
                          </h1>
                        ))
                      : ""}
                  </div>
                </div>
              ) : (
                <div>No Contributors yet.</div>
              )}
            </div>
          </div>
        </>
      ) : (
        ""
      )}
      <div className="fixed right-0 bottom-0 px-3 py-5">
        <Web3Button />
      </div>
    </>
  );
}
