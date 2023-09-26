"use client";

import React, { useState } from "react";

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
import NotificationBar from "@/components/NotificationBar";
import TradingViewWidget from "../../components/TradingViewWidget";
import NavBar from "../../components/NavBar";
import InfoBar from "@/components/InfoBar";
import InputTradeValues from "@/components/InputTradeValues";
import OpenTrades from "@/components/OpenTrades";
import TradingPoints from "@/components/TradingPoints";
import Footer from "@/components/Footer";

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
  const [tradingViewAsset, setTradingViewAsset] = useState("ETHUSD");
  const [tradingAssetIndex, setTradingAssetIndex] = useState(0);

  const tradingViewAssetChangeHandler = (assetSymbol, assetIndex) => {
    setTradingViewAsset(assetSymbol);
    setTradingAssetIndex(assetIndex);
  };

  return (
    <div className=" bg-black h-full w-full overflow-hidden overflow-y-hidden">
      <WagmiConfig config={wagmiConfig} chains={chains}>
        <WalletConnectModal config={wagmiConfig} chains={chains} />

        <div className="w-full h-full">
          <NotificationBar></NotificationBar>
          <div>
            <NavBar />
          </div>

          <div className="grid h-full w-full py-10 lg:grid-cols-3 md:grid-flow-row">
            <div className="border-solid border-4 border-gray-700 rounded-xl shadow-2xl shadow-slate-700 col-span-2 mx-4 flex">
              <div className="grid grid-rows-6">
                <div className="row-span-1">
                  <InfoBar
                    assetSelectIndex={tradingAssetIndex}
                    assetSelectSymbol={tradingViewAsset}
                  ></InfoBar>
                </div>

                <div className="row-span-5 p-2 flex">
                  <TradingViewWidget assetSelect={tradingViewAsset} />
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <div>
                <h1 className="text-white justify-center flex underline underline-offset-4 mb-1">
                  Input Trade Parameters
                </h1>
                <div className="border-solid border-4 border-gray-700 rounded-xl shadow-2xl shadow-slate-700 mx-4 flex">
                  <div className="h-full w-full flex px-6">
                    <InputTradeValues
                      assetChange={tradingViewAssetChangeHandler}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-center items-center justify-center border-4 border-gray-700 rounded-xl border-solid shadow-slate-700 mx-4 my-5 p-10 h-auto w-auto">
            <OpenTrades />
          </div>
          <div className="m-4 flex justify-center">
            <TradingPoints></TradingPoints>
          </div>
        </div>
        <Footer />
      </WagmiConfig>
    </div>
  );
}

export default TradingPage;
