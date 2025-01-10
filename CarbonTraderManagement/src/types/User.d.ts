interface companyInfo {
  companyName: string;
  registrationNumber: string;
  companyRepresentative: string;
  companyAddress: string;
  contactEmail: string;
  contactNumber: string;
  emissionData: string;
  reductionStrategy: string;
}

type UserInfo = {
  id?: string;
  public_key: string;
  report_id: string;
  penalty_id: string;
  status: string;
  company_msg: string;
  extra_msg: string;
  create_time?: string;
};
