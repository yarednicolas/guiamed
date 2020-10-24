import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ScrollView,
  Text,
  Picker,
  Image,
  ActivityIndicator,
  Alert,
  TextInput,
  ImageBackground
} from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import { withNavigation, DrawerActions } from "react-navigation";
import * as CONSTANT from '../Constants/Constant';

const Entities = require("html-entities").XmlEntities;
const entities = new Entities();

class ArticleListCard extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.articleListMainArea}>
          <View style={styles.articleListSubArea}>
            <View style={styles.articleListImageArea}>
              <Image
                resizeMode={"cover"}
                style={styles.articleListImageStyle}
                source={this.props.image}
              />
            </View>
            <View style={styles.articleListTextArea}>
              <View>
                <Text style={styles.articleListCategoryText}>
                  {this.props.category}
                </Text>
              </View>
              <View>
                <Text numberOfLines={2} style={styles.articleListTitleText}>
                  {this.props.title}
                </Text>
              </View>
              <View style={styles.articleListDataTextArea}>
                <Text style={styles.articleListDataText}>
                  {this.props.date}
                </Text>
                {/* <Text style={styles.articleListViewText}>
                  {this.props.view}
                </Text> */}
              </View>
              {/* <View style={styles.articleListEditDeleteArea} /> */}
              {/* <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <Text style={{color: '#55acee', fontSize: 15}}>Edit</Text>
                <Text style={{color: '#fe736e', fontSize: 15, marginLeft: 20}}>
                  Delete
                </Text>
              </View> */}
            </View>
          </View>
        </View>
      </View>
    );
  }
}
export default withNavigation(ArticleListCard);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 4,
    overflow: "hidden",
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowColor: "#000",
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
    justifyContent: "center"
  },
  articleListMainArea: {
    backgroundColor: "#fff",
    borderRadius: 4,
    overflow: "hidden",
    alignSelf: "center"
  },
  articleListSubArea: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignContent: "center"
  },
  articleListImageArea: { width: "30%" },
  articleListImageStyle: { height: 150 },
  articleListTextArea: {
    width: "70%",
    flexDirection: "column",
    padding: 15,
    justifyContent: "center"
  },
  articleListCategoryText: {
    color: "#55acee",
    fontSize: 13,
    fontFamily:CONSTANT.PoppinsRegular
  },
  articleListTitleText: {
    color: "#3d4461",
    fontSize: 17,
    fontFamily:CONSTANT.PoppinsMedium
  },
  articleListDataTextArea: {
    flexDirection: "row",
    marginTop: 5
  },
  articleListDataText: {
    color: "#767676",
    fontSize: 13,
    fontFamily:CONSTANT.PoppinsRegular
  },
  articleListViewText: {
    color: "#767676",
    fontSize: 13
  },
  articleListEditDeleteArea: {
    marginTop: 12,
    marginBottom: 12,
    borderBottomColor: "#dddddd",
    borderBottomWidth: 0.6
  }
});
