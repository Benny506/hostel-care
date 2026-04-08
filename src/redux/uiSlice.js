import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  globalLoading: {
    loading: false,
    title: '',
    message: ''
  },
  alerts: []
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload
    },
    addAlert: (state, action) => {
      state.alerts.push({
        id: Date.now(),
        ...action.payload
      })
    },
    removeAlert: (state, action) => {
      state.alerts = state.alerts.filter(a => a.id !== action.payload)
    }
  }
})

export const { setGlobalLoading, addAlert, removeAlert } = uiSlice.actions
export default uiSlice.reducer
