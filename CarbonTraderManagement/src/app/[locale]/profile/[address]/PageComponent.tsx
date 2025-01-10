'use client';
import Header from '~/components/Header';
import Footer from '~/components/Footer';
import HeadInfo from '~/components/HeadInfo';
import { useActiveWallet } from 'thirdweb/react';
import { useEffect, useState } from 'react';
import { UserApi } from '~/servers/user';
import Profile from '~/components/Profile';
import { ReportApi } from '~/servers/report';

export default function PageComponent(p: { locale, address }) {
  const [userInfo, setUserInfo] = useState({} as UserInfo);
  const [report, setReport] = useState({} as ReportRsp);

  useEffect(() => {
    async function getUserInfo(address: string) {
      const user = await UserApi.getUserInfo(address);
      setUserInfo(user);
    }

    async function getUserReport(address: string) {
      const report = await ReportApi.getReport(address);
      setReport(report);
    }

    getUserInfo(p.address);
    getUserReport(p.address);
  }, [p.address]);

  return (
    <>
      <HeadInfo locale={p.locale} title={'CarbonTrader'} description={'CarbonTrader'} />
      <Header locale={p.locale} />

      <Profile user={userInfo} report={report}/>

      <Footer locale={p.locale} />
    </>
  );
}
