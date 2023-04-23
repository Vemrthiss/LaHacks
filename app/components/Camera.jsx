import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function Cam({ callback }) {
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const cameraRef = useRef(null);

    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }
    
    const takePicture = async () => {
        if (!cameraRef.current) return;
        const { uri } = await cameraRef.current.takePictureAsync();
        if (callback) callback(uri);
    }
    
    return (
        <Camera style={styles.camera} type={CameraType.back} ref={cameraRef}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={takePicture} style={styles.button}>
                    <View style={{ position: 'relative' }}>
                        <Ionicons name="ios-ellipse-outline" size={84} color="white"/>
                        <Ionicons name="ios-ellipse" size={58} color="white" style={{ position: 'absolute', top: 14, left: 12 }}/>
                    </View>
                </TouchableOpacity>
            </View>
        </Camera>
    );
}

const styles = StyleSheet.create({
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});