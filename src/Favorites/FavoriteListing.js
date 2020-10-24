import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Keyboard,
  AsyncStorage,
  NativeModules,
  TextInput,
  BackHandler,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import RNRestart from 'react-native-restart';
import axios from 'axios';
import * as CONSTANT from '../Constants/Constant';
import CustomHeader from '../Header/CustomHeader';
import {ScrollableTabView} from '@valdio/react-native-scrollable-tabview';
import FavDoctors from './FavDoctors';
import FavHospitals from './FavHospitals';
import FavArticles from './FavArticles';
import {Button} from 'native-base';
class FavoriteListing extends Component {
  render() {
    return (
      <View style={styles.container}>
        <CustomHeader headerText={CONSTANT.FavoritesFavoriteListing} />

        <ScrollableTabView
          tabBarTextStyle={styles.favListingTextStyle}
          tabBarUnderlineStyl={styles.favListingUnderlineStyle}
          tabBarActiveTextColor="#3d4461"
          style={styles.favListingStyle}
          showsHorizontalScrollIndicator={false}>
          <FavDoctors style={{  fontFamily:CONSTANT.PoppinsMedium,}} tabLabel={CONSTANT.FavoritesDoctors} />
          <FavHospitals style={{ fontFamily:CONSTANT.PoppinsMedium,}} tabLabel={CONSTANT.FavoritesHospitals} />
          {/* <FavArticles tabLabel={CONSTANT.FavoritesArticles} /> */}
        </ScrollableTabView>
      </View>
    );
  }
}
export default FavoriteListing;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  favListingTextStyle: {fontSize: 15},
  favListingUnderlineStyle: {color: '#3fabf3'},
  favListingStyle: {height: '100%'}
});
