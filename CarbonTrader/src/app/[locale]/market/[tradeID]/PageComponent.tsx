'use client';
import Header from '~/components/Header';
import Footer from '~/components/Footer';
import HeadInfo from '~/components/HeadInfo';
import { useActiveWallet, useReadContract } from 'thirdweb/react';
import { useEffect, useMemo, useState } from 'react';
import { UserApi } from '~/servers/user';
import { AuctionApi } from '~/servers/auction';
import AuctionDetail from '~/components/AuctionDetail';

export default function PageComponent(p: { locale; tradeID }) {
  const wallet = useActiveWallet();
  const address = wallet?.getAccount()?.address;
  const [userInfo, setUserInfo] = useState({} as UserInfo);
  const [auction, setAuction] = useState({} as AuctionRsp);

  useEffect(() => {
    async function getAuction() {
      const auction = await AuctionApi.getAuctionByID(p.tradeID);
      setAuction(auction);
    }

    getAuction();
  }, []);

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

      <AuctionDetail user={userInfo} tradeID={p.tradeID} auction={auction} />

      <Footer locale={p.locale} />
    </>
  );
}
