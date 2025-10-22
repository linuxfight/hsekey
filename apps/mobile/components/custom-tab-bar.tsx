import { BottomNavigation } from "react-native-paper";

export function CustomTabBar({ navigation, state, descriptors, insets }) {
    return (
        <BottomNavigation
            navigationState={state}
            onIndexChange={(index) => {
                navigation.navigate(state.routes[index].name);
            }}
            renderScene={BottomNavigation.SceneMap(
                state.routes.reduce((acc, route) => {
                    const { options } = descriptors[route.key];
                    const { component: Component } = options;
                    acc[route.key] = () => <Component />;
                    return acc;
                }, {})
            )}
            shifting={true}
            activeColor="#fff"
            inactiveColor="#ddd"
            barStyle={{ backgroundColor: '#FFC107' }}
        />
    );
}
