export const convertApplyStatus = (status: string) => {
  if (status === '0') {
    return 'APPLYING';
  } else if (status === '1') {
    return 'NORMAL';
  } else if (status === '2') {
    return 'REJECT';
  }
  return '';
};
