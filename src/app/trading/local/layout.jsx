"use client";
import { AssetListProvider } from "@/components/DropDownListContext";

export default function layout({ children }) {
  return <AssetListProvider>{children}</AssetListProvider>;
}
