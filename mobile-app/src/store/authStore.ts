import { create } from 'zustand';
import { supabase } from '../config/supabase';

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      set({ user: profile, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  signup: async (email, password, fullName) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;

      const { data: profile } = await supabase
        .from('users')
        .insert([{
          id: data.user?.id,
          email,
          full_name: fullName,
          user_type: 'buyer',
        }])
        .select()
        .single();

      set({ user: profile, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await supabase.auth.signOut();
      set({ user: null, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  getCurrentUser: async () => {
    try {
      set({ isLoading: true });
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        set({ user: profile, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
