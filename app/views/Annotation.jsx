import {
    Button,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    PanResponder,
    Dimensions
} from 'react-native';
import { Image } from 'expo-image';
import Svg, { Rect } from 'react-native-svg';
import { useState, useCallback, useRef, useEffect } from 'react';
import cropImage from '../services/cropImage';

const DEFAULT_STATES = {
    rectangles: [],
    rectPosition: { x: 0, y: 0 },
    rectDimensions: { width: 0, height: 0 }
}

export default function Annotation({ route }) {
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

    const handlePanResponderStart = (_, gesture) => {
        setRectPosition({ x: gesture.x0, y: gesture.y0 });
    }

    const handlePanResponderMove = useCallback((event, gesture) => {
        const { moveX, moveY, dx, dy } = gesture;
        console.log('move', { dx, dy }, gesture);
        // console.log(gesture)
        // Calculate the new position and dimensions of the rectangle
        const x = Math.min(rectPosition.x, moveX);
        const y = Math.min(rectPosition.y, moveY);
        const width = Math.abs(dx);
        const height = Math.abs(dy);

        // Update the position and dimensions of the rectangle
        setRectPosition({ x, y });
        setRectDimensions({ width, height });
    }, [rectPosition])

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        // onPanResponderStart: handlePanResponderStart,
        // onPanResponderMove: handlePanResponderMove,
        onPanResponderRelease: handlePanResponderEnd,
        onPanResponderTerminate: handlePanResponderEnd,
    });
    
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
            <Image
                style={styles.image}
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
                {...panResponder.panHandlers}
            />
            <View style={styles.actionBar}>
                <TouchableOpacity onPress={undo}>
                    <Text>Undo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={redo}>
                    <Text>Redo</Text>
                </TouchableOpacity>
                <Button title="Submit" onPress={submitAnnotations} />
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
        bottom: 0,
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
});