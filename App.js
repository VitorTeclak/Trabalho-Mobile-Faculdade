import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Inicio from './Telas/Inicio';
import Entradas from './Telas/Entradas';
import Gastos from './Telas/Gastos';

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Inicio' >
        <Stack.Screen name="InserirEntradas" component={Entradas} options={{ title: "Inserir/editar entradas" }} />
        <Stack.Screen name="InserirGastos" component={Gastos} options={{ title: "Inserir/editar Gastos" }} />
        <Stack.Screen name="Inicio" component={Inicio} options={{title: 'Controle de contas'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
