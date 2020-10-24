import React, { Component } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  AsyncStorage,
  ActivityIndicator,
  PanResponder,
  Alert,
  Dimensions
} from "react-native";
import { withNavigation, DrawerActions } from "react-navigation";
import { ScrollableTabView } from "@valdio/react-native-scrollable-tabview";
import CustomHeader from "../Header/CustomHeader";
import AntIcon from "react-native-vector-icons/AntDesign";
import MultiSelect from "react-native-multiple-select";
import { RadioGroup } from "react-native-btr";
import * as CONSTANT from "../Constants/Constant";
import axios from "axios";
import Moment from "moment";
import RBSheet from "react-native-raw-bottom-sheet";
import TimePicker from "react-native-simple-time-picker";
import {
  Collapse,
  CollapseHeader,
  CollapseBody
} from "accordion-collapse-react-native";
import HTML from "react-native-render-html";
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();

class AddSetting extends Component {
  //To store data within component
  constructor(props) {
    super(props);

    this.state = {
      projectHospitalKnown: "",
      projectIntervalKnown: "",
      projectDurationKnown: "",
      projectSlotsKnown: "",
      projectDaysKnown: "",
      projectSelectedServiceKnown: "",
      projectprojectEndTimeKnown: "",
      projectprojectStartTimeKnown: "",
      selectedHours: 0,
      selectedMinutes: 0,
      fee: "",
      customSpaces: "",
      service: [],
      isLoading: true,
      radioButtonsforStartAs: [
        {
          label: "1",
          value: "1",
          checked: true,
          color: "#323232",
          disabled: false,
          width: "33.33%",
          size: 6
        },
        {
          label: "2",
          value: "2",
          checked: false,
          color: "#323232",
          disabled: false,
          width: "33.33%",
          size: 6
        },
        {
          label: "Other",
          value: "other",
          checked: false,
          color: "#323232",
          disabled: false,
          width: "33.33%",
          size: 6
        }
      ]
    };
  }

  //calls when component load
  componentDidMount() {
    this.ProjectHospitalSpinner();
  }

  // To get hospital list
  ProjectHospitalSpinner = async () => {
    const { params } = this.props.navigation.state;
    return fetch(
      CONSTANT.BaseUrl +
        "taxonomies/get_posts_by_post_type?post_type=hospitals",
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
        let projectHospital = responseJson;
        this.setState(
          {
            projectHospital
          },
          this.ProjectIntervalSpinner
        );
      })
      .catch(error => {
        console.error(error);
      });
  };

  // To get all Intervals
  ProjectIntervalSpinner = async () => {
    const { params } = this.props.navigation.state;
    return fetch(CONSTANT.BaseUrl + "taxonomies/get_list?list=intervals", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        let projectInterval = responseJson;
        this.setState({ projectInterval }, this.ProjectDurationSpinner);
      })
      .catch(error => {
        console.error(error);
      });
  };

  // To get duration list
  ProjectDurationSpinner = async () => {
    const { params } = this.props.navigation.state;
    return fetch(CONSTANT.BaseUrl + "taxonomies/get_list?list=durations", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        let projectDuration = responseJson;
        this.setState(
          {
            projectDuration
          },
          this.ProjectStartTimeSpinner
        );
      })
      .catch(error => {
        console.error(error);
      });
  };

  // To get all slots list
  ProjectStartTimeSpinner = async () => {
    const { params } = this.props.navigation.state;
    return fetch(CONSTANT.BaseUrl + "taxonomies/get_list?list=time", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        let projectStartTime = responseJson;
        this.setState(
          {
            projectStartTime
          },
          this.ProjectEndTimeSpinner
        );
      })
      .catch(error => {
        console.error(error);
      });
  };

  // To get all slots list
  ProjectEndTimeSpinner = async () => {
    const { params } = this.props.navigation.state;
    return fetch(CONSTANT.BaseUrl + "taxonomies/get_list?list=time", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        let projectEndTime = responseJson;
        this.setState(
          {
            projectEndTime,
            isLoading: false
          },
          this.ProjectServicesSpinner
        );
      })
      .catch(error => {
        console.error(error);
        this.setState({
          isLoading: false
        });
      });
  };

  ProjectServicesSpinner = async () => {
    const id = await AsyncStorage.getItem("projectProfileId");
    const {
      projectHospitalKnown,
      projectServices,
      projectSpecialityServices
    } = this.state;
    const response = await fetch(
      CONSTANT.BaseUrl + "taxonomies/get_list?list=services&profile_id=" + id
    );
    const json = await response.json();

    console.log("Data", JSON.stringify(json));
    console.log(json);
    if (Array.isArray(json) && json && json.type && json.type === "error") {
      this.setState({ projectServices: [] }, this.ProjectDaysSpinner); // empty data set
    } else {
      this.setState({ projectServices: json }, this.ProjectDaysSpinner);
    }
  };

  // To get all days list
  ProjectDaysSpinner = async () => {
    const { params } = this.props.navigation.state;
    return fetch(CONSTANT.BaseUrl + "taxonomies/get_list?list=week_days", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        let projectDays = responseJson;
        this.setState({
          projectDays
        });
      })
      .catch(error => {
        console.error(error);
      });
  };
  createRequiredArray = index => {
    this.state.service[index] = this.state.projectSelectedServiceKnown;
    var array = this.state.service;

    var filtered = array.filter(function(el) {
      return el != null;
    });
  };
  PostLocationData = async () => {
    let selectedItemforStartAs = this.state.radioButtonsforStartAs.find(
      e => e.checked == true
    );
    selectedItemforStartAs = selectedItemforStartAs
      ? selectedItemforStartAs.value
      : this.state.radioButtonsforStartAs[0].value;
    const Uid = await AsyncStorage.getItem("projectUid");

    const {
      title,
      desc,
      base64_string,
      articleCategoryKnown,
      name,
      type,
      path,
      customSpaces,
      fee,
      service
    } = this.state;
    var array = this.state.service;

    console.log(
      "Data:",
      " id " +
        Uid +
        " projectDaysKnown  " +
        this.state.projectDaysKnown +
        " selectedItemforStartAs  " +
        selectedItemforStartAs +
        " projectSelectedServiceKnown  " +
        this.state.projectSelectedServiceKnown +
        "  projectHospitalKnown  " +
        this.state.projectHospitalKnown +
        " projectIntervalKnown  " +
        this.state.projectIntervalKnown +
        " projectDurationKnown   " +
        this.state.projectDurationKnown +
        " projectprojectStartTimeKnown  " +
        this.state.projectprojectStartTimeKnown +
        "  projectprojectEndTimeKnown  " +
        this.state.projectprojectEndTimeKnown
    );
    axios
      .post(CONSTANT.BaseUrl + "appointments/appointment_settings", {
        hospital_id: this.state.projectHospitalKnown.toString(),
        start_time: this.state.projectprojectStartTimeKnown.toString(),
        end_time: this.state.projectprojectEndTimeKnown.toString(),
        intervals: this.state.projectIntervalKnown.toString(),
        durations: this.state.projectDurationKnown.toString(),
        service: array,
        spaces: selectedItemforStartAs,
        week_days: this.state.projectDaysKnown,
        custom_spaces: customSpaces,
        doctor_id: Uid,
        consultant_fee: fee
      })
      .then(async response => {
        if (response.status === 200) {
          this.setState({ isUpdatingLoader: false });
          Alert.alert("Actualizado con éxito", response.data.message);
          console.log(response);
          this.setState({
            isLoading: false
          });
        } else if (response.status === 203) {
          Alert.alert("Error", response.data.message);
          console.log(response);
          this.setState({
            isLoading: false
          });
        }
      })
      .catch(error => {
        Alert.alert(error);
        console.log(error);
      });
  };

  calculateEndTime = () => {};
  // openTimePicker = () =>{
  //   const { selectedHours, selectedMinutes } = this.state;
  //   return(
  //     Alert.alert("hello" , <TimePicker
  //     selectedHours={selectedHours}
  //     selectedMinutes={selectedMinutes}
  //     onChange={(hours, minutes) => this.setState({ selectedHours: hours, selectedMinutes: minutes })}
  //   />)

  //   );
  // }

  AddLocation = () => {
    const {
      projectHospitalKnown,
      projectIntervalKnown,
      projectDurationKnown,
      projectSlotsKnown,
      projectDaysKnown
    } = this.state;
  };

  render() {
    let selectedItemforStartAs = this.state.radioButtonsforStartAs.find(
      e => e.checked == true
    );
    selectedItemforStartAs = selectedItemforStartAs
      ? selectedItemforStartAs.value
      : this.state.radioButtonsforStartAs[0].value;
    const { selectedHours, selectedMinutes, isLoading } = this.state;

    return (
      <View style={styles.container}>
        {isLoading ? (
          <View style={{ justifyContent: "center", height: "100%" }}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={{
                height: 30,
                width: 30,
                borderRadius: 60,
                alignContent: "center",
                alignSelf: "center",
                justifyContent: "center",
                backgroundColor: "#fff",
                elevation: 5
              }}
            />
          </View>
        ) : null}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: "#fff", borderRadius: 5, margin: 10 }}
        >
          <Text
            style={{
              color: "#3d4461",
              width: "70%",
              fontSize: 20,
              fontFamily:CONSTANT.PoppinsBold,
              marginBottom: 15,
              marginLeft: 10,
              marginTop: 10
            }}
          >
            Add New Location
          </Text>
          <View
            style={{
              marginLeft: 10,
              marginRight: 10,
              marginBottom: 10,
              marginTop: 10
            }}
          >
            <MultiSelect
              ref={component => {
                this.multiSelect = component;
              }}
              onSelectedItemsChange={value =>
                this.setState({
                  projectHospitalKnown: value
                })
              }
              uniqueKey="id"
              items={this.state.projectHospital}
              selectedItems={this.state.projectHospitalKnown}
              borderBottomWidth={0}
              single={true}
              searchInputPlaceholderText="Pick Hospital..."
              selectText="Pick Hospital"
              styleMainWrapper={{
                backgroundColor: "#fff",
                borderRadius: 4,
                marginTop: 10
              }}
              styleDropdownMenuSubsection={{
                backgroundColor: "#fff",
                paddingRight: -7,
                height: 60,
                paddingLeft: 10,
                borderWidth: 0.6,
                borderColor: "#fff",
                borderColor: "#dddddd",
                borderRadius: 4
              }}
              displayKey="name"
              submitButtonText="Submit"
            />
          </View>

          <View style={{ marginLeft: 10, marginRight: 10, marginBottom: 10 }}>
            <MultiSelect
              ref={component => {
                this.multiSelect = component;
              }}
              onSelectedItemsChange={value =>
                this.setState({
                  projectIntervalKnown: value
                })
              }
              uniqueKey="key"
              items={this.state.projectInterval}
              selectedItems={this.state.projectIntervalKnown}
              borderBottomWidth={0}
              single={true}
              searchInputPlaceholderText="Pick Interval..."
              selectText="Pick Interval"
              styleMainWrapper={{
                backgroundColor: "#fff",
                borderRadius: 4,
                marginTop: 10
              }}
              styleDropdownMenuSubsection={{
                backgroundColor: "#fff",
                paddingRight: -7,
                height: 60,
                paddingLeft: 10,
                borderWidth: 0.6,
                borderColor: "#fff",
                borderColor: "#dddddd",
                borderRadius: 4
              }}
              displayKey="val"
              submitButtonText="Submit"
            />
          </View>

          <View style={{ marginLeft: 10, marginRight: 10, marginBottom: 10 }}>
            <MultiSelect
              ref={component => {
                this.multiSelect = component;
              }}
              onSelectedItemsChange={value =>
                this.setState({
                  projectDurationKnown: value
                })
              }
              uniqueKey="key"
              items={this.state.projectDuration}
              selectedItems={this.state.projectDurationKnown}
              borderBottomWidth={0}
              single={true}
              searchInputPlaceholderText="Pick Duration..."
              selectText="Pick Duration"
              styleMainWrapper={{
                backgroundColor: "#fff",
                borderRadius: 4,
                marginTop: 10
              }}
              styleDropdownMenuSubsection={{
                backgroundColor: "#fff",
                paddingRight: -7,
                height: 60,
                paddingLeft: 10,
                borderWidth: 0.6,
                borderColor: "#fff",
                borderColor: "#dddddd",
                borderRadius: 4
              }}
              displayKey="val"
              submitButtonText="Submit"
            />
          </View>

          <View style={{ marginLeft: 10, marginRight: 10, marginBottom: 10 }}>
            <MultiSelect
              ref={component => {
                this.multiSelect = component;
              }}
              onSelectedItemsChange={value =>
                this.setState({
                  projectprojectStartTimeKnown: value
                })
              }
              uniqueKey="key"
              items={this.state.projectStartTime}
              selectedItems={this.state.projectprojectStartTimeKnown}
              borderBottomWidth={0}
              single={true}
              searchInputPlaceholderText="Pick Start Time..."
              selectText="Pick Start Time"
              styleMainWrapper={{
                backgroundColor: "#fff",
                borderRadius: 4,
                marginTop: 10
              }}
              styleDropdownMenuSubsection={{
                backgroundColor: "#fff",
                paddingRight: -7,
                height: 60,
                paddingLeft: 10,
                borderWidth: 0.6,
                borderColor: "#fff",
                borderColor: "#dddddd",
                borderRadius: 4
              }}
              displayKey="val"
              submitButtonText="Submit"
            />
          </View>

          <View style={{ marginLeft: 10, marginRight: 10, marginBottom: 10 }}>
            <MultiSelect
              ref={component => {
                this.multiSelect = component;
              }}
              onSelectedItemsChange={value =>
                this.setState({
                  projectprojectEndTimeKnown: value
                })
              }
              uniqueKey="key"
              items={this.state.projectEndTime}
              selectedItems={this.state.projectprojectEndTimeKnown}
              borderBottomWidth={0}
              single={true}
              searchInputPlaceholderText="Pick End Time..."
              selectText="Pick End Time"
              styleMainWrapper={{
                backgroundColor: "#fff",
                borderRadius: 4,
                marginTop: 10
              }}
              styleDropdownMenuSubsection={{
                backgroundColor: "#fff",
                paddingRight: -7,
                height: 60,
                paddingLeft: 10,
                borderWidth: 0.6,
                borderColor: "#fff",
                borderColor: "#dddddd",
                borderRadius: 4
              }}
              displayKey="val"
              submitButtonText="Submit"
            />
          </View>
          {this.state.projectServices && (
            <View>
              <Text
                style={{
                  color: "#3d4461",
                  width: "70%",
                  fontSize: 20,
                  fontFamily:CONSTANT.PoppinsBold,
                  marginBottom: 15,
                  marginLeft: 10,
                  marginTop: 10
                }}
              >
                Available Services:
              </Text>
              <FlatList
                style={{ paddingLeft: 5, marginBottom: 10 }}
                data={this.state.projectServices}
                extraData={this.state}
                renderItem={({ item, index }) => (
                  <Collapse>
                    <CollapseHeader
                      style={{ height: 70, marginTop: 10, marginBottom: 15 }}
                    >
                      <View
                        style={{
                          backgroundColor: "#ffffff",
                          elevation: 3,
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.2,
                          shadowColor: "#000",
                          marginRight: 10,
                          marginTop: 10,
                          marginLeft: 3,
                          marginBottom: 10,
                          borderRadius: 4,
                          height: 70
                        }}
                      >
                        <TouchableOpacity>
                          <View style={styles.mainLayoutServices}>
                            <Image
                              resizeMode="cover"
                              style={styles.ImageStyle}
                              source={{ uri: item.logo }}
                            />
                            <View
                              style={{
                                borderLeftColor: "#dddddd",
                                borderLeftWidth: 0.6,
                                paddingTop: 20
                              }}
                            />
                            {/* <Text
                              numberOfLines={1}
                              style={styles.mainServiceName}>
                              {item.title}
                            </Text> */}
                            <HTML
                              numberOfLines={1}
                              html={item.title}
                              containerStyle={styles.mainServiceName}
                              imagesMaxWidth={Dimensions.get("window").width}
                            />
                          </View>
                        </TouchableOpacity>

                        <AntIcon
                          name="down"
                          color={"#484848"}
                          size={17}
                          style={{
                            alignSelf: "flex-end",
                            marginTop: -62,
                            padding: 20
                          }}
                        />
                      </View>
                    </CollapseHeader>
                    <CollapseBody>
                      <View>
                        <View
                          style={{
                            marginLeft: 10,
                            marginRight: 10,
                            marginTop: 10,
                            marginBottom: 10
                          }}
                        >
                          <MultiSelect
                            ref={component => {
                              this.multiSelect = component;
                            }}
                            onSelectedItemsChange={value =>
                              this.setState(
                                {
                                  projectSelectedServiceKnown: value
                                },
                                this.createRequiredArray(
                                  this.state.projectServices[index].id
                                )
                              )
                            }
                            uniqueKey="service_id"
                            items={this.state.projectServices[index].services}
                            selectedItems={
                              this.state.projectSelectedServiceKnown
                            }
                            borderBottomWidth={0}
                            searchInputPlaceholderText="Pick Service..."
                            selectText="Pick Service"
                            styleMainWrapper={{
                              backgroundColor: "#fff",
                              borderRadius: 4,
                              marginTop: 10
                            }}
                            styleDropdownMenuSubsection={{
                              backgroundColor: "#fff",
                              paddingRight: -7,
                              height: 60,
                              paddingLeft: 10,
                              borderWidth: 0.6,
                              borderColor: "#fff",
                              borderColor: "#dddddd",
                              borderRadius: 4
                            }}
                            displayKey="title"
                            submitButtonText="Submit"
                          />
                        </View>
                      </View>
                    </CollapseBody>
                  </Collapse>
                )}
              />
            </View>
          )}
          <Text
            style={{
              color: "#3d4461",
              width: "70%",
              fontSize: 20,
              fontFamily:CONSTANT.PoppinsBold,
              marginBottom: 15,
              marginLeft: 10,
              marginTop: 10
            }}
          >
            Assign Appointment Spaces:
          </Text>
          <RadioGroup
            color={CONSTANT.primaryColor}
            labelStyle={{ fontSize: 14 }}
            radioButtons={this.state.radioButtonsforStartAs}
            onPress={radioButtons => this.setState({ radioButtons })}
            style={{
              paddingTop: 0,
              flexDirection: "row",
              marginBottom: 10,
              marginTop: 0,
              marginLeft: 25,
              display: "flex",
              width: "100%",
              alignSelf: "center",
              alignContent: "center",
              textAlign: "center"
            }}
          />
          {selectedItemforStartAs == "other" && (
            <TextInput
              underlineColorAndroid="transparent"
              placeholderTextColor="#7F7F7F"
              placeholder="Other Value"
              style={styles.TextInputLayout}
              onChangeText={customSpaces => this.setState({ customSpaces })}
            />
          )}
          <Text
            style={{
              color: "#3d4461",
              width: "70%",
              fontSize: 20,
              fontFamily:CONSTANT.PoppinsBold,
              marginBottom: 15,
              marginLeft: 10,
              marginTop: 10
            }}
          >
            Days I Offer My Services:
          </Text>
          <View style={{ marginLeft: 10, marginRight: 10, marginBottom: 10 }}>
            <MultiSelect
              ref={component => {
                this.multiSelect = component;
              }}
              onSelectedItemsChange={value =>
                this.setState({
                  projectDaysKnown: value
                })
              }
              uniqueKey="key"
              items={this.state.projectDays}
              selectedItems={this.state.projectDaysKnown}
              borderBottomWidth={0}
              searchInputPlaceholderText="Pick Days..."
              selectText="Pick Days"
              styleMainWrapper={{
                backgroundColor: "#fff",
                borderRadius: 4,
                marginTop: 10
              }}
              styleDropdownMenuSubsection={{
                backgroundColor: "#fff",
                paddingRight: -7,
                height: 60,
                paddingLeft: 10,
                borderWidth: 0.6,
                borderColor: "#fff",
                borderColor: "#dddddd",
                borderRadius: 4
              }}
              displayKey="val"
              submitButtonText="Submit"
            />
          </View>

          <TextInput
            underlineColorAndroid="transparent"
            placeholderTextColor="#7F7F7F"
            placeholder="Consultancy Fee"
            style={styles.TextInputLayout}
            onChangeText={fee => this.setState({ fee })}
          />
          <TouchableOpacity
            onPress={this.PostLocationData}
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
                paddingTop: 10,

                fontFamily:CONSTANT.PoppinsMedium,
              }}
            >
              Save & Update
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}
export default withNavigation(AddSetting);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7"
  },
  TextInputLayout: {
    minHeight: 45,
    color: "#323232",
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 2,
    borderWidth: 0.6,
    borderColor: "#dddddd",
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    fontFamily:CONSTANT.PoppinsMedium,
  },
  mainServiceName: {
    color: "#484848",
    fontSize: 15,
    margin: 24,
    fontFamily:CONSTANT.PoppinsMedium,
  },
  ImageStyle: {
    margin: 15,
    width: 35,
    height: 35
  },
  mainLayoutServices: {
    flexDirection: "row",
    height: 70
  }
});
