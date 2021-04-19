import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../utils/helper';

const { width, height } = Dimensions.get('window');

const Mappa = () => {
    return (
        <View style={styles.container}>

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                <View style={styles.cardTitolo}>
                    <Text style={{ fontSize: 20, fontWeight: '500' }}>MAPPA</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardTitolo: {
        width: SCREEN_WIDTH / 1.13,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        //marginTop: 30,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    container: {
        flex: 1,
    },
})
export default Mappa;