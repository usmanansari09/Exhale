const set_data = (data) => {
  return (dispatch) => {
    dispatch({ type: 'SETDATA', payload: data });
  };
};
const get_data = (data, history, key) => {
  return (dispatch) => {
    dispatch({ type: 'GETLIST', payload: data });
    //  history.push('/dashboard/detail')
  };
};
export { get_data, set_data };
