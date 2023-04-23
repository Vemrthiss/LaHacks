import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Camera from '../components/Camera';
import { useState } from 'react';
import { Button, Colors } from 'react-native-ui-lib';
import { Entypo, Feather } from '@expo/vector-icons';

export default function Home({ navigation }) {
    const [showCamera, setShowCamera] =  useState(false);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            // allowsEditing: true,
            // aspect: [4, 3],
            quality: 1,
        });
    
        console.log(result);
    
        if (!result.canceled) {
            navigation.navigate('annotation', { uri: result.assets[0].uri });
        }
    };
    
    return (
        <View style={styles.container}>
            {
                showCamera && 
                <TouchableOpacity
                    onPress={() => setShowCamera(false)}
                    style={{ position: 'absolute', top: 50, left: 20, zIndex: 100 }}
                >
                    <Entypo 
                        name="cross"
                        size={32}
                        color="white"
                    />
                </TouchableOpacity>
            }
            {
                showCamera ?
                <Camera callback={(uri) => navigation.navigate('annotation', { uri })}/> :
                <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                    <Text style={{ textAlign: 'center' }}>How would you like to record the transaction?</Text>
                    <Button style={{ alignSelf: 'center' }} bg-secondaryColor label="Add new expense" onPress={() => setShowCamera(true)}/>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10, width: 300, alignSelf: 'center' }}>
                        <View style={{ flex: 1, height: 1, backgroundColor: '#ccc', marginRight: 10 }} />
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>OR</Text>
                        <View style={{ flex: 1, height: 1, backgroundColor: '#ccc', marginLeft: 10 }} />
                    </View>
                    <Button style={{ alignSelf: 'center'}} label="Manually input" disabled/>
                </View>
            }
            {
                showCamera && 
                <TouchableOpacity
                    onPress={pickImage}
                    style={{ position: 'absolute', bottom: 50, right: 20, zIndex: 100 }}
                >
                    <Feather 
                        name="image"
                        size={32}
                        color="white"
                    />
                </TouchableOpacity>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    }
});