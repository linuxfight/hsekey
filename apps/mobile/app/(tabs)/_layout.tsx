import { Tabs } from 'expo-router';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { CustomTabBar } from '@/components/custom-tab-bar';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: '#ddd',
                tabBarStyle: {
                    backgroundColor: '#FFC107',
                },
            }}
            // tabBar={(props) => <CustomTabBar {...props} />}
        >
            <Tabs.Screen
                name="shop"
                options={{
                    title: 'Shop',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="cart" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="stats"
                options={{
                    title: 'Stats',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="chart-bar" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="transactions"
                options={{
                    title: 'Transactions',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="format-list-bulleted" color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    );
}