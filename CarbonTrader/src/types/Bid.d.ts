type BidInfo = {
  publicKey: string;
  quantityOfAuction: number;
  pricePerUint: number;
};

type BidReq = {
  publicKey: string;
  auctionID: string;
  biddingMsg: string;
  hash: string;
};

type UpdateBidReq = {
  biddingID: string;
  biddingMsg: string;
  hash: string;
  status?: string;
};

type BidRsp = {
  id: string;
  buyer: string;
  auctionID: string;
  biddingID: string;
  biddingMsg: string;
  biddingStatus: string;
  allocateAmount: number;
  additionalAmountToPay: number;
  biddingTime: string;
  hash: string;
};
