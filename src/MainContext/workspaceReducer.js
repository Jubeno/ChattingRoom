export const workspaceState = {
    keyWorkSpace: null
}
const workspaceReducer = (state = workspaceState, action) => {
    switch (action.type) {
      case 'setKeyWorkSpace':
        return { ...state, keyWorkSpace: action.payload };
      default:
        return state;
    }
};
export default workspaceReducer;