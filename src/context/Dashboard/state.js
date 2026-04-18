import { useReducer } from "react";
import Reducer from "./reducer.js";
import axios from "axios";
import API_URLS from "../../services/config.js";
import { DashboardActions } from "./action.js";

const initialState = {
  dashboard: null,
};

export const DashboardState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  const getDashboard = async (yearlyTarget) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URLS.Dashboard}/overview?yearlyTarget=${yearlyTarget}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      dispatch({
        type: DashboardActions.GET_DASHBOARD,
        payload: response.data,
      });
      return response.data.data;
    } catch (error) {
      return error;
    }
  };

  const getDashboardById = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URLS.Dashboard}/dashboard/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      dispatch({
        type: DashboardActions.GET_DASHBOARD_BY_ID,
        payload: response.data,
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const addDashboard = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URLS.Dashboard}/dashboard`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      dispatch({
        type: DashboardActions.ADD_DASHBOARD,
        payload: response.data,
      });
      return response;
    } catch (error) {
      return error.response || error;
    }
  };

  const updateDashboard = async (id, data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URLS.Dashboard}/dashboard/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      dispatch({
        type: DashboardActions.UPDATE_DASHBOARD,
        payload: response.data,
      });
      return response;
    } catch (error) {
      return error.response || error;
    }
  };

  const deleteDashboard = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_URLS.Dashboard}/dashboard/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      dispatch({
        type: DashboardActions.DELETE_DASHBOARD,
        payload: response.data,
      });
    } catch (error) {
      return error.response?.data;
    }
  };

  return {
    ...state,
    getDashboard,
    getDashboardById,
    addDashboard,
    updateDashboard,
    deleteDashboard,
  };
};
