import { AvaxLogo, BSCLogo, ETHLogo, PolygonLogo } from "../../Chains/Logos";

const ChainNetworks = () => {

  return (

    [
      {
        key: "0xa86a",
        value: "Avalanche",
        icon: <AvaxLogo />,
      },
      {
        key: "0x89",
        value: "Polygon",
        icon: <PolygonLogo />,
      },
      {
        key: "0x4",
        value: "Rinkeby",
        icon: <ETHLogo />,
      },
      {
        key: "0x13881",
        value: "Mumbai",
        icon: <PolygonLogo />,
      },


    ]
  )

}
export default ChainNetworks;


