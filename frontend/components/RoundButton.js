import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../utils/helper';
import { Ionicons } from '@expo/vector-icons';

const RoundButton = (props) => {
    const plusImage = require('../assets/images/plus.png');
    return (
        <View>
            <Ionicons style={styles.plusImage} name="ios-close-circle" size={60} color={'red'}/>
        </View>
    )
} 
const styles = StyleSheet.create({
    plusImage: {
        justifyContent: 'center',
        alignItems: 'center',
        
    },
})
export default RoundButton;