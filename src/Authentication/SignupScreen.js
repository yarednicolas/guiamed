import React, { Component } from "react";
import {
  View,
  StyleSheet,
  WebView,
  StatusBar,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
  Image,
  CheckBox,
  ActivityIndicator,
  KeyboardAvoidingView
} from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import { RadioGroup } from "react-native-btr";
import * as CONSTANT from "../Constants/Constant";
import { ScrollView } from "react-native-gesture-handler";
import MultiSelect from "react-native-multiple-select";
import axios from "axios";
// import constants from "jest-haste-map/build/constants";
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();
class SignupScreen extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      isLoading: true,
      projectLocationKnown: "",
      DepartmentKnown: "",
      EmployeeKnown: "",
      FirstName: "",
      LastName: "",
      UserName: "",
      DisplayName: "",
      Email: "",
      Password: "",
      RetypePassword: "",
      fetching_from_server:false,
      //   radioButtons: [
      //     {
      //       label:CONSTANT.SignupMale,
      //       value: "male",
      //       checked: true,
      //       color: "#323232",
      //       disabled: false,
      //       width: "33.33%",
      //       size: 7
      //     },
      //     {
      //       label:CONSTANT.SignupFemale,
      //       value: "female",
      //       checked: false,
      //       color: "#323232",
      //       disabled: false,
      //       width: "33.33%",
      //       size: 7
      //     }
      //   ],
      radioButtonsforStartAs: [
        {
          label: CONSTANT.SignupHospital,
          value: "hospitals",
          checked: true,
          color: "#323232",
          disabled: false,
          width: "33.33%",
          fontFamily:CONSTANT.PoppinsRegular,
          size: 7
        },
        {
          label: CONSTANT.SignupDoctor,
          value: "doctors",
          checked: false,
          color: "#323232",
          disabled: false,
          width: "33.33%",
          fontFamily:CONSTANT.PoppinsRegular,
          size: 7
        },
        {
          label: CONSTANT.SignupRegularUser,
          value: "regular_users",
          checked: false,
          color: "#323232",
          disabled: false,
          width: "33.33%",
          fontFamily:CONSTANT.PoppinsRegular,
          size: 7
        }
      ]
    };
    this.showFilters = true;
  }
  componentDidMount() {
    this.ProjectLocationSpinner();
  }
  ProjectLocationSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl + "taxonomies/get_taxonomy?taxonomy=locations",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        let projectLocation = responseJson;
        this.setState({
          projectLocation
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  CreateAccount = () => {
    
    let selectedItemforStartAs = this.state.radioButtonsforStartAs.find(
      e => e.checked == true
    );
    selectedItemforStartAs = selectedItemforStartAs
      ? selectedItemforStartAs.value
      : this.state.radioButtonsforStartAs[0].value;
    const {
      projectLocationKnown,
      FirstName,
      LastName,
      UserName,
      DisplayName,
      Email,
      Password,
      RetypePassword
    } = this.state;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (
      FirstName == "" &&
      LastName == "" &&
      Email == "" &&
      Password == "" &&
      RetypePassword == "" &&
      UserName == "" &&
      DisplayName == ""
    ) {
      alert("Please enter Complete Detail");
      this.setState({ email: "Please enter Complete Detail" });
    } else if (reg.test(Email) === false) {
      alert("Email is Not Correct");
      this.setState({ email: "Email is Not Correct" });
      return false;
    } else if (Password !== RetypePassword) {
      alert("Passwords don't match");
    } else {
      this.setState({
        fetching_from_server:true
      })
      axios
        .post(CONSTANT.BaseUrl + "user/signup", {
          username: UserName,
          email: Email,
          first_name: FirstName,
          last_name: LastName,
          display_name: DisplayName,
          location: projectLocationKnown[0],
          password: Password,
          verify_password: RetypePassword,
          user_type: selectedItemforStartAs,
          termsconditions: "yes"
        })
        .then(async response => {
          if (response.status === 200) {
            if(response.data.type == 'demo'){
              this.setState({
                fetching_from_server:false,
              })
              alert(JSON.stringify(response.data.message));
            }else{
              Alert.alert("Response", response.data.message);
              this.props.navigation.navigate("VerificationAccount", {
                user_id: response.data.user_id
              });
              this.setState({
                fetching_from_server:false
              })
            }
          } else if (response.status === 203) {
            Alert.alert("Error" + response.data.message);
            this.setState({
              fetching_from_server:false
            })
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };
  render() {
    let selectedItemforStartAs = this.state.radioButtonsforStartAs.find(
      e => e.checked == true
    );
    selectedItemforStartAs = selectedItemforStartAs
      ? selectedItemforStartAs.value
      : this.state.radioButtonsforStartAs[0].value;
    const {
      FirstName,
      LastName,
      UserName,
      DisplayName,
      Email,
      Password,
      RetypePassword
    } = this.state;
    return (
      <KeyboardAvoidingView style={styles.container}>
        {/* <StatusBar backgroundColor="#fff" barStyle="light-content" /> */}
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
                style={{
                  fontSize: 18,
                  fontFamily:CONSTANT.PoppinsMedium,
                  color: "#fff",
                  height: 30,
                  marginTop: 9
                }}
              >
                {CONSTANT.SignupHeader}
              </Text>
            </View>
          </View>
        </View>
        <ScrollView>
          <Image
            style={{
              width: 150,
              height: 80,
              resizeMode: "center",
              alignSelf: "center",
              marginTop: 30
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
            {CONSTANT.Signupmain}
          </Text>
          <View
            style={{
              height: 65,
              flexDirection: "column",
              justifyContent: "center",
              margin: 15,
              backgroundColor: "#fcfcfc",
              borderLeftWidth: 5,
              borderLeftColor: CONSTANT.primaryColor
            }}
          >
            <Text
              style={{
                marginLeft: 10,
                fontSize: 20,
                fontFamily:CONSTANT.PoppinsMedium,
                color: "#000000"
              }}
            >
              {CONSTANT.SignupStartas}
            </Text>
          </View>
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
          <View
            style={{
              height: 65,
              flexDirection: "column",
              justifyContent: "center",
              margin: 15,
              backgroundColor: "#fcfcfc",
              borderLeftWidth: 5,
              borderLeftColor: CONSTANT.primaryColor
            }}
          >
            <Text
              style={{
                marginLeft: 10,
                fontSize: 20,
                fontFamily:CONSTANT.PoppinsMedium,
                color: "#000000"
              }}
            >
              {CONSTANT.SignupPersonal}
            </Text>
          </View>
          <View
            style={{
              borderWidth: 0.6,
              borderRadius: 4,
              margin: 10,
              borderColor: "#dddddd"
            }}
          >
            {/* <View style={{}}>
              <RadioGroup
                color={CONSTANT.primaryColor}
                labelStyle={{ fontSize: 14 }}
                radioButtons={this.state.radioButtons}
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
            <View
              style={{
                borderBottomColor: "#dddddd",
                borderBottomWidth: 0.6
              }}
            /> */}
            <TextInput
              style={{
                fontSize: 17,
                color: "#323232",
                height: 45,
                marginLeft: 5,
                fontFamily:CONSTANT.PoppinsRegular,
              }}
              underlineColorAndroid="transparent"
              editable={true}
              placeholderTextColor="#999999"
              onChangeText={FirstName => this.setState({ FirstName })}
              placeholder={CONSTANT.SignupFname}
            ></TextInput>
            <View
              style={{
                borderBottomColor: "#dddddd",
                borderBottomWidth: 0.6
              }}
            />
            <TextInput
              style={{
                fontSize: 17,
                color: "#323232",
                height: 45,
                fontFamily:CONSTANT.PoppinsRegular,
                marginLeft: 5
              }}
              underlineColorAndroid="transparent"
              editable={true}
              placeholderTextColor="#999999"
              onChangeText={LastName => this.setState({ LastName })}
              placeholder={CONSTANT.SignupLname}
            ></TextInput>
            <View
              style={{
                borderBottomColor: "#dddddd",
                borderBottomWidth: 0.6
              }}
            />
            <TextInput
              style={{
                fontSize: 17,
                color: "#323232",
                height: 45,
                fontFamily:CONSTANT.PoppinsRegular,
                marginLeft: 5
              }}
              underlineColorAndroid="transparent"
              editable={true}
              placeholderTextColor="#999999"
              onChangeText={UserName => this.setState({ UserName })}
              placeholder={CONSTANT.SignupUname}
            ></TextInput>
            <View
              style={{
                borderBottomColor: "#dddddd",
                borderBottomWidth: 0.6
              }}
            />
            <TextInput
              style={{
                fontSize: 17,
                color: "#323232",
                height: 45,
                fontFamily:CONSTANT.PoppinsRegular,
                marginLeft: 5
              }}
              underlineColorAndroid="transparent"
              editable={true}
              placeholderTextColor="#999999"
              onChangeText={DisplayName => this.setState({ DisplayName })}
              placeholder={CONSTANT.SignupDname}
            ></TextInput>
            <View
              style={{
                borderBottomColor: "#dddddd",
                borderBottomWidth: 0.6
              }}
            />
            <View style={{ flexDirection: "row" }}>
              <TextInput
                style={{
                  fontSize: 17,
                  color: "#323232",
                  fontFamily:CONSTANT.PoppinsRegular,
                  height: 45,
                  marginLeft: 5,
                  width: "90%"
                }}
                underlineColorAndroid="transparent"
                editable={true}
                placeholderTextColor="#999999"
                autoCompleteType="email"
                onChangeText={Email => this.setState({ Email })}
                placeholder={CONSTANT.SignupEmail}
              ></TextInput>
              <AntIcon
                name="mail"
                size={15}
                color={"#999999"}
                style={{ top: 15 }}
              />
            </View>
            <View
              style={{
                borderBottomColor: "#dddddd",
                borderBottomWidth: 0.6
              }}
            />
            <View style={{ flexDirection: "row" }}>
              <TextInput
                style={{
                  fontSize: 17,
                  color: "#323232",
                  fontFamily:CONSTANT.PoppinsRegular,
                  height: 45,
                  marginLeft: 5,
                  width: "90%"
                }}
                underlineColorAndroid="transparent"
                editable={true}
                placeholderTextColor="#999999"
                autoCompleteType="password"
                onChangeText={Password => this.setState({ Password })}
                placeholder={CONSTANT.SignupPassword}
              ></TextInput>
              <AntIcon
                name="lock"
                size={15}
                color={"#999999"}
                style={{ top: 15 }}
              />
            </View>
            <View
              style={{
                borderBottomColor: "#dddddd",
                borderBottomWidth: 0.6
              }}
            />
            <View style={{ flexDirection: "row" }}>
              <TextInput
                style={{
                  fontSize: 17,
                  color: "#323232",
                  fontFamily:CONSTANT.PoppinsRegular,
                  height: 45,
                  marginLeft: 5,
                  width: "90%"
                }}
                underlineColorAndroid="transparent"
                editable={true}
                placeholderTextColor="#999999"
                autoCompleteType="password"
                onChangeText={RetypePassword =>
                  this.setState({ RetypePassword })
                }
                placeholder={CONSTANT.SignupRetypePassword}
              ></TextInput>
              <AntIcon
                name="lock"
                size={15}
                color={"#999999"}
                style={{ top: 15 }}
              />
            </View>
          </View>
          <View
            style={{
              height: 65,
              flexDirection: "column",
              justifyContent: "center",
              margin: 15,
              backgroundColor: "#fcfcfc",
              borderLeftWidth: 5,
              borderLeftColor: CONSTANT.primaryColor
            }}
          >
            <Text
              style={{
                marginLeft: 10,
                fontSize: 20,
                fontFamily:CONSTANT.PoppinsMedium,
                color: "#000000"
              }}
            >
              {CONSTANT.SignupLocation}
            </Text>
          </View>
          <View style={{ marginLeft: 15, marginRight: 15 }}>
            <MultiSelect
              ref={component => {
                this.multiSelect = component;
              }}
              onSelectedItemsChange={value =>
                this.setState({ projectLocationKnown: value })
              }
              uniqueKey="slug"
              items={this.state.projectLocation}
              selectedItems={this.state.projectLocationKnown}
              borderBottomWidth={0}
              single={true}
              searchInputPlaceholderText="Search Project Location..."
              onChangeInput={text => console.log(text)}
              selectText="Pick Location"
              styleMainWrapper={{
                backgroundColor: "#fff",
                borderRadius: 4,
                marginTop: 10
              }}
              styleDropdownMenuSubsection={{
                backgroundColor: "#fff",
                paddingRight: -7,
                height: 55,
                paddingLeft: 10,
                borderWidth: 0.6,
                borderColor: "#fff",
                borderColor: "#dddddd",
                borderRadius: 4
              }}
              displayKey="name"
              submitButtonText="Submit"
              underlineColorAndroid="transparent"
            />
          </View>

          <TouchableOpacity
            onPress={this.CreateAccount}
            style={{
              alignItems: "center",
              height: 40,
              margin: 10,
              borderRadius: 4,
              width: "50%",
              alignSelf: "center",
              flexDirection:'row',
              flex:1,
              justifyContent:'center',
              backgroundColor: CONSTANT.primaryColor
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                alignItems: "center",
                textAlign: "center",
                color: "#fff",
                fontFamily:CONSTANT.PoppinsMedium,
              }}
            >
              {CONSTANT.SignupContinue}
            </Text>
            {this.state.fetching_from_server == true ? (
            <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
          ) : null}
          </TouchableOpacity>
          {/* <TouchableOpacity
          onPress={this.CreateAccount}
          //On Click of button calling loadMoreData function to load more data
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>  {CONSTANT.SignupContinue}</Text>
          {this.state.fetching_from_server == true ? (
            <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
          ) : null}
        </TouchableOpacity> */}
          <View
            style={{
              backgroundColor: CONSTANT.primaryColor,
              height: 45,
              width: "100%",
              marginTop: 10
            }}
          >
            <Text
              style={{
                color: "#fff",
                alignSelf: "center",
                fontSize: 17,
                top: 12,
                fontFamily:CONSTANT.PoppinsMedium,
              }}
            >
              {CONSTANT.SignupMoveSignin}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
export default SignupScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
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
  },
});
