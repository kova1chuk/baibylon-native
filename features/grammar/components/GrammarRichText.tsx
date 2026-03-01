import React from 'react';

import { Text } from 'react-native';

interface Segment {
  type: 'text' | 'keyword' | 'grammar' | 'italic' | 'warning' | 'accent';
  value: string;
}

function tokenize(text: string): Segment[] {
  const segments: Segment[] = [];
  const regex =
    /(\*\*(.+?)\*\*|\{\{(.+?)\}\}|\*"(.+?)"\*|@@(.+?)@@|%%(.+?)%%)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        value: text.slice(lastIndex, match.index),
      });
    }

    if (match[2]) segments.push({ type: 'keyword', value: match[2] });
    else if (match[3]) segments.push({ type: 'grammar', value: match[3] });
    else if (match[4]) segments.push({ type: 'italic', value: match[4] });
    else if (match[5]) segments.push({ type: 'warning', value: match[5] });
    else if (match[6]) segments.push({ type: 'accent', value: match[6] });

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return segments;
}

function tokenizeBold(
  text: string
): { type: 'text' | 'bold'; value: string }[] {
  const segments: { type: 'text' | 'bold'; value: string }[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        value: text.slice(lastIndex, match.index),
      });
    }
    segments.push({ type: 'bold', value: match[1] });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return segments;
}

export function GrammarExplanation({ text }: { text: string }) {
  const segments = tokenize(text);

  return (
    <Text className="text-sm text-muted-foreground leading-6">
      {segments.map((seg, i) => {
        switch (seg.type) {
          case 'keyword':
            return (
              <Text key={i} className="text-sm font-medium text-foreground">
                {seg.value}
              </Text>
            );
          case 'grammar':
            return (
              <Text
                key={i}
                style={{ color: '#F59E0B' }}
                className="text-sm font-medium"
              >
                {seg.value}
              </Text>
            );
          case 'italic':
            return (
              <Text key={i} className="text-sm text-muted-foreground italic">
                {seg.value}
              </Text>
            );
          case 'warning':
            return (
              <Text
                key={i}
                style={{ color: '#EF4444' }}
                className="text-sm font-medium"
              >
                {seg.value}
              </Text>
            );
          case 'accent':
            return (
              <Text
                key={i}
                style={{ color: '#818CF8' }}
                className="text-sm font-medium"
              >
                {seg.value}
              </Text>
            );
          default:
            return <Text key={i}>{seg.value}</Text>;
        }
      })}
    </Text>
  );
}

export function GrammarSentence({ text }: { text: string }) {
  const segments = tokenizeBold(text);

  return (
    <Text>
      {segments.map((seg, i) =>
        seg.type === 'bold' ? (
          <Text key={i} className="font-bold">
            {seg.value}
          </Text>
        ) : (
          <Text key={i}>{seg.value}</Text>
        )
      )}
    </Text>
  );
}

export function GrammarTipText({ text }: { text: string }) {
  const segments = tokenize(text);

  return (
    <Text className="text-sm text-muted-foreground leading-6">
      {segments.map((seg, i) => {
        switch (seg.type) {
          case 'keyword':
            return (
              <Text key={i} className="text-sm font-semibold text-foreground">
                {seg.value}
              </Text>
            );
          case 'grammar':
            return (
              <Text
                key={i}
                style={{ color: '#F59E0B' }}
                className="text-sm font-medium"
              >
                {seg.value}
              </Text>
            );
          case 'warning':
            return (
              <Text
                key={i}
                style={{ color: '#EF4444' }}
                className="text-sm font-medium"
              >
                {seg.value}
              </Text>
            );
          default:
            return <Text key={i}>{seg.value}</Text>;
        }
      })}
    </Text>
  );
}
