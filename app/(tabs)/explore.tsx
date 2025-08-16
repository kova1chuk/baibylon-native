import { StyleSheet, View } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: '#EFF6FF',
        dark: '#1E3A8A',
      }}
      headerImage={
        <IconSymbol
          size={310}
          color={isDark ? '#60A5FA' : '#3B82F6'}
          name="magnifyingglass"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Discover New Words</ThemedText>
      </ThemedView>

      <ThemedText style={styles.subtitle}>
        Explore vocabulary through various learning methods and expand your
        language skills.
      </ThemedText>

      <Collapsible title="📚 Text Analysis">
        <ThemedText>
          Upload any text document and get intelligent analysis of vocabulary
          difficulty, word frequency, and personalized learning recommendations.
        </ThemedText>
        <ThemedText style={styles.featureDetail}>
          • Automatic difficulty assessment{'\n'}• Context-aware translations
          {'\n'}• Learning path suggestions
        </ThemedText>
      </Collapsible>

      <Collapsible title="🎯 Smart Training">
        <ThemedText>
          Engage with adaptive training sessions that adjust to your learning
          pace and focus on words that need more practice.
        </ThemedText>
        <ThemedText style={styles.featureDetail}>
          • Multiple question types{'\n'}• Spaced repetition system{'\n'}•
          Progress tracking
        </ThemedText>
      </Collapsible>

      <Collapsible title="📊 Learning Analytics">
        <ThemedText>
          Track your vocabulary progress with detailed statistics, review
          history, and insights into your learning patterns.
        </ThemedText>
        <ThemedText style={styles.featureDetail}>
          • Word mastery levels{'\n'}• Review scheduling{'\n'}• Performance
          metrics
        </ThemedText>
      </Collapsible>

      <Collapsible title="🌍 Multi-language Support">
        <ThemedText>
          Learn vocabulary in multiple languages with support for various text
          formats and learning contexts.
        </ThemedText>
        <ThemedText style={styles.featureDetail}>
          • Multiple language pairs{'\n'}• Cultural context{'\n'}• Pronunciation
          guides
        </ThemedText>
      </Collapsible>

      <Collapsible title="💡 Study Tips">
        <ThemedText>
          Get personalized study recommendations based on your learning history
          and current vocabulary level.
        </ThemedText>
        <ThemedText style={styles.featureDetail}>
          • Optimal study times{'\n'}• Focus areas{'\n'}• Learning strategies
        </ThemedText>
      </Collapsible>

      <View style={styles.ctaContainer}>
        <ThemedText style={styles.ctaText}>
          Ready to start your vocabulary journey?
        </ThemedText>
        <ThemedText style={styles.ctaSubtext}>
          Begin with text analysis or jump into training sessions to see
          immediate results.
        </ThemedText>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    opacity: 0.8,
  },
  featureDetail: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    opacity: 0.8,
  },
  ctaContainer: {
    alignItems: 'center',
    marginTop: 32,
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 16,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  ctaSubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
  },
});
