import { Text, YStack } from 'tamagui';

import { useTheme } from '@/contexts/ThemeContext';

import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ExploreScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: '#ECFDF5',
        dark: '#064E3B',
      }}
      headerImage={
        <IconSymbol
          size={310}
          color={isDark ? '#6EE7B7' : '#10B981'}
          name="magnifyingglass"
          style={{
            color: '#808080',
            bottom: -90,
            left: -35,
            position: 'absolute',
          }}
        />
      }
    >
      <YStack flexDirection="row" gap="$2" marginBottom="$4">
        <Text fontSize="$9" fontWeight="bold" color="$color">
          Discover New Words
        </Text>
      </YStack>

      <Text
        fontSize="$4"
        lineHeight={24}
        marginBottom="$6"
        opacity={0.8}
        color="$color"
      >
        Explore vocabulary through various learning methods and expand your
        language skills.
      </Text>

      <Collapsible title="📚 Text Analysis">
        <Text color="$color">
          Upload any text document and get intelligent analysis of vocabulary
          difficulty, word frequency, and personalized learning recommendations.
        </Text>
        <Text
          fontSize="$3"
          lineHeight={20}
          marginTop="$2"
          opacity={0.8}
          color="$color"
        >
          • Automatic difficulty assessment{'\n'}• Context-aware translations
          {'\n'}• Learning path suggestions
        </Text>
      </Collapsible>

      <Collapsible title="🎯 Smart Training">
        <Text color="$color">
          Engage with adaptive training sessions that adjust to your learning
          pace and focus on words that need more practice.
        </Text>
        <Text
          fontSize="$3"
          lineHeight={20}
          marginTop="$2"
          opacity={0.8}
          color="$color"
        >
          • Multiple question types{'\n'}• Spaced repetition system{'\n'}•
          Progress tracking
        </Text>
      </Collapsible>

      <Collapsible title="📊 Learning Analytics">
        <Text color="$color">
          Track your vocabulary progress with detailed statistics, review
          history, and insights into your learning patterns.
        </Text>
        <Text
          fontSize="$3"
          lineHeight={20}
          marginTop="$2"
          opacity={0.8}
          color="$color"
        >
          • Word mastery levels{'\n'}• Review scheduling{'\n'}• Performance
          metrics
        </Text>
      </Collapsible>

      <Collapsible title="🌍 Multi-language Support">
        <Text color="$color">
          Learn vocabulary in multiple languages with support for various text
          formats and learning contexts.
        </Text>
        <Text
          fontSize="$3"
          lineHeight={20}
          marginTop="$2"
          opacity={0.8}
          color="$color"
        >
          • Multiple language pairs{'\n'}• Cultural context{'\n'}• Pronunciation
          guides
        </Text>
      </Collapsible>

      <Collapsible title="💡 Study Tips">
        <Text color="$color">
          Get personalized study recommendations based on your learning history
          and current vocabulary level.
        </Text>
        <Text
          fontSize="$3"
          lineHeight={20}
          marginTop="$2"
          opacity={0.8}
          color="$color"
        >
          • Optimal study times{'\n'}• Focus areas{'\n'}• Learning strategies
        </Text>
      </Collapsible>

      <YStack
        alignItems="center"
        marginTop="$8"
        paddingVertical="$6"
        paddingHorizontal="$4"
        backgroundColor="rgba(16, 185, 129, 0.1)"
        borderRadius="$4"
      >
        <Text
          fontSize="$6"
          fontWeight="600"
          textAlign="center"
          marginBottom="$2"
          color="$color"
        >
          Ready to start your vocabulary journey?
        </Text>
        <Text
          fontSize="$3"
          textAlign="center"
          opacity={0.7}
          lineHeight={20}
          color="$color"
        >
          Begin with text analysis or jump into training sessions to see
          immediate results.
        </Text>
      </YStack>
    </ParallaxScrollView>
  );
}
