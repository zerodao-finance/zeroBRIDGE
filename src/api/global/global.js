/**
 * Persistant Global Synched Store
 * 
 * DONE: initial context
 * @state
    * items
    * isloading
    * error
* @dispatch
    f*n

* DONE: reducer
    @dispatch START_REQUEST
    @dispatch SUCCEED_REQUEST
    @dispatch FAIL_REQUEST
    @default assertNever

* TODO: Provider
    @effect localStorage.set(key, transferRequests)
    @useReducer

* TODO: reducer
    @disptach SYNC_REQUEST
    @default assertNever
    
 */

import { createContext, useEffect, useReducer, useMemo } from 'react'
import { PersistanceStore } from '../storage/storage'
import hash from 'object-hash'
import { globalBridgeState, globalBridgeReducer } from './global.reducers'
import { ethers } from 'ethers'
import _ from 'lodash'


const storeContext = createContext(globalBridgeState)
const { Provider } = storeContext

const StateProvider = ({ children }) => {


    const [ state, dispatch ] = useReducer(globalBridgeReducer, globalBridgeState.state)
    const getContract = useMemo(() => {
        var provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_JSONRPC)
        if (state.wallet.network) {
            var contract = new ethers.Contract(state.wallet.network.swap_address, [ 'function get_dy(uint256, uint256, uint256) view returns (uint256)' ], provider)
            dispatch({type: "SUCCEED_BATCH_REQUEST", effect: "network", payload: { provider: provider, priceFeedContract: contract}})
        }

    }, [state.wallet.network])

    useEffect( async () => {

        if (!state.network.provider && state.wallet.network) {
            getContract()
        }
    }, [state.wallet.network])

    useEffect(() => {
        if (localStorage.getItem("screenMode") === "dark") {
            document.documentElement.classList.add("dark")
        }
    }, [])


    // useEffect(async () => {
    //     console.log(state.transactions)
    //     console.log(await PersistanceStore.get_all_data())
    //     if (!_.isEmpty(state.transactions))
    //         await PersistanceStore.put_data(state.transactions[0], 'complete')
    // }, [state.transactions])

    return <Provider value={{ state, dispatch }}>{children}</Provider>
}

export { storeContext, StateProvider }






