'use client';
import Header from '~/components/Header';
import Footer from '~/components/Footer';
import HeadInfo from '~/components/HeadInfo';
import { useEffect, useState } from 'react';
import { AuctionApi } from '~/servers/auction';
import AuctionCards from '~/components/AuctionCards';
import {useActiveWallet} from "thirdweb/react";

export default function PageComponent(p: { locale }) {
  const [auctions, setAuctions] = useState([] as AuctionRsp[]);

  useEffect(() => {
    async function getAuctions() {
      const auctions = await AuctionApi.getAuctionList();
      setAuctions(auctions);
    }
    getAuctions();
  }, []);

  return (
    <>
      <HeadInfo locale={p.locale} title={'Auction Market'} description={'Auction Market'} />
      <Header locale={p.locale} />

      {/*<Profile user={userInfo} />*/}
      <div className="flex container mx-auto max-w-6xl">
          <AuctionCards auctions={auctions} />
      </div>

      <Footer locale={p.locale} />
    </>
  );
}
