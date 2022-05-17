import { AvaxLogo, BSCLogo, ETHLogo, PolygonLogo } from "../../Chains/Logos";

const ChainNetworks = () => {

  return (

    [
      {
        key: "0x1",
        value: "Ethereum",
        icon: <ETHLogo />,
      },
      {
        key: "0x539",
        value: "Local Chain",
        icon: <ETHLogo />,
      },
      {
        key: "0x3",
        value: "Ropsten Testnet",
        icon: <ETHLogo />,
      },
      {
        key: "0x4",
        value: "Rinkeby Testnet",
        icon: <ETHLogo />,
      },
      {
        key: "0x2a",
        value: "Kovan Testnet",
        icon: <ETHLogo />,
      },
      {
        key: "0x5",
        value: "Goerli Testnet",
        icon: <ETHLogo />,
      },
      {
        key: "0x38",
        value: "Binance",
        icon: <BSCLogo />,
      },
      {
        key: "0x61",
        value: "Smart Chain Testnet",
        icon: <BSCLogo />,
      },
      {
        key: "0x89",
        value: "Polygon",
        icon: <PolygonLogo />,
      },
      {
        key: "0x13881",
        value: "Mumbai",
        icon: <PolygonLogo />,
      },
      {
        key: "0xa86a",
        value: "Avalanche",
        icon: <AvaxLogo />,
      },
      {
        key: "0xa869",
        value: "Avalanche Testnet",
        icon: <AvaxLogo />,
      },
    ]
  )

}
export default ChainNetworks;


