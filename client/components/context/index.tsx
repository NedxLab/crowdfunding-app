"use client";

import abi from "../../../server/artifacts/contracts/CampaignRegistry.sol/CampaignRegistry.json";
// import { getGlobalState, setGlobalState } from '../store'
import { ethers } from "ethers";
import { ICreateCampaign } from "@/types/types";
import { IRegisterUser } from "@/types/types";
import { ILoginUser } from "@/types/types";
import React, { useContext, createContext } from "react";
import { useRouter } from "next/navigation";

export const StateContext = createContext(null);

export const StateContextProvider = ({ children }: any) => {
  // declare next router
  const router = useRouter();
  if (typeof window !== "undefined") {
    const { ethereum }: any = window;
    const contractAddress = "0x0865AC9F64cBA8B5939c495815BBAB444328d5ea";
    const contractAbi = abi.abi;
    let tx;

    const getEtheriumContract = async () => {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );

      return contract;
    };

    // Register User
    const registerUSer = async ({
      email: _email,
      password: _password,
      category: _category,
    }: IRegisterUser) => {
      try {
        if (!ethereum) return alert("Please install Metamask");

        const contract = await getEtheriumContract();

        const provider = new ethers.providers.Web3Provider(ethereum);
        const gasLimit = 1500000;
        const gasPrice = await provider.getGasPrice();
        const extraGas = ethers.utils.parseUnits("100", "gwei");

        tx = await contract.registerUser(_email, _password, _category, {
          gasLimit: gasLimit,
          gasPrice: gasPrice.add(extraGas),
        });
        await tx.wait();
        // router.push("/login");
        console.log(tx);
      } catch (error) {
        reportError(error);
      }
    };
    // login users
    const loginUSer = async ({
      email: _email,
      password: _password,
    }: ILoginUser) => {
      try {
        if (!ethereum) return alert("Please install Metamask");

        const contract = await getEtheriumContract();

        const provider = new ethers.providers.Web3Provider(ethereum);
        const gasLimit = 1500000;
        const gasPrice = await provider.getGasPrice();
        const extraGas = ethers.utils.parseUnits("100", "gwei");

        tx = await contract.loginUser(_email, _password, {
          gasLimit: gasLimit,
          gasPrice: gasPrice.add(extraGas),
        });
        // router.push("/");
        // console.log(tx);
        return tx;
      } catch (error) {
        reportError(error);
      }
    };
    // create campaign
    const createCampaigns = async ({
      amount: Amount,
      date: _deadline,
      image: _imageUri,
      title: _campaignTitle,
      description: _campaignDescription,
    }: ICreateCampaign) => {
      try {
        if (!ethereum) return alert("Please install Metamask");

        const contract = await getEtheriumContract();

        const provider = new ethers.providers.Web3Provider(ethereum);
        const gasLimit = 1500000;
        const gasPrice = await provider.getGasPrice();
        const extraGas = ethers.utils.parseUnits("100", "gwei");

        let _targetAmount = ethers.utils.parseEther(Amount);
        tx = await contract.createCampaign(
          _targetAmount,
          _deadline,
          _imageUri,
          _campaignTitle,
          _campaignDescription,
          {
            gasLimit: gasLimit,
            gasPrice: gasPrice.add(extraGas),
          }
        );
        await tx.wait();
        console.log(tx);
      } catch (error) {
        reportError(error);
      }
    };
    // create campaign
    const getCampaigns = async () => {
      try {
        if (!ethereum) return alert("Please install Metamask");

        const contract = await getEtheriumContract();

        const provider = new ethers.providers.Web3Provider(ethereum);
        const gasLimit = 1500000;
        const gasPrice = await provider.getGasPrice();
        const extraGas = ethers.utils.parseUnits("100", "gwei");

        // let _targetAmount = ethers.utils.parseEther(Amount);
        tx = await contract.getCampaigns({
          gasLimit: gasLimit,
          gasPrice: gasPrice.add(extraGas),
        });
        // await tx.wait();
        // console.log(tx);
        return tx;
      } catch (error) {
        reportError(error);
      }
    };
    return (
      <StateContext.Provider
        value={
          {
            createCampaigns,
            registerUSer,
            loginUSer,
            getCampaigns,
          } as any
        }
      >
        {children}
      </StateContext.Provider>
    );
  } else {
    return;
  }
};
// export const useStateContext = () => useContext(StateContext);
// export { createCampaigns, registerUSer, loginUSer, getCampaigns };
