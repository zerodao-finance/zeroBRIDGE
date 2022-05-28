/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { getChainName } from "../../../api/utils/chains";
import * as React from "react"; // Needs to be here for testing

export default function NavigationChainDropdown({ chainId, setChainId }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex font-bold rounded-lg justify-center w-full bg-badger-yellow-400 hover:bg-badger-yellow-400/40 shadow-sm px-2 py-1 bg-white text-sm md:text-base text-badger-black-700 focus:outline-none ">
          {getChainName(chainId)}
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
            <Menu.Item>
              {({ active }) => (
                <span
                  href="#"
                  className={
                    "text-center block py-2 px-8 text-sm cursor-pointer font-semibold " +
                    (active ? "bg-badger-yellow-400/10 " : "bg-transparent ") +
                    (getChainName(chainId) == "Mainnet"
                      ? "text-badger-yellow-400 "
                      : "text-badger-white-400 ")
                  }
                  onClick={() => setChainId("1")}
                >
                  Mainnet
                </span>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <span
                  href="#"
                  className={
                    "text-center block py-2 px-8 text-sm cursor-pointer font-semibold text-badger-white-400 " +
                    (active ? "bg-badger-yellow-400/10 " : "bg-transparent ") +
                    (getChainName(chainId) == "Arbitrum"
                      ? "text-badger-yellow-400 "
                      : "text-badger-white-400 ")
                  }
                  onClick={() => setChainId("42161")}
                >
                  Arbitrum
                </span>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}