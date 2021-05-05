import React, { Component } from "react";
import { StatusBar, BackHandler, Alert, PermissionsAndroid } from 'react-native';
import { Box, Text } from "react-native-design-utility";
import OnboardingLogo from '../commons/OnboardingLogo';
import app from '@react-native-firebase/app';
import { config } from '../config/Firebase';
import AsyncStorage from '@react-native-community/async-storage'
import notifee from '@notifee/react-native';

class SplashScreen extends Component {
    state = {}

    componentDidMount() {
        this.checkAuth();
        app.initializeApp(config);
        // this.onDisplayNotification()
    }

    async onDisplayNotification() {
    // Create a channel
    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
        title: 'Notification Title',
        body: 'Main body content of the notification',
        android: {
            channelId,
            // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        },
    });
}


    checkAuth = () => {
        setTimeout(async() => {
            const user = await AsyncStorage.getItem('user')
            if(user != null){
                this.props.navigation.navigate('Home', { navigation: this.props.navigation })
            }else{
                this.props.navigation.navigate('Signup', { navigation: this.props.navigation })
            }
        }, 3000)
    }
    render() {
        return (
            <Box style={{ width: '100%' }} bg="#FFF" f={1} center>
                <StatusBar backgroundColor="#FFF" />
                <OnboardingLogo />
            </Box>
        );
    }
}

export default SplashScreen;