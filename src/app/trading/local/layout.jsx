"use client";

import { Inter } from "next/font/google";
import { AssetListProvider } from "../../../components/DropDownListContext";
import WalletConfigWrapper from "../../../components/WalletConfigWrapper";

export default function layout({ children }) {
  return <AssetListProvider>{children}</AssetListProvider>;
}
