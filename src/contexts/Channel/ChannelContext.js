import createDataContext from '../createDataContext';
import { 
    SELECT_MEMBER,
    SET_INITIAL_LIST_CHANNEL, 
    DELETE_CHANNEL, 
    CREATE_CHANNEL,
    SET_INFOR_CHANNEL
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

const deleteChannel = dispatch => channelId => {
    dispatch({ type: DELETE_CHANNEL, payload: channelId })
}

const setInformationChannel = dispatch => data => {
    dispatch({ type: SET_INFOR_CHANNEL, payload: data })
}
export const { Provider, Context, actions } = createDataContext(
    ChannelReducer,
    { selectMember, setInitialListChannel, deleteChannel, createChannel, setInformationChannel },
    { listMember: [], listChannel: [], channelData: { isActive: false, infor: null, members: null, listChat: null } }
);