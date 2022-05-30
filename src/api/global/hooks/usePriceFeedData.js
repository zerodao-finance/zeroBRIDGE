import { storeContext } from "../global";
import { useContext, useEffect } from "react";
import { ChainId, Token, WETH, Fetcher, Route } from "@uniswap/sdk";
import { ethers } from "ethers";

export const usePriceFeedContracts = () => {
  const { state, dispatch } = useContext(storeContext);
  const { network } = state;
  const {
    wallet: { address },
  } = state;

  const provider = new ethers.providers.InfuraProvider(
    "mainnet",
    "816df2901a454b18b7df259e61f92cd2"
  );
  const WBTC = new Token(
    ChainId.MAINNET,
    "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    8
  );
  const USDC = new Token(
    ChainId.MAINNET,
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    6
  );

  const getUniswapBtcUsdPrice = async () => {
    const pair = await Fetcher.fetchPairData(WBTC, USDC, provider);
    const route = new Route([pair], USDC);

    const usdcForOneBTC = route.midPrice.invert().toSignificant(7);
    return ethers.utils.parseUnits(usdcForOneBTC, 6).toString();
  };

  const getUniswapBtcETHPrice = async () => {
    const pair = await Fetcher.fetchPairData(
      WBTC,
      WETH[WBTC.chainId],
      provider
    );
    const route = new Route([pair], WETH[WBTC.chainId]);

    const ethForOneBTC = route.midPrice.invert().toSignificant(18);
    return ethers.utils.parseEther(ethForOneBTC).toString();
  };

  const getUniswapUsdcETHPrice = async () => {
    const pair = await Fetcher.fetchPairData(
      USDC,
      WETH[USDC.chainId],
      provider
    );
    const route = new Route([pair], WETH[USDC.chainId]);

    const usdcForOneETH = route.midPrice.toSignificant(7);
    return ethers.utils.parseUnits(usdcForOneETH, 6).toString();
  };

  useEffect(() => {
    Promise.allSettled([
      getUniswapBtcETHPrice(),
      getUniswapBtcUsdPrice(),
      getUniswapUsdcETHPrice(),
    ]).then(async (result) => {
      dispatch({
        type: "UPDATE",
        module: "priceFeeds",
        effect: "data",
        data: {
          btc_usd: result[1].value,
          eth_usd: result[2].value,
          btc_eth: result[0].value,
        },
      });
    });
  }, [address, network]);
};
