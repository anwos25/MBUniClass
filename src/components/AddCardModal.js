import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import CustomButton from './CustomButton';

const AddCardModal = ({ visible, onClose, onAddCard, title, setTitle, content, setContent, image, setImage }) => {
  const addCard = async () => {
    if (!title.trim() || !content.trim()) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วนจ้ะ');
      return;
    }
    onAddCard();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}  // ปิด modal
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>เพิ่มรายการใหม่จ้ะ</Text>

          <TextInput
            style={styles.input}
            placeholder="ชื่อสินค้าจ้ะ"
            value={title}
            onChangeText={setTitle}  // อัพเดตค่า title เมื่อมีการเปลี่ยนแปลง
          />

          <TextInput
            style={styles.input}
            placeholder="ราคาสินค้าจ้ะ"
            value={content}
            onChangeText={setContent}  // อัพเดตค่า content เมื่อมีการเปลี่ยนแปลง
            multiline
            numberOfLines={4}
            valuetype="numeric"
          />
          
          <TextInput
            style={styles.textArea}
            placeholder="ใส่ URL ภาพ (ถ้ามี)"
            value={image}
            onChangeText={setImage}  // อัพเดตค่า image เมื่อมีการเปลี่ยนแปลง
          />

          {/* เพิ่มการแสดงผลของรูปภาพที่ใส่ URL */}
          {image ? <Image source={{ uri: image }} style={styles.image} /> : null}

          <CustomButton title="เพิ่มจ้ะ" onPress={addCard} backgroundColor="#5f8494" />
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
    backgroundColor: 'rgba(0, 0, 0, 0.31)',  // Semi-transparent background
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
    height: 0,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
});

export default AddCardModal;
