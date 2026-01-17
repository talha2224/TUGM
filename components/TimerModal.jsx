import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import Modal from 'react-native-modal';
import CustomWheelPicker from './CustomWheelPicker';
const { width } = Dimensions.get('window');
const TimerModal = ({ visible, hide, addTime }) => {
    const [selectedMin, setSelectedMin] = useState('1');
    const [selectedSec, setSelectedSec] = useState('1');

    const minutesData = Array.from({ length: 31 }, (_, i) => i.toString());
    const secondsData = Array.from({ length: 60 }, (_, i) => i.toString());

    useEffect(() => {
        if (visible) {
            setSelectedMin('0');
            setSelectedSec('0');
        }
    }, [visible]);

    const handleConfirm = () => {
        const min = parseInt(selectedMin);
        const sec = parseInt(selectedSec);
        if (min === 0 && sec === 0) {
            Alert.alert("Please select a time greater than 0");
            return;
        }
        addTime(min, sec);
        hide();
    };

    return (
        <Modal
            isVisible={visible}
            onBackdropPress={hide}
            backdropOpacity={0.6}
            style={styles.modal}
            useNativeDriver={false}
            useNativeDriverForBackdrop={true}
            propagateSwipe={true}
            hideModalContentWhileAnimating={true}
        >
            <View style={styles.container}>
                {/* Drag Handle to replace swipe logic visually */}
                <View style={styles.dragHandle} />

                <View style={styles.pickerContainer}>
                    {/* The Bar - positioned behind pickers */}
                    <View pointerEvents="none" style={styles.highlightBar} />

                    <View style={styles.pickerWrapper}>
                        <CustomWheelPicker
                            data={minutesData}
                            selectedValue={selectedMin}
                            onValueChange={setSelectedMin}
                        />
                        <Text style={styles.label}>Min</Text>
                    </View>

                    <View style={styles.pickerWrapper}>
                        <CustomWheelPicker
                            data={secondsData}
                            selectedValue={selectedSec}
                            onValueChange={setSelectedSec}
                        />
                        <Text style={styles.label}>Sec</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.8}
                    onPress={handleConfirm}
                >
                    <Text style={styles.buttonText}>Add Time</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: { justifyContent: 'flex-end', margin: 0 },
    container: {
        backgroundColor: '#1C1C1E',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingBottom: 50,
        paddingTop: 15, // Reduced to fit handle
        alignItems: 'center',
        minHeight: 380,
    },
    dragHandle: {
        width: 40,
        height: 5,
        backgroundColor: '#444',
        borderRadius: 10,
        marginBottom: 10,
    },
    pickerContainer: {
        flexDirection: 'row',
        width: '100%',
        height: 225,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pickerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.4,
        zIndex: 10, // Ensure pickers are above the highlight bar
    },
    label: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginLeft: 5 },
    highlightBar: {
        position: 'absolute',
        height: 50,
        width: '85%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 25,
    },
    button: {
        backgroundColor: '#F58220',
        width: '88%',
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});

export default TimerModal;