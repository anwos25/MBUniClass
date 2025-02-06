import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import EditCardModal from './EditCardModal';
import * as ImagePicker from 'expo-image-picker'; // ใช้ expo-image-picker

const CustomCard = ({ id, title, content, isCompleted, onToggleComplete, onDelete, onEdit, image }) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [newTitle, setNewTitle] = useState('');  
    const [newContent, setNewContent] = useState('');  
    const [newImage, setNewImage] = useState('');

    useEffect(() => {
        // เมื่อเปิด modal, set ค่าใหม่ให้เป็น title และ content เดิม
        if (modalVisible) {
            setNewTitle(title);
            setNewContent(content.replace(" บาท", ""));  // ✅ เอา "บาท" ออก
            setNewImage(image);
        }
    }, [modalVisible, title, content, image]);  // เมื่อ title หรือ content เปลี่ยน, ให้รีเฟรชค่าใหม่ใน modal

    const handleEdit = (updatedTitle, updatedContent, updatedImage) => {
        onEdit(id, updatedTitle, updatedContent, updatedImage);  
        setModalVisible(false);
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert('Permission to access media library is required!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setNewImage(result.uri);  // เก็บ URI ของภาพที่เลือก
        }
    };

    const renderRightActions = () => (
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(id)}>
            <Icon name="delete" size={24} color="#fff" />
        </TouchableOpacity>
    );

    return (
        <Swipeable renderRightActions={renderRightActions}>
            <View style={[styles.card, isCompleted && styles.completedCard]}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.title, isCompleted && styles.completedText]}>{title}</Text>

                    <TouchableOpacity onPress={() => onToggleComplete(id, isCompleted)} style={styles.tickIcon}>
                        <Icon
                            name={isCompleted ? "check-circle" : "radio-button-unchecked"}
                            size={28}
                            color={isCompleted ? "#4caf50" : "#757575"}
                        />
                    </TouchableOpacity>

                    <Text style={[styles.statusText, isCompleted && styles.completedText]} >
                        {isCompleted ? "ซื้อแล้วจ้ะ" : "ยังไม่ได้ซื้อจ้ะ"}
                    </Text>

                    {/* ปุ่ม Edit */}
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.editContainer}>
                        <Icon name="edit" size={30} color="#5f8494" />
                    </TouchableOpacity>
                </View>

                <Text style={[styles.content, isCompleted && styles.completedText]}>{content}</Text>

                {image ? <Image source={{ uri: image }} style={styles.image} /> : null}
            </View>

            {/* เปิด EditCardModal และส่งค่า title, content ไปให้แก้ไข */}
            <EditCardModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleEdit}
                title={newTitle}  // ส่ง newTitle และ newContent เพื่อแก้ไข
                setTitle={setNewTitle}  // ส่ง setTitle ที่เปลี่ยนแปลง title
                content={newContent}  // ส่ง newContent
                setContent={setNewContent}  // ส่ง setContent ที่เปลี่ยนแปลง content
                image={newImage}  // ส่งค่า image ที่แก้ไขไป
                setImage={setNewImage}  // ส่ง setImage ที่สามารถเปลี่ยนแปลงค่า image ได้
                pickImage={pickImage} // ส่ง pickImage ฟังก์ชันให้สามารถเลือกภาพได้
            />
        </Swipeable>
    );
};



const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff', // พื้นหลังสีขาวสำหรับการ์ดปกติ
    borderRadius: 15,
    padding: 15,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  completedCard: {
    backgroundColor: '#e0e0e0', // เปลี่ยนพื้นหลังเป็นสีเทาเมื่อการ์ดเสร็จสิ้น
  },
  cardHeader: {
    flexDirection: 'row', 
    justifyContent: 'space-between', // กระจายพื้นที่ระหว่างหัวเรื่องและไอคอน
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  completedText: {
    textDecorationLine: 'line-through', // ขีดเส้นทับข้อความเมื่อการ์ดเสร็จสิ้น
    color: '#9e9e9e',
  },
  deleteButton: {
    backgroundColor: '#ff5252', // สีแดงสำหรับปุ่มลบ
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    borderRadius:15,
    marginBottom: 15,
  },
  tickIcon: {
    left: 345,              // ขยับให้ชิดขอบขวามากขึ้น
    bottom: 2,
    position: 'absolute',
  },
  editContainer: {
    top: 22,
    left: 345,         
    position: 'absolute',
    padding: 0,
  },
  statusText: {
    fontSize: 14,
    color: '#757575',
    position: 'absolute',
    right: 40,
  }, 
  image: {
    width: 380, 
    height: 180,
    borderRadius: 10,
    flexDirection: 'row', 
    marginTop: 12,
    justifyContent: 'space-between',
  },
  
  
});

export default CustomCard;
