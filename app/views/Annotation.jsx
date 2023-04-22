import { Button, StyleSheet, Text, TouchableOpacity, View, PanResponder } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Rect } from 'react-native-svg';
import { useState, useCallback, useEffect } from 'react';
import { throttle } from 'lodash';

const DEFAULT_STATES = {
    rectangles: [],
    rectPosition: { x: 0, y: 0 },
    rectDimensions: { width: 0, height: 0 }
}

export default function Annotation({ route }) {
    const [rectangles, setRectangles] = useState(DEFAULT_STATES.rectangles);
    const [rectPosition, setRectPosition] = useState(DEFAULT_STATES.rectPosition);
    const [rectDimensions, setRectDimensions] = useState(DEFAULT_STATES.rectDimensions);

    const handlePanResponderEnd = (event, gesture) => {
        const { x0, y0, dx, dy } = gesture;
        const x = dx > 0 ? x0 : x0 + dx;
        const y = dy > 0 ? y0 : y0 + dy;
        const width = Math.abs(dx);
        const height = Math.abs(dy);
        setRectangles([...rectangles, { x, y, width, height }]);
        setRectPosition(DEFAULT_STATES.rectPosition);
        setRectDimensions(DEFAULT_STATES.rectDimensions);
    };

    const handlePanResponderStart = (_, gesture) => {
        setRectPosition({ x: gesture.x0, y: gesture.y0 });
    }

    const handlePanResponderMove = useCallback((event, gesture) => {
        const { moveX, moveY, dx, dy } = gesture;
        console.log(gesture)
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
        onPanResponderStart: handlePanResponderStart,
        onPanResponderMove: handlePanResponderMove,
        onPanResponderRelease: handlePanResponderEnd,
        onPanResponderTerminate: handlePanResponderEnd,
    });

    return (
        <View style={styles.container}>
            <Image
                style={styles.image}
                source={route.params?.uri}
                contentFit="cover"
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
                {rectangles.map(({ x, y, width, height }, index) => (
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
});