// utils/AuthContext.js

import { ProfilePresenter } from "@/lib/api.types";
import React, { createContext, useReducer, useContext } from "react";


interface Publication {
  title: string;
  url: string;
}

type stateType = {
  isAuthenticated: boolean;
  user: ProfilePresenter | null;
  selectedBlog: Publication | null;
}

// Define the initial state
const initialState: stateType = {
  isAuthenticated: false,
  user: null,
  selectedBlog: null,
};

type Dispatch = { type: typeof LOGIN | typeof LOGOUT | typeof UPDATE_PUBLICATION; payload?: stateType | any };

// Create a context
const AuthContext = createContext({
  state: initialState,
  dispatch: (data: Dispatch) => {},
});

// Define actions
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const UPDATE_PUBLICATION = "UPDATE_PUBLICATION";

// Reducer function
const authReducer = (state: typeof initialState, action: Dispatch) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case UPDATE_PUBLICATION:
      return {
        ...state,
        selectedBlog: action.payload.selectedBlog,
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

// Context provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the context
export const useAuth = () => {
  return useContext(AuthContext);
};
