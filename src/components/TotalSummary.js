import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TotalSummary = ({ totalPrice, isDarkMode }) => {
  return (
    <View style={[styles.totalPriceBox, isDarkMode && styles.darkTotalPriceBox]}>
      <Text style={[styles.totalPriceText, isDarkMode && styles.darkText]}>รวม {totalPrice.toFixed(2)} บาท</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  totalPriceBox: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: '#5f8494',
    elevation: 5,
  },
  darkTotalPriceBox: {
    backgroundColor: '#333333',
    borderColor: '#b8b8b8',
  },
  totalPriceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  darkText: {
    color: '#ffffff',
  },
});

export default TotalSummary;
