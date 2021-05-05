import React from 'react';
import { Alert, StatusBar, Image, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage'
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

export default class EditProfile extends React.Component {
    state = {
        bio: "",
        country: "",
        age: "",
        avatar: '',
        user: '',
        image: '',
    }

    componentDidMount() {
        this.setState({
            user: this.props.route.params.user
        })
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
        const { uri } = this.state.image;
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        const task = storage()
            .ref('images/chats/' + filename)
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

        const url = await storage().ref('images/chats/' + filename).getDownloadURL()
        firestore()
            .collection('users')
            .doc(this.props.route.params.user.username.toLowerCase()).update({
                bio: this.state.bio,
                country: this.state.country,
                age: this.state.age,
                avatar: url
            })
            .then(() => {
                console.log('User edited!');
                this.props.navigation.navigate('Home', { navigation: this.props.navigation })
            });
    };


    edit = async () => {
        if(this.state.image != ''){
            this.uploadImage()
        }else{
            firestore()
                .collection('users')
                .doc(this.props.route.params.user.username.toLowerCase()).update({
                    bio: this.state.bio,
                    country: this.state.country,
                    age: this.state.age
                })
                .then(() => {
                    console.log('User edited!');
                    this.props.navigation.navigate('Home', { navigation: this.props.navigation })
                });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#007591" />
                <View style={{ backgroundColor: '#007591', width: '100%', height: '30%', elevation: 10, paddingTop: '15%', paddingLeft: '15%' }}>
                    <Text style={{ color: '#fff', fontSize: 50, marginBottom: 10 }}> {'تعديل الحساب'} </Text>
                    <Text style={styles.signText}> {'دع اصدقائك يتعرفون عليك'} </Text>
                </View>
                <View style={{ justifyContent: "center", alignItems: "center", marginTop: '20%' }}>
                    <View style={styles.inputView} >
                        <TextInput
                            style={styles.inputText}
                            placeholder="صف حالتك"
                            placeholderTextColor="#FFF"
                            value={this.state.user.bio != null ? this.state.user.bio : ''}
                            onChangeText={text => this.setState({ bio: text })} />
                    </View>
                    <View style={styles.inputView} >
                        <TextInput
                            style={styles.inputText}
                            placeholder="دولتك"
                            placeholderTextColor="#FFF"
                            value={this.state.user.country != null ? this.state.user.country : ''}
                            onChangeText={text => this.setState({ country: text })} />
                    </View>
                    
                    <View style={styles.inputView} >
                        <TextInput
                            keyboardType='number-pad'
                            style={styles.inputText}
                            placeholder="عمرك"
                            value={this.state.user.age != null ? this.state.user.age : ''}
                            placeholderTextColor="#FFF"
                            onChangeText={text => this.setState({ age: text })} />
                    </View>

                    <View style={styles.ImageInputView} >
                        <View style={styles.imageView}>
                            <Image source={{ uri: this.state.image != '' ? this.state.image.uri : this.state.user.avatar}} style={styles.avatar}/>

                            <TouchableOpacity onPress={() => this.selectImage()}>
                                <Text style={{fontSize: 20, color: '#e3e3e3'}}> {'الصورة الشخصية'} </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.loginBtn} onPress={this.edit}>
                        <Text style={styles.loginText}> {'تعديل'} </Text>
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
        fontFamily: 'Tajawal-Regular',
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
    avatar:{
        height: 80,
        width: 80,
        borderRadius: 40
    },
    ImageInputView: {
        width: "80%",
        backgroundColor: "#64b5f6",
        borderRadius: 25,
        marginBottom: 10,
        justifyContent: "center",
        padding: 10
    },
    imageView:{
        flexDirection: 'row',
        justifyContent:'space-evenly',
        alignItems: "center"
    }
});