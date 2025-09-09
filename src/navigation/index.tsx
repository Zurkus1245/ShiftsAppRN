import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ShiftsListScreen from '../screens/ShiftsListScreen.tsx';
import ShiftDetailsScreen from '../screens/ShiftDetailsScreen.tsx';
import type {Shift} from '../types';

export type RootStackParamList = {
  ShiftsList: undefined;
  ShiftDetails: {shift: Shift};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer theme={DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen name="ShiftsList" component={ShiftsListScreen} options={{title: 'Смены рядом'}} />
        <Stack.Screen name="ShiftDetails" component={ShiftDetailsScreen} options={{title: 'Детали смены'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

