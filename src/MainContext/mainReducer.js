import authReducer, { authState } from './authReducer';
import workspaceReducer, { workspaceState } from './workspaceReducer';

export const initialState = {
    authState,
    workspaceState
};

export const mainReducer = ({ auth, workspace }, action) => ({
    authState: authReducer(auth, action),
    workspaceState: workspaceReducer(workspace, action)
});