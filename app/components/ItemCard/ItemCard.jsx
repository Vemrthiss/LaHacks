import { StyleSheet, View, Text } from "react-native";
import Dropdown from "../Dropdown";
import { Card } from "react-native-ui-lib";
import TextInput from '../../common/TextInput';
import NumberInput from '../../common/NumberInput';
import { useEffect, useState } from "react";
import PersonShare from "./PersonShare";

const ItemCard = (props) => {
  // each card has its local state to allow editing
  // abit whack won't push changes to firestore just yet
  // const [itemName, setItemName] = useState(item?.name);
  // const [price, setPrice] = useState(item?.price);
  const [itemName, setItemName] = useState(props.document[props.index]?.name);
  const [price, setPrice] = useState(props.document[props.index]?.price);

  // console.log({item})
  // useEffect(() => {
  //   console.log({ itemName, price })
  // }, [itemName, price, index])

  return (
    // <View style={styles.text}>
    //   <Text>
    //     Name of item:{" "}
    //     {props.document[props.index] && <Text>{props.document[props.index].name}</Text>}
    //   </Text>
    //   <Text>
    //     Price of item:{" "}
    //     {props.document[props.index] && <Text>{props.document[props.index].price}</Text>}
    //   </Text>
    //   <Text>Category:</Text>
    //   <Dropdown />
    // </View>
    <Card flex center enableShadow style={{ margin: 20, borderColor: '#648845', borderWidth: 1, padding: 20 }}>
      <TextInput
        placeholder="Name of item"
        value={props.document[props.index]?.name}
        setValue={() => {}}
        otherStyles={{
          width: 300,
          marginBottom: 15
        }}
      />
      <TextInput
        placeholder="Price"
        value={`${props.document[props.index]?.price}`}
        setValue={() => {}}
        otherStyles={{
          width: 300,
          marginBottom: 15
        }}
      />
      <Dropdown />
      {
        props.users.map((user, i) => (
          <PersonShare
            name={user.name}
            initials={user.initials}
            otherStyles={{
              marginBottom: 10
            }}
            key={i}
          />
        ))
      }
    </Card>
  );
};

const styles = StyleSheet.create({
  text: { flex: 1, marginTop: 15, alignItems: "center" },
  expensetext: { fontWeight: "bold", fontSize: 40, paddingBottom: 10 },
});

export default ItemCard;
