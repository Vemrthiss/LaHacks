import { TextField } from "react-native-ui-lib";

export default function TextInput({
    value,
    setValue,
    placeholder,
    otherStyles,
    withFloatingPlacholder
}) {
    return (
        <TextField
            placeholder={placeholder ? placeholder : 'Placeholder'}
            floatingPlaceholder={withFloatingPlacholder}
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