import { Dimensions, Platform } from 'react-native';

const isIos = Platform.OS === 'iso';
const isAndroid = Platform.OS === 'android';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export {
    isIos,
    isAndroid,
    SCREEN_HEIGHT,
    SCREEN_WIDTH,
};
