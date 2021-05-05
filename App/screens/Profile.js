import React, { Component } from 'react'
import { Text, Image, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage'
import firestore from '@react-native-firebase/firestore';
import _ from 'lodash'

export default class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            requested: false,
            user: '',
            me: '',
            short: 'where the best programmes from across the Dubai Future Foundation’s many initiatives are offered under a common umbrella'
        }
    }

    componentDidMount() {
        this.getUser()
        // this.checkRequests()
    }

    onResult = (QuerySnapshot) => {
        console.log(this.state.me)
        const allRequests = QuerySnapshot.docs.map(doc => doc.data())
        const data = _.filter(allRequests, item => {
            if (item.username == this.state.me.username) {
                this.setState({
                    requested: true
                })
                return true
            }
            return false
        })
    }

    onError = (error) => {
        console.error(error);
    }

    addFriend = () => {
        firestore()
            .collection('users')
            .doc(this.state.user.username).collection('requests').doc(this.state.me.username).set({
                username: this.state.me.username,
                avatar: this.state.me.avatar,
                bio: this.state.me.bio ? this.state.me.bio : '',
            }).then((resp) => {
                console.log(resp)
            })
    }

    getUser = async () => {
        const me = await AsyncStorage.getItem('user')

        if (me != null) {
            let me1 = JSON.parse(me)
            const meData = await firestore()
                .collection('users')
                .doc(me1.username).get();
            this.setState({
                me: meData.data()
            })
        }

        const user = this.props.route.params.item
        if (user != null) {
            const receiver = await firestore()
                .collection('users')
                .doc(this.props.route.params.group != null ? user.sender : user.username).get();
            this.setState({
                user: receiver.data()
            })
            firestore()
                .collection('users').doc(this.state.user.username).collection('requests')
                .onSnapshot(this.onResult, this.onError);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.half, { elevation: 10, backgroundColor: '#bdbdbd' }]}>
                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: this.state.user.avatar }} style={styles.avatar} />
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.username}>{this.state.user.username}</Text>
                        <View style={styles.iconContainer}>
                            {this.state.user.username == this.state.me.username ? (
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('EditProfile', { user: this.state.user })} style={styles.icon}>
                                    <Text style={styles.btnText}> {'تعديل الحساب'} </Text>
                                    <Icon name='account-edit' size={20} color='#e3e3e3' />
                                </TouchableOpacity>
                            ) : (
                                    <>
                                        {this.state.requested ? (
                                            <View style={styles.icon}>
                                                <Text style={styles.btnText}> {'ارسلت طلب'} </Text>
                                                <Icon name='account-check' size={20} color='#e3e3e3' />
                                            </View>
                                        ) :
                                            (
                                                <TouchableOpacity onPress={() => this.addFriend()} style={styles.icon}>
                                                    <Text style={styles.btnText}> {'اضافة صديق'} </Text>
                                                    <Icon name='account-plus' size={20} color='#e3e3e3' />
                                                </TouchableOpacity>
                                            )}

                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Private', { item: this.state.user, navigation: this.props.navigation, page: 'profile' })} style={[styles.icon, { backgroundColor: '#81c784' }]}>
                                            <Text style={styles.btnText}> {'مراسلة'} </Text>
                                            <Icon name='message-outline' size={20} color='#e3e3e3' />
                                        </TouchableOpacity>
                                    </>
                                )}
                        </View>
                    </View>
                </View>
                <View style={[{ backgroundColor: '#bdbdbd', flex: 1, padding: 10 }]}>
                    <View style={styles.slice}>
                        <Text style={styles.title}>
                            {'الحالة'}
                        </Text>
                        <View style={{ height: 1, backgroundColor: '#e3e3e0', elevation: 1 }}></View>
                        <Text style={styles.content}>
                            {this.state.user.bio}
                        </Text>
                    </View>
                    {/* <View style={styles.slice}>
                        <Text style={styles.title}>
                            {'Gender'}
                        </Text>
                        <View style={{ height: 1, backgroundColor: '#e3e3e0', elevation: 1 }}></View>
                        <Text style={styles.content}>
                            {'Male'}
                        </Text>
                    </View> */}
                    <View style={styles.slice}>
                        <Text style={styles.title}>
                            {'العمر'}
                        </Text>
                        <View style={{ height: 1, backgroundColor: '#e3e3e0', elevation: 1 }}></View>
                        <Text style={styles.content}>
                            {this.state.user.age}
                        </Text>
                    </View>
                    <View style={styles.slice}>
                        <Text style={styles.title}>
                            {'الدولة'}
                        </Text>
                        <View style={{ height: 1, backgroundColor: '#e3e3e0', elevation: 1 }}></View>
                        <Text style={styles.content}>
                            {this.state.user.country}
                        </Text>
                    </View>
                    <View style={styles.slice}>
                        <Text style={styles.title}>
                            {'نوع المستخدم'}
                        </Text>
                        <View style={{ height: 1, backgroundColor: '#e3e3e0', elevation: 1 }}></View>
                        <Text style={styles.content}>
                            {this.state.user.status}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    half: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
    },
    avatarContainer: {
        backgroundColor: '#64b5f6',
        height: 200,
        width: 200,
        borderRadius: 100,
        elevation: 10
    },
    avatar: {
        height: 200,
        width: 200,
        borderRadius: 100,
    },
    info: {
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    username: {
        fontSize: 20,
        color: '#FFF',
        fontFamily: 'Tajawal-Regular',
    },
    email: {
        fontSize: 18,
        color: '#e3e3e3',
        fontFamily: 'Tajawal-Regular',
    },
    slice: {
        backgroundColor: '#e0e0e0',
        marginBottom: 10,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        elevation: 5
    },
    title: {
        color: '#444',
        fontFamily: 'Tajawal-Bold',
    },
    content: {
        textAlign: "right",
        color: 'grey',
        fontFamily: 'Tajawal-Regular',
    },
    iconContainer: {
        width: '90%',
        flexDirection: "row",
        justifyContent: 'space-evenly',
        marginTop: 20
    },
    icon: {
        backgroundColor: '#42a5f5',
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row'
    },
    btnText: {
        color: '#444',
        marginRight: 3,
        fontFamily: 'Tajawal-Regular',
    }
});
