'use client';

import Link from 'next/link';
import { FiHome } from 'react-icons/fi';

import { HOME_ROUTE } from '~/shared/constants';
import { useTranslation } from '~/shared/utils/i18n/client';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper-50 px-4 text-center">
      <div className="max-w-md">
        <h1 className="mb-4 text-6xl font-bold text-raspberry-500">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-paper-800">{t('notFound.title')}</h2>
        <p className="mb-8 text-paper-700">{t('notFound.description')}</p>
        <Link
          href={HOME_ROUTE}
          className="inline-flex items-center gap-2 rounded-lg bg-raspberry-500 px-6 py-3 text-white transition-colors hover:bg-raspberry-600 focus:outline-none focus:ring-2 focus:ring-raspberry-500 focus:ring-offset-2"
        >
          <FiHome className="size-5" />
          {t('notFound.home')}
        </Link>
      </div>
    </div>
  );
}
