import { supabase } from '../utils/supabase';

export const authApi = {
  //Register a new user
  register: async (email: string, password: string, username: string) => {
    return await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username, 
        },
      },
    });
  },

  //login an existing user
  login: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
  },

  // log out the current user
  logout: async () => {
    return await supabase.auth.signOut();
  },
};