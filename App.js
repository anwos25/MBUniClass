import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./src/screens/Home";


const Stack = createStackNavigator();

const App = () => {
  return (
   <NavigationContainer>
     <Stack.Navigator initialRouteName="Home"> 
       <Stack.Screen name="Home" component={HomeScreen} options={{title:'เพื่อนรักนักช้อป'}}/>
     </Stack.Navigator>
   </NavigationContainer>
   
  );
};
export default App;