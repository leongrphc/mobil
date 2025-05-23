/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import TasksScreen from './screens/TasksScreen';
import AddScreen from './screens/AddScreen';
import ProjectsScreen from './screens/ProjectsScreen';
import ProfileScreen from './screens/ProfileScreen';
import NotesScreen from './screens/NotesScreen';
import { Text } from 'react-native';
import { AppProvider } from './components/TaskContext';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 8 },
            tabBarIcon: ({ focused }) => {
              let icon = '';
              switch (route.name) {
                case 'Home':
                  icon = '🏠';
                  break;
                case 'Tasks':
                  icon = '🗂️';
                  break;
                case 'Add':
                  icon = '➕';
                  break;
                case 'Projects':
                  icon = '📁';
                  break;
                case 'Notes':
                  icon = '📝';
                  break;
                case 'Profile':
                  icon = '👤';
                  break;
              }
              return <Text style={{ fontSize: focused ? 32 : 26 }}>{icon}</Text>;
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Tasks" component={TasksScreen} />
          <Tab.Screen name="Add" component={AddScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
