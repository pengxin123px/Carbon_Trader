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
import AuctionDetail from '~/components/AuctionDetail';
import { BidApi } from '~/servers/bid';
import { AuctionApi } from '~/servers/auction';
import BidDetail from '~/components/BidDetail';

export default function PageComponent(p: { locale; tradeID }) {
  const wallet = useActiveWallet();
  const address = wallet?.getAccount()?.address;
  const [userInfo, setUserInfo] = useState({} as UserInfo);
  const [bid, setBid] = useState({} as BidRsp);
  const [auction, setAuction] = useState({} as AuctionRsp);

  useEffect(() => {
    async function getBid() {
      const Bid = await BidApi.getBidByID(p.tradeID);
      setBid(Bid);
    }

    getBid();
  }, []);

  useEffect(() => {
    async function getAuction() {
      const auction = await AuctionApi.getAuctionByID(bid.auctionID);
      setAuction(auction);
    }

    getAuction();
  }, [bid.auctionID]);

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

      <BidDetail user={userInfo} bid={bid} auction={auction} />

      <Footer locale={p.locale} />
    </>
  );
}
