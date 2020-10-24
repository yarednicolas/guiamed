import React, {Component} from 'react';
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
  PanResponder,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import {SwipeRow, List, Content} from 'native-base';
import {Input, InputProps, Button} from 'react-native-ui-kitten';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {withNavigation, DrawerActions} from 'react-navigation';
import CustomHeader from '../Header/CustomHeader';
import Dash from 'react-native-dash';
import SwipeCards from 'react-native-swipeable-cards';
import * as CONSTANT from '../Constants/Constant';
import TeamListCard from './TeamListCard';
import Carousel from 'react-native-snap-carousel';
import axios from 'axios';
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();
const horizontalMargin = 10;
const slideWidth = 280;

const sliderWidth = Dimensions.get('window').width;
const itemWidth = slideWidth + horizontalMargin * 2;
const itemHeight = 200;
class TeamListing extends Component {
  constructor(props) {
    super(props);
    this.approveDoctor = this.approveDoctor.bind(this);
    this.state = {
      isLoading: true,
      outOfCards: false,
      storedValue: '',
      storedType: '',
      profileImg: '',
      type: '',
      id: '',
      pendingTeamId: '',
      showAlert: false,
      TopRatedData: [],
      isDateTimePickerVisible: false,
      current_date: '',
      selected_date: '',
      entries: [{title: 'hello'}, {title: 'world'}],
    };
  }

  componentDidMount() {
    this.getUser();
  }
  getUser = async () => {
    try {
      const storedValue = await AsyncStorage.getItem('full_name');
      const storedType = await AsyncStorage.getItem('user_type');
      const profileImg = await AsyncStorage.getItem('profile_img');
      const type = await AsyncStorage.getItem('profileType');
      const id = await AsyncStorage.getItem('projectUid');
      //  console.log(storedValue ,storedType, profileImg  ,type , id);
      if (storedValue !== null) {
        this.setState({storedValue});
      } else {
        // alert('something wrong')
      }
      if (storedType !== null) {
        this.setState({storedType});
      } else {
        //  alert('something wrong')
      }
      if (profileImg !== null) {
        this.setState({profileImg});
      } else {
        //  alert('something wrong')
      }
      if (type !== null) {
        this.setState({type});
      } else {
        //  alert('something wrong')
      }
      if (id !== null) {
        this.setState({id});
      } else {
        //  alert('something wrong')
      }
      this.fetchPendingTeamListing();
      this.fetchTeamListing();
    } catch (error) {
      // alert(error)
    }
  };
  fetchTeamListing = async () => {
    const {id, current_date} = this.state;

    const response = await fetch(
      CONSTANT.BaseUrl + 'team/get_listing?user_id=' + id,
    );
    const json = await response.json();
    if (
      Array.isArray(json) &&
      json[0] &&
      json[0].type &&
      json[0].type === 'error'
    ) {
      this.setState({TeamPendingData: [], isLoading: false}); // empty data set
    } else {
      this.setState({TeamPendingData: json, isLoading: false});
    }
  };
  fetchPendingTeamListing = async () => {
    console.log('i am in ');
    const {id, current_date} = this.state;

    const response = await fetch(
      CONSTANT.BaseUrl + 'team/get_listing?status=pending&user_id=' + id,
    );
    const json = await response.json();
    if (
      Array.isArray(json) &&
      json[0] &&
      json[0].type &&
      json[0].type === 'error'
    ) {
      this.setState({TeamPendingListData: [], isLoading: false}); // empty data set
    } else {
      this.setState({TeamPendingListData: json, isLoading: false});
      console.log('Data:', JSON.stringify(TeamPendingListData));
      Alert.alert('Data:', JSON.stringify(TeamPendingListData));
    }
  };

  approveDoctor = async ID => {
    axios
      .post(CONSTANT.BaseUrl + 'team/update_status', {
        id: ID,
        status: 'publish',
      })
      .then(async response => {
        if (response.status === 200) {
          alert(response.data.message);
        } else if (response.status === 203) {
          alert(response.data.message);
        }
      })
      .catch(error => {
        alert(error);
        console.log(error);
      });
  };

  rejectDoctor = async ID => {
    axios
      .post(CONSTANT.BaseUrl + 'team/update_status', {
        id: ID,
        status: 'trash',
      })
      .then(async response => {
        if (response.status === 200) {
          alert(response.data.message);
        } else if (response.status === 203) {
          alert(response.data.message);
        }
      })
      .catch(error => {
        alert(error);
        console.log(error);
      });
  };
  _renderItem({item, index}) {
    return (
      <View>
        <View style={styles.teamListingRenderItem}>
          <Image
            style={styles.teamListingRenderItemImageStyle}
            source={{uri: item.image}}
          />
          <Text
            numberOfLines={1}
            style={styles.teamListingRenderItemName}>
            {item.name}
          </Text>
          <Text style={styles.teamListingRenderItemRequest}>
            {CONSTANT.TeamManagementNewRequest}
          </Text>
        </View>
        <View
          style={styles.teamListingTouchableArea}>
          <TouchableOpacity
            onPress={() => this.rejectDoctor(item.ID)}
            style={styles.teamListingTouchableReject}>
            <AntIcon name="close" color={'#fff'} size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.approveDoctor(item.ID)}
            style={styles.teamListingTouchableApprove}>
            <AntIcon name="check" color={'#fff'} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  render() {
    const { isLoading } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#f7f7f7" barStyle="dark-content" />
        <CustomHeader headerText={CONSTANT.TeamManagementHeaderText} />
        {isLoading  ? (
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
          <View style={styles.TopRatedCardManagment}>
            {this.state.TeamPendingListData ? (
              <Carousel
                ref={c => {
                  this._carousel = c;
                }}
                data={this.state.TeamPendingListData}
                renderItem={this._renderItem.bind(this)}
                sliderWidth={sliderWidth}
                itemWidth={itemWidth}
                inactiveSlideScale={1}
                slideStyle={styles.teamListingCarousalSlideStyle}
              />
            ) : null}
          </View>
          <Text
            style={styles.teamListingSectionText}>
            {CONSTANT.TeamManagementSectionText}
          </Text>
          <View style={styles.TopRatedCardManagment}>
            {this.state.TeamPendingData && (
              <FlatList
                style={styles.teamListingFlatListStyle}
                data={this.state.TeamPendingData}
                ListEmptyComponent={this._listEmptyComponent}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity activeOpacity={0.9}>
                    <TeamListCard
                      TeamImage={{uri: `${item.image}`}}
                      status={`${entities.decode(item.status)}`}
                      name={`${entities.decode(item.name)}`}
                    />
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}
export default withNavigation(TeamListing);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  container1: {
    flex: 1,
    backgroundColor: '#ffffff',
    elevation: 3,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowColor: '#000',
    borderRadius: 4,
    flexDirection: 'row',
    margin: 3,
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 300,
  },
  noMoreCardsText: {
    fontSize: 22,
  },
  thumbnail: {
    width: 300,
    height: 300,
  },
  text: {
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TopRatedCardManagment: {
    marginRight: 5,
    marginLeft: 5,
  },
  MainTopRatedStyle: {
    margin: 10,
    flexDirection: 'row',
  },
  ImageStyle: {
    height: 60,
    width: 60,
    position: 'relative',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  docContentstyle: {
    flexDirection: 'column',
    marginLeft: 10,
    alignSelf: 'center',
  },
  titleStyle: {
    color: '#6cb7f0',
    fontSize: 13,
  },
  ImageLayoutStyle: {
    elevation: 4,
    shadowColor: '#000',
    borderRadius: 4,
    overflow: 'hidden',
    width: 60,
    height: 60,
  },
  DocName: {
    color: '#3d4461',
    fontSize: 15,
    fontWeight: '700',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  teamListingRenderItem: {
    backgroundColor: '#fff',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    elevation: 3,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowColor: '#000',
  },
  teamListingRenderItemImageStyle: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  teamListingRenderItemName: {
    fontSize: 20,
    fontFamily:CONSTANT.PoppinsBold,
    marginTop: 10
  },
  teamListingRenderItemRequest: {
    fontSize: 15,
    marginTop: 5,
    fontFamily:CONSTANT.PoppinsMedium,
  },
  teamListingTouchableArea: {
    flexDirection: 'row',
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamListingTouchableReject: {
    backgroundColor: '#ff5851',
    margin: 10,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  teamListingTouchableApprove: {
    backgroundColor: '#90ee90',
    margin: 10,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  teamListingCarousalSlideStyle: {paddingHorizontal: 10},
  teamListingSectionText: {
    color: '#3d4461',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    marginLeft: 10,
    marginTop: 10,
  },
  teamListingFlatListStyle: {paddingLeft: 5}
});
