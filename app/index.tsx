import React, { useRef, useState } from 'react';
import { StyleSheet, View, Platform, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useSharedValue, runOnJS } from 'react-native-reanimated';
import { Image } from 'expo-image';

const WEBVIEW_URL = 'https://app.ledgerx.biz/';

export default function WebViewScreen() {
  const webViewRef = useRef<WebView>(null);
  const canGoBack = useSharedValue(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleNavigationStateChange = (navState: any) => {
    canGoBack.value = navState.canGoBack;
    if (!navState.loading) {
      setIsLoading(false);
      setHasError(false);
    }
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    setIsLoading(false);
    setHasError(true);
    setErrorMessage(nativeEvent.description || 'Failed to load page. Please check your internet connection.');
  };

  const handleRetry = () => {
    setHasError(false);
    setErrorMessage('');
    setIsLoading(true);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  const goBack = () => {
    if (webViewRef.current && canGoBack.value) {
      webViewRef.current.goBack();
    }
  };

  // Swipe back gesture (right to left)
  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onEnd((event) => {
      // If swiping from right edge to left (back gesture)
      if (event.translationX < -50 && Math.abs(event.translationY) < 100) {
        runOnJS(goBack)();
      }
    });

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={swipeGesture}>
        <View style={styles.container}>
          <WebView
            ref={webViewRef}
            source={{ uri: WEBVIEW_URL }}
            style={styles.webview}
            onNavigationStateChange={handleNavigationStateChange}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            onError={handleError}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsBackForwardNavigationGestures={Platform.OS === 'ios'}
            mixedContentMode="never"
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            // Android back button support
            onShouldStartLoadWithRequest={(request) => {
              return request.url.startsWith('https://app.ledgerx.biz');
            }}
          />
          {isLoading && !hasError && (
            <View style={styles.splashContainer}>
              <Image
                source={require('@/assets/images/splash-icon.png')}
                style={styles.splashIcon}
                contentFit="contain"
              />
              <ActivityIndicator
                size="small"
                color="#000000"
                style={styles.loadingIndicator}
              />
            </View>
          )}
          {hasError && (
            <View style={styles.errorContainer}>
              <Image
                source={require('@/assets/images/splash-icon.png')}
                style={styles.splashIcon}
                contentFit="contain"
              />
              <Text style={styles.errorText}>Unable to load page</Text>
              <Text style={styles.errorDescription}>{errorMessage}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webview: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  splashContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashIcon: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  loadingIndicator: {
    marginTop: 10,
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  errorDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

