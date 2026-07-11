import { create } from 'zustand';
import { supabase } from '../config/supabase';

export const usePropertyStore = create((set) => ({
  properties: [],
  favoriteProperties: [],
  isLoading: false,
  error: null,

  fetchProperties: async (filters = {}) => {
    try {
      set({ isLoading: true, error: null });
      let query = supabase.from('properties').select('*');

      if (filters.propertyType) {
        query = query.eq('property_type', filters.propertyType);
      }
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters.bedrooms) {
        query = query.eq('bedrooms', filters.bedrooms);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;

      set({ properties: data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchPropertyById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      set({ error: error.message });
      return null;
    }
  },

  fetchFavorites: async (userId) => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabase
        .from('favorites')
        .select('properties(*)')
        .eq('user_id', userId);
      if (error) throw error;

      const favorites = data?.map((fav) => fav.properties) || [];
      set({ favoriteProperties: favorites, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addFavorite: async (userId, propertyId) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .insert([{ user_id: userId, property_id: propertyId }]);
      if (error) throw error;
    } catch (error) {
      set({ error: error.message });
    }
  },

  removeFavorite: async (userId, propertyId) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('property_id', propertyId);
      if (error) throw error;
    } catch (error) {
      set({ error: error.message });
    }
  },

  createProperty: async (property) => {
    try {
      set({ isLoading: true });
      const { error } = await supabase
        .from('properties')
        .insert([property]);
      if (error) throw error;
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateProperty: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    } catch (error) {
      set({ error: error.message });
    }
  },

  deleteProperty: async (id) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
      if (error) throw error;
    } catch (error) {
      set({ error: error.message });
    }
  },
}));
