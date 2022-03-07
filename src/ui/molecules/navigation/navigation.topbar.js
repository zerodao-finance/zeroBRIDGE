import {PrimaryOutlinedButton} from '../../atoms/buttons/button.outlined'
import {NetworkIndicator} from '../../atoms/indicators/indicator.network'
import { useWalletConnection } from '../../../api/global/interfaces/interfaces.wallet'
import { useZero } from '../../../api/global/interfaces/interfaces.zero'

export const NavigationTopBar = ({}) => {
    
    const { connect, disconnect, wallet, isLoading } = useWalletConnection()
    const { keeper } = useZero()

    return (
        <nav className="w-screen flex flex-row justify-between items-center sticky top-0 px-2 py-2">
            <div id="logo">
                <img src="/ArbitrumLogo@2x.png" alt="image" className="h-[40px] md:h-[70px] hidden dark:flex" />
                <img src="/ArbitrumLogoDark@2x.png" alt="image" className="h-[40px] md:h-[70px] dark:hidden" />
            </div>
            <div id="content" className="flex flex-row items-center gap-3">
                <PrimaryOutlinedButton label={wallet.address ? wallet.address : "connect wallet"} action={wallet.address ? disconnect : connect}/>
                <NetworkIndicator keeper={keeper}/>
            </div>
        </nav>
    )
}