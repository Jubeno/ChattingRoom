import { CREATE_AVATAR, CREATE_NAME, CREATE_PURPOSE } from './WorkSpaceActions';

const WorkSpaceReducer = (state, action) => {
    switch (action.type) {
        case CREATE_AVATAR:
            return { ...state, avatar: action.payload };
        case CREATE_NAME:
            return { ...state, name: action.payload };
        case CREATE_PURPOSE:
            return { ...state, purpose: action.payload };
        default:
            return state;
    }
};

export default WorkSpaceReducer;