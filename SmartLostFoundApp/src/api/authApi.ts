import { supabase } from '../utils/supabase';

export const authApi = {
  // Register a new user and upload their avatar
  register: async (email: string, password: string, username: string, imageUri: string | null) => {
    // create the user with Supabase Auth
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
      // upload avatar if user provided one during registration
      if (imageUri) {
        try {
          const response = await fetch(imageUri);
          const blob = await response.blob();

          // Upload to the 'avatars' bucket
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(`${userId}/avatar.jpg`, blob, {
              contentType: 'image/jpeg',
              upsert: true, 
            });

          if (!uploadError) {
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