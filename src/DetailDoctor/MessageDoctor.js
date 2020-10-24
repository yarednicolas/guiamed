import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  ImageBackground,
  Text,
  Alert,
  AsyncStorage,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  PanResponder,
  Dimensions,
} from 'react-native';
import {SwipeRow, List, Content} from 'native-base';
import {Input, InputProps, Button} from 'react-native-ui-kitten';
import { RadioGroup } from "react-native-btr";
import AntIcon from 'react-native-vector-icons/AntDesign';
import {withNavigation, DrawerActions} from 'react-navigation';
import DateTimePicker from 'react-native-modal-datetime-picker';
import ImagePicker from 'react-native-image-crop-picker';
import CustomHeader from '../Header/CustomHeader';
import MultiSelect from 'react-native-multiple-select';
import axios from 'axios';
import Dash from 'react-native-dash';
import * as CONSTANT from '../Constants/Constant';

class MessageDoctor extends Component {
  constructor(props) {
    super(props);
      (this.state = {
        data: [],
        isLoading: true,
        fetchMessageDetail: [],
        message: '',
      });
  }
  componentDidMount() {
  }
  SendMessage = async () => {
    const {message} = this.state;
    const {params} = this.props.navigation.state;
    const Uid = await AsyncStorage.getItem('projectUid');

    if (message == '') {
      //alert("Please enter Email address");
      this.setState({email: 'Please add message'});
    } else {
      axios
        .post(CONSTANT.BaseUrl + 'chat/sendUserMessage', {
          sender_id: Uid,
          receiver_id: params.id,
          message: message,
        })
        .then(async response => {
          if (response.status == 200) {
            this.setState({
              message: '',
            });
            Alert.alert("Éxito" , "Mensaje enviado correctamente")
          } else if (response.status == 200) {
            Alert.alert(response.type);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
    Keyboard.dismiss();
  };

  render() {
    return (
      <View style={styles.container}>
        <CustomHeader headerText={'Send Message'} />
        <ScrollView>
        <TextInput
            multiline={true}
            placeholder={CONSTANT.MessagesTypehere}
            underlineColorAndroid="transparent"
            placeholderTextColor="#7F7F7F"
            style={styles.TextInputLayout}
            onChangeText={message => this.setState({message})}></TextInput>
            <TouchableOpacity
              onPress={this.SendMessage}
              style={{
                alignItems: "center",
                height: 40,
                marginTop: 20,
                marginRight:10,
                marginLeft:10,
                borderRadius: 4,
                width: "50%",
                alignSelf: "center",
                marginTop:10,
                backgroundColor: CONSTANT.primaryColor
              }}
            >
              <Text
                style={{
                  alignSelf: "center",
                  alignItems: "center",
                  textAlign: "center",
                  color: "#fff",

                  paddingTop: 10
                }}
              >
                Send Now
            </Text>
            </TouchableOpacity>
        </ScrollView>

      </View>
    );
  }
}
export default withNavigation(MessageDoctor);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  HomeHeaderText: {
    height: 45,
    paddingLeft: 10,
    borderRadius: 2,
    borderWidth: 0.6,
    borderColor: '#dddddd',
    color: '#323232',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop:15
  },
  TextInputLayout: {
    height: 150,
    color: '#323232',
    paddingLeft: 10,
    paddingRight: 10,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: '#dddddd',
    marginTop:10,
    marginRight:10,
    marginLeft: 10,
    marginBottom: 10,
    textAlignVertical:'top'
  },

});
