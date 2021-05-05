import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, TouchableHighlight, Linking } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { List, ListItem, Right, Body } from 'native-base'
import { TouchableOpacity, Share } from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage'
import firestore from '@react-native-firebase/firestore';


export default SideBar = (props) =>{ 
    const dump = {username: 'Guest', avatar: 'https://firebasestorage.googleapis.com/v0/b/landchat-da42a.appspot.com/o/pngwing.com.png?alt=media&token=5244e365-64f7-4aea-9c49-d1079c67969d'}
    const [user, setUser] = useState(dump)
    useEffect(()=>{
        checkAuth()
    })

    const checkAuth = async() => {
        const user = await AsyncStorage.getItem('user')
            if (user != null) {
                let me1 = JSON.parse(user)
                const meData = await firestore()
                    .collection('users')
                    .doc(me1.username).get();
                setUser(meData.data())
            }
        }

    const logout = async () =>{
        AsyncStorage.removeItem('user')
        props.navigator.navigate('Signup',{navigation:props.navigator})
    }

    return(
        <ScrollView style={{ backgroundColor: "#fff" }}>
            <View style={{ padding: 16, paddingTop: 45, backgroundColor: "#007591" }}>
                <Image
                    source={{ uri: user.avatar }}
                    style={styles.profile}
                />
                <Text style={styles.name}>{user.username}</Text>
                <View style={{ flexDirection: 'row' }} >
                    <Text style={styles.uname}>{user.bio != '' ? user.bio : 'No bio added'} </Text>
                    <Icon name='account' size={16} color="rgba(255,255,255,0.8)" />
                </View>
            </View>

            <View style={styles.container}>
                <List>
                    <ListItem>
                        <Body>
                            <TouchableOpacity style={styles.item} onPress={() => props.navigator.navigate('Profile', { navigation: props.navigator, item: user })}>
                                <Icon style={styles.icon} name="account" color='#000' size={20} />
                                <Text style={{ fontFamily: 'Tajawal-Regular', }}> {'حسابي'} </Text>
                            </TouchableOpacity>
                        </Body>
                    </ListItem>

                    {user.status != 'admin' ? null : (
                        <ListItem>
                            <Body>
                                <TouchableOpacity style={styles.item} onPress={() => props.navigator.navigate('Members', { navigation: props.navigator })}>
                                    <Icon style={styles.icon} name="account-multiple" color='#000' size={20} />
                                    <Text style={{ fontFamily: 'Tajawal-Regular', }}> {'الاعضاء'} </Text>
                                </TouchableOpacity>
                            </Body>
                        </ListItem>
                    )}

                    <ListItem>
                        <Body>
                            <TouchableOpacity style={styles.item} onPress={logout}>
                                <Icon style={styles.icon} name="logout" color='#000' size={20} />
                                <Text style={{ fontFamily: 'Tajawal-Regular', }}> {'تسجيل خروج'} </Text>
                            </TouchableOpacity>
                        </Body>
                    </ListItem>
                </List>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e3e3e3'
    },
    icon: {
        marginRight: 5
    },
    profile: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#fff',
    },
    name: {
        fontFamily: 'Tajawal-Regular',
        color: '#fff',
        fontSize: 20,
        fontWeight: '800',
        marginVertical: 8,
        textAlign: 'left'
    },
    uname: {
        fontFamily: 'Tajawal-Regular',
        color: "rgba(255,255,255,0.8)",
        marginLeft: 4
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 10
    }
})