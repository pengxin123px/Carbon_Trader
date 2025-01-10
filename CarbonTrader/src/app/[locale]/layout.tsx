import clsx from 'clsx';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';
import { ReactNode } from 'react';
import { locales } from "~/config";
import { CommonProvider } from "~/context/common-context";
import { getAuthText, getCommonText, getMenuText } from "~/configs/languageText";
import PrelineScript from "~/components/PrelineScript";

const inter = Inter({ subsets: ['latin'] });

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  // Enable static rendering
  unstable_setRequestLocale(locale);

  const commonText = await getCommonText();
  const authText = await getAuthText();
  const menuText = await getMenuText();

  return (
    <html lang="en" dir={locale == 'ar' ? 'rtl' : 'ltr'}>
      <body suppressHydrationWarning={true} className={clsx(inter.className, 'flex flex-col background-div')}>
        <CommonProvider commonText={commonText} authText={authText} menuText={menuText}>
          {children}
        </CommonProvider>
      </body>
      <PrelineScript />
    </html>
  );
}
