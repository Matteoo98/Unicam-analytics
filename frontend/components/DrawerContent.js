import React, { useState } from 'react';
import { View, StyleSheet, Image, AsyncStorage } from 'react-native';
import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';
//import { Icon } from 'react-native-elements';

export function DrawerContent(props) {
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View>
                        <View style={{ marginTop: 15, alignContent: 'center', justifyContent: 'center', }}>
                            <Image
                                source={require('../assets/images/logo.png')}
                                resizeMode='contain'
                                style={{ marginLeft: 15, width: 250, height: 150 }}
                            />
                        </View>
                    </View>

                    <Drawer.Section style={styles.drawerSection}>

                        <DrawerItem
                            /*icon={({ color, size }) => (
                                <Icon
                                    name="university"
                                    color={color}
                                    size={20}
                                    type='font-awesome'
                                />
                            )}*/
                            label="Didattica"
                            onPress={() => {  }}
                        />
                        <DrawerItem
                           /* icon={({ color, size }) => (
                                <Icon
                                    name="lightbulb-on-outline"
                                    color={color}
                                    size={size}
                                    type='material-community'
                                />
                            )}*/
                            label="Ricerca"
                            onPress={() => {  }}
                        />
                        <DrawerItem
                          /*  icon={({ color, size }) => (
                                <Icon
                                    name='business'
                                    type='material'
                                    color={color}
                                    size={size}

                                />
                            )}*/
                            label="Terza Missione"
                            onPress={() => {  }}
                        />
                        <DrawerItem
                           /* icon={({ color, size }) => (
                                <Icon
                                    name="face-agent"
                                    color={color}
                                    size={size}
                                    type='material-community'
                                />
                            )}*/
                            label="Supporto"
                            onPress={() => {  }}
                        />
                        <DrawerItem
                           /* icon={({ color, size }) => (
                                <Icon
                                    name='map'
                                    type='material'
                                    color={color}
                                    size={size}

                                />
                            )}*/
                            label="Mappa"
                            onPress={() => { props.navigation.navigate('Mappa') }}
                        />
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});
export default DrawerContent;