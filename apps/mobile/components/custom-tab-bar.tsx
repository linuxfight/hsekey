import { BottomNavigation } from "react-native-paper";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ShopScreen from '@/app/(tabs)/shop';
import StatsScreen from '@/app/(tabs)/stats';
import TransactionsScreen from '@/app/(tabs)/transactions';

const sceneMap = BottomNavigation.SceneMap({
    shop: ShopScreen,
    stats: StatsScreen,
    transactions: TransactionsScreen,
});

export function CustomTabBar({ navigation, state, descriptors }) {
    const insets = useSafeAreaInsets();
    return (
        <BottomNavigation
            navigationState={state}
            onIndexChange={(index) => {
                navigation.navigate(state.routes[index].name);
            }}
            renderScene={sceneMap}
            shifting={true}
            activeColor="#fff"
            inactiveColor="#ddd"
            barStyle={{ backgroundColor: '#FFC107' }}
            safeAreaInsets={{
                bottom: insets.bottom,
            }}
        />
    );
}