import { FaConnectdevelop } from 'react-icons/fa'

export const NetworkIndicator = ({keeper}) => {
    return (
        <div>
            <FaConnectdevelop data-tooltip-target="tooltip-keepers" data-tooltip-placement="left" className={`max-w-[18px] max-h-[18px] animate-[spin_5s_linear_infinite] ${keeper.length > 0 ? "fill-main-green" : "fill-red-700"}`}></FaConnectdevelop>
            <div id="tooltip-keepers" role="tooltip" class="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                {keeper.length > 0 ? "Keeper Connected" : "Searching For Keepers"}
                <div class="tooltip-arrow" data-popper-arrow></div>
            </div>
        </div> 
    )
}