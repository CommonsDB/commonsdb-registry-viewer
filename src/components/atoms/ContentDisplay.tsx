import { type FC, useContext } from 'react';
import { IoCopyOutline } from 'react-icons/io5';

import { ToastContext } from '~/components/providers/ToastProvider';
import { isSafeExternalUrl } from '~/shared/utils/url';
import { useTranslation } from '~/shared/utils/i18n/client';

interface ContentDisplayProps {
  content: string;
  copyContent?: string;
  hasCopyOption?: boolean;
  isLink?: boolean;
  isFullWidth?: boolean;
  linkUrl?: string;
}

/**
 * A table/detail value with optional copy affordance and link behaviour.
 *
 * Link targets originate in registry data, so they are only rendered as links
 * when they are plain web URLs — anything else falls back to inert text.
 */
export const ContentDisplay: FC<ContentDisplayProps> = ({
  content,
  copyContent,
  hasCopyOption,
  isLink,
  isFullWidth,
  linkUrl,
}) => {
  const { scheduleToast } = useContext(ToastContext);
  const { t } = useTranslation();

  const handleCopy = async (text: string) => {
    const textToCopy = text.startsWith('ISCC:') ? text.replace('ISCC:', '') : text;

    await navigator.clipboard.writeText(textToCopy);
    scheduleToast(t('notification.copied'));
  };

  const href: string = linkUrl || content || '';
  const renderAsLink = isLink && (href.startsWith('/') || isSafeExternalUrl(href));
  const truncateClass = isFullWidth ? '' : 'block truncate text-left';

  return (
    <>
      {hasCopyOption && (
        <button
          type="button"
          aria-label={t('notification.copied')}
          onClick={() => handleCopy(copyContent || content || '')}
          className="shrink-0 rounded-full p-1 transition-colors hover:bg-gray-200"
        >
          <IoCopyOutline className="hover:text-raspberry-700 size-4 text-raspberry-500" />
        </button>
      )}
      <div className="min-w-0 flex-1 overflow-hidden" dir="ltr">
        {renderAsLink ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={content}
            className={`${truncateClass} text-raspberry-500 hover:text-raspberry-600 hover:underline`}
          >
            {content}
          </a>
        ) : (
          <span className={truncateClass} title={content}>
            {content}
          </span>
        )}
      </div>
    </>
  );
};
