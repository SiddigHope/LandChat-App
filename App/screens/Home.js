import React, { Component } from 'react';
import { StatusBar, Alert, View, StyleSheet, BackHandler, Text, Dimensions, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Container, Body, Header, Left, Right, TabHeading, Drawer, Tab, Tabs } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo from '@react-native-community/netinfo'
import SideBar from '../config/SideBar'
import Messages from '../Components/Messages'
import Contacts from '../Components/Contacts'
import Groups from '../Components/Groups'
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage'
import firestore from '@react-native-firebase/firestore';

const { width, height } = Dimensions.get('window');

console.disableYellowBox = true

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: null,
      item: null,
      tab: 1,
      data: [],
      commig : null
    }
  }

  componentDidMount() {
    this.connect()
    // this.checkAuth()
    const navigation = this.props.navigation
    navigation.addListener('focus', () => {
      this.setState(this.state)
    })
    this.checkRequests()
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {

    if (this.props.navigation.isFocused()) {
      Alert.alert(
        "اغلاق التطبيق",
        "هل تريد اغلاق التطبيق?",
        [
          {
            text: "لا",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "نعم", onPress: () => BackHandler.exitApp() }
        ],
        { cancelable: false }
      );
      return true;
    }

    // return true;  // Do nothing when back button is pressed
  }


  closeDrawer() {
    this.drawer._root.close()
  };

  openDrawer() {
    this.drawer._root.open()
  };
  
  async connect() {
    NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        this.setState({
          connected: (
            <SafeAreaView style={{ backgroundColor: 'red' }}>
              <Text style={{ color: '#fff', padding: 10, textAlign: "center", fontFamily: 'Tajawal-Regular', fontSize: Platform.OS == 'android' ? 12 : 16 }}> {'لايوجد اتصال بالانترنت'} </Text>
            </SafeAreaView>
          )
        })
      } else {
        this.setState({ connected: null })
      }
    });
  }
  
  onResult = (QuerySnapshot) => {
    const data = QuerySnapshot.docs.map(doc => doc.data())
    console.log(data)
    this.setState({
      data: data
    });
  }

  onError = (error) => {
    console.error(error);
  }

  checkRequests = async() =>{
    const me = await AsyncStorage.getItem('user')
    let me1 = ''
    if (me != null) {
      me1 = JSON.parse(me)
      firestore()
        .collection('users').doc(me1.username).collection('requests')
        .onSnapshot(this.onResult, this.onError);
    }
  }

  requests = () => {
    this.props.navigation.navigate('Requests', {navigation:this.props.navigation})
  }

container(){
  return(
    <Container style={{ backgroundColor: "#FFF" }}>
      <StatusBar backgroundColor="#007591" />
      <Header style={{ backgroundColor: '#007591'}} androidStatusBarColor="#007591">
        <Left style={{flex:1}}>
          <Text style={styles.title}>{"Landchat"}</Text>  
        </Left>
        <Right style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => this.requests()} style={{ height: '100%', marginRight: 10, marginRight: 5 }}>
            <Icon name='bell' size={28} color='#FFF' />
            {this.state.data != '' ? (
              <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: 'red', position: 'absolute' }}></View>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.openDrawer()} style={{ height: '100%', marginRight: 10}}>
            <Icon name='menu' size={30} color='#FFF'/>
          </TouchableOpacity>
        </Right>
      </Header>
      <Tabs initialPage={this.state.tab} tabBarUnderlineStyle={{ height: 2, backgroundColor: '#fff' }} tabBarPosition="overlayTop">
        <Tab tabStyle={styles.tabStyle} textStyle={styles.text} activeTextStyle={{ fontFamily: 'Tajawal-Bold', color: '#fff' }} activeTabStyle={styles.active} heading='الاصدقاء'>
          <Contacts navigation={this.props.navigation} />
        </Tab>
        <Tab tabStyle={styles.tabStyle} textStyle={styles.text} activeTextStyle={{ fontFamily: 'Tajawal-Bold', color: '#fff' }} activeTabStyle={styles.active} heading='المحادثات'>
          <Messages navigation={this.props.navigation} />
        </Tab>
        <Tab tabStyle={styles.tabStyle} textStyle={styles.text} activeTextStyle={{ fontFamily: 'Tajawal-Bold', color: '#fff' }} activeTabStyle={styles.active} heading='المجموعات' >
          <Groups navigation={this.props.navigation} />
        </Tab>
      </Tabs>
      {this.state.connected}
    </Container>
  )
}
  render() { 
    if(this.state.tab !=this.state.commig){
      // this.goGetTab()
    }
    return (
      <Drawer
        ref={(ref) => { this.drawer = ref; }}
        content={<SideBar navigator={this.props.navigation} username={this.props.username}/>}
        onClose={() => this.closeDrawer()}>
      <View style={styles.container}>
        {this.state.item}
          {this.container()}
        </View>
    </Drawer>
    )
  }
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    // height: height
  },
  title: {
    fontSize: 25,
    color: '#FFF',
    fontFamily: 'Tajawal-Regular',
    marginLeft: 10,
  },
  tabStyle: {
    backgroundColor: '#007591',
  },
  active: {
    fontFamily: 'Tajawal-Regular',
    // backgroundColor: '#8f5ba6', 
    backgroundColor: '#007591',
  },
  text: {
    fontFamily: 'Tajawal-Bold',
    color: '#fff',
    backgroundColor:'#007591',
  },
  imgBack: {
    height: 30,
    width: 30,
    borderRadius: 25,
    marginHorizontal: 5
  },
  iconBack: {
    height: 30,
    width: 30,
    borderRadius: 25,
    marginLeft: 5,
    justifyContent: "center",
    alignItems:"center"
  },
  img: {
    height: 30,
    width: 30,
    borderRadius: 25,
  },
  dataContainer: {
    paddingHorizontal: 10,
    width: width - 160,
    // backgroundColor: 'red',
    justifyContent: "center"
  },
});
