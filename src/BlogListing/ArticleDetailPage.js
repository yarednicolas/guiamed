import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Text,
  Image
} from "react-native";
import StarRating from "react-native-star-rating";
import { Input, InputProps, Button } from "react-native-ui-kitten";
import AntIcon from "react-native-vector-icons/AntDesign";
import { withNavigation, DrawerActions } from "react-navigation";
import CustomHeader from "../Header/CustomHeader";
import { thisExpression } from "@babel/types";
import * as CONSTANT from "../Constants/Constant";
import HTML from "react-native-render-html";
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();

class ArticleDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      selectedItems: [],
      SpecialityKnown: [],
      Title: "",
      Description: "",
      Search: "",
      Refresh: false
    };
  }
  componentDidMount() {
    this.fetchArticleDetail();
  }
  fetchArticleDetail = async () => {
    const { params } = this.props.navigation.state;
    const response = await fetch(
      CONSTANT.BaseUrl + "listing/get_sinle_article?post_id=" + params.itemId
    );
    const json = await response.json();
    if (
      Array.isArray(json) &&
      json[0] &&
      json[0].type &&
      json[0].type === "error"
    ) {
      this.setState({ detailArticle: [], isLoading: false }); // empty data set
    } else {
      this.setState({ detailArticle: json, isLoading: false });
    }
  };
  render() {
    const { isLoading } = this.state;
    return (
      <View>
        <CustomHeader headerText={CONSTANT.ArticleDetailHeaderText} />
        {isLoading ? (
          <View style={styles.articleDetailActivityArea}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.articleDetailActivityStyle}
            />
          </View>
        ) : null}
        <ScrollView style={styles.articleDetailScrollArea}>
          {this.state.detailArticle && (
            <Image
              resizeMode="cover"
              style={styles.articleDetailScrollImage}
              source={{ uri: `${this.state.detailArticle[0].image_url}` }}
            />
          )}
          <View style={styles.articleDetailScrollTitleArea}>
            {this.state.detailArticle && (
              <Text
                numberOfLines={2}
                style={styles.articleDetailScrollTitleText}
              >
                {`${entities.decode(this.state.detailArticle[0].title)}`}
              </Text>
            )}
            {this.state.detailArticle && (
              <Text
                numberOfLines={2}
                style={styles.articleDetailScrollDataText}
              >
                {`${entities.decode(this.state.detailArticle[0].user_date)}`}
              </Text>
            )}

            {this.state.detailArticle && (
              <View style={styles.articleDetailScrollContentArea}>
                <HTML
                  lineHeight={20}
                  html={this.state.detailArticle[0].post_content}
                  containerStyle={{fontFamily:CONSTANT.PoppinsRegular}}
                  imagesMaxWidth={Dimensions.get("window").width}
                />
              </View>
            )}

            {this.state.detailArticle && (
              <View
                activeOpacity={0.7}
                style={styles.articleDetailMainLayoutServicesArea}
              >
                <View style={styles.mainLayoutServices}>
                  <View style={styles.articleDetailLayoutServices}>
                    <View style={styles.articleDetailServices}>
                      {this.state.detailArticle && (
                        <Image
                          style={styles.articleDetailServicesImage}
                          source={{
                            uri: `${this.state.detailArticle[0].user_image}`
                          }}
                        />
                      )}
                    </View>

                    <View style={styles.articleDetailUserArea}>
                      {this.state.detailArticle && (
                        <Text style={styles.articleDetailUserNameText}>
                          {this.state.detailArticle[0].user_name}
                        </Text>
                      )}
                      {this.state.detailArticle && (
                        <Text style={styles.articleDetailUserDataText}>
                          {this.state.detailArticle[0].user_date}
                        </Text>
                      )}
                    </View>
                  </View>
                  {this.state.detailArticle && (
                    <Text style={styles.articleDetailUserContentsText}>
                      {" "}
                      {`${entities.decode(
                        this.state.detailArticle[0].user_contents
                      )}`}
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}
export default withNavigation(ArticleDetailPage);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7"
  },
  articleDetailActivityArea: {
    justifyContent: "center",
    height: "100%"
  },
  articleDetailActivityStyle: {
    height: 30,
    width: 30,
    borderRadius: 60,
    alignContent: "center",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    elevation: 5
  },
  articleDetailScrollArea: { marginBottom: 50 },
  articleDetailScrollImage: {
    height: 300,
    width: "100%"
  },
  articleDetailScrollTitleArea: {
    marginRight: 10,
    marginBottom: 10
  },
  articleDetailScrollTitleText: {
    color: "#3d4461",
    fontSize: 20,
    fontFamily:CONSTANT.PoppinsMedium,
    margin: 10
  },
  articleDetailScrollDataText: {
    color: "#767676",
    fontSize: 15,
    marginLeft: 10,
    fontFamily:CONSTANT.PoppinsRegular
  },
  articleDetailScrollContentArea: {
    paddingLeft: 10,
    paddingRight: 10
  },
  articleDetailMainLayoutServicesArea: {
    flex: 1,
    backgroundColor: "#ffffff",
    marginTop: 2,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowColor: "#000",
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    borderRadius: 4,
    marginBottom: 25,
    overflow: "hidden"
  },
  articleDetailLayoutServices: {
    flexDirection: "row",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    paddingRight: 10
  },
  articleDetailServices: {
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center"
  },
  articleDetailServicesImage: {
    width: 60,
    height: 60,
    borderRadius: 4
  },
  articleDetailUserArea: {
    flexDirection: "column",
    justifyContent: "center"
  },
  articleDetailUserNameText: {
    color: "#484848",
    fontSize: 16,
    marginLeft: 10,
    fontFamily:CONSTANT.PoppinsMedium,
    marginRight: 10
  },
  articleDetailUserDataText: {
    color: "#3d4461",
    fontSize: 13,
    marginLeft: 10,
    marginRight: 10,
    fontFamily:CONSTANT.PoppinsRegular,
  },
  articleDetailUserContentsText: {
    color: "#484848",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    fontFamily:CONSTANT.PoppinsRegular,
  }
});
