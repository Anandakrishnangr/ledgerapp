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
  const [errorTitle, setErrorTitle] = useState('Unable to Load Page');

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

  const getErrorMessage = (error: string): { title: string; message: string } => {
    const errorLower = error.toLowerCase();
    
    if (errorLower.includes('net::err_name_not_resolved') || errorLower.includes('name not resolved')) {
      return {
        title: 'Connection Error',
        message: 'Unable to reach the server. Please check your internet connection and try again.',
      };
    }
    
    if (errorLower.includes('net::err_internet_disconnected') || errorLower.includes('internet')) {
      return {
        title: 'No Internet Connection',
        message: 'Please check your internet connection and try again.',
      };
    }
    
    if (errorLower.includes('timeout') || errorLower.includes('timed out')) {
      return {
        title: 'Connection Timeout',
        message: 'The request took too long. Please check your connection and try again.',
      };
    }
    
    if (errorLower.includes('ssl') || errorLower.includes('certificate')) {
      return {
        title: 'Security Error',
        message: 'There was a problem with the secure connection. Please try again.',
      };
    }
    
    if (errorLower.includes('domain') || errorLower.includes('undefined')) {
      return {
        title: 'Unable to Load Page',
        message: 'The page could not be loaded. Please check your connection and try again.',
      };
    }
    
    // Default error
    return {
      title: 'Unable to Load Page',
      message: 'Something went wrong while loading the page. Please check your internet connection and try again.',
    };
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    setIsLoading(false);
    setHasError(true);
    const errorInfo = getErrorMessage(nativeEvent.description || nativeEvent.message || '');
    setErrorMessage(errorInfo.message);
    setErrorTitle(errorInfo.title);
  };

  const handleRetry = () => {
    setHasError(false);
    setErrorMessage('');
    setErrorTitle('Unable to Load Page');
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
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              setIsLoading(false);
              setHasError(true);
              const errorInfo = getErrorMessage(`HTTP ${nativeEvent.statusCode}: ${nativeEvent.description || ''}`);
              setErrorMessage(errorInfo.message);
              setErrorTitle(errorInfo.title);
            }}
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
              <View style={styles.errorIconContainer}>
                <View style={styles.errorIconCircle}>
                  <Text style={styles.errorIconText}>⚠</Text>
                </View>
              </View>
              <Text style={styles.errorTitle}>{errorTitle}</Text>
              <Text style={styles.errorDescription}>{errorMessage}</Text>
              <TouchableOpacity 
                style={styles.reloadButton} 
                onPress={handleRetry}
                activeOpacity={0.8}
              >
                <Text style={styles.reloadButtonText}>Reload Page</Text>
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
    padding: 32,
  },
  errorIconContainer: {
    marginBottom: 24,
  },
  errorIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFB74D',
  },
  errorIconText: {
    fontSize: 40,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorDescription: {
    fontSize: 15,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
    lineHeight: 22,
  },
  reloadButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 8,
    minWidth: 160,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reloadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

