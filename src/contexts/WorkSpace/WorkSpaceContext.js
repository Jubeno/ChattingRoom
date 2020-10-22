import createDataContext from '../createDataContext';
import { CREATE_AVATAR, CREATE_NAME, CREATE_PURPOSE, GO_NEXT_STEP, GO_PREV_STEP, RESET_AVATAR } from './WorkSpaceActions';
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

const resetAvatar = dispatch => () => {
    dispatch({ type: RESET_AVATAR });
}

const goToNextStep = dispatch => () => {
    dispatch({ type: GO_NEXT_STEP })
}

const goToPrevStep = dispatch => () => {
    dispatch({ type: GO_PREV_STEP })
}

export const { Provider, Context, actions } = createDataContext(
    WorkSpaceReducer,
    { createAvatar, createName, createPurpose, goToNextStep, goToPrevStep, resetAvatar },
    { avatar: null, name: null, purpose: null, currentStep: 1 }
);