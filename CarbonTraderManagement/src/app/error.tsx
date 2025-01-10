'use client';

import { useEffect } from 'react';

type Props = {
  error: Error | null; // 确保 error 可以为 null
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    if (error) {
      console.error('Error caught by Error boundary:', error);
      console.error(error.stack);
    }
  }, [error]);

  if (!error) {
    return null; // 如果没有错误，不渲染任何内容
  }

  return (
      <div>
        <h1>Error Occurred</h1>
        <p>{error.message}</p> {/* 显示错误消息 */}
      </div>
  );
}