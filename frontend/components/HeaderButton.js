import { Ionicons } from '@expo/vector-icons';
import React from 'react';

const HeaderButton = (props) => {

    return (
        <Ionicons style={{ marginLeft: 20, marginTop: 5, }} name="ios-menu" size={32} onPress={props.onPressLeft} />
    )
}

export default HeaderButton;