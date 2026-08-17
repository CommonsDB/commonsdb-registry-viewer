import type { FC, ReactNode } from 'react';
import Link from 'next/link';

import { CardContent, CardTitle, EntryListPaper } from '../atoms';

interface ICardProps {
  label?: string;
  content?: string | ReactNode;
  link?: string;
  linkLabel?: string;
  backgroundColor?: string;
  additionalContent?: string | ReactNode;
  positionClass?: string;
  mainTextColor?: string;
  borderColor?: string;
  linkColor?: string;
  titleClass?: string;
}

export const Card: FC<ICardProps> = ({
  label,
  content,
  link,
  linkLabel,
  additionalContent,
  backgroundColor,
  positionClass = 'items-start',
  mainTextColor,
  borderColor,
  linkColor,
  titleClass,
}) => (
  <EntryListPaper
    className={`!p-cardPadding ${borderColor ? `border ${borderColor}` : ''} ${backgroundColor || 'bg-white'}`}
  >
    <div className={`flex flex-col gap-4 ${positionClass}`}>
      {label && <CardTitle className={titleClass}>{label}</CardTitle>}
      {additionalContent && (
        <EntryListPaper className="!w-auto rounded-md !bg-aside-card-content !px-2 !py-1 text-xs">
          {additionalContent}
        </EntryListPaper>
      )}
      {content && (
        <CardContent className={mainTextColor || 'text-paper-700'}>{content}</CardContent>
      )}
      {link && linkLabel && (
        <Link
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={`${linkColor || 'text-raspberry-500'} text-[14px] hover:text-raspberry-600`}
        >
          {linkLabel}
        </Link>
      )}
    </div>
  </EntryListPaper>
);
