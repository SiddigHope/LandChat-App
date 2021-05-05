import React, { Component } from 'react'
import { Alert, Dimensions, FlatList, Image, TextInput, TouchableOpacity, Text, StyleSheet, View, Keyboard } from 'react-native'
import { Container, Body, Header, Left, Right, TabHeading, Drawer, Tab, Tabs, Row } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage'
import firestore from '@react-native-firebase/firestore';
import _ from 'lodash'
import moment from 'moment'
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import ImageModal from 'react-native-image-modal';

const { width, height } = Dimensions.get('window');

export default class PrivateMessages extends Component {
    constructor(props) {
        super(props)
        this.state = {
            api: 'https://firebasestorage.googleapis.com',
            user: '',
            message: '',
            data: [],
            receiver: '',
            image: '',
            filename: '',
            imageUrl: '',
        }
    }


    componentDidMount() {
        this.getUsers()
        this.getMessages();
        // console.log(this.props.route.params.item.sender)
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
                const filename = response.fileName
                console.log(source);
                this.setState({
                    image: source,
                    filename: filename,
                    message: filename
                });
            }
        });
    };

    uploadImage = async () => {
        const { uri } = this.state.image;
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        const task = storage()
            .ref('images/chats/'+filename)
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
        this.setState({
            image: '',
            imageUrl: url
        })
        this.sendMessage()
    };

    onResult = (QuerySnapshot) => {
        let string = '[]'
        let filtered = JSON.parse(string)
        const user = this.state.user
        const receiver = this.props.route.params.item.receiver != user.username ? this.props.route.params.item.receiver : this.props.route.params.item.sender
        const allMessages = QuerySnapshot.docs.map(doc => doc.data())
        const data = _.filter(allMessages, message => {
            if ((user.username == message.sender || user.username == message.receiver)) {
                if ((receiver == message.sender || receiver == message.receiver)) {
                    filtered.push(message)
                    return true
                }
            }
            return false
        })
        this.setState({ data: filtered })
    }

    onError = (error) => {
        console.error(error);
    }

    getMessages = () => {
        firestore()
            .collection('messages').doc('private').collection('private').orderBy('time', 'desc')
            .onSnapshot(this.onResult, this.onError);
    };

    getUsers = async () => {
        const user = await AsyncStorage.getItem('user')
        if (user != null) {
            const user1 = JSON.parse(user)
            this.setState({
                user: user1
            })
            if(this.props.route.params.page){
                const receiver = await firestore()
                    .collection('users')
                    .doc(this.props.route.params.item.username).get();
                this.setState({
                    receiver: receiver.data()
                })
            }else{
                const receiver = await firestore()
                    .collection('users')
                    .doc(this.props.route.params.item.receiver != user1.username ? this.props.route.params.item.receiver : this.props.route.params.item.sender).get();
                if(receiver.exists){
                    this.setState({
                        receiver: receiver.data()
                    })
                }else{
                    this.setState({
                        receiver: {
                            username: 'deleted user',
                            avatar: ''
                        }
                    })
                }
            }
        }
    }

    sendMessage() {
        if (this.state.message != '') {
            const user = this.state.user
            const receiver = this.state.receiver
            const message = this.state.message
            this.setState({
                message: ''
            })
            Keyboard.dismiss()
            firestore()
                .collection('messages')
                .doc('private').collection('private').doc().set({
                    sender: user.username,
                    receiver: receiver.username,
                    avatar: receiver.avatar,
                    message: this.state.imageUrl != '' ? this.state.imageUrl : message,
                    time: Date.now()
                })
        }
    }

    render() {
        const user = this.state.receiver
        return (
            <View style={styles.container}>
                <Header style={{ backgroundColor: '#007591' }} androidStatusBarColor="#007591">
                    <Left style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', height: '100%', alignItems: "center", marginLeft: 10 }}>
                            <Image source={{ uri: user.avatar }} style={styles.avatar} />
                            <Text style={styles.headername}>{user.username}</Text>
                        </View>
                    </Left>
                    <Right>
                        {/* <TouchableOpacity style={{ height: '100%', marginRight: 10 }}>
                            <Icon name='dots-vertical' size={25} color='#FFF' />
                        </TouchableOpacity> */}
                    </Right>
                </Header>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            inverted
                            data={this.state.data}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => {
                                if (item.sender == this.state.user.username) {
                                    return (
                                        <View style={[styles.messageRight]}>
                                            <View style={styles.infoContainer}>
                                                {item.message.includes(this.state.api)?(
                                                    <ImageModal
                                                        resizeMode="contain"
                                                        imageBackgroundColor="#FFF"
                                                        borderRadius={10}
                                                        source={{uri: item.message}}
                                                        style={styles.imageMessage}/>
                                                ):
                                                (
                                                    <Text style = {styles.username}>{`${item.message}`}</Text>
                                                )}
                                                <View style={{ height: 1, backgroundColor: '#e3e3e0', elevation: 1 }}></View>
                                                <Text style={styles.time}>{moment(item.time).fromNow()}</Text>
                                            </View>
                                        </View>
                                    )
                                } else {
                                    return (
                                        <View style={[styles.messageLeft]}>
                                            <View style={styles.infoContainer}>
                                                {item.message.includes(this.state.api) ? (
                                                    <ImageModal
                                                        resizeMode="contain"
                                                        imageBackgroundColor="#FFF"
                                                        borderRadius={10}
                                                        source={{ uri: item.message }}
                                                        style={styles.imageMessage} />
                                                ) :
                                                    (
                                                        <Text style={styles.username}>{`${item.message}`}</Text>
                                                    )}
                                                <View style={{ height: 1, backgroundColor: '#e3e3e0', elevation: 1 }}></View>
                                                <Text style={styles.time}>{moment(item.time).fromNow()}</Text>
                                            </View>
                                        </View>
                                    )
                                }
                            }}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <View style={styles.messageRow}>
                            <TextInput
                                multiline
                                style={styles.inputText}
                                placeholder="اكتب رسالة..."
                                placeholderTextColor="#000"
                                value={this.state.message}
                                multiline
                                onChangeText={text => this.setState({ message: text })}
                            />
                            {this.state.message == '' ? 
                            (<TouchableOpacity onPress={this.selectImage} style={{ marginRight: 10 }}>
                                <Icon name='image' size={30} color='#007591' />
                            </TouchableOpacity>)
                            : null}
                        </View>
                        <TouchableOpacity onPress={() => this.state.image != '' ? this.uploadImage() : this.sendMessage()} style={styles.iconContainer}>
                            <Icon name='send' size={20} color='#FFF' />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#bdbdbd',
    },
    headername: {
        fontFamily: 'Tajawal-Regular',
        color: '#e3e3e3',
        fontSize: 18,
        marginLeft: 10,
        textAlign: 'left'
    },
    avatar: {
        height: 40,
        width: 40,
        borderRadius: 20
    },
    inputContainer: {
        width: '100%',
        padding: 5,
        flexDirection: 'row',
    },
    inputText: {
        fontFamily: 'Tajawal-Regular',
        flex:1,
        backgroundColor: '#FFF',
        borderRadius: 30,
        paddingHorizontal: 20,
        // width: '83%',
        color: '#000',
        fontSize: 18
    },
    iconContainer: {
        backgroundColor: '#007591',
        width: '15%',
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 40,
        height: 50,
        marginHorizontal: 3,
    },
    messageLeft: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginVertical: 5,
        marginHorizontal: 20,
        backgroundColor: '#FFF',
        borderRadius: 20,
        alignSelf: 'flex-start'
    },
    messageRight: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginVertical: 5,
        marginHorizontal: 20,
        backgroundColor: '#FFF',
        borderRadius: 20,
        alignSelf: 'flex-end'
    },
    username: {
        fontFamily: 'Tajawal-Regular',
        textAlign: 'left',
        fontSize: 16,
        color: '#757575',
        maxWidth: width - (width * 45) / 100,
        marginBottom: 3,
    },
    time: {
        fontFamily: 'Tajawal-Regular',
        textAlign: 'left',
        fontSize: 10,
        maxHeight: 20,
        color: '#4444'
    },
    messageRow:{
        flexDirection: 'row',
        backgroundColor: '#FFF',
        width: '83%',
        height: 50,
        padding: 5,
        // backgroundColor: 'red',
        borderRadius: 30,
        alignItems: 'center'
    },
    imageMessage:{
        height: width - (width * 45) / 100,
        width: width - (width * 45) / 100,
        borderRadius: 10,
    }
})
