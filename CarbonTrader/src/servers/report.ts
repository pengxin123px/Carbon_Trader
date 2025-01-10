export class ReportApi {
  static async getReport(key: string): Promise<ReportRsp> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/report?publicKey=${key}`);
    const data = (await response.json()) as ResponseWithData<ReportRsp>;
    return data.data;
  }

  static async submitReport(publicKey: string, report: string): Promise<Response> {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/report/submit-report`;
    const body = new URLSearchParams({
      'publicKey': publicKey,
      'report': report
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
