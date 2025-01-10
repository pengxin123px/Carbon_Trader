export class UserApi {
  static async getUserInfo(key: string): Promise<UserInfo> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user?public_key=${key}`);
    const data = (await response.json()) as ResponseWithData<UserInfo>;
    return data.data;
  }

  static async applyForEntry(publicKey: string, companyMsg: string): Promise<Response> {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/apply-entry`;
    const body = new URLSearchParams({
      'public_key': publicKey,
      'company_msg': companyMsg
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
