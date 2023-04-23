import { TextField } from "react-native-ui-lib";

export default function TextInput({
    value,
    setValue,
    placeholder,
    otherStyles
}) {
    return (
        <TextField
            placeholder={placeholder ? placeholder : 'Placeholder'}
            floatingPlaceholder
            onChangeText={setValue}
            value={value}
            floatingPlaceholderColor="black"
            style={{
                borderBottomWidth: 1,
                borderBottomColor: 'black',
                ...otherStyles
            }}
        />
    )
}