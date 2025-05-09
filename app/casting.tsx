import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Modal, TextInput, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useCustomFonts } from './config/fonts';
import { AntDesign, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CastingItem = {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
  category: string;
};

export default function CastingScreen() {
  const [fontsLoaded] = useCustomFonts();
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    category: '',
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);

  const castingData: CastingItem[] = [
    {
      id: '1',
      title: 'Главная роль в фильме "Рассвет"',
      location: 'Москва',
      date: '15.04.2025',
      description: 'Ищем актёра на главную роль в новом драматическом фильме.',
      category: 'Кино',
    },
    {
      id: '2',
      title: 'Реклама парфюма',
      location: 'Санкт-Петербург',
      date: '20.04.2025',
      description: 'Кастинг моделей для рекламной кампании нового парфюма.',
      category: 'Реклама',
    },
    {
      id: '3',
      title: 'Театральная постановка "Гамлет"',
      location: 'Москва',
      date: '25.04.2025',
      description: 'Кастинг актёров на основные роли в классической постановке.',
      category: 'Театр',
    },
  ];

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const savedFavorites = await AsyncStorage.getItem('userFavorites');
        if (savedFavorites) {
          const parsedFavorites = JSON.parse(savedFavorites);
          const favoriteIds = parsedFavorites.map((item: CastingItem) => item.id);
          setFavorites(favoriteIds);
        }
      } catch (error) {
        console.error('Ошибка загрузки избранного:', error);
      }
    };
    
    loadFavorites();
  }, []);

  const toggleFavorite = async (id: string) => {
    try {
      let newFavorites: string[];
      let updatedFavoritesList: CastingItem[];
      
      if (favorites.includes(id)) {
        newFavorites = favorites.filter(item => item !== id);
        updatedFavoritesList = (await AsyncStorage.getItem('userFavorites'))
          ? JSON.parse(await AsyncStorage.getItem('userFavorites') || '[]')
          : [];
        updatedFavoritesList = updatedFavoritesList.filter(item => item.id !== id);
      } else {
        newFavorites = [...favorites, id];
        const castingToAdd = castingData.find(item => item.id === id);
        if (castingToAdd) {
          updatedFavoritesList = (await AsyncStorage.getItem('userFavorites'))
            ? JSON.parse(await AsyncStorage.getItem('userFavorites') || '[]')
            : [];
          updatedFavoritesList.push(castingToAdd);
        }
      }
      
      setFavorites(newFavorites);
      await AsyncStorage.setItem('userFavorites', JSON.stringify(updatedFavoritesList));
    } catch (error) {
      console.error('Ошибка сохранения избранного:', error);
    }
  };

  const respondToCasting = (id: string) => {
    if (responses.includes(id)) {
      Alert.alert('Вы уже откликнулись на этот кастинг');
      return;
    }
    setResponses([...responses, id]);
    Alert.alert('Успешно!', 'Ваш отклик отправлен организаторам кастинга');
  };

  const filteredCastings = castingData.filter(casting => {
    return (
      (filters.location === '' || casting.location.includes(filters.location)) &&
      (filters.category === '' || casting.category.includes(filters.category))
    );
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#00ffff" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Лента кастингов</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
        >
          <Text style={styles.filterButtonText}>Фильтры</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        {filteredCastings.map(casting => (
          <View key={casting.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{casting.title}</Text>
              <TouchableOpacity onPress={() => toggleFavorite(casting.id)}>
                <AntDesign 
                  name={favorites.includes(casting.id) ? "heart" : "hearto"} 
                  size={24} 
                  color={favorites.includes(casting.id) ? "#FF0000" : "#00ffff"} 
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.cardText}>{casting.location} • {casting.date}</Text>
            <Text style={styles.cardCategory}>{casting.category}</Text>
            <Text style={styles.cardDescription}>{casting.description}</Text>
            
            <TouchableOpacity 
              style={[
                styles.responseButton,
                responses.includes(casting.id) && styles.respondedButton
              ]}
              onPress={() => respondToCasting(casting.id)}
              disabled={responses.includes(casting.id)}
            >
              <Text style={styles.responseButtonText}>
                {responses.includes(casting.id) ? 'Отклик отправлен' : 'Откликнуться'}
              </Text>
              {responses.includes(casting.id) && (
                <Feather name="check" size={16} color="#FFFFFF" style={styles.responseIcon} />
              )}
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterVisible}
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Фильтры</Text>
            
            <View style={styles.filterInputContainer}>
              <Text style={styles.filterLabel}>Город:</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Введите город"
                placeholderTextColor="#999"
                value={filters.location}
                onChangeText={text => setFilters({...filters, location: text})}
              />
            </View>
            
            <View style={styles.filterInputContainer}>
              <Text style={styles.filterLabel}>Категория:</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Введите категорию"
                placeholderTextColor="#999"
                value={filters.category}
                onChangeText={text => setFilters({...filters, category: text})}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.applyButton]}
                onPress={() => setFilterVisible(false)}
              >
                <Text style={styles.modalButtonText}>Применить</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.resetButton]}
                onPress={() => {
                  setFilters({ location: '', category: '' });
                  setFilterVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Сбросить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Oktyabrina-script',
    fontSize: 28,
    color: '#00ffff',
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  filterButton: {
    backgroundColor: '#00008b',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00ffff',
  },
  filterButtonText: {
    fontFamily: 'Arkhip-Regular',
    color: '#FFFFFF',
    fontSize: 14,
  },
  scrollContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: 'rgba(0, 0, 139, 0.3)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#00ffff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: 'Oktyabrina-script',
    fontSize: 20,
    color: '#00ffff',
    marginBottom: 5,
    flex: 1,
  },
  cardText: {
    fontFamily: 'Arkhip-Regular',
    fontSize: 14,
    color: '#00ffff',
    marginBottom: 5,
  },
  cardCategory: {
    fontFamily: 'Arkhip-Regular',
    fontSize: 12,
    color: '#00ffff',
    marginBottom: 10,
    opacity: 0.7,
  },
  cardDescription: {
    fontFamily: 'Arkhip-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 18,
    marginBottom: 15,
  },
  responseButton: {
    backgroundColor: '#00008b',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00ffff',
  },
  respondedButton: {
    backgroundColor: '#006400',
  },
  responseButtonText: {
    fontFamily: 'Arkhip-Regular',
    color: '#FFFFFF',
    fontSize: 14,
  },
  responseIcon: {
    marginLeft: 8,
  },
  backButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  backButtonText: {
    fontFamily: 'Arkhip-Regular',
    color: '#00ffff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#00ffff',
  },
  modalTitle: {
    fontFamily: 'Oktyabrina-script',
    fontSize: 24,
    color: '#00ffff',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  filterInputContainer: {
    marginBottom: 15,
  },
  filterLabel: {
    fontFamily: 'Arkhip-Regular',
    fontSize: 16,
    color: '#00ffff',
    marginBottom: 5,
  },
  filterInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    fontFamily: 'Arkhip-Regular',
    borderWidth: 1,
    borderColor: '#00ffff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00ffff',
  },
  applyButton: {
    backgroundColor: '#00008b',
    marginRight: 10,
  },
  resetButton: {
    backgroundColor: '#8B0000',
  },
  modalButtonText: {
    fontFamily: 'Arkhip-Regular',
    fontSize: 16,
    color: '#FFFFFF',
  },
});