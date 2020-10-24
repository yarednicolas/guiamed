import React, {Component} from 'react';
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
  AsyncStorage,
  Alert,
  TextInput,
  ImageBackground,
} from 'react-native';
import StarRating from 'react-native-star-rating';
import {Input, InputProps, Button} from 'react-native-ui-kitten';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {withNavigation, DrawerActions} from 'react-navigation';
import CustomHeader from '../Header/CustomHeader';
import * as CONSTANT from '../Constants/Constant';
import HealthForumCard from './HealthForumCard';
import MultiSelect from 'react-native-multiple-select';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Dropdown} from 'react-native-material-dropdown';
import axios from 'axios';
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

class SearchQuestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      selectedItems: [],
      SpecialityKnown: [],
      Title: '',
      Description: '',
      Search: '',
      Refresh: false,
      storedType: "",
    };
  }
  componentWillMount() {
    this.getUser();

  }
  getUser = async () => {
    try {

      const storedType = await AsyncStorage.getItem("user_type");


      if (storedType !== null) {
        this.setState({ storedType });
      } else {
        //  alert('something wrong')
      }
      this.HomeSpecialitiesSpinner();
      this.fetchHealthForumBasic();
      this.fetchHealthQuestion();
    } catch (error) {
      // alert(error)
    }
  };
  onSelectedItemsChange = selectedItems => {
    this.setState({selectedItems});
  };
  HomeSpecialitiesSpinner = async () => {
    return fetch(CONSTANT.BaseUrl + 'taxonomies/get-specilities', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        let HomeSpecialities = responseJson;
        this.setState({
          HomeSpecialities,
        });
      })
      .catch(error => {
        console.error(error);
      });
  };
  fetchHealthForumBasic = async () => {
    const {params} = this.props.navigation.state;
    const response = await fetch(CONSTANT.BaseUrl + 'forums/basic');
    const json = await response.json();
    this.setState({fetchHealthtitle: json[0].hf_title});
    this.setState({fetchHealthhf_sub_title: json[0].hf_sub_title});
    this.setState({fetchHealthhf_description: json[0].hf_description});
  };
  fetchHealthQuestion = async () => {
    const response = await fetch(CONSTANT.BaseUrl + 'forums/get_listing');
    const json = await response.json();
    if (
      Array.isArray(json) &&
      json[0] &&
      json[0].type &&
      json[0].type === 'error'
    ) {
      this.setState({HealthQuestion: [], isLoading: false}); // empty data set
    } else {
      this.setState({HealthQuestion: json, isLoading: false});
    }
  };
  fetchSearchQuestion = async () => {
    this.setState({
      HealthQuestion: [],
    });
    const response = await fetch(
      CONSTANT.BaseUrl +
        'forums/get_listing?specialities=' +
        this.state.SpecialityKnown[0] +
        '&Search=' +
        this.state.Search,
    );
    const json = await response.json();
    if (
      Array.isArray(json) &&
      json[0] &&
      json[0].type &&
      json[0].type === 'error'
    ) {
      this.setState({HealthQuestion: [], isLoading: false}); // empty data set
    } else {
      this.setState({HealthQuestion: json, isLoading: false, ExpRefresh: true});
    }
  };
  submitQuestion = () => {
    const {reply} = this.state;
    const {params} = this.props.navigation.state;
    if (
      this.state.Title == '' &&
      this.state.Description == '' &&
      this.state.SpecialityKnown[0] == ''
    ) {
      //alert("Please enter Email address");
      this.setState({email: 'Please Add Complete Data'});
    } else {
      // this.openProgressbar();
      axios
        .post(CONSTANT.BaseUrl + 'forums/add_question', {
          user_id: '12',
          speciality: this.state.SpecialityKnown[0],
          title: this.state.Title,
          description: this.state.Description,
        })
        .then(async response => {
          if (response.status === 200) {
            alert(response.data.message);
          } else if (response.status === 203) {
            alert(response.data.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };
  render() {
    let data = this.state.HomeSpecialities;

    const {isLoading} = this.state;

    return (
      <View style={styles.container}>
        <CustomHeader headerText={CONSTANT.GetAnswersHeaderText} />
        {isLoading ? (
          <View style={styles.searchQuestionMainArea}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.searchQuestionActivityIndicator}
            />
          </View>
        ) : null}
        <ScrollView>
          <ImageBackground
            source={require('../../Assets/Images/HealthMain.png')}
            style={styles.searchQuestionScrollImageBackground}>
            <View style={{}}>
              <View style={styles.searchQuestionScrollTextArea}>
                {this.state.fetchHealthtitle && (
                  <Text style={styles.searchQuestionScrollTitleText}>
                    {this.state.fetchHealthtitle}
                  </Text>
                )}
                {this.state.fetchHealthhf_sub_title && (
                  <Text style={styles.searchQuestionScrollSubTitleText}>
                    {this.state.fetchHealthhf_sub_title}
                  </Text>
                )}
                {this.state.fetchHealthhf_description && (
                  <Text style={styles.searchQuestionScrollDescriptionText}>
                    {this.state.fetchHealthhf_description}
                  </Text>
                )}
                <TouchableOpacity
                  onPress={() => { this.state.storedType != '' ?
                    this.RBSheet.open() : Alert.alert('Lo sentimos' , "Por favor ingresa primero");
                  }}
                  style={styles.searchQuestionTouchableArea}>
                  <Text style={styles.searchQuestionTouchableText}>
                    {CONSTANT.GetAnswersPostQuestion}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
          <View style={styles.searchQuestionScrollSearchArea}>
            <View style={styles.searchQuestionScrollSearchTextArea}>
              <Text style={styles.searchQuestionScrollSearchQueryText}>
                {CONSTANT.GetAnswersSearchQuery}
              </Text>
              <TouchableOpacity
                onPress={() => this.joinDataEducation()}
                style={styles.searchQuestionScrollSearchTouchableArea}>
                {/* <Text   style={{color:'#3d4461'  , fontSize:13 }}>Add Now (+)</Text> */}
              </TouchableOpacity>
            </View>
            <View style={styles.searchQuestionScrollSearchTextInputArea}>
              <View>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#7F7F7F"
                  placeholder={CONSTANT.GetAnswersTypeQuery}
                  onChangeText={Search => this.setState({Search})}
                  style={styles.searchQuestionScrollSearchTextInputStyle}
                />
                <View style={styles.searchQuestionMultiArea}>
                  <MultiSelect
                    style={styles.searchQuestionMultiStyle}
                    ref={component => {
                      this.multiSelect = component;
                    }}
                    onSelectedItemsChange={value =>
                      this.setState({SpecialityKnown: value})
                    }
                    uniqueKey="slug"
                    items={this.state.HomeSpecialities}
                    selectedItems={this.state.SpecialityKnown}
                    borderBottomWidth={0}
                    single={true}
                    selectText={CONSTANT.GetAnswersPickSpeciality}
                    searchInputPlaceholderText={
                      CONSTANT.GetAnswersSearchSpeciality
                    }
                    onChangeInput={text => console.log(text)}
                    displayKey="name"
                    styleMainWrapper={styles.searchQuestionMultiWrapper}
                    styleDropdownMenuSubsection={
                      styles.searchQuestionMultiDropdown
                    }
                    submitButtonText={CONSTANT.GetAnswersSubmit}
                  />
                </View>
                <TouchableOpacity
                  onPress={this.fetchSearchQuestion}
                  style={styles.buttonHover}>
                  <Text style={styles.searchQuestionSearchTouchableText}>
                    {CONSTANT.GetAnswersSearch}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.searchQuestionHealthArea}>
            <Text style={styles.searchQuestionHealthText}>
              {CONSTANT.GetAnswersPublicHealthForum}
            </Text>
          </View>
          {this.state.HealthQuestion && (
            <FlatList
              style={styles.searchQuestionHealthListStyle}
              data={this.state.HealthQuestion}
              extraData={this.state.Refresh}
              ListEmptyComponent={this._listEmptyComponent}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('GetAnswers', {
                      itemId: item.ID,
                      itemQuestion: item.title,
                    });
                  }}
                  activeOpacity={0.9}>
                  <HealthForumCard
                    image={{uri: `${item.image}`}}
                    name={`${entities.decode(item.title)}`}
                    date={`${entities.decode(item.post_date)}`}
                    answer={`${entities.decode(item.answers)}`}
                    detail={`${entities.decode(item.content)}`}
                  />
                </TouchableOpacity>
              )}
            />
          )}
        </ScrollView>

        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={450}
          duration={250}
          customStyles={{
            container: {
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: 15,
              paddingRight: 15,
              backgroundColor: 'transparent',
            },
          }}>
          <View style={styles.searchQuestionRBSheetMainArea}>
            <View style={styles.searchQuestionRBSheetTextArea}>
              <Text style={styles.searchQuestionRBSheetTextStyle}>
                {CONSTANT.GetAnswersPostQuestion}
              </Text>
            </View>

            <View style={styles.searchQuestionRBSheetScrollArea}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.searchQuestionRBSheetScrollStyle}>
                <View style={styles.searchQuestionRBSheetMultiArea}>
                  <MultiSelect
                    style={styles.searchQuestionRBSheetMultiStyle}
                    ref={component => {
                      this.multiSelect = component;
                    }}
                    onSelectedItemsChange={value =>
                      this.setState({SpecialityKnown: value})
                    }
                    uniqueKey="id"
                    items={this.state.HomeSpecialities}
                    selectedItems={this.state.SpecialityKnown}
                    borderBottomWidth={0}
                    single={true}
                    searchInputPlaceholderText={
                      CONSTANT.GetAnswersSearchSpeciality
                    }
                    onChangeInput={text => console.log(text)}
                    displayKey="name"
                    styleDropdownMenu={styles.searchQuestionRBSheetDropdown}
                    selectText={CONSTANT.GetAnswersPickSpeciality}
                    styleMainWrapper={styles.searchQuestionRBSheetWrapper}
                    styleDropdownMenuSubsection={
                      styles.searchQuestionRBSheetDropdownSubsection
                    }
                    submitButtonText={CONSTANT.GetAnswersSubmit}
                  />
                </View>
                <View style={styles.searchQuestionRBSheetTitleArea}>
                  <TextInput
                    style={styles.searchQuestionRBSheetTitleText}
                    underlineColorAndroid="transparent"
                    name={CONSTANT.GetAnswersTypeQuery}
                    placeholder={CONSTANT.GetAnswersTypeQuery}
                    placeholderTextColor="#807f7f"
                    onChangeText={Title => this.setState({Title})}
                  />
                </View>
                <View style={styles.searchQuestionRBSheetDescriptionArea}>
                  <TextInput
                    multiline={true}
                    style={styles.searchQuestionRBSheetDescriptionText}
                    underlineColorAndroid="transparent"
                    name={CONSTANT.GetAnswersQueryDetail}
                    placeholder={CONSTANT.GetAnswersQueryDetail}
                    placeholderTextColor="#807f7f"
                    onChangeText={Description => this.setState({Description})}
                  />
                </View>
              </ScrollView>
            </View>

            <TouchableOpacity
              onPress={this.submitQuestion}
              style={styles.buttonHover}>
              <Text style={styles.searchQuestionRBSheetTouchableText}>
                {CONSTANT.GetAnswersAskQuery}
              </Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
      </View>
    );
  }
}
export default withNavigation(SearchQuestions);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  buttonHover: {
    width: 150,
    height: 50,
    backgroundColor: '#3fabf3',
    borderBottomColor: '#3fabf3',
    marginLeft: 15,
    borderWidth: 0,
    marginTop: 5,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    marginBottom: 25,
    shadowOffset: {width: 1, height: 13},
    fontSize: 13,
    borderRadius: 4,
    overflow: 'hidden',
  },
  searchQuestionMainArea: {justifyContent: 'center', height: '100%'},
  searchQuestionActivityIndicator: {
    height: 30,
    width: 30,
    borderRadius: 60,
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 5,
  },
  searchQuestionScrollImageBackground: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  searchQuestionScrollTextArea: {
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
  },
  searchQuestionScrollTitleText: {
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    fontFamily:CONSTANT.PoppinsRegular,
  },
  searchQuestionScrollSubTitleText: {
    color: CONSTANT.primaryColor,
    textAlign: 'center',
    fontSize: 25,
    fontFamily:CONSTANT.PoppinsMedium,
  },
  searchQuestionScrollDescriptionText: {
    color: '#323232',
    textAlign: 'center',
    fontSize: 13,
    marginLeft: 30,
    marginRight: 30,
    fontFamily:CONSTANT.PoppinsRegular,
  },
  searchQuestionTouchableArea: {
    alignItems: 'center',
    height: 40,
    margin: 15,
    borderRadius: 4,
    width: '70%',
    alignSelf: 'center',
    backgroundColor: '#3fabf3',
    fontFamily:CONSTANT.PoppinsBold,
  },
  searchQuestionTouchableText: {
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: '#fff',
    marginLeft: 15,
    marginRight: 15,
    paddingTop: 10,
    fontFamily:CONSTANT.PoppinsMedium,
  },
  searchQuestionScrollSearchArea: {
    backgroundColor: '#fff',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 4,
    elevation: 3,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowColor: '#000',
    borderRadius: 4,
  },
  searchQuestionScrollSearchTextArea: {flexDirection: 'row'},
  searchQuestionScrollSearchQueryText: {
    color: '#3d4461',
    width: '70%',
    fontSize: 20,
    fontFamily:CONSTANT.PoppinsBold,
    marginBottom: 15,
    marginLeft: 10,
    marginTop: 10,
  },
  searchQuestionScrollSearchTouchableArea: {
    width: '30%',
    marginBottom: 15,
    marginLeft: 10,
    marginTop: 15,
  },
  searchQuestionScrollSearchTextInputArea: {
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  searchQuestionScrollSearchTextInputStyle: {
    height: 45,
    paddingLeft: 10,
    borderRadius: 2,
    borderWidth: 0.6,
    borderColor: '#dddddd',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    fontFamily:CONSTANT.PoppinsRegular,
  },
  searchQuestionMultiArea: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10
  },
  searchQuestionMultiStyle: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10
  },
  searchQuestionMultiWrapper: {
    backgroundColor: '#fff',
    borderRadius: 4,
    marginTop: 10,
  },
  searchQuestionMultiDropdown: {
    backgroundColor: '#fff',
    paddingRight: -7,
    height: 55,
    paddingLeft: 10,
    borderWidth: 0.6,
    borderColor: '#fff',
    borderColor: '#dddddd',
    borderRadius: 4,
  },
  searchQuestionSearchTouchableText: {
    color: '#fff',
    fontSize: 14,
    fontFamily:CONSTANT.PoppinsRegular,
    textAlign: 'center',
    top: 18,
  },
  searchQuestionHealthArea: {flexDirection: 'row'},
  searchQuestionHealthText: {
    color: '#3d4461',
    width: '70%',
    fontSize: 20,
    marginBottom: 15,
    marginLeft: 10,
    marginTop: 10,
    fontFamily:CONSTANT.PoppinsBold
  },
  searchQuestionHealthListStyle: {paddingLeft: 5},
  searchQuestionRBSheetMainArea: {
    backgroundColor: '#fff',
    width: '100%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    overflow: 'hidden',
  },
  searchQuestionRBSheetTextArea: {backgroundColor: '#3d4461', height: 50},
  searchQuestionRBSheetTextStyle: {
    width: '100%',
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 20,
    marginTop: 10,
  },
  searchQuestionRBSheetScrollArea: {
    height: 300,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchQuestionRBSheetScrollStyle: {width: '100%'},
  searchQuestionRBSheetMultiArea: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  searchQuestionRBSheetMultiStyle: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  searchQuestionRBSheetDropdown: {backgroundColor: '#000'},
  searchQuestionRBSheetWrapper: {
    backgroundColor: '#fff',
    borderRadius: 4,
    marginTop: 10,
  },
  searchQuestionRBSheetDropdownSubsection: {
    backgroundColor: '#fff',
    paddingRight: -7,
    height: 55,
    paddingLeft: 10,
    borderWidth: 0.6,
    borderColor: '#fff',
    borderColor: '#dddddd',
    borderRadius: 4,
  },
  searchQuestionRBSheetTitleArea: {
    borderWidth: 0.6,
    margin: 10,
    borderRadius: 4,
    borderColor: '#dddddd',
  },
  searchQuestionRBSheetTitleText: {
    fontSize: 15,
    padding: 5,
    height: 40,
    color: '#323232',
  },
  searchQuestionRBSheetDescriptionArea: {
    height: 150,
    borderWidth: 0.6,
    margin: 10,
    borderRadius: 4,
    borderColor: '#dddddd',
  },
  searchQuestionRBSheetDescriptionText: {
    fontSize: 15,
    height: 150,
    padding: 5,
    height: 40,
    color: '#323232',
  },
  searchQuestionRBSheetTouchableText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    top: 18,
  },
});
