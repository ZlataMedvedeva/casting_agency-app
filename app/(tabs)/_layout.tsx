import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: {
          fontFamily: 'Oktyabrina-script', // Шрифт заголовков
          fontSize: 24, // Можно настроить размер
        },
        headerTintColor: '#fff',
        headerStyle: {
          backgroundColor: '#000',
        },
      }}
    >
      {/* Остальные экраны без изменений */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ title: 'Авторизация' }} />
      <Stack.Screen name="casting" options={{ title: 'Кастинги' }} />
      <Stack.Screen name="profile" options={{ title: 'Профиль' }} />
      <Stack.Screen name="filters" options={{ title: 'Поиск актёров' }} />
    </Stack>
  );
}