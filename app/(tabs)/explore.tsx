import { View, Text } from 'react-native';

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
      <View className="flex-row gap-2 mb-4">
        <Text className="text-3xl font-bold text-foreground">
          Discover New Words
        </Text>
      </View>

      <Text className="text-base leading-6 mb-6 opacity-80 text-foreground">
        Explore vocabulary through various learning methods and expand your
        language skills.
      </Text>

      <Collapsible title="📚 Text Analysis">
        <Text className="text-foreground">
          Upload any text document and get intelligent analysis of vocabulary
          difficulty, word frequency, and personalized learning recommendations.
        </Text>
        <Text className="text-sm leading-5 mt-2 opacity-80 text-foreground">
          {
            '• Automatic difficulty assessment\n• Context-aware translations\n• Learning path suggestions'
          }
        </Text>
      </Collapsible>

      <Collapsible title="🎯 Smart Training">
        <Text className="text-foreground">
          Engage with adaptive training sessions that adjust to your learning
          pace and focus on words that need more practice.
        </Text>
        <Text className="text-sm leading-5 mt-2 opacity-80 text-foreground">
          {
            '• Multiple question types\n• Spaced repetition system\n• Progress tracking'
          }
        </Text>
      </Collapsible>

      <Collapsible title="📊 Learning Analytics">
        <Text className="text-foreground">
          Track your vocabulary progress with detailed statistics, review
          history, and insights into your learning patterns.
        </Text>
        <Text className="text-sm leading-5 mt-2 opacity-80 text-foreground">
          {'• Word mastery levels\n• Review scheduling\n• Performance metrics'}
        </Text>
      </Collapsible>

      <Collapsible title="🌍 Multi-language Support">
        <Text className="text-foreground">
          Learn vocabulary in multiple languages with support for various text
          formats and learning contexts.
        </Text>
        <Text className="text-sm leading-5 mt-2 opacity-80 text-foreground">
          {
            '• Multiple language pairs\n• Cultural context\n• Pronunciation guides'
          }
        </Text>
      </Collapsible>

      <Collapsible title="💡 Study Tips">
        <Text className="text-foreground">
          Get personalized study recommendations based on your learning history
          and current vocabulary level.
        </Text>
        <Text className="text-sm leading-5 mt-2 opacity-80 text-foreground">
          {'• Optimal study times\n• Focus areas\n• Learning strategies'}
        </Text>
      </Collapsible>

      <View className="items-center mt-8 py-6 px-4 bg-primary/10 rounded-2xl">
        <Text className="text-xl font-semibold text-center mb-2 text-foreground">
          Ready to start your vocabulary journey?
        </Text>
        <Text className="text-sm text-center opacity-70 leading-5 text-foreground">
          Begin with text analysis or jump into training sessions to see
          immediate results.
        </Text>
      </View>
    </ParallaxScrollView>
  );
}
