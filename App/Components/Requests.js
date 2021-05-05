import React, { Component } from 'react'
import { Dimensions, FlatList, Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Container, Body, Header, Left, Right, TabHeading, Drawer, Tab, Tabs } from 'native-base';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

export default class Requests extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: [],
            page: 1,
            seed: 1,
            error: null,
            refreshing: false,
            search: false,
            user: ''
        };
    }

    componentDidMount() {
        this.getUser()
        this.makeRemoteRequest();
    }

    getUser = async() =>{
        const me = await AsyncStorage.getItem('user')

        if (me != null) {
            let me1 = JSON.parse(me)
            const meData = await firestore()
                .collection('users')
                .doc(me1.username).get();
            this.setState({
                user: meData.data()
            })
        }
    }
    onResult = (QuerySnapshot) => {
        const data = QuerySnapshot.docs.map(doc => doc.data())
        console.log(data)
        this.setState({
            data: data,
            error: QuerySnapshot.error || null,
            loading: false,
            refreshing: false
        });
    }

    onError = (error) => {
        console.error(error);
    }

    makeRemoteRequest = async() => {
        const me = await AsyncStorage.getItem('user')
        let me1 = ''
        if (me != null) {
            me1 = JSON.parse(me)
        }
        const { page, seed } = this.state;
        const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
        this.setState({ loading: true });
        firestore()
            .collection('users').doc(me1.username).collection('requests')
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

    accept = (item) => {
        firestore()
        .collection('users').doc(this.state.user.username).collection('friends').doc(item.username).set({
            username: item.username,
            avatar: item.avatar,
            bio: item.bio,
        }).then(() => {
            firestore()
                .collection('users').doc(this.state.user.username).collection('requests').doc(item.username).delete()
                .then(() => {
                    console.log('deleted')
                })
        })
    }
    render() {
        let searchBar = this.state.search ?
            (<View>
                {/* <Text>fff</Text> */}
            </View>) : null
        return (
            <>
                <Header androidStatusBarColor="#007591" style={{ backgroundColor: '#007591' }}>
                    <Left style={{ flex: 1 }}>
                        <Text style={styles.title}>{"Landchat"}</Text>
                    </Left>
                </Header>
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
                                <TouchableOpacity onPress={() => this.accept(item)} style={{ marginRight: 10 }}>
                                    <Icon name='account-check' color='#42a5f5' size={25} />
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>
            </>
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
        fontFamily: 'Tajawal-Regular',
        textAlign: 'left',
        fontSize: 16,
        color: '#333',
        marginBottom: 1
    },
    email: {
        fontFamily: 'Tajawal-Regular',
        fontSize: 12,
        color: '#444',
        maxWidth: width - ((33 * width) / 100),
        maxHeight: 18,
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
    title: {
        fontFamily: 'Tajawal-Regular',
        fontSize: 25,
        color: '#FFF',
        marginLeft: 10,
    },
})