import { Button, View, StyleSheet, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Inicio({ navigation }) {

  // Função que mostra a confirmação
  const confirmarLimpeza = () => {
    Alert.alert(
      "Confirmar limpeza",
      "Tem certeza que deseja apagar TODOS os dados armazenados?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Apagar", style: "destructive", onPress: limparTudo }
      ]
    );
  };

  // Função que realmente apaga o AsyncStorage
  const limparTudo = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert("Sucesso", "Todos os dados foram apagados!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível limpar os dados.");
    }
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.buttonWrapper}>
        <Button
          title="Inserir/editar entradas"
          onPress={() => navigation.navigate("InserirEntradas")}
        />
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          title="Inserir/editar gastos"
          onPress={() => navigation.navigate("InserirGastos")}
        />
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          title="Limpar tudo"
          color="red"
          onPress={confirmarLimpeza}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  buttonWrapper: {
    marginVertical: 20,
  },
});
