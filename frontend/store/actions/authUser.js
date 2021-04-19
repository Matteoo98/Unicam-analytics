export const SIGNIN = 'SIGNIN';
export const RETRIEVE_DATA = 'RETRIEVE_DATA';
export const LOGOUT = 'LOGOUT';
import React, { useState } from 'react';
import axios from 'axios';
import { Alert, AsyncStorage } from 'react-native';
import Toast from 'react-native-tiny-toast';
import { useSelector } from 'react-redux';

export const signin = (email, password) => {
    return async dispatch => {
        const data = await axios.get('https://cruscotto.unicam.it:8444/login', {
            auth: {
                username: email,
                password: password,
            }
        }).catch((error) => console.log(error));
        data.data === 'UNAUTHORIZED' ? Toast.show('Utente non autorizzato', {
            position: Toast.position.center,
            containerStyle: { borderRadius: 20, width: '90%', backgroundColor: '#FF1021' },
            mask: true,
        }) : (
                console.log('data Login', data),
                dispatch({
                    type: SIGNIN, data: data.data
                }),
                saveData(data.data),
                Toast.showSuccess('Login effettuato con successo')
            );
    }
}
/* dispatch({ type: SIGNIN, token: data.data.authToken, userId: data.data.credentials.user, password: password , user:data.data.user });
    saveData(data.data.authToken, data.data.credentials.user, password ,data.data.user);

    const saveData = (token, userId, password , user) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        token: token,
        userId: userId,
        password: password,
        user: user
    }))
}
} */
const saveData = (data) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        data: data,
    }))
}
export const retrieveData = () => {
    return async dispatch => {
        const data = await AsyncStorage.getItem('userData');
        const myData = JSON.parse(data);
        dispatch({
            type: RETRIEVE_DATA,
            /* token: myData ? myData.token : null,
            userId: myData ? myData.userId : null,
            password: myData ? myData.password : null,
            user: myData ? myData.user : null */
            data: myData ? myData.data : null
        });
    }
}