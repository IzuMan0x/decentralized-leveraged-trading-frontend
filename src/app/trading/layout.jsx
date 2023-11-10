"use client";

import { AssetListProvider } from "@/components/DropDownListContext";
import { HamburgerMenuProvider } from "@/components/HamburgerMenuContext";

export default function layout({ children }) {
  return (
    <HamburgerMenuProvider>
      <AssetListProvider>{children}</AssetListProvider>
    </HamburgerMenuProvider>
  );
}
