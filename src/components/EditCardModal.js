import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, Image, TouchableOpacity, Keyboard } from 'react-native';
import CustomButton from './CustomButton';
import * as ImagePicker from 'expo-image-picker';  

// ฟังก์ชันปิดคีย์บอร์ดเมื่อ Blur ที่แปลว่าปิดไม่ได้
const handleBlur = () => {
  Keyboard.dismiss();
};

// ฟังก์ชันตรวจสอบ URL ของภาพ
const isValidImage = (url) => {
  return url.match(/\.(jpeg|jpg|gif|png)$/) != null;  // ตรวจสอบ URL ว่าเป็นรูปภาพหรือไม่
};

// ฟังก์ชันเลือกภาพจากแกลเลอรี
const chooseImage = async (setImage) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    alert("ขออภัย เราต้องการสิทธิ์เข้าถึงแกลเลอรีเพื่อดำเนินการนี้!");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images, 
    allowsEditing: true,
    aspect: [16, 9],
    quality: 1,
  });

  if (!result.canceled) {
    setImage(result.assets[0].uri);  // ตั้งค่า URI ของภาพ
  }
};

// คอมโพเนนต์ EditCardModal
const EditCardModal = ({ 
  visible, 
  onClose, 
  onSave, 
  title, 
  setTitle, 
  content, 
  setContent, 
  image, 
  setImage, 
  selectedCategory, 
  setSelectedCategory,  // เพิ่มหมวดหมู่
  isDarkMode 
}) => {
  const [errors, setErrors] = useState({ title: '', content: '', image: '' });

  // ฟังก์ชันตรวจสอบความถูกต้องของฟิลด์
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
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    return error;
  };

  // ฟังก์ชันบันทึกการแก้ไข
  const saveChanges = () => {
    const titleError = validateField('title', title);
    const contentError = validateField('content', content);

    if (titleError || contentError) {
      return;
    }

    onSave(title, content, image, selectedCategory);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={[styles.modalContainer, isDarkMode && styles.darkModalContainer]}>
        <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
          <Text style={[styles.modalHeader, isDarkMode && styles.darkText]}>แก้ไขรายการจ้ะ</Text>

          <TextInput
            style={[styles.input, isDarkMode && styles.darkInput]}
            placeholder="ชื่อสินค้าจ้ะ"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={isDarkMode ? '#fff' : '#000'}
            onBlur={handleBlur}
          />
          {errors.title && <Text style={styles.errortext}>{errors.title}</Text>}

          <TextInput
            style={[styles.input, isDarkMode && styles.darkInput]}
            placeholder="ราคาสินค้าจ้ะ"
            value={content}
            onChangeText={setContent}
            keyboardType="numeric"
            placeholderTextColor={isDarkMode ? '#fff' : '#000'}
            onBlur={handleBlur}
          />
          {errors.content && <Text style={styles.errortext}>{errors.content}</Text>}

          <TextInput
            style={[styles.textArea, isDarkMode && styles.darkInput]}
            placeholder="ใส่ URL ภาพจ้ะ (ไม่บังคับจ้ะ)"
            value={image}
            onChangeText={setImage}
            placeholderTextColor={isDarkMode ? '#fff' : '#000'}
            onBlur={handleBlur}
          />

          {/* 🔹 ปุ่มเลือกหมวดหมู่ */}
          <View style={styles.categoryContainer}>
            {['อาหาร', 'สิ่งของ'].map((item) => (
              <TouchableOpacity
                key={item}
                style={[ 
                  styles.categoryButton,
                  isDarkMode 
                    ? selectedCategory === item 
                      ? { backgroundColor: '#b8b8b8', borderColor: '#b8b8b8', opacity: 1 }
                      : { backgroundColor: '#333', borderColor: '#b8b8b8', opacity: 0.5 }
                    : selectedCategory === item 
                      ? { backgroundColor: '#5f8494', borderColor: '#5f8494', opacity: 1 }
                      : { backgroundColor: '#fff', borderColor: '#5f8494', opacity: 0.5 }
                ]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isDarkMode
                      ? selectedCategory === item
                        ? { color: '#000', fontWeight: 'bold' }
                        : { color: '#ccc' }
                      : selectedCategory === item
                        ? { color: '#fff', fontWeight: 'bold' }
                        : { color: '#333' }
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <CustomButton title="เลือกภาพจากแกลเลอรีจ้ะ" onPress={() => chooseImage(setImage)} backgroundColor={isDarkMode ? "#5f8494" : "#969696"} />

          {image && isValidImage(image) ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : image ? (
            <Text style={styles.errortext}>กรุณาใส่ URL ที่ถูกต้องสำหรับรูปภาพ</Text>
          ) : null}

          <CustomButton title="แก้ไขจ้ะ" onPress={saveChanges} backgroundColor={isDarkMode ? "#969696" : "#5f8494"} />
          <CustomButton title="ยกเลิกจ้ะ" onPress={onClose} backgroundColor={isDarkMode ? "#b32d2d" : "#e64949"} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  imagePickerText: {
    color: "#333",
    fontSize: 14,
  },
});

export default EditCardModal;
