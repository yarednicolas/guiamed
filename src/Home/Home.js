import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Button,
} from 'react-native';
import {Input, InputProps} from 'react-native-ui-kitten';
import TopCategoryCard from './TopCategoryCard';
import {RadioGroup} from 'react-native-btr';
import TopRatedCard from './TopRatedCard';
import AntIcon from 'react-native-vector-icons/AntDesign';
import * as CONSTANT from '../Constants/Constant';
import MultiSelect from 'react-native-multiple-select';
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

class Home extends Component {
  state = {
    radioButtons: [
      {
        label: CONSTANT.AdvanceSearchRadioButtonOne,
        value: 'doctors',
        checked: true,
        color: '#323232',
        disabled: false,
        fontFamily:CONSTANT.OpenSansRegular,
        size: 7,
      },
      {
        label: CONSTANT.AdvanceSearchRadioButtonTwo,
        value: 'hospitals',
        checked: false,
        color: '#323232',
        disabled: false,
        fontFamily:CONSTANT.OpenSansRegular,
        size: 7,
      },
    ],
    title: '',
    data: [],
    TopRatedData: [],
    projectServicesKnown: '',
    projectServices: [],
    ProjectSpecialitiesKnown: '',
    projectLocationKnown: '',
    ShowAdvanceSearch: false,
     isLoading:true,
  };

  componentDidMount() {
    this.getUser();
    this.fetchFeaturedDoctorsData();
    this.HomeSpecialitiesSpinner();
    this.ProjectLocationSpinner();
  }

  fetchFeaturedDoctorsData = async () => {
    const response = await fetch(
      CONSTANT.BaseUrl + 'listing/get_doctors?listing_type=featured',
    );
    const json = await response.json();
    if (
      Array.isArray(json) &&
      json[0] &&
      json[0].type &&
      json[0].type === 'error'
    ) {
      this.setState({TopRatedData: [], isLoading: false}); // empty data set
    } else {
      this.setState({TopRatedData: json, isLoading: false});
    }
  };
  ProjectLocationSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl + 'taxonomies/get_taxonomy?taxonomy=locations',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        let projectLocation = responseJson;
        this.setState({
          projectLocation,
        });
      })
      .catch(error => {
        console.error(error);
      });
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
  ProjectServicesSpinner = async () => {
    const {
      ProjectSpecialitiesKnown,
      projectServices,
      projectSpecialityServices,
    } = this.state;
    if (ProjectSpecialitiesKnown != '') {
      const response = await fetch(
        CONSTANT.BaseUrl +
          'taxonomies/get_servicess?speciality='+JSON.stringify(ProjectSpecialitiesKnown[0]),
      );
      const json = await response.json();
      console.log(json);
      if (Array.isArray(json) && json && json.type && json.type === 'error') {
        this.setState({projectServices: [], isLoading: false}); // empty data set
      } else {
        this.setState({projectServices: json, isLoading: false});
      }
    }
  };

  Search = () => {
    let selectedItem = this.state.radioButtons.find(e => e.checked == true);
    selectedItem = selectedItem
      ? selectedItem.value
      : this.state.radioButtons[0].value;
    const {title, ProjectSpecialitiesKnown, projectLocationKnown} = this.state;
    this.props.navigation.navigate('SearchResultScreen', {
      title: title,
      selectedItem: selectedItem,
      location: projectLocationKnown,
      Speciality: ProjectSpecialitiesKnown,
    });
  };
  onAdvanceSearchPress = () => {
    this.setState({ShowAdvanceSearch: true});
  };
  onCancleSearchPress = () => {
    this.setState({ShowAdvanceSearch: false,
      ProjectSpecialitiesKnown: '',
      projectLocationKnown: '',
      projectServicesKnown:''});
  };
  fetchData = async () => {
    const response = await fetch(
      CONSTANT.BaseUrl + 'taxonomies/get-specilities',
    );
    const json = await response.json();
    this.setState({data: json });
    console.log(json);
  };
  getUser = async () => {
    this.fetchData();
  };
  // _listEmptyComponent = () => {
  //   return (
  //     <View style={{ flex: 1, flexDirection: 'column', justifyContent: "center", height: '100%', alignSelf: 'center', alignItems: 'center' }}>
  //       <Image style={{ resizeMode: 'contain', height: 150, width: 150 }}
  //         source={require('../../Assets/Images/arrow.png')}
  //       />
  //     </View>
  //   )
  // }

  render() {
    const {ShowAdvanceSearch , isLoading} = this.state;

    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar hidden />}
        <StatusBar backgroundColor="#f7f7f7" barStyle="dark-content" />
        {isLoading ? (
          <View style={{justifyContent: 'center', height: '100%'}}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={{
                height: 30,
                width: 30,
                borderRadius: 60,
                alignContent: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                elevation: 5,
              }}
            />
          </View>
        ) : null}
        <ScrollView>
          <View style={styles.HomeHeader}>
            <Text style={styles.locationText}>{CONSTANT.HomeHeaderText}</Text>
            <TextInput
              underlineColorAndroid="transparent"
              placeholderTextColor="#7F7F7F"
              placeholder={CONSTANT.HomeHeaderSearchText}
              onChangeText={title => this.setState({title})}
              style={styles.HomeHeaderText}
            />
            <TouchableOpacity onPress={this.Search} style={styles.buttonHover}>
              <Text style={styles.buttonHoverText}>
                {CONSTANT.HomeHeaderSearchButton}
              </Text>
            </TouchableOpacity>
            <View style={styles.AdvanceSearchArea}>
              <Text
                onPress={this.onAdvanceSearchPress}
                style={styles.AdnanceSearchStyle}>
                {CONSTANT.HomeHeaderAdvanceSearch}
              </Text>
              <AntIcon
                name="bars"
                color={'#767676'}
                size={17}
                style={styles.AdvanceSearchIcon}
              />
            </View>
          </View>
          {ShowAdvanceSearch == true ? (
            <View>
              <Text style={styles.AdvanceSearchText}>
                {CONSTANT.AdvanceSerchHeaderText}
              </Text>
              <View style={styles.borderStyle}>
                <RadioGroup
                  color="#3fabf3"
                  labelStyle={{fontSize: 12}}
                  radioButtons={this.state.radioButtons}
                  onPress={radioButtons => this.setState({radioButtons})}
                  style={styles.radioStyles}
                />
              </View>

              <View style={styles.advanceSearchSection}>
                <MultiSelect
                  ref={component => {
                    this.multiSelect = component;
                  }}
                  onSelectedItemsChange={value =>
                    this.setState({projectLocationKnown: value})
                  }
                  uniqueKey="slug"
                  items={this.state.projectLocation}
                  selectedItems={this.state.projectLocationKnown}
                  borderBottomWidth={0}
                  single={true}
                  searchInputPlaceholderText={CONSTANT.AdvanceSearchLocation}
                  onChangeInput={text => console.log(text)}
                  selectText={CONSTANT.AdvanceSearchLocation}
                  styleMainWrapper={styles.mianWrapperStyles}
                  styleDropdownMenuSubsection={styles.dropdownStyles}
                  displayKey="name"
                  submitButtonText="Submit"
                />
              </View>

              <View style={styles.advanceSearchSection}>
                <MultiSelect
                  ref={component => {
                    this.multiSelect = component;
                  }}
                  onSelectedItemsChange={value =>
                    this.setState({
                      projectServices:[],
                      ProjectSpecialitiesKnown: value},
                      this.ProjectServicesSpinner,)
                  }
                  uniqueKey="id"
                  items={this.state.HomeSpecialities}
                  selectedItems={this.state.ProjectSpecialitiesKnown}
                  borderBottomWidth={0}
                  single={true}
                  searchInputPlaceholderText={CONSTANT.AdvanceSearchSpeciality}
                  onChangeInput={text => console.log(text)}
                  selectText={CONSTANT.AdvanceSearchSpeciality}
                  styleMainWrapper={styles.mianWrapperStyles}
                  styleDropdownMenuSubsection={styles.dropdownStyles}
                  displayKey="name"
                  submitButtonText="Submit"
                />
              </View>
              {this.state.projectServices.length >= 1 ? 
               <View style={styles.advanceSearchSection}>
              
               <MultiSelect
                 ref={component => {
                   this.multiSelect = component;
                 }}
                 onSelectedItemsChange={value =>
                   this.setState({projectServicesKnown: value})
                 }
                 uniqueKey="id"
                 items={this.state.projectServices}
                 selectedItems={this.state.projectServicesKnown}
                 borderBottomWidth={0}
                 single={true}
                 searchInputPlaceholderText={CONSTANT.AdvanceSearchService}
                 onChangeInput={text => console.log(text)}
                 selectText={CONSTANT.AdvanceSearchService}
                 styleMainWrapper={styles.mianWrapperStyles}
                 styleDropdownMenuSubsection={styles.dropdownStyles}
                 displayKey="name"
                 submitButtonText="Submit"
               />
             </View>
             : null
              }
             

              <TouchableOpacity
                onPress={this.Search}
                style={styles.buttonHover}>
                <Text style={styles.buttonHoverText}>
                  {CONSTANT.AdvanceSearchApplyButton}
                </Text>
              </TouchableOpacity>
              <View style={styles.buttonClearFilterStyle}>
                <Text
                  onPress={this.onCancleSearchPress}
                  style={styles.AdnanceSearchStyle}>
                  {CONSTANT.AdvanceSearchClearButton}
                </Text>
                <AntIcon
                  name="close"
                  color={'#767676'}
                  size={17}
                  style={styles.AdvanceSearchIconStyle}
                />
              </View>
            </View>
          ) : null}

          <View style={styles.bannerArea}>
            <View style={styles.bannerImgArea}>
              <Image
                source={require('../../Assets/Images/docdemo.png')}
                style={styles.bannerImage}></Image>
            </View>
            <View style={styles.bannerTextArea}>
              <Text style={styles.bannerTextOne}>{CONSTANT.BannerTextOne}</Text>
              <Text style={styles.bannerTextTwo}>{CONSTANT.BannerTextTwo}</Text>
            </View>
            <View style={styles.bannerButtonArea}>
              <TouchableOpacity onPress={()=> this.props.navigation.navigate("SignupScreen")} style={styles.bannerButton}>
                <Text style={styles.bannerButtonText}>
                  {CONSTANT.BannerButton}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.TopCategoryTextStyle}>
            {CONSTANT.CategoriesSection}
          </Text>
          <View style={styles.TopCatCardManagment}>
            <ScrollView
              style={styles.TopCatCardArea}
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <FlatList
                data={this.state.data}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() =>
                      this.props.navigation.navigate(
                        'SearchResultTopCategory',
                        {
                          Speciality: item.id,
                        },
                      )
                    }>
                    <TopCategoryCard
                      imageUri={{uri: `${item.url}`}}
                      name={`${entities.decode(item.name)}`}
                      colorCode={item.color}
                    />
                  </TouchableOpacity>
                )}
                horizontal={true}
              />
            </ScrollView>
          </View>
          <Text style={styles.TopRatedTextStyle}>
            {CONSTANT.TopRatedSection}
          </Text>
          <View style={styles.TopRatedCardManagment}>
            <FlatList
              style={styles.TopRatedFlatlistStyle}
              data={this.state.TopRatedData}
              ListEmptyComponent={this._listEmptyComponent}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  activeOpacity={0.9}
                  // onPress = { () => this.props.navigation.navigate("DetailDoctorScreen", {doc_id: item.ID})}
                  onPress={() => {
                    this.props.navigation.navigate('DetailDoctorScreen', {
                      itemId: item.ID,
                    });
                  }}>
                  <TopRatedCard
                    profileImage={{uri: `${item.image}`}}
                    specialities={`${entities.decode(item.specialities.name)}`}
                    name={`${entities.decode(item.name)}`}
                    sub_heading={`${entities.decode(item.sub_heading)}`}
                    total_rating={`${entities.decode(item.total_rating)}`}
                    average_rating={`${entities.decode(item.average_rating)}`}
                    featured_check={`${entities.decode(item.featured)}`}
                    verified={`${entities.decode(item.is_verified)}`}
                    verified_medically={`${entities.decode(item.is_verified)}`}
                    role={`${entities.decode(item.role)}`}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
         
        </ScrollView>
      </View>
    );
  }
}
export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  BannerTextStyle: {
    color: '#fff',
  },
  BannerTextDocStyle: {
    fontWeight: '700',
    color: '#fff',
  },
  locationText: {
    fontSize: 20,
    margin: 10,
    color: '#fe736e',
    fontFamily:CONSTANT.PoppinsBold,
  },
  AdvanceSearchText: {
    fontSize: 20,
    margin: 10,
    color: '#3d4461',
    fontFamily: CONSTANT.PoppinsBold,
  },
  inputText: {
    marginLeft: 10,
  },
  input: {
    marginLeft: 15,
    marginRight: 15,
  },
  buttonStyle: {
    width: 150,
    height: 45,
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
    fontSize: 15,
  },
  DocbuttonStyle: {
    width: 100,
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
    fontSize: 17,
    top: 10,
    alignSelf: 'flex-end',
    marginRight: 15,
  },

  singleline: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 0.6,
  },
  CurrentLocationStyle: {
    backgroundColor: '#fcfcfc',
    padding: 15,
    flexDirection: 'row',
  },
  CurrentLocationTextStyle: {
    color: '#55acee',
    fontSize: 16,
  },
  iconStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  mainHeader: {
    display: 'flex',
    flex: 1,
    width: '100%',
    alignSelf: 'flex-end',
    backgroundColor: '#3d4461',
    height: 65,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowColor: '#000',
    elevation: 3,
    borderBottomLeftRadius: 50,
    overflow: 'hidden',
    flexDirection: 'row',
    textAlign: 'right',
  },
  docdemostyle: {
    marginLeft: 15,
    alignSelf: 'flex-start',
  },
  buttonStyledoc: {
    width: 145,
    height: 50,
    backgroundColor: '#3fabf3',
    borderBottomColor: '#3fabf3',
    borderWidth: 0,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: {width: 1, height: 13},
    fontSize: 17,
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    textAlign: 'right',
    justifyContent: 'flex-end',
  },
  TopCategoryTextStyle: {
    color: '#3d4461',
    fontSize: 20,
    marginTop: 20,
    marginLeft: 10,
    fontFamily: CONSTANT.PoppinsBold,
  },
  TopRatedTextStyle: {
    color: '#3d4461',
    fontSize: 20,
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 5,
    fontFamily: CONSTANT.PoppinsBold,
  },
  TopCatCardManagment: {
    marginRight: 10,
    marginLeft: 10,
    flexDirection: 'row',
  },
  TopRatedCardManagment: {
    marginRight: 5,
    marginLeft: 5,
  },
  AdnanceSearchStyle: {
    color: '#767676',
    fontSize: 15,
    textAlign: 'right',
    fontFamily:CONSTANT.PoppinsRegular
  },
  borderStyle: {
    borderRadius: 2,
    borderWidth: 0.6,
    borderColor: '#dddddd',
    backgroundColor: '#fff',
    height: 55,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    flexDirection: 'row',
  },
  buttonHover: {
    width: 120,
    height: 50,
    backgroundColor: '#3fabf3',
    borderBottomColor: '#3fabf3',
    marginLeft: 10,
    borderWidth: 0,
    marginTop: 5,
    shadowRadius: 15,
    marginBottom: 25,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowColor: '#000',
    elevation: 3,
    fontSize: 13,
    borderRadius: 4,
    overflow: 'hidden',
    
  },
  HomeHeaderText: {
    height: 45,
    paddingLeft: 10,
    borderRadius: 2,
    borderWidth: 0.6,
    borderColor: '#dddddd',
    color: '#323232',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    fontFamily:CONSTANT.OpenSansRegular
  },
  buttonHoverText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    justifyContent: 'center',
    top: 16,
  },
  AdvanceSearchArea: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginRight: 10,
    marginBottom: 25,
    marginTop: -65,
  },
  AdvanceSearchIcon: {
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 2,
    marginLeft: 2,
    marginRight: 1,
  },
  radioStyles: {
    paddingLeft: 15,
    paddingTop: 0,
    flexDirection: 'row',
    display: 'flex',
    width: '100%',
  },
  advanceSearchSection: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  mianWrapperStyles: {
    backgroundColor: '#fff',
    borderRadius: 4,
    marginTop: 10,
  },
  dropdownStyles: {
    backgroundColor: '#fff',
    paddingRight: -7,
    height: 60,
    paddingLeft: 10,
    borderWidth: 0.6,
    borderColor: '#fff',
    borderColor: '#dddddd',
    borderRadius: 4,
  },
  buttonHoverText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    top: 18,
  },
  buttonClearFilterStyle: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginRight: 10,
    marginBottom: 25,
    marginTop: -65,
  },
  AdvanceSearchIconStyle: {
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 2,
    marginLeft: 2,
    marginRight: 1,
  },
  HomeHeader: {backgroundColor: '#fff'},
  bannerArea: {
    flexDirection: 'row',
    backgroundColor: '#3d4461',
    height: 70,
    width: '100%',
    borderBottomLeftRadius: 50,
    paddingLeft: 15,
    paddingRight: 15,
  },
  bannerImgArea: {
    width: '30%',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowColor: '#000',
    elevation: 3,
  },
  bannerImage: {
    height: 75,
    width: 75,
    position: 'absolute',
    bottom: 0,
  },
  bannerTextArea: {
    width: '40%',
    justifyContent: 'center',
  },
  bannerTextOne: {
    color: '#d4d5d9',
    fontSize: 12,
    fontFamily:CONSTANT.PoppinsRegular
  },
  bannerTextTwo: {
    color: '#fff',
    fontSize: 18,
    fontFamily:CONSTANT.PoppinsBold
  },
  bannerButtonArea: {
    width: '30%',
    justifyContent: 'center',
  },
  bannerButton: {
    height: 40,
    width: 105,
    backgroundColor: '#3fabf3',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerButtonText: {
    color: '#fff',
    fontSize: 15,
    fontFamily:CONSTANT.PoppinsRegular
  },
  TopCatCardArea: {
    marginTop: 10,
    marginLeft: -5,
  },
  TopRatedFlatlistStyle: {paddingLeft: 5},
});
