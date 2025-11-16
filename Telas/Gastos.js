import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  TextInput,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- COMPONENTES DE LINHAS ---
function ProductCategoryRow({ category }) {
  return (
    <View style={styles.categoryRow}>
      <Text style={styles.categoryText}>{category}</Text>
    </View>
  );
}

function ProductRow({ product }) {
  return (
    <View style={styles.productRow}>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>{product.price}</Text>

      {/* Apenas nome da rua */}
      {product.endereco && (
        <Text style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
          {product.endereco}
        </Text>
      )}
    </View>
  );
}

// --- TABELA ---
function ProductTable({ products }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product, index) => {
    if (product.category !== lastCategory) {
      rows.push({
        type: "category",
        category: product.category,
        key: `cat-${product.category}-${index}`,
      });
    }

    rows.push({
      type: "product",
      product,
      key: `prod-${product.name}-${index}`,
    });

    lastCategory = product.category;
  });

  // total
  const total = products.reduce((acc, item) => {
    const valor = parseFloat(item.price.replace("R$", "").replace(",", "."));
    return acc + (isNaN(valor) ? 0 : valor);
  }, 0);

  rows.push({ type: "total", total, key: "total-row" });

  return (
    <FlatList
      data={rows}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => {
        if (item.type === "category")
          return <ProductCategoryRow category={item.category} />;

        if (item.type === "product")
          return <ProductRow product={item.product} />;

        if (item.type === "total")
          return (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                R${item.total.toFixed(2).replace(".", ",")}
              </Text>
            </View>
          );
      }}
    />
  );
}

// --- TELA PRINCIPAL ---
function FilterableProductTable() {
  const [products, setProducts] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");

  // CARREGAR DADOS DO AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem("gastos");
      if (saved) {
        setProducts(JSON.parse(saved));
      }
    };
    loadData();
  }, []);

  // --- INSERIR GASTO ---
  const handleInsert = async () => {
    if (!newName || !newPrice) {
      Alert.alert("Preencha nome e valor!");
      return;
    }

    // Permissão de localização
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "Não foi possível obter a localização.");
      return;
    }

    // Coordenadas
    const loc = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = loc.coords;

    // Buscar nome da rua
    let endereco = "Rua não encontrada";

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        { headers: { "User-Agent": "gastos-app-example" } }
      );

      const data = await response.json();

      endereco =
        data.address.road ||
        data.address.residential ||
        data.address.pedestrian ||
        "Rua não encontrada";
    } catch (error) {
      console.log("Erro ao buscar endereço:", error);
    }

    const novoItem = {
      category: "Gasto",
      name: newName,
      price: `R$${parseFloat(newPrice).toFixed(2).replace(".", ",")}`,
      endereco,
    };

    setProducts((prev) => {
      const novos = [...prev, novoItem];
      AsyncStorage.setItem("gastos", JSON.stringify(novos)); // salva
      return novos;
    });

    setNewName("");
    setNewPrice("");
  };

  return (
    <View style={styles.container}>
      {/* Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Nome do gasto"
        value={newName}
        onChangeText={setNewName}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor (ex: 25.50)"
        value={newPrice}
        onChangeText={setNewPrice}
        keyboardType="numeric"
      />

      <Button title="Inserir" onPress={handleInsert} />

      {/* Tabela */}
      <ProductTable products={products} />
    </View>
  );
}

// --- ROOT ---
export default function Gastos() {
  return <FilterableProductTable />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  categoryRow: {
    backgroundColor: "#eee",
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginTop: 15,
    borderRadius: 6,
  },
  categoryText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  productName: {
    fontSize: 16,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderTopWidth: 2,
    borderTopColor: "#000",
    marginTop: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
