export function pickTokenAndUser(payload) {
  const inner = payload?.data ?? payload;
  const token =
    inner?.token ??
    inner?.accessToken ??
    payload?.token ??
    payload?.accessToken ??
    null;
  const user = inner?.user ?? payload?.user ?? null;
  return { token, user };
}

const authHandler = {
  LOGIN: (state, action) => {
    const { token, user } = pickTokenAndUser(action.payload);
    return { ...state, token, user };
  },
  REGISTER: (state, action) => {
    const { token, user } = pickTokenAndUser(action.payload);
    return { ...state, token, user };
  },
  LOGOUT: () => ({
    user: null,
    token: null,
  }),
};

const Reducer = (state, action) => {
  const handler = authHandler[action.type];
  return handler ? handler(state, action) : state;
};

export default Reducer;
