import { BridgeTransferInput } from './bridge.transfer.input'
import { BridgeTransferResult } from './bridge.transfer.result'
import { BridgeTransferRatio } from './bridge.transfer.ratio'
import { BridgeTransferSubmit } from './bridge.transfer.submit'
import { BridgeModuleToggle } from './bridge.module.toggle'
import { BridgeLoadingSignature } from './bridge.loading.signature'
import { BridgeLoadingWallet } from './bridge.loading.wallet'
import { AiOutlineArrowDown } from 'react-icons/ai'
import { useBridgeInput, useBridgeDisplay, useTransferSender } from '../../../api/global/interfaces/interface.bridge'
import { useCheckWalletConnected } from '../../../api/global/interfaces/interfaces.wallet'

export const BridgeTransferModule = () => {
    const { 
        ratio,
        amount,
        isFast,
        updateRatio,
        updateAmount,
        updateModule
    } = useBridgeInput()

    const {
        ETH,
        renBTC,
        btc_usd
    } = useBridgeDisplay()

    const { 
        open
    } = useCheckWalletConnected()

    const { sendTransferRequest, isLoading } = useTransferSender()

    return (
        <>{
            open ? 
            <BridgeLoadingWallet />
            :
            <>{ isLoading ? <BridgeLoadingSignature /> 
                :
                <>
                    <div className="animate-flip-in-hor-top [animation-delay:400ms] container px-[1rem]">
                        <p className="text-[10px] text-gray-300 whitespace-nowrap text-left"> transfer amount </p>
                        <div className="container h-max flex flex-row place-content-center gap-3 md:gap-5 justify-around items-center">
                            
                            <div className="flex flex-col w-full">
                                <BridgeTransferInput amount={amount} effect={updateAmount} tokenPrice={btc_usd}/>
                            </div>
                        </div>
                    </div>
                    
                    <div className={`animate-flip-in-hor-top [animation-delay:500ms] flex flex-col justify-center place-items-center mt-5`}>
                        <BridgeTransferRatio ratio={ratio} effect={updateRatio}/>
                        <AiOutlineArrowDown  className="fill-black" />
                    </div>
                    <div className={` animate-flip-in-hor-top [animation-delay:600ms] container h-max flex flex-col place-content-center max-w-[25rem] gap-3 md:gap-5 justify-around items-center px-1 md:px-8  pt-8 pb-4`}>
                        <p className="text-[10px] text-gray-300 whitespace-nowrap">result</p>
                        <div className="flex flex-col w-full">
                            <BridgeTransferResult ETH={ETH} renBTC={renBTC} />
                        </div>
                    </div>
                    <BridgeModuleToggle isFast={isFast} action={updateModule}/>
                    <div className="animate-flip-in-hor-top w-10/12 [animation-delay:700ms] mt-4">
                        <BridgeTransferSubmit action={sendTransferRequest}/>
                    </div>
                </>
            }
            </>
            
        }</>
    )
}