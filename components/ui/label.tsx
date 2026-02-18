import * as React from 'react';

import { View } from 'react-native';

import { cn } from '@/lib/utils';

import { Text } from './text';

interface LabelProps {
  className?: string;
  nativeID?: string;
  children?: React.ReactNode;
}

const Label = React.forwardRef<React.ComponentRef<typeof View>, LabelProps>(
  ({ className, children, nativeID, ...props }, ref) => {
    return (
      <View ref={ref} {...props}>
        <Text
          className={cn(
            'text-sm native:text-base font-medium leading-none text-foreground',
            className
          )}
          nativeID={nativeID}
        >
          {children}
        </Text>
      </View>
    );
  }
);
Label.displayName = 'Label';

export { Label };
