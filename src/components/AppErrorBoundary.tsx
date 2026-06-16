import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors } from '../constants/theme';

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

export class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  private handleRetry = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            backgroundColor: colors.background,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 8 }}>
            Something went wrong
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: colors.textMuted,
              textAlign: 'center',
              marginBottom: 24,
            }}
          >
            Kick&apos;n Kicks hit an unexpected error. Please try again.
          </Text>
          <Pressable
            onPress={this.handleRetry}
            style={{
              backgroundColor: colors.brand,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}
