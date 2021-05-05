import React, { Component } from 'react'
import { Dimensions, FlatList, Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Badge, Form, Item, Input, Label } from "native-base"
import _ from 'lodash'
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage'
import moment from 'moment'

const { width, height } = Dimensions.get('window');

export default class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            loading: false,
            data: [],
            page: 1,
            seed: 1,
            query: '',
            error: null,
            refreshing: false,
        };
    }

    // listener = () => {}

    componentDidMount() {
        this.getUser()
        this.makeRemoteRequest();
        const navigation = this.props.navigation
        navigation.addListener('focus', () => {
            this.getUser()
            this.makeRemoteRequest();
            // console.log('is focus')
        })
    }

    componentWillUnmount(){
        const navigation = this.props.navigation
        navigation.removeListener('focus')
    }

    getUser = async () => {
        const user = await AsyncStorage.getItem('user')
        if (user != null) {
            this.setState({
                user: JSON.parse(user)
            })
        }
    }

    async handleSearch(text) {
        const formatedQuery = text
        let string = '[]'
        let filtered = JSON.parse(string)
        const data = _.filter(this.state.completeData, item => {
            const title = item.title
            if (title.includes(formatedQuery)) {
                filtered.push(item)
                return true
            }
            return false
        })
        this.setState({ data, query: text })
    }

    onResult = (QuerySnapshot) => {
        let string = '[]'
        let filtered = JSON.parse(string)
        let users = JSON.parse(string)
        const user = this.state.user
        const allMessages = QuerySnapshot.docs.map(doc => doc.data())
        const data = _.filter(allMessages, async (message) => {
            if (user.username == message.sender || user.username == message.receiver) {
                if (message.sender != user.username && !Object.values(users).includes(message.sender)) {
                    users.push(message.sender)
                    filtered.push(message)
                }
                if (message.receiver != user.username && !Object.values(users).includes(message.receiver)) {
                    users.push(message.receiver)
                    filtered.push(message)
                }
                return true
            }
            return false
        })

        this.setState({ data: filtered })
    }

    onError = (error) => {
        console.error(error);
    }

    makeRemoteRequest = () => {
        firestore()
            .collection('messages').doc('private').collection('private').orderBy('time', 'desc')
            .onSnapshot(this.onResult, this.onError);
    };

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "86%",
                    backgroundColor: "#e3e3e3",
                    marginLeft: "14%"
                }}
            />
        );
    };

    render() {
        const empty = this.state.data == '' ? 'لا توجد رسائل بعد !' : ''
        // console.log(empty)
        return (
            <View style={styles.container}>
                {empty != '' ? (
                    <View style={styles.infoContainer}>
                        {/* <Text style={styles.username}>{empty}</Text> */}
                        <Text style={styles.email}>{empty}</Text>
                    </View>
                ) : null}
                <FlatList
                    data={this.state.data}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={this.renderSeparator}
                    // ListHeaderComponent={this.renderHeader}
                    renderItem={({ item, index }) => {
                        const check = firestore()
                            .collection('users')
                            .doc(item.receiver != this.state.user.username ? item.receiver : item.sender).get();
                        if(check.exists){
                            return null
                        }
                        return(
                        <TouchableOpacity style={styles.contacts} onPress={() => this.props.navigation.navigate('Private', { item: item, navigation: this.props.navigation })}>
                            <View style={styles.avatarContainer}>
                                <Image source={{ uri: item.avatar != null ? item.avatar : 'https://firebasestorage.googleapis.com/v0/b/landchat-da42a.appspot.com/o/pngwing.com.png?alt=media&token=5244e365-64f7-4aea-9c49-d1079c67969d' }} style={styles.avatar} />
                            </View>
                            <View style={styles.infoContainer}>
                                <Text style={styles.username}>{item.receiver != this.state.user.username ? item.receiver : item.sender}</Text>
                                <Text style={styles.email}>{item.message}</Text>
                            </View>
                            <View style={{ flex: 1, marginRight: 10, alignItems: 'flex-end' }}>
                                <Text style={{ color: '#4444', fontSize: 10 }}> {moment(item.time).format('LT')} </Text>
                            </View>
                        </TouchableOpacity>
                    )}}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    contacts: {
        flexDirection: 'row',
        width: width - ((5 * width) / 100),
        marginVertical: 5
    },
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 25
    },
    username: {
        textAlign: 'left',
        fontSize: 16,
        color: '#000',
        marginBottom: 1,
        fontWeight: '500',
        fontFamily: 'Tajawal-Regular',
    },
    email: {
        textAlign: 'left',
        fontSize: 14,
        fontFamily: 'Tajawal-Regular',
        // backgroundColor: 'red',
        maxHeight: 19,
        color: '#444'
    },
    avatarContainer: {
        marginRight: 10
    }
})