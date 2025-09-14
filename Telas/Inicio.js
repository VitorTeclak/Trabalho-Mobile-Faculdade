import { Button, View, StyleSheet } from "react-native";

export default function Inicio({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.buttonWrapper}>
        <Button title="Inserir/editar entradas" onPress={() => navigation.navigate('InserirEntradas')}/>
      </View>
      <View style={styles.buttonWrapper}>
        <Button title="Inserir/editar gastos" onPress={() => navigation.navigate('InserirGastos')}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: "center", 
    padding: 20,
    backgroundColor: "#f4f4f4"
  },
  buttonWrapper: {
    marginVertical: 20, 
  }
});