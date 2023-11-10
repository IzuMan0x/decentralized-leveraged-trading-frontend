import React, { useState, useContext } from "react";

const HamburgerMenuContext = React.createContext();

export function useHamburgerMenu() {
  return useContext(HamburgerMenuContext);
}

export function HamburgerMenuProvider({ children }) {
  const [menuIsHidden, setMenuIsHidden] = useState(true);

  const hideMenuHandler = (hiddenBool) => {
    setMenuIsHidden(hiddenBool);
  };

  return (
    <HamburgerMenuContext.Provider
      value={{ state: menuIsHidden, hideMenu: hideMenuHandler }}
    >
      {children}
    </HamburgerMenuContext.Provider>
  );
}
