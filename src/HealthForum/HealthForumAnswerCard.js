import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Text,
  Image,
} from 'react-native';
import StarRating from 'react-native-star-rating';
import {Input, InputProps, Button} from 'react-native-ui-kitten';
import AntIcon from 'react-native-vector-icons/AntDesign';
import * as CONSTANT from '../Constants/Constant';
import {withNavigation, DrawerActions} from 'react-navigation';

class HealthForumAnswerCard extends Component {
  render() {
    return (
      <View activeOpacity={0.7} style={styles.container}>
        <View style={styles.mainLayoutServices}>
          <View
            style={styles.healthForumAnswerMainArea}>
            <View
              style={styles.healthForumAnswerImageArea}>
              <Image
                style={styles.healthForumAnswerImageStyle}
                source={this.props.image}
              />
            </View>

            <View style={styles.healthForumAnswerTextArea}>
              <Text
                style={styles.healthForumAnswerNameText}>
                {this.props.name}
              </Text>
              <Text
                style={styles.healthForumAnswerDataText}>
                {this.props.date}
              </Text>
            </View>
          </View>
          <Text
            style={styles.healthForumAnswerDetailText}>
            {this.props.detail}
          </Text>
        </View>
      </View>
    );
  }
}
export default withNavigation(HealthForumAnswerCard);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop: 2,
    elevation: 3,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowColor: '#000',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    borderRadius: 4,
    overflow: 'hidden',
  },
  mainLayoutServices: {
    flexDirection: 'column',
    overflow: 'hidden',
  },
  ImageStyle: {
    margin: 15,
  },
  mainServiceName: {
    color: '#484848',
    fontSize: 15,
    marginLeft: 20,
    marginRight: 20,
    fontWeight: '400',
  },
  mainServiceName2: {
    color: '#3d4461',
    fontSize: 13,
    marginLeft: 20,
    marginRight: 20,
  },
  healthForumAnswerMainArea: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    paddingRight: 10,
  },
  healthForumAnswerImageArea: {
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  healthForumAnswerImageStyle: {width: 60, height: 60, borderRadius: 4},
  healthForumAnswerTextArea: {flexDirection: 'column', justifyContent: 'center'},
  healthForumAnswerNameText: {
    color: '#484848',
    fontSize: 16,
    marginLeft: 10,
    fontFamily:CONSTANT.PoppinsMedium,
    marginRight: 10,
  },
  healthForumAnswerDataText: {
    color: '#3d4461',
    fontSize: 13,
    marginLeft: 10,
    marginRight: 10,
    fontFamily:CONSTANT.PoppinsRegular,
  },
  healthForumAnswerDetailText: {
    color: '#484848',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    fontFamily:CONSTANT.PoppinsRegular,
  }
});
