import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AuthUser {
  readonly id: string | null
  readonly full_name: string | null
  readonly email: string | null
  readonly phone: string | null
  readonly role: 'host' | null
  readonly profile_img?: string | null
}

const initialState: AuthUser = {
    email: null,
    full_name: null,
    id: null,
    phone: null,
    profile_img: null,
    role: null
}

const authUserSlice = createSlice({
    name: 'authUser',
    initialState,
    reducers: {
        // Set authenticated user
        setAuthUser: (state, { payload }: PayloadAction<AuthUser>) => {
            state = payload;
        },

        logoutUser: (state) => {
            state = { email: null, full_name: null, id: null, phone: null, role: null, profile_img: null }
        },

        refreshAuthUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
            if (state) {
                return { ...state, ...action.payload }
            }
            return state
        }
    }
})

export const {
  setAuthUser,
  logoutUser,
  refreshAuthUser
} = authUserSlice.actions

export default authUserSlice.reducer;

export const selectAuthUser = (state: { authUser: AuthUser | null }) => state.authUser
export const selectIsAuthenticated = (state: { authUser: AuthUser | null }) => !!state.authUser