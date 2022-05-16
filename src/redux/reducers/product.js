const INITIAL_STATE = {
  listData: [],
  app_trigger: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'GETLIST':
      return {
        ...state,
        listData: action.payload,
      };
    case 'SETDATA':
      return {
        ...state,
        app_trigger: action.payload,
      };

    default:
      return state;
  }
};
