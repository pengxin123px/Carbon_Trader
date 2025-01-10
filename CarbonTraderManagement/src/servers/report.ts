export class ReportApi {
  static async getReport(key: string): Promise<ReportRsp> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/report?publicKey=${key}`);
    const data = (await response.json()) as ResponseWithData<ReportRsp>;
    return data.data;
  }

  static async reviewReport(publicKey: string, reportID: string, reportStatus: string, penalty: string): Promise<Response> {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/report/review-report`;
    const body = new URLSearchParams({
      'publicKey': publicKey,
      'reportID': reportID,
      'reportStatus': reportStatus,
      'penalty': penalty
    });

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
