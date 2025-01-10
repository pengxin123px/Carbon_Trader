'use client';
import HeadInfo from '~/components/HeadInfo';
import Header from '~/components/Header';
import Footer from '~/components/Footer';
import Markdown from 'react-markdown';
import { useEffect, useRef, useState } from 'react';
import { useCommonContext } from '~/context/common-context';

const PageComponent = ({ locale, termsOfServiceText }) => {
  const [pagePath] = useState(process.env.NEXT_PUBLIC_TERMS_OF_SERVICE_NAME);
  const { setShowLoadingModal } = useCommonContext();

  const useCustomEffect = effect => {
    const isInitialMount = useRef(true);
    useEffect(() => {
      if (process.env.NODE_ENV === 'production' || isInitialMount.current) {
        isInitialMount.current = false;
        effect();
      }
    }, [effect]);
  };

  useCustomEffect(() => {
    setShowLoadingModal(false);
    return () => {};
  });

  return (
    <>
      <HeadInfo locale={locale} page={pagePath} title={termsOfServiceText.title} description={termsOfServiceText.description} />
      <Header locale={locale} page={pagePath} />

      <div className="mt-6 my-auto">
        <main className="w-[95%] md:w-[65%] lg:w-[55%] 2xl:w-[45%] mx-auto h-full my-8">
          <div className="p-6 prose mx-auto text-gray-300 div-markdown-color">
            <Markdown>{termsOfServiceText.detailText}</Markdown>
          </div>
        </main>
      </div>

      <Footer locale={locale} page={pagePath} />
    </>
  );
};

export default PageComponent;
