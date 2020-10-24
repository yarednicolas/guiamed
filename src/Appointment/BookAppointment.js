import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  TextInput,
  Text,
  Image,
  AsyncStorage,
  ScrollView,
  ActivityIndicator,
  Dimensions
} from "react-native";
import DatePicker from "react-native-date-picker";
import StarRating from "react-native-star-rating";
import { Input, InputProps, Button } from "react-native-ui-kitten";
import AntIcon from "react-native-vector-icons/AntDesign";
import CustomHeader from "../Header/CustomHeader";
import { withNavigation, DrawerActions } from "react-navigation";
import axios from "axios";
import MultiSelect from "react-native-multiple-select";
import { RadioGroup } from "react-native-btr";
import Dates from "react-native-dates";
import Moment from "moment";
import HTML from "react-native-render-html";
import {
  Collapse,
  CollapseHeader,
  CollapseBody
} from "accordion-collapse-react-native";
import * as CONSTANT from "../Constants/Constant";

class BookAppointment extends Component {
  constructor(props) {
    super(props);
    this.arraySpeciality = [];
    this.arrayServices = [];
    this.state = {
      projectHospitalKnown: "",
      RelationDataKnown: "",
      selectedSlotbackgroundColor: "#fff",
      sday: "",
      sdate: "",
      stime: "",
      appointment: [],
      arrayHolder_Speciality: [],
      arrayHolder_Services: [],
      projectServices: [],
      projectServicesHosPrice: "",
      doctorSlot: [],
      projectSpecialityServices: [],
      isChecked: [],
      selectedServices: [],
      projectSelectedServiceKnown: [],
      service: [],
      date: new Date(),
      othername: "",
      desc: "",
      focus: "startDate",
      isLoading: true,
      new_array: [],
      radioButtonsforStartAs: [
        {
          label: "My Self",
          value: "myself",
          checked: true,
          color: "#323232",
          disabled: false,
          width: "33.33%",
          size: 6
        },
        {
          label: "Someone Else",
          value: "someone",
          checked: false,
          color: "#323232",
          disabled: false,
          width: "33.33%",
          size: 6
        }
      ],
      RelationData: [
        {
          name: "Brother",
          value: "brother"
        },
        {
          name: "Wife",
          value: "wife"
        },
        {
          name: "Mother",
          value: "mother"
        },
        {
          name: "Sister",
          value: "sister"
        }
      ]
    };
  }

  componentDidMount() {
    this.setState({ arrayHolder_Speciality: [...this.arraySpeciality] });
    this.setState({ arrayHolder_Services: [...this.arrayServices] });
    this.ProjectHospitalSpinner();
  }
  onSelectionsChange = selectedServices => {
    // selectedServices is array of { label, value }
    this.setState({ selectedServices });
  };
  onDateChange(date) {
    this.setState(
      {
        date: date.date
      },
      this.DoctorSlots
    );
  }
  joinDataForSpecialities = item => {
    this.arraySpeciality.push({
      speciality: item.speciality_id,
      services: [...this.arrayServices]
    });
    this.setState(
      { arrayHolder_Speciality: [...this.arraySpeciality] },
      console.log("Data:", JSON.stringify([...this.arraySpeciality]))
    );
  };
  joinDataForServices = item => {
    this.arrayServices.push({
      id: item.service_id,
      title: item.service_title,
      price: item.service_price
    });
    this.setState({ arrayHolder_Services: [...this.arrayServices] });
  };
  ProjectHospitalSpinner = async () => {
    const { params } = this.props.navigation.state;
    return fetch(
      CONSTANT.BaseUrl +
        "appointments/get_bookings_hospitals?profile_id=" +
        params.id,
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
        this.setState({
          projectHospital,
          isLoading: false
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  ProjectServicesSpinner = async () => {
    const {
      projectHospitalKnown,
      projectServices,
      projectSpecialityServices
    } = this.state;
    const { params } = this.props.navigation.state;
    if (projectHospitalKnown != "") {
      const response = await fetch(
        CONSTANT.BaseUrl +
          "appointments/get_bookings?team_id=" +
          projectHospitalKnown +
          "&profile_id=" +
          params.id
      );
      const json = await response.json();
      console.log("Data", JSON.stringify(json));
      console.log(json);
      if (Array.isArray(json) && json && json.type && json.type === "error") {
        this.setState({ projectServices: [], isLoading: false }); // empty data set
      } else {
        this.setState(
          {
            projectServices: json.specilities,
            isLoading: false,
            projectServicesHosPrice: json,
            isLoading: false
          },
          this.setState({
            projectSpecialityServices: json.services,
            isLoading: false
          })
        );
      }
      this.DoctorSlots();
    }
  };

  DoctorSlots = async () => {
    this.setState({
      doctorSlot: []
    });
    const {
      projectHospitalKnown,
      projectServices,
      projectSpecialityServices,
      date
    } = this.state;
    const { params } = this.props.navigation.state;

    if (projectHospitalKnown.length != 0) {
      Moment.locale("en");
      var str = Moment(date).format("ddd");
      var day = str.toLowerCase();
      var selected_date = Moment(date).format("YYYY-MM-DD");
      const response = await fetch(
        CONSTANT.BaseUrl +
          "appointments/get_slots?team_id=" +
          projectHospitalKnown.toString() +
          "&date=" +
          selected_date
      );
      const json = await response.json();
      if (
        Array.isArray(json) &&
        json[0] &&
        json.type &&
        json.type === "error"
      ) {
        this.setState({ doctorSlot: [], isLoading: false }); // empty data set
      } else {
        this.setState({ doctorSlot: json, isLoading: false });
      }
    }
  };
  selectedSlotData = item => {
    const { date } = this.state;
    Moment.locale("en");
    var str = Moment(date).format("ddd");
    var day = str.toLowerCase();
    var selected_date = Moment(date).format("YYYY-MM-DD");
    const { sdate, sday, stime } = this.state;
    this.setState({
      stime: item.key,
      selectedSlotbackgroundColor: "#000"
    });
  };
  createRequiredArray = index => {
    this.state.service[index] = this.state.projectSelectedServiceKnown;
    var array = this.state.service;

    var filtered = array.filter(function(el) {
      return el != null;
    });
  };

  BookAppointment = async () => {
    const {
      arrayHolder_Speciality,
      day,
      date,
      time,
      appointment,
      projectSelectedServiceKnown,
      service,
      projectHospitalKnown,
      RelationDataKnown,
      desc,
      sdate,
      sday,
      othername,
      stime
    } = this.state;
    const { params } = this.props.navigation.state;
    var array = this.state.service;
    this.setState({
      new_array: array
    });

    // var filtered = array.filter(function(el) {
    //   return el != null;
    // });
    let selectedItemforStartAs = this.state.radioButtonsforStartAs.find(
      e => e.checked == true
    );
    selectedItemforStartAs = selectedItemforStartAs
      ? selectedItemforStartAs.value
      : this.state.radioButtonsforStartAs[0].value;
    const Uid = await AsyncStorage.getItem("projectUid");
    var selected_date = Moment(date).format("YYYY-MM-DD");
    axios
      .post(CONSTANT.BaseUrl + "appointments/booking_step1", {
        patient: selectedItemforStartAs,
        other_name: othername,
        relation: RelationDataKnown.toString(),
        booking_hospitals: projectHospitalKnown.toString(),
        user_id: Uid,
        id: params.id,
        service: this.state.new_array,
        booking_content: desc,
        appointment_date: selected_date,
        booking_slot: stime
      })
      .then(async response => {
        if (response.status === 200) {
          if(response.data.type == 'demo'){
            this.setState({
              isUpdatingLoader:false,
            })
            alert(JSON.stringify(response.data.message));
          }else{
            this.setState({ isUpdatingLoader: false });
            Alert.alert("Updated Successfully", response.data.message);
            this.props.navigation.navigate("VerifyPasswordForBooking");
            console.log("Updated Successfully" + JSON.stringify(response));
          }
          
        } else if (response.status === 203) {
          Alert.alert("Error" + response.data.message);
          console.log("Error" + response);
        }
      })
      .catch(error => {
        Alert.alert(error);
        console.log(error);
      });
  };

  render() {
    const isDateBlocked = date => date.isBefore(Moment(), "day");

    let selectedItemforStartAs = this.state.radioButtonsforStartAs.find(
      e => e.checked == true
    );
    selectedItemforStartAs = selectedItemforStartAs
      ? selectedItemforStartAs.value
      : this.state.radioButtonsforStartAs[0].value;
    const { isLoading } = this.state;
    const { params } = this.props.navigation.state;
    return (
      <ScrollView style={styles.container}>
        <CustomHeader headerText={"Book Appointment"} />
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
          style={{
            flexDirection: "column",
            backgroundColor: "#fff",
            margin: 10,
            borderRadius: 6,
            overflow: "hidden",
            elevation: 3,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowColor: "#000"
          }}
        >
          <View
            style={{
              marginLeft: 5,
              marginRight: 5,
              flexDirection: "column",
              backgroundColor: "#fff",
              marginTop: 10
            }}
          >
            <Text
              style={{
                marginLeft: 10,
                fontSize: 15,
                fontFamily:CONSTANT.PoppinsBold,
                marginBottom: 5,
                color: "#f7395a"
              }}
            >
              Who is visiting to Doctor?
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
                marginLeft: 13,
                display: "flex",
                width: "100%",
                alignSelf: "center",
                alignContent: "center",
                textAlign: "center"
              }}
            />
            {selectedItemforStartAs == "someone" && (
              <View>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#7F7F7F"
                  placeholder="Search doctors, clinics, hospitals, etc."
                  onChangeText={othername => this.setState({ othername })}
                  style={{
                    height: 55,
                    paddingLeft: 10,
                    borderRadius: 2,
                    borderWidth: 0.6,
                    borderColor: "#dddddd",
                    color: "#323232",
                    marginLeft: 10,
                    marginRight: 10,
                    fontFamily:CONSTANT.PoppinsMedium,
                    marginBottom: 10
                  }}
                />
                <View
                  style={{ marginLeft: 10, marginRight: 10, marginBottom: 10 }}
                >
                  <MultiSelect
                    ref={component => {
                      this.multiSelect = component;
                    }}
                    onSelectedItemsChange={value =>
                      this.setState({
                        RelationDataKnown: value
                      })
                    }
                    uniqueKey="value"
                    items={this.state.RelationData}
                    selectedItems={this.state.RelationDataKnown}
                    borderBottomWidth={0}
                    single={true}
                    //onChangeInput={this.ProjectServicesSpinner}
                    //onChangeInput={ this.ProjectServicesSpinner()}
                    searchInputPlaceholderText="Pick Relation..."
                    selectText="Pick Relation"
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
              </View>
            )}

            <View style={{ marginLeft: 10, marginRight: 10, marginBottom: 10 }}>
              <MultiSelect
                ref={component => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={value =>
                  this.setState(
                    {
                      projectHospitalKnown: value
                    },
                    this.ProjectServicesSpinner
                  )
                }
                uniqueKey="team_id"
                items={this.state.projectHospital}
                selectedItems={this.state.projectHospitalKnown}
                borderBottomWidth={0}
                single={true}
                //onChangeInput={this.ProjectServicesSpinner}
                //onChangeInput={ this.ProjectServicesSpinner()}
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
                displayKey="hospital_name"
                submitButtonText="Submit"
              />
            </View>
            {this.state.projectServices && (
              <View style={{ paddingBottom: 10 }}>
                <FlatList
                  style={{ paddingLeft: 5, paddingBottom: 5, marginBottom: 5 }}
                  data={this.state.projectServices}
                  extraData={this.state}
                  renderItem={({ item, index }) => (
                    <Collapse>
                      <CollapseHeader
                        style={{ height: 70, marginTop: 10, marginBottom: 10 }}
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
                          <TouchableOpacity
                            onPress={() => this.joinDataForSpecialities(item)}
                          >
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
                              {/* <Text
                                numberOfLines={1}
                                style={styles.mainServiceName}>
                                {item.title}
                              </Text> */}
                              <HTML
                                containerStyle={styles.mainServiceName}
                                lineHeight={20}
                                html={item.title}
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
                              marginTop: -42,
                              marginRight: 10
                            }}
                          />
                        </View>
                      </CollapseHeader>
                      <CollapseBody>
                        <View>
                          {/* <SelectMultiple
                                  
                                    items={this.state.projectServices[index].services}
                                    selectedItems={this.state.selectedServices}
                                    onSelectionsChange={this.onSelectionsChange}
                                    renderLabel={({item,index}) => (
                                      <View style={{flexDirection:'row' , backgroundColor:'#f7f7f7' ,marginTop:5  , marginRight:10 , borderRadius:5 ,padding:10}}>
                                        
                                        <View style={{ flexDirection:'column'}}>
                                        <Text style={{marginTop:5 , marginLeft:5 , fontWeight:'700'}}>{item.service_title}</Text>
                                        <Text style={{marginTop:5 , marginLeft:5}}>Price: {item.service_price}</Text>
                                      </View>
                                      </View>
                                     
                                    )} /> */}
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
                                    // service:[[this.state.projectServices[index].ID] ,  this.state.projectSelectedServiceKnown],
                                  },
                                  this.createRequiredArray(
                                    this.state.projectServices[index].ID
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
                              displayKey="service_title"
                              submitButtonText="Submit"
                            />
                          </View>
                          <View
                            style={{
                              backgroundColor: "#f7f7f7",
                              borderRadius: 5,
                              flexDirection: "column",
                              margin: 10,
                              elevation: 2,
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.2,
                              shadowColor: "#000"
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                marginLeft: 10,
                                marginTop: 10,
                                marginBottom: 10,
                                width: "90%",
                                flex: 1,
                                alignContent: "center"
                              }}
                            >
                              <Text
                                style={{
                                  color: "#3d4461",
                                  width: "50%",
                                  fontSize: 15,
                                  fontWeight: "700",
                                  flex: 5
                                }}
                              >
                                Hospital Charges:
                              </Text>
                              <View
                                style={{
                                  color: "#3d4461",
                                  width: "50%",
                                  alignSelf: "flex-end",
                                  fontSize: 15,
                                  textAlign: "right",
                                  flexDirection: "row",
                                  flex: 1
                                }}
                              >
                                <HTML
                                  lineHeight={20}
                                  html={
                                    this.state.projectServicesHosPrice
                                      .fee_formate
                                  }
                                  imagesMaxWidth={
                                    Dimensions.get("window").width
                                  }
                                />
                              </View>
                            </View>

                            {/* <View
                              style={{
                                borderBottomColor: '#dddddd',
                                borderBottomWidth: 0.6,
                                margin: 10,
                              }}
                            />
                            <View
                              style={{
                                flexDirection: 'row',
                                marginLeft: 10,
                                marginBottom: 10,
                                width: '90%',
                                alignContent: 'center',
                              }}>
                              <Text
                                style={{
                                  color: '#3d4461',
                                  width: '50%',
                                  fontSize: 15,
                                  fontWeight: '700',
                                }}>
                                Total Charges:
                              </Text>
                              <Text
                                style={{
                                  color: '#3d4461',
                                  width: '50%',
                                  alignSelf: 'flex-end',
                                  fontSize: 15,
                                  textAlign: 'right',
                                }}>
                                0$
                              </Text>
                            </View> */}
                          </View>
                          {/* <FlatList
                              style={{paddingLeft: 5 , marginTop:8}}
                              data ={this.state.projectServices[index].services}
                              extraData={this.state}
                              renderItem={({item,index}) => (
                                <TouchableOpacity  onPress={()=> this.joinDataForServices(item)} style={{flexDirection:'row' , backgroundColor:'#f7f7f7' ,marginTop:5  , marginRight:10 , borderRadius:5 ,padding:10}}>
                                  
                                  <View style={{ flexDirection:'column'}}>
                                  <Text style={{marginTop:5 , marginLeft:5 , fontWeight:'700'}}>{item.service_title}</Text>
                                  {
                                    item.formated_price == "" ?
                                      <Text style={{marginTop:5 , marginLeft:5}}>Price: 0.00</Text>
                                    : <Text style={{marginTop:5 , marginLeft:5}}>Price: {item.formated_price}</Text>
                                  }
                              
                                </View>
                                </TouchableOpacity>
                               
                              )}
                            /> */}
                        </View>
                      </CollapseBody>
                    </Collapse>
                  )}
                />

                <Text
                  style={{
                    color: "#f7395a",
                    width: "50%",
                    fontSize: 18,
                    margin: 10,
                    fontFamily:CONSTANT.PoppinsBold,
                  }}
                >
                  Select Date & Time:
                </Text>
                <View
                  style={{
                    marginTop: 5,
                    borderRadius: 5,
                    marginLeft: 5,
                    marginRight: 5,
                    overflow: "hidden",
                    borderColor: "#dddddd",
                    borderWidth: 0.6
                  }}
                >
                  <Dates
                    textColor={"#323232"}
                    mode={"date"}
                    isDateBlocked={isDateBlocked}
                    date={this.state.date}
                    onDatesChange={date => this.onDateChange(date)}
                  />
                </View>
              </View>
            )}
            {this.state.projectServices.length >= 1 && (
              <Text
                style={{
                  color: "#f7395a",
                  width: "50%",
                  fontSize: 18,
                  margin: 10,
                  fontFamily:CONSTANT.PoppinsBold,
                }}
              >
                Available Slots:
              </Text>
            )}
            {this.state.doctorSlot != [] ? (
              <View>
                <FlatList
                  style={{ paddingLeft: 5 }}
                  data={this.state.doctorSlot}
                  extraData={this.state}
                  renderItem={({ item, index }) => (
                    <View style={{ width: "30%", margin: 5 }}>
                      {item.spaces <= 0 ? (
                        <View
                          style={{
                            flexDirection: "column",
                            backgroundColor: "#f7f7f7",
                            borderRadius: 5,
                            height: 45,
                            borderColor: "#dddddd",
                            borderWidth: 0.6,
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          <Text style={{    fontFamily:CONSTANT.PoppinsBold, fontSize: 16 }}>
                            {item.start_time}
                          </Text>
                          <Text style={{ fontSize: 10, color: "#f7395a" ,    fontFamily:CONSTANT.PoppinsMedium, }}>
                            Occupied
                          </Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() => this.selectedSlotData(item)}
                          style={{
                            flexDirection: "column",
                            borderRadius: 5,
                            height: 45,
                            borderColor: CONSTANT.primaryColor,
                            borderWidth: 0.6,
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          <Text style={{    fontFamily:CONSTANT.PoppinsBold, fontSize: 16 }}>
                            {item.start_time}
                          </Text>
                          <Text style={{ fontSize: 10 ,    fontFamily:CONSTANT.PoppinsMedium, }}>
                            Spaces: {item.spaces}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                  numColumns={3}
                />
              </View>
            ) : (
              <Text style={{   fontFamily:CONSTANT.PoppinsMedium,}}>No Slot Available</Text>
            )}
            {this.state.stime != "" ? (
              <View>
                <Text
                  style={{
                    color: "#f7395a",
                    width: "50%",
                    fontSize: 18,
                    margin: 10,
                    fontFamily:CONSTANT.PoppinsMedium,
                  }}
                >
                  Selected Slot:
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    marginLeft: 10,
                    width: "100%"
                  }}
                >
                  <Text
                    style={{ fontSize: 15, width: "33.33%",    fontFamily:CONSTANT.PoppinsMedium, }}
                  >
                    {this.state.stime}
                  </Text>
                  <Text
                    style={{ fontSize: 15, width: "33.33%",    fontFamily:CONSTANT.PoppinsMedium, }}
                  >
                    {this.state.sdate}
                  </Text>
                  <Text
                    style={{ fontSize: 15, width: "33.33%",    fontFamily:CONSTANT.PoppinsMedium, }}
                  >
                    {this.state.sday}
                  </Text>
                </View>
              </View>
            ) : null}

            <TextInput
              underlineColorAndroid="transparent"
              placeholderTextColor="#7F7F7F"
              placeholder="Description"
              onChangeText={desc => this.setState({ desc })}
              style={{
                height: 45,
                paddingLeft: 10,
                marginTop: 10,
                alignItems: "flex-start",
                borderRadius: 5,
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
              onPress={
                () => this.BookAppointment()
                // this.props.navigation.navigate('BookAppointment', {
                //   id: params.itemId,
                // })
              }
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
                Book Appointment
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScrollView>
    );
  }
}
export default withNavigation(BookAppointment);
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
    color: "#484848",
    fontSize: 15,
    margin: 24,
    fontWeight: "400"
  },
  date: {
    marginTop: 50
  },
  focused: {
    color: "blue"
  }
});
