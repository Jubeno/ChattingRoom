import createDataContext from '../createDataContext';
import { SELECT_MEMBER } from './ChannelActions';
import ChannelReducer from './ChannelReducer';

const selectMember = dispatch => data => {
    dispatch({ type: SELECT_MEMBER, payload: data })
}

export const { Provider, Context, actions } = createDataContext(
    ChannelReducer,
    { selectMember },
    { listMember: [] }
);