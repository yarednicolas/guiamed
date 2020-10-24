import React, { Component } from "react";
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
  Dimensions
} from "react-native";
import { SwipeRow, List, Content } from "native-base";
import { Input, InputProps, Button } from "react-native-ui-kitten";
import AntIcon from "react-native-vector-icons/AntDesign";
import { withNavigation, DrawerActions } from "react-navigation";
import DateTimePicker from "react-native-modal-datetime-picker";
import CustomHeader from "../Header/CustomHeader";
import Dash from "react-native-dash";
import Dates from "react-native-dates";
import Moment from "moment";
import axios from "axios";
import * as CONSTANT from "../Constants/Constant";

class VerifyPasswordForBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      RetypePassword: "",
      isProgress: false
    };
  }

  SubmitPasswords = async () => {
    const { password, RetypePassword } = this.state;
    const Uid = await AsyncStorage.getItem("projectUid");

    if (password != null && RetypePassword != null) {
      if (password === RetypePassword) {
        axios
          .post(CONSTANT.BaseUrl + "appointments/booking_step2", {
            user_id: Uid,
            password: password,
            retype_password: RetypePassword
          })
          .then(async response => {
            if (response.status === 200) {
              this.setState({ isUpdatingLoader: false });
              Alert.alert("Actualizado con éxito", response.data.message);
              this.props.navigation.navigate("SubmitCode");
              console.log(
                "Updated Successfully" + JSON.stringify(response.data.message)
              );
            } else if (response.status === 203) {
              Alert.alert("Error" + response.data.message);
              console.log("Error" + response);
            }
          })
          .catch(error => {
            Alert.alert(error);
            console.log(error);
          });
      } else {
        Alert.alert("Error", "Contraseñas no coincidentes");
      }
    } else {
      Alert.alert("Error", "Fields should not be empty");
    }
  };
  render() {
    const isDateBlocked = date => date.isBefore(Moment(), "day");
    Moment.locale("en");
    var dt = "2016-05-02T00:00:00";
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#f7f7f7" barStyle="dark-content" />
        <CustomHeader headerText={"Verify Password"} />
        <View
          style={{
            backgroundColor: "#fff",
            padding: 10,
            borderRadius: 5,
            margin: 10,
            elevation: 3,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowColor: "#000"
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 15 }}>
            Please verify that its you
          </Text>
          <TextInput
            underlineColorAndroid="transparent"
            placeholderTextColor="#7F7F7F"
            placeholder="Password"
            onChangeText={password => this.setState({ password })}
            style={{
              height: 45,
              paddingLeft: 10,
              borderRadius: 2,
              borderWidth: 0.6,
              borderColor: "#dddddd",
              color: "#323232",
              marginLeft: 10,
              marginRight: 10,
              marginBottom: 10
            }}
          />

          <TextInput
            underlineColorAndroid="transparent"
            placeholderTextColor="#7F7F7F"
            placeholder="Retype Password"
            onChangeText={RetypePassword => this.setState({ RetypePassword })}
            style={{
              height: 45,
              paddingLeft: 10,
              borderRadius: 2,
              borderWidth: 0.6,
              borderColor: "#dddddd",
              color: "#323232",
              marginLeft: 10,
              marginRight: 10,
              marginBottom: 10
            }}
          />
          <TouchableOpacity
            onPress={this.SubmitPasswords}
            style={{
              alignItems: "center",
              height: 40,
              margin: 10,
              borderRadius: 4,
              width: "50%",
              alignSelf: "center",
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
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
export default withNavigation(VerifyPasswordForBooking);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7"
  }
});
