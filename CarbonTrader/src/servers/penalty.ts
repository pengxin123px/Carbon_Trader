export class PenaltyApi {
  static async getPenalty(key: string): Promise<PenaltyRsp> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/penalty?public_key=${key}`);
    const data = (await response.json()) as ResponseWithData<PenaltyRsp>;
    return data.data;
  }
}
