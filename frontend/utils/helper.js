import { Platform, Dimensions } from 'react-native';
import { exp } from 'react-native-reanimated';

const isIos = Platform.OS === 'iso';
const isAndroid = Platform.OS === 'android';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export {
    isIos,
    isAndroid,
    SCREEN_HEIGHT,
    SCREEN_WIDTH,
}