import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  TextInput,
  ActivityIndicator,
  FlatList,
  AsyncStorage,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import {Input, InputProps, Button} from 'react-native-ui-kitten';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ReceiveMessageLayout from './ReceiveMessageLayout';
import axios from 'axios';
import {withNavigation, DrawerActions} from 'react-navigation';
import * as CONSTANT from '../../Constants/Constant';
import HTML from 'react-native-render-html';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

class MessageDetailLayout extends Component {
  state = {
    data: [],
    isLoading: true,
    fetchMessageDetail: [],
    message: '',
  };
  componentDidMount() {
    this.fetchMessages();
  }
  fetchMessages = async () => {
    const Pid = await AsyncStorage.getItem('projectUid');
    const {params} = this.props.navigation.state;
    const response = await fetch(
      CONSTANT.BaseUrl +
        'chat/list_user_messages/?reciver_id=' +
        Pid +
        '&current_id=' +
        params.receiver_id,
    );
    const json = await response.json();
    if (
      Array.isArray(json) &&
      json[0] &&
      json[0].type &&
      json[0].type === 'error'
    ) {
      this.setState({fetchMessageDetail: [], isLoading: false}); // empty data set
    } else {
      this.setState({fetchMessageDetail: json.chat_sidebar, isLoading: false});
      this.setState({fetchMessageList: json.chat_nodes, isLoading: false});
    }
  };
  SendMessage = async () => {
    this.setState({
      message: '',
    });
    const {message} = this.state;
    const {params} = this.props.navigation.state;
    const Uid = await AsyncStorage.getItem('projectUid');

    if (message == '') {
      //alert("Please enter Email address");
      this.setState({email: 'Por favor agregue mensaje.'});
      Alert.alert("Oops" , "Por favor agregue mensaje.")
    } else {
      axios
        .post(CONSTANT.BaseUrl + 'chat/sendUserMessage', {
          sender_id: Uid,
          receiver_id: params.receiver_id,
          message: message,
        })
        .then(async response => {
          if (response.status == 200) {
            this.setState({
              message: '',
            });
            this.fetchMessages();
          } else if (response.status == 203) {
            this.setState({
              message: '',
            });
            Alert.alert(response.type);
          }
        })
        .catch(error => {
          this.setState({
            message: '',
          });
          console.log(error);
        });
    }
    Keyboard.dismiss();
  };

  render() {
    const {isLoading} = this.state;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        {isLoading && (
          <View style={styles.messageDetailActivityIndicatorArea}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.messageDetailActivityIndicatorStyle}
            />
          </View>
        )}


        {this.state.fetchMessageDetail && (
          <View
            style={styles.messageDetailFetchStyle}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack(null)}
              style={styles.messageDetailTouchableStyle}>
              <AntIcon name="back" size={25} color={'#fff'} />
            </TouchableOpacity>
            <View
              style={styles.messageDetailTopRatedArea}>
              <View
                style={styles.messageDetailTopRated}>
                <View style={styles.MainTopRatedStyle}>
                  <View style={styles.ImageLayoutStyle}>
                    <Image
                      resizeMode="contain"
                      style={styles.ImageStyle}
                      source={{uri: `${this.state.fetchMessageDetail.avatar}`}}
                    />
                  </View>
                  <View style={styles.docContentstyle}>
                    <View style={styles.messageDetailTopRated}>
                      {this.state.fetchMessageDetail && (
                        <Text numberOfLines={1} style={styles.DocName}>
                          {this.state.fetchMessageDetail.username}
                        </Text>
                      )}
                    </View>
                    {this.state.fetchMessageDetail && (
                       <HTML html={this.state.fetchMessageDetail.user_register} containerStyle={styles.titleStyle} imagesMaxWidth={Dimensions.get('window').width} />
                      // <Text
                      //   numberOfLines={1}
                      //   style={styles.titleStyle}>{`${entities.decode(
                      //   this.state.fetchMessageDetail.user_register,
                      // )}`}</Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
        <KeyboardAvoidingView behavior={ Platform.OS === 'ios' ? 'padding' : undefined } style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding:1000" enabled keyboardVerticalOffset={100}>
        <ScrollView>
          {this.state.fetchMessageList ? (
            <FlatList
              style={styles.messageDetailListStyle}
              data={this.state.fetchMessageList}
              keyExtractor={(a, b) => b.toString()}
              renderItem={({item}) => (
                <TouchableOpacity>
                  {item.chat_is_sender == 'yes' ? (
                    <View
                      style={styles.messageDetailListTouchableArea}>
                      <View
                        style={styles.messageDetailListTouchableTextArea}>
                        <Text
                          style={styles.messageDetailListTouchableMessageText}>
                          {item.chat_message}
                        </Text>
                      </View>
                      <Text
                        style={styles.messageDetailListTouchableDateText}>
                        {item.chat_date}
                      </Text>
                    </View>
                  ) : item.chat_is_sender == 'no' ? (
                    <View
                      style={styles.messageDetailListTouchableChatArea}>
                      <View
                        style={styles.messageDetailListTouchableChatMessageStyle}>
                        <Text
                          style={styles.messageDetailListTouchableChatMessageText}>
                          {item.chat_message}
                        </Text>
                      </View>
                      <View
                        style={styles.messageDetailListTouchableChatDateStyle}>
                        <Text
                          style={styles.messageDetailListTouchableChatDateText}>
                          {item.chat_date}
                        </Text>
                        <AntIcon
                          style={styles.messageDetailListTouchableChatDateIcon}
                          name="check"
                          size={13}
                          color={'#4B8B3B'}
                        />
                      </View>
                    </View>
                  ) : null}
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index}
            />
          ) : null}

           </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.messageDetailTextInputArea}>
          <TextInput
            multiline={true}
            placeholder={CONSTANT.MessagesTypehere}
            underlineColorAndroid="transparent"
            placeholderTextColor="#7F7F7F"
            style={styles.TextInputLayout}
            onChangeText={message => this.setState({message})}></TextInput>
          <TouchableOpacity
            onPress={this.SendMessage}
            style={styles.messageDetailTextInputStyle}>
            <FontAwesome name="send" size={25} color={CONSTANT.primaryColor} />
          </TouchableOpacity>
        </View>


      </View>
    );
  }
}
export default withNavigation(MessageDetailLayout);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  searchText: {
    marginTop: 15,
    marginLeft: 10,
    marginBottom: 5,
    fontSize: 15,
  },
  searchTextBold: {
    color: '#3d4461',
    marginLeft: 10,
    fontWeight: '900',
    fontSize: 20,
    marginTop: -8,
  },
  MainTopRatedStyle: {
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ImageStyle: {
    height: 40,
    width: 40,
    position: 'relative',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 20,
  },
  docContentstyle: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  titleStyle: {
    color: '#fff',
    fontSize: 13,
    fontFamily:CONSTANT.PoppinsRegular
    },
  ImageLayoutStyle: {
    elevation: 4,
    shadowColor: '#000',
    borderRadius: 4,
    overflow: 'hidden',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  DocName: {
    color: '#fff',
    fontSize: 15,
    fontFamily:CONSTANT.PoppinsBold
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  TextInputLayout: {
    height: 51,
    width: '80%',
    color: '#323232',
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dddddd',
    marginLeft: 10,
    marginBottom:5,
    marginTop:5,
    marginTop:5,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowColor: '#000',
    fontFamily:CONSTANT.PoppinsRegular
  },
  messageDetailActivityIndicatorArea: {justifyContent: 'center', height: '100%'},
  messageDetailActivityIndicatorStyle: {
    height: 30,
    width: 30,
    borderRadius: 60,
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 5,
  },
  messageDetailFetchStyle: {
    height: 60,
    paddingLeft: 15,
    paddingRight: 15,
    width: '100%',
    backgroundColor: '#3d4461',
    flexDirection: 'row',
    shadowOffset: {width: 0, height: 2},
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 10,
  },
  messageDetailTouchableStyle: {
    flexDirection: 'column',
    display: 'flex',
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  messageDetailTopRatedArea: {
    flexDirection: 'column',
    display: 'flex',
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  messageDetailTopRated: {flexDirection: 'row'},
  messageDetailListStyle: {height: '80%', marginBottom: 15, marginTop: 15},
  messageDetailListTouchableArea: {
    flexDirection: 'column',
    margin: 5,
    width: '100%',
    paddingLeft: 10,
  },
  messageDetailListTouchableTextArea: {
    alignSelf: 'flex-start',
    maxWidth: '80%',
    backgroundColor: '#fff',
    borderWidth: 0.6,
    borderRadius: 6,
    borderColor: '#dddddd',
  },
  messageDetailListTouchableMessageText: {
    color: '#000',
    fontSize: 13,
    color: '#323232',
    padding: 10,
    fontFamily:CONSTANT.PoppinsRegular
  },
  messageDetailListTouchableDateText: {
    color: '#767676',
    fontSize: 10,
    marginTop: 2,
    marginLeft: 5,
    fontFamily:CONSTANT.PoppinsRegular
  },
  messageDetailListTouchableChatArea: {
    flexDirection: 'column',
    margin: 5,
    width: '100%',
    paddingRight: 15,
  },
  messageDetailListTouchableChatMessageStyle: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
    backgroundColor: CONSTANT.primaryColor,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    borderWidth: 0.6,
    borderRadius: 6,
    borderColor: '#dddddd',
  },
  messageDetailListTouchableChatMessageText: {
    color: '#000',
    fontSize: 13,
    padding: 10,
    color: '#fff',
    fontFamily:CONSTANT.PoppinsRegular
  },
  messageDetailListTouchableChatDateStyle: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  messageDetailListTouchableChatDateText: {
    color: '#767676',
    fontSize: 10,
    marginTop: 2,
    marginLeft: 10,
    fontFamily:CONSTANT.PoppinsRegular
  },
  messageDetailListTouchableChatDateIcon: {marginLeft: 5},
  messageDetailTextInputArea: {flexDirection: 'row'},
  messageDetailTextInputStyle: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    height: 51,
    borderRadius:25.5,
    marginLeft:10,
    width: 51,
    elevation: 4,
    marginTop:5,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowColor: '#000',
  }
});
