"use client"
import userService from "@/services/userService"
import { initialize, reducer } from "./reducers"
import { AuthState } from "./types"
import { Dispatch, createContext, useEffect, useReducer } from "react"


export enum AuthActionType {
    INITIALIZE = "INITIALIZE",
    SIGN_IN = "SIGN_IN",
    SIGN_OUT = "SIGN_OUT"
}

export interface PayloadAction<T> {
    type: AuthActionType,
    payload: T
}

export interface AuthContextType extends AuthState {
    dispatch: Dispatch<PayloadAction<AuthState>>
}

const initialState: AuthState = {
    isAuthenticated: false,
    isInitialized: false,
    user: null
}
export const AuthContext = createContext<AuthContextType>({
    ...initialState,
    dispatch: () => null
})

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        (async () => {
            try {
                const response = await userService.getProfile()
                console.log(response.data)
                dispatch(initialize({ isAuthenticated: true, user: response.data }))
            } catch {
                dispatch(initialize({ isAuthenticated: false, user: null }))
            }
        })()
    }, [])


    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )

}

export default AuthProvider