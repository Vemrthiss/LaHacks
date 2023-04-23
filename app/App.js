import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './views/Home';
import Annotation from './views/Annotation';
import Expense from './views/Expense'
import { decode } from 'base-64';
import './componentsConfig';
import './designConfig';

const Stack = createNativeStackNavigator();

if(typeof atob === 'undefined') {
  global.atob = decode;
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" component={Home} />
        <Stack.Screen name="annotation" component={Annotation} />
        <Stack.Screen name="expense" component={Expense} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
