import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';

const { height } = Dimensions.get('window');

interface Props {
  onFinish: () => void;
}

const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const dotsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Logo appears with spring bounce
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
      // Title fades in and slides up
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // Subtitle appears
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Progress bar fills to 100% + tagline + dots fade in
      Animated.parallel([
        Animated.timing(progressWidth, {
          toValue: 1,
          duration: 1500, // 1.5s to fill completely
          useNativeDriver: false,
        }),
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(dotsOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Fires exactly when progress bar hits 100%
      onFinish();
    });
  }, []);

  const progressBarWidth = progressWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d6e70" />
      <View style={styles.bgOverlay} />

      {/* Center: logo + title + tagline */}
      <View style={styles.centerContent}>
        <Animated.View
          style={[
            styles.logoCard,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
        >
          <Image
            source={require('../../assets/images/findora logo .jpeg')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.Text
          style={[
            styles.appName,
            { opacity: titleOpacity, transform: [{ translateY: titleTranslateY }] },
          ]}
        >
          Findora
        </Animated.Text>

        <Animated.Text style={[styles.tagline, { opacity: subtitleOpacity }]}>
          SMART LOST & FOUND APP
        </Animated.Text>
      </View>

      {/* Bottom: progress bar + description + dots */}
      <View style={styles.bottomSection}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressBarWidth }]} />
        </View>

        <Animated.Text style={[styles.description, { opacity: taglineOpacity }]}>
          Connecting belongings with their owners
        </Animated.Text>

        <Animated.View style={[styles.dotsRow, { opacity: dotsOpacity }]}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d7377',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: height * 0.12,
    paddingBottom: height * 0.06,
  },
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  centerContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logoCard: {
    width: 100,
    height: 100,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  logoImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  appName: {
    fontSize: 36,
    fontWeight: '300',
    color: '#ffffff',
    letterSpacing: 1,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 3.5,
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 20,
  },
  progressTrack: {
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  description: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: {
    backgroundColor: '#ffffff',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default SplashScreen;