import React, {Component, Fragment} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {colors} from '../../constants/colors';
import Header from '../../components/helpers/Header';
import {ThemeConsumer} from '../../components/theme/ThemeContextProvider';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const HEIGHT = Dimensions.get('window').height;

export default class ChatDetails extends Component {
  state = {
    visible: false,
    amountCounter: 0,
    chatDetails: '',
  };

  _retrieveData = async () => {
    await AsyncStorage.getItem('token')
      .then(value => {
        return value;
      })
      .then(valueJson => {
        this.setState({
          token: valueJson,
        });
        console.log('Token Data retrieved successfully', this.state.token);
      })
      .catch(error => {
        console.log('There was an error retrieving the data' + error);
      });

    await AsyncStorage.getItem('id')
      .then(value => {
        return value;
      })
      .then(valueJson => {
        this.setState({
          userId: valueJson,
        });
        console.log('Token Data retrieved successfully', this.state.userId);
      })
      .catch(error => {
        console.log('There was an error retrieving the data' + error);
      });
  };

  banUser = () => {
    Alert.alert(
      'Alert',
      'Are you sure you want to Ban this user from sending you direct message?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
  };



  componentDidMount() {
    this._retrieveData();
   
  }

  render() {
    const {state} = this.props.navigation;
    return (
      <ThemeConsumer>
        {value => (
          <ScrollView
            style={[
              styles.container,
              {backgroundColor: value.mode.background},
            ]}>
            <Fragment>
              <Header headerName={state.params.name} />

              <View style={{margin: 12, alignItems: 'center'}}>
                <Image
                  style={{height: 150, width: 150}}
                  source={{uri: state.params.logo}}
                />
              </View>

              <View style={{alignItems: 'center'}}>
                <Text
                  style={[
                    styles.chooseAmount,
                    {fontSize: 25, color: value.mode.text},
                  ]}>
                  {' '}
                  {state.params.name}
                </Text>
              </View>

              <View
                style={{alignItems: 'center', marginVertical: 40, padding: 12}}>
                <Text
                  style={[
                    styles.chooseAmount,
                    {textAlign: 'center', color: value.mode.text},
                  ]}>
                  {' '}
                  {state.params.description}
                </Text>
              </View>

              <View>
                <View
                  style={{backgroundColor: value.mode.footBack, padding: 12}}>
                  <Text style={{color: value.mode.footText}}>
                    List of members
                  </Text>
                </View>

                <View style={{borderBottomWidth: 1, borderBottomColor: 'gray'}}>
                  <Text
                    style={{
                      color: colors.baseBorder,
                      fontWeight: 'bold',
                      fontSize: 16,
                      margin: 6,
                    }}>
                    {state.params.details.members.length} participants
                  </Text>
                </View>
                {state.params.details.members.map(user => {
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('SingleChatPage', {
                          userId: user.user.id,
                          fname: user.user.first_name,
                          lname: user.user.last_name,
                        })
                      }
                      style={{
                        marginTop: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        // justifyContent: 'space-between',
                      }}>
                      <Image
                        style={{height: 50, width: 50, borderRadius: 25}}
                        source={require('../../assets/images/header.png')}
                      />

                      <Text
                        style={{
                          marginLeft: 20,
                          color: value.mode.text,
                          fontSize: 16,
                        }}>
                        {user.user.first_name} {user.user.last_name}
                      </Text>

                      {/* <TouchableOpacity
                        onPress={() => this.banUser()}
                        style={{position: 'absolute', right: 6}}>
                        <Text style={{color: 'red'}}>Ban</Text>
                      </TouchableOpacity> */}
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={{height: 100}} />
            </Fragment>
          </ScrollView>
        )}
      </ThemeConsumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    height: HEIGHT,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    alignItems: 'center',
  },
  buyTxt: {
    fontSize: 25,
    fontFamily: 'quicksand',
    fontWeight: 'bold',
    color: colors.baseBorder,
  },
  headerTxt: {
    fontSize: 18,
    fontFamily: 'quicksand',
    fontWeight: 'bold',
    color: colors.grey2,
  },
  buyBtn: {
    backgroundColor: colors.baseBorder,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    justifyContent: 'center',
    borderRadius: 10,
  },
  chooseAmount: {
    color: colors.grey2,
    fontWeight: 'bold',
    fontFamily: 'quicksand',
  },
  counterContainer: {
    backgroundColor: colors.baseColor3,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterTxt: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.grey2,
  },
});
