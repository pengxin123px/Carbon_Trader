interface ResponseWithData<T> {
  code: number;
  message: string;
  data: T;
}

interface Response {
  code: number;
  message: string;
}
