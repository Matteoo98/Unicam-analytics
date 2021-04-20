import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../utils/helper';
import MapView from 'react-native-maps';

const Mappa = () => {
    return (
        <View style={styles.container}>

            <View style={styles.cardTitolo}>
                <Text style={{ fontSize: 20, fontWeight: '500' }}>MAPPA</Text>
            </View>
            <View style={styles.mappa}>
                <MapView style={styles.map} />
            </View>
            <View style={styles.cardTitolo}>
                <Text style={{ fontSize: 20, fontWeight: '500' }}>slider</Text>
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
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    mappa: {
        width: SCREEN_WIDTH / 1.13,
        height: SCREEN_HEIGHT / 1.7,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
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
    map: {
        width: SCREEN_WIDTH / 1.13,
        height: SCREEN_HEIGHT / 1.7,
        borderRadius: 10,
        // width: Dimensions.get('window').width,
        // height: Dimensions.get('window').height,
      },
})
export default Mappa;