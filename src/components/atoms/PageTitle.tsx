import { type FC, type ReactNode } from 'react';

import { PAGE_TITLE_HEIGHT } from '~/shared/constants';

export const PageTitle: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <p
      className="pb-2 text-[32px] font-bold leading-[44px] text-aside-page-title"
      style={{ height: PAGE_TITLE_HEIGHT + 'px' }}
    >
      {children}
    </p>
  );
};
