import React from 'react';
import { View, Text, TextInput, StyleSheet, Modal, Image } from 'react-native';
import CustomButton from './CustomButton';

const EditCardModal = ({ visible, onClose, onSave, title, setTitle, content, setContent, image, setImage }) => {
    const saveChanges = () => {
        console.log("title:", title);
        console.log("content:", content);
        console.log("image:", image);
      
        if (!title.trim() || !content.trim()) {
          alert('กรุณากรอกข้อมูลให้ครบถ้วนจ้ะ');
          return;
        }
      
        onSave(title, content, image);  // ส่งค่าภาพที่แก้ไขไปที่ onSave
        onClose();
    };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>แก้ไขรายการจ้ะ</Text>

          <TextInput
            style={styles.input}
            placeholder="ชื่อสินค้าจ้ะ"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={styles.input}
            placeholder="ราคาสินค้าจ้ะ"
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={4}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.textArea}
            placeholder="ใส่ URL ภาพ (ถ้ามี)"
            value={image}
            onChangeText={setImage}
          />

          {/* แสดงภาพจาก URL ที่กรอก */}
          {image ? <Image source={{ uri: image }} style={styles.image} /> : null}

          <CustomButton title="แก้ไขจ้ะ" onPress={saveChanges} backgroundColor="#5f8494" />
          <CustomButton title="ยกเลิกจ้ะ" onPress={onClose} backgroundColor="#ff5252" />
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
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    elevation: 10,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
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
    height: 50,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
});

export default EditCardModal;
