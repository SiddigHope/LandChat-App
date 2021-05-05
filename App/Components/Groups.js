import React, { Component } from 'react'
import { Alert, Dimensions, FlatList, Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Badge, Form, Item, Input, Label } from "native-base"
import _ from 'lodash'
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage'
import moment from 'moment'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

export default class Groups extends Component {
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

    componentWillUnmount() {
        const navigation = this.props.navigation
        navigation.removeListener('focus')
    }

    getUser = async () => {
        const user = await AsyncStorage.getItem('user')
        if (user != null) {
            let me1 = JSON.parse(user)
            const meData = await firestore()
                .collection('users')
                .doc(me1.username).get();
            this.setState({
                user: meData.data()
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

    makeRemoteRequest = () => {
        firestore()
            .collection('groups').get()
            .then(res => {
                const data = res.docs.map(doc => doc.data())
                // console.log(data)
                this.setState({
                    data,
                    error: res.error || null,
                    loading: false,
                    refreshing: false
                })
            })
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

    deleted = (item) => {
        firestore()
            .collection('groups')
            .doc(item.name).delete()
            .then(() => {
                console.log('User edited!');
                this.makeRemoteRequest()
            });

    }

    delete = (item) => {
        Alert.alert(
            "تأكيد",
            "هل تريد حذف هذة المجموعة?",
            [
                {
                    text: "لا",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "نعم", onPress: () => this.deleted(item) }
            ],
            { cancelable: false }
        );
        return true;
    }

    searchPress = () => {
        this.props.navigation.navigate('AddGroup', {navigation: this.props.navigation})
    }

    render() {
        let searchBar = this.state.search ?
            (<View>
                <Text>fff</Text>
            </View>) : null

        let searchBtn = this.state.user.status != 'admin' ? null : (
            <TouchableOpacity onPress={() => this.searchPress()} style={styles.btnsearch}>
                <Icon name='account-multiple-plus' color='#e3e3e3' size={25} />
            </TouchableOpacity>
        )
        return (
            <View style={styles.container}>
                {searchBar}
                <FlatList
                    data={this.state.data}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={this.renderSeparator}
                    // ListHeaderComponent={this.renderHeader}
                    renderItem={({ item, index }) => (
                        <View style={{ width: width - ((5 * width) / 100), flexDirection: 'row', alignItems: "center"}}>
                            <TouchableOpacity style={styles.contacts} onPress={() => this.props.navigation.navigate('GroupMessages', { item: item, navigation: this.props.navigation })}>
                                <View style={styles.avatarContainer}>
                                    <Image source={{ uri: item.avatar != null ? item.avatar : 'https://firebasestorage.googleapis.com/v0/b/landchat-da42a.appspot.com/o/pngwing.com.png?alt=media&token=5244e365-64f7-4aea-9c49-d1079c67969d' }} style={styles.avatar} />
                                </View>
                                <View style={styles.infoContainer}>
                                    <Text style={styles.username}>{item.name}</Text>
                                    {/* <Text style={styles.email}>{item.message}</Text> */}
                                </View>
                                <View style={{ flex: 1, marginRight: 10, alignItems: 'flex-end' }}>
                                    <Text style={{ color: '#4444', fontSize: 10 }}> {moment(item.time).format('LT')} </Text>
                                </View>
                            </TouchableOpacity>
                            {this.state.user.status != 'admin'? null : (
                                <TouchableOpacity onPress={() => this.delete(item)} >
                                    <Icon name='delete-circle' size={40} color='red' />
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                />
                {searchBtn}
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
        flex: 1,
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
        // backgroundColor: 'red',
        maxHeight: 20,
        color: '#444',
        fontFamily: 'Tajawal-Regular',
    },
    avatarContainer: {
        marginRight: 10
    },
    btnsearch: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#64b5f6',
        position: 'absolute',
        bottom: 30,
        right: 30,
        elevation: 3,
        justifyContent: "center",
        alignItems: "center"
    }
})