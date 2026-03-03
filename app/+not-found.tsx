import { Link, Stack } from "expo-router";

import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center p-5">
        <Text className="text-3xl font-bold text-foreground">This screen does not exist.</Text>
        <Link href="/" style={{ marginTop: 15, paddingVertical: 15 }}>
          <Text className="text-lg text-primary underline">Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
