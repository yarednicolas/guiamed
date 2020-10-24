import React, { Component } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
  AsyncStorage,
  Image,
  Dimensions
} from "react-native";
import { Input, InputProps, Button } from "react-native-ui-kitten";
import AntIcon from "react-native-vector-icons/AntDesign";
import StarRating from "react-native-star-rating";
import LocationsCard from "./LocationsCard";
import UserDetailPage from "./UserDetailPage";
import OnlineConsultationCard from "./OnlineConsultationCard";
import PatientFeedBackCard from "./PatientFeedBackCard";
import ArticlesCard from "./ArticlesCard";
import OfferedServicesCard from "./UserDetailPageCards/OfferedServicesCard";
import ExperienceCard from "./UserDetailPageCards/ExperienceCard";
import SpecializationCard from "./UserDetailPageCards/SpecializationCard";
import AwardsAndRecognitionsCard from "./UserDetailPageCards/AwardsAndRecognitionsCard";
import DownloadCard from "./UserDetailPageCards/DownloadCard";
import RBSheet from "react-native-raw-bottom-sheet";
import { FloatingAction } from "react-native-floating-action";
import TopRatedCard from "../Home/TopRatedCard";
import CustomHeader from "../Header/CustomHeader";
import * as CONSTANT from "../Constants/Constant";
import axios from "axios";
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();

class DetailDoctorScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storedValue: "",
      storedType: "",
      profileImg: "",
      type: "",
      id: "",
      fetching_from_server: false,
      actions: [
        {
          text: "Available Locations",
          color: "#3fabf3",
          name: "bt_accessibility",
          icon: (
            <AntIcon
              onPress={() =>
                this.onPressGetData("no", "no", "no", "yes", "no", "no")
              }
              name="pushpino"
              color={"#fff"}
              size={30}
              style={{
                alignSelf: "center",
                textAlign: "center"
              }}
            />
          ),
          position: 2,
          onPressItem: this.onPressGetData("no", "no", "no", "yes", "no", "no")
        },
        {
          text: "User Detail",
          color: "#3fabf3",
          name: "bt_language",
          icon: (
            <AntIcon
              onPress={() =>
                this.onPressGetData("no", "no", "no", "no", "yes", "no")
              }
              name="user"
              color={"#fff"}
              size={30}
              style={{
                alignSelf: "center",
                textAlign: "center"
              }}
            />
          ),
          position: 1,
          onPressItem: this.onPressGetData("no", "no", "no", "no", "yes", "no")
        },
        {
          text: "Online Consultation",
          color: "#3fabf3",
          name: "bt_room",
          icon: (
            <AntIcon
              onPress={() =>
                this.onPressGetData("no", "no", "yes", "no", "no", "no")
              }
              name="earth"
              color={"#fff"}
              size={30}
              style={{
                alignSelf: "center",
                textAlign: "center"
              }}
            />
          ),
          position: 3,
          onPressItem: this.onPressGetData("no", "no", "yes", "no", "no", "no")
        },
        {
          text: "Feedback",
          color: "#3fabf3",
          name: "bt_videocam",
          icon: (
            <AntIcon
              onPress={() =>
                this.onPressGetData("no", "yes", "no", "no", "no", "no")
              }
              name="like2"
              color={"#fff"}
              size={30}
              style={{
                alignSelf: "center",
                textAlign: "center"
              }}
            />
          ),
          position: 4,
          onPressItem: this.onPressGetData("no", "yes", "no", "no", "no", "no")
        },
        {
          text: "Articles",
          color: "#3fabf3",
          name: "bt_videocam",
          icon: (
            <AntIcon
              onPress={() =>
                this.onPressGetData("yes", "no", "no", "no", "no", "no")
              }
              name="filetext1"
              color={"#fff"}
              size={30}
              style={{
                alignSelf: "center",
                textAlign: "center"
              }}
            />
          ),
          position: 5,
          onPressItem: this.onPressGetData("yes", "no", "no", "no", "no", "no")
        }
      ],
      HosActions: [
        {
          text: "User Detail",
          color: "#3fabf3",
          name: "bt_language",
          icon: (
            <AntIcon
              onPress={() =>
                this.onPressGetData("no", "no", "no", "no", "yes", "no")
              }
              name="user"
              color={"#fff"}
              size={30}
              style={{
                alignSelf: "center",
                textAlign: "center"
              }}
            />
          ),
          position: 1,
          onPressItem: this.onPressGetData("no", "no", "no", "no", "yes", "no")
        },
        // {
        //   text: 'Online Consultation',
        //   color: '#3fabf3',
        //   name: 'bt_room',
        //   icon: (
        //     <AntIcon
        //       onPress={() => this.onPressGetData('no', 'no', 'yes', 'no', 'no', 'no')}
        //       name="earth"
        //       color={'#fff'}
        //       size={30}
        //       style={{
        //         alignSelf: 'center',
        //         textAlign: 'center',
        //       }}
        //     />
        //   ),
        //   position: 3,
        //   onPressItem: this.onPressGetData('no', 'no', 'yes', 'no', 'no', 'no'),
        // },
        {
          text: "Onboard Doctors",
          color: "#3fabf3",
          name: "bt_videocam",
          icon: (
            <AntIcon
              onPress={() =>
                this.onPressGetData("no", "no", "no", "no", "no", "yes")
              }
              name="filetext1"
              color={"#fff"}
              size={30}
              style={{
                alignSelf: "center",
                textAlign: "center"
              }}
            />
          ),
          position: 5,
          onPressItem: this.onPressGetData("no", "no", "no", "no", "no", "yes")
        }
      ],

      Articles: "no",
      Feedback: "no",
      OnlineConsultation: "no",
      Location: "no",
      UserDetail: "yes",
      starCount: 3.5,
      isLoading: true,
      iconColor: "#dddddd",
      fetchbookingCallSetting: "",
      fetchWishData: [],
      fetchfeedback: [],
      fetchArticle: [],
      fetchLocationData: [],
      fetchConsultationData: [],
      fetchOnboardDoctorData: []
    };
  }
  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }

  onPressGetData = (articles, feedback, consult, loc, detail, onboard) => {
    this.setState({
      Articles: articles,
      Feedback: feedback,
      OnlineConsultation: consult,
      Location: loc,
      UserDetail: detail,
      OnboardDoctor: onboard
    });
  };
  componentDidMount() {
    this.getUser();
    this.fetchDoctorDetail();
    this.fetchArticles();
    this.fetchFeedback();
    this.fetchLocation();
    this.fetchConsultation();
    this.fetchOnboardDoctors();
  }
  getUser = async () => {
    try {
      const storedValue = await AsyncStorage.getItem("full_name");
      const storedType = await AsyncStorage.getItem("user_type");
      const profileImg = await AsyncStorage.getItem("profile_img");
      const type = await AsyncStorage.getItem("profileType");
      const id = await AsyncStorage.getItem("projectUid");
      //  console.log(storedValue ,storedType, profileImg  ,type , id);
      if (storedValue !== null) {
        this.setState({ storedValue });
      } else {
        // alert('something wrong')
      }
      if (storedType !== null) {
        this.setState({ storedType });
      } else {
        //  alert('something wrong')
      }
      if (profileImg !== null) {
        this.setState({ profileImg });
      } else {
        //  alert('something wrong')
      }
      if (type !== null) {
        this.setState({ type });
      } else {
        //  alert('something wrong')
      }
      if (id !== null) {
        this.setState({ id });
      } else {
        //  alert('something wrong')
      }
      this.fetchAppointments();
    } catch (error) {
      // alert(error)
    }
  };
  fetchDoctorDetail = async () => {
    const { params } = this.props.navigation.state;
    const id = await AsyncStorage.getItem("projectUid");

    const response = await fetch(
      CONSTANT.BaseUrl +
        "listing/get_doctor?profile_id=" +
        params.itemId +
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
      this.setState({ fetchDoctor: [], isLoading: false }); // empty data set
    } else {
      this.setState({ fetchDoctor: json });
      this.setState({ fetchrole: json[0].user_type });
      this.setState({ fetchExperience: json[0].experiences });
      this.setState({ fetchspecialires: json[0].specialires_data });
      this.setState({ fetchEducation: json[0].educations });
      this.setState({ fetchAward: json[0].awards });
      this.setState({ fetchDownload: json[0].downloads });
      this.setState({ fetchspecialities: json[0].specialities });
      this.setState({ fetchWishData: json[0].already_saved });
      this.setState({ fetchbookingCallSetting: json[0].bookig_setting });
      this.setState({ fetchMembership: json[0].memberships, isLoading: false });
    }
  };

  fetchArticles = async () => {
    const { params } = this.props.navigation.state;
    const response = await fetch(
      CONSTANT.BaseUrl +
        "listing/get_articles?profile_id=" +
        params.itemId +
        "&page_number=1"
    );
    const json = await response.json();
    this.setState({ fetchArticle: json });
    console.log(response);
  };
  fetchFeedback = async () => {
    const { params } = this.props.navigation.state;
    const response = await fetch(
      CONSTANT.BaseUrl +
        "listing/get_feedback?profile_id=" +
        params.itemId +
        "&page_number=1"
    );
    const json = await response.json();
    this.setState({ fetchfeedback: json });
    console.log(response);
  };
  fetchConsultation = async () => {
    const { params } = this.props.navigation.state;
    const response = await fetch(
      CONSTANT.BaseUrl +
        "listing/get_consultation?profile_id=" +
        params.itemId +
        "&page_number=1"
    );
    const json = await response.json();
    this.setState({ fetchConsultationData: json });
    console.log(response);
  };
  fetchOnboardDoctors = async () => {
    const { params } = this.props.navigation.state;
    const response = await fetch(
      CONSTANT.BaseUrl +
        "listing/get_hospital_team?profile_id=" +
        params.itemId +
        "&page_number=1"
    );
    const json = await response.json();
    this.setState({ fetchOnboardDoctorData: json });
    console.log(response);
  };
  fetchLocation = async () => {
    const { params } = this.props.navigation.state;
    const response = await fetch(
      CONSTANT.BaseUrl +
        "listing/get_location?profile_id=" +
        params.itemId +
        "&page_number=1"
    );
    const json = await response.json();
    this.setState({ fetchLocationData: json });
    console.log(response);
  };
  AddinWishList = async () => {
    if (this.state.storedType != "") {
      this.setState({
        fetching_from_server: true
      });
      const { params } = this.props.navigation.state;
      const uid = await AsyncStorage.getItem("projectUid");
      axios
        .post(CONSTANT.BaseUrl + "user/add_wishlist", {
          id: params.itemId,
          user_id: uid
        })
        .then(async response => {
          if (response.status == "200") {
            if (response.data.type == "demo") {
              this.setState({
                fetching_from_server: false
              });
              alert(JSON.stringify(response.data.message));
            } else {
              this.setState({
                fetching_from_server: false,
                iconColor: "#fe736e",
                isLoading: false
              });
              alert(JSON.stringify(response.data.message));
            }
          } else if (response.status == "203") {
            alert(JSON.stringify(response.data.message));
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
        Alert.alert("Lo sentimos", "Por favor ingresa primero");
    }
  };
  render() {
    const { params } = this.props.navigation.state;
    const { navigate } = this.props.navigation;
    const { fetchDoctor, isLoading, storedType } = this.state;
    return (
      <View style={styles.container}>
        <CustomHeader headerText={"Detail Page"} />
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
              height: 195,
              marginLeft: 10,
              marginRight: 10,
              borderRadius: 4,
              marginTop: 50,
              elevation: 6,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowColor: "#3d4461"
            }}
          >
            <View
              style={{
                width: "100%",
                marginTop: -60,
                elevation: 3,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowColor: "#000"
              }}
            >
              {this.state.fetchDoctor && (
                <Image
                  resizeMode="cover"
                  style={{
                    height: 80,
                    width: 80,
                    alignSelf: "center",
                    borderWidth: 2,
                    borderRadius: 40,
                    marginTop: 20,
                    borderColor: "#3d4461"
                  }}
                  source={{ uri: `${this.state.fetchDoctor[0].image}` }}
                />
              )}
            </View>
            <View style={{ width: "100%" }}>
              <View style={styles.docContentstyle}>
                {this.state.fetchDoctor && (
                  <Text style={styles.titleStyle}>
                    {this.state.fetchDoctor[0].specialities[0].name}
                  </Text>
                )}

                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 2,
                    alignSelf: "center"
                  }}
                >
                  {this.state.fetchDoctor && (
                    <Text style={styles.DocName}>
                      {this.state.fetchDoctor[0].name}
                    </Text>
                  )}

                  <AntIcon
                    name="heart"
                    color={"#3fabf3"}
                    size={13}
                    style={{
                      alignSelf: "center",
                      textAlign: "center",
                      marginTop: 2,
                      marginLeft: 2,
                      marginRight: 1
                    }}
                  />
                  <AntIcon
                    name="checkcircle"
                    color={"#1abc9c"}
                    size={13}
                    style={{
                      alignSelf: "center",
                      textAlign: "center",
                      marginTop: 2,
                      marginLeft: 2,
                      marginRight: 1
                    }}
                  />
                </View>
                {this.state.fetchDoctor && (
                  <Text
                    style={{
                      marginTop: 2,
                      color: "#3d4461",
                      textAlign: "center",
                      fontSize: 14,
                      fontFamily: CONSTANT.PoppinsRegular
                    }}
                  >
                    {this.state.fetchDoctor[0].sub_heading}
                  </Text>
                )}

                <View
                  style={{
                    flexDirection: "row",
                    alignSelf: "center",
                    marginTop: 2
                  }}
                >
                  {this.state.fetchDoctor && (
                    <StarRating
                      disabled={true}
                      maxStars={5}
                      starSize={14}
                      fullStarColor={"#fecb02"}
                      emptyStarColor={"#fecb02"}
                      rating={this.state.fetchDoctor[0].average_rating}
                      selectedStar={rating => this.onStarRatingPress(rating)}
                    />
                  )}
                  {this.state.fetchDoctor && (
                    <Text
                      style={{
                        marginLeft: 10,
                        color: "#3d4461",
                        fontSize: 12,
                        fontFamily: CONSTANT.PoppinsRegular
                      }}
                    >
                      {this.state.fetchDoctor[0].total_rating} Feedback
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <View
              style={{
                width: "100%",
                marginTop: 20,
                flexDirection: "row",
                justifyContent: "center",
                alignSelf: "center",
                alignItems: "center",
                alignContent: "center"
              }}
            >
              {/* {storedType != null && storedType == "regular_user"  && (
                <Button onPress={() =>
                  this.props.navigation.navigate("AddFeedback", {
                        id: params.itemId
                      })
                } style={styles.buttonStyle1}>FeedBack</Button>
              )} */}
              {this.state.storedType != "" &&
                this.state.fetchrole != null &&
                this.state.fetchrole == "doctors" && (
                  <Button
                    onPress={() =>
                      this.props.navigation.navigate("MessageDoctor", {
                        id: this.state.fetchDoctor[0].user_id
                      })
                    }
                    style={styles.buttonStyle1}
                  >
                    Contact
                  </Button>
                )}

              {storedType != null &&
                storedType == "regular_user" &&
                this.state.fetchrole == "doctors" && (
                  <Button
                    onPress={() => {
                      this.state.fetchbookingCallSetting.hasOwnProperty("title")
                        ? this.props.navigation.navigate(
                            "BookAppointmentCall",
                            {
                              id: params.itemId
                            }
                          )
                        : this.props.navigation.navigate("BookAppointment", {
                            id: params.itemId
                          });
                    }}
                    style={styles.buttonStyle2}
                  >
                    Book Now
                  </Button>
                )}

              {this.state.fetchWishData == "yes" ? (
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert("Mensaje", "Ya agregado en la lista de deseos.")
                  }
                  style={styles.buttonStyle3}
                >
                  <AntIcon
                    name="heart"
                    color={"#fe736e"}
                    size={25}
                    style={{}}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={this.AddinWishList}
                  style={styles.buttonStyle3}
                >
                  {this.state.fetching_from_server == false && (
                    <AntIcon
                      name="heart"
                      color={this.state.iconColor}
                      size={25}
                      style={{}}
                    />
                  )}

                  {this.state.fetching_from_server == true && (
                    <ActivityIndicator
                      color={CONSTANT.primaryColor}
                      size="small"
                    />
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={{ marginLeft: 15, marginRight: 15, marginTop: 40 }}>
            {this.state.Location === "yes" ? (
              <View>
                {this.state.fetchDoctor && (
                  <Text
                    style={{
                      color: "#3d4461",
                      fontSize: 20,
                      fontFamily: CONSTANT.PoppinsBold,
                      marginBottom: 15
                    }}
                  >
                    Locations By “{this.state.fetchDoctor[0].name}”
                  </Text>
                )}

                {this.state.fetchLocationData.length >= 1 ? (
                  <FlatList
                    style={{}}
                    data={this.state.fetchLocationData}
                    keyExtractor={(x, i) => i.toString()}
                    renderItem={({ item }) => (
                      <LocationsCard
                        image={{ uri: `${item.image}` }}
                        specialityName={`${entities.decode(
                          item.specialities[0].name
                        )}`}
                        Name={`${item.name}`}
                        subHeading={`${entities.decode(item.sub_heading)}`}
                        location={`${entities.decode(item.location)}`}
                        availability={`${entities.decode(item.availability)}`}
                        onboard_doctors={`${entities.decode(
                          item.onboard_doctors
                        )}`}
                        booking_days={item.bookings_days}
                      />
                    )}
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      alignContent: "center",
                      height: "100%",
                      width: "100%",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Image
                      resizeMode={"contain"}
                      style={{ width: 150, height: 150 }}
                      source={require("../../Assets/Images/arrow.png")}
                    />
                    <Text
                      style={{
                        fontSize: 25,
                        fontWeight: "700",
                        marginVertical: 10
                      }}
                    >
                      Oops,
                    </Text>
                    <Text style={{ fontSize: 17, fontWeight: "700" }}>
                      No Data Available
                    </Text>
                  </View>
                )}
              </View>
            ) : null}
            {this.state.UserDetail === "yes" ? (
              <View>
                {this.state.fetchDoctor && (
                  <Text
                    style={{
                      color: "#3d4461",
                      fontSize: 20,
                      fontFamily: CONSTANT.PoppinsBold,
                      marginBottom: 15
                    }}
                  >
                    About "{this.state.fetchDoctor[0].name}"
                  </Text>
                )}

                {this.state.fetchDoctor && (
                  <Text style={styles.aboutContentStyle}>
                    {this.state.fetchDoctor[0].contents}
                  </Text>
                )}

                <Text
                  style={{
                    color: "#3d4461",
                    fontSize: 20,
                    fontFamily: CONSTANT.PoppinsBold,
                    marginBottom: 15,
                    marginTop: 20
                  }}
                >
                  Offered Services
                </Text>
                {this.state.fetchspecialires && (
                  <FlatList
                    style={{ paddingLeft: 5 }}
                    data={this.state.fetchspecialires}
                    keyExtractor={(x, i) => i.toString()}
                    renderItem={({ item }) => (
                      <OfferedServicesCard
                        name={`${entities.decode(item.name)}`}
                        logo={{ uri: `${item.logo}` }}
                      />
                    )}
                  />
                )}
                {this.state.fetchDoctor &&
                  this.state.fetchExperience &&
                  this.state.fetchExperience.length >= 1 &&
                  this.state.fetchrole == "doctors" && (
                    <View>
                      <Text
                        style={{
                          color: "#3d4461",
                          fontSize: 20,
                          fontFamily: CONSTANT.PoppinsBold,
                          marginBottom: 15,
                          marginTop: 20
                        }}
                      >
                        Experience
                      </Text>
                      {this.state.fetchExperience && (
                        <FlatList
                          style={{ paddingLeft: 5 }}
                          data={this.state.fetchExperience}
                          keyExtractor={(x, i) => i.toString()}
                          renderItem={({ item }) => (
                            <ExperienceCard
                              name={`${entities.decode(item.company_name)}`}
                              start={`${entities.decode(item.start)}`}
                              end={`${entities.decode(item.ending)}`}
                              title={`${entities.decode(item.job_title)}`}
                            />
                          )}
                        />
                      )}
                    </View>
                  )}

                {this.state.fetchDoctor &&
                  this.state.fetchEducation &&
                  this.state.fetchEducation.length >= 1 &&
                  this.state.fetchrole == "doctors" && (
                    <View>
                      <Text
                        style={{
                          color: "#3d4461",
                          fontSize: 20,
                          fontFamily: CONSTANT.PoppinsBold,
                          marginBottom: 15,
                          marginTop: 20
                        }}
                      >
                        Education
                      </Text>
                      {this.state.fetchEducation && (
                        <FlatList
                          style={{ paddingLeft: 5 }}
                          data={this.state.fetchEducation}
                          keyExtractor={(x, i) => i.toString()}
                          renderItem={({ item }) => (
                            <ExperienceCard
                              name={`${entities.decode(item.institute_name)}`}
                              start={`${entities.decode(item.start)}`}
                              end={`${entities.decode(item.ending)}`}
                              title={`${entities.decode(item.degree_title)}`}
                            />
                          )}
                        />
                      )}
                    </View>
                  )}
                {this.state.fetchDoctor &&
                  this.state.fetchspecialities &&
                  this.state.fetchspecialities.length >= 1 &&
                  this.state.fetchrole == "doctors" && (
                    <View>
                      <Text
                        style={{
                          color: "#3d4461",
                          fontSize: 20,
                          fontFamily: CONSTANT.PoppinsBold,
                          marginBottom: 15,
                          marginTop: 20
                        }}
                      >
                        Specializations
                      </Text>
                      {this.state.fetchspecialities && (
                        <FlatList
                          style={{ paddingLeft: 5 }}
                          data={this.state.fetchspecialities}
                          keyExtractor={(x, i) => i.toString()}
                          renderItem={({ item }) => (
                            <SpecializationCard
                              name={`${entities.decode(item.name)}`}
                            />
                          )}
                        />
                      )}
                    </View>
                  )}

                {this.state.fetchDoctor &&
                  this.state.fetchAward &&
                  this.state.fetchAward.length >= 1 &&
                  this.state.fetchrole == "doctors" && (
                    <View>
                      <Text
                        style={{
                          color: "#3d4461",
                          fontSize: 20,
                          fontFamily: CONSTANT.PoppinsBold,
                          marginBottom: 15,
                          marginTop: 20
                        }}
                      >
                        Awards And Recognitions
                      </Text>
                      {this.state.fetchAward && (
                        <FlatList
                          style={{ paddingLeft: 5 }}
                          data={this.state.fetchAward}
                          keyExtractor={(x, i) => i.toString()}
                          renderItem={({ item }) => (
                            <AwardsAndRecognitionsCard
                              year={`${entities.decode(item.year)}`}
                              title={`${entities.decode(item.title)}`}
                            />
                          )}
                        />
                      )}
                    </View>
                  )}

                {this.state.fetchDoctor &&
                  this.state.fetchMembership &&
                  this.state.fetchMembership.length >= 1 &&
                  this.state.fetchrole == "doctors" && (
                    <View>
                      <Text
                        style={{
                          color: "#3d4461",
                          fontSize: 20,
                          fontFamily: CONSTANT.PoppinsBold,
                          marginBottom: 15,
                          marginTop: 20
                        }}
                      >
                        Memberships
                      </Text>
                      {this.state.fetchMembership && (
                        <FlatList
                          style={{ paddingLeft: 5 }}
                          data={this.state.fetchMembership}
                          keyExtractor={(x, i) => i.toString()}
                          renderItem={({ item }) => (
                            <SpecializationCard
                              name={`${entities.decode(item.title)}`}
                            />
                          )}
                        />
                      )}
                    </View>
                  )}

                {this.state.fetchDoctor && this.state.fetchrole == "doctors" && (
                  <View>
                    <Text
                      style={{
                        color: "#3d4461",
                        fontSize: 20,
                        fontFamily: CONSTANT.PoppinsBold,
                        marginBottom: 15,
                        marginTop: 20
                      }}
                    >
                      Registrations
                    </Text>
                    <View
                      style={{
                        backgroundColor: "#ffffff",
                        marginTop: 2,
                        elevation: 3,
                        flexDirection: "row",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowColor: "#000",
                        marginLeft: 5,
                        marginRight: 3,
                        marginBottom: 5,
                        borderRadius: 4
                      }}
                    >
                      {this.state.fetchDoctor && (
                        <Text
                          style={{
                            color: "#484848",
                            fontSize: 15,
                            marginLeft: 20,
                            marginRight: 20,
                            marginTop: 15,
                            marginRight: 10,
                            fontFamily: CONSTANT.PoppinsMedium,
                            marginBottom: 15
                          }}
                        >
                          {this.state.fetchDoctor[0].registration_number}
                        </Text>
                      )}
                    </View>
                  </View>
                )}

                {this.state.fetchDoctor &&
                  this.state.fetchDownload &&
                  this.state.fetchDownload.length >= 1 &&
                  this.state.fetchrole == "doctors" && (
                    <View>
                      <Text
                        style={{
                          color: "#3d4461",
                          fontSize: 20,
                          fontFamily: CONSTANT.PoppinsBold,
                          marginBottom: 15,
                          marginTop: 20
                        }}
                      >
                        Downloads
                      </Text>
                      {this.state.fetchDownload && (
                        <FlatList
                          style={{ paddingLeft: 5 }}
                          data={this.state.fetchDownload}
                          keyExtractor={(x, i) => i.toString()}
                          renderItem={({ item }) => (
                            <DownloadCard
                              name={`${entities.decode(item.download_name)}`}
                              size={`${entities.decode(item.download_size)}`}
                            />
                          )}
                        />
                      )}
                    </View>
                  )}
              </View>
            ) : null}
            {this.state.OnlineConsultation === "yes" ? (
              <View>
                {this.state.fetchDoctor && (
                  <Text
                    style={{
                      color: "#3d4461",
                      fontSize: 20,
                      fontFamily: CONSTANT.PoppinsBold,
                      marginBottom: 15
                    }}
                  >
                    Consultation By “{this.state.fetchDoctor[0].name}”
                  </Text>
                )}
                {this.state.fetchConsultationData.length >= 1 ? (
                  <FlatList
                    style={{}}
                    data={this.state.fetchConsultationData}
                    keyExtractor={(x, i) => i.toString()}
                    renderItem={({ item }) => (
                      <OnlineConsultationCard
                        image={{ uri: `${item.image_url}` }}
                        Name={`${item.name}`}
                        date={`${entities.decode(item.date)}`}
                        coment={`${entities.decode(item.comment)}`}
                        title={`${entities.decode(item.title)}`}
                      />
                    )}
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      alignContent: "center",
                      height: "100%",
                      width: "100%",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Image
                      resizeMode={"contain"}
                      style={{ width: 150, height: 150 }}
                      source={require("../../Assets/Images/arrow.png")}
                    />
                    <Text
                      style={{
                        fontSize: 25,
                        fontWeight: "700",
                        marginVertical: 10
                      }}
                    >
                      Oops,
                    </Text>
                    <Text style={{ fontSize: 17, fontWeight: "700" }}>
                      No Data Available
                    </Text>
                  </View>
                )}
              </View>
            ) : null}

            {this.state.OnboardDoctor === "yes" ? (
              <View>
                {this.state.fetchDoctor && (
                  <Text
                    style={{
                      color: "#3d4461",
                      fontSize: 20,
                      fontFamily: CONSTANT.PoppinsBold,
                      marginBottom: 15
                    }}
                  >
                    Team By “{this.state.fetchDoctor[0].name}”
                  </Text>
                )}
                {this.state.fetchOnboardDoctorData.length >= 1 ? (
                  <FlatList
                    style={{}}
                    data={this.state.fetchOnboardDoctorData}
                    keyExtractor={(x, i) => i.toString()}
                    renderItem={({ item }) => (
                      <TopRatedCard
                        profileImage={{ uri: `${item.image}` }}
                        specialities={`${entities.decode(
                          item.specialities.name
                        )}`}
                        name={`${entities.decode(item.name)}`}
                        sub_heading={`${entities.decode(item.sub_heading)}`}
                        total_rating={`${entities.decode(item.total_rating)}`}
                        average_rating={`${entities.decode(
                          item.average_rating
                        )}`}
                        featured_check={`${entities.decode(item.featured)}`}
                        verified={`${entities.decode(item.is_verified)}`}
                        verified_medically={`${entities.decode(
                          item.is_verified
                        )}`}
                        // role={`${entities.decode(item.role)}`}
                      />
                    )}
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      alignContent: "center",
                      height: "100%",
                      width: "100%",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Image
                      resizeMode={"contain"}
                      style={{ width: 150, height: 150 }}
                      source={require("../../Assets/Images/arrow.png")}
                    />
                    <Text
                      style={{
                        fontSize: 25,
                        fontWeight: "700",
                        marginVertical: 10
                      }}
                    >
                      Oops,
                    </Text>
                    <Text style={{ fontSize: 17, fontWeight: "700" }}>
                      No Data Available
                    </Text>
                  </View>
                )}
              </View>
            ) : null}

            {this.state.Feedback === "yes" ? (
              <View>
                <Text
                  style={{
                    color: "#3d4461",
                    fontSize: 20,
                    fontFamily: CONSTANT.PoppinsBold,
                    marginBottom: 15
                  }}
                >
                  Patient Feedback
                </Text>
                {this.state.fetchfeedback.length >= 1 ? (
                  <FlatList
                    style={{ paddingLeft: 5 }}
                    data={this.state.fetchfeedback}
                    keyExtractor={(x, i) => i.toString()}
                    renderItem={({ item }) => (
                      <PatientFeedBackCard
                        tagline={`${entities.decode(item.tag_line)}`}
                        name={`${entities.decode(item.name)}`}
                        date={`${entities.decode(item.date)}`}
                        is_verified={`${entities.decode(item.is_verified)}`}
                        content={`${entities.decode(item.content)}`}
                        recommend={`${entities.decode(item.recommend)}`}
                        recommend_text={`${entities.decode(
                          item.recommend_text
                        )}`}
                        image_url={{ uri: `${item.image_url}` }}
                      />
                    )}
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      alignContent: "center",
                      height: "100%",
                      width: "100%",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Image
                      resizeMode={"contain"}
                      style={{ width: 150, height: 150 }}
                      source={require("../../Assets/Images/arrow.png")}
                    />
                    <Text
                      style={{
                        fontSize: 25,
                        fontWeight: "700",
                        marginVertical: 10
                      }}
                    >
                      Oops,
                    </Text>
                    <Text style={{ fontSize: 17, fontWeight: "700" }}>
                      No Data Available
                    </Text>
                  </View>
                )}
              </View>
            ) : null}

            {this.state.Articles === "yes" ? (
              <View>
                {this.state.fetchDoctor && (
                  <Text
                    style={{
                      color: "#3d4461",
                      fontSize: 20,
                      fontFamily: CONSTANT.PoppinsBold,
                      marginBottom: 15
                    }}
                  >
                    Articles By “{this.state.fetchDoctor[0].name}”
                  </Text>
                )}
                {this.state.fetchArticle.length >= 1 ? (
                  <FlatList
                    style={{ paddingLeft: 5 }}
                    data={this.state.fetchArticle}
                    keyExtractor={(x, i) => i.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigation.navigate("ArticleDetailPage", {
                            itemId: item.ID
                          });
                        }}
                      >
                        <ArticlesCard
                          image={{ uri: `${item.image_url}` }}
                          likes={`${item.likes}`}
                          views={`${item.views}`}
                          category={`${entities.decode(item.categories.name)}`}
                          title={`${entities.decode(item.title)}`}
                          date={`${entities.decode(item.posted_date)}`}
                        />
                      </TouchableOpacity>
                    )}
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      alignContent: "center",
                      height: "100%",
                      width: "100%",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Image
                      resizeMode={"contain"}
                      style={{ width: 150, height: 150 }}
                      source={require("../../Assets/Images/arrow.png")}
                    />
                    <Text
                      style={{
                        fontSize: 25,
                        fontWeight: "700",
                        marginVertical: 10
                      }}
                    >
                      Oops,
                    </Text>
                    <Text style={{ fontSize: 17, fontWeight: "700" }}>
                      No Data Available
                    </Text>
                  </View>
                )}
              </View>
            ) : null}
          </View>
        </ScrollView>

        {this.state.fetchrole == "doctors" ? (
          <FloatingAction
            color={"#3fabf3"}
            actions={this.state.actions}
            onPressItem={name => {
              console.log(`selected button: ${name}`);
            }}
          />
        ) : (
          <FloatingAction
            color={"#3fabf3"}
            actions={this.state.HosActions}
            onPressItem={name => {
              console.log(`selected button: ${name}`);
            }}
          />
        )}
      </View>
    );
  }
}
export default DetailDoctorScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7"
  },
  searchText: {
    marginTop: 15,
    marginLeft: 10,
    marginBottom: 5,
    fontSize: 15
  },
  searchTextBold: {
    color: "#3d4461",
    marginLeft: 10,
    fontFamily: CONSTANT.PoppinsBold,
    fontSize: 20,
    marginTop: -8
  },
  docContentstyle: {
    alignSelf: "center",
    flexDirection: "column",

    marginTop: 15
  },
  titleStyle: {
    textAlign: "center",
    color: "#3d4461",
    fontSize: 13,
    fontFamily: CONSTANT.PoppinsRegular
  },
  DocName: {
    textAlign: "center",
    color: "#3d4461",
    fontSize: 17,
    fontFamily: CONSTANT.PoppinsMedium
  },
  buttonStyle1: {
    width: "35%",
    height: 50,
    backgroundColor: "#3fabf3",
    borderBottomColor: "#3fabf3",
    fontFamily: CONSTANT.PoppinsMedium,
    borderWidth: 0,
    marginTop: 5,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowColor: "#000",
    shadowRadius: 15,
    marginBottom: 45,
    fontSize: 12
  },
  buttonStyle2: {
    width: "35%",
    height: 50,
    backgroundColor: "#1abc9c",
    borderBottomColor: "#1abc9c",
    marginLeft: 10,
    borderWidth: 0,
    marginTop: 5,
    fontFamily: CONSTANT.PoppinsMedium,
    shadowRadius: 15,
    marginBottom: 45,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowColor: "#000",
    fontSize: 12
  },
  buttonStyle3: {
    width: "15%",
    height: 50,
    backgroundColor: "#fff",
    borderColor: "#fe736e",
    marginLeft: 10,
    borderWidth: 0,
    borderWidth: 3,
    marginBottom: 40,
    shadowRadius: 15,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowColor: "#000",
    fontSize: 12,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5,
    fontFamily: CONSTANT.PoppinsMedium
  },

  circle: {
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    backgroundColor: "#fe736e",
    marginTop: 20,
    marginLeft: 20,
    flexDirection: "row"
  },
  aboutContentStyle: {
    fontFamily: CONSTANT.PoppinsRegular
  }
});
