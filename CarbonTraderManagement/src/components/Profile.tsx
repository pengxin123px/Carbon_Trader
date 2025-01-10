'use client';

import { convertApplyStatus } from '~/utils/convertStatus';
import React, { useMemo, useRef, useState } from 'react';
import { UserApi } from '~/servers/user';
import { USER_STATUS_NORMAL, USER_STATUS_REJECT } from '~/configs/constants';
import { TransactionButton, useActiveWallet, useReadContract, useSendTransaction } from 'thirdweb/react';
import { getContract, prepareContractCall } from 'thirdweb';
import { client } from '~/app/client';
import { sepolia } from 'thirdweb/chains';
import { CONTRACT_ADDRESS } from '~/constants/address';
import Swal from 'sweetalert2';
import { ReportApi } from '~/servers/report';
import * as sweetalert2 from 'sweetalert2';

export default function Profile(p: { user: UserInfo; report: ReportRsp }) {
  const [allowance, setAllowance] = useState(0);
  const [penalty, setPenalty] = useState(0);

  const contract = useMemo(
    () =>
      getContract({
        client,
        chain: sepolia,
        address: CONTRACT_ADDRESS
      }),
    []
  );

  const { data: allowanceBalance, isLoading: isProfileStatusLoading } = useReadContract({
    contract,
    method: 'function getAllownance(address user) view returns (uint256)',
    params: [p.user.public_key as string]
  });

  const { data: frozenAllowance, isLoading: isFrozenAllowanceLoading } = useReadContract({
    contract,
    method: 'function getFrozenAllowance(address user) view returns (uint256)',
    params: [p.user.public_key as string]
  });

  const handleInputChange = event => {
    // 确保输入值是数字，并且是有效的
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setAllowance(value);
    } else {
      // 如果输入不是数字，可以选择重置状态或者显示错误
      console.error('you should set a number');
    }
  };

  const handleInputPenaltyChange = event => {
    // 确保输入值是数字，并且是有效的
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setPenalty(value);
    } else {
      // 如果输入不是数字，可以选择重置状态或者显示错误
      console.error('you should set a number');
    }
  };

  const handleApprove = () => {
    async function reviewEntry(id: string, status: string) {
      const res = await UserApi.reviewEntry(id, status);
    }
    // 在这里可以添加额外的提交逻辑，比如发送数据到服务器
    reviewEntry(p.user.id, USER_STATUS_NORMAL);
    Swal.fire({
      text: 'This entry has been approved.',
      icon: 'success'
    });
  };

  const handleReject = () => {
    async function reviewEntry(id: string, status: string) {
      const res = await UserApi.reviewEntry(id, status);
    }
    // 在这里可以添加额外的提交逻辑，比如发送数据到服务器
    reviewEntry(p.user.id, USER_STATUS_REJECT);
    Swal.fire({
      text: 'This entry has been rejected.',
      icon: 'success'
    });
  };

  const handleReviewReport = () => {
    if (penalty == 0) {
      ReportApi.reviewReport(p.user.public_key, p.report.reportID.toString(), '1', penalty.toString());
    } else {
      ReportApi.reviewReport(p.user.public_key, p.report.reportID.toString(), '2', penalty.toString());
    }
    Swal.fire({
      text: 'This review has been send to user.',
      icon: 'success'
    });
  };

  return (
    <div className="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="bg-white rounded-xl shadow p-4 sm:p-7 dark:bg-neutral-900">
        <form>
          <div className="grid sm:grid-cols-12 gap-2 sm:gap-4 py-8 first:pt-0 last:pb-0 border-t first:border-transparent border-gray-200 dark:border-neutral-700 dark:first:border-transparent">
            <div className="sm:col-span-12">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Company Profile</h2>
            </div>

            <div className="sm:col-span-3">
              <label className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500">Company Name</label>
            </div>

            <div className="sm:col-span-9">
              <p className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                {p.user.company_msg ? (JSON.parse(p.user?.company_msg) as CompanyInfo).companyName : ''}
              </p>
            </div>

            <div className="sm:col-span-3">
              <div className="inline-block">
                <label className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500">Registration Number</label>
              </div>
            </div>

            <div className="sm:col-span-9">
              <p className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                {p.user.company_msg ? (JSON.parse(p.user?.company_msg) as CompanyInfo).registrationNumber : ''}
              </p>
            </div>

            <div className="sm:col-span-3">
              <div className="inline-block">
                <label className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500">Company Representative</label>
              </div>
            </div>

            <div className="sm:col-span-9">
              <p className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                {p.user.company_msg ? (JSON.parse(p.user?.company_msg) as CompanyInfo).companyRepresentative : ''}
              </p>
            </div>

            <div className="sm:col-span-3">
              <div className="inline-block">
                <label className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500">Company Address</label>
              </div>
            </div>

            <div className="sm:col-span-9">
              <p className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                {p.user.company_msg ? (JSON.parse(p.user?.company_msg) as CompanyInfo).companyAddress : ''}
              </p>
            </div>

            <div className="sm:col-span-3">
              <div className="inline-block">
                <label className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500">Contact Email</label>
              </div>
            </div>

            <div className="sm:col-span-9">
              <p className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                {p.user.company_msg ? (JSON.parse(p.user?.company_msg) as CompanyInfo).contactEmail : ''}
              </p>
            </div>

            <div className="sm:col-span-3">
              <div className="inline-block">
                <label className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500">Contact Number</label>
              </div>
            </div>

            <div className="sm:col-span-9">
              <p
                id="af-submit-application-email"
                className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                {p.user.company_msg ? (JSON.parse(p.user?.company_msg) as CompanyInfo).contactNumber : ''}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-12 gap-2 sm:gap-4 py-8 first:pt-0 last:pb-0 border-t first:border-transparent border-gray-200 dark:border-neutral-700 dark:first:border-transparent">
            <div className="sm:col-span-12">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Carbon Emission Information</h2>
            </div>

            <div className="sm:col-span-3">
              <div className="inline-block">
                <label className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500">Emission Data</label>
              </div>
            </div>

            <div className="sm:col-span-9">
              <textarea
                className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                value={p.user.company_msg ? (JSON.parse(p.user?.company_msg) as CompanyInfo).emissionData : ''}
                readOnly={true}
                placeholder="Your Emission Data."></textarea>
            </div>

            <div className="sm:col-span-3">
              <div className="inline-block">
                <label className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500">Reduction Strategy</label>
              </div>
            </div>

            <div className="sm:col-span-9">
              <textarea
                className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                value={p.user.company_msg ? (JSON.parse(p.user?.company_msg) as CompanyInfo).reductionStrategy : ''}
                readOnly={true}
                placeholder="Your Reduction Strategy."></textarea>
            </div>

            {p.user && p.user.status == '0' ? (
              <div className="sm:col-span-6">
                <button
                  type="button"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-green-500 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  onClick={handleApprove}>
                  Approve
                </button>
              </div>
            ) : null}

            {p.user && p.user.status == '0' ? (
              <div className="sm:col-span-6">
                <button
                  type="button"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-red-500 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  onClick={handleReject}>
                  Reject
                </button>
              </div>
            ) : null}
          </div>

          {p.report.report != '' ? (
            <div className="grid sm:grid-cols-12 gap-2 sm:gap-4 py-4 first:pt-0 last:pb-0 border-t first:border-transparent border-gray-200 dark:border-neutral-700 dark:first:border-transparent">
              <div className="sm:col-span-12">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Carbon Emission Report And Penalty</h2>
              </div>

              <div className="sm:col-span-3">
                <div className="inline-block">
                  <label className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500">Emission Report</label>
                </div>
              </div>

              <div className="sm:col-span-9">
                <textarea
                  className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  value={p.report.report}
                  readOnly={true}
                  placeholder="Your Emission Report."></textarea>
              </div>

              <div className="sm:col-span-3">
                <div className="inline-block">
                  <label className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500">Penalty</label>
                </div>
              </div>

              <div className="sm:col-span-5">
                <input
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  onChange={handleInputPenaltyChange}
                  placeholder={'If no penalty, please leave blank'}></input>
              </div>

              <div className="sm:col-span-4">
                <TransactionButton
                  type="button"
                  unstyled
                  className="w-full py-2 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-red-500 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  transaction={() => {
                    // Create a transaction object and return it
                    const tx = prepareContractCall({
                      contract,
                      method: 'function destoryAllAllowance(address user)',
                      params: [p.user.public_key as string]
                    });
                    return tx;
                  }}
                  onTransactionSent={result => {
                    console.log('Transaction submitted', result.transactionHash);
                  }}
                  onTransactionConfirmed={receipt => {
                    console.log('Transaction confirmed', receipt.transactionHash);
                    handleReviewReport();
                  }}
                  onError={error => {
                    console.error('Transaction error', error);
                  }}>
                  Review And Punish!
                </TransactionButton>
              </div>
            </div>
          ) : null}

          <div className="grid sm:grid-cols-12 gap-2 sm:gap-4 py-4 first:pt-0 last:pb-0 border-t first:border-transparent border-gray-200 dark:border-neutral-700 dark:first:border-transparent">
            <div className="sm:col-span-12">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Others</h2>
            </div>

            <div className="sm:col-span-3">
              <div className="inline-block">
                <label className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500">Apply Status</label>
              </div>
            </div>

            <div className="sm:col-span-9">
              <p className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                {p.user ? convertApplyStatus(p.user.status) : ''}
              </p>
            </div>

            <div className="sm:col-span-3">
              <div className="inline-block">
                <label className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500">Allowance</label>
              </div>
            </div>

            <div className="sm:col-span-9">
              <p className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                {allowanceBalance?.toString()}
              </p>
            </div>

            <div className="sm:col-span-3">
              <div className="inline-block">
                <label className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500">Frozen Allowance</label>
              </div>
            </div>

            <div className="sm:col-span-9">
              <p className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                {frozenAllowance?.toString()}
              </p>
            </div>
          </div>

          {p.user && p.user.status == '1' ? (
            <div className="grid sm:grid-cols-12 gap-2 sm:gap-4 first:pt-0 last:pb-0">
              <div className="sm:col-span-3">
                <div className="inline-block">
                  <label className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500">Issue More Allowance</label>
                </div>
              </div>

              <div className="sm:col-span-5">
                <input
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  onChange={handleInputChange}></input>
              </div>

              <div className="sm:col-span-4">
                <TransactionButton
                  type="button"
                  unstyled
                  className="w-full py-2 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  transaction={() => {
                    // Create a transaction object and return it
                    const tx = prepareContractCall({
                      contract,
                      method: 'function issueAllowance(address user, uint256 allowance)',
                      params: [p.user.public_key, BigInt(allowance)]
                    });
                    return tx;
                  }}
                  onTransactionSent={result => {
                    console.log('Transaction submitted', result.transactionHash);
                  }}
                  onTransactionConfirmed={receipt => {
                    console.log('Transaction confirmed', receipt.transactionHash);
                  }}
                  onError={error => {
                    console.error('Transaction error', error);
                  }}>
                  Issue!
                </TransactionButton>
              </div>
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}
