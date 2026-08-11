import { configureStore } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

// Temporary placeholder slice — jab real slices banayenge tab isko hata denge
const appSlice = createSlice({
  name: 'app',
  initialState: { ready: true },
  reducers: {},
})

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
})