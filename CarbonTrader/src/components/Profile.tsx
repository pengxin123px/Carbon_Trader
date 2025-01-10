'use client';

import { convertApplyStatus, convertReportStatus } from '~/utils/convertStatus';
import React, { useMemo, useState } from 'react';
import { getContract } from 'thirdweb';
import { client } from '~/app/client';
import { sepolia } from 'thirdweb/chains';
import { TOKEN_ADDRESS } from '~/constants/address';
import { useReadContract } from 'thirdweb/react';
import { ReportApi } from '~/servers/report';
import * as sweetalert2 from 'sweetalert2';
import Swal from 'sweetalert2';

export default function Profile(p: { user: UserInfo; allowance: bigint; frozenAllowance: bigint; report: ReportRsp; penalty: PenaltyRsp }) {
  const [report, setReport] = useState('');
  const Decimals = BigInt('1000000000000000000');
  const TokenContract = useMemo(
    () =>
      getContract({
        client,
        chain: sepolia,
        address: TOKEN_ADDRESS
      }),
    []
  );

  const { data: balance, isLoading: isGetBalanceOfLoading } = useReadContract({
    contract: TokenContract,
    method: 'function balanceOf(address who) view returns (uint256)',
    params: [p.user.public_key as string]
  });

  const handleReportChange = event => {
    setReport(event.target.value);
    console.log(report);
  };

  function submitReport() {
    ReportApi.submitReport(p.user.public_key, report);

    Swal.fire({
      title: 'Good job!',
      text: 'Your report has been submitted. Please do not resubmit.',
      icon: 'success'
    });
  }

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
          </div>

          <div className="grid sm:grid-cols-12 gap-2 sm:gap-4 py-8 first:pt-0 last:pb-0 border-t first:border-transparent border-gray-200 dark:border-neutral-700 dark:first:border-transparent">
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
                {p?.allowance?.toString()}
              </p>
            </div>

            <div className="sm:col-span-3">
              <div className="inline-block">
                <label className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500">Frozen Allowance</label>
              </div>
            </div>

            <div className="sm:col-span-9">
              <p className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                {p?.frozenAllowance?.toString()}
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
          </div>

          <div className="grid sm:grid-cols-12 gap-2 sm:gap-4 pt-8 first:pt-0 last:pb-0 border-t first:border-transparent border-gray-200 dark:border-neutral-700 dark:first:border-transparent">
            <div className="sm:col-span-12">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Carbon Emission Report</h2>
            </div>

            <div className="sm:col-span-3">
              <div className="inline-block">
                <label className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500">Emission Report</label>
              </div>
            </div>

            <div className="sm:col-span-9">
              {p.report.report == '' ? (
                <textarea
                  className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  onChange={handleReportChange}
                  placeholder="Your Emission Report."></textarea>
              ) : (
                <textarea
                  className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  value={p.report.report}
                  readOnly={true}
                  placeholder="Your Emission Report."></textarea>
              )}
            </div>

            {p.report.report == '' ? (
              <div className="sm:col-span-12">
                <button
                  type="button"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  onClick={submitReport}>
                  Submit Report
                </button>
              </div>
            ) : null}
          </div>

          {p.report.report != '' ? (
            <div className="grid sm:grid-cols-12 gap-2 sm:gap-4">
              <div className="sm:col-span-3"></div>

              <div className="sm:col-span-9">
                <p className="text-red-500 w-full text-xs font-bold">{convertReportStatus(p.report.reportStatus)}</p>
              </div>
            </div>
          ) : null}

          {p.report.reportStatus == '2' ? (
            <div className="grid sm:grid-cols-12 gap-2 sm:gap-4 mt-4">
              <div className="sm:col-span-3">
                <label className="inline-block text-sm mt-2.5 text-red-600 font-bold">Penalty</label>
              </div>

              <div className="sm:col-span-9">
                <p className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-red-600 font-bold rounded-lg ">{p.penalty?.penalty}</p>
              </div>
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}
