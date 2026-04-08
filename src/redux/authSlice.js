import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  role: null, // 'student' or 'warden'
  isAuthenticated: false,
  loading: false,
  initChecked: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user
      state.role = action.payload.role
      state.isAuthenticated = true
      state.loading = false
      state.initChecked = true
    },
    logout: (state) => {
      state.user = null
      state.role = null
      state.isAuthenticated = false
      state.initChecked = true
    },
    setAuthLoading: (state, action) => {
      state.loading = action.payload
    },
    setInitChecked: (state, action) => {
      state.initChecked = action.payload
    }
  }
})

export const { loginSuccess, logout, setAuthLoading, setInitChecked } = authSlice.actions
export default authSlice.reducer
