'use client';
import carbonPng from 'assets/carbon.png';
import Image from 'next/image';
import React, { useMemo, useRef, useState } from 'react';
import { UserApi } from '~/servers/user';
import Swal from 'sweetalert2';
import { AuctionApi } from '~/servers/auction';
import { TransactionButton, useActiveWallet, useSendTransaction } from 'thirdweb/react';
import { formatDay } from '~/utils/time';
import { getContract, prepareContractCall } from 'thirdweb';
import { client } from '~/app/client';
import { sepolia } from 'thirdweb/chains';
import { CONTRACT_ADDRESS } from '~/constants/address';
import { convertHash } from '~/utils/converHash';

export default function AuctionCards(p: { auctions: AuctionRsp[] }) {
  const wallet = useActiveWallet();
  const address = wallet?.getAccount()?.address;

  const contract = useMemo(
    () =>
      getContract({
        client,
        chain: sepolia,
        address: CONTRACT_ADDRESS
      }),
    []
  );

  const { mutate: sendTransaction, data: transactionResult } = useSendTransaction();

  const formRef = useRef(null);

  const [formValues, setFormValues] = useState<AuctionReq>({
    tradeID: new Date().getTime().toString(),
    publicKey: '',
    sellAmount: '',
    minimumBidAmount: '',
    initPriceUnit: '',
    startTime: '',
    endTime: '',
    hash: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    setFormValues({
      ...formValues,
      [target.name]: target.value
    });
  };

  const handleSubmit = (hash: string) => {
    if (!address) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You Should Login in First!'
      });
      return;
    }

    async function startAuction(req: AuctionReq) {
      console.log(JSON.stringify(req, null, 2));
      const res = await AuctionApi.startAuction(req);
    }

    startAuction({
      ...formValues,
      'publicKey': address,
      'hash': hash
    });

    Swal.fire({
      title: 'Good job!',
      text: 'Your auction has been posted!',
      icon: 'success'
    });

    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div>
      {p.auctions ? (
        <div className="pt-4 pl-3 py-4 bg-white rounded-xl dark:bg-zinc-900">
          <div className={'flex justify-between max-w-6xl'}>
            <span className="font-extrabold text-3xl text-gray-700 ml-3 pb-2 dark:text-gray-50">{`Trade Your Allowance`}</span>
            <button
              type="button"
              className="w-52 py-3 px-4 mx-5 mb-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:bg-green-600 disabled:opacity-50 disabled:pointer-events-none"
              aria-haspopup="dialog"
              aria-expanded="false"
              aria-controls="hs-start-autcion"
              data-hs-overlay="#hs-start-autcion">
              Submit application
            </button>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {p.auctions.map(auction => (
              <a
                key={auction.id}
                href={`/market/${auction.tradeID}`}
                className="group block bg-white rounded-2xl border border-blue-50 hover:border hover:border-blue-600 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-gray-600">
                <div className="relative overflow-hidden w-64 h-48 bg-gray-100 rounded-2xl dark:bg-neutral-800">
                  <Image
                    src={carbonPng}
                    alt="Image Description"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-105 transition-transform duration-500 ease-in-out object-cover rounded-2xl"
                  />
                </div>

                <div className="py-4">
                  <h3 className="ml-6 mb-1 relative inline-block font-bold text-lg text-black tracking-wider dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-500 transition duration-200 ease-in-out">
                    {auction?.sellAmount}
                  </h3>
                  {new Date() >= new Date(auction?.startTime) && new Date() <= new Date(auction?.endTime) ? <span className="float-right mr-4 bg-green-300 rounded-xl px-2 py-1 font-bold">Trading</span> : null}
                  {new Date() <= new Date(auction?.startTime) ? <span className="float-right mr-4 bg-gray-300 rounded-xl px-2 py-1 font-bold">Not Start</span> : null}
                  {new Date() >= new Date(auction?.endTime) ? <span className="float-right mr-4 bg-red-300 rounded-xl px-2 py-1 font-bold">Finished</span> : null}

                  <p className="py-1.5 px-5 bg-white text-gray-600 text-base font-bold rounded-xl">init price unit: {auction?.initPriceUnit}</p>
                  <p className="py-1.5 px-5 bg-white text-gray-600 text-base font-bold rounded-xl">minimum bid amount: {auction?.minimumBidAmount}</p>
                  <div className="mt-1 px-5 flex justify-between">
                    <span className="py-1.5 bg-white text-gray-600 text-xs sm:text-sm rounded-xl">{formatDay(auction?.startTime)}</span>
                    <span className="py-1.5  bg-white text-gray-600 text-xs sm:text-sm rounded-xl">{formatDay(auction?.endTime)}</span>
                  </div>
                  <p
                    className="py-1.5 px-5 text-tiny font-bold rounded-xl text-gray-400 hover:text-green-400 justify-center items-center text-center"
                    onClick={e => {
                      e.preventDefault();
                      window.open(`https://sepolia.etherscan.io/tx/${auction?.transactionHash}`, '_blank');
                    }}>
                    {convertHash(auction?.transactionHash)}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      ) : null}

      <div id="hs-start-autcion" className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto" role="dialog" aria-labelledby="hs-cookies-label">
        <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all max-w-3xl sm:w-full m-3 sm:mx-auto">
          <div className="relative flex flex-col bg-white shadow-lg rounded-xl dark:bg-neutral-900">
            <div className="absolute top-2 end-2">
              <button
                type="button"
                className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600"
                aria-label="Close"
                data-hs-overlay="#hs-start-autcion">
                <span className="sr-only">Close</span>
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div className="text-center mt-10">
              <h3 id="hs-notifications-label" className="mb-2 text-xl font-bold text-gray-800 dark:text-neutral-200">
                Start Your Auction
              </h3>
            </div>

            <form ref={formRef} onSubmit={e => e.preventDefault()} action="" noValidate className={'px-8 mt-10'}>
              <div className="grid gap-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label htmlFor="sellAmount" className="block mb-2 text-sm font-medium text-gray-700">
                      Sell Amount
                    </label>
                    <input
                      id="sellAmount"
                      name="sellAmount"
                      type="text"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 "
                      placeholder="Enter Sell Amount"
                      required
                      value={formValues.sellAmount}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="minimumBidAmount" className="block mb-2 text-sm font-medium text-gray-700">
                      Minimum Bid Amount
                    </label>
                    <input
                      id="minimumBidAmount"
                      name="minimumBidAmount"
                      type="text"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                      placeholder="Enter Minimum Bid Amount"
                      required
                      value={formValues.minimumBidAmount}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="initPriceUnit" className="block mb-2 text-sm font-medium text-gray-700">
                      Init Price Unit
                    </label>
                    <input
                      id="initPriceUnit"
                      name="initPriceUnit"
                      type="text"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                      placeholder="Enter Init Price Unit"
                      required
                      value={formValues.initPriceUnit}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="startTime" className="block mb-2 text-sm font-medium text-gray-700">
                      Start Time
                    </label>
                    <input
                      id="startTime"
                      name="startTime"
                      type="datetime-local"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                      placeholder="Enter Start Time"
                      required
                      lang={'en'}
                      value={formValues.startTime}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="endTime" className="block mb-2 text-sm font-medium text-gray-700">
                      End Time
                    </label>
                    <input
                      id="endTime"
                      name="endTime"
                      type="datetime-local"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                      placeholder="Enter End Time"
                      lang={'en-US'}
                      required
                      value={formValues.endTime}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="my-6">
                  <TransactionButton
                    type="button"
                    unstyled
                    className="float-right w-24 py-3 px-4 justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:bg-green-600"
                    transaction={() => {
                      // Create a transaction object and return it
                      const tx = prepareContractCall({
                        contract,
                        method: 'function startTrade(string tradeID, uint256 amount, uint256 startTimeStamp, uint256 endTimeStamp, uint256 minimumBidAmount, uint256 initPriceOfUint)',
                        params: [
                          formValues.tradeID,
                          BigInt(formValues.sellAmount),
                          BigInt(new Date(formValues.startTime).getTime()),
                          BigInt(new Date(formValues.endTime).getTime()),
                          BigInt(formValues.minimumBidAmount),
                          BigInt(formValues.initPriceUnit)
                        ]
                      });
                      return tx;
                    }}
                    onTransactionSent={result => {
                      console.log('Transaction submitted', result.transactionHash);
                    }}
                    onTransactionConfirmed={receipt => {
                      console.log('Transaction confirmed', receipt.transactionHash);
                      handleSubmit(receipt.transactionHash);
                    }}
                    onError={error => {
                      console.error('Transaction error', error);
                    }}>
                    Submit!
                  </TransactionButton>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
