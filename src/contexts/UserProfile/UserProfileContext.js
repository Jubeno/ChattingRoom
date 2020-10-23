import createDataContext from '../createDataContext';
import { CREATE_AVATAR, RESET_AVATAR } from './UserProfileActions';
import UserProfileReducer from './UserProfileReducer';

const createAvatar = dispatch => avatar => {
    dispatch({ type: CREATE_AVATAR, payload: avatar })
}

const resetAvatar = dispatch => () => {
    dispatch({ type: RESET_AVATAR });
}

export const { Provider, Context, actions } = createDataContext(
    UserProfileReducer,
    { createAvatar, resetAvatar },
    { avatar: null }
);