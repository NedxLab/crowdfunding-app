"use client";

import abi from "../../../server/artifacts/contracts/CampaignRegistry.sol/CampaignRegistry.json";
// import { getGlobalState, setGlobalState } from '../store'
import { ethers } from "ethers";
import { ICreateCampaign } from "@/types/types";
import { IRegisterUser } from "@/types/types";
import { ILoginUser } from "@/types/types";
import React, { useContext, createContext } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

export const StateContext = createContext(null);

export const StateContextProvider = ({ children }: any) => {
  const { address, isConnected, isDisconnected } = useAccount();

  // declare next router
  const router = useRouter();
  if (typeof window !== "undefined") {
    const { ethereum }: any = window;
    const contractAddress = "0xF64c0D86691F235e7a57AB48bA64476c9aBE921F";
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
      minAmount: minimumContribution,
      description: _campaignDescription,
    }: ICreateCampaign) => {
      if (isDisconnected) {
        return;
      }
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
          minimumContribution,
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
    // Donate to campaign
    const donateToCampaign = async ({
      correctAmount,
      campaignId: _campaignId,
    }: any) => {
      if (isDisconnected) {
        return;
      }
      try {
        if (!ethereum) return alert("Please install Metamask");

        const contract = await getEtheriumContract();

        const provider = new ethers.providers.Web3Provider(ethereum);
        const gasLimit = 1500000;
        const gasPrice = await provider.getGasPrice();
        const extraGas = ethers.utils.parseUnits("100", "gwei");

        // _campaignId = ethers.utils.parseEther(_campaignId);
        tx = await contract.donateToCampaign(_campaignId, {
          value: correctAmount,
          gasLimit: gasLimit,
          gasPrice: gasPrice.add(extraGas),
        });

        await tx.wait();
        // console.log(tx);
        return tx;
      } catch (error) {
        reportError(error);
      }
    };

    // get All Donators
    const getAllDonators = async (_campaignId: any) => {
      try {
        if (!ethereum) return alert("Please install Metamask");

        const contract = await getEtheriumContract();

        const provider = new ethers.providers.Web3Provider(ethereum);
        const gasLimit = 1500000;
        const gasPrice = await provider.getGasPrice();
        const extraGas = ethers.utils.parseUnits("100", "gwei");

        // let _targetAmount = ethers.utils.parseEther(Amount);
        tx = await contract.donateToCampaign(_campaignId, {
          gasLimit: gasLimit,
          gasPrice: gasPrice.add(extraGas),
        });
        // await tx.wait();
        console.log(tx);
        return tx;
      } catch (error) {
        reportError(error);
      }
    };
    // get All Donations
    const getAllDonations = async (_campaignId: any) => {
      if (isDisconnected) {
        return;
      }
      try {
        if (!ethereum) return alert("Please install Metamask");

        const contract = await getEtheriumContract();

        const provider = new ethers.providers.Web3Provider(ethereum);
        const gasLimit = 1500000;
        const gasPrice = await provider.getGasPrice();
        const extraGas = ethers.utils.parseUnits("100", "gwei");

        // let _targetAmount = ethers.utils.parseEther(Amount);
        tx = await contract.getAllDonations(_campaignId, {
          gasLimit: gasLimit,
          gasPrice: gasPrice.add(extraGas),
        });
        // await tx.wait();
        console.log(parseInt(tx));
        return tx;
      } catch (error) {
        reportError(error);
      }
    };

    // get Investor Donations
    const getInvestorDonations = async (_campaignId: any) => {
      try {
        if (!ethereum) return alert("Please install Metamask");

        const contract = await getEtheriumContract();

        const provider = new ethers.providers.Web3Provider(ethereum);
        const gasLimit = 1500000;
        const gasPrice = await provider.getGasPrice();
        const extraGas = ethers.utils.parseUnits("100", "gwei");

        // let _targetAmount = ethers.utils.parseEther(Amount);
        tx = await contract.getAllDonators(_campaignId, {
          gasLimit: gasLimit,
          gasPrice: gasPrice.add(extraGas),
        });

        console.log(tx);
        return tx;
      } catch (error) {
        reportError(error);
      }
    };
    // get Campaigns By Entrepreneur
    const getCampaignsByEntrepreneur = async (address: any) => {
      if (isDisconnected) {
        return;
      }
      try {
        // if (!ethereum) return alert("Please install Metamask");

        const contract = await getEtheriumContract();

        const provider = new ethers.providers.Web3Provider(ethereum);
        const gasLimit = 1500000;
        const gasPrice = await provider.getGasPrice();
        const extraGas = ethers.utils.parseUnits("100", "gwei");

        let _entrepreneur = address;
        tx = await contract.getCampaignsByEntrepreneur(_entrepreneur, {
          gasLimit: gasLimit,
          gasPrice: gasPrice.add(extraGas),
        });
        // await tx.wait();

        return tx;
      } catch (error) {
        reportError(error);
      }
    };
    // get Total Campaigns By Investor
    const getTotalCampaignsByInvestor = async ({
      address: _entrepreneur,
    }: any) => {
      try {
        if (!ethereum) return alert("Please install Metamask");

        const contract = await getEtheriumContract();

        const provider = new ethers.providers.Web3Provider(ethereum);
        const gasLimit = 1500000;
        const gasPrice = await provider.getGasPrice();
        const extraGas = ethers.utils.parseUnits("100", "gwei");

        // let _targetAmount = ethers.utils.parseEther(Amount);
        tx = await contract.getTotalCampaignsByInvestor(_entrepreneur, {
          gasLimit: gasLimit,
          gasPrice: gasPrice.add(extraGas),
        });
        await tx.wait();
        // console.log(tx);
        return tx;
      } catch (error) {
        reportError(error);
      }
    };

    // create campaign
    const getCampaigns = async () => {
      if (isDisconnected) {
        return;
      }
      try {
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

    // get campaign count
    const getCampaignCount = async () => {
      try {
        if (!ethereum) return alert("Please install Metamask");

        const contract = await getEtheriumContract();

        const provider = new ethers.providers.Web3Provider(ethereum);
        const gasLimit = 1500000;
        const gasPrice = await provider.getGasPrice();
        const extraGas = ethers.utils.parseUnits("100", "gwei");

        // let _targetAmount = ethers.utils.parseEther(Amount);
        tx = await contract.getCampaignCount({
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
            donateToCampaign,
            getCampaignCount,
            getInvestorDonations,
            getAllDonators,
            getAllDonations,
            getCampaignsByEntrepreneur,
            getTotalCampaignsByInvestor,
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
