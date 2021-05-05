import React from 'react';
import { Alert, StatusBar, Image, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage'

export default class Signin extends React.Component {
    state = {
        username: "",
        rpassword: "",
        password: ""
    }

    componentDidMount() {
        // this.checkAuth()
    }

    signin = async () => {
        // this.props.navigation.navigate('Home', { navigation: this.props.navigation })
        if (this.state.password == this.state.rpassword && this.password !== '' && this.state.username != '') {
            const user = await firestore()
                .collection('users')
                .doc(this.state.username.toLowerCase()).get();
            if (user._exists) {
                Alert.alert('اسم المستخدم موجود .. اختر اخر');
            } else {
                firestore()
                    .collection('users')
                    .doc(this.state.username.toLowerCase()).set({
                        status: 'normal',
                        username: this.state.username.toLowerCase(),
                        password: this.state.password.toLowerCase(),
                        avatar: 'https://firebasestorage.googleapis.com/v0/b/landchat-da42a.appspot.com/o/pngwing.com.png?alt=media&token=5244e365-64f7-4aea-9c49-d1079c67969d'
                    })
                    .then(() => {
                        // console.log('User added!');
                        AsyncStorage.setItem('user', JSON.stringify({ status: 'normal',username: this.state.username.toLowerCase(), avatar: 'https://firebasestorage.googleapis.com/v0/b/landchat-da42a.appspot.com/o/pngwing.com.png?alt=media&token=5244e365-64f7-4aea-9c49-d1079c67969d' }), (err) => {
                            if (err) {
                                // console.log("an error");
                                throw err;
                            }
                            // console.log("success");
                            this.props.navigation.navigate('Home', { navigation: this.props.navigation })
                        }).catch((err) => {
                            console.log("error is: " + err);
                        });
                    });
            }
        } else {
            Alert.alert('خطأ, اعد المحاولة مرة اخرى')
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#007591" />
                <View style={{ backgroundColor: '#007591', width: '100%', height: '30%', elevation: 10, paddingTop: '15%', paddingLeft: '15%' }}>
                    <Text style={{ color: '#fff', fontSize: 60, marginBottom: 10, fontFamily: 'Tajawal-Regular',}}> {'تسجيل'} </Text>
                    <Text style={styles.signText}> {'مرحبا بك في لاند شات'} </Text>
                </View>
                <View style={{ justifyContent: "center", alignItems: "center", marginTop: '20%' }}>
                    <View style={styles.inputView} >
                        <TextInput
                            textAlign= 'right'
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
                    <View style={styles.inputView} >
                        <TextInput
                            textAlign= 'right'
                            secureTextEntry
                            style={styles.inputText}
                            placeholder="تأكيد كلمة المرور"
                            placeholderTextColor="#FFF"
                            onChangeText={text => this.setState({ rpassword: text })} />
                    </View>
                    <TouchableOpacity style={styles.loginBtn} onPress={this.signin}>
                        <Text style={styles.loginText}> {'تسجيل'} </Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        height: 50,
        color: "white",
        fontFamily: 'Tajawal-Regular',   // fontSize: 18
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
        fontFamily: 'Tajawal-Regular',
        color: "white",
        fontSize: 15
    },
    signText: {
        fontFamily: 'Tajawal-Regular',
        marginHorizontal: 10,
        color: "#e3e3e3",
        fontSize: 13
    }
});