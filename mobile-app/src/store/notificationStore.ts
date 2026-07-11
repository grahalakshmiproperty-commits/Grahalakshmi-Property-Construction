import { create } from 'zustand';
import { supabase } from '../config/supabase';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      const unreadCount = data?.filter(n => !n.read).length || 0;
      set({ notifications: data || [], unreadCount, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  markAsRead: async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      if (error) throw error;
    } catch (error) {
      set({ error: error.message });
    }
  },

  sendNotification: async (userId, title, message, type) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([{
          user_id: userId,
          title,
          message,
          type,
        }]);
      if (error) throw error;
    } catch (error) {
      set({ error: error.message });
    }
  },

  deleteNotification: async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      if (error) throw error;
    } catch (error) {
      set({ error: error.message });
    }
  },
}));
