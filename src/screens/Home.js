import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert , TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomCard from '../components/CustomCard';
import AddCardModal from '../components/AddCardModal';
import TotalSummary from '../components/TotalSummary';

const storageKey = '@card_data';
const themeKey = '@app_theme';  // Key สำหรับบันทึกธีม

const HomeScreen = ({ navigation }) => {
  const [cards, setCards] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);  // เพิ่ม state สำหรับจัดการ Dark Mode
  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState('');  
  const [selectedCategory, setSelectedCategory] = useState('');  // เพิ่ม state สำหรับเลือกหมวดหมู่

  // ฟังก์ชันกรองการ์ดตามชื่อและหมวดหมู่
  const filteredCards = cards.filter(card => {
    const matchesSearchText = card.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory ? card.category === selectedCategory : true;
    return matchesSearchText && matchesCategory;
  });

  // ฟังก์ชันสำหรับแก้ไขการ์ด
  const handleEdit = async (id, updatedTitle, updatedContent, updatedImage, updatedCategory) => {
    const updatedCards = cards.map(card =>
      card.id === id 
        ? { ...card, title: updatedTitle, content: updatedContent, image: updatedImage, category: updatedCategory } 
        : card
    );
  
    setCards(updatedCards);
    await AsyncStorage.setItem(storageKey, JSON.stringify(updatedCards));
    calculateTotal(updatedCards);
  };
  
  useEffect(() => {
    loadCards();
    loadTheme();  // โหลดสถานะธีมเมื่อแอปเปิด
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadCards);
    return unsubscribe;
  }, [navigation]);
  
  useEffect(() => {
    calculateTotal(cards);  // ใช้ cards ทั้งหมดในการคำนวณ totalPrice
  }, [cards]);  // เมื่อ cards เปลี่ยนแปลง จะคำนวณ total ใหม่
  
  useEffect(() => {
    // เพิ่ม debounce ในการคำนวณ total
    const timer = setTimeout(() => {
      calculateTotal(filteredCards);
    }, 300); // หน่วงเวลา 300ms เพื่อไม่ให้คำนวณซ้ำๆ GPT เขาว่าดี ผมก็ว่าดีเสมอ
    return () => clearTimeout(timer);
  }, [filteredCards]);

  const loadCards = async () => {
    try {
      const storedCards = await AsyncStorage.getItem(storageKey);
      if (storedCards) {
        const parsedCards = JSON.parse(storedCards);
        setCards(parsedCards);
        setTimeout(() => calculateTotal(parsedCards), 0);  // คำนวณหลังจากโหลดข้อมูลเสร็จ
      }
    } catch (error) {
      console.error('Failed to load cards:', error);
    }
  };

  const loadTheme = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem(themeKey);
      if (storedTheme !== null) {
        setIsDarkMode(JSON.parse(storedTheme));  // โหลดธีมจาก AsyncStorage
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem(themeKey, JSON.stringify(newTheme));  // บันทึกสถานะธีม
    } catch (error) {
      console.error('Failed to toggle theme:', error);
    }
  };

  const calculateTotal = (currentCards) => {
    setTimeout(() => {
      const total = currentCards.reduce((sum, card) => sum + (!card.isCompleted ? parseFloat(card.content) || 0 : 0), 0);
      setTotalPrice(total);
    }, 0); // ใช้ setTimeout เพื่อเลื่อนการคำนวณในพื้นหลัง
  };

  // ฟังก์ชันสำหรับเปลี่ยนสถานะ "ทำเสร็จ" ของการ์ด
  const toggleComplete = async (id) => {
    const updatedCards = cards.map(card =>
      card.id === id ? { ...card, isCompleted: !card.isCompleted } : card
    );

    setCards(updatedCards);
    await AsyncStorage.setItem(storageKey, JSON.stringify(updatedCards));
    const total = updatedCards.reduce((sum, card) => sum + (!card.isCompleted ? parseFloat(card.content) || 0 : 0), 0);
    setTotalPrice(total);
  };

  // ฟังก์ชันลบการ์ด
  const deleteCard = async (id) => {
    const updatedCards = cards.filter(card => card.id !== id);
    setCards(updatedCards);
    await AsyncStorage.setItem(storageKey, JSON.stringify(updatedCards));
    calculateTotal(updatedCards);
  };

  const deleteAllCards = async () => {
    Alert.alert(
      "ลบรายการทั้งหมดฤๅจ๊ะ?",
      "แน่ใจฤๅจ๊ะ? \n**สามารถปัดซ้ายเพื่อลบทีละรายการได้จ้ะ**",
      [
        { text: "ไม่ลบและ", style: "cancel" },
        {
          text: "ลบ",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(storageKey);
              setCards([]);
              setTotalPrice(0);
            } catch (error) {
              console.error('Error deleting all cards:', error);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  // ฟังก์ชันเพิ่มการ์ดใหม่
  const addCard = async () => {
    const price = parseFloat(content);
    if (isNaN(price)) {
      alert('กรุณากรอกราคาสินค้าเป็นตัวเลขครับผม');
      return;
    }
  
    const newCard = { id: Date.now().toString(), title, content: price, image ,category };
  
    try {
      const storedCards = await AsyncStorage.getItem(storageKey);
      const existingCards = storedCards ? JSON.parse(storedCards) : [];
      const updatedCards = [newCard, ...existingCards];
  
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedCards));
  
      setTitle('');
      setContent('');
      setImage('');
      setCategory('');
      setModalVisible(false);
      loadCards();
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* ค้นหาข้อมูล */}
      <View style={styles.headerContainer}>
        {/* ช่องค้นหา */}
        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.searchBox, isDarkMode && styles.darkSearchBox]}
            placeholder="ค้นหารายการ..."
            placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
            value={searchText}
            onChangeText={setSearchText}
          />
          <Icon name="search" size={24} color={isDarkMode ? "#ccc" : "#666"} style={styles.searchIcon} />
        </View>
         
         {/* ทำไมไม่ทำ Componentแยก นั่นน่ะสิครับ*/}
        {/* หมวดหมู่ */} 
        <View style={styles.categoryContainer}>
          <TouchableOpacity onPress={() => setSelectedCategory('')}>
            <Text style={[styles.categoryButton, isDarkMode && styles.darkCategoryButton, selectedCategory === '' ? { borderColor: isDarkMode ? '#b8b8b8' : '#5f8494', opacity: 1 } : { borderColor: isDarkMode ? '#b8b8b8' : '#ccc', opacity: 0.5 }]}>
              ทั้งหมด
            </Text>
          </TouchableOpacity>
          {/* ปุ่มเลือกหมวดหมู่ */}
          <TouchableOpacity onPress={() => setSelectedCategory('อาหาร')}>
            <Text style={[styles.categoryButton, isDarkMode && styles.darkCategoryButton, selectedCategory === 'อาหาร' ? { borderColor: isDarkMode ? '#b8b8b8' : '#5f8494', opacity: 1 } : { borderColor: isDarkMode ? '#b8b8b8' : '#ccc', opacity: 0.5 }]}>
              อาหาร
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedCategory('สิ่งของ')}>
            <Text style={[styles.categoryButton, isDarkMode && styles.darkCategoryButton, selectedCategory === 'สิ่งของ' ? { borderColor: isDarkMode ? '#b8b8b8' : '#5f8494', opacity: 1 } : { borderColor: isDarkMode ? '#b8b8b8' : '#ccc', opacity: 0.5 }]}>
              สิ่งของ
            </Text>
          </TouchableOpacity>
        </View>

        {/* ปุ่ม Dark Mode */}
        <TouchableOpacity style={styles.themeToggleButton} onPress={toggleTheme}>
          <Icon name={isDarkMode ? "nights-stay" : "wb-sunny"} size={30} color={isDarkMode ? "#b8b8b8" : "#5f8494"} />
        </TouchableOpacity>
      </View>

      {cards.length === 0 ? (
        <Text style={[styles.noCardsText, isDarkMode && styles.darkText]}>ยังไม่มีรายการนะจ๊ะ</Text>
      ) : (
        <FlatList
          data={filteredCards}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CustomCard
              id={item.id}
              title={`${item.title}`} 
              content={`${item.content} บาท`}
              isCompleted={item.isCompleted}
              onToggleComplete={toggleComplete}
              onDelete={deleteCard}
              onEdit={handleEdit}
              image={item.image}
              isDarkMode={isDarkMode}
              category={item.category} 
            />
          )}
          contentContainerStyle={styles.cardList}
        />
      )}

      {/* ปุ่มเพิ่มการ์ด */}
      <TouchableOpacity style={[styles.addButton,{ backgroundColor: isDarkMode ? "#b8b8b8" : "#5f8494" }]} onPress={() => setModalVisible(true)}>
        <Icon name="add" size={30} color= {isDarkMode ? "black" : "white"} />
      </TouchableOpacity>

      {/* Modal สำหรับเพิ่มการ์ด */}
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
        isDarkMode={isDarkMode}
        category={category}    //  ส่งค่า category
        setCategory={setCategory}  //  ส่งฟังก์ชันอัปเดต category
      />

      {/* ปุ่มลบทั้งหมด */}
      <TouchableOpacity style={[styles.deleteAllButton,{backgroundColor: isDarkMode ? "#b32d2d" : '#e64949' }]} onPress={deleteAllCards}>
        <Icon name="delete-forever" size={30} color="white" />
      </TouchableOpacity>

      <TotalSummary totalPrice={totalPrice} isDarkMode={isDarkMode} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  headerContainer: {
    flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between', 
  marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Mitr',
  },
  darkText: {
    color: '#ffffff',
  },
  noCardsText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  cardList: {
    paddingBottom: 60,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
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
  deleteAllButton: {
    position: 'absolute',
    right: 100,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  searchBox: {
    flex: 1,
    padding: 10,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#5f8494',
    backgroundColor: '#fff',
    color: '#333',
    fontSize: 16,
    marginBottom: 15,
    height: 45,
  },
  darkSearchBox: {
    backgroundColor: '#333',
    borderColor: '#b8b8b8',
    color: '#fff',
  },
  searchIcon:{
   position: 'absolute',
   top : 9,
   right: 15, 
  },
  categoryButton: {
    padding: 5,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#5f8494',
    backgroundColor: '#fff',
    color: '#333',
    fontSize: 14,
    marginHorizontal: 1,
    marginBottom: 15,
    textAlign: 'center',
    minWidth: 60,
  },
  darkCategoryButton: {
    backgroundColor: '#333',
    borderColor: '#b8b8b8',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.5, 
    
  },
  
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'center', 
    flex: 2, 
  },
  themeToggleButton: {
    position :'relative',
    padding: 5,
    margin: 2,
    right: 8,
    bottom: 6,
  },
  
  
});

export default HomeScreen;
