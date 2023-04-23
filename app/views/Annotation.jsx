import {
    StyleSheet,
    TouchableOpacity,
    View,
    PanResponder,
    Dimensions
} from 'react-native';
import { Image } from 'expo-image';
import Svg, { Rect } from 'react-native-svg';
import { useState, useCallback, useRef, useEffect } from 'react';
import cropImage from '../services/cropImage';
import { Button, Colors } from 'react-native-ui-lib';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const DEFAULT_STATES = {
    rectangles: [],
    rectPosition: { x: 0, y: 0 },
    rectDimensions: { width: 0, height: 0 }
}

export default function Annotation({ route, navigation }) {
    const [imageOffsetY, setImageOffsetY] = useState(0);
    const [height, setHeight] = useState('');
    const [width, setWidth] = useState('');

    useEffect(() => {
        setHeight(Dimensions.get('window').height - imageOffsetY);
        setWidth(Dimensions.get('window').width);
    }, [imageOffsetY]);

    const [rectangles, setRectangles] = useState(DEFAULT_STATES.rectangles);
    const [rectanglesPointer, setRectanglesPointer] = useState(1);

    const [rectPosition, setRectPosition] = useState(DEFAULT_STATES.rectPosition);
    const [rectDimensions, setRectDimensions] = useState(DEFAULT_STATES.rectDimensions);

    const containerRef = useRef(null);

    const [activePanningMode, setActivePanningMode] = useState('draw');
    const [pan, setPan] = useState(DEFAULT_STATES.rectPosition);
    const [panResponder, setPanResponder] = useState(null);
    useEffect(() => {
        if (activePanningMode === 'draw') {
            setPanResponder(PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onPanResponderRelease: handlePanResponderEnd,
                onPanResponderTerminate: handlePanResponderEnd,
            }))
        } else if (activePanningMode === 'pan') {
            setPanResponder(PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onPanResponderMove: (_, gesture) => {
                    setPan({ x: gesture.dx, y: gesture.dy });
                }
            }))
        }
    }, [activePanningMode])
    const handlePanResponderEnd = useCallback((event, gesture) => {
        const { x0, y0, dx, dy } = gesture;
        const x = dx > 0 ? x0 : x0 + dx;
        const y = dy > 0 ? y0 : y0 + dy;
        const width = Math.abs(dx);
        const height = Math.abs(dy);
        // after adding new rectangle, take current rectangles array up till current pointer, then append new rectangle and set pointer to end
        const newRectangles = [...rectangles.slice(0, rectanglesPointer), { x, y: y - imageOffsetY, width, height }];
        setRectangles(newRectangles);
        setRectanglesPointer(newRectangles.length); // pointer is 1-based since end index for slice does not count
        setRectPosition(DEFAULT_STATES.rectPosition);
        setRectDimensions(DEFAULT_STATES.rectDimensions);
    }, [rectangles, rectanglesPointer, imageOffsetY]);

    // const panResponder = PanResponder.create({
    //     onStartShouldSetPanResponder: () => true,
    //     onPanResponderRelease: handlePanResponderEnd,
    //     onPanResponderTerminate: handlePanResponderEnd,
    // });
    
    const undo = () => {
        if (rectanglesPointer > 0) setRectanglesPointer(rectanglesPointer - 1);
    }

    const redo = () => {
        if (rectanglesPointer < rectangles.length) setRectanglesPointer(rectanglesPointer + 1);
    }

    const doMeasure = () => {
        containerRef.current.measure((width, height, px, py, fx, fy) => {
            setImageOffsetY(fy);
          })
    }

    const submitAnnotations = useCallback(() => {
        const finalRectangles = rectangles.slice(0, rectanglesPointer);
        for (const rectangle of finalRectangles) {
            if (rectangle.height === 0 || rectangle.width === 0) continue;
            const dimensions = {
                height: rectangle.height,
                width: rectangle.width,
                originX: rectangle.x,
                originY: rectangle.y,
            }
            cropImage(route.params?.uri, dimensions, { captureWidth: width, captureHeight: height });
        }
    }, [rectangles, rectanglesPointer, width, height])

    return (
        <View style={styles.container} ref={containerRef} onLayout={doMeasure}>
            <View
                style={
                    [
                        styles.actionBar,
                        { top: 0, backgroundColor: Colors.primaryColor, zIndex: 100, paddingTop: 30 }
                    ]
                }
            >
                <Button
                    label="< Back"
                    backgroundColor={Colors.secondaryColor}
                    size={Button.sizes.medium}
                    onPress={() => navigation.goBack()}
                />
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        style={{ marginRight: 10 }}
                        onPress={() => setActivePanningMode('draw')}
                    >
                        <MaterialIcons
                            name="crop"
                            size={24}
                            color={activePanningMode === 'draw' ? "red" : "white"}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        // onPress={() => setActivePanningMode('pan')}
                    >
                        <MaterialCommunityIcons 
                            name="hand-back-right-outline"
                            size={24}
                            color={activePanningMode === 'pan' ? "red" : "white"}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <Image
                style={
                    [
                        styles.image,
                        { transform: [{ translateX: pan.x }, { translateY: pan.y }] }
                    ]
                }
                source={route.params?.uri}
                contentFit="contain"
            />
            <Svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, backgroundColor: 'transparent' }}>
                <Rect
                    x={rectPosition.x}
                    y={rectPosition.y}
                    width={rectDimensions.width}
                    height={rectDimensions.height}
                    fill="none"
                    stroke="red"
                    strokeWidth="2"
                />
                {rectangles.slice(0, rectanglesPointer).map(({ x, y, width, height }, index) => (
                    <Rect
                        key={index}
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        stroke="red"
                        strokeWidth="2"
                        fill="none"
                    />
                ))}
            </Svg>
            <View
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                {...panResponder?.panHandlers}
            />
            <View style={[styles.actionBar, { backgroundColor: Colors.primaryColor, bottom: 0 }]}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={undo} style={{ marginRight: 10 }}>
                        <MaterialIcons name="undo" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={redo}>
                        <MaterialIcons name="redo" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <Button
                    label="Next Step >"
                    onPress={submitAnnotations}
                    backgroundColor={Colors.secondaryColor}
                    size={Button.sizes.medium}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        position: 'relative'
    },
    image: {
        flex: 1,
        width: '100%',
        backgroundColor: '#0553',
    },
    actionBar: {
        display: 'flex',
        width: '100%',
        position: 'absolute',
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    }
});