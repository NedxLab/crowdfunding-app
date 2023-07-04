"use client";

import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";

const Campaign = ({ title, img, donated, amount, deadline }: any) => {
  const [donatedAmount, setDonatedAmount] = useState<number>();
  const [target, setTarget] = useState<number>();
  const [progressPercentage, setProgressPercentage] = useState<any>();

  // convert hex string
  const convertHexString = (value: string) => {
    const hexToInt = (hex: string) => parseInt(hex, 16);
    const weiToEth = (wei: number) => wei / Math.pow(10, 18);
    const inWei = hexToInt(value);
    const inEth = weiToEth(inWei);
    return inEth;
  };

  useEffect(() => {
    if (donated) {
      setDonatedAmount(convertHexString(donated));
    }
    if (amount) {
      setTarget(convertHexString(amount));
    }
    setProgressPercentage(
      (convertHexString(donated) / convertHexString(amount)) * 100
    );
  }, [donated, amount]);

  // days Remaining
  const days = (
    (new Date(parseInt(deadline) * 1000).getTime() - new Date().getTime()) /
    (1000 * 60 * 60 * 24)
  ).toFixed();

  return (
    <>
      <div className="flex flex-col gap-4 rounded-2xl border-[3px] border-[#15322b] p-4 h-80">
        <img src={img} alt="campaigns" className="h-1/2" />
        <div className="flex flex-col justify-around px-4 text-center gap-1">
          <h1 className="uppercase">{title}</h1>
          <div className="mx-auto h-3 w-10/12 bg-gray-300 rounded-lg">
            <div
              style={{ width: `${progressPercentage}%` }}
              className={`h-full ${
                progressPercentage < 70 ? "bg-blue-600" : "bg-green-600"
              }`}
            ></div>
          </div>
          <div className="flex flex-row justify-between text-xs">
            <div className="flex flex-col justify-center items-center gap-0">
              <h1>
                <span className="font-bold text-blue-600">{days} </span>
              </h1>
              <h1 className="text-xs text-[#777575] uppercase">Days left</h1>
            </div>
            <div className="flex flex-col">
              <h1>
                {" "}
                {donatedAmount ? donatedAmount.toFixed(2) : "0"}/
                <span className="font-bold text-blue-600">{target} </span> ETH
              </h1>
              <h1 className="text-xs text-[#777575] uppercase ">donated</h1>
            </div>
          </div>
        </div>
        <button className="text-sm border-[3px] border-[#15322b] px-2 py-1 rounded-xl">
          View Campaign
        </button>
      </div>
    </>
  );
};

export default Campaign;
