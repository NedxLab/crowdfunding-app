"use client";

import React from "react";
import { useState } from "react";
import { useAccount } from "wagmi";
import UserCampaigns from "./userCampaigns";
import { useContext } from "react";
import { StateContext } from "./context";

const Profile = () => {
  const { address } = useAccount();
  const [campaigns, setCampaigns] = useState<any>([]);
  const { getCampaignsByEntrepreneur }: any = useContext(StateContext);
  const allCampaigns = getCampaignsByEntrepreneur(address);
  allCampaigns
    .then((res: any) => {
      setCampaigns(res);
    })
    .catch((err: any) => {
      console.log(err);
    });
  return (
    <>
      <div className="w-screen flex flex-col items-center justify-around">
        <div className="mt-20 w-11/12 border border-black h-28 text-center flex flex-row flex-wrap justify-evenly items-center mb-10 mxs:flex-col">
          <div className="flex flex-col items-center justify-center w-1/4 h-full  border-r border-black">
            <h1>Successful Campaigns</h1>
            <h1 className="text-2xl font-bold">200</h1>
          </div>
          <div className="flex flex-col items-center justify-center w-1/4 h-full  border-r border-black">
            <h1>Completed Campaigns</h1>
            <h1 className="text-2xl font-bold">150</h1>
          </div>
          <div className="flex flex-col items-center justify-center w-1/4 h-full  border-r border-black">
            <h1>Donations</h1>
            <h1 className="text-2xl font-bold">20000</h1>
          </div>
          <div className="flex flex-col items-center justify-center w-1/4 h-full ">
            <h1>Active Campaigns</h1>
            <h1 className="text-2xl font-bold">
              {campaigns ? campaigns.length : "0"}
            </h1>
          </div>
        </div>
        <h1 className="text-center font-bold text-2xl">All Campaigns</h1>
        <UserCampaigns />
        <a
          href="/api/auth/logout"
          onClick={() => {
            localStorage.clear();
            window.dispatchEvent(new Event("storage"));
          }}
          className="uppercase bg-blue-600 text-white mx-auto rounded-md px-5 py-2.5 text-xs"
        >
          Log Out
        </a>
      </div>
    </>
  );
};

export default Profile;
