import { create } from 'zustand';
import { supabase } from '../config/supabase';

export const useMessagingStore = create((set, get) => ({
  conversations: [],
  messages: {},
  isLoading: false,
  error: null,

  fetchConversations: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      set({ conversations: data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchMessages: async (conversationId) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      const messages = get().messages;
      messages[conversationId] = data || [];
      set({ messages });
    } catch (error) {
      set({ error: error.message });
    }
  },

  sendMessage: async (conversationId, userId, message) => {
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          sender_id: userId,
          message,
        }]);
      if (error) throw error;
      await get().fetchMessages(conversationId);
    } catch (error) {
      set({ error: error.message });
    }
  },

  createConversation: async (userId1, userId2) => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert([{
          user_id_1: userId1,
          user_id_2: userId2,
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      set({ error: error.message });
      return null;
    }
  },
}));
