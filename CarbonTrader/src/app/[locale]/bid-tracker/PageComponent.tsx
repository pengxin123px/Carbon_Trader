'use client';
import Header from '~/components/Header';
import Footer from '~/components/Footer';
import HeadInfo from '~/components/HeadInfo';
import { useEffect, useState } from 'react';
import { AuctionApi } from '~/servers/auction';
import AuctionCards from '~/components/AuctionCards';
import {useActiveWallet} from "thirdweb/react";
import BidCards from "~/components/BidCards";
import {BidApi} from "~/servers/bid";

export default function PageComponent(p: { locale }) {
  const [bids, setBids] = useState([] as BidRsp[]);

    const wallet = useActiveWallet();
    const address = wallet?.getAccount()?.address;

  useEffect(() => {
    async function getBids(address: string) {
      const bids = await BidApi.getBids(address);
        setBids(bids);
    }
      getBids(address);
  }, [address]);

  return (
    <>
      <HeadInfo locale={p.locale} title={'Bid Tracker'} description={'Bid Tracker'} />
      <Header locale={p.locale} />

      {/*<Profile user={userInfo} />*/}
      <div className="flex container mx-auto max-w-6xl">
          <BidCards bids={bids} />
      </div>

      <Footer locale={p.locale} />
    </>
  );
}
