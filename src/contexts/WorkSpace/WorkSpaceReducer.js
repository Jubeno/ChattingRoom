import { CREATE_AVATAR, CREATE_NAME, CREATE_PURPOSE, GO_NEXT_STEP, GO_PREV_STEP, RESET_AVATAR } from './WorkSpaceActions';

const WorkSpaceReducer = (state, action) => {
    switch (action.type) {
        case CREATE_AVATAR:
            return { ...state, avatar: action.payload };
        case RESET_AVATAR:
            return { ...state, avatar: null };
        case CREATE_NAME:
            return { ...state, name: action.payload };
        case CREATE_PURPOSE:
            return { ...state, purpose: action.payload };
        case GO_NEXT_STEP:
            return { ...state, currentStep: state.currentStep + 1 };
        case GO_PREV_STEP:
            return { ...state, currentStep: state.currentStep - 1 };
        default:
            return state;
    }
};

export default WorkSpaceReducer;