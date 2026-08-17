import type { FC } from 'react';
import clsx from 'clsx';

interface DividerProps {
  className?: string;
}

export const Divider: FC<DividerProps> = ({ className }) => (
  <div className={clsx('w-full border-t border-aside-divider', className)} />
);
