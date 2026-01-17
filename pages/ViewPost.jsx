import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList, Image, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Sound from 'react-native-sound';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Video from 'react-native-video';
import config from '../config';

const { width } = Dimensions.get('window');

const ViewPostScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { post } = route.params;

    const [comments, setComments] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [currentPost, setCurrentPost] = useState(post);

    const soundRef = useRef(null);
    const currentSoundRef = useRef(null);

    const fetchPost = async () => {
        try {
            const res = await axios.get(`${config.baseUrl}/post/${post._id}`);
            const postData = res.data.data;
            setComments(postData.comments || []);
            const userId = await AsyncStorage.getItem('userId');
            setIsLiked(postData.likes.includes(userId));
            setCurrentPost(postData);
        } catch (err) {
            console.log('Error fetching post:', err);
        }
    };

    const playMusic = async () => {
        if (!post.songId) return;

        try {
            const res = await axios.get(config.musicApi);
            const allSongs = res.data.results || [];
            const matchedSong = allSongs.find((s) => s.id === post.songId);
            if (!matchedSong) return;

            // Stop previous sound if exists
            if (soundRef.current) {
                soundRef.current.stop(() => soundRef.current.release());
                soundRef.current = null;
            }

            const newSound = new Sound(matchedSong.audio, null, (error) => {
                if (error) {
                    console.log('Sound init error:', error);
                    return;
                }
                newSound.play((success) => {
                    if (!success) console.log('Playback failed');
                });
                soundRef.current = newSound;
                currentSoundRef.current = newSound;
            });
        } catch (err) {
            console.log('Error fetching songs:', err);
        }
    };

    const toggleLike = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const res = await axios.put(`${config.baseUrl}/post/like`, { postId: post._id, userId });
            setIsLiked(res.data.data.includes(userId));
            setCurrentPost({ ...currentPost, likes: res.data.data });
        } catch (err) {
            console.log('Error toggling like:', err);
        }
    };

    const addComment = async () => {
        if (!newComment.trim()) return;
        try {
            const userId = await AsyncStorage.getItem('userId');
            const res = await axios.put(`${config.baseUrl}/post/comment`, {
                postId: post._id,
                userId,
                comment: newComment,
            });
            setComments(res.data.data);
            setNewComment('');
        } catch (err) {
            console.log('Error adding comment:', err);
        }
    };

    useEffect(() => {
        let isMounted = true;

        fetchPost();
        playMusic();

        return () => {
            isMounted = false;
            if (soundRef.current) {
                soundRef.current = null;
            }
            if (currentSoundRef.current && currentSoundRef.current !== soundRef.current) {
                currentSoundRef.current.stop(() => currentSoundRef.current.release());
            }
        };
    }, [post.songId]);

    const renderCommentItem = ({ item }) => (
        <View style={styles.commentItem}>
            <Image source={{ uri: item.userId.profile || item.userId.profileImage }} style={styles.commentAvatar} />
            <View style={styles.commentContent}>
                <Text style={styles.commentUser}>{item.userId.username}</Text>
                <Text style={styles.commentText}>{item.comment}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {currentPost.video && (
                <Video source={{ uri: currentPost.video }} style={StyleSheet.absoluteFill} resizeMode="cover" repeat muted rate={1.0} />
            )}

            <View style={styles.overlay}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="x" size={28} color="#fff" />
                </TouchableOpacity>

                <View style={styles.actions}>
                    <TouchableOpacity onPress={toggleLike} style={styles.actionButton}>
                        <MaterialCommunityIcon name={isLiked ? 'heart' : 'heart-outline'} size={30} color={isLiked ? 'red' : '#fff'} />
                        <Text style={styles.actionText}>{currentPost.likes.length}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowComments(true)} style={styles.actionButton}>
                        <Icon name="message-circle" size={30} color="#fff" />
                        <Text style={styles.actionText}>{comments.length}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.postInfo}>
                    <Text style={styles.userHandle}>{currentPost.userId.name}</Text>
                    <Text style={styles.postText}>{currentPost.text}</Text>
                </View>
            </View>

            <Modal visible={showComments} animationType="slide" transparent>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.commentsModal}>
                    <View style={styles.commentsHeader}>
                        <Text style={styles.commentsTitle}>Comments</Text>
                        <TouchableOpacity onPress={() => setShowComments(false)}>
                            <Icon name="x" size={28} color="#000" />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={comments}
                        keyExtractor={(item) => item._id}
                        renderItem={renderCommentItem}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                    <View style={styles.commentInputContainer}>
                        <TextInput
                            placeholder="Add a comment..."
                            placeholderTextColor="#888"
                            value={newComment}
                            onChangeText={setNewComment}
                            style={styles.commentInput}
                        />
                        <TouchableOpacity onPress={addComment}>
                            <MaterialCommunityIcon name="send" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    overlay: { flex: 1, justifyContent: 'flex-end', paddingBottom: 50 },
    backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
    actions: { position: 'absolute', right: 15, bottom: 150, alignItems: 'center' },
    actionButton: { alignItems: 'center', marginBottom: 25 },
    actionText: { color: '#fff', fontSize: 12, marginTop: 3 },
    postInfo: { position: 'absolute', bottom: 120, left: 15, maxWidth: width * 0.7 },
    userHandle: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    postText: { color: '#fff', fontSize: 14, marginTop: 5 },
    commentsModal: { flex: 1, backgroundColor: '#fff', marginTop: 100, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 15 },
    commentsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    commentsTitle: { fontSize: 18, fontWeight: 'bold' },
    commentItem: { flexDirection: 'row', paddingVertical: 10, alignItems: 'center' },
    commentAvatar: { width: 35, height: 35, borderRadius: 17.5, marginRight: 10 },
    commentContent: { flex: 1 },
    commentUser: { fontWeight: 'bold', color: '#000', fontSize: 14 },
    commentText: { color: '#000', fontSize: 13, marginTop: 2 },
    commentInputContainer: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderColor: '#ccc', paddingTop: 10 },
    commentInput: { flex: 1, fontSize: 14, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 20, marginRight: 10 },
});

export default ViewPostScreen;
