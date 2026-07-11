import { create } from 'zustand';
import { supabase } from '../config/supabase';

export const useReviewStore = create((set) => ({
  reviews: [],
  isLoading: false,
  error: null,

  fetchReviews: async (propertyId) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('reviews')
        .select('*, user:users(*)')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      set({ reviews: data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addReview: async (propertyId, userId, rating, comment) => {
    try {
      set({ isLoading: true });
      const { error } = await supabase
        .from('reviews')
        .insert([{
          property_id: propertyId,
          user_id: userId,
          rating,
          comment,
        }]);
      if (error) throw error;
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  getAverageRating: async (propertyId) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('property_id', propertyId);
      if (error) throw error;
      if (!data || data.length === 0) return 0;
      const average = data.reduce((sum, review) => sum + review.rating, 0) / data.length;
      return Math.round(average * 10) / 10;
    } catch (error) {
      set({ error: error.message });
      return 0;
    }
  },
}));
