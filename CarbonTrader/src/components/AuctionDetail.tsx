'use client';

import { formatDate } from '~/utils/time';
import React, { useMemo, useState } from 'react';
import { getContract, prepareContractCall } from 'thirdweb';
import { client } from '~/app/client';
import { sepolia } from 'thirdweb/chains';
import { CONTRACT_ADDRESS, TOKEN_ADDRESS } from '~/constants/address';
import { TransactionButton, useReadContract } from 'thirdweb/react';
import { decrypt, encrypt } from '~/utils/crypto';
import { BidApi } from '~/servers/bid';

export default function AuctionDetail(p: { user: UserInfo; tradeID: string; auction: AuctionRsp }) {
  const [formValues, setFormValues] = useState<BidInfo>({
    publicKey: '',
    quantityOfAuction: 0,
    pricePerUint: 0
  });
  const [bidPassword, setBidPassword] = useState('' as string);
  const Decimals = BigInt('1000000000000000000');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    setFormValues({
      ...formValues,
      ['publicKey']: p.user.public_key as string,
      [target.name]: target.value
    });
  };

  const handleBidPasswordChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    setBidPassword(target.value);
  };

  const CarbonContract = useMemo(
    () =>
      getContract({
        client,
        chain: sepolia,
        address: CONTRACT_ADDRESS
      }),
    []
  );

  const TokenContract = useMemo(
    () =>
      getContract({
        client,
        chain: sepolia,
        address: TOKEN_ADDRESS
      }),
    []
  );

  const { data: allowance, isLoading: isGetAllownanceLoading } = useReadContract({
    contract: CarbonContract,
    method: 'function getAllownance(address user) view returns (uint256)',
    params: [p.user.public_key as string]
  });

  const { data: balance, isLoading: isGetBalanceOfLoading } = useReadContract({
    contract: TokenContract,
    method: 'function balanceOf(address who) view returns (uint256)',
    params: [p.user.public_key as string]
  });

  return (
    <div className="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="bg-white rounded-xl shadow p-4 sm:p-7 dark:bg-neutral-900">
        <form>
          <div className="grid sm:grid-cols-12 gap-2 sm:gap-4 py-8 first:pt-0 last:pb-0 border-t first:border-transparent border-gray-200 dark:border-neutral-700 dark:first:border-transparent">
            <div className="sm:col-span-12">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Auction Detail</h2>
            </div>

            <div className="sm:col-span-3">
              <label className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500">Sell Amount</label>
            </div>

            <div className="sm:col-span-9">
              <p className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                {p.auction?.sellAmount ? p.auction?.sellAmount : ''}
              </p>
            </div>

            <div className="sm:col-span-3">
              <div className="inline-block">
                <label className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500">Minimum Bid Amount</label>
              </div>
            </div>

            <div className="sm:col-span-9">
              <p className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                {p.auction?.minimumBidAmount ? p.auction?.minimumBidAmount : ''}
              </p>
            </div>

            <div className="sm:col-span-3">
              <div className="inline-block">
                <label className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500">Init Price Unit</label>
              </div>
            </div>

            <div className="sm:col-span-9">
              <p className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                {p.auction?.initPriceUnit ? p.auction?.initPriceUnit : ''}
              </p>
            </div>

            <div className="sm:col-span-3">
              <div className="inline-block">
                <label className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500">Start Time</label>
              </div>
            </div>

            <div className="sm:col-span-9">
              <p className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                {p.auction?.startTime ? formatDate(p.auction?.startTime) : ''}
              </p>
            </div>

            <div className="sm:col-span-3">
              <div className="inline-block">
                <label className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500">End Time</label>
              </div>
            </div>

            <div className="sm:col-span-9">
              <p className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                {p.auction?.endTime ? formatDate(p.auction?.endTime) : ''}
              </p>
            </div>

            <div className="sm:col-span-3">
              <div className="inline-block">
                <label className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500">Seller Address</label>
              </div>
            </div>

            <div className="sm:col-span-9">
              <p
                id="af-submit-application-email"
                className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none hover:text-green-400"
                onClick={e => {
                  e.preventDefault();
                  window.open(`https://sepolia.etherscan.io/address/${p.auction?.seller}`, '_blank');
                }}>
                {p.auction?.seller ? p.auction?.seller : ''}
              </p>
            </div>

            <div className="sm:col-span-3">
              <div className="inline-block">
                <label className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500">Transaction Hash</label>
              </div>
            </div>

            <div className="sm:col-span-9">
              <p
                id="af-submit-application-email"
                className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none hover:text-green-400"
                onClick={e => {
                  e.preventDefault();
                  window.open(`https://sepolia.etherscan.io/tx/${p.auction?.transactionHash}`, '_blank');
                }}>
                {p.auction?.transactionHash ? p.auction?.transactionHash : ''}
              </p>
            </div>
          </div>

          {new Date() < new Date(p.auction?.endTime) ? (
            <div className="grid sm:grid-cols-12 gap-2 sm:gap-4 py-8 first:pt-0 last:pb-0 border-t first:border-transparent border-gray-200 dark:border-neutral-700 dark:first:border-transparent">
              <div className="sm:col-span-12">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Auction Information</h2>
              </div>

              <div className="sm:col-span-3">
                <div className="inline-block">
                  <label className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500">Your Allowance</label>
                </div>
              </div>

              <div className="sm:col-span-9">
                <p className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                  {allowance?.toString()}
                </p>
              </div>

              <div className="sm:col-span-3">
                <div className="inline-block">
                  <label className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500">Balance Of Token</label>
                </div>
              </div>

              <div className="sm:col-span-9">
                {balance ? (
                  <p className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                    {(balance / Decimals)?.toString()}
                  </p>
                ) : null}
              </div>

              <div className="sm:col-span-3">
                <div className="inline-block">
                  <label className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500">Quantity for Auction</label>
                </div>
              </div>

              <div className="sm:col-span-9">
                <input
                  name={'quantityOfAuction'}
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  onChange={handleChange}
                  placeholder="Enter Quantity
                  for Auction"></input>
              </div>

              <div className="sm:col-span-3">
                <div className="inline-block">
                  <label className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500">Price per Unit</label>
                </div>
              </div>

              <div className="sm:col-span-9">
                <input
                  name={'pricePerUint'}
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  onChange={handleChange}
                  placeholder="Enter Price per Unit"></input>
              </div>

              <div className="sm:col-span-3">
                <div className="inline-block">
                  <label className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500">Auction Password</label>
                </div>
              </div>

              <div className="sm:col-span-9">
                <input
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  placeholder="Set An Auction Password"
                  onChange={handleBidPasswordChange}></input>
              </div>

              <div className="sm:col-span-3"></div>

              <div className="sm:col-span-9">
                <p className="text-red-500 w-full text-xs font-bold">Please make sure to remember your auction password. You will need it to bid on your auction.</p>
              </div>

              <div className="sm:col-span-6">
                <TransactionButton
                  type="button"
                  unstyled
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                  transaction={() => {
                    // Create a transaction object and return it
                    const tx = prepareContractCall({
                      contract: TokenContract,
                      method: 'function approve(address spender, uint256 value) returns (bool)',
                      params: [CONTRACT_ADDRESS, BigInt(formValues.pricePerUint) * Decimals]
                    });
                    return tx;
                  }}
                  onTransactionSent={result => {
                    console.log('Transaction submitted', result.transactionHash);
                  }}
                  onTransactionConfirmed={async receipt => {
                    console.log('Transaction confirmed', receipt.transactionHash);
                  }}
                  onError={error => {
                    console.error('Transaction error', error);
                  }}>
                  Approve First
                </TransactionButton>
              </div>

              <div className="sm:col-span-6">
                {/*<button*/}
                {/*    type="button"*/}
                {/*    className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"*/}
                {/*onClick={() => {*/}
                {/*  console.log(JSON.stringify(formValues))*/}
                {/*  const password = bidPassword*/}
                {/*  console.log(password)*/}
                {/*  const encrypted = encrypt(JSON.stringify(formValues), password);*/}
                {/*  console.log('Encrypted:', encrypted);*/}

                {/*  const decrypted = decrypt(encrypted, password);*/}
                {/*  console.log('Decrypted:', decrypted);*/}
                {/*}}>*/}
                {/*  Deposit*/}
                {/*</button>*/}
                <TransactionButton
                  type="button"
                  unstyled
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                  transaction={() => {
                    // Create a transaction object and return it
                    const tx = prepareContractCall({
                      contract: CarbonContract,
                      method: 'function deposit(string tradeID, uint256 amount, string info)',
                      params: [p.tradeID, BigInt(formValues.pricePerUint) * Decimals, encrypt(JSON.stringify(formValues), bidPassword)]
                    });
                    return tx;
                  }}
                  onTransactionSent={result => {
                    console.log('Transaction submitted', result.transactionHash);
                  }}
                  onTransactionConfirmed={receipt => {
                    console.log('Transaction confirmed', receipt.transactionHash);
                    BidApi.submitBid({ publicKey: p.user.public_key, auctionID: p.tradeID, biddingMsg: encrypt(JSON.stringify(formValues), bidPassword), hash: receipt.transactionHash } as BidReq);
                  }}
                  onError={error => {
                    console.error('Transaction error', error);
                  }}>
                  Deposit
                </TransactionButton>
              </div>
            </div>
          ) : null}

          {/*<button*/}
          {/*  type="button"*/}
          {/*  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">*/}
          {/*  Submit application*/}
          {/*</button>*/}
        </form>
      </div>
    </div>
  );
}
