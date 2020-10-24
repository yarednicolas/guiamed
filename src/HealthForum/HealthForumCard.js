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

class HealthForumCard extends Component {
  render() {
    return (
      <View activeOpacity={0.7} style={styles.container}>
        <View style={styles.mainLayoutServices}>
          <View
            style={styles.healthForumMainArea}>
            <View
              style={styles.healthForumImageArea}>
              <Image
                style={styles.healthForumImageStyle}
                source={this.props.image}
              />
            </View>

            <View style={styles.healthForumTextArea}>
              <Text
                style={styles.healthForumNameText}>
                {this.props.name}
              </Text>
              <Text
                style={styles.healthForumDataText}>
                {this.props.date}
              </Text>
              <Text style={styles.mainServiceName2}>
                {this.props.answer} {CONSTANT.GetAnswersAnswers}
              </Text>
            </View>
          </View>
          <Text
            style={styles.healthForumDetailText}>
            {this.props.detail}
          </Text>
        </View>
      </View>
    );
  }
}
export default withNavigation(HealthForumCard);
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
    fontFamily:CONSTANT.PoppinsRegular,
  },
  healthForumMainArea: {
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    paddingRight: 10,
  },
  healthForumImageArea: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: '#ff5851',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  healthForumImageStyle: {
    width: 30,
    height: 30
  },
  healthForumTextArea: {flexDirection: 'column'},
  healthForumNameText: {
    color: '#484848',
    fontSize: 16,
    marginLeft: 20,
    fontFamily:CONSTANT.PoppinsMedium,
    marginRight: 20,
  },
  healthForumDataText: {
    color: '#3d4461',
    fontSize: 13,
    marginLeft: 20,
    marginRight: 20,
    fontFamily:CONSTANT.PoppinsRegular,
  },
  healthForumDetailText: {
    color: '#484848',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    fontFamily:CONSTANT.PoppinsRegular,
  }
});
