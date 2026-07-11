import { create } from 'zustand';
import * as ImagePicker from 'react-native-image-picker';
import { supabase } from '../config/supabase';

export const useImageStore = create((set) => ({
  selectedImage: null,
  uploadProgress: 0,
  isUploading: false,
  error: null,

  pickImage: async () => {
    return new Promise((resolve) => {
      ImagePicker.launchImageLibrary(
        {
          mediaType: 'photo',
          quality: 0.8,
        },
        (response) => {
          if (response.didCancel) {
            resolve(null);
          } else if (response.errorCode) {
            set({ error: response.errorMessage });
            resolve(null);
          } else {
            const image = response.assets?.[0];
            set({ selectedImage: image });
            resolve(image);
          }
        }
      );
    });
  },

  uploadImage: async (image, bucket, fileName) => {
    try {
      set({ isUploading: true, error: null, uploadProgress: 0 });

      const imageData = await fetch(image.uri).then(r => r.blob());
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, imageData, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      set({ isUploading: false, uploadProgress: 100, selectedImage: null });
      return publicUrl;
    } catch (error) {
      set({ error: error.message, isUploading: false });
      return null;
    }
  },

  clearSelectedImage: () => {
    set({ selectedImage: null, uploadProgress: 0 });
  },
}));
