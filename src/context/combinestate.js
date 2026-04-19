import { PolicyState } from "./policy/state";
import { DashboardState } from "./Dashboard/state";
import { AuthState } from "./auth/state";

export const useCombineState = () => {
  const Policy = PolicyState();
  const Dashboard = DashboardState();
  const Auth = AuthState();
  return {
    ...Policy,
    ...Dashboard,
    ...Auth,
  };
};
