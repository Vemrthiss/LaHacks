import React, { useState, useEffect, useMemo } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { getAllDocuments, listenToCollection } from "../services/itemsRepository";
import ItemCard from "../components/ItemCard/ItemCard";
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Button } from 'react-native-ui-lib';
import { getAllUsers } from "../services/usersRepository";

const TEXT_PADDING = 20;

const Expense = () => {
  const [users, setUsers] = useState([]);
  const [document, setDocument] = useState([]);
  const [index, setIndex] = useState(0);
  const collectionChangeCb = (data) => {
    const newDocs = data.docs.map(doc => doc.data());
    setDocument(newDocs);
  }
  useEffect(() => {
    getAllDocuments().then((res) => setDocument(res));
    getAllUsers().then(res => setUsers(res));

    const unsubscribe = listenToCollection(collectionChangeCb);

    return () => {
      unsubscribe();
    }
  }, []);

  const handleLeftClick = () => {
    setIndex((index - 1 + document.length) % document.length);
  };

  const handleRightClick = () => {
    setIndex((index + 1) % document.length);
  };

  return (
    <View style={styles.text}>
      <Text style={styles.expensetext}>New Transaction</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          paddingHorizontal: TEXT_PADDING
        }}
      >
        <Text style={{ fontSize: 28 }}>Item #{index+1}</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={handleLeftClick}
            style={{ borderRadius: 50, backgroundColor: Colors.secondaryColor, marginRight: 20 }}
          >
            <MaterialIcons name="chevron-left" size={30} color="white"/>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleRightClick}
            style={{ borderRadius: 50, backgroundColor: Colors.secondaryColor }}
          >
            <MaterialIcons name="chevron-right" size={30} color="white"/>
          </TouchableOpacity>
        </View>
      </View>
      <ItemCard item={document[index]} users={users} />
      {
        index === document.length - 1 &&
        <View style={styles.actionBar}>
          <Button
            label="Done"
            backgroundColor={Colors.secondaryColor}
            size={Button.sizes.medium}
          />
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  text: { flex: 1, marginTop: 25 },
  expensetext: { fontWeight: "bold", fontSize: 32, marginVertical: 15, paddingLeft: TEXT_PADDING },
  actionBar: {
    display: 'flex',
    width: '100%',
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    backgroundColor: Colors.primaryColor,
}
});

export default Expense;
