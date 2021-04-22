import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, Text, View, Image, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../utils/helper';
import MapView, { Circle } from 'react-native-maps';
import { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { ActivityIndicator, Colors } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import SegmentedControl from '@react-native-segmented-control/segmented-control';

import data from './data';
import { color } from 'react-native-reanimated';
import CustomMarker from '../components/CustomMarker';

const Mappa = () => {

    /*  HOOKS  */
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [latitudine, setLatitudine] = useState(0);
    const [longitudine, setLongitudine] = useState(0);
    const [minimo, setMinimo] = useState(1);
    const [massimo, setMassimo] = useState(250);
    const [index, setIndex] = useState(0);
    const [raggio, setRaggio] = useState(0);

    function setIndice(indice) {
        switch (indice) {
            case 0:
                setMinimo(1);
                setMassimo(250);
                break;
            case 1:
                setMinimo(1);
                setMassimo(1000);
                break;
            case 2:
                setMinimo(1);
                setMassimo(1000);
                break;
            case 3:
                setMinimo(1);
                setMassimo(14500);
                break;
        }
    }

    useEffect(() => {

        /*  PRENDE LA POSIZIONE ATTUALE  */
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

    return (
        <View>
            {latitudine != 0 && longitudine != 0 ?
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: latitudine,
                        longitude: longitudine,
                        latitudeDelta: 5,
                        longitudeDelta: 5,
                    }}
                    showsUserLocation={true}
                >
                    {data.map((marker, index) => (
                        
                        <Marker
                            key={index}
                            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                            title={marker.title}
                            description={marker.description}
                            pinColor={marker.pinColor}
                        >
                            {/* Platform.OS !== 'ios' ? <CustomMarker {...marker} /> : null */}
                            <Callout style={{
                                width: 150,
                                // height: 100,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <View style={{
                                    // borderWidth: 1,
                                    flex: 2,
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Text style={styles.titolo}>{marker.title}</Text>
                                </View>
                                <View style={{
                                    // borderWidth: 1,
                                    flex: 4,
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                }}>
                                    <Text style={styles.text}>Numero iscritti: {marker.description}</Text>
                                    <Text style={styles.text}>Maschi: xxx</Text>
                                    <Text style={styles.text}>Femmine: xxx</Text>
                                    <Text style={styles.text}>Età media: xxx</Text>
                                </View>
                            </Callout>
                        </Marker>
                    ))}

                    <Circle center={{ latitude: latitudine, longitude: longitudine }} radius={raggio} fillColor={"rgba(0,122,255,0.2)"} strokeColor={"#007AFF"} />

                </MapView> : <ActivityIndicator animating={true} color={"#007AFF"} style={styles.map} size={'large'} />
            }

            <View style={styles.viewCard}>
                <View style={styles.card}>
                    {/* FILTRO */}
                    <View style={{
                        // borderWidth: 1,
                        width: '100%',
                        height: '40%',
                    }}>
                        <SegmentedControl
                            values={['Comuni', 'Province', 'Regioni', 'Nazioni']}
                            selectedIndex={index}
                            onChange={(event) => {
                                setIndex(event.nativeEvent.selectedSegmentIndex),
                                    setIndice(event.nativeEvent.selectedSegmentIndex)
                            }}
                            style={{ height: '100%' }}
                            tintColor={"#007AFF"}
                            activeFontStyle={{ color: "#fff" }}
                            fontStyle={{ color: "#007AFF" }}
                        />
                    </View>

                    {/* SLIDER */}
                    <View style={{
                        // borderWidth: 1,
                        width: '100%',
                        height: '40%',
                        flexDirection: 'row',
                    }}>
                        <View style={styles.maxmin}>
                            <Text style={{ color: "#007AFF" }}>{(raggio / 1000).toFixed(0)} Km</Text>
                        </View>
                        <View style={styles.slider}>
                            <Slider
                                minimumValue={minimo}
                                maximumValue={massimo}
                                thumbTintColor={Platform.OS === 'ios' ? "#fff" : "#007AFF"}
                                minimumTrackTintColor={"#007AFF"}
                                onValueChange={(event) => {
                                    event = event * 1000,
                                        setRaggio(event)
                                }}
                            />
                        </View>
                        <View style={styles.maxmin}>
                            <Text style={{ color: "#007AFF" }}>{massimo} Km</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: SCREEN_WIDTH / 1.13,
        height: '90%',
        borderRadius: 20,
        justifyContent: 'space-around',
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
        // marginBottom: '5%',
        flexDirection: 'column',
        // borderWidth: 1,
    },
    viewCard: {
        width: SCREEN_WIDTH,
        height: '18%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: '1%',
        // borderWidth: 1,
    },
    map: {
        width: SCREEN_WIDTH,
        height: "100%",
    },
    maxmin: {
        flex: 1,
        width: "90%",
        height: "100%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    slider: {
        flex: 6,
        width: "100%",
        height: "100%",
        justifyContent: 'center',
    },
    titolo: {
        fontSize: 20,
    },
    text: {
        fontSize: 15,
        fontWeight: "300",
    },
})
export default Mappa;