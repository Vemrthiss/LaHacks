import { NumberInput } from "react-native-ui-lib";

export default function NumInput({
    value,
    setValue,
    placeholder,
    otherStyles
}) {
    return (
        <NumberInput
            placeholder={placeholder ? placeholder : 'Placeholder'}
            floatingPlaceholder
            onChangeNumber={setValue}
            initialNumber={value}
            floatingPlaceholderColor="black"
            style={{
                borderBottomWidth: 1,
                borderBottomColor: 'black',
                ...otherStyles
            }}
        />
    )
}