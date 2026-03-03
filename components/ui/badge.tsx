import * as React from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { View } from "react-native";

import { cn } from "@/lib/utils";

import { TextClassContext } from "./text";

const badgeVariants = cva("flex-row items-center rounded-full px-2.5 py-0.5", {
  variants: {
    variant: {
      default: "bg-primary",
      secondary: "bg-secondary",
      destructive: "bg-destructive",
      outline: "border border-border",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const badgeTextVariants = cva("text-xs font-semibold", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive-foreground",
      outline: "text-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type BadgeProps = React.ComponentPropsWithoutRef<typeof View> &
  VariantProps<typeof badgeVariants> & {
    className?: string;
  };

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <TextClassContext.Provider value={badgeTextVariants({ variant })}>
      <View className={cn(badgeVariants({ variant, className }))} {...props} />
    </TextClassContext.Provider>
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };
