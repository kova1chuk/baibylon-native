import * as React from 'react';

import { View } from 'react-native';

import { cn } from '@/lib/utils';

interface SeparatorProps extends React.ComponentPropsWithoutRef<typeof View> {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

const Separator = React.forwardRef<
  React.ComponentRef<typeof View>,
  SeparatorProps
>(({ className, orientation = 'horizontal', ...props }, ref) => (
  <View
    ref={ref}
    className={cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      className
    )}
    {...props}
  />
));
Separator.displayName = 'Separator';

export { Separator };
