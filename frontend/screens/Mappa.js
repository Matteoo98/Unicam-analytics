import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, Text, View, Image, Dimensions, Animated, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../utils/helper';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import data from './data';

const Mappa = () => {

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const [latitudine, setLatitudine] = useState(0);
    const [longitudine, setLongitudine] = useState(0);

    useEffect(() => {
        (async () => {
            let { status } = await Permissions.askAsync(Permissions.LOCATION);

            if (status !== 'granted') {
                console.log('PERMISSION DENIED');
                setErrorMsg("PERMISSION DENIED");
            }

            const location = await Location.getCurrentPositionAsync();
            setLatitudine(location.coords.latitude);
            setLongitudine(location.coords.longitude);
            setLocation(location);
        })();
    }, []);
    /*
        let text = 'Waiting..';
        if (errorMsg) {
            text = errorMsg;
        } else if (location) {
            // text = JSON.stringify(location);
            // console.log("longitude", location.coords.longitude);
            // console.log("latitude", location.coords.latitude);
            setLatitudine(location.coords.latitude);
            setLongitudine(location.coords.longitude);
            console.log("latitudine", latitudine, "longitudine", longitudine);
        }
    */
    return (
        <View>
            {  
            latitudine != 0 ? 
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: latitudine,
                    longitude: longitudine,
                    // latitudeDelta: 8,
                    // longitudeDelta: 8,
                }}
            // showsUserLocation={true}
            >
                {data.map((marker, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                        title={marker.title}
                        description={marker.description}
                        pinColor={marker.pinColor}
                    />
                ))}
            </MapView> : <ActivityIndicator size="large" />
            }

            <View style={styles.viewCardSlider}>
                <View style={styles.cardSlider}>
                    <Text style={{ fontSize: 20, fontWeight: '500' }}>slider</Text>
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    cardSlider: {
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
        marginBottom: '5%',
    },
    viewCardSlider: {
        // flex: 1,
        width: SCREEN_WIDTH,
        height: '10%',
        position: 'absolute',
        alignItems: 'center',
        // justifyContent: 'flex-end',
        bottom: "1%"
    },
    map: {
        width: SCREEN_WIDTH,
        height: "100%",
    },
})
export default Mappa;