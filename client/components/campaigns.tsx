"use client";

import React from "react";
import Campaign from "./campaign";
import { useContext } from "react";
import { StateContext } from "./context";
import { useState } from "react";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<any>([]);
  const { getCampaigns }: any = useContext(StateContext);
  const allCampaigns = getCampaigns();
  allCampaigns
    .then((res: any) => {
      setCampaigns(res);
    })
    .catch((err: any) => {
      console.log(err);
    });
  // console.log(
  //   parseInt("0x1b1ae4d6e2ef500000", 16) / Math.pow(10, 18),
  //   campaigns
  // );

  return (
    <div className="flex flex-row items-center justify-center flex-wrap gap-7 mt-28 mb-10 mxs:px-6">
      {campaigns
        ? campaigns.map((camp: any, i: any) => (
            <Campaign
              key={i}
              title={camp.campaignTitle}
              img={camp.imageUri}
              donated={camp.raisedAmount["_hex"]}
              amount={camp.targetAmount["_hex"]}
            />
          ))
        : ""}
    </div>
  );
};

export default Campaigns;
