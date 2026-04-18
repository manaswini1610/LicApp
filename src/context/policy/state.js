import { useReducer, useCallback, useRef } from "react";
import axios from "axios";
import API_URLS from "../../services/config.js";
import Reducer from "./reducer.js";
import { PolicyActions } from "./action.js";

/** Normalizes common API shapes: raw array, or `{ policies|items|data, total }`. */
export function normalizePoliciesPayload(raw) {
  if (raw == null) return { items: [], total: 0 };
  if (Array.isArray(raw)) return { items: raw, total: raw.length };
  const items = raw.policies ?? raw.items ?? raw.data ?? raw.results;
  if (Array.isArray(items)) {
    return {
      items,
      total: raw.total ?? raw.count ?? items.length,
      page: raw.page,
      limit: raw.limit,
    };
  }
  return { items: [], total: 0 };
}

export const initialState = {
  policies: null,
  policy: null,
  policiesLoading: false,
  bulkPolicies: null,
};

const defaultListQuery = {
  page: 1,
  limit: 50,
  sortBy: "createdAt",
  sortOrder: "desc",
  followUpRange: undefined,
  status: undefined,
};

export const PolicyState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  const listQueryRef = useRef({ ...defaultListQuery });
  const inFlightRef = useRef(new Map());

  const getPolicies = useCallback(
    async (page, limit, sortBy, sortOrder, followUpRange, status) => {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sortBy: String(sortBy),
        sortOrder: String(sortOrder),
      });
      if (followUpRange) {
        query.set("followUpRange", followUpRange);
      }
      if (status) {
        query.set("status", status);
      }
      const queryString = query.toString();
      const key = `GET /policies?${queryString}`;
      const existing = inFlightRef.current.get(key);
      if (existing) return existing;

      listQueryRef.current = {
        page,
        limit,
        sortBy,
        sortOrder,
        followUpRange,
        status,
      };
      dispatch({ type: PolicyActions.SET_POLICIES_LOADING, payload: true });
      const request = (async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${API_URLS.Policies}/policies?${queryString}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          const normalized = normalizePoliciesPayload(response.data?.data);
          dispatch({
            type: PolicyActions.GET_POLICIES,
            payload: normalized,
          });
          return normalized;
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          dispatch({ type: PolicyActions.SET_POLICIES_LOADING, payload: false });
          inFlightRef.current.delete(key);
        }
      })();

      inFlightRef.current.set(key, request);
      return request;
    },
    [],
  );

  /** Re-fetches the list once using the last successful list query (no loop). */
  const refreshPoliciesList = useCallback(async () => {
    const q = listQueryRef.current;
    return getPolicies(
      q.page,
      q.limit,
      q.sortBy,
      q.sortOrder,
      q.followUpRange,
      q.status,
    );
  }, [getPolicies]);

  const getPolicyById = useCallback(async (policy_id) => {
    const key = `GET /policies/${policy_id}`;
    const existing = inFlightRef.current.get(key);
    if (existing) return existing;

    const request = (async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_URLS.Policies}/policies/${policy_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = response.data?.data;
        dispatch({
          type: PolicyActions.GET_POLICY_BY_ID,
          payload: data,
        });
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        inFlightRef.current.delete(key);
      }
    })();

    inFlightRef.current.set(key, request);
    return request;
  }, []);

  const createPolicy = useCallback(async (policyData) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URLS.Policies}/policies`,
      policyData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response;
  }, []);

  const updatePolicy = useCallback(async (policy_id, policyData) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_URLS.Policies}/policies/${policy_id}`,
      policyData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response?.data ?? response;
  }, []);

  const deletePolicy = useCallback(
    async (policy_id) => {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_URLS.Policies}/policies/${policy_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      await refreshPoliciesList();
      return response?.data ?? response;
    },
    [refreshPoliciesList],
  );

  return {
    ...state,
    getPolicies,
    refreshPoliciesList,
    getPolicyById,
    createPolicy,
    updatePolicy,
    deletePolicy,
  };
};
