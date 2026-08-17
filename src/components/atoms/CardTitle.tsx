import { type FC, type ReactNode } from 'react';

export const CardTitle: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <p className={`text-[16px] font-bold ${className}`}>{children}</p>;
};
