import React, { useState, useContext } from "react";

const AssetListContext = React.createContext();
const UpdateAssetListContext = React.createContext();

export function useAssetList() {
  return useContext(AssetListContext);
}
export function useUpdateAssetList() {
  return useContext(UpdateAssetListContext);
}

export function AssetListProvider({ children }) {
  const [assetListHidden, setAssetListHidden] = useState(true);

  const hideAssetListHandler = (hiddenBool) => {
    setAssetListHidden(hiddenBool);
  };

  return (
    <AssetListContext.Provider value={assetListHidden}>
      <UpdateAssetListContext.Provider value={hideAssetListHandler}>
        {children}
      </UpdateAssetListContext.Provider>
    </AssetListContext.Provider>
  );
}
