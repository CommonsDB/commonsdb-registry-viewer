import type { ReactNode } from 'react';

import { Header, Sidebar } from '~/components/organisms';
import { SIDEBAR_WIDTH } from '~/shared/constants';

/** Application shell: fixed sidebar, sticky header, scrolling content area. */
export default function AppLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex h-screen w-full bg-paper-500">
      <Sidebar />
      <div
        className="flex h-full grow flex-col border-l border-paper-200 pb-mainContentPadding"
        style={{ width: `calc(100% - ${SIDEBAR_WIDTH}px)` }}
      >
        <Header />
        <div className="w-full grow overflow-y-auto px-8 pt-mainContentPadding">{children}</div>
      </div>
    </div>
  );
}
