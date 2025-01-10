import PageComponent from './PageComponent';

export const revalidate = 30;
export default function IndexPage({ params: { locale = '', tradeID = '' } }) {
  // Enable static rendering

  return <PageComponent locale={locale} tradeID={tradeID} />;
}
