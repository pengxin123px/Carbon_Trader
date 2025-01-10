import { langCode, languages, languagesEn } from '~/config';
import { Fragment, useState } from 'react';

const HeadInfo = ({ locale, title, description, languageList = languages, isChatDetail = false, chatDetail = { language: '' } }) => {
  const [languageListResult] = useState(process.env.NEXT_PUBLIC_SHOW_LANGUAGE != '0' ? languageList : languagesEn);
  const page = '';

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {!isChatDetail &&
        languageListResult.map(item => {
          const currentPage = page;
          let hrefLang = item.code;

          if (item.lang == 'en') {
            if (currentPage) {
              const href = `${process.env.NEXT_PUBLIC_SITE_URL}/${currentPage}`;
              return (
                <Fragment key={href + 0}>
                  <link rel="alternate" hrefLang={'x-default'} href={href} />
                  <link rel="alternate" hrefLang={hrefLang} href={href} />
                </Fragment>
              );
            } else {
              const href = `${process.env.NEXT_PUBLIC_SITE_URL}/`;
              return (
                <Fragment key={href + 1}>
                  <link rel="alternate" hrefLang={'x-default'} href={href} />
                  <link rel="alternate" hrefLang={hrefLang} href={href} />
                </Fragment>
              );
            }
          } else {
            if (currentPage) {
              const href = `${process.env.NEXT_PUBLIC_SITE_URL}/${item.lang}/${currentPage}`;
              return <link key={href + 2} rel="alternate" hrefLang={hrefLang} href={href} />;
            } else {
              const href = `${process.env.NEXT_PUBLIC_SITE_URL}/${item.lang}`;
              return <link key={href + 3} rel="alternate" hrefLang={hrefLang} href={href} />;
            }
          }
        })}
      {!isChatDetail &&
        languageListResult.map(item => {
          const currentPage = page;
          let hrefLang = item.code;
          let href: string;
          if (currentPage) {
            href = `${process.env.NEXT_PUBLIC_SITE_URL}/${item.lang}/${currentPage}`;
            if (item.lang == 'en') {
              href = `${process.env.NEXT_PUBLIC_SITE_URL}/${currentPage}`;
            }
          } else {
            href = `${process.env.NEXT_PUBLIC_SITE_URL}/${item.lang}`;
            if (item.lang == 'en') {
              href = `${process.env.NEXT_PUBLIC_SITE_URL}/`;
            }
          }
          if (locale == item.lang) {
            return <link key={href + 'canonical'} rel="canonical" hrefLang={hrefLang} href={href} />;
          }
        })}
    </>
  );
};

export default HeadInfo;
