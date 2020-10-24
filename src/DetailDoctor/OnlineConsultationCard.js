import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Text,
  Image
} from "react-native";
import StarRating from "react-native-star-rating";
import { Input, InputProps, Button } from "react-native-ui-kitten";
import AntIcon from "react-native-vector-icons/AntDesign";
import { withNavigation, DrawerActions } from "react-navigation";
import * as CONSTANT from "../Constants/Constant";
class OnlineConsultationCard extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: "#fff",
            overflow: "hidden",
            padding: 15,
            borderRadius: 4
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Image
              resizeMode={"cover"}
              style={{ height: 40, width: 40, borderRadius: 40 / 2 }}
              source={this.props.image}
            />
            <View style={{ flexDirection: "column", marginTop: 8 }}>
              <Text
                style={{
                  color: "#484848",
                  fontSize: 15,
                  marginLeft: 10,
                  fontFamily:CONSTANT.PoppinsBold
                }}
              >
                {this.props.title}
              </Text>
              <View style={{  marginLeft: 10 }}>
                <Text
                  numberOfLines={1}
                  style={{ color: "#484848", fontSize: 13  , fontFamily:CONSTANT.PoppinsMedium }}
                >
                  Answered by “{this.props.Name}”
                </Text>
               
                <Text
                  numberOfLines={1}
                  style={{ color: "#484848", fontSize: 13  ,fontFamily:CONSTANT.PoppinsMedium }}
                >
                  {this.props.date}
                </Text>
              </View>
            </View>
          </View>
          <Text style={{ marginTop: 10  , fontFamily:CONSTANT.PoppinsRegular }}>{this.props.coment}</Text>
        </View>
      </View>
    );
  }
}
export default withNavigation(OnlineConsultationCard);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    marginTop: 2,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowColor: "#000",
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
    borderRadius: 4,
    paddingRight: 10
  }
});
