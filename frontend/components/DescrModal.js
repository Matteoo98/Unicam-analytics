import React from 'react';
import { StyleSheet, Text, View, ScrollView, Button, Image, TouchableOpacity, Dimensions, Modal } from 'react-native';
// import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../utils/helper';
// import RoundButton from '../components/RoundButton';

const DescrModal = (props) => {
    // const titolo = props.data;

    return <Modal visible={props.visible} animationType={'slide'} transparent={true} >
        <View style={styles.modalView}>

        </View>
    </Modal>

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        // backgroundColor: '#DBECF5'
    },
    descrizione: {
        fontSize: 22,
        fontWeight: '600',
        // marginBottom: 20,
        textAlign: 'center',
    },
    descrizione2: {
        fontSize: 20,
        fontWeight: '400',
        // marginBottom: 30,
        textAlign: 'justify',
    },
    modalView: {
        borderWidth: 1,
        // height: SCREEN_HEIGHT / 1.3,
        // width: SCREEN_HEIGHT / 2.3,
        height: Dimensions.get('window').height / 1.3,
        width: Dimensions.get('window').width / 1.05,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        // marginTop: Dimensions.get('window').height > 650 ? SCREEN_HEIGHT / 9 : SCREEN_HEIGHT / 10,
        //margin: SCREEN_WIDTH/26,
        backgroundColor: "#F3F3F3",
        borderRadius: 20,
        padding: 35,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignSelf: "center",
    },
})
export default DescrModal;