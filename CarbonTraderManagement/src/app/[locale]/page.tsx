import PageComponent from './PageComponent';
import { unstable_setRequestLocale } from 'next-intl/server';
import { useActiveWallet } from 'thirdweb/react';

export const revalidate = 30;
export default function IndexPage({ params: { locale = '', page = 1 } }) {
  // Enable static rendering

  return <PageComponent locale={locale} />;
}
