import { type FC, type ReactNode } from 'react';
import clsx from 'clsx';

interface ITagProps {
  children: ReactNode;
  className?: string;
}

export const Tag: FC<ITagProps> = ({ children, className }) => {
  const defaultClassName =
    'bg-paper-50 mr-2 inline-block whitespace-nowrap rounded px-2.5 py-[3px] text-sm leading-4';
  return <span className={clsx(defaultClassName, className)}>{children}</span>;
};
