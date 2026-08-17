import { type FC, type ReactNode } from 'react';

export const SectionTitle: FC<{ children: ReactNode }> = ({ children }) => {
  return <p className="text-[24px] font-bold">{children}</p>;
};
