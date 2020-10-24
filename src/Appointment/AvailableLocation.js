import React, { Component } from "react";
import {
  View,
  StyleSheet,
  AsyncStorage,
  StatusBar,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  ActivityIndicator,
  PanResponder,
  Alert,
  Dimensions
} from "react-native";
import { withNavigation, DrawerActions } from "react-navigation";
import { ScrollableTabView } from "@valdio/react-native-scrollable-tabview";
import CustomHeader from "../Header/CustomHeader";
import * as CONSTANT from "../Constants/Constant";
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();

class AvailableLocation extends Component {
  state = {
    availableLocationData: [],
    isLoading: true
  };
  componentDidMount() {
    this.fetchAvailablelocations();
  }
  fetchAvailablelocations = async () => {
    const id = await AsyncStorage.getItem("projectUid");
    const response = await fetch(
      CONSTANT.BaseUrl + "team/get_hospital_listing?user_id=" + id
    );
    const json = await response.json();
    if (
      Array.isArray(json) &&
      json[0] &&
      json[0].type &&
      json[0].type === "error"
    ) {
      this.setState({ availableLocationData: [], isLoading: false }); // empty data set
    } else {
      this.setState({ availableLocationData: json, isLoading: false });
    }
  };

  render() {
    const { isLoading } = this.state;
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
        {this.state.availableLocationData && (
          <FlatList
            style={{ paddingLeft: 5 }}
            data={this.state.availableLocationData}
            ListEmptyComponent={this._listEmptyComponent}
            keyExtractor={(x, i) => i.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("LocationDetail", {
                    id: item.ID
                  })
                }
                activeOpacity={0.9}
              >
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
                      source={{ uri: item.image }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "column",
                      margin: 10,
                      justifyContent: "center"
                    }}
                  >
                    <Text style={{ color: "#3FABF3", fontSize: 13 ,fontFamily:CONSTANT.PoppinsMedium, }}>
                      {item.status}
                    </Text>
                    <Text
                      style={{
                        color: "#3D4461",
                        fontFamily:CONSTANT.PoppinsBold,
                        fontSize: 16
                      }}
                    >
                      {item.name}
                    </Text>

                    <FlatList
                      style={{}}
                      data={this.state.availableLocationData[index].days}
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
                            {item.d}
                          </Text>
                        </View>
                      )}
                      horizontal={true}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  }
}
export default withNavigation(AvailableLocation);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7"
  }
});
