import createDataContext from '../createDataContext';
import { CREATE_AVATAR, CREATE_NAME, CREATE_PURPOSE } from './WorkSpaceActions';
import WorkSpaceReducer from './WorkSpaceReducer';

const createAvatar = dispatch => avatar => {
    dispatch({ type: CREATE_AVATAR, payload: avatar })
}
const createName = dispatch => name => {
    dispatch({ type: CREATE_NAME, payload: name })
}
const createPurpose = dispatch => purpose => {
    dispatch({ type: CREATE_PURPOSE, payload: purpose })
}

export const { Provider, Context, actions } = createDataContext(
    WorkSpaceReducer,
    { createAvatar, createName, createPurpose },
    { avatar: null, name: null, purpose: null }
);