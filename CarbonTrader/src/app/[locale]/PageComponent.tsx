'use client';
import Header from '~/components/Header';
import Footer from '~/components/Footer';
import HeadInfo from '~/components/HeadInfo';
import Hero from '~/components/Hero';
import WorkSteps from '~/components/WorkSteps';
import ApplyForEntry from '~/components/ApplyForEntry';
import { useActiveWallet } from 'thirdweb/react';
import { useEffect, useState } from 'react';
import { UserApi } from '~/servers/user';

export default function PageComponent(p: { locale }) {
  const wallet = useActiveWallet();
  const address = wallet?.getAccount()?.address;
  const [userInfo, setUserInfo] = useState({} as UserInfo);

  useEffect(() => {
    async function getUserInfo(address: string) {
      const user = await UserApi.getUserInfo(address);
      setUserInfo(user);
    }
    if (address) {
      getUserInfo(address);
    }
  }, [address]);

  return (
    <>
      <HeadInfo locale={p.locale} title={'CarbonTrader'} description={'CarbonTrader'} />
      <Header locale={p.locale} />

      <div className="flex container md:container mx-auto max-w-5xl md:max-w-5xl lg:max-w-5xl">
        <div className="mx-auto">
          <Hero />
        </div>
      </div>

      <WorkSteps />
      {!userInfo || !address ? <ApplyForEntry address={address} /> : null}

      <Footer locale={p.locale} />
    </>
  );
}
