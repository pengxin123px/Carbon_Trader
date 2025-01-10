import PageComponent from './PageComponent';

export const revalidate = 30;
export default function IndexPage({ params: { locale = '', page = 1 } }) {
  // Enable static rendering

  return <PageComponent locale={locale} />;
}
