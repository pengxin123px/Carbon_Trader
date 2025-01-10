export class AuctionApi {
  static async getAuctionByID(id: string): Promise<AuctionRsp> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auction?tradeID=${id}`);
    const data = (await response.json()) as ResponseWithData<AuctionRsp>;
    return data.data;
  }

  static async getAuctionList(): Promise<AuctionRsp[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auction/list`);
    const data = (await response.json()) as ResponseWithData<AuctionRsp[]>;
    return data.data;
  }

  static async startAuction(req: AuctionReq): Promise<Response> {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auction/start-auction`;
    const body = new URLSearchParams(req);
    console.log(body.toString());

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
