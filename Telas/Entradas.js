import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    </View>
  );
}

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
    rows.push({ type: "product", product, key: `prod-${product.name}-${index}` });
    lastCategory = product.category;
  });

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
        if (item.type === "category") {
          return <ProductCategoryRow category={item.category} />;
        }
        if (item.type === "product") {
          return <ProductRow product={item.product} />;
        }
        if (item.type === "total") {
          return (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                R${item.total.toFixed(2).replace(".", ",")}
              </Text>
            </View>
          );
        }
        return null;
      }}
    />
  );
}

function FilterableProductTable() {
  const [products, setProducts] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem("@entradas");
      if (data) setProducts(JSON.parse(data));
    } catch (e) {
      console.log("Erro ao carregar entradas:", e);
    }
  };

  const saveData = async (lista) => {
    try {
      await AsyncStorage.setItem("@entradas", JSON.stringify(lista));
    } catch (e) {
      console.log("Erro ao salvar entradas:", e);
    }
  };

  const handleInsert = () => {
    if (!newName || !newPrice) {
      alert("Preencha nome e valor!");
      return;
    }

    const novoItem = {
      category: "Entrada",
      name: newName,
      price: `R$${parseFloat(newPrice).toFixed(2).replace(".", ",")}`,
    };

    const updatedList = [...products, novoItem];

    setProducts(updatedList);
    saveData(updatedList);

    setNewName("");
    setNewPrice("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome da entrada"
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

      <ProductTable products={products} />
    </View>
  );
}

export default function Entradas() {
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
