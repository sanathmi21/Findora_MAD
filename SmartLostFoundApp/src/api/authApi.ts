import { supabase } from '../utils/supabase';
import { decode } from 'base64-arraybuffer'; 
import * as FileSystem from 'expo-file-system/legacy';

export const authApi = {
  // Register a new user and upload their avatar
  register: async (email: string, password: string, username: string, imageUri: string | null) => {
    // create the core authentication user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username,
          display_name: username,
        },
      },
    });

    if (authError) return { error: authError };

    const userId = authData.user?.id;
    let avatarUrl = null;

    if (userId) {
      // If the user selected a profile image, upload it
      if (imageUri) {
        try {
          // Fix for Android Network Request Failed: Read file as base64 string
          const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: 'base64' });

          // Upload the decoded base64 string to the 'avatars' bucket
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(`${userId}/avatar.jpg`, decode(base64), {
              contentType: 'image/jpeg',
              upsert: true, 
            });

          if (!uploadError) {
            // Get the public URL instantly
            const { data: publicUrlData } = supabase.storage
              .from('avatars')
              .getPublicUrl(`${userId}/avatar.jpg`);
            
            avatarUrl = publicUrlData.publicUrl;
          } else {
            console.error('Image upload error:', uploadError);
          }
        } catch (error) {
          console.error('Failed to process image:', error);
        }
      }

      // Insert the new user profile into the 'profiles' table
      const { error: profileError } = await supabase.from('profiles').insert([
        { id: userId, username: username, email: email, avatar_url: avatarUrl }
      ]);
      
      if (profileError) return { error: profileError };
    }

    return { data: authData };
  },

  // Log in an existing user 
  login: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
  },

  // Log out the current user
  logout: async () => {
    return await supabase.auth.signOut();
  },
};