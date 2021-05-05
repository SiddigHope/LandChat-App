import React, { Component } from 'react'
import { BackHandler, KeyboardAvoidingView, Dimensions, FlatList, Image, TextInput, TouchableOpacity, Text, StyleSheet, View, Keyboard } from 'react-native'
import { Container, Body, Header, Left, Right, TabHeading, Drawer, Tab, Tabs } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage'
import firestore from '@react-native-firebase/firestore';
import _ from 'lodash'
import moment from 'moment'
import EmojiBoard from 'react-native-emoji-board'

const { width, height } = Dimensions.get('window');

export default class GroupMessages extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: '',
            message: '',
            data: [],
            group: '',
            show: false,
            autoFocus: false,
            margin: 0
        }
    }

    componentDidMount() {
        this.getUsers()
        this.getMessages()
    }

    onClick = emoji => {
        console.log(emoji);
    };

    onResult = (QuerySnapshot) => {
        let string = '[]'
        let filtered = JSON.parse(string)
        const user = this.state.user
        const group = this.props.route.params.item.group
        const allMessages = QuerySnapshot.docs.map(doc => doc.data())
        this.setState({ data: allMessages })
    }

    onError = (error) => {
        console.error(error);
    }

    getMessages = () => {
        firestore()
            .collection('groups').doc(this.props.route.params.item.name).collection('messages').orderBy('time', 'desc')
            .onSnapshot(this.onResult, this.onError);
    };

    getUsers = async () => {
        const user = await AsyncStorage.getItem('user')
        if (user != null) {
            const user1 = JSON.parse(user)
            this.setState({
                user: user1
            })
        }
    }

    sendMessage = () => {
        if (this.state.message != '') {
            const user = this.state.user
            const group = this.state.group
            firestore()
                .collection('groups')
                .doc(this.props.route.params.item.name)
                .collection('messages')
                .doc().set({
                    sender: user.username,
                    avatar: user.avatar,
                    message: this.state.message,
                    time: Date.now()
                })
                .then(() => {
                    console.log('message sent');
                    this.setState({
                        message: ''
                    })
                    Keyboard.dismiss()
                });
        }
    }

    render() {
        const user = this.state.user
        return (
            <View style={styles.container}>
                <Header style={{ backgroundColor: '#007591' }} androidStatusBarColor="#007591">
                    <Left style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', height: '100%', alignItems: "center", marginLeft: 10 }}>
                            <Image source={{ uri: this.props.route.params.item.avatar != '' ? this.props.route.params.item.avatar: '' }} style={styles.avatar} />
                            <Text style={styles.headername}>{this.props.route.params.item.name}</Text>
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
                                        <View style={[styles.messageRight,{ flexDirection: 'row' }]}>
                                            <View style={styles.infoContainer}>
                                                <Text style={[styles.name]}>{`You`}</Text>
                                                <View style={{ height: 1, backgroundColor: '#e3e3e0', elevation:1 }}></View>
                                                <Text style={[styles.username]}>{`${item.message}`}</Text>
                                                <Text style={styles.time}>{moment(item.time).fromNow()}</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile',{navigation: this.props.navigation, item: item, group: 'true'})}>
                                                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                                            </TouchableOpacity>
                                        </View>
                                    )
                                } else {
                                    return (
                                        <View style={[styles.messageLeft, { flexDirection: 'row' }]}>
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { navigation: this.props.navigation, item: item, group: 'true' })}>
                                                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                                            </TouchableOpacity>
                                            <View style={styles.infoContainer}>
                                                <Text style={[styles.name]}>{`${item.sender}`}</Text>
                                                <View style={{ height: 1, backgroundColor: '#e3e3e0', elevation: 1 }}></View>
                                                <Text style={[styles.username]}>{`${item.message}`}</Text>
                                                <Text style={styles.time}>{moment(item.time).fromNow()}</Text>
                                            </View>
                                        </View>
                                    )
                                }
                            }}
                        />
                    </View>
                    <View style={[styles.inputContainer,{marginBottom: this.state.margin}]}>
                        <TextInput
                            style={styles.inputText}
                            placeholder="اكتب رسالة..."
                            placeholderTextColor="#000"
                            multiline
                            autoFocus={this.state.autoFocus}
                            value={this.state.message}
                            onChangeText={text => this.setState({ message: text })}
                        />
                        <TouchableOpacity onPress={() => this.sendMessage()} style={styles.iconContainer}>
                            <Icon name='send' size={20} color='#FFF' />
                        </TouchableOpacity>
                        {/* <TouchableOpacity onPress={() => {
                            this.setState({ show: !this.state.show, margin: height-(61*height)/100 })
                        }}>
                            <Text>click here</Text>
                        </TouchableOpacity> */}
                    </View>
                </View>
                    <EmojiBoard showBoard={this.state.show} onClick={(item) => this.onClick(item)} />
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
        color: '#e3e3e3',
        fontFamily: 'Tajawal-Regular',
        fontSize: 18,
        marginLeft: 10,
        textAlign: 'left'
    },
    avatar: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginVertical: 5,
    },
    inputContainer: {
        width: '100%',
        padding: 5,
        flexDirection: 'row',
    },
    inputText: {
        backgroundColor: '#FFF',
        borderRadius: 30,
        paddingHorizontal: 20,
        width: '83%',
        color: '#000',
        fontSize: 18,
        fontFamily: 'Tajawal-Regular',
    },
    iconContainer: {
        backgroundColor: '#007591',
        width: '15%',
        maxHeight: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 40,
        marginHorizontal: 3
    },
    messageLeft: {
        marginHorizontal: 10,
        alignSelf: 'flex-start'
    },
    messageRight: {
        alignSelf: 'flex-end',
        marginHorizontal: 10,
    },
    username: {
        textAlign: 'left',
        fontSize: 16,
        color: '#000',
        // backgroundColor:'red',
        maxWidth: width - (width*45)/100,
        marginBottom: 3,
        fontFamily: 'Tajawal-Regular',
    },
    name: {
        textAlign: 'left',
        fontSize: 14,
        color: '#444',
        fontWeight: 'bold',
        marginBottom: 3,
        fontFamily: 'Tajawal-Regular',
    },
    time: {
        textAlign: 'left',
        fontSize: 10,
        maxHeight: 20,
        color: '#4444',
        fontFamily: 'Tajawal-Regular',
    },
    infoContainer:{
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginVertical: 5,
        marginHorizontal: 3,
        backgroundColor: '#FFF',
        borderRadius: 20,
    }
})
