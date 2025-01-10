'use client';
import Header from '~/components/Header';
import Footer from '~/components/Footer';
import HeadInfo from '~/components/HeadInfo';
import { useActiveWallet, useReadContract } from 'thirdweb/react';
import { useEffect, useMemo, useState } from 'react';
import { UserApi } from '~/servers/user';
import Profile from '~/components/Profile';
import { CONTRACT_ADDRESS, TOKEN_ADDRESS } from '~/constants/address';
import { client } from '~/app/client';
import { sepolia } from 'thirdweb/chains';
import { getContract } from 'thirdweb';
import { ReportApi } from '~/servers/report';
import { PenaltyApi } from '~/servers/penalty';

export default function PageComponent(p: { locale }) {
  const wallet = useActiveWallet();
  const address = wallet?.getAccount()?.address;
  const [userInfo, setUserInfo] = useState({} as UserInfo);
  const [report, setReport] = useState({} as ReportRsp);
  const [penalty, setPenalty] = useState({} as PenaltyRsp);

  const contract = useMemo(
    () =>
      getContract({
        client,
        chain: sepolia,
        address: CONTRACT_ADDRESS
      }),
    []
  );

  const { data: allowance, isLoading: isProfileStatusLoading } = useReadContract({
    contract,
    method: 'function getAllownance(address user) view returns (uint256)',
    params: [address as string]
  });

  const { data: frozenAllowance, isLoading: isFrozenAllowanceLoading } = useReadContract({
    contract,
    method: 'function getFrozenAllowance(address user) view returns (uint256)',
    params: [address as string]
  });

  useEffect(() => {
    async function getUserInfo(address: string) {
      const user = await UserApi.getUserInfo(address);
      setUserInfo(user);
    }

    async function getUserReport(address: string) {
      const report = await ReportApi.getReport(address);
      setReport(report);
    }

    async function getUserPenalty(address: string) {
      const penalty = await PenaltyApi.getPenalty(address);
      setPenalty(penalty);
    }

    if (address) {
      getUserInfo(address);
      getUserReport(address);
      getUserPenalty(address);
    }
  }, [address]);

  return (
    <>
      <HeadInfo locale={p.locale} title={'CarbonTrader'} description={'CarbonTrader'} />
      <Header locale={p.locale} />

      <Profile user={userInfo} allowance={allowance} frozenAllowance={frozenAllowance} report={report} penalty={penalty} />

      <Footer locale={p.locale} />
    </>
  );
}
