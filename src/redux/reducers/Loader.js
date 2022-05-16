import * as types from '../types';

const initialState = {
  show: false,
  categoryLoader: false,
  checkValue: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.LOADER:
      return {
        ...state,
        show: action.payLoad,
      };
    case types.CATEGORY_LOADER:
      return {
        ...state,
        categoryLoader: action.payLoad,
      };

    default:
      return state;
  }
};
