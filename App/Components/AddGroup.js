import React from 'react';
import { Alert, KeyboardAvoidingView, BackHandler, StatusBar, Image, StyleSheet, Text, View, TextInput, TouchableOpacity, Platform } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage'
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

export default class AddGroup extends React.Component {
    state = {
        GroupName: "",
        defaultImage: 'https://firebasestorage.googleapis.com/v0/b/landchat-da42a.appspot.com/o/pngwing.com.png?alt=media&token=5244e365-64f7-4aea-9c49-d1079c67969d',
        avatar: '',
        user: '',
        image: '',
    }

    selectImage = () => {
        const options = {
            maxWidth: 2000,
            maxHeight: 2000,
        };
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                Alert.alert('cancelled image');
            } else if (response.error) {
                Alert.alert('Image Error: ', response.error);
            } else if (response.customButton) {
                Alert.alert('Tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };
                this.setState({
                    image: source,
                });
            }
        });
    };

    uploadImage = async () => {
        // console.log('image upload')
        const { uri } = this.state.image;
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        const task = storage()
            .ref('groups/avatar/' + filename)
            .putFile(uploadUri);
        // set progress state
        task.on('state_changed', snapshot => {
            // setTransferred(
            //     Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
            // );
        })
        try {
            await task;
        } catch (e) {
            console.error(e);
        }

        const url = await storage().ref('groups/avatar/' + filename).getDownloadURL()
        firestore()
            .collection('groups')
            .doc(this.state.GroupName.toLowerCase()).set({
                name: this.state.GroupName.toLowerCase(),
                type: 'public',
                avatar: url
            })
            .then(() => {
                console.log('User edited!');
                this.props.navigation.navigate('Home', { navigation: this.props.navigation })
            });
    };

    addGroup = async () => {
        if (this.state.image != '' && this.state.GroupName != '') {
            this.uploadImage()
        } else {
            if(this.state.GroupName != ''){
                firestore()
                    .collection('groups')
                    .doc(this.state.GroupName.toLowerCase()).set({
                        name: this.state.GroupName.toLowerCase(),
                        type: 'public',
                        avatar: this.state.defaultImage
                    })
                    .then(() => {
                        console.log('User edited!');
                        this.props.navigation.navigate('Home', { navigation: this.props.navigation })
                    });
            }
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
                    <View style={{ backgroundColor: '#007591', width: '100%', height: '20%', elevation: 10, paddingTop: '15%', paddingLeft: '15%' }}>
                        <Text style={{ color: '#fff', fontSize: 40, marginBottom: 10, fontFamily: 'Tajawal-Regular' }}>Admin</Text>
                        {/* <Text style={styles.signText}>Login with your: GroupName, password</Text> */}
                    </View>
                    <View style={{ justifyContent: "center", alignItems: "center", marginTop: '30%' }}>
                        <View style={styles.inputView} >
                            <TextInput
                                style={styles.inputText}
                                placeholder="اسم المجموعة"
                                placeholderTextColor="#FFF"
                                onChangeText={text => this.setState({ GroupName: text })} />
                        </View>
                        <View style={styles.ImageInputView} >
                            <View style={styles.imageView}>
                                <Image source={{ uri: this.state.image != '' ? this.state.image.uri : '' }} style={styles.avatar} />

                                <TouchableOpacity onPress={() => this.selectImage()}>
                                    <Text style={{ fontFamily: 'Tajawal-Regular', fontSize: 18, color: '#e3e3e3' }}> {'صورة للمجموعة'} </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.loginBtn} onPress={() => this.addGroup()}>
                            <Text style={styles.loginText}> {'اضافة المجموعة'} </Text>
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
        height: 50,
        fontFamily: 'Tajawal-Regular',
        color: "white",
        // fontSize: 18
    },
    forgot: {
        color: "#fb5b5a",
        fontSize: 12,
        fontFamily: 'Tajawal-Regular',
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
        fontSize: 15,
        fontFamily: 'Tajawal-Regular',
    },
    signText: {
        color: "#e3e3e3",
        fontSize: 13,
        fontFamily: 'Tajawal-Regular',
    },
    avatar: {
        height: 80,
        width: 80,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: '#FFF'
    },
    ImageInputView: {
        width: "80%",
        backgroundColor: "#64b5f6",
        borderRadius: 25,
        marginBottom: 10,
        justifyContent: "center",
        padding: 10
    },
    imageView: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: "center"
    }
});