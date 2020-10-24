import React, { Component } from "react";
import { View, StyleSheet,TouchableOpacity, StatusBar, ScrollView, Text , Image } from "react-native";
import StarRating from "react-native-star-rating";
import { Input, InputProps, Button } from "react-native-ui-kitten";
import AntIcon from "react-native-vector-icons/AntDesign";
import { withNavigation, DrawerActions } from 'react-navigation';
import * as CONSTANT from "../Constants/Constant";

class ArticlesCard extends Component {

  render() {
    return (
      <TouchableOpacity  activeOpacity={.7} onPress={()=> this.props.navigation.navigate("DetailDoctorScreen")} style={styles.container}>
         <View style={{backgroundColor:'#fff' , borderRadius:4 , overflow:'hidden'}}>
         <Image resizeMode={'cover'} style={{height:200}}
            source={this.props.image}
         />
        <View style={{ padding:15}}>
         <Text style={{color:'#55acee'  , fontFamily:CONSTANT.PoppinsRegular}}>{this.props.category}</Text>
         <View style={{flexDirection:'column' ,marginTop:2 }}>
         <Text numberOfLines={1} style={{color:'#484848' , fontSize:15 , fontFamily:CONSTANT.PoppinsBold}}>{this.props.title}</Text>
         <View style={{flexDirection:'row' , width:'100%'  }}>
        <View style={{flexDirection:'row'  , width:'40%', alignItems:'center' , marginRight:8}}>
        <AntIcon
                    name="pushpino"
                    color={"#3d4461"}
                    size={12}
                   
                  />
                   <Text style={{marginLeft:3 , color:'#767676' , fontSize:12 , fontFamily:CONSTANT.PoppinsRegular}}>{this.props.date}</Text>
        </View>

        <View style={{flexDirection:'row', width:'20%' , alignItems:'center', marginRight:8}}>
        <AntIcon
                    name="hearto"
                    color={"#3d4461"}
                    size={12}
                   
                  />
                   <Text style={{marginLeft:3 , color:'#767676', fontSize:12, fontFamily:CONSTANT.PoppinsRegular}}>{this.props.likes}</Text>
        </View>

        <View style={{flexDirection:'row', width:'20%' , alignItems:'center', marginRight:8}}>
        <AntIcon
                    name="eyeo"
                    color={"#3d4461"}
                    size={12}
                   
                  />
                   <Text style={{marginLeft:3 , color:'#767676', fontSize:12, fontFamily:CONSTANT.PoppinsRegular}}>{this.props.views}</Text>
        </View>

        <View style={{flexDirection:'row' , width:'20%', alignItems:'center', marginRight:8}}>
        <AntIcon
                    name="sharealt"
                    color={"#3d4461"}
                    size={12}
                   
                  />
                   <Text style={{marginLeft:3 , color:'#767676', fontSize:12, fontFamily:CONSTANT.PoppinsRegular}}>Share</Text>
        </View>
         </View>

         </View>
         </View>
         
         </View>
      </TouchableOpacity>
      
    );
  }
}
export default  withNavigation(ArticlesCard);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#ffffff',
    marginTop:2,
    elevation:3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowColor: "#000",
    marginBottom:5,
    borderRadius:4,
  },
  
 
});
