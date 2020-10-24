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

import { withNavigation, DrawerActions } from "react-navigation";
import CustomHeader from "../Header/CustomHeader";
import * as CONSTANT from "../Constants/Constant";
import ArticleListCard from "./ArticleListCard";
import ArticleDetailPage from "./ArticleDetailPage";
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();

class ArticleListing extends Component {
 
  constructor() {
    super();
    this.onEndReachedCalledDuringMomentum = true;
    this.state = {
      loading: true,
      //Loading state used while loading the data for the first time
      serverData: [],
      //Data Source for the FlatList
      fetching_from_server: false,
      //Loading state used while loading more data
      BlogListTotalCount:'',
      data: [],
      Toataldata: '',
      page: 1,
      isLoading: true,
      BlogList: [],
      selectedItems: [],
      SpecialityKnown: [],
      Title: "",
      Description: "",
      Search: "",
      Refresh: false
    };
    this.offset = 1;
    //Index of the offset to load from web API
  }
  componentWillMount() {
    this.fetchBlogList();
  }
  fetchBlogList = async () => {
    const response = await fetch(CONSTANT.BaseUrl + "listing/get_articles");
    const json = await response.json();
    if (
      Array.isArray(json) &&
      json[0] &&
      json[0].type &&
      json[0].type === "error"
    ) {
      this.setState({ BlogList: [], isLoading: false }); // empty data set
    } else {
      this.offset = this.offset + 1;
      this.setState({ BlogList: [...this.state.BlogList, ...this.state.BlogList.concat(json)] , isLoading: false });
      this.setState({ BlogListTotalCount: json[0].totals, isLoading: false });
    }
  };
  loadMoreData = async () => {
    // const response = await fetch(CONSTANT.BaseUrl + "listing/get_articles");
    // const json = await response.json();
    // if (
    //   Array.isArray(json) &&
    //   json[0] &&
    //   json[0].type &&
    //   json[0].type === "error"
    // ) {
    //   this.setState({ BlogList: [], isLoading: false }); // empty data set
    // } else {
    //   this.offset = this.offset + 1;
    //   this.setState({BlogList: this.state.BlogList.concat(responseJson)  , isLoading: false });
    //   // this.setState({ BlogListTotalCount: json[0].totals, isLoading: false });
    // }


    this.setState({ fetching_from_server: true }, () => {
      fetch(CONSTANT.BaseUrl +
        'listing/get_articles?' +'page_number=' +
        this.offset,)
      //Sending the currect offset with get request
          .then(response => response.json())
          .then(responseJson => {
          //Successful response from the API Call 

            //After the response increasing the offset for the next API call.
            if (
                  Array.isArray(responseJson) &&
                  responseJson[0] &&
                  responseJson[0].type &&
                  responseJson[0].type === 'error'
                ) {
                  this.setState({data: [], isLoading: false}); // empty data set
                } else {
                  this.offset = this.offset + 1;
                  this.setState({BlogList: this.state.BlogList.concat(responseJson)  , isLoading: false , fetching_from_server: false});
//                   this.setState({Toataldata: responseJson[0].totals , isLoading: false});
                }
          })
          .catch(error => {
            console.error(error);
          });
    
     });
  };

  renderFooter() {
    return (
    //Footer View with Load More button
    <View>
      {
        this.state.BlogListTotalCount.toString()  != this.state.BlogList.length ?
        <View style={styles.footer}>
        <TouchableOpacity
          onPress={this.loadMoreData}
          //On Click of button calling loadMoreData function to load more data
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>Load More</Text>
          {this.state.fetching_from_server ? (
            <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
          ) : null}
        </TouchableOpacity>
      </View>:
      null
      }
    </View>
    );
  }

  render() {
    let data = this.state.HomeSpecialities;
    const { isLoading } = this.state;
    return (
      <View style={styles.container}>
        <CustomHeader headerText={CONSTANT.ArticleListingHeaderText} />
        {isLoading ? (
          <View style={styles.articleListingMainArea}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.articleListingActivityIndicatorStyle}
            />
          </View>
        ) : null}
        {this.state.BlogListTotalCount != '' ? (
            
            <Text style={styles.searchTextBold}>
            {this.state.BlogListTotalCount} {CONSTANT.ArticleListingSectionText}
           </Text>
          ) : null}
     
        {this.state.BlogList && (
          <FlatList
            style={styles.searchListStyle}
            data={this.state.BlogList}
            extraData={this.state.Refresh}
            ListEmptyComponent={this._listEmptyComponent}
            keyExtractor={(x, i) => i.toString()}
       
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("ArticleDetailPage", {
                    itemId: item.ID
                  });
                }}
                activeOpacity={0.9}
              >
                <ArticleListCard
                  image={{ uri: `${item.image_url}` }}
                  title={`${entities.decode(item.title)}`}
                  date={`${entities.decode(item.posted_date)}`}
                  view={item.views}
                  category={`${entities.decode(item.categories.name)}`}
                />
              </TouchableOpacity>
            )}
            extraData={this.state}
             ListFooterComponent={this.renderFooter.bind(this)}
          />
        )}
      </View>
    );
  }
}
export default withNavigation(ArticleListing);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7"
  },
  buttonHover: {
    width: 150,
    height: 50,
    backgroundColor: "#3fabf3",
    borderBottomColor: "#3fabf3",
    marginLeft: 15,
    borderWidth: 0,
    marginTop: 5,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    marginBottom: 25,
    shadowOffset: { width: 1, height: 13 },
    fontSize: 13,
    borderRadius: 4,
    overflow: "hidden"
  },
  searchTextBold: {
    color: "#3d4461",
    marginLeft: 10,
    marginTop: 15,
    marginBottom: 15,
    fontFamily:CONSTANT.PoppinsBold,
    fontSize: 20
  },
  articleListingMainArea: {
    justifyContent: "center",
    height: "100%"
  },
  articleListingActivityIndicatorStyle: {
    height: 30,
    width: 30,
    borderRadius: 60,
    alignContent: "center",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    elevation: 5
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadMoreBtn: {
    paddingTop: 10,
    paddingBottom:10,
    paddingLeft:20 ,
    paddingRight:20,
    backgroundColor: CONSTANT.primaryColor,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    fontFamily:CONSTANT.PoppinsMedium
  },
  searchListStyle: {paddingLeft: 5},
});
