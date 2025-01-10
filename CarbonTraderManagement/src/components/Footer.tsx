import Link from 'next/link';
import { getLinkHref } from '~/utils/buildLink';
import { useCommonContext } from '~/context/common-context';

export default function Footer({ locale }) {
  const { setShowLoadingModal, commonText, menuText } = useCommonContext();

  return (
    <footer aria-labelledby="footer-heading" className={'bg-white border border-t-gray-100 mt-16'}>
      <div id="footer-heading" className="sr-only">
        Footer
      </div>
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="xl:grid xl:grid-cols-4 xl:gap-8">
          <div className="space-y-2 col-span-3 xl:col-span-3">
            <p className="flex justify-center mt-8 text-sm footer-desc-text">{commonText.footerDescText}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
