import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Animated, Easing, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { useCustomFonts } from './../config/fonts';

const { width, height } = Dimensions.get('window');

// Neon Text Animation
const NeonTextAnimation = () => {
  const progress = useRef(new Animated.Value(0)).current;
  const neonColor = '#00ffff';

  useEffect(() => {
    Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 10],
  });

  const opacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.5, 1, 0.5],
  });

  return (
    <Animated.View
      style={[
        styles.neonTextContainer,
        {
          transform: [{ translateY }],
          opacity,
          shadowColor: neonColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 10,
        },
      ]}
    >
      <Text style={styles.neonText}>Актёрский кастинг</Text>
    </Animated.View>
  );
};

// Floating Balls Animation
const FloatingBalls = () => {
  const balls = useRef(
    Array.from({ length: 10 }).map(() => ({
      startX: Math.random() * width,
      startY: Math.random() * height,
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      size: Math.random() * 20 + 10,
      opacity: new Animated.Value(Math.random() * 0.5 + 0.3),
    }))
  ).current;

  useEffect(() => {
    balls.forEach((ball) => {
      const animateBall = () => {
        const randomX = (Math.random() * width * 0.8) - (width * 0.4);
        const randomY = (Math.random() * height * 0.8) - (height * 0.4);
        Animated.parallel([
          Animated.timing(ball.translateX, {
            toValue: randomX,
            duration: Math.random() * 10000 + 10000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(ball.translateY, {
            toValue: randomY,
            duration: Math.random() * 10000 + 10000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]).start(() => animateBall());
      };
      animateBall();
    });
  }, []);

  return (
    <>
      {balls.map((ball, index) => (
        <Animated.View
          key={index}
          style={[
            styles.ball,
            {
              left: ball.startX,
              top: ball.startY,
              width: ball.size,
              height: ball.size,
              borderRadius: ball.size / 2,
              opacity: ball.opacity,
              backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#AAAAAA',
              transform: [
                { translateX: ball.translateX },
                { translateY: ball.translateY },
              ],
            },
          ]}
        />
      ))}
    </>
  );
};

// Cinematic Animation
const CinematicAnimation = () => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 1500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );

    spinAnimation.start();
    pulseAnimation.start();

    return () => {
      spinAnimation.stop();
      pulseAnimation.stop();
    };
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.cinematicContainer,
        {
          transform: [{ rotate: spin }, { scale: scaleValue }],
        },
      ]}
    >
      <View style={[styles.cinematicShape, { backgroundColor: '#00008b' }]} />
      <View style={[styles.cinematicShape, { backgroundColor: '#1E90FF' }]} />
      <View style={[styles.cinematicShape, { backgroundColor: '#00ffff' }]} />
    </Animated.View>
  );
};

export default function HomeScreen() {
  const [fontsLoaded] = useCustomFonts();
  const buttonScales = useRef(Array.from({ length: 4 }).map(() => new Animated.Value(1))).current;

  const animateButton = (index, scaleValue) => {
    Animated.spring(buttonScales[index], {
      toValue: scaleValue,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#800020" />;
  }

  return (
    <View style={styles.container}>
      <FloatingBalls />
      <NeonTextAnimation />
      {/* Cinematic Animation */}
      <CinematicAnimation />
      <Text style={styles.subtitle}>Найдите идеальных актёров для вашего проекта</Text>
      <View style={styles.buttonContainer}>
        <Link href="/auth" asChild>
          <TouchableOpacity
            style={styles.button}
            onPressIn={() => animateButton(0, 0.95)}
            onPressOut={() => animateButton(0, 1)}
          >
            <Animated.View style={{ transform: [{ scale: buttonScales[0] }] }}>
              <Text style={styles.buttonText}>Войти / Регистрация</Text>
            </Animated.View>
          </TouchableOpacity>
        </Link>
        <Link href="/casting" asChild>
          <TouchableOpacity
            style={styles.button}
            onPressIn={() => animateButton(1, 0.95)}
            onPressOut={() => animateButton(1, 1)}
          >
            <Animated.View style={{ transform: [{ scale: buttonScales[1] }] }}>
              <Text style={styles.buttonText}>Лента кастингов</Text>
            </Animated.View>
          </TouchableOpacity>
        </Link>
        <Link href="/profile" asChild>
          <TouchableOpacity
            style={styles.button}
            onPressIn={() => animateButton(2, 0.95)}
            onPressOut={() => animateButton(2, 1)}
          >
            <Animated.View style={{ transform: [{ scale: buttonScales[2] }] }}>
              <Text style={styles.buttonText}>Личный кабинет</Text>
            </Animated.View>
          </TouchableOpacity>
        </Link>
        <Link href="/filters" asChild>
          <TouchableOpacity
            style={styles.button}
            onPressIn={() => animateButton(3, 0.95)}
            onPressOut={() => animateButton(3, 1)}
          >
            <Animated.View style={{ transform: [{ scale: buttonScales[3] }] }}>
              <Text style={styles.buttonText}>Поиск актёров</Text>
            </Animated.View>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    overflow: 'hidden',
  },
  neonTextContainer: {
    marginBottom: 10,
    zIndex: 1,
  },
  neonText: {
    fontFamily: 'Oktyabrina-script',
    fontSize: 48,
    color: '#FFFFFF',
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontFamily: 'Arkhip-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 40,
    textAlign: 'center',
    zIndex: 1,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
    zIndex: 1,
  },
  button: {
    backgroundColor: '#00008b',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00ffff',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  buttonText: {
    fontFamily: 'Arkhip-Regular',
    color: '#FFFFFF',
    fontSize: 16,
  },
  ball: {
    position: 'absolute',
  },
  cinematicContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 1,
  },
  cinematicShape: {
    width: '80%',
    height: '80%',
    borderRadius: 50,
    position: 'absolute',
  },
});