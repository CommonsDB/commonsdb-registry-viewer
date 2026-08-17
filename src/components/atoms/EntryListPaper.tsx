import { type CSSProperties, type FC, type ReactNode } from 'react';
import clsx from 'clsx';

export const EntryListPaper: FC<{
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}> = ({ children, className, style }) => {
  const defaultClassName = 'w-full rounded-2xl p-entryListPaperPadding overflow-y-auto';
  return (
    <div className={clsx(defaultClassName, className)} style={style}>
      {children}
    </div>
  );
};
