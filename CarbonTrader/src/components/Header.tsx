import { ConnectButton } from 'thirdweb/react';
import { client } from '~/app/client';
import Link from 'next/link';
import { languages } from '~/config';
import { getLinkHref } from '~/utils/buildLink';

export default function Header({ locale, languageList = languages }) {
  const wallets = [
    // inAppWallet(),
    // createWallet("io.metamask"),
    // createWallet("com.coinbase.wallet"),
    // createWallet("me.rainbow"),
  ];

  return (
    <header className="bg-bg sticky top-0 h-16 z-20 w-full border border-b-gray-100">
      <nav className="mx-auto max-w-7xl flex items-center justify-between lg:px-8" aria-label="Global">
        <div className="flex">
          <Link
            href={getLinkHref(locale, '')}
            className="-m-1.5 ltr:ml-0.5 rtl:mr-0.5 p-1.5 text-gray-700 text-center font-semibold hover:bg-blue-600 hover:text-white rounded-2xl px-4 py-1.4 mx-2 max-lg:hidden dark:text-gray-50 dark:hover:bg-gray-50 dark:hover:text-gray-900">
            CarbonTrader
          </Link>
        </div>

        <ul className="flex justify-center items-center lg:relative lg:text-center z-30">
          <li className="mr-4">
            <Link
              href={{ pathname: getLinkHref(locale, `profile`) }}
              className="text-gray-700 font-semibold tracking-wider hover:bg-blue-600 hover:text-white rounded-2xl px-5 py-2 dark:text-gray-50 dark:hover:bg-gray-50 dark:hover:text-gray-900">
              Company Profile
            </Link>
          </li>
          <li className="mr-4">
            <Link
              href={{ pathname: getLinkHref(locale, `market`) }}
              className="text-gray-700 font-semibold tracking-wider hover:bg-blue-600 hover:text-white rounded-2xl px-5 py-2 dark:text-gray-50 dark:hover:bg-gray-50 dark:hover:text-gray-900">
              Auction Market
            </Link>
          </li>
          <li className="mr-4">
            <Link
              href={{ pathname: getLinkHref(locale, `bid-tracker`) }}
              className="text-gray-700 font-semibold tracking-wider hover:bg-blue-600 hover:text-white rounded-2xl px-5 py-2 dark:text-gray-50 dark:hover:bg-gray-50 dark:hover:text-gray-900">
              Bid Tracker
            </Link>
          </li>
        </ul>

        <div className={'ltr:lg:ml-2 rtl:lg:mr-2 lg:text-left'}>
          <ConnectButton
            connectButton={{
              label: 'Sign in'
            }}
            theme={'light'}
            client={client}
            detailsButton={{
              displayBalanceToken:{}
            }}
            wallets={wallets}
          />
        </div>
      </nav>
    </header>
  );
}
