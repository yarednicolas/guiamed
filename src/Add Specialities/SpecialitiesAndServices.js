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
  ActivityIndicator,
  PanResponder,
  Dimensions
} from "react-native";
import { SwipeRow, List, Content } from "native-base";
import { Input, InputProps, Button } from "react-native-ui-kitten";
import AntIcon from "react-native-vector-icons/AntDesign";
import { withNavigation, DrawerActions } from "react-navigation";
import DateTimePicker from "react-native-modal-datetime-picker";
import ImagePicker from "react-native-image-crop-picker";
import CustomHeader from "../Header/CustomHeader";
import MultiSelect from "react-native-multiple-select";
import axios from "axios";
import {
  Collapse,
  CollapseHeader,
  CollapseBody
} from "accordion-collapse-react-native";
import Dash from "react-native-dash";
import * as CONSTANT from "../Constants/Constant";

class SpecialitiesAndServices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ProjectSpecialitiesKnown: "",
      projectServicesKnown: "",
      projectServices: [],
      projectAvailableServices: [],
      projectSelectedServiceKnown: [],
      price: "",
      desc: "",
      isLoading: true
    };
  }
  componentDidMount() {
    this.ProjectSpecialitiesSpinner();
    this.fetchAvailableServices();
  }

  fetchAvailableServices = async () => {
    const id = await AsyncStorage.getItem("projectProfileId");
    const response = await fetch(
      CONSTANT.BaseUrl + "taxonomies/get_list?list=services&profile_id=" + id
    );
    const json = await response.json();
    if (
      Array.isArray(json) &&
      json[0] &&
      json[0].type &&
      json[0].type === "error"
    ) {
      this.setState({ projectAvailableServices: [], isLoading: false }); // empty data set
    } else {
      this.setState({ projectAvailableServices: json, isLoading: false });
    }
  };
  ProjectSpecialitiesSpinner = async () => {
    return fetch(CONSTANT.BaseUrl + "taxonomies/get-specilities", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        let ProjectSpecialities = responseJson;
        this.setState({
          ProjectSpecialities
        });
      })
      .catch(error => {
        console.error(error);
      });
  };
  ProjectServicesSpinner = async () => {
    const {
      ProjectSpecialitiesKnown,
      projectServices,
      projectSpecialityServices
    } = this.state;
    if (ProjectSpecialitiesKnown != "") {
      const response = await fetch(
        CONSTANT.BaseUrl +
          "taxonomies/get_servicess?speciality=" +
          JSON.stringify(ProjectSpecialitiesKnown[0])
      );
      const json = await response.json();
      console.log(json);
      if (Array.isArray(json) && json && json.type && json.type === "error") {
        this.setState({ projectServices: [], isLoading: false }); // empty data set
      } else {
        this.setState({ projectServices: json, isLoading: false });
      }
    }
  };

  AddServicesData = async () => {
    const Uid = await AsyncStorage.getItem("projectProfileId");
    const {
      price,
      desc,
      projectServicesKnown,
      ProjectSpecialitiesKnown
    } = this.state;
    Alert.alert(
      JSON.stringify(ProjectSpecialitiesKnown[0]) +
        JSON.stringify(projectServicesKnown[0])
    );

    if (price == "" || desc == "") {
      Alert.alert("Oop's", "Por favor agregue datos completos");
    } else {
      axios
        .post(CONSTANT.BaseUrl + "user/update_user_specilities", {
          profile_id: Uid,
          speciality: JSON.stringify(ProjectSpecialitiesKnown[0]),
          service: JSON.stringify(projectServicesKnown[0]),
          price: price,
          description: desc
        })
        .then(async response => {
          if (response.status === 200) {
            Alert.alert("Actualizado con éxito", response.data.message);
            this.fetchAvailableServices();
            console.log(response);
          } else if (response.status === 203) {
            Alert.alert("Error" + response.data.message);
          }
        })
        .catch(error => {
          Alert.alert(error);
          console.log(error);
        });
    }
  };

  render() {
    const { isLoading } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#f7f7f7" barStyle="dark-content" />
        <CustomHeader headerText={"Manage Services"} />
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
        <ScrollView>
          <View
            style={{
              backgroundColor: "#fff",
              margin: 15,
              borderRadius: 6,
              elevation: 5
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily:CONSTANT.PoppinsBold,
                marginHorizontal: 10,
                marginVertical: 10
              }}
            >
              Add New Service:
            </Text>
            <View style={{ marginLeft: 10, marginRight: 10, marginBottom: 10 }}>
              <MultiSelect
                ref={component => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={value =>
                  this.setState(
                    { projectServices: [], ProjectSpecialitiesKnown: value },
                    this.ProjectServicesSpinner
                  )
                }
                uniqueKey="id"
                items={this.state.ProjectSpecialities}
                selectedItems={this.state.ProjectSpecialitiesKnown}
                borderBottomWidth={0}
                single={true}
                searchInputPlaceholderText="Search Speciality..."
                onChangeInput={text => console.log(text)}
                selectText="Pick Speciality"
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

            {this.state.projectServices.length >= 1 ? (
              <View>
                <View
                  style={{ marginLeft: 10, marginRight: 10, marginBottom: 10 }}
                >
                  <MultiSelect
                    ref={component => {
                      this.multiSelect = component;
                    }}
                    onSelectedItemsChange={value =>
                      this.setState({ projectServicesKnown: value })
                    }
                    uniqueKey="id"
                    items={this.state.projectServices}
                    selectedItems={this.state.projectServicesKnown}
                    borderBottomWidth={0}
                    single={true}
                    searchInputPlaceholderText="Search Services..."
                    onChangeInput={text => console.log(text)}
                    selectText="Pick Services"
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
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#7F7F7F"
                  placeholder="Price"
                  onChangeText={price => this.setState({ price })}
                  style={{
                    height: 45,
                    paddingLeft: 10,
                    borderRadius: 2,
                    borderWidth: 0.6,
                    borderColor: "#dddddd",
                    color: "#323232",
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: 10,
                    fontFamily:CONSTANT.PoppinsMedium,
                  }}
                />
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#7F7F7F"
                  placeholder="Description"
                  onChangeText={desc => this.setState({ desc })}
                  style={{
                    height: 150,
                    paddingLeft: 10,
                    borderRadius: 2,
                    borderWidth: 0.6,
                    borderColor: "#dddddd",
                    color: "#323232",
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: 10,
                    fontFamily:CONSTANT.PoppinsMedium,
                  }}
                />
                <TouchableOpacity
                  onPress={this.AddServicesData}
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
                    Add Now
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
          {this.state.projectAvailableServices && (
            <View
              style={{
                marginHorizontal: 10,
                marginBottom: 10,
                backgroundColor: "#fff",
                borderRadius: 5
              }}
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
                Available Services:
              </Text>
              <FlatList
                style={{ paddingLeft: 5, paddingBottom: 5, marginBottom: 5 }}
                data={this.state.projectAvailableServices}
                extraData={this.state}
                renderItem={({ item, index }) => (
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
                                borderLeftWidth: 0.6
                              }}
                            />
                            <Text
                              numberOfLines={1}
                              style={styles.mainServiceName}
                            >
                              {item.title}
                            </Text>
                          </View>
                        </TouchableOpacity>

                        <AntIcon
                          name="down"
                          color={"#484848"}
                          size={17}
                          style={{
                            alignSelf: "flex-end",
                            marginTop: -42,
                            marginRight: 10
                          }}
                        />
                      </View>
                    </CollapseHeader>
                    <CollapseBody>
                      <View>
                        <FlatList
                          style={{ paddingLeft: 5, marginTop: 8 }}
                          data={
                            this.state.projectAvailableServices[index].services
                          }
                          extraData={this.state}
                          renderItem={({ item, index }) => (
                            <TouchableOpacity
                              style={{
                                flexDirection: "row",
                                backgroundColor: "#f7f7f7",
                                marginTop: 5,
                                marginRight: 10,
                                borderRadius: 5,
                                padding: 10
                              }}
                            >
                              <View style={{ flexDirection: "column" }}>
                                <Text
                                  style={{
                                    marginTop: 5,
                                    marginLeft: 5,
                                    fontFamily:CONSTANT.PoppinsBold,
                                  }}
                                >
                                  {item.title}
                                </Text>
                                <Text
                                  style={{
                                    marginTop: 5,
                                    marginLeft: 5,
                                    fontFamily:CONSTANT.PoppinsMedium,
                                  }}
                                >
                                  Price: {item.price}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          )}
                        />
                      </View>
                    </CollapseBody>
                  </Collapse>
                )}
              />
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}
export default withNavigation(SpecialitiesAndServices);
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
    marginBottom: 10
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
    marginBottom: 10
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
