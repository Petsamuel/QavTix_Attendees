import { ConfirmationActionType } from '@/components/modals/resources/confirmationActions';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConfirmationState {
    isOpen: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    actionType?: ConfirmationActionType;
    isConfirmed: boolean;
    lastConfirmedAction: ConfirmationActionType | null;
}

const initialState: ConfirmationState = {
    isOpen: false,
    title: '',
    description: '',
    confirmText: 'Yes, I am',
    cancelText: 'Cancel',
    actionType: undefined,
    isConfirmed: false,
    lastConfirmedAction: null
};

export const confirmationSlice = createSlice({
    name: 'confirmation',
    initialState,
    reducers: {
        openConfirmation: (state, action: PayloadAction<{
            title: string;
            description: string;
            confirmText?: string;
            cancelText?: string;
            actionType: ConfirmationActionType;
        }>) => {
            state.isOpen = true;
            state.isConfirmed = false;
            // Clear previous confirmation records when a new one starts
            state.lastConfirmedAction = null; 
            state.title = action.payload.title;
            state.description = action.payload.description;
            state.confirmText = action.payload.confirmText || 'Yes, I am';
            state.cancelText = action.payload.cancelText || 'Cancel';
            state.actionType = action.payload.actionType;
        },
        confirmAction: (state) => {
            state.isConfirmed = true;
            state.isOpen = false;
            // Record exactly what was confirmed before clearing actionType
            state.lastConfirmedAction = state.actionType || null; 
        },
        closeConfirmation: (state) => {
            state.isOpen = false;
            state.isConfirmed = false;
            state.actionType = undefined;
            // Make Ur Mind De: We don't clear lastConfirmedAction here so the component can still read it
        },
        resetConfirmationStatus: (state) => {
            state.isConfirmed = false;
            state.lastConfirmedAction = null;
            state.actionType = undefined;
        }
    }
})

export const { openConfirmation, confirmAction, closeConfirmation, resetConfirmationStatus } = confirmationSlice.actions;
export default confirmationSlice.reducer;