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

class AddFeedback extends Component {
  constructor(props) {
    super(props);
      (this.state = {
        radioButtonsforStartAs: [
          {
            label: "Yes",
            value: "yes",
            checked: true,
            color: "#323232",
            disabled: false,
            width: "33.33%",
            size: 7
          },
          {
            label: "No",
            value: "not",
            checked: false,
            color: "#323232",
            disabled: false,
            width: "33.33%",
            size: 7
          },
        ]
      });
  }
  componentDidMount() {
  }
 
  render() {
    let selectedItemforStartAs = this.state.radioButtonsforStartAs.find(e => e.checked == true);
    selectedItemforStartAs = selectedItemforStartAs
      ? selectedItemforStartAs.value
      : this.state.radioButtonsforStartAs[0].value;
    return (
      <View style={styles.container}>
        <CustomHeader headerText={'Add Feedback'} />
        <ScrollView>
          <View>
            <Text style={{fontSize:15 , margin:10 , fontWeight:'700'}}>I Recommend This Doctor:</Text>
            <View style={{ marginLeft: 10 }}>
            <RadioGroup
              color={CONSTANT.primaryColor}
              labelStyle={{ fontSize: 14 }}
              radioButtons={this.state.radioButtonsforStartAs}
              onPress={radioButtons => this.setState({ radioButtons })}
              style={{
                paddingTop: 0,
                flexDirection: "row",
                marginBottom: 10,
                marginTop: 10,
                marginLeft: 10,
                display: "flex",
                width: "100%",
                alignSelf: "center",
                alignContent: "center",
                textAlign: "center"
              }}
            />
          </View>

          </View>
        </ScrollView>
        
      </View>
    );
  }
}
export default withNavigation(AddFeedback);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  
});
