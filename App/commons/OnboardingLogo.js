import React from "react";
import { Text, StyleSheet, View } from "react-native";
import LottieView from 'lottie-react-native';

const OnboardingLogo = () => (

    <View center style={{ width: '100%', height: '100%', flex: 1, justifyContent: "center", alignItems: "center"}}>
        <View style={{width: '80%', height: '40%'}}>
            <LottieView style={styles.image} source={require('../Assets/34611-chat-bubbles.json')} autoPlay loop />
            <Text style={{fontSize: 20, fontFamily: 'Tajawal-Bold', color: '#007591', alignSelf: "center"}}> {'أهلا وسهلا بكم في لاند شات'} </Text>
        </View>
    </View>

);

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: '100%',
    }
})

export default OnboardingLogo