import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type SnackbarVariant = 'default' | 'success' | 'error' | 'loading'

interface SnackbarState {
    isOpen: boolean
    message: string
    variant: SnackbarVariant
}

const initialState: SnackbarState = {
    isOpen: false,
    message: '',
    variant: 'default',
}

const snackbarSlice = createSlice({
    name: 'snackbar',
    initialState,
    reducers: {
        showSnackbar: (
            state,
            action: PayloadAction<{
                message: string
                variant?: SnackbarVariant
            }>
        ) => {
            state.isOpen = true
            state.message = action.payload.message
            state.variant = action.payload.variant || 'default'
        },
        hideSnackbar: (state) => {
            state.isOpen = false
        },
    },
})

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions
export default snackbarSlice.reducer
