import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  ScrollView,
  Text,
  TextInput,
  Image,
  FlatList,
  ActivityIndicator
} from "react-native";
import StarRating from "react-native-star-rating";
import { Input, InputProps, Button } from "react-native-ui-kitten";
import AntIcon from "react-native-vector-icons/AntDesign";
import { RadioGroup } from "react-native-btr";
import CustomHeader from "../Header/CustomHeader";
import * as CONSTANT from "../Constants/Constant";
import axios from "axios";
import MultiSelect from "react-native-multiple-select";
import { withNavigation, DrawerActions } from "react-navigation";
import {
  Collapse,
  CollapseHeader,
  CollapseBody
} from "accordion-collapse-react-native";

class LocationDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchLocation: [],
      fetchLocationMondaySlots: [],
      fetchLocationTuesdaySlots: [],
      fetchLocationWednesdaySlots: [],
      fetchLocationThursdaySlots: [],
      fetchLocationFridaySlots: [],
      fetchLocationSaturdaySlots: [],
      fetchLocationSundaySlots: [],
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
      Monday: "mon",
      service: [],
      isLoading: true,
      radioButtonsforStartAsMon: [
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
      ],

      radioButtonsforStartAsTue: [
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
      ],

      radioButtonsforStartAsWed: [
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
      ],

      radioButtonsforStartAsThur: [
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
      ],

      radioButtonsforStartAsFri: [
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
      ],

      radioButtonsforStartAsSat: [
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
      ],

      radioButtonsforStartAsSun: [
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
  componentDidMount() {
    this.fetchLocationDetail();
    this.ProjectIntervalSpinner();
  }

  fetchLocationDetail = async () => {
    const { params } = this.props.navigation.state;
    const id = await AsyncStorage.getItem("projectUid");

    const response = await fetch(
      CONSTANT.BaseUrl +
        "team/get_team_details?team_id=" +
        JSON.stringify(params.id) +
        "&user_id=" +
        id
    );
    const json = await response.json();

    if (
      Array.isArray(json) &&
      json[0] &&
      json[0].type &&
      json[0].type === "error"
    ) {
      this.setState({ fetchLocation: [], isLoading: false }); // empty data set
    } else {
      this.setState({ fetchLocation: json[0] });
      this.setState({ fetchLocationMondaySlots: json[0].slots.mon });
      this.setState({ fetchLocationTuesdaySlots: json[0].slots.tue });
      this.setState({ fetchLocationWednesdaySlots: json[0].slots.wed });
      this.setState({ fetchLocationThursdaySlots: json[0].slots.thu });
      this.setState({ fetchLocationFridaySlots: json[0].slots.fri });
      this.setState({ fetchLocationSaturdaySlots: json[0].slots.sat });
      this.setState({
        fetchLocationSundaySlots: json[0].slots.sun,
        isLoading: false
      });
    }
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
            projectEndTime
          },
          this.ProjectServicesSpinner
        );
      })
      .catch(error => {
        console.error(error);
      });
  };

  AddSlotsForMonady = async () => {
    Alert.alert("I am in ");
    let selectedItemforStartAsMon = this.state.radioButtonsforStartAsMon.find(
      e => e.checked == true
    );
    selectedItemforStartAsMon = selectedItemforStartAsMon
      ? selectedItemforStartAsMon.value
      : this.state.radioButtonsforStartAsMon[0].value;
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
    const { params } = this.props.navigation.state;
    axios
      .post(CONSTANT.BaseUrl + "team/update_slot", {
        start_time: this.state.projectprojectStartTimeKnown.toString(),
        end_time: this.state.projectprojectEndTimeKnown.toString(),
        intervals: this.state.projectIntervalKnown.toString(),
        durations: this.state.projectDurationKnown.toString(),
        spaces: selectedItemforStartAsMon,
        week_day: "mon",
        custom_spaces: customSpaces,
        user_id: Uid,
        post_id: params.id
      })
      .then(async response => {
        if (response.status === 200) {
          this.setState({ isUpdatingLoader: false });
          Alert.alert("Updated Successfully", response.data.message);
          this.fetchLocationDetail();
          console.log(response);
        } else if (response.status === 203) {
          Alert.alert("Error", response.data.message);
          console.log(response);
        }
      })
      .catch(error => {
        Alert.alert(error);
        console.log(error);
      });
  };
  AddSlotsForTuesday = () => {};
  AddSlotsForWednesday = () => {};
  AddSlotsForThursday = () => {};
  AddSlotsForFriday = () => {};
  AddSlotsForSaturday = () => {};
  AddSlotsForSunday = () => {};

  DeleteAllSlotsForMonday = async () => {
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
    const { params } = this.props.navigation.state;
    axios
      .post(CONSTANT.BaseUrl + "team/remove_slot", {
        day: "mon",
        user_id: Uid,
        id: params.id
      })
      .then(async response => {
        if (response.status === 200) {
          this.setState({ isUpdatingLoader: false });
          Alert.alert("Updated Successfully", response.data.message);
          this.fetchLocationDetail();
          console.log(response);
        } else if (response.status === 203) {
          Alert.alert("Error", response.data.message);
          console.log(response);
        }
      })
      .catch(error => {
        Alert.alert(error);
        console.log(error);
      });
  };
  DeleteAllSlotsForTuesday = () => {};
  DeleteAllSlotsForWednesday = () => {};
  DeleteAllSlotsForThursday = () => {};
  DeleteAllSlotsForFriday = () => {};
  DeleteAllSlotsForSaturday = () => {};
  DeleteAllSlotsForSunday = () => {};

  render() {
    let selectedItemforStartAsMon = this.state.radioButtonsforStartAsMon.find(
      e => e.checked == true
    );
    selectedItemforStartAsMon = selectedItemforStartAsMon
      ? selectedItemforStartAsMon.value
      : this.state.radioButtonsforStartAsMon[0].value;
    // const {selectedHours, selectedMinutes} = this.state;

    let selectedItemforStartAsTue = this.state.radioButtonsforStartAsTue.find(
      e => e.checked == true
    );
    selectedItemforStartAsTue = selectedItemforStartAsTue
      ? selectedItemforStartAsTue.value
      : this.state.radioButtonsforStartAsTue[0].value;
    // const {selectedHours, selectedMinutes} = this.state;

    let selectedItemforStartAsWed = this.state.radioButtonsforStartAsWed.find(
      e => e.checked == true
    );
    selectedItemforStartAsWed = selectedItemforStartAsWed
      ? selectedItemforStartAsWed.value
      : this.state.radioButtonsforStartAsWed[0].value;
    // const {selectedHours, selectedMinutes} = this.state;

    let selectedItemforStartAsThur = this.state.radioButtonsforStartAsThur.find(
      e => e.checked == true
    );
    selectedItemforStartAsThur = selectedItemforStartAsThur
      ? selectedItemforStartAsThur.value
      : this.state.radioButtonsforStartAsThur[0].value;
    // const {selectedHours, selectedMinutes} = this.state;

    let selectedItemforStartAsFri = this.state.radioButtonsforStartAsFri.find(
      e => e.checked == true
    );
    selectedItemforStartAsFri = selectedItemforStartAsFri
      ? selectedItemforStartAsFri.value
      : this.state.radioButtonsforStartAsFri[0].value;
    // const {selectedHours, selectedMinutes} = this.state;

    let selectedItemforStartAsSat = this.state.radioButtonsforStartAsSat.find(
      e => e.checked == true
    );
    selectedItemforStartAsSat = selectedItemforStartAsSat
      ? selectedItemforStartAsSat.value
      : this.state.radioButtonsforStartAsSat[0].value;
    // const {selectedHours, selectedMinutes} = this.state;

    let selectedItemforStartAsSun = this.state.radioButtonsforStartAsSun.find(
      e => e.checked == true
    );
    selectedItemforStartAsSun = selectedItemforStartAsSun
      ? selectedItemforStartAsSun.value
      : this.state.radioButtonsforStartAsSun[0].value;
    // const {selectedHours, selectedMinutes} = this.state;

    const {
      fetchLocation,
      fetchLocationMondaySlots,
      fetchLocationTuesdaySlots,
      fetchLocationThursdaySlots,
      fetchLocationWednesdaySlots,
      fetchLocationFridaySlots,
      fetchLocationSaturdaySlots,
      fetchLocationSundaySlots,
      isLoading
    } = this.state;
    return (
      <View style={styles.container}>
        <CustomHeader headerText={"Location Detail"} />
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
        {this.state.fetchLocation && (
          <ScrollView>
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 6,
                margin: 5,
                flexDirection: "row",
                padding: 10,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowColor: "#000",
                elevation: 3
              }}
            >
              <View>
                <Image
                  style={{ width: 75, height: 75, borderRadius: 6 }}
                  source={{ uri: fetchLocation.hospital_img }}
                />
              </View>
              <View
                style={{
                  flexDirection: "column",
                  margin: 10,
                  justifyContent: "center"
                }}
              >
                <Text style={{ color: "#3FABF3", fontSize: 13 , fontFamily:CONSTANT.PoppinsMedium, }}>
                  {fetchLocation.hospital_status}
                </Text>
                <Text
                  style={{
                    color: "#3D4461",
                    fontFamily:CONSTANT.PoppinsBold,
                    fontSize: 16
                  }}
                >
                  {fetchLocation.hospital_name}
                </Text>
                <FlatList
                  style={{}}
                  data={this.state.fetchLocation.week_days}
                  ListEmptyComponent={this._listEmptyComponent}
                  keyExtractor={(x, i) => i.toString()}
                  renderItem={({ item }) => (
                    <View>
                      <Text
                        style={{
                          color: "#858585",
                          fontSize: 12,
                          marginRight: 5,
                          fontFamily:CONSTANT.PoppinsMedium,
                        }}
                      >
                        {item}
                      </Text>
                    </View>
                  )}
                  horizontal={true}
                />
              </View>
            </View>
            <Text
              style={{
                color: "#3d4461",
                width: "70%",
                fontSize: 18,
                fontFamily:CONSTANT.PoppinsBold,
                marginBottom: 15,
                marginLeft: 10,
                marginTop: 10
              }}
            >
              Days I Offer My Services:
            </Text>
            <View style={{ paddingBottom: 10 }}>
              {fetchLocationMondaySlots && (
                <Collapse>
                  <CollapseHeader
                    style={{ height: 70, marginTop: 5, marginBottom: 5 }}
                  >
                    <View
                      style={{
                        backgroundColor: "#ffffff",
                        elevation: 3,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowColor: "#000",
                        marginRight: 10,
                        marginTop: 5,
                        marginLeft: 10,
                        marginBottom: 5,
                        borderRadius: 4,
                        height: 70
                      }}
                    >
                      <TouchableOpacity>
                        <View style={styles.mainLayoutServices}>
                          <Text
                            numberOfLines={1}
                            style={styles.mainServiceName}
                          >
                            Monday
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <AntIcon
                        name="edit"
                        color={"#2FBC9C"}
                        size={17}
                        style={{
                          alignSelf: "flex-end",
                          marginTop: -62,
                          padding: 20
                        }}
                      />
                    </View>
                  </CollapseHeader>
                  <CollapseBody style={{ width: "100%" }}>
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignSelf: "center",
                          marginTop: 10
                        }}
                      >
                        {fetchLocationMondaySlots.length != 0 && (
                          <TouchableOpacity
                            onPress={this.DeleteAllSlotsForMonday}
                            style={{
                              alignItems: "center",
                              height: 40,
                              margin: 10,
                              borderRadius: 4,
                              width: "25%",
                              alignSelf: "center",
                              backgroundColor: "#F95851"
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
                              Delete All
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      <FlatList
                        style={{
                          alignSelf: "center",
                          marginLeft: 10,
                          marginRight: 10
                        }}
                        data={this.state.fetchLocationMondaySlots}
                        extraData={this.state}
                        renderItem={({ item, index }) => (
                          <TouchableOpacity
                            onPress={() => this.selectedSlotData(item)}
                            style={{
                              flexDirection: "column",
                              margin: 3,
                              width: "48%",
                              backgroundColor: "#fff",
                              borderRadius: 5,
                              height: 45,
                              borderColor: CONSTANT.primaryColor,
                              borderWidth: 0.6,
                              justifyContent: "center",
                              alignItems: "center"
                            }}
                          >
                            <Text
                              style={{
                                fontFamily:CONSTANT.PoppinsBold,
                                fontSize: 13,
                                marginHorizontal: 10
                              }}
                            >
                              {item.start_time} - {item.end_time}
                            </Text>
                            <Text style={{ fontSize: 10  , fontFamily:CONSTANT.PoppinsMedium,}}>
                              Space: {item.spaces}
                            </Text>
                          </TouchableOpacity>
                        )}
                        numColumns={2}
                      />
                    </View>

                    <View
                      style={{
                        backgroundColor: "#f7f7f7",
                        borderRadius: 5,
                        elevation: 5,
                        margin: 10,
                        paddingTop: 10
                      }}
                    >
                      <Text
                        style={{
                          color: "#3d4461",
                          width: "70%",
                          fontSize: 18,
                          fontFamily:CONSTANT.PoppinsBold,
                          marginBottom: 15,
                          marginLeft: 10,
                          marginTop: 10
                        }}
                      >
                        Add New Slot:
                      </Text>
                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                      >
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

                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                      >
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

                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                      >
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
                          selectedItems={
                            this.state.projectprojectStartTimeKnown
                          }
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

                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                      >
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
                      <Text
                        style={{
                          color: "#3d4461",
                          width: "70%",
                          fontSize: 18,
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
                        radioButtons={this.state.radioButtonsforStartAsMon}
                        onPress={radioButtons =>
                          this.setState({ radioButtons })
                        }
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
                      {selectedItemforStartAsMon == "other" && (
                        <TextInput
                          underlineColorAndroid="transparent"
                          placeholderTextColor="#7F7F7F"
                          placeholder="Other Value"
                          style={styles.TextInputLayout}
                          onChangeText={customSpaces =>
                            this.setState({ customSpaces })
                          }
                        />
                      )}
                      <TouchableOpacity
                        onPress={this.AddSlotsForMonady}
                        style={{
                          alignItems: "center",
                          height: 40,
                          margin: 10,
                          borderRadius: 4,
                          width: "25%",
                          alignSelf: "center",
                          backgroundColor: "#2FBC9C"
                        }}
                      >
                        <Text
                          style={{
                            alignSelf: "center",
                            alignItems: "center",
                            textAlign: "center",
                            color: "#fff",
                            paddingTop: 10,
                            fontFamily: CONSTANT.PoppinsMedium
                          }}
                        >
                          Add More
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </CollapseBody>
                </Collapse>
              )}

              {fetchLocationTuesdaySlots && (
                <Collapse>
                  <CollapseHeader
                    style={{ height: 70, marginTop: 5, marginBottom: 5 }}
                  >
                    <View
                      style={{
                        backgroundColor: "#ffffff",
                        elevation: 3,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowColor: "#000",
                        marginRight: 10,
                        marginTop: 5,
                        marginLeft: 10,
                        marginBottom: 5,
                        borderRadius: 4,
                        height: 70
                      }}
                    >
                      <TouchableOpacity>
                        <View style={styles.mainLayoutServices}>
                          <Text
                            numberOfLines={1}
                            style={styles.mainServiceName}
                          >
                            Tuesday
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <AntIcon
                        name="edit"
                        color={"#2FBC9C"}
                        size={17}
                        style={{
                          alignSelf: "flex-end",
                          marginTop: -42,
                          marginRight: 20
                        }}
                      />
                    </View>
                  </CollapseHeader>
                  <CollapseBody style={{ width: "100%" }}>
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignSelf: "center",
                          marginTop: 10
                        }}
                      >
                        {fetchLocationTuesdaySlots.length != 0 && (
                          <TouchableOpacity
                            onPress={this.DeleteAllSlotsForTuesday}
                            style={{
                              alignItems: "center",
                              height: 40,
                              margin: 10,
                              borderRadius: 4,
                              width: "25%",
                              alignSelf: "center",
                              backgroundColor: "#F95851"
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
                              Delete All
                            </Text>
                          </TouchableOpacity>
                        )}

                        <View
                          style={{
                            backgroundColor: "#fff",
                            borderRadius: 5,
                            elevation: 5
                          }}
                        ></View>
                      </View>

                      <FlatList
                        style={{
                          alignSelf: "center",
                          marginLeft: 10,
                          marginRight: 10
                        }}
                        data={this.state.fetchLocationTuesdaySlots}
                        extraData={this.state}
                        renderItem={({ item, index }) => (
                          <TouchableOpacity
                            style={{
                              flexDirection: "column",
                              margin: 3,
                              width: "48%",
                              backgroundColor: "#fff",
                              borderRadius: 5,
                              height: 45,
                              borderColor: CONSTANT.primaryColor,
                              borderWidth: 0.6,
                              justifyContent: "center",
                              alignItems: "center"
                            }}
                          >
                            <Text
                              style={{
                                fontFamily:CONSTANT.PoppinsBold,
                                fontSize: 13,
                                marginHorizontal: 10
                              }}
                            >
                              {item.start_time} - {item.end_time}
                            </Text>
                            <Text style={{ fontSize: 10  , fontFamily:CONSTANT.PoppinsMedium,}}>
                              Space: {item.spaces}
                            </Text>
                          </TouchableOpacity>
                        )}
                        numColumns={2}
                      />
                    </View>
                    <View
                      style={{
                        backgroundColor: "#f7f7f7",
                        borderRadius: 5,
                        elevation: 5,
                        margin: 10,
                        paddingTop: 10
                      }}
                    >
                      <Text
                        style={{
                          color: "#3d4461",
                          width: "70%",
                          fontSize: 18,
                          fontFamily:CONSTANT.PoppinsBold,
                          marginBottom: 15,
                          marginLeft: 10,
                          marginTop: 10
                        }}
                      >
                        Add New Slot:
                      </Text>
                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                      >
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

                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                      >
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

                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                      >
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
                          selectedItems={
                            this.state.projectprojectStartTimeKnown
                          }
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

                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                      >
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
                      <Text
                        style={{
                          color: "#3d4461",
                          width: "70%",
                          fontSize: 18,
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
                        radioButtons={this.state.radioButtonsforStartAsTue}
                        onPress={radioButtons =>
                          this.setState({ radioButtons })
                        }
                        style={{
                          paddingTop: 0,
                          flexDirection: "row",
                          marginBottom: 10,
                          marginTop: 0,
                          marginLeft: 13,
                          display: "flex",
                          width: "100%",
                          alignSelf: "center",
                          alignContent: "center",
                          textAlign: "center"
                        }}
                      />
                      {selectedItemforStartAsTue == "other" && (
                        <TextInput
                          underlineColorAndroid="transparent"
                          placeholderTextColor="#7F7F7F"
                          placeholder="Other Value"
                          style={styles.TextInputLayout}
                          onChangeText={customSpaces =>
                            this.setState({ customSpaces })
                          }
                        />
                      )}
                      <TouchableOpacity
                        onPress={this.AddSlotsForTuesday}
                        style={{
                          alignItems: "center",
                          height: 40,
                          margin: 10,
                          borderRadius: 4,
                          width: "25%",
                          alignSelf: "center",
                          backgroundColor: "#2FBC9C"
                        }}
                      >
                        <Text
                          style={{
                            alignSelf: "center",
                            alignItems: "center",
                            textAlign: "center",
                            color: "#fff",
                            paddingTop: 10,
                            fontFamily: CONSTANT.PoppinsMedium
                          }}
                        >
                          Add More
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </CollapseBody>
                </Collapse>
              )}

              {fetchLocationWednesdaySlots && (
                <Collapse>
                  <CollapseHeader
                    style={{ height: 70, marginTop: 5, marginBottom: 5 }}
                  >
                    <View
                      style={{
                        backgroundColor: "#ffffff",
                        elevation: 3,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowColor: "#000",
                        marginRight: 10,
                        marginTop: 5,
                        marginLeft: 10,
                        marginBottom: 5,
                        borderRadius: 4,
                        height: 70
                      }}
                    >
                      <TouchableOpacity>
                        <View style={styles.mainLayoutServices}>
                          <Text
                            numberOfLines={1}
                            style={styles.mainServiceName}
                          >
                            Wednesday
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <AntIcon
                        name="edit"
                        color={"#2FBC9C"}
                        size={17}
                        style={{
                          alignSelf: "flex-end",
                          marginTop: -42,
                          marginRight: 20
                        }}
                      />
                    </View>
                  </CollapseHeader>
                  <CollapseBody style={{ width: "100%" }}>
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignSelf: "center",
                          marginTop: 10
                        }}
                      >
                        {fetchLocationWednesdaySlots.length != 0 && (
                          <TouchableOpacity
                            onPress={this.DeleteAllSlotsForWednesday}
                            style={{
                              alignItems: "center",
                              height: 40,
                              margin: 10,
                              borderRadius: 4,
                              width: "25%",
                              alignSelf: "center",
                              backgroundColor: "#F95851"
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
                              Delete All
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      <FlatList
                        style={{
                          alignSelf: "center",
                          marginLeft: 10,
                          marginRight: 10
                        }}
                        data={this.state.fetchLocationWednesdaySlots}
                        extraData={this.state}
                        renderItem={({ item, index }) => (
                          <TouchableOpacity
                            onPress={() => this.selectedSlotData(item)}
                            style={{
                              flexDirection: "column",
                              margin: 3,
                              width: "48%",
                              backgroundColor: "#fff",
                              borderRadius: 5,
                              height: 45,
                              borderColor: CONSTANT.primaryColor,
                              borderWidth: 0.6,
                              justifyContent: "center",
                              alignItems: "center"
                            }}
                          >
                            <Text
                              style={{
                                fontFamily:CONSTANT.PoppinsBold,
                                fontSize: 13,
                                marginHorizontal: 10
                              }}
                            >
                              {item.start_time} - {item.end_time}
                            </Text>
                            <Text style={{ fontSize: 10 ,fontFamily:CONSTANT.PoppinsMedium, }}>
                              Space: {item.spaces}
                            </Text>
                          </TouchableOpacity>
                        )}
                        numColumns={2}
                      />
                    </View>
                    <View
                      style={{
                        backgroundColor: "#f7f7f7",
                        borderRadius: 5,
                        elevation: 5,
                        margin: 10,
                        paddingTop: 10
                      }}
                    >
                      <Text
                        style={{
                          color: "#3d4461",
                          width: "70%",
                          fontSize: 18,
                          fontFamily:CONSTANT.PoppinsBold,
                          marginBottom: 15,
                          marginLeft: 10,
                          marginTop: 10
                        }}
                      >
                        Add New Slot:
                      </Text>
                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                      >
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

                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                      >
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

                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                      >
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
                          selectedItems={
                            this.state.projectprojectStartTimeKnown
                          }
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

                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                      >
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
                      <Text
                        style={{
                          color: "#3d4461",
                          width: "70%",
                          fontSize: 18,
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
                        radioButtons={this.state.radioButtonsforStartAsWed}
                        onPress={radioButtons =>
                          this.setState({ radioButtons })
                        }
                        style={{
                          paddingTop: 0,
                          flexDirection: "row",
                          marginBottom: 10,
                          marginTop: 0,
                          marginLeft: 13,
                          display: "flex",
                          width: "100%",
                          alignSelf: "center",
                          alignContent: "center",
                          textAlign: "center"
                        }}
                      />
                      {selectedItemforStartAsWed == "other" && (
                        <TextInput
                          underlineColorAndroid="transparent"
                          placeholderTextColor="#7F7F7F"
                          placeholder="Other Value"
                          style={styles.TextInputLayout}
                          onChangeText={customSpaces =>
                            this.setState({ customSpaces })
                          }
                        />
                      )}
                      <TouchableOpacity
                        onPress={this.AddSlotsForWednesday}
                        style={{
                          alignItems: "center",
                          height: 40,
                          margin: 10,
                          borderRadius: 4,
                          width: "25%",
                          alignSelf: "center",
                          backgroundColor: "#2FBC9C"
                        }}
                      >
                        <Text
                          style={{
                            alignSelf: "center",
                            alignItems: "center",
                            textAlign: "center",
                            color: "#fff",
                            paddingTop: 10,
                            fontFamily: CONSTANT.PoppinsMedium
                          }}
                        >
                          Add More
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </CollapseBody>
                </Collapse>
              )}

              {fetchLocationThursdaySlots && (
                <Collapse>
                  <CollapseHeader
                    style={{ height: 70, marginTop: 5, marginBottom: 5 }}
                  >
                    <View
                      style={{
                        backgroundColor: "#ffffff",
                        elevation: 3,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowColor: "#000",
                        marginRight: 10,
                        marginTop: 5,
                        marginLeft: 10,
                        marginBottom: 5,
                        borderRadius: 4,
                        height: 70
                      }}
                    >
                      <TouchableOpacity>
                        <View style={styles.mainLayoutServices}>
                          <Text
                            numberOfLines={1}
                            style={styles.mainServiceName}
                          >
                            Thursday
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <AntIcon
                        name="edit"
                        color={"#2FBC9C"}
                        size={17}
                        style={{
                          alignSelf: "flex-end",
                          marginTop: -42,
                          marginRight: 20
                        }}
                      />
                    </View>
                  </CollapseHeader>
                  <CollapseBody style={{ width: "100%" }}>
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignSelf: "center",
                          marginTop: 10
                        }}
                      >
                        {fetchLocationThursdaySlots.length != 0 && (
                          <TouchableOpacity
                            onPress={this.DeleteAllSlotsForThursday}
                            style={{
                              alignItems: "center",
                              height: 40,
                              margin: 10,
                              borderRadius: 4,
                              width: "25%",
                              alignSelf: "center",
                              backgroundColor: "#F95851"
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
                              Delete All
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      <FlatList
                        style={{
                          alignSelf: "center",
                          marginLeft: 10,
                          marginRight: 10
                        }}
                        data={this.state.fetchLocationThursdaySlots}
                        extraData={this.state}
                        renderItem={({ item, index }) => (
                          <TouchableOpacity
                            onPress={() => this.selectedSlotData(item)}
                            style={{
                              flexDirection: "column",
                              margin: 3,
                              width: "48%",
                              backgroundColor: "#fff",
                              borderRadius: 5,
                              height: 45,
                              borderColor: CONSTANT.primaryColor,
                              borderWidth: 0.6,
                              justifyContent: "center",
                              alignItems: "center"
                            }}
                          >
                            <Text
                              style={{
                                fontFamily:CONSTANT.PoppinsBold,
                                fontSize: 13,
                                marginHorizontal: 10
                              }}
                            >
                              {item.start_time} - {item.end_time}
                            </Text>
                            <Text style={{ fontSize: 10  , fontFamily:CONSTANT.PoppinsMedium,}}>
                              Space: {item.spaces}
                            </Text>
                          </TouchableOpacity>
                        )}
                        numColumns={2}
                      />
                    </View>
                    <View
                      style={{
                        backgroundColor: "#f7f7f7",
                        borderRadius: 5,
                        elevation: 5,
                        margin: 10,
                        paddingTop: 10
                      }}
                    >
                      <Text
                        style={{
                          color: "#3d4461",
                          width: "70%",
                          fontSize: 18,
                          fontFamily:CONSTANT.PoppinsBold,
                          marginBottom: 15,
                          marginLeft: 10,
                          marginTop: 10
                        }}
                      >
                        Add New Slot:
                      </Text>
                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                      >
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

                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                      >
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

                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                      >
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
                          selectedItems={
                            this.state.projectprojectStartTimeKnown
                          }
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

                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                      >
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
                      <Text
                        style={{
                          color: "#3d4461",
                          width: "70%",
                          fontSize: 18,
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
                        radioButtons={this.state.radioButtonsforStartAsThur}
                        onPress={radioButtons =>
                          this.setState({ radioButtons })
                        }
                        style={{
                          paddingTop: 0,
                          flexDirection: "row",
                          marginBottom: 10,
                          marginTop: 0,
                          marginLeft: 13,
                          display: "flex",
                          width: "100%",
                          alignSelf: "center",
                          alignContent: "center",
                          textAlign: "center"
                        }}
                      />
                      {selectedItemforStartAsThur == "other" && (
                        <TextInput
                          underlineColorAndroid="transparent"
                          placeholderTextColor="#7F7F7F"
                          placeholder="Other Value"
                          style={styles.TextInputLayout}
                          onChangeText={customSpaces =>
                            this.setState({ customSpaces })
                          }
                        />
                      )}
                      <TouchableOpacity
                        onPress={this.AddSlotsForThursday}
                        style={{
                          alignItems: "center",
                          height: 40,
                          margin: 10,
                          borderRadius: 4,
                          width: "25%",
                          alignSelf: "center",
                          backgroundColor: "#2FBC9C"
                        }}
                      >
                        <Text
                          style={{
                            alignSelf: "center",
                            alignItems: "center",
                            textAlign: "center",
                            color: "#fff",
                            paddingTop: 10,
                            fontFamily: CONSTANT.PoppinsMedium
                          }}
                        >
                          Add More
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </CollapseBody>
                </Collapse>
              )}

              {fetchLocationFridaySlots && (
                <Collapse>
                  <CollapseHeader
                    style={{ height: 70, marginTop: 5, marginBottom: 5 }}
                  >
                    <View
                      style={{
                        backgroundColor: "#ffffff",
                        elevation: 3,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowColor: "#000",
                        marginRight: 10,
                        marginTop: 5,
                        marginLeft: 10,
                        marginBottom: 5,
                        borderRadius: 4,
                        height: 70
                      }}
                    >
                      <TouchableOpacity>
                        <View style={styles.mainLayoutServices}>
                          <Text
                            numberOfLines={1}
                            style={styles.mainServiceName}
                          >
                            Friday
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <AntIcon
                        name="edit"
                        color={"#2FBC9C"}
                        size={17}
                        style={{
                          alignSelf: "flex-end",
                          marginTop: -42,
                          marginRight: 20
                        }}
                      />
                    </View>
                  </CollapseHeader>
                  <CollapseBody style={{ width: "100%" }}>
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignSelf: "center",
                          marginTop: 10
                        }}
                      >
                        {fetchLocationFridaySlots.length != 0 && (
                          <TouchableOpacity
                            onPress={this.DeleteAllSlotsForFriday}
                            style={{
                              alignItems: "center",
                              height: 40,
                              margin: 10,
                              borderRadius: 4,
                              width: "25%",
                              alignSelf: "center",
                              backgroundColor: "#F95851"
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
                              Delete All
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      <FlatList
                        style={{
                          alignSelf: "center",
                          marginLeft: 10,
                          marginRight: 10
                        }}
                        data={this.state.fetchLocationFridaySlots}
                        extraData={this.state}
                        renderItem={({ item, index }) => (
                          <TouchableOpacity
                            onPress={() => this.selectedSlotData(item)}
                            style={{
                              flexDirection: "column",
                              margin: 3,
                              width: "48%",
                              backgroundColor: "#fff",
                              borderRadius: 5,
                              height: 45,
                              borderColor: CONSTANT.primaryColor,
                              borderWidth: 0.6,
                              justifyContent: "center",
                              alignItems: "center"
                            }}
                          >
                            <Text
                              style={{
                                fontFamily:CONSTANT.PoppinsBold,
                                fontSize: 13,
                                marginHorizontal: 10
                              }}
                            >
                              {item.start_time} - {item.end_time}
                            </Text>
                            <Text style={{ fontSize: 10 , fontFamily:CONSTANT.PoppinsMedium }}>
                              Space: {item.spaces}
                            </Text>
                          </TouchableOpacity>
                        )}
                        numColumns={2}
                      />
                    </View>
                    <View
                      style={{
                        backgroundColor: "#f7f7f7",
                        borderRadius: 5,
                        elevation: 5,
                        margin: 10,
                        paddingTop: 10
                      }}
                    >
                      <Text
                        style={{
                          color: "#3d4461",
                          width: "70%",
                          fontSize: 18,
                          fontFamily:CONSTANT.PoppinsBold,
                          marginBottom: 15,
                          marginLeft: 10,
                          marginTop: 10
                        }}
                      >
                        Add New Slot:
                      </Text>
                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                      >
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

                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                      >
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

                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                      >
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
                          selectedItems={
                            this.state.projectprojectStartTimeKnown
                          }
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

                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                      >
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
                      <Text
                        style={{
                          color: "#3d4461",
                          width: "70%",
                          fontSize: 18,
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
                        radioButtons={this.state.radioButtonsforStartAsFri}
                        onPress={radioButtons =>
                          this.setState({ radioButtons })
                        }
                        style={{
                          paddingTop: 0,
                          flexDirection: "row",
                          marginBottom: 10,
                          marginTop: 0,
                          marginLeft: 13,
                          display: "flex",
                          width: "100%",
                          alignSelf: "center",
                          alignContent: "center",
                          textAlign: "center"
                        }}
                      />
                      {selectedItemforStartAsFri == "other" && (
                        <TextInput
                          underlineColorAndroid="transparent"
                          placeholderTextColor="#7F7F7F"
                          placeholder="Other Value"
                          style={styles.TextInputLayout}
                          onChangeText={customSpaces =>
                            this.setState({ customSpaces })
                          }
                        />
                      )}
                      <TouchableOpacity
                        onPress={this.AddSlotsForFriday}
                        style={{
                          alignItems: "center",
                          height: 40,
                          margin: 10,
                          borderRadius: 4,
                          width: "25%",
                          alignSelf: "center",
                          backgroundColor: "#2FBC9C"
                        }}
                      >
                        <Text
                          style={{
                            alignSelf: "center",
                            alignItems: "center",
                            textAlign: "center",
                            color: "#fff",
                            paddingTop: 10,
                            fontFamily: CONSTANT.PoppinsMedium
                          }}
                        >
                          Add More
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </CollapseBody>
                </Collapse>
              )}

              {fetchLocationSaturdaySlots && (
                <Collapse>
                  <CollapseHeader
                    style={{ height: 70, marginTop: 5, marginBottom: 5 }}
                  >
                    <View
                      style={{
                        backgroundColor: "#ffffff",
                        elevation: 3,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowColor: "#000",
                        marginRight: 10,
                        marginTop: 5,
                        marginLeft: 10,
                        marginBottom: 5,
                        borderRadius: 4,
                        height: 70
                      }}
                    >
                      <TouchableOpacity>
                        <View style={styles.mainLayoutServices}>
                          <Text
                            numberOfLines={1}
                            style={styles.mainServiceName}
                          >
                            Saturday
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <AntIcon
                        name="edit"
                        color={"#2FBC9C"}
                        size={17}
                        style={{
                          alignSelf: "flex-end",
                          marginTop: -42,
                          marginRight: 20
                        }}
                      />
                    </View>
                  </CollapseHeader>
                  <CollapseBody style={{ width: "100%" }}>
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignSelf: "center",
                          marginTop: 10
                        }}
                      >
                        {fetchLocationSaturdaySlots.length != 0 && (
                          <TouchableOpacity
                            onPress={this.DeleteAllSlotsForSaturday}
                            style={{
                              alignItems: "center",
                              height: 40,
                              margin: 10,
                              borderRadius: 4,
                              width: "25%",
                              alignSelf: "center",
                              backgroundColor: "#F95851"
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
                              Delete All
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      <FlatList
                        style={{
                          alignSelf: "center",
                          marginLeft: 10,
                          marginRight: 10
                        }}
                        data={this.state.fetchLocationSaturdaySlots}
                        extraData={this.state}
                        renderItem={({ item, index }) => (
                          <TouchableOpacity
                            onPress={() => this.selectedSlotData(item)}
                            style={{
                              flexDirection: "column",
                              margin: 3,
                              width: "48%",
                              backgroundColor: "#fff",
                              borderRadius: 5,
                              height: 45,
                              borderColor: CONSTANT.primaryColor,
                              borderWidth: 0.6,
                              justifyContent: "center",
                              alignItems: "center"
                            }}
                          >
                            <Text
                              style={{
                                fontFamily:CONSTANT.PoppinsBold,
                                fontSize: 13,
                                marginHorizontal: 10
                              }}
                            >
                              {item.start_time} - {item.end_time}
                            </Text>
                            <Text style={{ fontSize: 10 , fontFamily:CONSTANT.PoppinsMedium  }}>
                              Space: {item.spaces}
                            </Text>
                          </TouchableOpacity>
                        )}
                        numColumns={2}
                      />
                    </View>
                    <View
                      style={{
                        backgroundColor: "#f7f7f7",
                        borderRadius: 5,
                        elevation: 5,
                        margin: 10,
                        paddingTop: 10
                      }}
                    >
                      <Text
                        style={{
                          color: "#3d4461",
                          width: "70%",
                          fontSize: 18,
                          fontFamily:CONSTANT.PoppinsBold,
                          marginBottom: 15,
                          marginLeft: 10,
                          marginTop: 10
                        }}
                      >
                        Add New Slot:
                      </Text>
                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                      >
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

                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                      >
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

                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                      >
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
                          selectedItems={
                            this.state.projectprojectStartTimeKnown
                          }
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

                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                      >
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
                      <Text
                        style={{
                          color: "#3d4461",
                          width: "70%",
                          fontSize: 18,
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
                        radioButtons={this.state.radioButtonsforStartAsSat}
                        onPress={radioButtons =>
                          this.setState({ radioButtons })
                        }
                        style={{
                          paddingTop: 0,
                          flexDirection: "row",
                          marginBottom: 10,
                          marginTop: 0,
                          marginLeft: 13,
                          display: "flex",
                          width: "100%",
                          alignSelf: "center",
                          alignContent: "center",
                          textAlign: "center"
                        }}
                      />
                      {selectedItemforStartAsSat == "other" && (
                        <TextInput
                          underlineColorAndroid="transparent"
                          placeholderTextColor="#7F7F7F"
                          placeholder="Other Value"
                          style={styles.TextInputLayout}
                          onChangeText={customSpaces =>
                            this.setState({ customSpaces })
                          }
                        />
                      )}
                      <TouchableOpacity
                        onPress={this.AddSlotsForSaturday}
                        style={{
                          alignItems: "center",
                          height: 40,
                          margin: 10,
                          borderRadius: 4,
                          width: "25%",
                          alignSelf: "center",
                          backgroundColor: "#2FBC9C"
                        }}
                      >
                        <Text
                          style={{
                            alignSelf: "center",
                            alignItems: "center",
                            textAlign: "center",
                            color: "#fff",
                            paddingTop: 10,
                            fontFamily: CONSTANT.PoppinsMedium
                          }}
                        >
                          Add More
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </CollapseBody>
                </Collapse>
              )}

              {fetchLocationSundaySlots && (
                <Collapse>
                  <CollapseHeader
                    style={{ height: 70, marginTop: 5, marginBottom: 5 }}
                  >
                    <View
                      style={{
                        backgroundColor: "#ffffff",
                        elevation: 3,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowColor: "#000",
                        marginRight: 10,
                        marginTop: 5,
                        marginLeft: 10,
                        marginBottom: 5,
                        borderRadius: 4,
                        height: 70
                      }}
                    >
                      <TouchableOpacity>
                        <View style={styles.mainLayoutServices}>
                          <Text
                            numberOfLines={1}
                            style={styles.mainServiceName}
                          >
                            Sunday
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <AntIcon
                        name="edit"
                        color={"#2FBC9C"}
                        size={17}
                        style={{
                          alignSelf: "flex-end",
                          marginTop: -42,
                          marginRight: 20
                        }}
                      />
                    </View>
                  </CollapseHeader>
                  <CollapseBody style={{ width: "100%" }}>
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignSelf: "center",
                          marginTop: 10
                        }}
                      >
                        {fetchLocationSundaySlots.length != 0 && (
                          <TouchableOpacity
                            onPress={this.DeleteAllSlotsForSunday}
                            style={{
                              alignItems: "center",
                              height: 40,
                              margin: 10,
                              borderRadius: 4,
                              width: "25%",
                              alignSelf: "center",
                              backgroundColor: "#F95851"
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
                              Delete All
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      <FlatList
                        style={{
                          alignSelf: "center",
                          marginLeft: 10,
                          marginRight: 10
                        }}
                        data={this.state.fetchLocationSundaySlots}
                        extraData={this.state}
                        renderItem={({ item, index }) => (
                          <TouchableOpacity
                            onPress={() => this.selectedSlotData(item)}
                            style={{
                              flexDirection: "column",
                              margin: 3,
                              width: "48%",
                              backgroundColor: "#fff",
                              borderRadius: 5,
                              height: 45,
                              borderColor: CONSTANT.primaryColor,
                              borderWidth: 0.6,
                              justifyContent: "center",
                              alignItems: "center"
                            }}
                          >
                            <Text
                              style={{
                                fontFamily:CONSTANT.PoppinsBold,
                                fontSize: 13,
                                marginHorizontal: 10
                              }}
                            >
                              {item.start_time} - {item.end_time}
                            </Text>
                            <Text style={{ fontSize: 10 , fontFamily:CONSTANT.PoppinsMedium }}>
                              Space: {item.spaces}
                            </Text>
                          </TouchableOpacity>
                        )}
                        numColumns={2}
                      />
                    </View>
                    <View
                      style={{
                        backgroundColor: "#f7f7f7",
                        borderRadius: 5,
                        elevation: 5,
                        margin: 10,
                        paddingTop: 10
                      }}
                    >
                      <Text
                        style={{
                          color: "#3d4461",
                          width: "70%",
                          fontSize: 18,
                          fontFamily:CONSTANT.PoppinsBold,
                          marginBottom: 15,
                          marginLeft: 10,
                          marginTop: 10
                        }}
                      >
                        Add New Slot:
                      </Text>
                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                      >
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

                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                      >
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

                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                      >
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
                          selectedItems={
                            this.state.projectprojectStartTimeKnown
                          }
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

                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginBottom: 10
                        }}
                      >
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
                      <Text
                        style={{
                          color: "#3d4461",
                          width: "70%",
                          fontSize: 18,
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
                        radioButtons={this.state.radioButtonsforStartAsSun}
                        onPress={radioButtons =>
                          this.setState({ radioButtons })
                        }
                        style={{
                          paddingTop: 0,
                          flexDirection: "row",
                          marginBottom: 10,
                          marginTop: 0,
                          marginLeft: 13,
                          display: "flex",
                          width: "100%",
                          alignSelf: "center",
                          alignContent: "center",
                          textAlign: "center"
                        }}
                      />
                      {selectedItemforStartAsSun == "other" && (
                        <TextInput
                          underlineColorAndroid="transparent"
                          placeholderTextColor="#7F7F7F"
                          placeholder="Other Value"
                          style={styles.TextInputLayout}
                          onChangeText={customSpaces =>
                            this.setState({ customSpaces })
                          }
                        />
                      )}
                      <TouchableOpacity
                        onPress={this.AddSlotsForSunday}
                        style={{
                          alignItems: "center",
                          height: 40,
                          margin: 10,
                          borderRadius: 4,
                          width: "25%",
                          alignSelf: "center",
                          backgroundColor: "#2FBC9C"
                        }}
                      >
                        <Text
                          style={{
                            alignSelf: "center",
                            alignItems: "center",
                            textAlign: "center",
                            color: "#fff",
                            paddingTop: 10,
                            fontFamily: CONSTANT.PoppinsMedium
                          }}
                        >
                          Add More
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </CollapseBody>
                </Collapse>
              )}
            </View>
          </ScrollView>
        )}
      </View>
    );
  }
}
export default withNavigation(LocationDetail);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7"
  },
  nextButtonStyle: {
    color: "#fff",
    backgroundColor: "#f7395a",
    borderRadius: 6,
    fontSize: 13,
    padding: 8,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowColor: "#000"
  },
  previousButtonStyle: {
    color: "#fff",
    backgroundColor: "#19253f",
    borderRadius: 6,
    fontSize: 13,
    padding: 8,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowColor: "#000"
  },
  mainLayoutServices: {
    flexDirection: "row",
    height: 70
  },
  ImageStyle: {
    margin: 15,
    width: 35,
    height: 35
  },
  mainServiceName: {
    color: CONSTANT.primaryColor,
    fontSize: 15,
    margin: 24,
    fontFamily:CONSTANT.PoppinsBold,
  },
  TextInputLayout: {
    minHeight: 45,
    color: "#323232",
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 2,
    borderWidth: 0.6,
    borderColor: "#dddddd",
    fontFamily:CONSTANT.PoppinsBold,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10
  }
});
