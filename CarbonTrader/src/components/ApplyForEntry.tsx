import React, { useState } from 'react';
import { UserApi } from '~/servers/user';
import Swal from 'sweetalert2';

export default function ApplyForEntry({ address }) {
  const [formValues, setFormValues] = useState<CompanyInfo>({
    companyName: '',
    registrationNumber: '',
    companyRepresentative: '',
    companyAddress: '',
    contactEmail: '',
    contactNumber: '',
    emissionData: '',
    reductionStrategy: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const value = target.type === 'textarea' ? target.value : target.value;
    setFormValues({
      ...formValues,
      [target.name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    async function applyForEntry(address: string, companyInfo: string) {
      const res = await UserApi.applyForEntry(address, companyInfo);
    }
    // 在这里可以添加额外的提交逻辑，比如发送数据到服务器
    applyForEntry(address, JSON.stringify(formValues, null, 2));
    Swal.fire({
      title: 'Good job!',
      text: 'Your application is being processed. Please do not resubmit.',
      icon: 'success'
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 sm:text-4xl dark:text-white">Join Our Carbon Trading Platform</h1>
        <p className="text-center text-gray-600 dark:text-neutral-400 pt-3">Upload your company details for carbon credit allocation.</p>
        <form onSubmit={handleSubmit} noValidate className={'py-8'}>
          <div className="grid gap-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              {/* 公司名称 */}
              <div>
                <label htmlFor="companyName" className="block mb-2 text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="Enter company name"
                  required
                  value={formValues.companyName}
                  onChange={handleChange}
                />
              </div>

              {/* 公司注册号码 */}
              <div>
                <label htmlFor="registrationNumber" className="block mb-2 text-sm font-medium text-gray-700">
                  Registration Number
                </label>
                <input
                  id="registrationNumber"
                  name="registrationNumber"
                  type="text"
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="Enter registration number"
                  required
                  value={formValues.registrationNumber}
                  onChange={handleChange}
                />
              </div>

              {/* 公司代表人 */}
              <div>
                <label htmlFor="companyRepresentative" className="block mb-2 text-sm font-medium text-gray-700">
                  Company Representative
                </label>
                <input
                  id="companyRepresentative"
                  name="companyRepresentative"
                  type="text"
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="Enter company representative"
                  required
                  value={formValues.companyRepresentative}
                  onChange={handleChange}
                />
              </div>

              {/* 公司地址 */}
              <div>
                <label htmlFor="companyAddress" className="block mb-2 text-sm font-medium text-gray-700">
                  Company Address
                </label>
                <input
                  id="companyAddress"
                  name="companyAddress"
                  type="text"
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="Enter company address"
                  required
                  value={formValues.companyAddress}
                  onChange={handleChange}
                />
              </div>

              {/* 联系邮箱 */}
              <div>
                <label htmlFor="contactEmail" className="block mb-2 text-sm font-medium text-gray-700">
                  Contact Email
                </label>
                <input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="Enter contact email"
                  required
                  value={formValues.contactEmail}
                  onChange={handleChange}
                />
              </div>

              {/* 联系电话 */}
              <div>
                <label htmlFor="contactNumber" className="block mb-2 text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  id="contactNumber"
                  name="contactNumber"
                  type="text"
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="Enter contact Number"
                  required
                  value={formValues.contactNumber}
                  onChange={handleChange}
                />
              </div>

              {/* 排放数据 */}
              <div>
                <label htmlFor="emissionData" className="block mb-2 text-sm font-medium text-gray-700">
                  Emission Data
                </label>
                <textarea
                  id="emissionData"
                  name="emissionData"
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="Enter emission data"
                  required
                  value={formValues.emissionData}
                  onChange={handleChange}></textarea>
              </div>

              {/* 减排策略 */}
              <div>
                <label htmlFor="reductionStrategy" className="block mb-2 text-sm font-medium text-gray-700">
                  Reduction Strategy
                </label>
                <textarea
                  id="reductionStrategy"
                  name="reductionStrategy"
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="Describe your company's carbon reduction plans and strategies"
                  required
                  value={formValues.reductionStrategy}
                  onChange={handleChange}></textarea>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
                Apply For Entry
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
