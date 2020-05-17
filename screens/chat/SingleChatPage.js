import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
  Text,
  FlatList,
} from 'react-native';
import SingleChatHeader from '../../components/helpers/SingleChatHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {colors} from '../../constants/colors';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {config} from '../../../config';
import {ThemeConsumer} from '../../components/theme/ThemeContextProvider';
import moment from 'moment';


const WIDTH = Dimensions.get('window').width;

export default class ChatPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      token: '',
      chatMessages: [],
      text: '',
      userId: '',
      userOnline: '',
      data: '',
      forumDetails: []
    };
  }

  //API functions
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


  };



  async componentDidMount() {
    await this._retrieveData();
    await this.getMessages();
    // let checkMessage = setInterval(this.checkNewMessage, 5000);
    // this.setState({checkMessage: checkMessage});
  }


  componentWillUnmount () {
    this.getMessages();
  }


  getMessages = async () => {
    const {navigation} = this.props;
    const userId  = navigation.getParam('userId')
    await axios({
      method: 'get',
      url: 'https://dozie.com.ng/api/v1/forums/get_private_messages/',
      headers: {
        Authorization: `JWT ${this.state.token}`,
      },
      data: {
          user_id: "99cc955c-7745-4154-bced-494cd8c576bc"
      }
    })
      .then(data => {
        this.setState({
          loading: false,
          messages: data,
        });
        console.log('eget individual message', this.state.messages);
       })
      .catch(err => {
        this.setState({
          loading: false,
        });
        this.getMessages();
        console.log('enter forum error is', err.details);
        console.log('enter forum error is', err.data);
        console.log('enter forum error is', err)
        console.log('forum Id', this.state.token);
        console.log('forum Id', userId);

      });
  };


  postMessages = async () => {
    const {navigation} = this.props;
    const forumId = navigation.getParam('id', '');
    const {text} = this.state;
    await axios({
      method: 'post',
      url: config.sendPrivateMessage,
      headers: {
        Authorization: `JWT ${this.state.token}`,
      },
      data: {
        post_type: 'text',
        message: text,
      },

    })
      .then(({data}) => {
        this.setState({
          loading: false,
        });
        this.getMessages();
      })
      .catch(err => {
        this.setState({
          loading: false,
        });
        this.getMessages();
        console.log(`post message error is ${err}`);
        
        console.log('post message forum Id', this.state.token);
      });
  };

  componentWillUnmount() {
    clearInterval(this.state.checkMessage);
  }

  // componentDidUpdate() {
  //   if(this.state.newMessages !== this.state.chatMessages) {
  //     this.enterForum()
  //   }
  // }

 

  //Chat Functions

  onSend() {
    this.postMessages();
    setTimeout(() => {
      this.setState({
        text: '',
      });
    }, 100);
  }

  render() {
    const {state} = this.props.navigation;
    var forumId = state.params.id;
    const {chatMessages} = this.state;
    return (
      <ThemeConsumer>
        {value => (
          <SingleChatHeader
            fname={state.params.fname}
            lname={state.params.fname}
            // avatar={state.params.logo}
             >
              <FlatList
                data={this.state.messages}
                renderItem={({item}) => {
                  if (item.sender.id !== this.state.userId) {
                    return (
                      <ThemeConsumer>
                        {value => (
                          <View style={{width: WIDTH / 2, marginLeft: 12}}>
                            <View
                              style={{
                                backgroundColor: value.mode.card,
                                marginTop: 10,
                                padding: 10,
                                borderTopRightRadius: 12,
                                borderBottomRightRadius: 12,
                                borderBottomLeftRadius: 16,
                                marginBottom: 15,
                              }}>
                              <View style={{marginTop: -10}}>
                                <Text
                                  style={{
                                    color: colors.grey2,
                                    fontWeight: 'bold',
                                  }}>
                                  {item.sender.first_name}{' '}
                                  {item.sender.last_name}
                                </Text>
                              </View>
                              <Text
                                style={{color: value.mode.text, marginTop: 10}}>
                                {item.message}
                              </Text>

                              <Text
                                style={{
                                  position: 'absolute',
                                  right: 6,
                                  bottom: 2,
                                  fontSize: 11,
                                  color: colors.grey2,
                                }}>
                                {moment(item.timestamp).format('LT')}
                              </Text>
                            </View>
                          </View>
                        )}
                      </ThemeConsumer>
                    );
                  } else {
                    return (
                      <ThemeConsumer>
                        {value => (
                          <View
                            style={{width: WIDTH / 2, marginLeft: WIDTH / 2}}>
                            <View
                              style={{
                                backgroundColor: colors.baseBorder,
                                marginTop: 10,
                                padding: 10,
                                borderTopRightRadius: 12,
                                borderBottomRightRadius: 12,
                                borderBottomLeftRadius: 16,
                                marginBottom: 15,
                                marginRight: 10,
                              }}>
                              <View style={{marginTop: -10}}>
                                <Text
                                  style={{
                                    color: colors.grey1,
                                    fontWeight: 'bold',
                                  }}>
                                  {item.sender.first_name}{' '}
                                  {item.sender.last_name}
                                </Text>
                              </View>
                              <Text
                                style={{color: 'whitesmoke', marginTop: 10}}>
                                {item.message}
                              </Text>

                              <Text
                                style={{
                                  position: 'absolute',
                                  right: 6,
                                  bottom: 2,
                                  fontSize: 11,
                                  color: colors.grey1,
                                }}>
                                {moment(item.timestamp).format('LT')}
                              </Text>
                            </View>
                          </View>
                        )}
                      </ThemeConsumer>
                    );
                  }
                }}
                keyExtractor={item => item.id}
              />
           
            <View style={{height: 70}} />
            <View style={{position: 'absolute', bottom: 1}}>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: value.mode.background,
                  alignItems: 'center',
                  borderTopWidth: 0.6,
                  borderTopColor: 'lightgray',
                }}>
                <TouchableOpacity style={{marginHorizontal: 10}}>
                  <Image source={require('../../assets/images/emoji.png')} />
                </TouchableOpacity>
                <TextInput
                  placeholder="Type Message"
                  value={this.state.text}
                  onChangeText={text => this.setState({text})}
                  style={[styles.inputField, {color: value.mode.text}]}
                />
                <TouchableOpacity style={{marginRight: 6}}>
                  <Entypo
                    name="attachment"
                    color={colors.baseBorder}
                    size={20}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{marginRight: 10, paddingRight: 8}}
                  onPress={() => this.onSend()}>
                  <Ionicons
                    name="ios-send"
                    color={colors.baseBorder}
                    size={26}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </SingleChatHeader>
        )}
      </ThemeConsumer>
    );
  }
}

const styles = StyleSheet.create({
  sendContainer: {
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginRight: 0,
  },
  inputField: {
    width: WIDTH - 100,
  },
});
