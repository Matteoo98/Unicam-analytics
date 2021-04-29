import Slider from '@react-native-community/slider';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import axios from 'axios';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View, Dimensions, Modal, Animated, ScrollView } from 'react-native';
import MapView, { Callout, Circle, Marker, CalloutSubview } from 'react-native-maps';
import { ActivityIndicator } from 'react-native-paper';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../utils/helper';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import DescrModal from '../components/DescrModal';
import { Root, Popup, Toast } from 'popup-ui';
import CardSlider from 'react-native-cards-slider';
import { VictoryPie, VictoryBar, VictoryTheme, VictoryAxis, VictoryChart, VictoryLabel } from 'victory-native';
import { DataTable } from 'react-native-paper';

const { width, height } = Dimensions.get('window');
const larghezza = width / 1.3;
const DOT_SIZE = 40;
const TICKER_HEIGHT = 40;
const CIRCLE_SIZE = width * 0.6;

const data = [
    {
        key: 'first',
        color: '#63CEEB',
        type: 'GENERE',
    },
    {
        key: 'second',
        color: '#26F09F',
        type: 'CORSI DI STUDIO',
    },
    {
        key: 'third',
        color: '#F05441',
        type: 'SCUOLE SUPERIORI',
    },
];

const Ticker = ({ scrollX }) => {
    const inputRange = [-width, 0, width];
    const translateY = scrollX.interpolate({
        inputRange,
        outputRange: [TICKER_HEIGHT, 0, -TICKER_HEIGHT],
    });
    return (
        <View style={styles.tickerContainer}>
            <Animated.View style={{ transform: [{ translateY }], alignItems: 'center' }}>
                {data.map(({ type }, index) => {
                    return (
                        <Text key={index} style={styles.tickerText}>
                            {type}
                        </Text>
                    );
                })}
            </Animated.View>
        </View>
    );
};

const Pagination = ({ scrollX }) => {
    const inputRange = [-width, 0, width];
    const translateX = scrollX.interpolate({
        inputRange,
        outputRange: [-DOT_SIZE, 0, DOT_SIZE],
    });
    return (
        <View style={[styles.pagination]}>
            <Animated.View
                style={[
                    styles.paginationIndicator,
                    {
                        position: 'absolute',
                        // backgroundColor: 'red',
                        transform: [{ translateX }],
                    },
                ]}
            />
            {data.map((item) => {
                return (
                    <View key={item.key} style={styles.paginationDotContainer}>
                        <View
                            style={[styles.paginationDot, { backgroundColor: item.color }]}
                        />
                    </View>
                );
            })}
        </View>
    );
};

const Mappa = () => {

    /* COSTANTI */
    const scrollX = React.useRef(new Animated.Value(0)).current;

    /*  HOOKS  */
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [latitudine, setLatitudine] = useState(0);
    const [longitudine, setLongitudine] = useState(0);
    const [minimo, setMinimo] = useState(1);
    const [massimo, setMassimo] = useState(100);
    const [index, setIndex] = useState(0);
    const [raggio, setRaggio] = useState(10000);
    const [categoria, setCategoria] = useState("comune");
    const [markers, setMarkers] = useState([]);
    const [colore, setColore] = useState("red");
    const [modalVisible, setModalVisible] = useState(false);
    const [latCliccata, setLatCliccata] = useState(0);
    const [longCliccata, setLongCliccata] = useState(0);
    const [dettagliModal, setDettagliModal] = useState(null);
    const [page, setPage] = useState(0);
    const [page2, setPage2] = useState(0);
    const [nome, setNome] = useState("");

    /* FUNZIONI */
    useEffect(() => {
        getActualPosition();
    }, []);

    function getActualPosition() {

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

            // CARICAMENTO MARKER INIZIALI
            axios.get(`https://unicam-analytics.herokuapp.com/calculateLocations`, {
                params: {
                    category: categoria,
                    longitude: location.coords.longitude,
                    latitude: location.coords.latitude,
                    distance: raggio,
                }
            }).then(data => {
                setMarkers(data.data.lista);
            }).catch(error => {
                console.log(error);
                setError(true);
            })
        })();
    }

    function getMarkersFromSlider(event) {
        setRaggio(event);

        axios.get(`https://unicam-analytics.herokuapp.com/calculateLocations`, {
            params: {
                category: categoria,
                longitude: longitudine,
                latitude: latitudine,
                distance: event,
            }
        }).then(data => {
            setMarkers(data.data.lista);
        }).catch(error => {
            console.log(error);
            setError(true);
        })
    }

    function getMarkersFromCategorySelector(index) {
        setIndex(index);
        setIndice(index);
        var category = '';

        if (index == 0) {
            category = 'comune';
        }
        if (index == 1) {
            category = 'provincia';
        }
        if (index == 2) {
            category = 'regione';
        }
        if (index == 3) {
            category = 'nazione';
        }

        axios.get(`https://unicam-analytics.herokuapp.com/calculateLocations`, {
            params: {
                category: category,
                longitude: longitudine,
                latitude: latitudine,
                distance: raggio,
            }
        }).then(data => {
            setMarkers(data.data.lista);
        }).catch(error => {
            console.log(error);
            setError(true);
        })
    }

    function setIndice(indice) {
        switch (indice) {
            case 0:
                setMinimo(1);
                setMassimo(100);
                setCategoria("comune");
                setColore("red");
                break;
            case 1:
                setMinimo(1);
                setMassimo(250);
                setCategoria("provincia");
                setColore("yellow");
                break;
            case 2:
                setMinimo(1);
                setMassimo(800);
                setCategoria("regione");
                setColore("blue");
                break;
            case 3:
                setMinimo(1);
                setMassimo(14500);
                setCategoria("nazione");
                setColore("green");
                break;
        }
    }

    function onPress(lat, long) {
        setLatitudine(lat);
        setLongitudine(long);
    }

    function GraficoSesso() {

        var maschi = dettagliModal.maschi;
        var femmine = dettagliModal.femmine;
        var totale = dettagliModal.count;
        maschi = maschi.replace('%', '');
        maschi = parseInt(maschi);
        femmine = femmine.replace('%', '');
        femmine = parseInt(femmine);

        let numMaschi = Math.round((totale * maschi) / 100);
        let numFemmine = Math.round((totale * femmine) / 100);

        // console.log("maschi: ", maschi, "femmine: ", femmine);

        let pino = [
            { x: "Maschi", y: maschi },
            { x: "Femmine", y: femmine }
        ];

        return <View style={{
            // width: SCREEN_WIDTH / 1.15,
            // height: SCREEN_HEIGHT / 2.5,
            // alignItems: 'center',
            // justifyContent: 'center',
            // borderWidth: 1,
            // marginLeft: 5,
            // marginRight: 5,
            width,
            // height,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ width: SCREEN_WIDTH / 1.3 }} >
                    <VictoryPie
                        theme={VictoryTheme.material}
                        data={pino}
                        animate={{
                            duration: 2000
                        }}
                        colorScale={["#2978b5", "#e36bae"]}
                        labels={({ datum }) => datum.y + "%"}
                        // height={SCREEN_WIDTH / 1.25}
                        width={SCREEN_WIDTH / 1.3}
                        style={{
                            labels: { fontSize: Dimensions.get('window').height > 700 ? 10 : 8, fontWeight: "bold" },
                            data: { fillOpacity: 0.9, stroke: "#fff", strokeWidth: 5 }
                        }}
                        innerRadius={50}
                    />
                </View>
                <View style={{ width: SCREEN_WIDTH / 1.3 }} >
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title style={{ justifyContent: 'center' }}>Maschi</DataTable.Title>
                            <DataTable.Title style={{ justifyContent: 'center' }}>Femmine</DataTable.Title>
                            <DataTable.Title style={{ justifyContent: 'center' }}>Totale</DataTable.Title>
                        </DataTable.Header>

                        <DataTable.Row>
                            <DataTable.Cell style={{ justifyContent: 'center' }}>{numMaschi}</DataTable.Cell>
                            <DataTable.Cell style={{ justifyContent: 'center' }}>{numFemmine}</DataTable.Cell>
                            <DataTable.Cell style={{ justifyContent: 'center' }}>{totale}</DataTable.Cell>
                        </DataTable.Row>


                    </DataTable>
                </View>
            </ScrollView>
        </View>
    }
    function GraficoCds() {

        let lista = dettagliModal.cds;
        let top3 = lista.slice(0, 4);
        let list;
        // console.log("lista", lista);

        const itemsPerPage = 5;
        const from = page * itemsPerPage;
        const to = (page + 1) * itemsPerPage;

        return <View style={{
            /* width: SCREEN_WIDTH / 1.2,
            height: SCREEN_HEIGHT / 2.5,
            alignItems: 'center',
            justifyContent: 'center',
            // borderWidth: 1,
            marginLeft: 5,
            marginRight: 5, */
            width,
            // height,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <View style={{ width: SCREEN_WIDTH / 1.3 }} >
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Corsi</DataTable.Title>
                        <DataTable.Title numeric>Inscritti</DataTable.Title>
                    </DataTable.Header>

                    {list = lista
                        .slice(
                            page * itemsPerPage,
                            page * itemsPerPage + itemsPerPage,
                        )
                        .map((item, index) =>
                            <DataTable.Row key={index}>
                                <DataTable.Cell>{item.cds}</DataTable.Cell>
                                <DataTable.Cell numeric>{item.cdsCount}</DataTable.Cell>
                            </DataTable.Row>
                        )}

                    <DataTable.Pagination
                        page={page}
                        numberOfPages={Math.floor(lista.length / itemsPerPage)}
                        onPageChange={page => setPage(page)}
                        label={`${from + 1}-${to} of ${lista.length}`}
                    />
                </DataTable>
            </View>
        </View>
    }
    function GraficoScuolaSup() {

        let lista = dettagliModal.superiori;
        let top3 = lista.slice(0, 3);
        let list;
        const itemsPerPage = 5;
        const from = page2 * itemsPerPage;
        const to = (page2 + 1) * itemsPerPage;

        return <View style={{
            /* width: SCREEN_WIDTH / 1.2,
            height: SCREEN_HEIGHT / 2.5,
            alignItems: 'center',
            justifyContent: 'center',
            // borderWidth: 1,
            marginLeft: 5,
            marginRight: 5, */
            width,
            // height,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ width: SCREEN_WIDTH / 1.3 }} >
                    <VictoryChart
                        theme={VictoryTheme.material}
                        domainPadding={25}
                        width={SCREEN_WIDTH / 1.3}
                    >
                        <VictoryAxis
                            style={{
                                grid: { stroke: "#C9D1D1", strokeDasharray: "2 10" },
                                // tickLabels: { fontSize: 10 }
                            }}
                            tickFormat={() => ''}
                        />
                        <VictoryAxis
                            dependentAxis
                            style={{
                                grid: { stroke: "#C9D1D1", strokeDasharray: "2 10" },
                                tickLabels: { fontSize: 15 }
                            }}
                        />
                        <VictoryBar
                            style={{ labels: { fontSize: 10, fill: 'black', fontWeight: 600 }, data: { fill: "#2089dc" } }}
                            animate={{
                                duration: 2000,
                                onLoad: { duration: 1000 }
                            }}
                            // labelComponent={<VictoryLabel dx={0} />}
                            labels={({ datum }) => `${datum.scuola}`}
                            x="scuola"
                            y="scuolaCount"
                            data={top3}
                        />
                    </VictoryChart>
                </View>
                <View style={{ width: SCREEN_WIDTH / 1.3 }} >
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title>Scuole Superiori</DataTable.Title>
                            <DataTable.Title numeric>Numero</DataTable.Title>
                        </DataTable.Header>

                        {list = lista
                            .slice(
                                page2 * itemsPerPage,
                                page2 * itemsPerPage + itemsPerPage,
                            )
                            .map((item, index) =>
                                <DataTable.Row key={index}>
                                    <DataTable.Cell>{item.scuola}</DataTable.Cell>
                                    <DataTable.Cell numeric>{item.scuolaCount}</DataTable.Cell>
                                </DataTable.Row>
                            )}

                        <DataTable.Pagination
                            page={page2}
                            numberOfPages={Math.floor(lista.length / itemsPerPage)}
                            onPageChange={page => setPage2(page)}
                            label={`${from + 1}-${to} of ${lista.length}`}
                        />
                    </DataTable>
                </View>
            </ScrollView>
        </View>
    }

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.4)"
                }}>
                    <View style={{
                        width: width,
                        height: height / 1.24,
                        // margin: 20,
                        backgroundColor: "#f3f3f3",
                        borderRadius: 20,
                        // alignItems: "center",
                        // justifyContent: 'space-around',
                    }}>
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: 1,
                        }}>
                            <View style={{
                                padding: 10,
                                borderRadius: 20,
                                backgroundColor: '#fff',
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 4,
                                elevation: 5,
                            }}>
                                <Text style={styles.tickerText}>DETTAGLI {nome.toUpperCase()}</Text>
                            </View>
                        </View>
                        {/* ************************************************************************** */}
                        <View style={{
                            width,
                            // height: height / 1.5,
                            flex: 6,
                            backgroundColor: '#fff',
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 5,
                        }}>
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                            }} >
                                <Ticker scrollX={scrollX} />
                            </View>
                            <View style={{ flex: 5 }} >
                                <Animated.FlatList
                                    keyExtractor={(item) => item.key}
                                    data={data}
                                    renderItem={({ item, index }) => (
                                        item.key == "first" ? <GraficoSesso /> : item.key == "second" ? <GraficoCds /> : item.key == "third" ? <GraficoScuolaSup /> : null
                                    )}
                                    pagingEnabled
                                    showsHorizontalScrollIndicator={false}
                                    horizontal
                                    onScroll={Animated.event(
                                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                                        { useNativeDriver: true }
                                    )}
                                    scrollEventThrottle={16}
                                />
                            </View>
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                flex: 1,
                            }} >
                                <Pagination scrollX={scrollX} />
                            </View>
                        </View>
                        {/* ************************************************************************** */}
                        <View style={{
                            flexDirection: 'row',
                            width,
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            flex: 1,
                        }} >
                            <TouchableOpacity
                                onPress={() => {
                                    onPress(latCliccata, longCliccata);
                                    Toast.show({
                                        title: 'Bene!',
                                        text: 'Posizione aggiornata con successo',
                                        color: '#2ecc71'
                                    });
                                    setModalVisible(!modalVisible);
                                }}
                                style={styles.calloutButton}
                            >
                                <MaterialIcons name="gps-fixed" size={40} color="#2ecc71" />
                            </TouchableOpacity>
                            <View style={{ alignContent: 'center', justifyContent: 'center' }} >
                                <TouchableOpacity
                                    style={styles.calloutButton}
                                    onPress={() => {
                                        setModalVisible(!modalVisible);
                                    }}
                                >
                                    <AntDesign name="close" size={40} color="red" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

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
                    {markers.map((marker, index) => (

                        <Marker
                            key={index}
                            coordinate={{ latitude: marker.location.coordinates[1], longitude: marker.location.coordinates[0] }}
                            title={marker.name}
                            description={marker.category}
                            pinColor={colore}
                        >
                            <Callout
                                onPress={() => {
                                    setLatCliccata(marker.location.coordinates[1]);
                                    setLongCliccata(marker.location.coordinates[0]);
                                    setDettagliModal(marker);
                                    setNome(marker.name);
                                    setModalVisible(true);
                                }}
                                style={{
                                    width: 150,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <View style={{
                                    flex: 2,
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Text style={styles.titolo}>{marker.name}</Text>
                                </View>
                                <View style={{
                                    flex: 4,
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                }}>
                                    <Text style={styles.text}>Numero iscritti: {marker.count}</Text>
                                    <Text style={styles.text}>Maschi: {marker.maschi}</Text>
                                    <Text style={styles.text}>Femmine: {marker.femmine}</Text>
                                    <Text style={styles.text}>Età media: {marker.averageYear}</Text>
                                </View>

                                <View style={styles.calloutButton} >
                                    <FontAwesome5 name="search-location" size={25} color="#007AFF" />
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
                        width: '100%',
                        height: '40%',
                    }}>
                        <SegmentedControl
                            values={['Comuni', 'Province', 'Regioni', 'Nazioni']}
                            selectedIndex={index}
                            onChange={(event) => {
                                getMarkersFromCategorySelector(event.nativeEvent.selectedSegmentIndex);
                            }}
                            style={{ height: '100%' }}
                            tintColor={"#007AFF"}
                            activeFontStyle={{ color: "#fff" }}
                            fontStyle={{ color: "#007AFF" }}
                        />
                    </View>

                    {/* SLIDER */}
                    <View style={{
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
                                        getMarkersFromSlider(event);
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
    calloutButton: {
        width: 'auto',
        backgroundColor: '#fff',
        paddingHorizontal: 6,
        paddingVertical: 6,
        borderRadius: 30,
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    modalView: {
        width: SCREEN_WIDTH / 1.13,
        height: "60%",
        margin: 20,
        backgroundColor: "#f3f3f3",
        borderRadius: 20,
        // padding: 35,
        alignItems: "center",
        justifyContent: 'space-around',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    container: {
        flex: 1,
    },
    itemStyle: {
        width,
        // height,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageStyle: {
        // width: width * 0.75,
        // height: width * 0.75,
        width: width * 0.50,
        height: width * 0.50,
        resizeMode: 'contain',
        flex: 1,
    },
    textContainer: {
        width,
        justifyContent: 'center',
        alignItems: 'center',
        // alignItems: 'flex-start',
        // alignSelf: 'flex-end',
        flex: 0.5,
    },
    heading: {
        color: '#0000FF',
        // textTransform: 'uppercase',
        fontSize: Dimensions.get('window').height > 700 ? 15 : 13,
        fontWeight: '800',
        // letterSpacing: 2,
        marginBottom: 5,
        padding: 20,
    },
    description: {
        color: '#ccc',
        fontWeight: '600',
        textAlign: 'center',
        width: width * 0.75,
        marginRight: 10,
        fontSize: 16,
        lineHeight: 16 * 1.5,
    },
    pagination: {
        // position: 'absolute',
        // right: 20,
        // bottom: 40,
        flexDirection: 'row',
        height: DOT_SIZE,
    },
    paginationDot: {
        width: DOT_SIZE * 0.3,
        height: DOT_SIZE * 0.3,
        borderRadius: DOT_SIZE * 0.15,
    },
    paginationDotContainer: {
        width: DOT_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        // borderWidth: 1
    },
    paginationIndicator: {
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: DOT_SIZE / 2,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    tickerContainer: {
        // marginLeft: 5,
        // position: 'absolute',
        // top: 40,
        // left: 20,
        overflow: 'hidden',
        height: TICKER_HEIGHT,
        alignItems: 'center',
    },
    tickerText: {
        // fontSize: TICKER_HEIGHT,
        fontSize: 25,
        lineHeight: TICKER_HEIGHT,
        textTransform: 'uppercase',
        fontWeight: '800',
    },

    circleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    circle: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        position: 'absolute',
        top: '15%',
    },
});
export default Mappa;