import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Swipeable from 'react-native-gesture-handler/Swipeable'; // เกรงว่าอันนี้ดูแต่งง่ายกว่า Swipelistจ้ะ
import EditCardModal from './EditCardModal'; // โมดอลสำหรับการแก้ไขข้อมูลของการ์ด
import * as ImagePicker from 'expo-image-picker'; // ใช้ ImagePicker จาก Expo เพื่อให้ผู้ใช้เลือกภาพจากแกลเลอรี

const CustomCard = ({ id, title, content, isCompleted, onToggleComplete, onDelete, onEdit, image, isDarkMode, category }) => {
  const [modalVisible, setModalVisible] = useState(false); // เปิด/ปิดโมดอล
  const [newTitle, setNewTitle] = useState(''); // เก็บชื่อใหม่
  const [newContent, setNewContent] = useState(''); // เก็บจำนวนเงืนใหม่
  const [newImage, setNewImage] = useState(image || '');  // เก็บ URL ของภาพที่เลือกหรือภาพจาก Picker
  const [selectedCategory, setSelectedCategory] = useState(category);  // เก็บหมวดหมู่ของการ์ด
  

  // เมื่อเปิดโมดอล ให้โหลดค่าที่ส่งมาจาก props เข้ามาในฟอร์มแก้ไข
  useEffect(() => {
    if (modalVisible) {
        setNewTitle(title);
        setNewContent(content.replace(" บาท", "")); // ตัดคำ "บาท" ออกจากเนื้อหา
        setNewImage(image || ''); // ใช้ image เดิม ถ้าไม่มีให้เป็น ''
        setSelectedCategory(category); // กำหนดหมวดหมู่ที่เลือก
    }
}, [modalVisible, title, content, image, category]);

// ฟังก์ชันสำหรับการแก้ไขข้อมูลและส่งกลับไปยัง parent component
const handleEdit = (updatedTitle, updatedContent, updatedImage, updatedCategory) => {
  onEdit(id, updatedTitle, updatedContent, updatedImage, updatedCategory);
};

  // ฟังก์ชันสำหรับปุ่มลบในการ์ด
  const renderRightActions = () => (
      <TouchableOpacity style={[styles.deleteButton, { backgroundColor: isDarkMode ? "#b32d2d" : '#e64949' }]} onPress={() => onDelete(id)}>
          <Icon name="delete" size={24} color="#fff" />
      </TouchableOpacity>
  );

  return (
      <Swipeable renderRightActions={renderRightActions}>
          <View style={[styles.card, 
            isDarkMode && isCompleted ? styles.darkCompletedCard : null, 
            isDarkMode && !isCompleted ? styles.darkCard : null, 
            !isDarkMode && isCompleted ? styles.completedCard : null]}>
              
              <View style={styles.cardHeader}>
                  <Text style={[styles.title, isCompleted && styles.completedText, isDarkMode && styles.darkText]}>
                      {title}
                  </Text>

                   {/* หมวดหมู่ */}
                   <Text style={[styles.categoryText,isCompleted && styles.completedText,isDarkMode && styles.darkText]}>
                      {category ? `"${category}"` : ''}
                  </Text>

                  {/* ปุ่มสำหรับการสลับสถานะการทำเครื่องหมายเสร็จหรือไม่ */}
                  <TouchableOpacity onPress={() => onToggleComplete(id, isCompleted)} style={styles.tickIcon}>
                      <Icon
                          name={isCompleted ? "check-circle" : "radio-button-unchecked"}
                          size={28}
                          color={isDarkMode ? (isCompleted ? "#b8b8b8" : "#bbb") : (isCompleted ? "#5f8494" : "#757575")}
                      />
                  </TouchableOpacity>

                  <Text style={[styles.statusText, isCompleted && styles.completedText, isDarkMode && styles.darkText]}>
                      {isCompleted ? "แล้วจ้ะ" : "ยังจ้ะ"}
                  </Text>

                  {/* ปุ่มแก้ไขการ์ด */}
                  <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.editContainer}>
    <Icon name="edit" size={30} color={isDarkMode ? "#ddd" : "#5f8494"} />
    {/* เพิ่มปุ่มโปร่งใสที่คลุมพื้นที่เพื่อเพิ่มขนาดให้คลิกได้ */}
    <View style={styles.overlay} />
</TouchableOpacity>
                  

              </View>

              <Text style={[styles.content, isCompleted && styles.completedText, isDarkMode && styles.darkText]}>
                  {content}
              </Text>

               {/* แสดงภาพที่เลือกหรือจาก URL */}
        {(newImage || image) ? (
          <Image source={{ uri: newImage || image }} style={[styles.image, isCompleted && { opacity: 0.3 }]} />
        ) : null}
          </View>

          {/* Modal สำหรับการแก้ไขข้อมูลการ์ด */}
          <EditCardModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleEdit}
        title={newTitle}
        setTitle={setNewTitle}
        content={newContent}
        setContent={setNewContent}
        image={newImage}  // ใช้ newImage ที่อัปเดตล่าสุด
        setImage={setNewImage}  // สามารถเปลี่ยนแปลงได้
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        isDarkMode={isDarkMode}
      />
      </Swipeable>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff', 
    borderRadius: 15,
    padding: 15,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#333', 
  },
  darkCompletedCard: {
    backgroundColor: '#1a1a1a', // ใช้สีเข้มมากขึ้นในโหมดมืดและการ์ดเสร็จสิ้น
  },
  completedCard: {
    backgroundColor: '#e0e0e0', 
  },
  cardHeader: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000', 
  },
  darkText: {
    color: '#ddd', 
  },
  content: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  completedText: {
    textDecorationLine: 'line-through', 
    color: '#9e9e9e',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    borderRadius: 15,
    marginBottom: 15,
  },
  tickIcon: {
    right: 1, 
    bottom: 2,
    position: 'absolute',
  },
  editContainer: {
    top: 24,
    right: 0,         
    position: 'absolute',
    padding: 0,
  },
  statusText: {
    fontSize: 14,
    color: '#757575',
    position: 'absolute',
    right: 40,
    fontWeight: 'bold',
  },
  image: {
    width: 380, 
    height: 180,
    borderRadius: 10,
    marginTop: 12,
  }, 
  categoryText: {
    position: 'absolute',
    top: 42,
    right: 165,
    fontSize: 14,
  },editContainer: {
    position: 'absolute', 
    top: 24,
    right: 0,
    padding: 0,
    justifyContent: 'center', 
    alignItems: 'center',
    zIndex: 1,  
},

overlay: {
    position: 'absolute', 
    top: -10,             
    left: -10,            
    right: -10,           
    bottom: -10,          
    backgroundColor: 'transparent', 
    borderRadius: 25,     
    zIndex: 2,            
},
});

export default CustomCard;
