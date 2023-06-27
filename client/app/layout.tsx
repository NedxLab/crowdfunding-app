"use client";

import "./globals.css";
import { Ysabeau } from "next/font/google";
import { Outfit } from "next/font/google";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { arbitrum, mainnet, polygon, sepolia } from "wagmi/chains";
import { StateContextProvider } from "@/components/context";

// FONT DECLARATION
const outfit = Ysabeau({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

// project ID
const chains = [arbitrum, mainnet, polygon, sepolia];
const projectId: any = process.env.NEXT_PUBLIC_PROJECT_ID;

// default metadata
export const metadata = {
  title: "Web3 Crowdfunding",
  description: "Crowdfunding Project app",
};

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en">
        <body className={outfit.className}>
          <StateContextProvider>
            <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
            <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
          </StateContextProvider>
        </body>
      </html>
    </>
  );
}
