'use client';

import type { ReactNode } from 'react';
import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getFileIscc } from '~/api/requests';
import { UploadDragAndDrop } from '~/components/organisms';
import { ToastContext } from '~/components/providers/ToastProvider';
import { useTranslation } from '~/shared/utils/i18n/client';
import { ROUTES } from '~/shared/constants';

const ISCC_PREFIX = 'ISCC:';

/** Search bar shared by the explorer landing page and its result pages. */
export default function ExplorerLayout({ children }: Readonly<{ children: ReactNode }>) {
  const router = useRouter();
  const { t } = useTranslation();
  const { scheduleToast } = useContext(ToastContext);
  const [isResolvingFile, setIsResolvingFile] = useState(false);

  const handleSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    router.push(`${ROUTES.EXPLORER}/${encodeURIComponent(stripIsccPrefix(trimmed))}`);
  };

  const handleClearSearch = () => router.push(ROUTES.EXPLORER);

  /**
   * Resolves a dropped file to its ISCC and searches for it.
   *
   * The file is sent to the ISCC service for fingerprinting only — it is never
   * stored, by that service or by this application.
   */
  const handleFileChange = async (files: FileList) => {
    const file = files[0];
    if (!file) return;

    setIsResolvingFile(true);

    try {
      const { data } = await getFileIscc(file, file.name);
      router.push(`${ROUTES.EXPLORER}/${encodeURIComponent(stripIsccPrefix(data.iscc))}`);
    } catch (error) {
      console.error('Failed to derive an ISCC for the uploaded file:', error);
      scheduleToast(t('error.uploadFailed'));
    } finally {
      setIsResolvingFile(false);
    }
  };

  return (
    <div className="flex size-full min-w-minWidthEntryList flex-col">
      <div className="flex flex-row gap-4">
        <UploadDragAndDrop
          loading={isResolvingFile}
          onFileChange={handleFileChange}
          onClearSearch={handleClearSearch}
          onSearch={handleSearch}
        />
      </div>
      <div className="mt-4 flex grow flex-row">{children}</div>
    </div>
  );
}

function stripIsccPrefix(value: string): string {
  return value.startsWith(ISCC_PREFIX) ? value.slice(ISCC_PREFIX.length) : value;
}
