import { PolicyState } from "./policy/state";
import { DashboardState } from "./Dashboard/state";

export const useCombineState = () => {
  const Policy = PolicyState();
  const Dashboard = DashboardState();

  return {
    ...Policy,
    ...Dashboard,
  };
};
