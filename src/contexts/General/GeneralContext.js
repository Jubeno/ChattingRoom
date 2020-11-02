import createDataContext from '../createDataContext';
import { SET_DATA_WORKSPACE, CREATE_LIST_DIRECT_MESSAGE, CREATE_INITIAL_DIRECT_MESSAGE, DELETE_DIRECT_MESSAGE } from './GeneralActions';
import GeneralReducer from './GeneralReducer';

const setDataWorkspace = dispatch => data => {
    dispatch({ type: SET_DATA_WORKSPACE, payload: data })
}

const createListDirectMessage = dispatch => data => {
    dispatch({ type: CREATE_LIST_DIRECT_MESSAGE, payload: data })
}

const createInitialListDirectMessage = dispatch => data => {
    dispatch({ type: CREATE_INITIAL_DIRECT_MESSAGE, payload: data })
}

const deleteConversation = dispatch => conversationId => {
    dispatch({ type: DELETE_DIRECT_MESSAGE, payload: conversationId })
}

export const { Provider, Context, actions } = createDataContext(
    GeneralReducer,
    { setDataWorkspace, createListDirectMessage, createInitialListDirectMessage, deleteConversation },
    { dataWorkspace: {}, listDirectMessage: [], initialListDirectMessage: [] }
);