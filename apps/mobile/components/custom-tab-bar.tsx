// components/custom-tab-bar.tsx
import { BottomNavigation } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';

export function CustomTabBar({ navigation, state, descriptors, insets }) {
    return (
        <BottomNavigation.Bar
            navigationState={state}
            safeAreaInsets={insets}
            onTabPress={({ route, preventDefault }) => {
                const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                });

                if (event.defaultPrevented) {
                    preventDefault();
                } else {
                    navigation.dispatch({
                        ...CommonActions.navigate(route.name, route.params),
                        target: state.key,
                    });
                }
            }}
            renderIcon={({ route, focused, color }) => {
                const { options } = descriptors[route.key];
                return options.tabBarIcon?.({ focused, color, size: 24 }) || null;
            }}
            getLabelText={({ route }) => {
                const { options } = descriptors[route.key];
                const label =
                    typeof options.tabBarLabel === 'string'
                        ? options.tabBarLabel
                        : typeof options.title === 'string'
                            ? options.title
                            : route.name;
                return label;
            }}
            shifting={true}
            inactiveColor="#ddd"
        />
    );
}