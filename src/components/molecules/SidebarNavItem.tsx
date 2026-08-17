'use client';

import { type FC, type ReactNode } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { ButtonWithIcon } from '~/components/atoms';

export interface SidebarNavItemProps {
  /**
   * Icon component to be displayed
   */
  icon: ReactNode;
  /**
   * Text label for the navigation item
   */
  text: string;
  /**
   * Navigation path/route
   */
  path: string;
  /**
   * Whether the item is currently active
   */
  isActive: boolean;
  /**
   * Whether the link should open in a new tab
   */
  isExternal?: boolean;
}

export const SidebarNavItem: FC<SidebarNavItemProps> = ({
  icon,
  text,
  path,
  isActive,
  isExternal,
}) => {
  const activeStyles = clsx({
    'bg-aside-button-active text-white': isActive,
    'text-aside-text': !isActive,
    'hover:bg-aside-button-hover hover:text-aside-button-text-hover py-2': true,
  });

  return (
    <ButtonWithIcon
      as={Link}
      href={path}
      {...(isExternal
        ? {
            target: '_blank',
            rel: 'noopener noreferrer',
          }
        : {})}
      fullSized
      color="red"
      className={activeStyles}
    >
      {icon}
      {text}
    </ButtonWithIcon>
  );
};
