import PageComponent from './PageComponent';

export const revalidate = 30;
export default function IndexPage({ params: { locale = '', address = "" } }) {
  // Enable static rendering

  return <PageComponent locale={locale} address={address} />;
}
