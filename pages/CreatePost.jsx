import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    TextInput,
    ActivityIndicator,
    Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Sound from 'react-native-sound';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

const CreatePost = () => {
    const navigation = useNavigation();
    const [songs, setSongs] = useState([]);
    const [selectedSong, setSelectedSong] = useState(null);
    const [sound, setSound] = useState(null);
    const [video, setVideo] = useState(null);
    const [postText, setPostText] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchJamendoSongs();
    }, []);

    // Stop and release sound when screen loses focus
    useFocusEffect(
        useCallback(() => {
            return () => {
                if (sound) {
                    sound.stop(() => sound.release());
                    setSound(null);
                }
            };
        }, [sound])
    );

    // Fetch songs
    const fetchJamendoSongs = async () => {
        try {
            const res = await axios.get(config.musicApi);
            setSongs(res.data.results);
        } catch (err) {
            console.log('Error fetching songs:', err);
        }
    };

    // Pick video
    const pickVideo = () => {
        ImagePicker.launchImageLibrary({ mediaType: 'video' }, (response) => {
            if (!response.didCancel && !response.errorCode) {
                setVideo(response.assets[0]);
            }
        });
    };

    // Play song
    const playSong = (song) => {
        setSelectedSong(song);
        if (sound) {
            sound.stop(() => sound.release());
        }

        const newSound = new Sound(song.audio, null, (error) => {
            if (error) {
                console.log('Failed to load sound', error);
                return;
            }
            newSound.play((success) => {
                if (!success) console.log('Playback failed');
            });
        });

        setSound(newSound);
    };

    // Create post
    const handlePost = async () => {
        if (!video && !postText) {
            Alert.alert('Error', 'Please add text or video for the post');
            return;
        }

        setLoading(true);
        const userId = await AsyncStorage.getItem('userId');
        const formData = new FormData();

        if (video) {
            formData.append('video', {
                uri: video.uri,
                type: video.type,
                name: video.fileName,
            });
        }
        formData.append('text', postText);
        formData.append('songId', selectedSong ? selectedSong.id : '');
        formData.append('userId', userId);

        try {
            const res = await axios.post(`${config.baseUrl}/post/create`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setLoading(false);

            if (res.data.status === 200) {
                Alert.alert('Success', 'Post created successfully!');
                setVideo(null);
                setPostText('');
                setSelectedSong(null);
                navigation.goBack();
                if (sound) sound.stop(() => sound.release());
            } else {
                Alert.alert('Error', 'Failed to create post');
            }
        } catch (err) {
            setLoading(false);
            console.log('Error creating post:', err);
            Alert.alert('Error', 'Something went wrong');
        }
    };

    const renderSongItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.songBox,
                selectedSong?.id === item.id && { borderColor: '#1DB954', borderWidth: 2 },
            ]}
            onPress={() => playSong(item)}
        >
            <Text style={styles.songName}>{item.name}</Text>
            <Text style={styles.songArtist}>{item.artist_name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Post</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <TouchableOpacity style={styles.videoPicker} onPress={pickVideo}>
                    <Text style={styles.videoText}>{video ? 'Video Selected' : 'Pick a Video'}</Text>
                </TouchableOpacity>

                <TextInput
                    style={styles.textInput}
                    placeholder="Write something..."
                    placeholderTextColor="#888"
                    multiline
                    value={postText}
                    onChangeText={setPostText}
                />

                <Text style={styles.sectionTitle}>Select Music</Text>
                <FlatList
                    data={songs}
                    renderItem={renderSongItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />

                <TouchableOpacity style={styles.postButton} onPress={handlePost} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text style={styles.postButtonText}>Post</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CreatePost;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1C1C1C' },
    header: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 15, backgroundColor: '#1C1C1C', gap: 20 },
    headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    content: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
    videoPicker: { backgroundColor: '#2A2A2A', height: 60, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    videoText: { color: 'white', fontSize: 16 },
    textInput: { backgroundColor: '#2A2A2A', color: 'white', fontSize: 16, borderRadius: 10, padding: 15, marginBottom: 20, minHeight: 80 },
    sectionTitle: { color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    songBox: { backgroundColor: '#2A2A2A', padding: 15, borderRadius: 10, marginBottom: 12 },
    songName: { color: 'white', fontSize: 16, fontWeight: '600' },
    songArtist: { color: '#bbbbbb', marginTop: 3 },
    postButton: { backgroundColor: '#1DB954', padding: 15, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
    postButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
