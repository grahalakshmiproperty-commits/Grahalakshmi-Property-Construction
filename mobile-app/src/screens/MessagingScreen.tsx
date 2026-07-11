import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import { useMessagingStore } from '../store/messagingStore';
import { useAuthStore } from '../store/authStore';

const MessagingScreen = ({ navigation }) => {
  const { conversations, messages, fetchConversations, sendMessage } = useMessagingStore();
  const { user } = useAuthStore();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');

  React.useEffect(() => {
    if (user) {
      fetchConversations(user.id);
    }
  }, [user]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;
    await sendMessage(selectedConversation.id, user.id, messageText);
    setMessageText('');
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Please login to access messages</Text>
      </View>
    );
  }

  if (selectedConversation) {
    const conversationMessages = messages[selectedConversation.id] || [];
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedConversation(null)}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Conversation</Text>
        </View>

        <FlatList
          data={conversationMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[
              styles.messageItem,
              item.sender_id === user.id ? styles.sentMessage : styles.receivedMessage,
            ]}>
              <Text style={styles.messageText}>{item.message}</Text>
              <Text style={styles.messageTime}>
                {new Date(item.created_at).toLocaleTimeString()}
              </Text>
            </View>
          )}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type message..."
            value={messageText}
            onChangeText={setMessageText}
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {conversations.length === 0 ? (
        <Text style={styles.emptyText}>No conversations yet</Text>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.conversationItem}
              onPress={() => setSelectedConversation(item)}
            >
              <View style={styles.conversationInfo}>
                <Text style={styles.conversationTitle}>
                  Conversation {item.id.substring(0, 8)}
                </Text>
                <Text style={styles.conversationDate}>
                  {new Date(item.updated_at).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#2c3e50', paddingTop: 40, paddingBottom: 20, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  backButton: { color: '#fff', fontSize: 18, fontWeight: '600' },
  conversationItem: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#ecf0f1', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  conversationInfo: { flex: 1 },
  conversationTitle: { fontSize: 16, fontWeight: '600', color: '#2c3e50' },
  conversationDate: { fontSize: 12, color: '#7f8c8d', marginTop: 4 },
  chevron: { fontSize: 24, color: '#3498db' },
  messageItem: { marginHorizontal: 12, marginVertical: 4, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, maxWidth: '80%' },
  sentMessage: { alignSelf: 'flex-end', backgroundColor: '#3498db' },
  receivedMessage: { alignSelf: 'flex-start', backgroundColor: '#ecf0f1' },
  messageText: { fontSize: 14, color: '#2c3e50' },
  messageTime: { fontSize: 10, color: '#95a5a6', marginTop: 4 },
  inputContainer: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ecf0f1' },
  input: { flex: 1, backgroundColor: '#f5f5f5', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, maxHeight: 100 },
  sendButton: { backgroundColor: '#3498db', borderRadius: 20, paddingHorizontal: 16, justifyContent: 'center', marginLeft: 8 },
  sendButtonText: { color: '#fff', fontWeight: '600' },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#7f8c8d' },
});

export default MessagingScreen;
