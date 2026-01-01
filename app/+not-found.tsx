import { Link, Stack } from 'expo-router';
import { View, Text } from 'tamagui';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View
        flex={1}
        alignItems="center"
        justifyContent="center"
        padding="$5"
      >
        <Text fontSize="$9" fontWeight="bold" color="$color">
          This screen does not exist.
        </Text>
        <Link href="/" style={{ marginTop: 15, paddingVertical: 15 }}>
          <Text fontSize="$5" color="$blue10" textDecorationLine="underline">
            Go to home screen!
          </Text>
        </Link>
      </View>
    </>
  );
}
