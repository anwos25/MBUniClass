import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storageKey = '@card_data';

const ListScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const addCard = async () => {
    if (!title.trim() || !content.trim()) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วนครับผม');
      return;
    }
  
    const price = parseFloat(content); // แปลงราคาจาก string เป็น float
    if (isNaN(price)) {
      alert('กรุณากรอกราคาสินค้าเป็นตัวเลขครับผม');
      return;
    }
  
    const newCard = { id: Date.now().toString(), title, content: price }; // เก็บราคาที่แปลงแล้ว
  
    try {
      const storedCards = await AsyncStorage.getItem(storageKey);
      const existingCards = storedCards ? JSON.parse(storedCards) : [];
      const updatedCards = [newCard, ...existingCards];
  
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedCards));
      
      setTitle('');
      setContent('');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };
  

  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>เพิ่มรายการใหม่</Text>
      
      <TextInput
        style={styles.input}
        placeholder="ชื่อสินค้า"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="ราคาสินค้า"
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={4}
      />

      <CustomButton
        title="เพิ่มรายการใหม่"
        backgroundColor="#5f8494"
        onPress={addCard}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
    marginBottom: 10,
  },
  textArea: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
    marginBottom: 10,
  },
});

export default ListScreen;
