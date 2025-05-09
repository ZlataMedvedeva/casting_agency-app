import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { useCustomFonts } from './config/fonts';

export default function AuthScreen() {
  const [fontsLoaded] = useCustomFonts();

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#00ffff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Авторизация</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email или телефон"
        placeholderTextColor="#999"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        placeholderTextColor="#999"
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Войти</Text>
      </TouchableOpacity>
      
      <Link href="/" asChild>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>На главную</Text>
        </TouchableOpacity>
      </Link>
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
  },
  title: {
    fontFamily: 'Oktyabrina-script',
    fontSize: 48,
    color: '#00ffff',
    marginBottom: 30,
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#00ffff',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: '#FFFFFF',
    fontFamily: 'Arkhip-Regular',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  button: {
    backgroundColor: '#00008b',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
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
  secondaryButton: {
    marginTop: 20,
  },
  secondaryButtonText: {
    fontFamily: 'Arkhip-Regular',
    color: '#00ffff',
    fontSize: 14,
  },
});