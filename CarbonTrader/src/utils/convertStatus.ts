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

export const convertBidStatus = (status: string) => {
  if (status === '0') {
    return 'AWAIT START';
  } else if (status === '1') {
    return 'AWAIT DECRYPT';
  } else if (status === '2') {
    return 'AWAIT OPEN';
  } else if (status === '3') {
    return 'AWAIT PAYMENT';
  } else if (status === '4') {
    return 'AWAIT REFUND';
  } else if (status === '5') {
    return 'FINISHED';
  }
  return '';
};

export const convertReportStatus = (status: string) => {
  if (status === '0') {
    return 'Your report is being reviewed';
  } else if (status === '1') {
    return 'Your emissions for this year have ended, the allowance is normal, and no fines are required';
  } else if (status === '2') {
    return 'Your emissions for this year have ended, please pay the following fines';
  }
  return '';
};
