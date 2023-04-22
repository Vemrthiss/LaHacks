import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Camera from '../components/Camera';
import { useState } from 'react';

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
                showCamera ?
                <Camera callback={(uri) => navigation.navigate('annotation', { uri })}/> :
                <>
                    <Button title="Pick an image from camera roll" onPress={pickImage} />
                    <Button title="Take a photo" onPress={() => setShowCamera(true)} />
                </>
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