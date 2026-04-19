import { useReducer } from "react";
import Reducer, { pickTokenAndUser } from "./reducer.js";
import axios from "axios";
import API_URLS from "../../services/config.js";
import { AuthActions } from "./action.js";

const AUTH_USER_KEY = "authUser";

function loadStoredAuth() {
  if (typeof window === "undefined") {
    return { user: null, token: null };
  }
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    const user = raw ? JSON.parse(raw) : null;
    const token = localStorage.getItem("token");
    return { user, token: token || null };
  } catch {
    return { user: null, token: null };
  }
}

const initialState = loadStoredAuth();

export const AuthState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        `${API_URLS.Auth}/login`,
        { username, password },
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      const data = response.data?.data ?? response.data;
      dispatch({
        type: AuthActions.LOGIN,
        payload: response.data,
      });
      const { token, user } = pickTokenAndUser(response.data);
      if (token) {
        localStorage.setItem("token", token);
      }
      if (user) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_USER_KEY);
      }
      return data;
    } catch (error) {
      return error;
    }
  };

  /** Does not update auth state — user signs in on /login so /login is not skipped. */
  const register = async (values) => {
    try {
      const payload = {
        username: values.username,
        password: values.password,
        name: values.name,
        experience: values.experience,
        mobileNumber: values.mobileNumber,
      };
      const response = await axios.post(`${API_URLS.Auth}/register`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      const data = response.data?.data ?? response.data;
      return data;
    } catch (error) {
      return error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem(AUTH_USER_KEY);
    dispatch({ type: AuthActions.LOGOUT });
  };

  return {
    ...state,
    login,
    register,
    logout,
  };
};
