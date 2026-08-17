'use client';
import React, { type FC } from 'react';
import { type FlowbiteSidebarTheme, Sidebar as FlowbiteSidebar } from 'flowbite-react';
import { type PartialDeep } from 'type-fest';
import { usePathname } from 'next/navigation';
import { SidebarHeader, SidebarApiCard, SidebarFooter } from '~/components/molecules';

export const Sidebar: FC = () => {
  const pathName = usePathname();

  return (
    <FlowbiteSidebar theme={customFlowbiteSidebarTheme}>
      <div className="flex size-full flex-col justify-between gap-6">
        <SidebarHeader pathName={pathName} />
        <SidebarApiCard />
        <SidebarFooter />
      </div>
    </FlowbiteSidebar>
  );
};

const customFlowbiteSidebarTheme: PartialDeep<FlowbiteSidebarTheme> = {
  root: {
    base: 'h-full',
    collapsed: {
      off: `w-sidebarWidth`,
    },
    inner: `w-sidebarWidth h-full overflow-y-auto overflow-x-hidden px-4 py-4 bg-aside-primary`,
  },
};
