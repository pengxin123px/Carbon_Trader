export function formatDay(timeString) {
  // 将时间字符串转换为Date对象
  const date = new Date(timeString);

  // 获取年、月、日、小时、分钟和秒
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  // 格式化日期和时间
  return `${year}-${month}-${day}`;
  // return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function formatDate(timeString) {
  // 将时间字符串转换为Date对象
  const date = new Date(timeString);

  // 获取年、月、日、小时、分钟和秒
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  // 格式化日期和时间
  // return `${year}-${month}-${day}`;
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function parseTimeToTimestamp(timeString) {
  return new Date(timeString).getTime();
}