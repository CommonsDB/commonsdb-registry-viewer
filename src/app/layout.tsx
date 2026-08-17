import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import clsx from 'clsx';
import { Flowbite } from 'flowbite-react';

import { flowbiteTheme } from '~/components/flowbite.theme';
import { LocaleProvider, ReactQueryClientProvider, ToastProvider } from '~/components/providers';
import { site } from '~/config/site';
import { getLocale } from '~/shared/utils/i18n/server';

import './global.css';

const openSans = Open_Sans({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
  icons: { icon: '/cdb.png' },
  openGraph: {
    title: site.name,
    description: site.description,
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = getLocale();

  return (
    <html lang={locale} className="h-full">
      <body className={clsx(openSans.className, 'h-full text-base text-paper-950')}>
        <LocaleProvider value={locale}>
          <ReactQueryClientProvider>
            <Flowbite theme={{ theme: flowbiteTheme }}>
              <ToastProvider>{children}</ToastProvider>
            </Flowbite>
          </ReactQueryClientProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
