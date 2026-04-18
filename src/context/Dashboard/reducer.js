import { DashboardActions } from "./action.js";

const Reducer = (state, action) => {
  switch (action.type) {
    case DashboardActions.GET_DASHBOARD:
      return {
        ...state,
        dashboard: action.payload?.data ?? null,
      };

    case DashboardActions.GET_DASHBOARD_BY_ID:
    case DashboardActions.ADD_DASHBOARD:
    case DashboardActions.UPDATE_DASHBOARD:
    case DashboardActions.DELETE_DASHBOARD:
      return state;

    default:
      return state;
  }
};

export default Reducer;
