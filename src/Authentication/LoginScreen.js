import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Keyboard,
  AsyncStorage,
  NativeModules,
  TextInput,
  BackHandler,
  Alert,
  KeyboardAvoidingView,
  Modal,
  ActivityIndicator
} from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import RNRestart from "react-native-restart";
import axios from "axios";
import * as CONSTANT from "../Constants/Constant";
import { Button } from "native-base";
class LoginScreen extends Component {
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      isProgress: false,
      fetching_from_server:false
    };
  }
  login = () => {

    const { username, password } = this.state;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (username == "") {
      //alert("Please enter Email address");
      this.setState({ email: "Please enter Email address" });
    } else if (reg.test(username) === false) {
      //alert("Email is Not Correct");
      this.setState({ email: "Email is Not Correct" });
      return false;
    } else if (password == "") {
      this.setState({ email: "Please enter password" });
    } else {
      //   this.openProgressbar();
      this.setState({fetching_from_server : true})
      axios
        .post(CONSTANT.BaseUrl + "user/do_login", {
          username: username,
          password: password
        })
        .then(async response => {
          if (response.data.type == "success") {
            await AsyncStorage.setItem(
              "full_name",
              response.data.profile.pmeta.am_first_name +
                " " +
                response.data.profile.pmeta.am_last_name
            );
            await AsyncStorage.setItem(
              "user_type",
              response.data.profile.pmeta.user_type
            );
            await AsyncStorage.setItem(
              "user_onCall_booking",
              response.data.profile.pmeta.booking_oncall
            );
            await AsyncStorage.setItem(
              "profile_img",
              response.data.profile.pmeta.profile_img
            );
            // await AsyncStorage.setItem(
            //   "profileBanner",
            //   response.data.profile.pmeta.banner_img
            // );
            await AsyncStorage.setItem("profileType", response.data.type);
            await AsyncStorage.setItem(
              "projectUid",
              response.data.profile.umeta.id
            );
            await AsyncStorage.setItem(
              "projectEmail",
              response.data.profile.umeta.user_email
            );
            await AsyncStorage.setItem(
              "projectProfileId",
              JSON.stringify(response.data.profile.umeta.profile_id)
            );
            await AsyncStorage.setItem(
              "shipping_address1",
              response.data.profile.shipping.address_1
            );
            await AsyncStorage.setItem(
              "shipping_city",
              response.data.profile.shipping.city
            );
            await AsyncStorage.setItem(
              "shipping_company",
              response.data.profile.shipping.company
            );
            await AsyncStorage.setItem(
              "shipping_country",
              response.data.profile.shipping.country
            );
            await AsyncStorage.setItem(
              "shipping_first_name",
              response.data.profile.shipping.first_name
            );
            await AsyncStorage.setItem(
              "shipping_last_name",
              response.data.profile.shipping.last_name
            );
            await AsyncStorage.setItem(
              "shipping_state",
              response.data.profile.shipping.state
            );
            await AsyncStorage.setItem(
              "billing_address_1",
              response.data.profile.billing.address_1
            );
            await AsyncStorage.setItem(
              "billing_city",
              response.data.profile.billing.city
            );
            await AsyncStorage.setItem(
              "billing_company",
              response.data.profile.billing.company
            );
            await AsyncStorage.setItem(
              "billing_country",
              response.data.profile.billing.country
            );
            await AsyncStorage.setItem(
              "billing_first_name",
              response.data.profile.billing.first_name
            );
            await AsyncStorage.setItem(
              "billing_last_name",
              response.data.profile.billing.last_name
            );
            await AsyncStorage.setItem(
              "billing_email",
              response.data.profile.billing.email
            );
            await AsyncStorage.setItem(
              "billing_phone",
              response.data.profile.billing.phone
            );
            await AsyncStorage.setItem(
              "billing_state",
              response.data.profile.billing.state
            );
            this.setState({ isProgress: false });
            RNRestart.Restart();
          } else if (response.data.type == "error") {
            this.setState({ isProgress: false , fetching_from_server : false });
            alert("Verifique su correo electrónico / contraseña o verifique la red");
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
    Keyboard.dismiss();
  };

  render() {
    return this.state.isProgress ? (
      <CustomProgressBar />
    ) : (
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <View
          style={{
            height: 60,
            paddingLeft: 15,
            paddingRight: 15,
            width: "100%",
            backgroundColor: CONSTANT.primaryColor,
            flexDirection: "row",
            shadowOffset: { width: 0, height: 2 },
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 10
          }}
        >
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack(null)}
            style={{
              flexDirection: "column",
              width: "20%",
              display: "flex",
              alignContent: "center",
              alignSelf: "center",
              justifyContent: "center"
            }}
          >
            <AntIcon name="back" size={25} color={"#fff"} />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "column",
              width: "60%",
              display: "flex",
              alignContent: "center",
              alignSelf: "center",
              justifyContent: "center"
            }}
          >
            <View
              style={{
                flexDirection: "row",
                display: "flex",
                alignSelf: "center"
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 18,
                  fontFamily:CONSTANT.PoppinsMedium,
                  color: "#fff",
                  height: 30,
                  marginTop: 9
                }}
              >
                {CONSTANT.LoginHeader}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.container}>
          <Text style={{ padding: 10, margin: 10, color: "red" }}>
            {this.state.email}
          </Text>
          <Image
            style={{
              width: 150,
              height: 80,
              resizeMode: "center",
              alignSelf: "center"
            }}
            source={require("../../Assets/Images/guiamed-splash.png")}
          />
          <Text
            style={{
              textAlign: "center",
              alignSelf: "center",
              color: "#807f7f",
              fontFamily:CONSTANT.PoppinsRegular,
            }}
          >
            {CONSTANT.Loginmain}
          </Text>
          <View
            style={{
              width: "90%",
              borderWidth: 0.6,
              borderRadius: 4,
              margin: 10,
              borderColor: "#dddddd"
            }}
          >
            <TextInput
              style={{ fontSize: 15, padding: 5, height: 40, color: "#323232" ,fontFamily:CONSTANT.PoppinsRegular,}}
              underlineColorAndroid="transparent"
              name="username"
              placeholder={CONSTANT.LoginEmail}
              placeholderTextColor="#807f7f"
              onChangeText={username => this.setState({ username })}
            />
            <View
              style={{ borderBottomColor: "#dddddd", borderBottomWidth: 0.6 }}
            />
            <TextInput
              style={{ fontSize: 15, padding: 5, height: 40, color: "#323232" ,fontFamily:CONSTANT.PoppinsRegular,}}
              underlineColorAndroid="transparent"
              editable={true}
              secureTextEntry={true}
              name="password"
              placeholder={CONSTANT.LoginPassword}
              placeholderTextColor="#807f7f"
              onChangeText={password => this.setState({ password })}
            />
          </View>
          {/* <TouchableOpacity
            onPress={this.login}
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
              {CONSTANT.LoginButton}
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity
          onPress={this.login}
          //On Click of button calling loadMoreData function to load more data
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>{CONSTANT.LoginButton}</Text>
          {this.state.fetching_from_server == true ? (
            <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
          ) : null}
        </TouchableOpacity>
          {/* <Text
              onPress={() => this.props.navigation.navigate("ForgetPassword")}
              style={{
                textAlign: "center",
                alignSelf: "center",
                color: "#616161",
                fontSize: 15,
                margin: 10
              }}
            >
               {CONSTANT.LoginForget}
          </Text> */}
        </View>
        <View
          style={{
            height: 45,
            flex:1,
            justifyContent:'center',
            backgroundColor: "#3d4461",
            alignItems: "center",
            alignContent: "center"
          }}
        >
          <Text
            onPress={() => this.props.navigation.navigate("SignupScreen")}
            style={{
              textAlign: "center",
              alignSelf: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 18,
              fontFamily:CONSTANT.PoppinsMedium,
              alignContent: "center",
              textAlignVertical: "center"
            }}
          >
            {CONSTANT.LoginMoveSignup}
          </Text>
        </View>

      </KeyboardAvoidingView>
    );
  }
}
const CustomProgressBar = ({ visible }) => (
  <Modal onRequestClose={() => null} visible={visible}>
    <View
      style={{
        flex: 1,
        backgroundColor: "#dcdcdc",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
      }}
    >
      <View
        style={{
          borderRadius: 10,
          backgroundColor: "white",
          padding: 25,
          position: "absolute"
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "200" }}>Loading</Text>
        <ActivityIndicator size="large" color={CONSTANT.primaryColor} />
      </View>
    </View>
  </Modal>
);
export default LoginScreen;
const styles = StyleSheet.create({
  container: {
    height: "85%",
    justifyContent: "center",
    alignItems: "center"
  },
  loadMoreBtn: {
    paddingTop: 10,
    paddingBottom:10,
    paddingLeft:20 ,
    paddingRight:20,
    backgroundColor: CONSTANT.primaryColor,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    fontFamily:CONSTANT.PoppinsMedium,
  },
});
