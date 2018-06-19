// @flow
export const getUser = (state: Object) => state.user.model;
export const getUserID = (state: Object) => getUser(state).id;
export const getUserName = (state: Object) => getUser(state).name;
