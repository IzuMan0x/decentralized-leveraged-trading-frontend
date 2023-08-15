"use client";

import React from "react";

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, sepolia, WagmiConfig } from "wagmi";
import {
  arbitrum,
  mainnet,
  polygon,
  zkSync,
  zkSyncTestnet,
} from "wagmi/chains";
import WalletConnectModal from "../../components/WalletConnectModal";
import TradingViewWidget from "../../components/TradingViewWidget";
import NavBar from "../../components/NavBar";
import InputTradeValues from "@/components/InputTradeValues";
import OpenTrades from "@/components/OpenTrades";
//import { Profile } from "./Profile";

/* Defining the localchain becasue the provided localchain from WAGMI has a different Id of 1337 */
const localhost = {
  id: 31337,
  name: "developmentNetwork",
  network: "localhost",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"],
    },
    public: {
      http: ["http://127.0.0.1:8545"],
    },
  },
};

const chains = [
  arbitrum,
  mainnet,
  polygon,
  sepolia,
  zkSync,
  zkSyncTestnet,
  localhost,
];

const projectId = "b95db88f2294ab412d2b370774f19d3e";

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

function TradingPage() {
  return (
    <div className="h-full w-full">
      <WagmiConfig config={wagmiConfig} chains={chains}>
        <WalletConnectModal config={wagmiConfig} chains={chains} />

        <div className="bg-black bg-repeat h-full w-full">
          <div>
            <NavBar />
          </div>
          <div className="h-screen w-screen py-20 ">
            <div className="h-full w-full flex px-6">
              <TradingViewWidget />
              <div className="text-white mx-10 border-solid border-4 border-white px-6 py-3">
                <InputTradeValues />
              </div>
            </div>
            <div className="flex flex-center items-center justify-right border-solid border-4 border-white mx-10 my-5 h-10">
              <OpenTrades />
            </div>
          </div>
        </div>
      </WagmiConfig>
    </div>
  );
}

export default TradingPage;
