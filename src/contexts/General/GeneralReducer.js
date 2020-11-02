import { CREATE_LIST_DIRECT_MESSAGE, SET_DATA_WORKSPACE, CREATE_INITIAL_DIRECT_MESSAGE, DELETE_DIRECT_MESSAGE } from './GeneralActions';

const GeneralReducer = (state, action) => {
    switch (action.type) {
        case SET_DATA_WORKSPACE:
            return { ...state, dataWorkspace: action.payload };
        case CREATE_LIST_DIRECT_MESSAGE:
            return { ...state, listDirectMessage: state.listDirectMessage.concat(action.payload) };
        case CREATE_INITIAL_DIRECT_MESSAGE:
            return { ...state, listDirectMessage: state.initialListDirectMessage.concat(action.payload) };
        case DELETE_DIRECT_MESSAGE:
            const deletedList = state.listDirectMessage.filter(item => item.conversationID !== action.payload);
            return { ...state, listDirectMessage: deletedList };
        default:
            return state;
    }
};

export default GeneralReducer;