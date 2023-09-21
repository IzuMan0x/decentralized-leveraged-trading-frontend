//const priceClass = new Price();
const [pythOffChainPrice, setPythOffChainPrice] = useState();
useEffect(() => {
  // The Pyth price service client is used to retrieve the current Pyth prices and the price update data that
  // needs to be posted on-chain with each transaction.
  const pythPriceService = new EvmPriceServiceConnection(
    PYTH_CONFIG.priceServiceUrl,
    {
      logger: {
        error: console.error,
        warn: console.warn,
        info: () => undefined,
        debug: () => undefined,
        trace: () => undefined,
      },
    }
  );

  pythPriceService.subscribePriceFeedUpdates(
    [PYTH_CONFIG.eth.pythPriceFeedId, PYTH_CONFIG.btc.pythPriceFeedId],
    (priceFeed) => {
      const price = priceFeed.getPriceUnchecked(); // Fine to use unchecked (not checking for staleness) because this must be a recent price given that it comes from a websocket subscription.
      setPythOffChainPrice((prev) => ({ ...prev, [priceFeed.id]: price }));
    }
  );
}, []);
const ethPriceFeedId = PYTH_CONFIG.eth.pythPriceFeedId;
if (pythOffChainPrice === undefined) {
  console.log("pyth is undefined");
} else if (
  pythOffChainPrice[
    "ca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6"
  ] === undefined
) {
  console.log("ethereum price feed is undefined");
} else {
  console.log(
    "1245 data is: ",
    pythOffChainPrice[
      "ca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6"
    ].getPriceAsNumberUnchecked()
  );
}

//const ethPrice = new Price({ pythOffChainPrice });

// Subscribe to the price feeds given by `priceId`. The callback will be invoked every time the requested feed
// gets a price update.
/* let ethereumPythPrice;
  connection.subscribePriceFeedUpdates(priceIds, (priceFeed) => {
    console.log(
      `Received update for ${priceFeed.id}: ${formatUnits(
        priceFeed.getPriceNoOlderThan(60).price,
        8
      )}`
    );
    ethereumPythPrice = formatUnits(priceFeed.getPriceNoOlderThan(60).price, 8);
    setEthereumPrice(ethereumPythPrice);
  });

  //setEthereumPrice(formatUnits(priceFeed.getPriceNoOlderThan(60).price, 8));

  // When using the subscription, make sure to close the websocket upon termination to finish the process gracefully.
  setTimeout(() => {
    connection.closeWebSocket();
  }, 60000); */

/*  const connection = new EvmPriceServiceConnection(
    "https://xc-testnet.pyth.network"
  ); // See Price Service endpoints section below for other endpoints

  const priceIds = [
    // You can find the ids of prices at https://pyth.network/developers/price-feed-ids#pyth-evm-testnet
    //"0xf9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b", // BTC/USD price id in testnet
    "0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6", // ETH/USD price id in testnet
  ];
 */

/*  //orderClose
  const { config: orderCloseConfig, orderCloseError } = usePrepareContractWrite(
    {
      address: orderBookContractAddress,
      abi: orderBookAbi.abi,
      functionName: "orderClose",
      args: [1, 2, priceFeedUpdateData],
      value: getUpdateFeeData,
      onSuccess(data) {
        console.log("Success", data.result);
      },
    }
  );
  const {
    data: orderCloseData,
    isSuccess: orderCloseSuccess,
    isLoading: orderCloseIsLoading,
    write: orderClose,
  } = useContractWrite(orderCloseConfig); */

//orderClose
const {
  config: orderCloseConfig,
  data: orderClosePrepareData,
  error: orderCloseError,
  isError: orderCloseIsError,
  status: orderClosePrepareStatus,
} = usePrepareContractWrite({
  address: orderBookContractAddress,
  abi: orderBookAbi.abi,
  functionName: "orderClose",
  args: [0, 1, mockPythUpdateDataArray],
  value: 1,
  cacheTime: 5_000,
  onSuccess(data) {
    console.log("Success", data.result);
  },
});
console.log("orderCloseIsError is in error", orderCloseIsError);
console.log("orderCloseConfig is:", orderCloseConfig);
console.log("orderClosePrepareData is: ", orderClosePrepareData);
console.log("Order close prepare status", orderClosePrepareStatus);

const {
  data: orderCloseData,
  error: orderCloseWriteError,
  isSuccess: orderCloseSuccess,
  isLoading: orderCloseIsLoading,
  status: orderCloseWriteStatus,
  write: orderClose,
} = useContractWrite(orderCloseConfig);
console.log("Order Close write data 1245", orderCloseData);
console.log("order close write is loading: ", orderCloseIsLoading);
console.log("write order close error is: ", orderCloseWriteError);
console.log("Order close write status is: ", orderCloseWriteStatus);
//console.log("1245 data is: ", pythOffChainPrice);
const tradeCloseHandler = () => {
  console.log("Order close function 1245", orderClose);
  orderClose?.();
};