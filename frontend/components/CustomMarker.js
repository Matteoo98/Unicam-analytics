import React from 'react';
import {
    Text, View
} from 'react-native';

const CustomMarker = (props) => {
    const descrizione = props.description;
    return (
        <View style={{
            height: 30,
            width: 30,
            borderRadius: 20,
            backgroundColor: 'red',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Text style={{ color: '#fff' }}>{descrizione}</Text>
        </View>
    )
    /* return (
        <ImageBackground style={{
            height: 51,
            width: 35,
            alignItems: 'center',
            justifyContent: 'center',
        }} source={require('../assets/images/marker1.png')}>
            <Text style={{ color: '#fff', marginBottom: 15 }}>{descrizione}</Text>
        </ImageBackground> 
    )*/

}
export default CustomMarker;