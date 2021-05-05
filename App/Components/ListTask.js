import React, { PureComponent, Component } from 'react';
import {
    Dimensions,
    FlatList,
    View,
    Text,
    StatusBar,
    StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

// import CacheImage from './../config/CacheImages'
const Screen = Dimensions.get('window');
const { width, height } = Dimensions.get('window');

class CategoriesDetails extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            source: '',
            dataSource: ['الدرس الاول', 'الدرس الثاني', 'الدرس الثالث', 'الدرس الرابع', 'الدرس الخامس', 'الدرس السادس'],
            data: null,
            isLoading: false,
        }
    }

    componentDidMount() {
    }

    render() {
        // console.log(this.state.data)
        let data = this.state.dataSource

        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="red" />
                <View
                    style={[styles.backgroundImage]}
                >
                    {/* <LinearGradient colors={['#192f6a', '#3b5998', '#4c669f']} style={styles.linearGradient}>
                        
                    </LinearGradient> */}
                </View>
                <FlatList
                    data={data}
                    renderItem={(item, index) => this.renderRow(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                    // ListEmptyComponent={() => this.renderEmpty()}
                    ListHeaderComponent={(item) => this.renderHeader()}
                // renderScrollComponent={(item) => this.renderScroll(item)}
                />
            </View>
        );
    }

    renderRow(item, index) {
        // console.log(item)
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', paddingHorizontal: 20, alignItems: "center", height: 70, elevation: 2, backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 20, marginBottom: 10 }}>
                {item.index != 0 ? <Icon name='lock' size={20} color='#444' /> : <View><Text>       </Text></View>}
                <Text style={{ fontSize: 16, fontWeight: 'bold',color:'red' }}>{item.item}</Text>
                <Text style={{ padding: 10, backgroundColor: '#e8f4F2', borderRadius: 10, fontSize: 16, fontWeight: 'bold' }}>{item.index + 1}</Text>
            </View>
        );
    }
    renderHeader() {
        return (
            <View style={{ marginTop: 25, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: "center", height: 100, elevation: 5, backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 20, marginBottom: 10 }}>
                <Icon name='information' size={20} color='#444' />
                <Text style={{ fontSize: 16, fontWeight: 'bold', color:'red' }}>{'التحية . 1'}</Text>
                <Icon1 name='arrow-forward-ios' size={20} color='#444' />
            </View>
        )
    }
}

export default CategoriesDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    },
    // Later on in your styles..
        linearGradient: {
            flex: 1,
            paddingLeft: 15,
            paddingRight: 15,
            borderRadius: 5
        },
        buttonText: {
            fontSize: 18,
            fontFamily: 'Gill Sans',
            textAlign: 'center',
            margin: 10,
            color: '#ffffff',
            backgroundColor: 'transparent',
        },
    backgroundImage: {
        backgroundColor: 'red',
        width: Screen.width,
        // elevation: 10,
        height: Screen.width / 750 * 150,
        position: 'absolute',
    },
    img: {
        height: '100%',
        width: '100%',
        // alignItems: "center",
        justifyContent: "flex-end",
    },

    title: {
        margin: 10,
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
        marginHorizontal: 40
        // alignSelf: 'center',
    },
    playContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 50,
        flexDirection: 'row',
        paddingTop: 10,
    },
    text: {
        fontSize: 24,
        marginRight: 20,
        color: '#000',
    },
    btn: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: '#ff5b77',
        elevation: 10,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text2: {
        fontSize: 18,
        color: '#333333',
        margin: 10,
        fontWeight: 'bold',
    },
    header: {
        height: Screen.width / 1000 * 900,
        marginBottom: 10
    },
    card: {
        width: '90%',
        backgroundColor: '#FFF',
        height: 70,
        marginBottom: 5,
        borderRadius: 15,
        elevation: 5,
        alignSelf: 'center',
        shadowColor: '#606060',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 2,
        shadowOpacity: 0.5
    },
    cardTitle: {
        color: 'black',
        fontSize: 30
    },
    songContainer: {
        width: width,
        height: 70,
    },
    img: {
        height: 70,
        width: 70,
        borderRadius: 5,
    },
    dataContainer: {
        paddingLeft: 10,
        width: width - 100,
    },
    dataContainer1: {
        paddingLeft: 10,
        width: width - 160,
    },
    songtitle: {
        fontFamily: 'Tajawal-Regular',
        fontSize: 15,
        color: '#444',
        marginTop: 5
    },
    subTitle: {
        fontFamily: 'Tajawal-Regular',
        fontSize: 16,
        color: '#4444',
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modal: {
        height: '55%',
        width: '100%',
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopWidth: 1,
        borderTopColor: '#e5e5e5',
    },
    modalImg: {
        height: 180,
        width: 180,
    },
    surface: {
        height: 180,
        width: 180,
        alignSelf: 'center',
        position: 'absolute',
        overflow: 'hidden',
        top: -100,
        borderWidth: 1,
        borderColor: '#e3e3e3',
        borderRadius: 90,
        elevation: 15
    },
    modalData: {
        marginTop: "23%",
    },
    option: {
        height: 50,
        alignItems: 'center',
        padding: 10,
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#e5e5e5',
    },
    text: {
        fontFamily: 'Tajawal-Regular',
        marginLeft: 15,
        color: '#000',
        fontSize: 20,
    },
    playerContainer: {
        width: '100%',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: '#5D3F6A',
        elevation: 10,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBack: {
        marginHorizontal: 5,
        height: 20,
        width: 20,
        borderRadius: 10,
        marginLeft: 5,
        justifyContent: "center",
        alignItems: "center"
    },
});
