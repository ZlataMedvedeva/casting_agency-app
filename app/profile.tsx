import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Modal, TextInput, Image } from 'react-native';
import { Link } from 'expo-router';
import { useCustomFonts } from './config/fonts';
import { AntDesign, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';

type CastingItem = {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
  category: string;
};

export default function ProfileScreen() {
  const [fontsLoaded] = useCustomFonts();
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [favorites, setFavorites] = useState<CastingItem[]>([]);
  
  const [profile, setProfile] = useState({
    name: 'Иван Иванов',
    city: 'Москва',
    age: '28',
    phone: '+7 (900) 123-45-67',
    email: 'ivan@example.com',
    experience: '5 лет в театре, 2 года в кино',
    skills: 'Драма, комедия, вокал',
    height: '180 см',
    weight: '75 кг',
    appearance: 'Светлые волосы, голубые глаза',
    avatar: null as string | null,
    portfolio: [] as Array<{type: 'photo' | 'video', uri: string}>
  });

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const savedFavorites = await AsyncStorage.getItem('userFavorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Ошибка загрузки избранного:', error);
      }
    };
    
    loadFavorites();
  }, []);

  const removeFromFavorites = async (id: string) => {
    const newFavorites = favorites.filter(item => item.id !== id);
    setFavorites(newFavorites);
    try {
      await AsyncStorage.setItem('userFavorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Ошибка сохранения избранного:', error);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Для загрузки медиа необходимо разрешение!');
      }
    })();
  }, []);

  const pickAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfile(prev => ({
        ...prev,
        avatar: result.assets[0].uri
      }));
    }
  };

  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: mediaType === 'photo' 
        ? ImagePicker.MediaTypeOptions.Images 
        : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newItem = {
        type: mediaType,
        uri: result.assets[0].uri
      };
      setProfile(prev => ({
        ...prev,
        portfolio: [...prev.portfolio, newItem]
      }));
    }
    setModalVisible(false);
  };

  const removeMedia = (index: number) => {
    setProfile(prev => {
      const newPortfolio = [...prev.portfolio];
      newPortfolio.splice(index, 1);
      return {...prev, portfolio: newPortfolio};
    });
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#00ffff" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Мой профиль</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? 'Сохранить' : 'Редактировать'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={isEditing ? pickAvatar : undefined}>
            {profile.avatar ? (
              <Image 
                source={{ uri: profile.avatar }} 
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Feather name="user" size={40} color="#00ffff" />
              </View>
            )}
          </TouchableOpacity>
          
          {isEditing ? (
            <TextInput
              style={styles.editName}
              value={profile.name}
              onChangeText={text => setProfile({...profile, name: text})}
            />
          ) : (
            <Text style={styles.profileName}>{profile.name}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Основная информация</Text>
          
          {[
            {label: 'Город', value: 'city'},
            {label: 'Возраст', value: 'age'},
            {label: 'Телефон', value: 'phone'},
            {label: 'Email', value: 'email'},
            {label: 'Рост', value: 'height'},
            {label: 'Вес', value: 'weight'},
          ].map((item) => (
            <View key={item.value} style={styles.infoItem}>
              <Text style={styles.infoLabel}>{item.label}:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={profile[item.value]}
                  onChangeText={text => setProfile({...profile, [item.value]: text})}
                />
              ) : (
                <Text style={styles.infoValue}>{profile[item.value]}</Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Профессиональная информация</Text>
          
          {[
            {label: 'Опыт работы', value: 'experience', multiline: true},
            {label: 'Навыки', value: 'skills', multiline: true},
            {label: 'Внешность', value: 'appearance', multiline: true},
          ].map((item) => (
            <View key={item.value} style={styles.infoItem}>
              <Text style={styles.infoLabel}>{item.label}:</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.editInput, item.multiline && {height: 80}]}
                  value={profile[item.value]}
                  onChangeText={text => setProfile({...profile, [item.value]: text})}
                  multiline={item.multiline}
                />
              ) : (
                <Text style={styles.infoValue}>{profile[item.value]}</Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Портфолио</Text>
          
          {isEditing && (
            <View style={styles.mediaButtons}>
              <TouchableOpacity 
                style={styles.mediaButton}
                onPress={() => {
                  setMediaType('photo');
                  setModalVisible(true);
                }}
              >
                <Text style={styles.mediaButtonText}>Добавить фото</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.mediaButton}
                onPress={() => {
                  setMediaType('video');
                  setModalVisible(true);
                }}
              >
                <Text style={styles.mediaButtonText}>Добавить видео</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.portfolioGrid}>
            {profile.portfolio.map((item, index) => (
              <View key={index} style={styles.portfolioItem}>
                {item.type === 'photo' ? (
                  <Image source={{uri: item.uri}} style={styles.portfolioImage} />
                ) : (
                  <Video
                    source={{uri: item.uri}}
                    style={styles.portfolioVideo}
                    useNativeControls
                    resizeMode="cover"
                  />
                )}
                {isEditing && (
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => removeMedia(index)}
                  >
                    <AntDesign name="close" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Избранные кастинги</Text>
          
          {favorites.length > 0 ? (
            favorites.map(casting => (
              <View key={casting.id} style={styles.favoriteCard}>
                <View style={styles.favoriteCardHeader}>
                  <Text style={styles.favoriteCardTitle}>{casting.title}</Text>
                  <TouchableOpacity onPress={() => removeFromFavorites(casting.id)}>
                    <AntDesign name="heart" size={20} color="#FF0000" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.favoriteCardText}>{casting.location} • {casting.date}</Text>
                <Text style={styles.favoriteCardCategory}>{casting.category}</Text>
                <Text style={styles.favoriteCardDescription}>{casting.description}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noFavoritesText}>У вас пока нет избранных кастингов</Text>
          )}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Выберите {mediaType === 'photo' ? 'фото' : 'видео'}
            </Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={pickMedia}
            >
              <Text style={styles.modalButtonText}>Из галереи</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Отмена</Text>
            </TouchableOpacity>
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
  editButton: {
    backgroundColor: '#00008b',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00ffff',
  },
  editButtonText: {
    fontFamily: 'Arkhip-Regular',
    color: '#FFFFFF',
    fontSize: 14,
  },
  scrollContainer: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#00ffff',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 0, 139, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00ffff',
  },
  profileName: {
    fontFamily: 'Oktyabrina-script',
    fontSize: 24,
    color: '#00ffff',
    marginTop: 10,
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  editName: {
    fontFamily: 'Oktyabrina-script',
    fontSize: 24,
    color: '#00ffff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#00ffff',
    textAlign: 'center',
    width: '100%',
  },
  section: {
    backgroundColor: 'rgba(0, 0, 139, 0.3)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#00ffff',
  },
  sectionTitle: {
    fontFamily: 'Oktyabrina-script',
    fontSize: 20,
    color: '#00ffff',
    marginBottom: 15,
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  infoLabel: {
    width: 100,
    fontSize: 14,
    color: '#00ffff',
    fontFamily: 'Arkhip-Regular',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Arkhip-Regular',
  },
  editInput: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Arkhip-Regular',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 5,
    minHeight: 40,
    borderWidth: 1,
    borderColor: '#00ffff',
  },
  mediaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  mediaButton: {
    flex: 1,
    backgroundColor: '#00008b',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#00ffff',
  },
  mediaButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Arkhip-Regular',
  },
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  portfolioItem: {
    width: '48%',
    height: 150,
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#00ffff',
  },
  portfolioImage: {
    width: '100%',
    height: '100%',
  },
  portfolioVideo: {
    width: '100%',
    height: '100%',
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(139, 0, 0, 0.7)',
    width: 25,
    height: 25,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteCard: {
    backgroundColor: 'rgba(0, 0, 139, 0.2)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#00ffff',
  },
  favoriteCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  favoriteCardTitle: {
    fontFamily: 'Oktyabrina-script',
    fontSize: 18,
    color: '#00ffff',
    flex: 1,
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  favoriteCardText: {
    fontFamily: 'Arkhip-Regular',
    fontSize: 14,
    color: '#00ffff',
    marginBottom: 5,
  },
  favoriteCardCategory: {
    fontFamily: 'Arkhip-Regular',
    fontSize: 12,
    color: '#00ffff',
    marginBottom: 10,
    opacity: 0.7,
  },
  favoriteCardDescription: {
    fontFamily: 'Arkhip-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 18,
  },
  noFavoritesText: {
    fontFamily: 'Arkhip-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    padding: 20,
  },
  backButton: {
    marginTop: 10,
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
  modalButton: {
    backgroundColor: '#00008b',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#00ffff',
  },
  modalCancelButton: {
    backgroundColor: '#8B0000',
  },
  modalButtonText: {
    fontFamily: 'Arkhip-Regular',
    fontSize: 16,
    color: '#FFFFFF',
  },
});