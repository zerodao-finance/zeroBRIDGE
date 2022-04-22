import { storeContext } from '../global'
import { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import _ from 'lodash'



export const usePriceFeedContracts = () => {
  const { state, dispatch } = useContext(storeContext)
  const { network } = state
  const { priceFeedContract } = network
  const { wallet: { address } } = state

  const getBtcEthPrice = (network) => (new Promise(async (resolve, reject) => {
    let x = await _.attempt(network.priceFeedContract.get_dy, 1, 2, ethers.utils.parseUnits("1", 8))
    if (_.isError(x)) {
      reject(new Error("failed to fetch price"))
    } else {
      resolve(x.toString())
    }
  }))

  const getBtcUsdPrice = (network) => (new Promise(async (resolve, reject) => {
    let x = await _.attempt(network.priceFeedContract.get_dy, 1, 0, ethers.utils.parseUnits("1", 8))
    if (_.isError(x)) {
      reject(new Error("failed to fetch price"))
    } else {
      resolve(x.toString())
    }
  }))
  const getEthUsdPrice = (network) => (new Promise(async (resolve, reject) => {
    let x = await _.attempt(network.priceFeedContract.get_dy, 2, 0, ethers.utils.parseUnits("1", 18))
    if (_.isError(x)) {
      reject(new Error("failed to fetch price"))
    } else {
      resolve(x.toString())
    }
  }))

  const getUniswapBtcPrice = async () => {
    const response = await fetch('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          {
            pools(where:{id:"0x99ac8ca7087fa4a2a1fb6357269965a2014abc35"}) {
              token1Price
            }
          }
        `,
        variables: {
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const tokenPrice = parseFloat(data.data.pools[0].token1Price)
    return ethers.utils.parseUnits(tokenPrice.toFixed(1), 6).toString();
  }


  useEffect(async () => {
    const call = () => {
      Promise.allSettled([getBtcEthPrice(network), getUniswapBtcPrice(), getEthUsdPrice(network)])
        .then(async result => {
          dispatch({ type: "UPDATE", module: "priceFeeds", effect: "data", data: { btc_usd: result[1].value, eth_usd: result[2].value, btc_eth: result[0].value, } })
        })
    }

    await getUniswapBtcPrice();

    var invoke = _.throttle(call, 1000)

    if (priceFeedContract) {
      priceFeedContract.provider.on("block", invoke)
    }

    return () => {
      if (priceFeedContract) {
        priceFeedContract.provider.removeListener("block", invoke)
        invoke.cancel()
      }
    }

  }, [network.priceFeedContract, address])
}