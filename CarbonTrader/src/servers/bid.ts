export class BidApi {
  static async getBids(publicKey: string): Promise<BidRsp[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bidding/key?publicKey=${publicKey}`);
    const data = (await response.json()) as ResponseWithData<BidRsp[]>;
    return data.data;
  }

  static async getBidByID(id: string): Promise<BidRsp> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bidding/id?biddingID=${id}`);
    const data = (await response.json()) as ResponseWithData<BidRsp>;
    return data.data;
  }

  static async submitBid(req: BidReq): Promise<Response> {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bidding/submit-bidding`;
    const body = new URLSearchParams(req);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()) as Response;
  }

  static async updateBid(req: UpdateBidReq): Promise<Response> {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bidding/update-bidding`;
    const body = new URLSearchParams(req);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()) as Response;
  }
}
