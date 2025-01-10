type AuctionRsp = {
  id: string;
  seller: string;
  tradeID: string;
  sellAmount: string;
  minimumBidAmount: string;
  initPriceUnit: string;
  status: string;
  startTime: string;
  endTime: string;
  transactionHash: string;
};

type AuctionReq = {
  tradeID: string;
  publicKey: string;
  sellAmount: string;
  minimumBidAmount: string;
  initPriceUnit: string;
  startTime: string;
  endTime: string;
  hash: string;
};
