////////////////
// Production//
///////////////

// In order to use Pyth prices in your protocol you need to submit the price update data to Pyth contract in your target
// chain. `getPriceFeedsUpdateData` creates the update data which can be submitted to your contract. Then your contract should
// call the Pyth Contract with this data.
const pythPriceService = new EvmPriceServiceConnection(
  "https://xc-testnet.pyth.network"
); // See Price Service endpoints section below for other endpoints

const priceIds = [
  // You can find the ids of prices at https://pyth.network/developers/price-feed-ids#pyth-evm-testnet
  "0xf9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b", // BTC/USD price id in testnet
  "0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6", // ETH/USD price id in testnet
];

/* const updateDataArray = useEffect(() => {
    const getPythUpdateData = async () => {
      const data = await pythPriceService.getPriceFeedsUpdateData(priceIds);
      setPriceFeedUpdateData(data);
    };

    getPythUpdateData();
  }, []); */
//console.log(priceFeedUpdateData);
