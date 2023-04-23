import { StyleSheet, View, Text } from "react-native";
import Dropdown from "../components/Dropdown";

const Card = (props) => {
  return (
    <View style={styles.text}>
      <Text style={styles.expensetext}>Item #{props.index + 1}</Text>
      <Text>
        Name of item:{" "}
        {props.document[props.index] && <Text>{props.document[props.index].name}</Text>}
      </Text>
      <Text>
        Price of item:{" "}
        {props.document[props.index] && <Text>{props.document[props.index].price}</Text>}
      </Text>
      <Text>Category:</Text>
      <Dropdown />
    </View>
  );
};

const styles = StyleSheet.create({
  text: { flex: 1, marginTop: 15, alignItems: "center" },
  expensetext: { fontWeight: "bold", fontSize: 40, paddingBottom: 10 },
});

export default Card;
