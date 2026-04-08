import axios from 'axios'
import { supabase, SUPABASE_ANON_KEY } from '../../supabase/supabaseClient'

const SUPABASE_EDGE_URL = 'https://tiwuhxljzjknkvplrxrg.supabase.co/functions/v1'

export const authService = {
  /**
   * Register a new user via the Supabase Edge Function.
   * This is used specifically for the initial account setup.
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise}
   */
  createOnlyUser: async (email, password) => {
    try {
      const response = await axios.post(`${SUPABASE_EDGE_URL}/create-only-user`, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error in createOnlyUser:', error.response?.data || error.message)
      throw error.response?.data || new Error('Failed to create account.')
    }
  },

  /**
   * Authenticate a user with institutional credentials.
   * @param {string} email 
   * @param {string} password 
   */
  login: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error in login:', error.message)
      throw new Error(error.message || 'Access Denied: Invalid email or password.')
    }
  },

  /**
   * Logout of the current session.
   */
  logout: async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error in logout:', error)
    }
  },

  /**
   * Account Initialization.
   * Verifies session and retrieves the resident profile.
   */
  initializeAuth: async () => {
    try {
      // 1. Get Session User
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) return { user: null, profile: null }

      // 2. Get Institutional Profile
      const { data: profile, error: profileError } = await supabase
        .from('hc_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) return { user: null, profile: null }
      return { user, profile }
    } catch (error) {
      console.error('Account Initialization Failed:', error)
      return { user: null, profile: null }
    }
  },

  /**
   * Check if an email is already registered in the hostel system.
   * @param {string} email 
   */
  checkEmailAvailability: async (email) => {
    try {
      const { data, error } = await supabase.rpc('email_exists', { email_input: email })
      if (error) throw error
      return data // Returns true if email exists, false otherwise
    } catch (error) {
      console.error('Error in identity verification RPC:', error)
      throw new Error('Verification Failed: Identity database unreachable.')
    }
  },

  /**
   * Fetch the user's institutional profile.
   * @param {string} uid - The Supabase Auth UID.
   */
  getUserProfile: async (uid) => {
    try {
      const { data, error } = await supabase
        .from('hc_profiles')
        .select('*')
        .eq('id', uid)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      throw new Error('Error: Profile data retrieval failed.')
    }
  },

  /**
   * Provision the initial institutional profile.
   * @param {object} profileData 
   */
  completeProfile: async (profileData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Unauthenticated: Access denied.')

      const { data: profile, error: profileError } = await supabase
        .from('hc_profiles')
        .insert({
          ...profileData,
          id: user.id,
          email: user.email
        })
        .select()
        .single()

      if (profileError) throw profileError
      return { user, profile }
    } catch (error) {
      console.error('Error completing profile:', error)
      throw new Error(error.message || 'Failed to complete profile setup.')
    }
  },

  /**
   * Reset a user's password via the Supabase Edge Function.
   * @param {string} email 
   * @param {string} new_password 
   */
  resetPassword: async (email, new_password) => {
    try {
      const response = await axios.post(`${SUPABASE_EDGE_URL}/reset-password`, {
        email,
        new_password
      }, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error in resetPassword:', error.response?.data || error.message)
      throw error.response?.data || new Error('Failed to reset password.')
    }
  }
}

export default authService
