export class UserApi {
  static async getUsers(): Promise<UserInfo[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/list`);
    const data = (await response.json()) as ResponseWithData<UserInfo[]>;
    return data.data;
  }

  static async getUserInfo(key: string): Promise<UserInfo> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user?public_key=${key}`);
    const data = (await response.json()) as ResponseWithData<UserInfo>;
    return data.data;
  }

  static async reviewEntry(id: string, status: string): Promise<Response> {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/review-entry`;
    const body = new URLSearchParams({
      'id': id,
      'status': status
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
