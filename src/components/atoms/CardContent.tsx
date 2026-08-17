import clsx from 'clsx';
import { type FC, type ReactNode } from 'react';

export const CardContent: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <p className={clsx('text-[14px] leading-[21px]', className)}>{children}</p>;
};
