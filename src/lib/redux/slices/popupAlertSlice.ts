import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PopUpMessageAlert } from '@/components/modals/resources/popup-message-alert-config';

interface AlertState {
  alerts: PopUpMessageAlert[]
  isOpen: boolean;
}

const initialState: AlertState = {
  alerts: [],
  isOpen: true,
}

export const alertSlice = createSlice({
    name: 'alerts',
    initialState,
    reducers: {
        triggerPopupAlert: (state, action: PayloadAction<PopUpMessageAlert>) => {
            state.alerts = [action.payload];
            state.isOpen = true;
        },
        setSystemPopupAlert: (state, action: PayloadAction<PopUpMessageAlert[]>) => {
            state.alerts = action.payload;
            state.isOpen = action.payload.length > 0;
        },
        pushPopupAlert: (state, action: PayloadAction<PopUpMessageAlert>) => {
            state.alerts.push(action.payload);
            state.isOpen = true;
        },
        closePopupAlertModal: (state) => {
            state.isOpen = false;
            state.alerts = []
        },
    },
})

export const { triggerPopupAlert, setSystemPopupAlert, pushPopupAlert, closePopupAlertModal } = alertSlice.actions;
export default alertSlice.reducer;