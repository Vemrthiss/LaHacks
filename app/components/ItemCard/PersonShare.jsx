import { useState } from "react";
import { View } from "react-native";
import { Card, Text, Button } from "react-native-ui-lib";
import TextInput from "../../common/TextInput";

const OFF_BLACK = '#1B2F33';

function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    return splitStr.join(' '); 
}

export default function PersonShare({
    name = 'joel tay',
    initials = 'jt',
    otherStyles
}) {
    const [shares, setShares] = useState('0');

    return (
        <Card
            style={{
                backgroundColor: '#E6E6E6',
                justifyContent: 'space-between',
                display: 'flex',
                width: '100%',
                borderRadius: 8,
                padding: 10,
                flexDirection: 'row',
                alignItems: 'center',
                ...otherStyles
            }} 
            enableShadow={false}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button
                    label={initials.toUpperCase()}
                    color={OFF_BLACK}
                    backgroundColor="transparent"
                    round
                    style={{
                        borderColor: OFF_BLACK,
                        borderWidth: 1,
                        marginRight: 10
                    }}
                />
                <Text>{titleCase(name)}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <TextInput
                    placeholder=" "
                    value={shares}
                    setValue={setShares}
                    otherStyles={{
                        marginRight: 10,
                        width: 16
                    }}
                />
                <Text>share(s)</Text>
            </View>
        </Card>
    )
}