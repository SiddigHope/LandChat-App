import React from 'react';
import { Alert, KeyboardAvoidingView, BackHandler,  StatusBar, Image, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage'

export default class Signup extends React.Component {
    state = {
        username: "",
        password: ""
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {

        if (this.props.navigation.isFocused()) {
            Alert.alert(
                "اغلاق التطبيق",
                "هل تريد اغلاق التطبيق?",
                [
                    {
                        text: "لا",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "نعم", onPress: () => BackHandler.exitApp() }
                ],
                { cancelable: false }
            );
            return true;
        }

        // return true;  // Do nothing when back button is pressed
    }

    signup = async () => {
        if (this.password != '' && this.state.username != '') {
            const user = await firestore()
                .collection('users')
                .doc(this.state.username.toLowerCase()).get();
            if (user._exists) {
                firestore()
                    .collection('users')
                    .doc(this.state.username.toLowerCase()).get()
                    .then((user) => {
                        user = user.data()
                        if (this.state.password == user.password) {
                            AsyncStorage.setItem('user', JSON.stringify({ status:user.status ,username: this.state.username.toLowerCase(), avatar: user.avatar }), (err) => {
                                if (err) {
                                    // console.log("an error");
                                    throw err;
                                }
                                // console.log("success");
                                this.props.navigation.navigate('Home', { navigation: this.props.navigation })
                            }).catch((err) => {
                                console.log("error is: " + err);
                            });
                        } else {
                            Alert.alert('كلمة مرور خاطئة!');
                        }
                    });
            } else {
                Alert.alert('اسم المستخدم غير موجود!');
            }
        } else {
            Alert.alert('خطأ, اعد المحاولة مرة اخرى!')
        }
    }
    render() {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <View style={styles.container}>
                    <StatusBar backgroundColor="#007591" />
                    <View style={{ backgroundColor: '#007591', width: '100%', height: '30%', elevation: 10, paddingTop: '15%', paddingLeft: '15%' }}>
                        <Text style={{ color: '#fff', fontSize: 60, marginBottom: 10, fontFamily: 'Tajawal-Regular' }}> {'الدخول'} </Text>
                        <Text style={styles.signText}> {'سجل دخولك عن طريق اسم المستخدم وكلمة المرور الخاصة بك.'} </Text>
                    </View>
                    <View style={{ justifyContent: "center", alignItems: "center", marginTop: '30%' }}>
                        <View style={styles.inputView} >
                            <TextInput
                                textAlign='right'
                                style={styles.inputText}
                                placeholder="اسم المستخدم"
                                placeholderTextColor="#FFF"
                                onChangeText={text => this.setState({ username: text })} />
                        </View>
                        <View style={styles.inputView} >
                            <TextInput
                                textAlign='right'
                                secureTextEntry
                                style={styles.inputText}
                                placeholder="كلمة المرور"
                                placeholderTextColor="#FFF"
                                onChangeText={text => this.setState({ password: text })} />
                        </View>
                        <TouchableOpacity style={styles.loginBtn} onPress={this.signup}>
                            <Text style={styles.loginText}> {'تسجيل دخول'} </Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={{ marginBottom: 6 }}>
                            <Text style={styles.forgot}>Forgot Password?</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('Signin', {navigation: this.props.navigation}) }}>
                            <Text style={[styles.signText, { color: '#007591' }]}> {'ليس لديك حساب ؟'} </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    logo: {
        marginBottom: 10
    },
    inputView: {
        width: "80%",
        backgroundColor: "#64b5f6",
        borderRadius: 25,
        height: 50,
        marginBottom: 10,
        justifyContent: "center",
        padding: 20
    },
    inputText: {
        fontFamily: 'Tajawal-Regular',
        height: 50,
        color: "white",
        // fontSize: 18
    },
    forgot: {
        color: "#fb5b5a",
        fontSize: 12
    },
    loginBtn: {
        width: "80%",
        backgroundColor: "#007591",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 10,
        elevation: 5
    },
    loginText: {
        color: "white",
        fontFamily: 'Tajawal-Regular',
        fontSize: 15
    },
    signText: {
        fontFamily: 'Tajawal-Regular',
        color: "#e3e3e3",
        fontSize: 13,
        marginHorizontal: 10
    }
});