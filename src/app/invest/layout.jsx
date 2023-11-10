"use client";

import { HamburgerMenuProvider } from "@/components/HamburgerMenuContext";

export default function layout({ children }) {
  return <HamburgerMenuProvider>{children}</HamburgerMenuProvider>;
}
