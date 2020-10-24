import React, { Component } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  Linking,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  FlatList,
  ActivityIndicator,
  Image,
  Dimensions
} from "react-native";
import { Input, InputProps, Button } from "react-native-ui-kitten";
import AntIcon from "react-native-vector-icons/AntDesign";
import TopRatedCard from "../Home/TopRatedCard";
import CustomHeader from "../Header/CustomHeader";
import * as CONSTANT from "../Constants/Constant";
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();

class BookAppointmentCall extends Component {
  constructor(props) {
    super(props);
    this.onEndReachedCalledDuringMomentum = true;
  }
  state = {
    data: [],
    Toataldata: [],
    page: 1,
    isLoading: true,
    fetchbookingCallSetting: [],
    fetchbookingCallSettingText: []
  };
  componentDidMount() {
    this.fetchDoctorDetail();
  }
  fetchDoctorDetail = async () => {
    const { params } = this.props.navigation.state;
    const id = await AsyncStorage.getItem("projectUid");
    const response = await fetch(
      CONSTANT.BaseUrl +
        "listing/get_doctor?profile_id=" +
        params.id +
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
      this.setState({ fetchbookingCallSetting: [], isLoading: false }); // empty data set
    } else {
      this.setState({
        fetchbookingCallSetting: json[0].bookig_setting.phone_numbers,
        fetchbookingCallSettingText: json[0].bookig_setting
      });
    }
  };

  render() {
    const { isLoading } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#f7f7f7" barStyle="dark-content" />
        <CustomHeader headerText={"Call Doctor"} />
        {/* <Text onPress={()=>{Linking.openURL('tel:119');}} style={styles.funcNavText}>119</Text> */}
        <View style={{ flexDirection: "column" }}>
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
              justifyContent: "center",
              textAlign: "center",
              fontWeight: "700",
              fontSize: 20,
              marginBottom: 5
            }}
          >
            Call For Booking
          </Text>
          <Text style={{ justifyContent: "center", textAlign: "center" }}>
            Please Call On
          </Text>
          <View style={styles.TopRatedCardManagment}>
            <FlatList
              style={{ paddingLeft: 5 }}
              data={this.state.fetchbookingCallSetting}
              ListEmptyComponent={this._listEmptyComponent}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL("tel:" + item.number);
                  }}
                  style={{ flex: 1 }}
                >
                  <View style={{ flexDirection: "row", flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 20,
                        marginBottom: 10,
                        flex: 5,
                        color: "#3fabf3"
                      }}
                    >
                      {item.number}
                    </Text>
                    <AntIcon
                      name="phone"
                      color={"#1abc9c"}
                      size={17}
                      style={{
                        alignSelf: "center",
                        textAlign: "center",
                        marginBottom: 4,
                        marginLeft: 2,
                        marginRight: 1,
                        flex: 1
                      }}
                    />
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </View>
    );
  }
}
export default BookAppointmentCall;
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  searchText: {
    marginTop: 15,
    marginLeft: 10,
    marginBottom: 5,
    fontSize: 15,
    fontWeight: "700"
  },
  searchTextBold: {
    color: "#3d4461",
    marginLeft: 10,
    fontWeight: "900",
    fontSize: 20,
    marginTop: -8
  },
  TopRatedCardManagment: {
    marginRight: 5,
    marginLeft: 5,
    marginTop: 20
  }
});
