import React, { Component } from 'react';

import { AlertTriangle, RefreshCw } from 'lucide-react-native';

import { View, Text, Pressable } from 'react-native';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View className="flex-1 items-center justify-center bg-background p-6">
          <AlertTriangle size={48} color="#EF4444" />
          <Text className="text-lg font-semibold text-foreground mt-4">
            Something went wrong
          </Text>
          <Text className="text-sm text-muted-foreground mt-2 text-center">
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <Pressable
            className="mt-6 flex-row items-center gap-2 bg-primary rounded-xl py-3 px-6 active:opacity-80"
            onPress={this.handleReset}
          >
            <RefreshCw size={16} color="#FFFFFF" />
            <Text className="text-white font-medium">Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}
