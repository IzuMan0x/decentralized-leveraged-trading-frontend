/**
 * Generate a string rendering of a time delta. `diff` is the difference between the current
 * time and previous time in seconds.
 */
export function timeAgo(diff) {
  if (diff > 60) {
    return `${(diff / 60).toFixed(0)}m`;
  } else if (diff < 2) {
    return "<2s";
  } else {
    return `${diff.toFixed(0)}s`;
  }
}

export const pairSymbolArray = [];

export const tradingViewArray = [
  "ETHUSD",
  "BTCUSD",
  "XRPUSD",
  "MATICUSD",
  "BNBUSD",
];

/* export const PYTH_CONFIG_TESTNET = {
  eth: {
    name: "ETH/USD",
    pythPriceFeedId:
      "0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6",
  },
  btc: {
    name: "BTC/USD",
    pythPriceFeedId:
      "0xf9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b",
  },
  xrp: {
    name: "XRP/USD",
    pythPriceFeedId:
      "0xbfaf7739cb6fe3e1c57a0ac08e1d931e9e6062d476fa57804e165ab572b5b621",
  },
  matic: {
    name: "MATIC/USD",
    pythPriceFeedId:
      "0xd2c2c1f2bba8e0964f9589e060c2ee97f5e19057267ac3284caef3bd50bd2cb5",
  },
  bnb: {
    name: "BNB/USD",
    pythPriceFeedId:
      "0xecf553770d9b10965f8fb64771e93f5690a182edc32be4a3236e0caaa6e0581a",
  },
  priceServiceUrl: "https://xc-testnet.pyth.network",
}; */
export const testNetPriceServiceUrl = "https://xc-testnet.pyth.network";
export const mainNetPriceServiceUrl = "	https://hermes.pyth.network";
export const pythTestPriceFeedIdArray = [
  "0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6", //ETH
  "0xf9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b", //BTC
  "0xbfaf7739cb6fe3e1c57a0ac08e1d931e9e6062d476fa57804e165ab572b5b621", //XRP
  "0xd2c2c1f2bba8e0964f9589e060c2ee97f5e19057267ac3284caef3bd50bd2cb5", //MATIC
  "0xecf553770d9b10965f8fb64771e93f5690a182edc32be4a3236e0caaa6e0581a", //BNB
];
export const PYTH_CONFIG_TESTNET_ARRAY = [
  {
    name: "ETH/USD",
    pythPriceFeedId:
      "0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6",
  },
  {
    name: "BTC/USD",
    pythPriceFeedId:
      "0xf9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b",
  },
  {
    name: "XRP/USD",
    pythPriceFeedId:
      "0xbfaf7739cb6fe3e1c57a0ac08e1d931e9e6062d476fa57804e165ab572b5b621",
  },
  {
    name: "MATIC/USD",
    pythPriceFeedId:
      "0xd2c2c1f2bba8e0964f9589e060c2ee97f5e19057267ac3284caef3bd50bd2cb5",
  },
  {
    name: "BNB/USD",
    pythPriceFeedId:
      "0xecf553770d9b10965f8fb64771e93f5690a182edc32be4a3236e0caaa6e0581a",
  },
];

export const PYTH_CONFIG_MAINNET = [
  {
    name: "ETH/USD",
    pythPriceFeedId:
      "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
  },
  {
    name: "BTC/USD",
    pythPriceFeedId:
      "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
  },
  {
    name: "XRP/USD",
    pythPriceFeedId:
      "0xec5d399846a9209f3fe5881d70aae9268c94339ff9817e8d18ff19fa05eea1c8",
  },
  {
    name: "MATIC/USD",
    pythPriceFeedId:
      "0x5de33a9112c2b700b8d30b8a3402c103578ccfa2765696471cc672bd5cf6ac52",
  },
  {
    name: "BNB/USD",
    pythPriceFeedId:
      "0x2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f",
  },
];
