import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const ITEM_HEIGHT = 45;

const CustomWheelPicker = ({ data, selectedValue, onValueChange }) => {
    const flatListRef = useRef(null);
    const paddedData = ['', '', ...data, '', ''];

    const handleScroll = (event) => {
        const y = event.nativeEvent.contentOffset.y;
        const index = Math.round(y / ITEM_HEIGHT);
        
        if (data[index] !== undefined && data[index] !== selectedValue) {
            onValueChange(data[index]);
        }
    };

    useEffect(() => {
        const initialIndex = data.indexOf(selectedValue);
        if (initialIndex !== -1) {
            const timer = setTimeout(() => {
                flatListRef.current?.scrollToOffset({
                    offset: initialIndex * ITEM_HEIGHT,
                    animated: false,
                });
            }, 300); // Increased delay slightly
            return () => clearTimeout(timer);
        }
    }, [data]);

    return (
        <View style={styles.mainContainer}>
            <FlatList
                ref={flatListRef}
                data={paddedData}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={[
                            styles.itemText,
                            item === selectedValue && styles.selectedText
                        ]}>
                            {item}
                        </Text>
                    </View>
                )}
                // Essential props for the "Wheel" feel
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                onMomentumScrollEnd={handleScroll}
                onScrollEndDrag={handleScroll}
                decelerationRate="fast"
                getItemLayout={(_, index) => ({
                    length: ITEM_HEIGHT,
                    offset: ITEM_HEIGHT * index,
                    index,
                })}
                // Interaction props
                contentContainerStyle={styles.listPadding}
                nestedScrollEnabled={true}
                scrollEventThrottle={16}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: { 
        height: ITEM_HEIGHT * 5, 
        width: 70, 
        overflow: 'hidden' 
    },
    itemContainer: { 
        height: ITEM_HEIGHT, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    itemText: { 
        color: '#666', 
        fontSize: 20, 
        fontWeight: '500' 
    },
    selectedText: { 
        color: '#FFFFFF', 
        fontSize: 24, // Slightly larger for focus
        fontWeight: 'bold' 
    },
});

export default CustomWheelPicker;