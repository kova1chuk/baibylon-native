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
  errorInfo: React.ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View
          className="flex-1 items-center justify-center p-6"
          style={{ backgroundColor: '#FAF9F6' }}
        >
          <AlertTriangle size={48} color="#EF4444" />
          <Text className="text-lg font-semibold text-foreground mt-4">
            Something went wrong
          </Text>
          <Text className="text-sm text-muted-foreground mt-2 text-center">
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          {this.state.errorInfo?.componentStack && (
            <View className="mt-4 p-2 bg-gray-100 rounded max-h-[300px]">
              <Text className="text-[10px] text-gray-600 font-mono">
                {this.state.errorInfo.componentStack.slice(0, 1000)}
              </Text>
            </View>
          )}
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
