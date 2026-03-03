import * as React from "react";

import { Image } from "expo-image";

import { View, Text } from "react-native";

import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  fallback: string;
  size?: number;
  className?: string;
}

function Avatar({ src, fallback, size = 40, className }: AvatarProps) {
  const [hasError, setHasError] = React.useState(false);

  return (
    <View
      className={cn("items-center justify-center rounded-full bg-muted overflow-hidden", className)}
      style={{ width: size, height: size }}
    >
      {src && !hasError ? (
        <Image
          source={{ uri: src }}
          style={{ width: size, height: size }}
          onError={() => setHasError(true)}
        />
      ) : (
        <Text className="font-semibold text-muted-foreground" style={{ fontSize: size * 0.4 }}>
          {fallback}
        </Text>
      )}
    </View>
  );
}

export { Avatar };
