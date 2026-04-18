const policyHandler = {
  GET_POLICIES: (state, action) => ({
    ...state,
    policies: action.payload,
  }),
  GET_POLICY_BY_ID: (state, action) => ({
    ...state,
    policy: action.payload,
  }),
  SET_POLICIES_LOADING: (state, action) => ({
    ...state,
    policiesLoading: action.payload,
  }),
  ADD_POLICY: (state, action) => ({
    ...state,
    policies: action.payload,
  }),
  UPDATE_POLICY: (state, action) => ({
    ...state,
    policies: action.payload,
  }),
  DELETE_POLICY: (state, action) => ({
    ...state,
    policies: action.payload,
  }),
};

const Reducer = (state, action) => {
  const handler = policyHandler[action.type];
  return handler ? handler(state, action) : state;
};

export default Reducer;
