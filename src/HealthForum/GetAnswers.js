import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ScrollView,
  Text,
  Image,
  Alert,
  TextInput,
  ActivityIndicator,
  ImageBackground,
  AsyncStorage
} from 'react-native';
import StarRating from 'react-native-star-rating';
import {Input, InputProps, Button} from 'react-native-ui-kitten';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {withNavigation, DrawerActions} from 'react-navigation';
import CustomHeader from '../Header/CustomHeader';
import * as CONSTANT from '../Constants/Constant';
import axios from 'axios';
import MultiSelect from 'react-native-multiple-select';
import RBSheet from 'react-native-raw-bottom-sheet';
import HealthForumAnswerCard from './HealthForumAnswerCard';
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

class GetAnswers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reply: '',
      isLoading: true,
      Title: '',
      Description: '',
      storedType:'',
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
      this.fetchHealthAnswers();
    } catch (error) {
      // alert(error)
    }
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
  fetchHealthAnswers = async () => {
    const {params} = this.props.navigation.state;
    const response = await fetch(
      CONSTANT.BaseUrl + 'forums/get_answer?post_id=' + params.itemId,
    );
    const json = await response.json();
    if (
      Array.isArray(json) &&
      json[0] &&
      json[0].type &&
      json[0].type === 'error'
    ) {
      this.setState({HealthAnswers: [], isLoading: false}); // empty data set
    } else {
      this.setState({HealthAnswers: json, isLoading: false});
      this.setState({HealthAnswersList: json[0].answers, isLoading: false});
    }
  };
  submitAnswer = () => {
    if(this.state.storedType != ""){
      const {reply} = this.state;
      const {params} = this.props.navigation.state;
      if (reply == '') {
        //alert("Please enter Email address");
        this.setState({email: 'Please type Answer'});
      } else {
        // this.openProgressbar();
        axios
          .post(CONSTANT.BaseUrl + 'forums/update_answer', {
            post_id: params.itemId,
            profile_id: '460',
            answer: reply,
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
    }else{
      Alert.alert("Lo sentimos" , "Por favor ingresa primero")
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
    const {isLoading} = this.state;
    const {params} = this.props.navigation.state;
    return (
      <View style={styles.container}>
        <CustomHeader headerText={CONSTANT.GetAnswersHeaderText} />
        {isLoading ? (
          <View style={styles.getAnswersMainArea}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.getAnswersActivityIndicatorStyle}
            />
          </View>
        ) : null}
        <ScrollView>
          <ImageBackground
            source={require('../../Assets/Images/HealthMain.png')}
            style={styles.getAnswersScrollArea}>
            <View>
              <View
                style={styles.getAnswersTextArea}>
                {this.state.fetchHealthtitle && (
                  <Text
                    style={styles.getAnswersHealthText}>
                    {this.state.fetchHealthtitle}
                  </Text>
                )}
                {this.state.fetchHealthhf_sub_title && (
                  <Text
                    style={styles.getAnswersTitleText}>
                    {this.state.fetchHealthhf_sub_title}
                  </Text>
                )}
                {this.state.fetchHealthhf_description && (
                  <Text
                    style={styles.getAnswersDescriptionText}>
                    {this.state.fetchHealthhf_description}
                  </Text>
                )}
                <TouchableOpacity
                  onPress={() => { this.state.storedType != '' ?
                  this.RBSheet.open() : Alert.alert('Lo sentimos' , "Por favor ingresa primero");
                }}
                  style={styles.getAnswersTouchableArea}>
                  <Text
                    style={styles.getAnswersTouchableText}>
                    {CONSTANT.GetAnswersPostQuestion}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
          <View
            style={styles.getAnswersBackgroundArea}>
            <View style={styles.getAnswersBackgroundTextArea}>
              <Text
                style={styles.getAnswersBackgroundTextStyle}>
                {CONSTANT.GetAnswersQuestion}
              </Text>
              <TouchableOpacity
                onPress={() => this.joinDataEducation()}
                style={styles.getAnswersAddNow}>
                {/* <Text   style={{color:'#3d4461'  , fontSize:13 }}>Add Now (+)</Text> */}
              </TouchableOpacity>
            </View>
            <View style={styles.getAnswersItemArea}>
              <View>
                {this.state.HealthAnswers && (
                  <Text
                    style={styles.getAnswersItemText}>
                    {params.itemQuestion}
                  </Text>
                )}

                <TextInput
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#7F7F7F"
                  placeholder={CONSTANT.GetAnswersTypeReply}
                  onChangeText={reply => this.setState({reply})}
                  style={styles.getAnswersTypeReply}
                />

                <TouchableOpacity
                  onPress={this.submitAnswer}
                  style={styles.buttonHover}>
                  <Text
                    style={styles.getAnswersPostAnswer}>
                    {CONSTANT.GetAnswersPostAnswer}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.getAnswersGetAnswersArea}>
            {this.state.HealthAnswers && (
              <Text
                style={styles.getAnswersGetAnswersText}>
                {this.state.HealthAnswers[0].count_answers} {CONSTANT.GetAnswersAnswers}
              </Text>
            )}
          </View>
          {this.state.HealthAnswersList && (
            <FlatList
              style={styles.getAnswersListStyle}
              data={this.state.HealthAnswersList}
              ListEmptyComponent={this._listEmptyComponent}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({item}) => (
                <TouchableOpacity activeOpacity={0.9}>
                  <HealthForumAnswerCard
                    image={{uri: `${item.image}`}}
                    name={`${entities.decode(item.name)}`}
                    date={`${entities.decode(item.sub_heading)}`}
                    detail={`${entities.decode(item.answer)}`}
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
          <View
            style={styles.getAnswersRBSheetMainArea}>
            <View style={styles.getAnswersRBSheetPostQuestionArea}>
              <Text
                style={styles.getAnswersRBSheetPostQuestionText}>
                {CONSTANT.GetAnswersPostQuestion}
              </Text>
            </View>

            <View
              style={styles.getAnswersRBSheetSpecialityArea}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.getAnswersRBSheetSpecialityScrollArea}>
                <View style={styles.getAnswersRBSheetSpecialityMultiArea}>
                  <MultiSelect
                    style={styles.getAnswersRBSheetSpecialityMultiStyle}
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
                    searchInputPlaceholderText={CONSTANT.GetAnswersPickSpeciality}
                    onChangeInput={text => console.log(text)}
                    displayKey="name"
                    styleDropdownMenu={styles.getAnswersRBSheetSpecialityDropdown}
                    selectText={CONSTANT.GetAnswersPickSpeciality}
                    styleMainWrapper={styles.getAnswersRBSheetSpecialityWrapper}
                    styleDropdownMenuSubsection={styles.getAnswersRBSheetSpecialitySubDropdown}
                    submitButtonText={CONSTANT.GetAnswersSubmit}
                  />
                </View>
                <View
                  style={styles.getAnswersRBSheetQueryArea}>
                  <TextInput
                    style={styles.getAnswersRBSheetQueryText}
                    underlineColorAndroid="transparent"
                    name={CONSTANT.GetAnswersTypeQuery}
                    placeholder={CONSTANT.GetAnswersTypeQuery}
                    placeholderTextColor="#807f7f"
                    onChangeText={Title => this.setState({Title})}
                  />
                </View>
                <View
                  style={styles.getAnswersRBSheetDetailArea}>
                  <TextInput
                    multiline={true}
                    style={styles.getAnswersRBSheetDetailText}
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
              <Text
                style={styles.getAnswersRBSheetAskQuery}>
                {CONSTANT.GetAnswersAskQuery}
              </Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
      </View>
    );
  }
}
export default withNavigation(GetAnswers);
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
    fontFamily:CONSTANT.PoppinsMedium,
  },
  getAnswersMainArea: {justifyContent: 'center', height: '100%'},
  getAnswersActivityIndicatorStyle: {
    height: 30,
    width: 30,
    borderRadius: 60,
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 5,
  },
  getAnswersScrollArea: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  getAnswersTextArea: {
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
  },
  getAnswersHealthText: {
    color: '#323232',
    textAlign: 'center',
    fontSize: 13,
    fontFamily:CONSTANT.PoppinsRegular,
  },
  getAnswersTitleText: {
    color: CONSTANT.primaryColor,
    textAlign: 'center',
    fontSize: 25,
    fontFamily:CONSTANT.PoppinsMedium,
  },
  getAnswersDescriptionText: {
    color: '#323232',
    textAlign: 'center',
    fontSize: 13,
    marginLeft: 30,
    marginRight: 30,
    fontFamily:CONSTANT.PoppinsRegular,
  },
  getAnswersTouchableArea: {
    alignItems: 'center',
    height: 40,
    margin: 15,
    borderRadius: 4,
    width: '70%',
    alignSelf: 'center',
    backgroundColor: '#3fabf3',
  },
  getAnswersTouchableText: {
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: '#fff',
    marginLeft: 15,
    marginRight: 15,
    paddingTop: 10,
    fontFamily:CONSTANT.PoppinsMedium,
  },
  getAnswersBackgroundArea: {
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
  getAnswersBackgroundTextArea: {flexDirection: 'row'},
  getAnswersBackgroundTextStyle: {
    color: '#3d4461',
    width: '70%',
    fontSize: 20,
    fontFamily:CONSTANT.PoppinsBold,
    marginBottom: 15,
    marginLeft: 10,
    marginTop: 10,
  },
  getAnswersAddNow: {
    width: '30%',
    marginBottom: 15,
    marginLeft: 10,
    marginTop: 15,
  },
  getAnswersItemArea: {marginLeft: 5, marginRight: 5, marginBottom: 5},
  getAnswersItemText: {
    color: '#3d4461',
    width: '98%',
    fontSize: 17,
    marginBottom: 15,
    marginLeft: 10,
    marginTop: 10,
    fontFamily:CONSTANT.PoppinsRegular,
  },
  getAnswersTypeReply: {
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
  getAnswersPostAnswer: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    top: 18,
    fontFamily:CONSTANT.PoppinsMedium
  },
  getAnswersGetAnswersArea: {flexDirection: 'row'},
  getAnswersGetAnswersText: {
    color: '#3d4461',
    width: '70%',
    fontSize: 20,
    fontFamily:CONSTANT.PoppinsBold,
    marginBottom: 15,
    marginLeft: 10,
    marginTop: 10,
  },
  getAnswersListStyle: {paddingLeft: 5},
  getAnswersRBSheetMainArea: {
    backgroundColor: '#fff',
    width: '100%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    overflow: 'hidden',
  },
  getAnswersRBSheetPostQuestionArea: {backgroundColor: '#3d4461', height: 50},
  getAnswersRBSheetPostQuestionText: {
    width: '100%',
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 20,
    marginTop: 10,
  },
  getAnswersRBSheetSpecialityArea: {
    height: 300,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  getAnswersRBSheetSpecialityScrollArea: {width: '100%'},
  getAnswersRBSheetSpecialityMultiArea: {marginLeft: 10, marginRight: 10, marginTop: 10},
  getAnswersRBSheetSpecialityMultiStyle: {marginLeft: 10, marginRight: 10, marginBottom: 10},
  getAnswersRBSheetSpecialityDropdown: {backgroundColor: '#000'},
  getAnswersRBSheetSpecialityWrapper: {
    backgroundColor: '#fff',
    borderRadius: 4,
    marginTop: 10,
  },
  getAnswersRBSheetSpecialitySubDropdown: {
    backgroundColor: '#fff',
    paddingRight: -7,
    height: 55,
    paddingLeft: 10,
    borderWidth: 0.6,
    borderColor: '#fff',
    borderColor: '#dddddd',
    borderRadius: 4,
  },
  getAnswersRBSheetQueryArea: {
    borderWidth: 0.6,
    margin: 10,
    borderRadius: 4,
    borderColor: '#dddddd',
  },
  getAnswersRBSheetQueryText: {
    fontSize: 15,
    padding: 5,
    height: 40,
    color: '#323232',
  },
  getAnswersRBSheetDetailArea: {
    height: 150,
    borderWidth: 0.6,
    margin: 10,
    borderRadius: 4,
    borderColor: '#dddddd',
  },
  getAnswersRBSheetDetailText: {
    fontSize: 15,
    height: 150,
    padding: 5,
    height: 40,
    color: '#323232',
  },
  getAnswersRBSheetAskQuery: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    top: 18,
  }
});
