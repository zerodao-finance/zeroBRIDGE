import { FaBtc, FaEthereum } from 'react-icons/fa'
import { useBridgeContext } from '../../core/systems/bridge'



const Ratio = () => {
    const {state, dispatch} = useBridgeContext()
    return (
        
                <div className="flex flex-col gap-2 self-center text-black dark:text-white">
                    <div className="flex flex-row w-full justify-between items-center px-5 gap-2">
                        <span className="flex items-center"><FaEthereum className="fill-gray-900 dark:fill-gray-300 h-[1.3rem] w-max text-xs"/><p className="text-xs">{`${state.ratio}%`}</p></span>
                        <input type="range" className="z-40 overflow-hidden form-range appearance-none h-1 focus:outline-none focus:ring-0 focus:shadow-none rounded-full bg-slate-400 w-[15rem]" id="range_select" name="ratio" min="0" max="100" step="1" value={state.ratio} onChange={(e) => dispatch({type: 'changeRatio', event: e})}/>
                        <span className="flex items-center font-bold"><p className="text-xs">{`${100-state.ratio}%`}</p><FaBtc className="fill-gray-900 dark:fill-gray-300 h-[1.3rem] w-max"/></span> 
                    </div>
                </div>
            
    )
}
export default Ratio