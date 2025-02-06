import React from "react";
import {Text,StyleSheet,TouchableOpacity } from "react-native";
 
const CustomButton = ({title,onPress, backgroundColor}) => {
    return (
        <TouchableOpacity style={[styles.button , { backgroundColor}]}
        onPress={onPress}>
              <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
 };



 const styles = StyleSheet.create({      
    button:{
        backgroundColor:"#5f8494",
        padding: 10,
        alignItems:"center",
        borderRadius: 8,
        marginBottom: 10,
    },
    text:{
        color:"white",
        fontSize: 15,
        fontWeight:'Bold',
    },
 });

 export default CustomButton;