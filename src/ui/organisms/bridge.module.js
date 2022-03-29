import { BridgeTransferModule } from "../molecules/bridge.transfer"

import { BridgeBurnModule } from "../molecules/bridge.burn/bridge.burn"
import { BridgeLoadingWallet } from "../molecules/bridge.transfer/bridge.loading.wallet"
import { useBridgeInput } from "../../api/global/interfaces/interface.bridge.transfer"
import { useBridgePage } from "../../api/global/interfaces/interface.bridge"
import Disclaimer from "./Disclaimer"

export const BridgeModule = ({ wallet, mode, toggleMode }) => {
    const { getTransferMode } = useBridgeInput()
    const { getBridgePageProps } = useBridgePage()
    const { tcSigned } = getBridgePageProps()
    return (
        !tcSigned ? 
                        <Disclaimer /> :
        <div className='flex flex-col container h-fit bg-white shadow-xl rounded-[30px] justify-center place-items-center gap-1 md:gap-3  first:gap-0 w-fit pb-4 dark:bg-gray-700 text-white min-w-[370px]'>
            <p className="text-lg font-light text-black tracking-wider w-full bg-emerald-300 text-center shadow-md rounded-t-md pt-[.25rem] pb-[.25rem]">Bridge Funds</p>
            <div className={`h-full w-full grid grid-cols-2 grid-flow-rows mb-8 bg-gray-200 dark:bg-gray-800 align-center font-light tracking-wider text-sm text-center`}>
                <div className={`py-[10px] cursor-pointer ${ mode === "transfer" ? 'dark:bg-slate-400 dark:text-slate-700 bg-emerald-300 text-white font-bold' : 'text-black dark:text-white'}`} onClick={() => toggleMode("transfer")}>
                    Transfer
                </div>
                <div className={`py-[10px] cursor-pointer ${mode === "release" ? 'dark:bg-slate-400 dark:text-slate-700 dark:font-bold bg-emerald-300 text-white font-bold' : 'text-black dark:text-white'}`} onClick={() => toggleMode("release")}>
                    Release
                </div>
            </div>
            { wallet ?
                    <BridgeLoadingWallet />
                    :
                    mode === "transfer" ? 
                    <BridgeTransferModule {...getTransferMode()}/>
                    :
                    <BridgeBurnModule />
            
            }
        </div>
    )
}