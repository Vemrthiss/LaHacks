import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { getAllDocuments } from "../services/itemsRepository";
import Card from "../components/Card";

const Expense = () => {
  const [document, setDocument] = useState([]);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    getAllDocuments().then((res) => setDocument(res));
  }, []);

  const handleLeftClick = () => {
    setIndex((index - 1 + document.length) % document.length);
  };

  const handleRightClick = () => {
    setIndex((index + 1) % document.length);
  };

  return (
    <View style={styles.text}>
      <Text style={styles.expensetext}>Receipt Name</Text>
      <Button title="Left" onPress={handleLeftClick} />
      <Button title="Right" onPress={handleRightClick} />
      <Card index={index} document={document} />
    </View>
  );
};

const styles = StyleSheet.create({
  text: { flex: 1, marginTop: 25, alignItems: "center" },
  expensetext: { fontWeight: "bold", fontSize: 40, paddingBottom: 10 },
});

export default Expense;
