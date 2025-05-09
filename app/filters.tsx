import { StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { useCustomFonts } from './config/fonts';

export default function FiltersScreen() {
  const [fontsLoaded] = useCustomFonts();

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#00ffff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Поиск актёров</Text>
      
      <View style={styles.filterGroup}>
        <Text style={styles.filterLabel}>Город</Text>
        <TextInput
          style={styles.input}
          placeholder="Выберите город"
          placeholderTextColor="#999"
        />
      </View>
      
      <View style={styles.filterGroup}>
        <Text style={styles.filterLabel}>Возраст</Text>
        <View style={styles.rangeContainer}>
          <TextInput
            style={[styles.input, styles.rangeInput]}
            placeholder="От"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.rangeInput]}
            placeholder="До"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>
      </View>
      
      <View style={styles.filterGroup}>
        <Text style={styles.filterLabel}>Пол</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity style={styles.radioButton}>
            <Text style={styles.radioText}>Мужской</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.radioButton}>
            <Text style={styles.radioText}>Женский</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.radioButton}>
            <Text style={styles.radioText}>Не важно</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity style={styles.searchButton}>
        <Text style={styles.searchButtonText}>Найти</Text>
      </TouchableOpacity>
      
      <Link href="/" asChild>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>На главную</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
  filterGroup: {
    marginBottom: 20,
  },
  filterLabel: {
    fontFamily: 'Arkhip-Regular',
    fontSize: 16,
    color: '#00ffff',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#00ffff',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    color: '#FFFFFF',
    fontFamily: 'Arkhip-Regular',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  rangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeInput: {
    width: '48%',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  radioButton: {
    borderWidth: 1,
    borderColor: '#00ffff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  radioText: {
    fontFamily: 'Arkhip-Regular',
    color: '#FFFFFF',
  },
  searchButton: {
    backgroundColor: '#00008b',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#00ffff',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  searchButtonText: {
    fontFamily: 'Arkhip-Regular',
    color: '#FFFFFF',
    fontSize: 16,
  },
  backButton: {
    marginTop: 30,
    alignSelf: 'center',
  },
  backButtonText: {
    fontFamily: 'Arkhip-Regular',
    color: '#00ffff',
    fontSize: 16,
  },
});