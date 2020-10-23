import { CREATE_AVATAR, RESET_AVATAR } from './UserProfileActions';

const WorkSpaceReducer = (state, action) => {
    switch (action.type) {
        case CREATE_AVATAR:
            return { ...state, avatar: action.payload };
        case RESET_AVATAR:
            return { ...state, avatar: null };
        default:
            return state;
    }
};

export default WorkSpaceReducer;