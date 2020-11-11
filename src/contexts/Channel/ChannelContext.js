import createDataContext from '../createDataContext';
import { 
    SELECT_MEMBER,
    SET_INITIAL_LIST_CHANNEL, 
    DELETE_CHANNEL, 
    CREATE_CHANNEL,
    SET_INFOR_CHANNEL,
    HIDE_CHAT_CONTENT,
    EDIT_CHANNEL
} from './ChannelActions';
import ChannelReducer from './ChannelReducer';

const selectMember = dispatch => data => {
    dispatch({ type: SELECT_MEMBER, payload: data })
}

const setInitialListChannel = dispatch => data => {
    dispatch({ type: SET_INITIAL_LIST_CHANNEL, payload: data })
}

const createChannel = dispatch => data => {
    dispatch({ type: CREATE_CHANNEL, payload: data })
}
const editChannel = dispatch => data => {
    dispatch({ type: EDIT_CHANNEL, payload: data })
}

const deleteChannel = dispatch => channelId => {
    dispatch({ type: DELETE_CHANNEL, payload: channelId })
}

const setInformation = dispatch => data => {
    dispatch({ type: SET_INFOR_CHANNEL, payload: data })
}

const hideChatContent = dispatch => () => {
    dispatch({ type: HIDE_CHAT_CONTENT })
}
export const { Provider, Context, actions } = createDataContext(
    ChannelReducer,
    { selectMember, editChannel, setInitialListChannel, deleteChannel, createChannel, setInformation, hideChatContent },
    { listMember: [], listChannel: [], channelData: { isActive: false, infor: {}, members: [], listChat: {} } }
);