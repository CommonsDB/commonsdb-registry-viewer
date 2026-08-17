import { Button, type ButtonProps } from 'flowbite-react';
import React, { type FC, type ReactNode } from 'react';
import clsx from 'clsx';
import type Link from 'next/link';

// typeof Link to comply with AsProp
interface IButtonWithIconProps extends ButtonProps<typeof Link | 'label' | 'button'> {
  children: ReactNode;
}

// icon is expected to be 24 by 24, that's why we use 15px padding
export const ButtonWithIcon: FC<IButtonWithIconProps> = (props) => {
  const { children, as, className, ...rest } = props;
  return (
    <Button {...rest} as={as} className={clsx(className)}>
      {children}
    </Button>
  );
};
