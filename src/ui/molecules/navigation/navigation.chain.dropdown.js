/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { getChainName } from "../../../api/utils/chains";
import useWindowDimensions from "../../../api/utils/responsiveness";
import * as React from "react"; // Needs to be here for testing

// Import SVGs
import { ReactComponent as ETH } from "../../../assets/svg-coins/eth.svg";
import { ReactComponent as ARB } from "../../../assets/svg-common/arbitrum.svg";
import { ReactComponent as AVAX } from "../../../assets/svg-coins/avax.svg";
import { ReactComponent as MATIC } from "../../../assets/svg-coins/matic.svg";
import { BsQuestionCircle } from "react-icons/bs";

const chains = [
  {
    name: "Mainnet",
    chainId: "1",
  },
  {
    name: "Arbitrum",
    chainId: "42161",
  },
  // {
  //   name: "Avalanche",
  //   chainId: "43114",
  // },
  {
    name: "Polygon",
    chainId: "137",
  },
  {
    name: "Optimism",
    chainId: "10",
  },
];

export default function NavigationChainDropdown({ chainId, setChainId }) {
  const { width } = useWindowDimensions();

  const chainToIcon = (chain) => {
    switch (chain.toLowerCase()) {
      case "mainnet":
        return <ETH className="h-5 w-5" />;
      case "arbitrum":
        return <ARB className="h-5 w-5" />;
      case "polygon":
        return <MATIC className="h-5 w-5" />;
      case "avalanche":
        return <AVAX className="h-5 w-5" />;
      default:
        return <BsQuestionCircle className="h-5 w-5" />;
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex font-bold rounded-lg justify-center w-full bg-zero-green-500/90 hover:bg-zero-green-500/40 shadow-sm px-2 py-1 text-sm md:text-base text-badger-white-400 focus:outline-none ">
          {chainId
            ? width > 600
              ? getChainName(chainId)
              : chainToIcon(getChainName(chainId))
            : "Loading..."}
          <ChevronDownIcon
            className="-mr-1 md:ml-2 md:mt-1 h-5 w-5"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 rounded-md shadow-lg bg-badger-black-400 ring-0 focus:outline-none">
          <div>
            {chains.map((chain) => {
              return (
                <Menu.Item key={chain.name}>
                  {({ active }) => (
                    <span
                      href="#"
                      className={
                        "text-center block py-2 px-8 text-sm cursor-pointer font-semibold " +
                        (active ? "bg-zero-green-500/10 " : "bg-transparent ") +
                        (getChainName(chainId) == chain.name
                          ? "text-zero-neon-green-500 "
                          : "text-badger-white-400 ")
                      }
                      onClick={() => setChainId(chain.chainId)}
                    >
                      {chain.name}
                    </span>
                  )}
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
