import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, Image, TouchableOpacity ,Keyboard} from 'react-native';
import CustomButton from './CustomButton';
import * as ImagePicker from 'expo-image-picker';  // ใช้ ImagePicker จาก expo เพื่อเลือกภาพจากแกลเลอรี


const handleBlur = () => {
    Keyboard.dismiss(); // ปิด keyboard แต่ปิดไม่ได้ งง
  };

// ฟังก์ชันตรวจสอบความถูกต้องของ URL สำหรับภาพ GPTฉลาดมาก
const isValidImage = (url) => {
  return url.match(/\.(jpeg|jpg|gif|png)$/) != null;  // เช็คว่า URL จบด้วยนามสกุลของภาพ
};

// ฟังก์ชันสำหรับเลือกภาพจากแกลเลอรี
const chooseImage = async (setImage) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();  // ขอสิทธิ์เข้าถึงแกลเลอรี
  if (status !== "granted") {
    alert("ขออภัย เราต้องการสิทธิ์เข้าถึงแกลเลอรีเพื่อดำเนินการนี้!");
    return;
  }

  // เปิดแกลเลอรีให้ผู้ใช้เลือกภาพ
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images, 
    allowsEditing: true,
    aspect: [16, 9],  
    quality: 1,
  });

  if (!result.canceled) {
    setImage(result.assets[0].uri);  // อัปเดตสถานะของภาพที่เลือก
  }
};

// คอมโพเนนต์ AddCardModal ใช้เพื่อแสดง Modal สำหรับการเพิ่มข้อมูลการ์ด
const AddCardModal = ({ 
  visible, 
  onClose, 
  onAddCard, 
  title, setTitle, 
  content, setContent, 
  image, setImage, 
  category, setCategory,  
  isDarkMode 
}) => {
  const [errors, setErrors] = useState({ title: '', content: '', image: '' });  // เก็บสถานะของข้อผิดพลาดแต่ละฟิลด์

  // ฟังก์ชันสำหรับตรวจสอบความถูกต้องของข้อมูลในแต่ละฟิลด์
  const validateField = (field, value) => {
    let error = '';
    if (!value.trim()) {
      error = 'กรุณากรอกข้อมูลให้ครบถ้วน';
    } else if (field === 'content') {  
      const numericValue = parseFloat(value);
      if (isNaN(numericValue) || numericValue < 0) {
        error = 'ราคาสินค้าต้องไม่ต่ำกว่า 0';
      }
    }
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));  // อัปเดตข้อผิดพลาด
    return error;
  };

  // ฟังก์ชันสำหรับเพิ่มการ์ดใหม่
  const addCard = async () => {
    const titleError = validateField('title', title);
    const contentError = validateField('content', content);

    if (titleError || contentError) {
      return;  // ถ้ามีข้อผิดพลาดจะไม่ทำการเพิ่มการ์ด
    }

    onAddCard();  // เพิ่มการ์ด
    setTitle('');
    setContent('');
    setImage('');
    setCategory('');  // รีเซ็ตค่าหมวดหมู่
    setErrors({ title: '', content: '', image: '' });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={[styles.modalContainer, isDarkMode && styles.darkModalContainer]}>
        <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
          <Text style={[styles.modalHeader, isDarkMode && styles.darkText]}>เพิ่มรายการใหม่จ้ะ</Text>

          {/* ชื่อสินค้า */}
          <TextInput
            style={[styles.input, isDarkMode && styles.darkInput]}
            placeholder="ชื่อสินค้า"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={isDarkMode ? '#fff' : '#000'}
            onBlur={handleBlur}
          />
          {errors.title ? <Text style={styles.errortext}>{errors.title}</Text> : null}

          {/* ราคาสินค้า */}
          <TextInput
            style={[styles.input, isDarkMode && styles.darkInput]}
            placeholder="ราคาสินค้า"
            value={content}
            onChangeText={setContent}
            keyboardType="numeric"
            placeholderTextColor={isDarkMode ? '#fff' : '#000'}
            onBlur={handleBlur}
          />
          {errors.content ? <Text style={styles.errortext}>{errors.content}</Text> : null}

          {/* URL ภาพ */}
          <TextInput
            style={[styles.textArea, isDarkMode && styles.darkInput]}
            placeholder="ใส่ URL ภาพจ้ะ (ไม่บังคับจ้ะ)"
            value={image}
            onChangeText={setImage}
            placeholderTextColor={isDarkMode ? '#fff' : '#000'}
            onBlur={handleBlur}
          />

          {/* ปุ่มเลือกหมวดหมู่ */}
          <View style={styles.categoryContainer}>
            {['อาหาร', 'สิ่งของ'].map((item) => (
              <TouchableOpacity 
                key={item} 
                style={[
                  styles.categoryButton,
                  isDarkMode 
                    ? category === item 
                      ? { backgroundColor: '#b8b8b8', borderColor: '#b8b8b8', opacity: 1 }  // Dark Mode (เลือกแล้ว)
                      : { backgroundColor: '#333', borderColor: '#b8b8b8', opacity: 0.5 }  // Dark Mode (ยังไม่เลือก)
                    : category === item 
                      ? { backgroundColor: '#5f8494', borderColor: '#5f8494', opacity: 1 }  // Light Mode (เลือกแล้ว)
                      : { backgroundColor: '#fff', borderColor: '#5f8494', opacity: 0.5 }  // Light Mode (ยังไม่เลือก)
                ]}
                onPress={() => setCategory(item)}
              >
                <Text style={[
                  styles.categoryText,
                  isDarkMode 
                    ? category === item 
                      ? { color: '#000', fontWeight: 'bold' }  // Dark Mode (เลือกแล้ว)
                      : { color: '#ccc' }  // Dark Mode (ยังไม่เลือก)
                    : category === item 
                      ? { color: '#fff', fontWeight: 'bold' }  // Light Mode (เลือกแล้ว)
                      : { color: '#333' }  // Light Mode (ยังไม่เลือก)
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ปุ่มเลือกภาพจากแกลเลอรี */}
          <CustomButton title="เลือกภาพจากแกลเลอรีจ้ะ" onPress={() => chooseImage(setImage)} backgroundColor={isDarkMode ? "#5f8494" : "#969696"} />

          {/* แสดงภาพที่เลือก */}
          {image && isValidImage(image) ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : null}

          {/* ปุ่มเพิ่มการ์ด */}
          <CustomButton title="เพิ่มจ้ะ" onPress={addCard} backgroundColor={isDarkMode ? "#969696" : "#5f8494"} />
          {/* ปุ่มยกเลิก */}
          <CustomButton title="ยกเลิกจ้ะ" onPress={onClose} backgroundColor={isDarkMode ? "#b32d2d" : "#e64949"} />
        </View>
      </View>
    </Modal>
  );
};

// สไตล์ของคอมโพเนนต์
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.31)',
  },
  darkModalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',  
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    elevation: 10,
  },
  darkModalContent: {
    backgroundColor: '#333',  
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  darkText: {
    color: '#fff',  
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  darkInput: {
    backgroundColor: '#444',  
    borderColor: '#666',       
    color: '#fff',             
  },
  textArea: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    marginBottom: 10,
    height: 50,
  },
  image: {
    width: 320,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
  errortext: {
    color: 'red',
    fontSize: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 30,  
    borderWidth: 3,
    borderColor: '#5f8494',  
    backgroundColor: '#fff',  
    width: '30%',
    textAlign: 'center',
  },
  categoryText: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
  },
  imagePickerButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
});

export default AddCardModal;
