// HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity,Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomCard from '../components/CustomCard';
import AddCardModal from '../components/AddCardModal';
import { Alert } from 'react-native';

const storageKey = '@card_data';

const HomeScreen = ({ navigation }) => {
  const [cards, setCards] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  
  const handleEdit = async (id, updatedTitle, updatedContent, updatedImage) => {
    const updatedCards = cards.map(card =>
      card.id === id ? { ...card, title: updatedTitle, content: updatedContent, image: updatedImage } : card
    );


  
    setCards(updatedCards);
    await AsyncStorage.setItem(storageKey, JSON.stringify(updatedCards));
    calculateTotal(updatedCards); // อัปเดตราคารวม
  };
  

  useEffect(() => {
    loadCards();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadCards);
    return unsubscribe;
  }, [navigation]);

  const loadCards = async () => {
    try {
      const storedCards = await AsyncStorage.getItem(storageKey);
      if (storedCards) {
        const parsedCards = JSON.parse(storedCards);
        setCards(parsedCards);
        calculateTotal(parsedCards);
      }
    } catch (error) {
      console.error('Failed to load cards:', error);
    }
  };

  const calculateTotal = (cards) => {
    const total = cards.reduce((sum, card) => sum + (parseFloat(card.content) || 0), 0);
    setTotalPrice(total);
  };

  const toggleComplete = async (id) => {
    const updatedCards = cards.map(card =>
      card.id === id ? { ...card, isCompleted: !card.isCompleted } : card
    );

    setCards(updatedCards);
    await AsyncStorage.setItem(storageKey, JSON.stringify(updatedCards));
    const total = updatedCards.reduce((sum, card) => sum + (!card.isCompleted ? parseFloat(card.content) || 0 : 0), 0);
    setTotalPrice(total);
  };

const deleteCard = async (id) => {
    const updatedCards = cards.filter(card => card.id !== id);
    setCards(updatedCards);
    await AsyncStorage.setItem(storageKey, JSON.stringify(updatedCards));
    calculateTotal(updatedCards);
  };

const deleteAllCards = async () => {
  Alert.alert(
      "ลบรายการทั้งหมดฤๅจ๊ะ?",
      "แน่ใจฤๅจ๊ะ? ว่าประสงค์ลบรายการทั้งหมด?",
      [
          {text: "ไม่ลบและ", style: "cancel"},  // ✅ ปุ่มยกเลิก
          {
              text: "ลบ", 
              onPress: async () => {
                  try {
                      await AsyncStorage.removeItem(storageKey);  // ✅ ลบข้อมูลทั้งหมดจาก AsyncStorage
                      setCards([]);  // ✅ เคลียร์ state ให้เป็นว่าง
                      setTotalPrice(0);  // ✅ รีเซ็ตยอดรวม
                  } catch (error) {
                      console.error('Error deleting all cards:', error);
                  }
              },
              style: "destructive"  // ✅ ใช้สีแดงสำหรับปุ่มลบ
          }
      ]
  );
};


  const addCard = async () => {
    const price = parseFloat(content);
    if (isNaN(price)) {
      alert('กรุณากรอกราคาสินค้าเป็นตัวเลขครับผม');
      return;
    }

    const newCard = { id: Date.now().toString(), title, content: price, image };


    try {
      const storedCards = await AsyncStorage.getItem(storageKey);
      const existingCards = storedCards ? JSON.parse(storedCards) : [];
      const updatedCards = [newCard, ...existingCards];

      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedCards));

      setTitle('');
      setContent('');
      setModalVisible(false);
      loadCards();
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>รายการจ้ะ</Text>

      {cards.length === 0 ? (
        <Text style={styles.noCardsText}>ยังไม่มีรายการนะจ๊ะ</Text>
      ) : (
        <FlatList
          data={cards}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CustomCard
              id={item.id}
              title={item.title}
              content={`${item.content} บาท`}
              isCompleted={item.isCompleted}
              onToggleComplete={toggleComplete}
              onDelete={deleteCard}
              onEdit={handleEdit}
              image={item.image}
            />
          )}
          contentContainerStyle={styles.cardList}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* เรียกใช้งาน AddCardModal */}
      <AddCardModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddCard={addCard}
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        image={image}
        setImage={setImage}
      />
      <TouchableOpacity
        style={styles.deleteAllButton}
        onPress={deleteAllCards}  // ✅ เรียกใช้ฟังก์ชันลบทั้งหมด 
       >
        <Icon name="delete-forever" size={30} color="white" />
      </TouchableOpacity>

      <View style={styles.totalPriceBox}>
        <Text style={styles.totalPriceText}>รวมทั้งหมด {totalPrice.toFixed(2)} บาทจ้ะ</Text>
      </View>
  

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
    marginBottom: 10,
    fontFamily: 'Mitr',
  },
  noCardsText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  cardList: {
    paddingBottom: 20,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#5f8494',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  totalPriceBox: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 30,
    borderWidth: 5,
    borderColor: '#5f8494',
    elevation: 5,
  },
  totalPriceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteAllButton: {
    position: 'absolute',
    right: 100,  
    bottom: 20,
    backgroundColor: '#ff5252', 
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
},

});

export default HomeScreen;
