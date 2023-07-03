"use client";

import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";

const Campaign = ({ title, img, donated, amount }: any) => {
  const [donatedAmount, setDonatedAmount] = useState<number>();
  const [target, setTarget] = useState<number>();
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
  }, [donated, amount]);

  return (
    <>
      <div className="flex flex-col gap-4 bg-white h-72">
        <img src={img} alt="campaigns" className="h-1/2" />
        <div className="px-4 text-center gap-6">
          <h1 className="uppercase">{title}</h1>

          <h1 className="text-xs text-[#777575] uppercase my-7">
            donated: {donatedAmount ? donatedAmount.toFixed(2) : "0"}/
            <span className="font-bold text-blue-600">{target} </span> ETH
          </h1>
        </div>
      </div>
    </>
  );
};

export default Campaign;
