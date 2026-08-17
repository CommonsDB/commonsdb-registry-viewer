import { type FC, type ReactNode } from 'react';
import clsx from 'clsx';

export const LandingContainer: FC<{ className?: string; children: ReactNode }> = ({
  children,
  className,
}) => {
  return (
    <div className={clsx('w-full', className)}>
      <div className="m-auto w-full max-w-[1440px] px-[30px]">{children}</div>
    </div>
  );
};
