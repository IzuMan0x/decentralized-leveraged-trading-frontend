import { EthereumClient } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";

export default function WalletConnectModal(props) {
  const projectId = "b95db88f2294ab412d2b370774f19d3e";
  const ethereumClient = new EthereumClient(props.config, props.chains);
  return (
    <>
      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeVariables={{
          "--w3m-font-family": "Roboto, sans-serif",
          "--w3m-accent-color": "#000000",
        }}
      />
    </>
  );
}
