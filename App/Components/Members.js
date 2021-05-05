import React, { Component } from 'react'
import { TextInput, Alert, Dimensions, FlatList, Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { List, ListItem, SearchBar } from "react-native-elements"
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import _ from 'lodash'

const { width, height } = Dimensions.get('window');

export default class Members extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: [],
            completeData: [],
            page: 1,
            seed: 1,
            error: null,
            refreshing: false,
            search: false
        };
    }

    componentDidMount() {
        this.makeRemoteRequest();
    }

    async handleSearch(text) {
        const formatedQuery = text
        let string = '[]'
        let filtered = JSON.parse(string)
        const data = _.filter(this.state.completeData, item => {
            const username = item.username
            if (username.includes(formatedQuery)) {
                filtered.push(item)
                return true
            }
            return false
        })
        this.setState({ data, query: text })
    }

    makeRemoteRequest = async () => {
        const me = await AsyncStorage.getItem('user')
        let me1 = ''
        if (me != null) {
            me1 = JSON.parse(me)
        }
        // const { page, seed } = this.state;
        // const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
        this.setState({ loading: true });
        firestore()
            .collection('users').get()
            .then(res => {
                const data = res.docs.map(doc => doc.data())
                this.setState({
                    data: data,
                    completeData: data,
                    error: res.error || null,
                    loading: false,
                    refreshing: false
                });
            })
            .catch(error => {
                this.setState({ error, loading: false });
            });
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
            .collection('users')
            .doc(item.username).delete()
            .then(() => {
                console.log('User edited!');
                this.makeRemoteRequest()
            });
    }

    delete = (item) => {
        Alert.alert(
            "تأكيد",
            "هل تريد حذف هذا المستخدم?",
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
        this.setState({
            search: true
        })
        console.log('pressed......')
    }
    render() {
        let searchBar = this.state.search ?
            (<View style={{borderWidth: 1, borderColor: '#e3e3e3', width: '95%', borderRadius: 30, paddingHorizontal: 20, marginTop: 5}}>
                <TextInput
                    style={styles.inputText}
                    placeholder="ابحث..."
                    placeholderTextColor="#444"
                    onChangeText={(text) => this.handleSearch(text.toLowerCase())}
                />
            </View>) : null

        let searchBtn = this.state.search ? null : (
            <TouchableOpacity onPress={() => this.searchPress()} style={styles.btnsearch}>
                <Icon name='account-search' color='#e3e3e3' size={25} />
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
                    renderItem={({ item }) => (
                        <View style={styles.contacts}>
                            <TouchableOpacity style={{ flexDirection: 'row', }} onPress={() => this.props.navigation.navigate('Profile', { item: item, navigation: this.props.navigation })}>
                                <View style={styles.avatarContainer}>
                                    <Image source={{ uri: item.avatar ? item.avatar : 'https://firebasestorage.googleapis.com/v0/b/landchat-da42a.appspot.com/o/pngwing.com.png?alt=media&token=5244e365-64f7-4aea-9c49-d1079c67969d' }} style={styles.avatar} />
                                </View>
                                <View style={styles.infoContainer}>
                                    <Text style={styles.username}>{item.username ? item.username : 'username'} </Text>
                                    <Text style={styles.email}> {item.bio ? item.bio : 'Adding a bio helps people know you better!.'}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.delete(item)} style={{ marginRight: 10 }}>
                                <Icon name='delete-circle' size={40} color='red' />
                            </TouchableOpacity>
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
        alignItems: "center",
        backgroundColor: '#FFF'
    },
    contacts: {
        flexDirection: 'row',
        width: width - ((5 * width) / 100),
        marginVertical: 5,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 25
    },
    username: {
        textAlign: 'left',
        fontSize: 16,
        color: '#333',
        marginBottom: 1,
        fontFamily: 'Tajawal-Regular',
    },
    email: {
        fontSize: 12,
        color: '#444',
        maxWidth: width - ((33 * width) / 100),
        maxHeight: 18,
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
    },
    inputText: {
        height: 50,
        color: "#444",
        // fontSize: 18
        fontFamily: 'Tajawal-Regular',
    },
})