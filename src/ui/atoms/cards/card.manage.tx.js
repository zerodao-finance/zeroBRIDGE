import { usePopup } from "../../../api/transaction/status";
import * as React from "react";
import { defaultTo } from "lodash";
import { getStatus } from "../../../api/transaction/status";
import { AiOutlineConsoleSql } from "react-icons/ai";
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";

export const ManageTransactionCard = ({ data, type }) => {
  const [details, toggle] = React.useState(false);
  const { openModal } = usePopup();
  function truncateAddress(address) {
    return address.slice(0, 6) + "..." + address.slice(-4);
  }

  if (!details)
    return (
      <div
        key={data.id}
        className="bg-gray-300 rounded-md shadow-md text-xs max-w-[300px] px-4 py-1 flex flex-col gap-1"
        onClick={(e) => toggle(true)}
      >
        <div className="grid grid-cols-2 justify-items-center">
          <p className="text-md font-bold">{data.type} :</p>
          <p className="text-emerald-500">
            {truncateAddress(data._data.contractAddress).toUpperCase()}
          </p>
        </div>
        <hr className="border-black" />
        <div className="grid grid-cols-2">
          <span>to:</span>
          <span className="text-xs">
            {truncateAddress(data._data.to).toUpperCase()}
          </span>
          <span> amount </span>
          <span> {data._data.amount} </span>
        </div>
        <div className="underline cursor-pointer"> click for details </div>
      </div>
    );

  if (details) return <Details data={data} toggle={toggle} />;
};

function Details({ data, toggle }) {
  const { passed } = getStatus(data);
  const [open, setOpen] = useState(false);

  console.log(passed ? passed : "no function available");
  return (
    <div
      className="bg-gray-300 rounded-md shadow-md text-xs max-w-[300px] px-4 py-1 flex flex-col gap-1 relative"
      key={data.id}
    >

      <p
        className="absolute -top-1 right-2 text-lg text-orange-600 cursor-pointer"
        onClick={() => toggle(false)}
      >
        &times;
      </p>
      {passed ? (
        <div>
          <span>
            <p>target: {passed.target}</p>
            <p>current: {passed.confs}</p>
          </span>
          <button
            onClick={() => {
              passed.fallbackMint ? setOpen(true) : () => {};
            }}
          >
            Fallback Mint
          </button>
          <FallbackWarning
            open={open}
            setOpen={setOpen}
            fallback={passed.fallbackMint}
          />
        </div>
      ) : (
        <div className="h-[60px] flex items-center justify-center content-center animate-pulse">
          loading
        </div>
      )}
    </div>
  );
}

export default function FallbackWarning({ open, setOpen, passed }) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationIcon
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Fallback Mint
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Use this feature if your funds have not arrived after
                        your deposit has reached 12 confirmations.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      fallback();
                      setOpen(false);
                    }}
                  >
                    Fallback
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
