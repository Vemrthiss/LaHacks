import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './views/Home';
import Annotation from './views/Annotation';
import { decode } from 'base-64';

const Stack = createNativeStackNavigator();

if(typeof atob === 'undefined') {
  global.atob = decode;
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="home" component={Home} />
        <Stack.Screen name="annotation" component={Annotation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
