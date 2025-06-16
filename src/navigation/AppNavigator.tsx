import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DeckListScreen from '../screens/DeckListScreen';
import DeckDetailScreen from '../screens/DeckDetailScreen';
import CardDetailScreen from '../screens/CardDetailScreen';
import CreateDeckScreen from '../screens/CreateDeckScreen';
import CreateCardScreen from '../screens/CreateCardScreen';
import StudySessionScreen from '../screens/StudySessionScreen';
import { RootStackParamList } from '../types';
import { COLORS } from '../styles/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="DeckList"
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: COLORS.background
          },
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen 
          name="DeckList" 
          component={DeckListScreen} 
        />
        <Stack.Screen 
          name="DeckDetail" 
          component={DeckDetailScreen} 
        />
        <Stack.Screen 
          name="CardDetail" 
          component={CardDetailScreen} 
        />
        <Stack.Screen 
          name="CreateDeck" 
          component={CreateDeckScreen} 
        />
        <Stack.Screen 
          name="CreateCard" 
          component={CreateCardScreen} 
        />
        <Stack.Screen 
          name="StudySession" 
          component={StudySessionScreen} 
        />
        <Stack.Screen 
          name="Home" 
          component={DeckListScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
